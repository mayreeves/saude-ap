import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  X, 
  Check, 
  Clock, 
  Volume2, 
  Heart, 
  AlertTriangle, 
  Send, 
  Ambulance, 
  Radio,
  FileHeart,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Senior } from '../types';
import { soundFx, speakText } from '../utils/audio';

interface EmergencyModalProps {
  senior: Senior;
  isOpen: boolean;
  onClose: () => void;
  triggerType?: 'manual' | 'voice';
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  senior,
  isOpen,
  onClose,
  triggerType = 'manual'
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [callTime, setCallTime] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'status' | 'ficha' | 'notificacoes'>('status');

  // Simulated GPS location
  const [gpsLocation, setGpsLocation] = useState({
    address: senior.address || 'Rua das Flores, 142, Apto 41 — São Paulo, SP',
    coords: '-23.561684, -46.655981',
    accuracy: 'Alta precisão (5 metros)',
  });

  // Start siren & countdown on open
  useEffect(() => {
    if (isOpen) {
      setIsConfirmed(false);
      setCountdown(5);
      setElapsedSeconds(0);
      setCallTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      soundFx.startEmergencySiren();
      soundFx.vibrate([400, 200, 400, 200, 600]);
      speakText('Atenção! Modo de emergência ativado. Avisando familiares e preparando chamado em cinco segundos.');

      // Try actual geolocation API if allowed
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setGpsLocation({
              address: senior.address,
              coords: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`,
              accuracy: `GPS Real do Dispositivo (±${Math.round(pos.coords.accuracy)}m)`,
            });
          },
          () => {
            // fallback stays
          },
          { timeout: 3000 }
        );
      }
    } else {
      soundFx.stopEmergencySiren();
    }

    return () => {
      soundFx.stopEmergencySiren();
    };
  }, [isOpen]);

  // Countdown handler
  useEffect(() => {
    if (!isOpen || isConfirmed) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
        soundFx.vibrate(150);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsConfirmed(true);
      soundFx.stopEmergencySiren();
      speakText(`Emergência confirmada para ${senior.nickname}. Alertas enviados para os filhos Ana e Carlos e para a cuidadora Fernanda. Protocolo de socorro preparado.`);
    }
  }, [countdown, isOpen, isConfirmed, senior]);

  // Live timer after confirmed
  useEffect(() => {
    if (!isConfirmed) return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isConfirmed]);

  const handleCancel = () => {
    soundFx.playClick();
    soundFx.stopEmergencySiren();
    speakText('Chamado de emergência cancelado.');
    onClose();
  };

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border-4 border-red-500 overflow-hidden relative my-auto">
        
        {/* Header Alert Strip */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 sm:p-6 text-center relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 bg-black/25 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Radio className="w-4 h-4 animate-pulse text-yellow-300" />
              <span>Conectiva Saúde SOS Integrado</span>
            </div>

            <button
              onClick={handleCancel}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              title="Fechar tela de emergência"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-3 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white text-red-600 flex items-center justify-center shadow-lg animate-bounce">
              <AlertOctagon className="w-10 h-10 fill-red-600 text-white" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight uppercase">
              🚨 EMERGÊNCIA ACIONADA!
            </h1>

            <p className="text-sm sm:text-base text-red-100 font-bold max-w-md mt-1">
              Chamado registrado para: <span className="underline">{senior.name}</span> ({senior.age} anos)
            </p>
          </div>
        </div>

        {/* 5-Second Countdown Stage (Safety Abort) */}
        {!isConfirmed ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                Cancelamento de Segurança
              </span>
              <p className="text-base text-slate-700 font-bold">
                O alarme e os alertas para os familiares serão disparados em:
              </p>
            </div>

            {/* Huge Number */}
            <div className="relative inline-flex items-center justify-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-8 border-red-500 bg-red-50 text-red-600 flex items-center justify-center text-5xl sm:text-6xl font-black shadow-inner animate-pulse">
                {countdown}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleCancel}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-6 rounded-2xl text-lg sm:text-xl shadow-lg border-2 border-slate-700 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-6 h-6 text-red-400" />
                <span>CANCELAR (Foi sem querer)</span>
              </button>

              <button
                onClick={() => {
                  setCountdown(0);
                  setIsConfirmed(true);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 px-6 rounded-2xl text-base shadow-md transition-colors"
              >
                Enviar Agora Sem Esperar
              </button>
            </div>
          </div>
        ) : (
          /* Active Emergency State */
          <div className="p-4 sm:p-6 space-y-5">
            
            {/* Real-time Status Card */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">
                  <Clock className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase text-red-700 tracking-wider">
                    Horário do Chamado: {callTime}
                  </div>
                  <div className="text-lg font-black text-red-950">
                    Tempo Decorrido: {formatElapsed(elapsedSeconds)}
                  </div>
                </div>
              </div>

              <span className="bg-red-200 text-red-900 text-xs font-black px-3 py-1 rounded-full uppercase">
                Ativo
              </span>
            </div>

            {/* Navigation Tabs in Emergency View */}
            <div className="flex border-b border-slate-200 text-xs sm:text-sm font-black text-slate-500">
              <button
                onClick={() => setActiveTab('status')}
                className={`flex-1 py-2.5 border-b-2 transition-colors ${
                  activeTab === 'status' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
                }`}
              >
                1. Status & Ações
              </button>
              <button
                onClick={() => setActiveTab('ficha')}
                className={`flex-1 py-2.5 border-b-2 transition-colors ${
                  activeTab === 'ficha' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
                }`}
              >
                2. Ficha Médica Vital
              </button>
              <button
                onClick={() => setActiveTab('notificacoes')}
                className={`flex-1 py-2.5 border-b-2 transition-colors ${
                  activeTab === 'notificacoes' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-slate-900'
                }`}
              >
                3. Alertas Familiares
              </button>
            </div>

            {/* Tab 1: Status & Actions */}
            {activeTab === 'status' && (
              <div className="space-y-4">
                
                {/* Protocol Checklist */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    Andamento do Atendimento de Emergência
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black">
                        ✓
                      </div>
                      <div className="flex-1 text-xs sm:text-sm font-bold text-slate-800">
                        Alerta e Localização GPS transmitidos aos servidores
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black">
                        ✓
                      </div>
                      <div className="flex-1 text-xs sm:text-sm font-bold text-slate-800">
                        {senior.caregivers.length} Familiares/Cuidadores notificados via SMS/WhatsApp
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black animate-pulse">
                        !
                      </div>
                      <div className="flex-1 text-xs sm:text-sm font-bold text-amber-900">
                        Triagem SAMU 192 pronta para confirmação de despacho
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Box */}
                <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black uppercase text-sky-800">
                      Localização do Idoso
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">
                      {gpsLocation.address}
                    </div>
                    <div className="text-xs text-slate-500 font-bold mt-1">
                      Coordenadas: {gpsLocation.coords} ({gpsLocation.accuracy})
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <a
                    href="tel:192"
                    onClick={() => speakText('Discando para o SAMU 192')}
                    className="bg-red-600 hover:bg-red-700 text-white font-black py-3.5 px-4 rounded-2xl text-center shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <Ambulance className="w-5 h-5" />
                    <span>Ligar SAMU (192)</span>
                  </a>

                  <a
                    href={`tel:${senior.caregivers[0]?.phone || '190'}`}
                    onClick={() => speakText(`Ligando para ${senior.caregivers[0]?.name || 'responsável'}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 px-4 rounded-2xl text-center shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Ligar para {senior.caregivers[0]?.name.split(' ')[0] || 'Família'}</span>
                  </a>
                </div>

              </div>
            )}

            {/* Tab 2: Ficha Médica Vital */}
            {activeTab === 'ficha' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 text-red-600 font-black text-sm uppercase">
                  <FileHeart className="w-5 h-5" />
                  <span>Informações Médicas de Resgate</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Tipo Sanguíneo</span>
                    <strong className="text-base text-red-600 font-black">{senior.bloodType}</strong>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Idade</span>
                    <strong className="text-base text-slate-800 font-black">{senior.age} anos</strong>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Alergias Conhecidas</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {senior.allergies.map((alg, i) => (
                      <span key={i} className="bg-red-100 text-red-800 text-xs font-black px-2 py-0.5 rounded-md">
                        {alg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Condições de Saúde</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {senior.medicalConditions.map((cond, i) => (
                      <span key={i} className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-md">
                        {cond}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Medicamentos em Uso Contínuo</span>
                  <div className="text-xs font-bold text-slate-700 mt-1 space-y-1">
                    {senior.medications.map((m) => (
                      <div key={m.id}>• {m.name} ({m.dosage})</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Alertas Familiares */}
            {activeTab === 'notificacoes' && (
              <div className="space-y-3">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  Responsáveis Notificados Automaticamente
                </div>

                <div className="space-y-2">
                  {senior.caregivers.map((cg) => (
                    <div key={cg.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={cg.avatarUrl} alt={cg.name} className="w-10 h-10 rounded-full object-cover border" />
                        <div>
                          <div className="font-black text-sm text-slate-900">{cg.name}</div>
                          <div className="text-xs text-slate-500 font-bold">{cg.relationship} · {cg.phone}</div>
                        </div>
                      </div>

                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-1 rounded-full uppercase flex items-center gap-1">
                        <Check className="w-3 h-3" /> Enviado
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Academic Simulation Notice (Required for TCC) */}
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-950">
              <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-black text-amber-900">
                  Simulação Acadêmica para TCC (Maynara M.M.):
                </strong>
                <p className="font-medium text-amber-800 mt-0.5 leading-relaxed">
                  Em ambiente de produção, este módulo integra-se diretamente com a API do SAMU 192, envio de SMS em massa via Twilio/Zenvia e Webhook WhatsApp para cuidadores com a rota mais rápida.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCancel}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-black py-3.5 px-4 rounded-2xl text-sm transition-colors text-center"
            >
              Finalizar / Encerrar Atendimento de Emergência
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
