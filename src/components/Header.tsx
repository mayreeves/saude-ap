import React, { useState } from 'react';
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Type, 
  Smartphone, 
  Laptop, 
  Users, 
  UserCheck, 
  GraduationCap, 
  ShieldAlert,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { AppMode, TextSize, Senior } from '../types';
import { soundFx, speakText } from '../utils/audio';

interface HeaderProps {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  seniors: Senior[];
  activeSenior: Senior;
  setActiveSeniorId: (id: string) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (val: boolean) => void;
  phoneFrameMode: boolean;
  setPhoneFrameMode: (val: boolean) => void;
  onTriggerEmergency: () => void;
  onOpenVoiceAssistant: () => void;
  activeEmergencySenior?: Senior | null;
}

export const Header: React.FC<HeaderProps> = ({
  appMode,
  setAppMode,
  seniors,
  activeSenior,
  setActiveSeniorId,
  textSize,
  setTextSize,
  highContrast,
  setHighContrast,
  voiceEnabled,
  setVoiceEnabled,
  phoneFrameMode,
  setPhoneFrameMode,
  onTriggerEmergency,
  onOpenVoiceAssistant,
  activeEmergencySenior
}) => {
  const [seniorDropdownOpen, setSeniorDropdownOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  const cycleTextSize = () => {
    soundFx.playClick();
    if (textSize === 'normal') {
      setTextSize('large');
      if (voiceEnabled) speakText('Tamanho de texto grande');
    } else if (textSize === 'large') {
      setTextSize('xlarge');
      if (voiceEnabled) speakText('Tamanho de texto extra grande');
    } else {
      setTextSize('normal');
      if (voiceEnabled) speakText('Tamanho de texto normal');
    }
  };

  const toggleContrast = () => {
    soundFx.playClick();
    const next = !highContrast;
    setHighContrast(next);
    if (voiceEnabled) speakText(next ? 'Alto contraste ativado' : 'Alto contraste desativado');
  };

  const toggleVoice = () => {
    soundFx.playClick();
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    if (next) speakText('Leitura por voz ativada');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm transition-colors duration-200">
      {/* Active Emergency Alert Ribbon if active */}
      {activeEmergencySenior && (
        <div className="bg-red-600 text-white px-4 py-2 text-center font-black flex items-center justify-center gap-3 animate-pulse">
          <ShieldAlert className="w-6 h-6 animate-bounce" />
          <span className="text-sm md:text-base">
            ALERTA DE EMERGÊNCIA ATIVO: {activeEmergencySenior.name} acionou o socorro!
          </span>
          <button 
            onClick={() => {
              soundFx.playClick();
              setAppMode('caregiver');
            }}
            className="bg-white text-red-600 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-red-50"
          >
            Ver no Painel
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 md:gap-4 flex-wrap">
        
        {/* Brand Logo & TCC Badge */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => {
              soundFx.playClick();
              setAppMode('senior');
            }}
            className="cursor-pointer flex items-center gap-2.5 group"
            title="Cuidar+ — Tecnologia para cuidar de quem você ama"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  Cuidar<span className="text-sky-600">+</span>
                </span>
                <span className="text-[10px] font-extrabold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  TCC
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Tecnologia para cuidar de quem você ama
              </p>
            </div>
          </div>
        </div>

        {/* Center: Perspective / Mode Switcher */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200 shadow-inner order-3 md:order-2 w-full md:w-auto justify-center">
          <button
            onClick={() => {
              soundFx.playClick();
              setAppMode('senior');
              if (voiceEnabled) speakText('Modo Idoso selecionado');
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              appMode === 'senior'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Modo Idoso</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setAppMode('caregiver');
              if (voiceEnabled) speakText('Painel do Cuidador e Familiar selecionado');
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              appMode === 'caregiver'
                ? 'bg-blue-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Painel do Familiar</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setAppMode('tcc');
              if (voiceEnabled) speakText('Apresentação do Trabalho de Conclusão de Curso');
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              appMode === 'tcc'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Sobre o TCC</span>
          </button>
        </div>

        {/* Right: Quick Controls (Senior Selector, Accessibility, Voice, Frame) */}
        <div className="flex items-center gap-1.5 sm:gap-2 order-2 md:order-3">
          
          {/* Senior Selector Dropdown (when in senior mode) */}
          {appMode === 'senior' && (
            <div className="relative">
              <button
                onClick={() => setSeniorDropdownOpen(!seniorDropdownOpen)}
                className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-900 px-2.5 py-1.5 rounded-xl text-xs font-bold hover:bg-sky-100 transition-colors"
                title="Trocar idoso atendido"
              >
                <img 
                  src={activeSenior.photoUrl} 
                  alt={activeSenior.name} 
                  className="w-5 h-5 rounded-full object-cover border border-sky-300"
                />
                <span className="hidden sm:inline max-w-[100px] truncate">{activeSenior.nickname}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {seniorDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2 py-1">
                    Selecionar Idoso
                  </div>
                  {seniors.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        soundFx.playClick();
                        setActiveSeniorId(s.id);
                        setSeniorDropdownOpen(false);
                        if (voiceEnabled) speakText(`Perfil alterado para ${s.nickname}`);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-left text-xs font-bold transition-colors ${
                        s.id === activeSenior.id
                          ? 'bg-sky-50 text-sky-700 font-extrabold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <img 
                        src={s.photoUrl} 
                        alt={s.name} 
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div className="flex-1 truncate">
                        <div className="truncate">{s.nickname}</div>
                        <div className="text-[10px] text-slate-400">{s.age} anos</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Text Size Cycler */}
          <button
            onClick={cycleTextSize}
            className={`p-2 rounded-xl border flex items-center gap-1 font-bold text-xs transition-all ${
              textSize === 'normal'
                ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                : textSize === 'large'
                ? 'border-sky-300 bg-sky-50 text-sky-700 shadow-sm'
                : 'border-sky-500 bg-sky-600 text-white shadow-md'
            }`}
            title={`Tamanho da fonte: ${textSize === 'normal' ? 'Normal' : textSize === 'large' ? 'Grande (22px)' : 'Extra Grande (26px)'}`}
            aria-label="Ajustar tamanho da fonte"
          >
            <Type className="w-4 h-4" />
            <span className="text-[11px] font-black hidden sm:inline">
              {textSize === 'normal' ? 'A' : textSize === 'large' ? 'A+' : 'A++'}
            </span>
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleContrast}
            className={`p-2 rounded-xl border transition-all ${
              highContrast
                ? 'bg-amber-400 border-amber-500 text-slate-950 font-black shadow-md'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            title="Alternar Modo Alto Contraste"
            aria-label="Alto Contraste"
          >
            {highContrast ? <Sun className="w-4 h-4 text-slate-950" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Voice Reading Toggle */}
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-xl border transition-all ${
              voiceEnabled
                ? 'bg-sky-500 border-sky-600 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50'
            }`}
            title={voiceEnabled ? 'Voz ativada (clique para silenciar)' : 'Voz desativada (clique para ativar)'}
            aria-label="Alternar leitura por voz"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Assistant Voice Shortcut */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenVoiceAssistant();
            }}
            className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm hover:scale-105 transition-transform"
            title="Abrir Assistente de Voz Cuidar+"
            aria-label="Assistente de voz"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Mobile Bezel Toggle (only on wider screens) */}
          <button
            onClick={() => {
              soundFx.playClick();
              setPhoneFrameMode(!phoneFrameMode);
            }}
            className="hidden lg:flex items-center gap-1 p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold"
            title={phoneFrameMode ? 'Ver em tela cheia' : 'Simular tela de celular (Mobile Frame)'}
          >
            {phoneFrameMode ? <Laptop className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
};
