import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  HeartHandshake
} from 'lucide-react';
import { Senior, Exam, SeniorScreen } from '../types';
import { soundFx, speakText } from '../utils/audio';

interface ExamsViewProps {
  senior: Senior;
  setScreen: (screen: SeniorScreen) => void;
  voiceEnabled: boolean;
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  senior,
  setScreen,
  voiceEnabled,
}) => {
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null);

  const handleReadExam = (exam: Exam) => {
    soundFx.playClick();
    speakText(`Exame: ${exam.name}, realizado no ${exam.laboratory}. Explicação simples: ${exam.summarySimple}`);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      
      {/* Header & Back */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            soundFx.playClick();
            setScreen('home');
          }}
          className="flex items-center gap-2 text-sky-800 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-2xl font-black text-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar ao Início</span>
        </button>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-purple-600/15">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-purple-100 bg-white/20 px-3 py-1 rounded-full">
              Resultados Médicos
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
              🧪 Meus Exames
            </h1>
            <p className="text-purple-100 font-bold text-base mt-1">
              Resultados traduzidos em linguagem simples para {senior.nickname}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white text-purple-600 flex items-center justify-center font-black text-2xl shadow-lg">
            {senior.exams.length}
          </div>
        </div>
      </div>

      {/* Educational Banner for Seniors */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-3xl p-4 sm:p-5 flex items-start gap-3 text-purple-950">
        <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-black text-purple-900 block text-sm">
            Entenda seus exames sem palavras difíceis
          </strong>
          <p className="text-xs sm:text-sm font-semibold text-purple-800 mt-0.5 leading-relaxed">
            O Cuidar+ transforma laudos médicos técnicos em explicações fáceis para você e sua família acompanharem a sua saúde com tranquilidade.
          </p>
        </div>
      </div>

      {/* List of Exams */}
      <div className="space-y-4">
        {senior.exams.map((exam) => {
          const isExpanded = expandedExamId === exam.id;

          return (
            <div
              key={exam.id}
              className="bg-white rounded-3xl p-6 border-2 border-purple-200 hover:border-purple-400 shadow-lg transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 font-black shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                        {exam.date}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {exam.laboratory}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 mt-1">
                      {exam.name}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => handleReadExam(exam)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
                  title="Ouvir explicação deste exame em voz alta"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Simple Language Translation Box */}
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>O que este exame significa para você:</span>
                </div>

                <p className="text-base sm:text-lg font-black text-emerald-950 leading-snug">
                  "{exam.summarySimple}"
                </p>
              </div>

              {/* Read Aloud Action Button */}
              <button
                onClick={() => handleReadExam(exam)}
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-900 font-extrabold py-3 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 border border-purple-200 transition-colors"
              >
                <Volume2 className="w-5 h-5 text-purple-600" />
                <span>Ouvir explicação do exame em voz alta</span>
              </button>

              {/* Technical Details Accordion (for Caregiver / Doctor) */}
              <div className="border-t border-slate-100 pt-3">
                <button
                  onClick={() => setExpandedExamId(isExpanded ? null : exam.id)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-between w-full"
                >
                  <span>Ver laudo técnico detalhado (para médicos e cuidadores)</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <div className="mt-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                    <div className="font-bold text-slate-500 mb-1 uppercase tracking-wider">Laudo Laboratorial:</div>
                    <div>{exam.medicalResult}</div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
