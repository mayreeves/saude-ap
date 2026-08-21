import React from 'react';
import { 
  CalendarDays, 
  Pill, 
  FileText, 
  Users, 
  Mic, 
  AlertOctagon, 
  Volume2, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Senior, SeniorScreen } from '../types';
import { soundFx, speakText } from '../utils/audio';

interface SeniorHomeProps {
  senior: Senior;
  setScreen: (screen: SeniorScreen) => void;
  onTriggerEmergency: () => void;
  onOpenVoiceAssistant: () => void;
  voiceEnabled: boolean;
  onOpenProfile: () => void;
}

export const SeniorHome: React.FC<SeniorHomeProps> = ({
  senior,
  setScreen,
  onTriggerEmergency,
  onOpenVoiceAssistant,
  voiceEnabled,
  onOpenProfile
}) => {
  // Find pending meds
  const pendingMeds = senior.medications.filter(m => !m.takenToday);
  const nextMed = pendingMeds[0];
  const nextAppointment = senior.appointments[0];

  const handleSpeech = (text: string) => {
    soundFx.playClick();
    speakText(text);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      
      {/* Friendly Senior Greeting Card */}
      <div className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-500/15 relative overflow-hidden">
        {/* Subtle decorative curves */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-36 h-36 bg-sky-300/20 rounded-full blur-lg pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-sky-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cuidar+ Saúde Segura</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight pt-1">
              Olá, {senior.nickname}!
            </h1>
            
            <p className="text-lg sm:text-xl text-sky-100 font-semibold leading-snug">
              Como podemos ajudar você hoje?
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={onOpenProfile}
              className="relative group focus:outline-none focus:ring-4 focus:ring-amber-300 rounded-full"
              title="Ver meu perfil completo de saúde"
            >
              <img 
                src={senior.photoUrl} 
                alt={senior.name} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </button>
            
            <button
              onClick={() => handleSpeech(`Olá ${senior.nickname}! Como podemos ajudar você hoje? Toque em um dos botões grandes na tela para ver suas consultas, medicamentos ou chamar socorro.`)}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-xl text-xs font-extrabold transition-colors"
              title="Ouvir instruções por voz"
            >
              <Volume2 className="w-4 h-4" />
              <span>Ouvir</span>
            </button>
          </div>
        </div>

        {/* Quick status bar */}
        <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm font-bold text-sky-100">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-sky-200" />
            <span>Hoje: {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          <button 
            onClick={onOpenProfile}
            className="hover:underline flex items-center gap-1 text-white font-black"
          >
            <span>Meu Perfil de Saúde</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 🚨 THE BIG RED EMERGENCY BUTTON (SOCORRO) */}
      <div className="pt-1">
        <button
          onClick={() => {
            soundFx.vibrate([300, 100, 300]);
            onTriggerEmergency();
          }}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-red-500/40 border-4 border-red-400 active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-center focus:outline-none focus:ring-8 focus:ring-red-300"
          aria-label="Botão de emergência SOCORRO"
        >
          {/* Animated pulse rings */}
          <span className="absolute inset-0 rounded-3xl bg-red-400 opacity-25 animate-ping pointer-events-none" />
          
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white text-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <AlertOctagon className="w-10 h-10 sm:w-12 sm:h-12 fill-red-600 text-white animate-pulse" />
          </div>

          <div className="text-left flex-1">
            <div className="text-3xl sm:text-4xl font-black tracking-wider uppercase drop-shadow">
              🚨 SOCORRO
            </div>
            <p className="text-sm sm:text-base text-red-100 font-bold mt-0.5 leading-tight">
              Toque aqui ou diga "SOCORRO" para chamar ajuda urgente
            </p>
          </div>

          <ArrowRight className="w-8 h-8 text-red-200 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      {/* Pending Reminder Highlight Banner (if any med is pending) */}
      {nextMed ? (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-md flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow">
            <Pill className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                Lembrete de Remédio
              </span>
              <span className="text-xs font-black text-amber-800">
                Horário: {nextMed.time}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 mt-1">
              Hora de tomar: {nextMed.name}
            </h2>
            <p className="text-sm font-bold text-amber-800 mt-0.5">
              Dosagem: {nextMed.dosage} — {nextMed.frequency}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setScreen('medications');
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-black px-4 py-2 rounded-2xl text-sm shadow flex items-center gap-1.5 transition-colors"
              >
                <span>Ver Remédio e Marcar como Tomado</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-4 sm:p-5 flex items-center gap-3 text-emerald-900 font-bold text-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <span>Parabéns, {senior.nickname}! Todos os medicamentos de hoje estão em dia!</span>
        </div>
      )}

      {/* Main Feature Cards Grid (Large, Accessible, High Visual Contrast) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        
        {/* 🩺 Minhas Consultas */}
        <button
          onClick={() => {
            soundFx.playClick();
            setScreen('appointments');
            if (voiceEnabled) speakText(`Minhas consultas. Você tem ${senior.appointments.length} consulta agendada.`);
          }}
          className="group text-left p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-50 to-sky-100/80 border-2 border-sky-300 hover:border-sky-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between min-h-[160px] focus:outline-none focus:ring-4 focus:ring-sky-300"
        >
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <CalendarDays className="w-8 h-8" />
            </div>
            <span className="bg-sky-200 text-sky-900 text-xs font-black px-2.5 py-1 rounded-full">
              {senior.appointments.length} Agendada{senior.appointments.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🩺 Minhas Consultas</span>
            </h2>
            <p className="text-sm font-bold text-slate-600 mt-1 leading-snug">
              {nextAppointment ? `Próxima: ${nextAppointment.specialty} em ${nextAppointment.date.split(' ')[0]} ${nextAppointment.date.split(' ')[1]}` : 'Ver e agendar atendimentos médicos'}
            </p>
          </div>
        </button>

        {/* 💊 Meus Medicamentos */}
        <button
          onClick={() => {
            soundFx.playClick();
            setScreen('medications');
            if (voiceEnabled) speakText(`Meus medicamentos. Você tem ${senior.medications.length} remédios cadastrados.`);
          }}
          className="group text-left p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-100/80 border-2 border-emerald-300 hover:border-emerald-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between min-h-[160px] focus:outline-none focus:ring-4 focus:ring-emerald-300"
        >
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Pill className="w-8 h-8" />
            </div>
            <span className="bg-emerald-200 text-emerald-900 text-xs font-black px-2.5 py-1 rounded-full">
              {senior.medications.length} Remédios
            </span>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>💊 Meus Medicamentos</span>
            </h2>
            <p className="text-sm font-bold text-slate-600 mt-1 leading-snug">
              Horários, lembretes e botão "Tomei"
            </p>
          </div>
        </button>

        {/* 🧪 Meus Exames */}
        <button
          onClick={() => {
            soundFx.playClick();
            setScreen('exams');
            if (voiceEnabled) speakText(`Meus exames. Você tem ${senior.exams.length} resultados com explicação simples.`);
          }}
          className="group text-left p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-100/80 border-2 border-purple-300 hover:border-purple-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between min-h-[160px] focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8" />
            </div>
            <span className="bg-purple-200 text-purple-900 text-xs font-black px-2.5 py-1 rounded-full">
              {senior.exams.length} Resultados
            </span>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🧪 Meus Exames</span>
            </h2>
            <p className="text-sm font-bold text-slate-600 mt-1 leading-snug">
              Resultados em linguagem simples e fácil
            </p>
          </div>
        </button>

        {/* 👨👩👧 Minha Família */}
        <button
          onClick={() => {
            soundFx.playClick();
            setScreen('family');
            if (voiceEnabled) speakText(`Minha família. Você tem ${senior.caregivers.length} cuidadores e familiares autorizados.`);
          }}
          className="group text-left p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-100/80 border-2 border-amber-300 hover:border-amber-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between min-h-[160px] focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>
            <span className="bg-amber-200 text-amber-900 text-xs font-black px-2.5 py-1 rounded-full">
              {senior.caregivers.length} Contatos
            </span>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>👨👩👧 Minha Família</span>
            </h2>
            <p className="text-sm font-bold text-slate-600 mt-1 leading-snug">
              Ligar rápido para filhos e cuidadores
            </p>
          </div>
        </button>
      </div>

      {/* 🎙️ Modo de Voz Special Banner */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-black">
            <Mic className="w-3.5 h-3.5" />
            <span>Comando por Voz Inteligente</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            🎙️ Falar com o Cuidar+
          </h2>
          <p className="text-sm sm:text-base text-teal-100 font-bold">
            Fale o que você precisa: "Meus remédios", "Minhas consultas" ou "SOCORRO".
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onOpenVoiceAssistant();
          }}
          className="bg-white hover:bg-teal-50 text-teal-800 font-black px-5 py-3.5 rounded-2xl text-base shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Mic className="w-5 h-5 text-teal-600" />
          <span>Falar Agora</span>
        </button>
      </div>

    </div>
  );
};
