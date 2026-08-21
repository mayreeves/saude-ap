import React from 'react';
import { Smartphone, Laptop, Sparkles, Heart } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface PhoneFrameProps {
  children: React.ReactNode;
  active: boolean;
  onToggle: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, active, onToggle }) => {
  if (!active) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div className="py-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-slate-900/10 transition-colors">
      
      {/* Device Frame Top Label */}
      <div className="mb-4 flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 text-xs font-bold text-slate-700">
        <span className="flex items-center gap-1.5 text-sky-700">
          <Smartphone className="w-4 h-4" />
          Simulador Mobile Conectiva Saúde
        </span>
        <button
          onClick={() => {
            soundFx.playClick();
            onToggle();
          }}
          className="text-xs text-sky-600 hover:underline font-black"
        >
          Expandir Tela Cheia
        </button>
      </div>

      {/* Realistic Mobile Device Case */}
      <div className="relative w-full max-w-[430px] h-[870px] bg-slate-950 rounded-[52px] p-3.5 shadow-2xl border-4 border-slate-800 ring-8 ring-slate-950/40 flex flex-col">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-full z-40 flex items-center justify-center gap-2 px-3 border border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Screen Display Container */}
        <div className="w-full h-full bg-slate-50 rounded-[42px] overflow-y-auto overflow-x-hidden pt-8 pb-4 px-3 flex flex-col relative">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full pointer-events-none" />
      </div>

    </div>
  );
};
