import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldAlert, 
  AlertOctagon, 
  Phone, 
  MapPin, 
  Pill, 
  CalendarDays, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Bell, 
  User, 
  HeartHandshake, 
  Activity,
  FileText,
  Sparkles,
  Info
} from 'lucide-react';
import { Senior, AppMode } from '../types';
import { soundFx, speakText } from '../utils/audio';

interface CaregiverDashboardProps {
  seniors: Senior[];
  activeSenior: Senior;
  onSelectSenior: (seniorId: string) => void;
  onOpenAddSenior: () => void;
  onOpenSeniorProfile: (senior: Senior) => void;
  onTriggerEmergencyForSenior: (senior: Senior) => void;
  activeEmergencySenior?: Senior | null;
  setAppMode: (mode: AppMode) => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  seniors,
  activeSenior,
  onSelectSenior,
  onOpenAddSenior,
  onOpenSeniorProfile,
  onTriggerEmergencyForSenior,
  activeEmergencySenior,
  setAppMode,
}) => {
  const [selectedCaregiverName] = useState('Ana Cláudia (Filha & Administradora)');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* 🚨 CRITICAL EMERGENCY BANNER IF TRIGGERED */}
      {activeEmergencySenior && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-red-300 animate-pulse space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white text-red-600 flex items-center justify-center font-black shadow-lg">
                <AlertOctagon className="w-8 h-8 fill-red-600 text-white animate-spin" />
              </div>

              <div>
                <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  🚨 ALERTA MÁXIMO DE EMERGÊNCIA
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-1">
                  {activeEmergencySenior.name} acionou SOCORRO!
                </h2>
                <p className="text-sm sm:text-base text-red-100 font-bold">
                  Horário: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · Localização GPS Ativa
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-4 text-xs sm:text-sm font-bold text-red-100 space-y-1">
            <div>📍 <strong>Endereço:</strong> {activeEmergencySenior.address}</div>
            <div>🩸 <strong>Ficha Médica:</strong> Tipo {activeEmergencySenior.bloodType} · Alergia: {activeEmergencySenior.allergies.join(', ') || 'Nenhuma'}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => onTriggerEmergencyForSenior(activeEmergencySenior)}
              className="bg-white text-red-700 font-black py-3 px-4 rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Ver Localização & Ficha</span>
            </button>

            <a
              href={`tel:${activeEmergencySenior.phone.replace(/\D/g, '')}`}
              className="bg-red-950/80 hover:bg-black text-white font-black py-3 px-4 rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Ligar para {activeEmergencySenior.nickname}</span>
            </a>

            <a
              href="tel:192"
              className="bg-red-900 hover:bg-red-950 text-white font-black py-3 px-4 rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 transition-colors border border-red-400"
            >
              <span>Ligar SAMU 192</span>
            </a>
          </div>
        </div>
      )}

      {/* Caregiver Welcome Banner */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-black uppercase text-sky-200">
              <HeartHandshake className="w-4 h-4 text-sky-300" />
              <span>Painel de Gestão Familiar & Cuidado</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight pt-1">
              Olá, {selectedCaregiverName.split(' ')[0]}!
            </h1>
            
            <p className="text-slate-300 font-medium text-base">
              Acompanhamento centralizado e segurança de todos os idosos sob seus cuidados.
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenAddSenior();
            }}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-5 py-3 rounded-2xl text-sm shadow-lg flex items-center gap-2 transition-all hover:scale-105"
          >
            <UserPlus className="w-5 h-5" />
            <span>+ Adicionar Idoso</span>
          </button>
        </div>

        {/* Overview Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15 text-xs font-black">
          <div className="bg-white/10 p-3 rounded-2xl">
            <span className="text-slate-300 block text-[10px] uppercase">Idosos Monitorados</span>
            <strong className="text-xl text-white font-black">{seniors.length} cadastrados</strong>
          </div>

          <div className="bg-white/10 p-3 rounded-2xl">
            <span className="text-slate-300 block text-[10px] uppercase">Medicamentos Hoje</span>
            <strong className="text-xl text-emerald-400 font-black">
              {seniors.flatMap(s => s.medications).filter(m => m.takenToday).length} tomados
            </strong>
          </div>

          <div className="bg-white/10 p-3 rounded-2xl">
            <span className="text-slate-300 block text-[10px] uppercase">Pendências</span>
            <strong className="text-xl text-amber-300 font-black">
              {seniors.flatMap(s => s.medications).filter(m => !m.takenToday).length} remédios
            </strong>
          </div>

          <div className="bg-white/10 p-3 rounded-2xl">
            <span className="text-slate-300 block text-[10px] uppercase">Próximas Consultas</span>
            <strong className="text-xl text-sky-300 font-black">
              {seniors.flatMap(s => s.appointments).length} marcadas
            </strong>
          </div>
        </div>
      </div>

      {/* SECTION: MEUS IDOSOS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-700" />
            <h2 className="text-2xl font-black text-slate-900">
              Meus Idosos ({seniors.length})
            </h2>
          </div>

          <span className="text-xs font-bold text-slate-500">
            Clique no cartão para entrar no Modo Idoso ou gerenciar perfil
          </span>
        </div>

        {/* Seniors Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {seniors.map((s) => {
            const pendingMeds = s.medications.filter(m => !m.takenToday);
            const nextApt = s.appointments[0];
            const isSelected = s.id === activeSenior.id;

            return (
              <div
                key={s.id}
                className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-md hover:shadow-xl space-y-4 ${
                  isSelected ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-200 hover:border-sky-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={s.photoUrl}
                      alt={s.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-slate-900">
                          {s.nickname}
                        </h3>
                        <span className="text-xs font-bold text-slate-500">
                          ({s.age} anos)
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-500 truncate max-w-[200px]">
                        {s.name}
                      </div>

                      {/* Status indicator */}
                      <div className="mt-1">
                        {pendingMeds.length === 0 ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Tudo certo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> {pendingMeds.length} Medicamento pendente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onOpenSeniorProfile(s);
                    }}
                    className="text-xs font-black text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    Ver Perfil
                  </button>
                </div>

                {/* Quick Info Grid */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs font-bold text-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5 text-emerald-600" /> Próximo Medicamento:
                    </span>
                    <strong className="text-slate-900">
                      {pendingMeds[0] ? `${pendingMeds[0].name} (${pendingMeds[0].time})` : 'Todos tomados'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5 text-sky-600" /> Próxima Consulta:
                    </span>
                    <strong className="text-slate-900">
                      {nextApt ? `${nextApt.specialty} (${nextApt.date.split(' ')[0]} ${nextApt.date.split(' ')[2]})` : 'Nenhuma marcada'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-purple-600" /> Tipo Sanguíneo:
                    </span>
                    <strong className="text-slate-900">{s.bloodType}</strong>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onSelectSenior(s.id);
                      setAppMode('senior');
                      speakText(`Abrindo o aplicativo no Modo Idoso para ${s.nickname}`);
                    }}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-black py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Acessar Modo Idoso</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onTriggerEmergencyForSenior(s);
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-black py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Testar SOS Idoso</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Caregiver Communication & Responsibilities Box */}
      <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center flex-shrink-0 font-black shadow-md">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-sky-950">
            Acompanhamento em Tempo Real para Familiares
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-sky-900 leading-relaxed">
            Como familiar responsável, você recebe notificações instantâneas no seu celular sempre que um idoso marcar um remédio como tomado, esquecer um horário ou acionar o botão de socorro. Você também pode cadastrar médicos e alterar os horários a qualquer momento.
          </p>
        </div>
      </div>

    </div>
  );
};
