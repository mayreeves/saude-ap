import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  Volume2, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  FileText, 
  User, 
  Sparkles,
  Send
} from 'lucide-react';
import { Appointment, Senior } from '../types';
import { soundFx, speakText } from '../utils/audio';

interface TelemedicineModalProps {
  senior: Senior;
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
}

export const TelemedicineModal: React.FC<TelemedicineModalProps> = ({
  senior,
  appointment,
  isOpen,
  onClose,
}) => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<Array<{ sender: 'doctor' | 'senior'; text: string; time: string }>>([
    {
      sender: 'doctor',
      text: `Olá, ${senior.nickname}! Sou o ${appointment.doctor}. Como você está se sentindo hoje?`,
      time: 'Agora',
    },
  ]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setCallDuration(0);
    soundFx.playClick();
    speakText(`Conectando à teleconsulta com ${appointment.doctor}. Por favor, aguarde o médico.`);

    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, appointment, senior]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    soundFx.playClick();
    const newMsg = {
      sender: 'senior' as const,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulated doctor response
    setTimeout(() => {
      const responses = [
        `Entendido, ${senior.nickname}. Seus exames recentes estão ótimos e a pressão está sob controle. Continue tomando o medicamento no horário certo.`,
        `Perfeito! Anotei essa informação no seu prontuário digital. Vamos manter o acompanhamento no próximo mês.`,
        `Muito bom te ver tão bem! Recomendo manter uma caminhada leve e boa hidratação.`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [
        ...prev,
        {
          sender: 'doctor',
          text: randomResponse,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      speakText(randomResponse);
    }, 1800);
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    soundFx.playClick();
    speakText('Teleconsulta encerrada com sucesso. O resumo foi salvo no seu histórico.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl max-w-3xl w-full shadow-2xl border-2 border-slate-700 overflow-hidden flex flex-col text-white my-auto max-h-[90vh]">
        
        {/* Top Header */}
        <div className="bg-slate-800/90 px-6 py-4 border-b border-slate-700 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-sky-400 tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Telemedicina Conectiva Saúde (Consulta Segura)
              </div>
              <h2 className="text-lg font-black text-white">{appointment.doctor}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/70 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-black text-emerald-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Duração: {formatDuration(callDuration)}</span>
            </div>

            <button
              onClick={handleEndCall}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Encerrar</span>
            </button>
          </div>
        </div>

        {/* Video Area Grid */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-y-auto">
          
          {/* Main Video: Doctor */}
          <div className="md:col-span-2 relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 min-h-[280px] flex items-center justify-center group">
            <img 
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80" 
              alt="Médico"
              className="w-full h-full object-cover max-h-[360px]"
            />

            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>{appointment.doctor} ({appointment.specialty})</span>
            </div>

            {/* Picture-in-picture: Senior's Camera Preview */}
            <div className="absolute bottom-3 right-3 w-28 h-36 bg-slate-800 rounded-xl overflow-hidden border-2 border-white/40 shadow-xl">
              {camOn ? (
                <img 
                  src={senior.photoUrl} 
                  alt={senior.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500 text-xs font-bold text-center p-2">
                  Câmera desligada
                </div>
              )}
              <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold">
                Você ({senior.nickname})
              </div>
            </div>
          </div>

          {/* Right Panel: Doctor Chat & Medical Summary */}
          <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800 flex flex-col justify-between h-[360px]">
            <div className="text-xs font-black uppercase text-slate-400 pb-2 border-b border-slate-800 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span>Chat com o Médico</span>
            </div>

            {/* Message log */}
            <div className="flex-1 overflow-y-auto space-y-2 py-2 text-xs">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`p-2.5 rounded-xl ${
                    m.sender === 'doctor' 
                      ? 'bg-sky-950/80 border border-sky-800/60 text-sky-100' 
                      : 'bg-slate-800 border border-slate-700 text-white ml-4'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-black opacity-60 mb-0.5">
                    <span>{m.sender === 'doctor' ? appointment.doctor : senior.nickname}</span>
                    <span>{m.time}</span>
                  </div>
                  <div className="font-semibold leading-relaxed">{m.text}</div>
                </div>
              ))}
            </div>

            {/* Send input */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-800 flex gap-1.5">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Digite sua dúvida..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 p-2 rounded-xl text-white font-black"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Call Controls */}
        <div className="bg-slate-950/90 p-4 border-t border-slate-800 flex items-center justify-center gap-4">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`p-4 rounded-2xl border font-bold flex items-center gap-2 transition-all ${
              micOn ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-red-950 border-red-700 text-red-300'
            }`}
            title={micOn ? 'Desativar microfone' : 'Ativar microfone'}
          >
            {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            <span className="text-xs">{micOn ? 'Microfone Ligado' : 'Microfone Mudo'}</span>
          </button>

          <button
            onClick={() => setCamOn(!camOn)}
            className={`p-4 rounded-2xl border font-bold flex items-center gap-2 transition-all ${
              camOn ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-red-950 border-red-700 text-red-300'
            }`}
            title={camOn ? 'Desativar câmera' : 'Ativar câmera'}
          >
            {camOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            <span className="text-xs">{camOn ? 'Câmera Ligada' : 'Câmera Desligada'}</span>
          </button>

          <button
            onClick={handleEndCall}
            className="bg-red-600 hover:bg-red-700 text-white font-black p-4 rounded-2xl text-base shadow-lg flex items-center gap-2"
          >
            <PhoneOff className="w-6 h-6" />
            <span>Sair da Consulta</span>
          </button>
        </div>

      </div>
    </div>
  );
};
