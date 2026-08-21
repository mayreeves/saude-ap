import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  X, 
  Sparkles, 
  AlertOctagon, 
  Phone, 
  Pill, 
  CalendarDays, 
  FileText, 
  Type, 
  CheckCircle2,
  Radio
} from 'lucide-react';
import { Senior, SeniorScreen } from '../types';
import { 
  speakText, 
  stopSpeaking, 
  soundFx, 
  createSpeechRecognizer, 
  isSpeechRecognitionSupported 
} from '../utils/audio';

interface VoiceAssistantModalProps {
  senior: Senior;
  isOpen: boolean;
  onClose: () => void;
  setScreen: (screen: SeniorScreen) => void;
  onTriggerEmergency: () => void;
  onTakeNextMed: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  senior,
  isOpen,
  onClose,
  setScreen,
  onTriggerEmergency,
  onTakeNextMed,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [statusMessage, setStatusMessage] = useState('Estou ouvindo... Fale com naturalidade.');
  const recognitionRef = useRef<any>(null);

  const suggestedCommands = [
    { label: '🚨 Socorro', cmd: 'Socorro', desc: 'Acionar emergência imediata' },
    { label: '💊 Meus remédios', cmd: 'Meus medicamentos', desc: 'Ver horários e dosagens' },
    { label: '🩺 Minhas consultas', cmd: 'Minhas consultas', desc: 'Ver agendamentos' },
    { label: '🧪 Meus exames', cmd: 'Meus exames', desc: 'Ver resultados simples' },
    { label: '📞 Ligar para minha filha', cmd: 'Ligar para minha filha', desc: 'Discar para Ana' },
    { label: '✅ Já tomei meu remédio', cmd: 'Já tomei meu remédio', desc: 'Marcar medicamento' },
  ];

  // Process spoken command text
  const processCommand = (rawText: string) => {
    const text = rawText.toLowerCase().trim();
    setTranscript(rawText);

    // Emergency / Socorro
    if (text.includes('socorro') || text.includes('emergência') || text.includes('ajuda urgente')) {
      const reply = 'Identifiquei o comando de SOCORRO! Iniciando atendimento de emergência imediatamente.';
      setAssistantReply(reply);
      speakText(reply, () => {
        onClose();
        onTriggerEmergency();
      });
      return;
    }

    // Medicamentos / Remédios
    if (text.includes('remédio') || text.includes('remedio') || text.includes('medicamento') || text.includes('que horas')) {
      const pending = senior.medications.filter(m => !m.takenToday);
      let reply = '';
      if (pending.length > 0) {
        reply = `Dona ${senior.nickname}, seu próximo remédio é ${pending[0].name}, às ${pending[0].time}. Abrindo a lista de medicamentos para você.`;
      } else {
        reply = `Parabéns, ${senior.nickname}! Todos os seus remédios de hoje já foram tomados. Abrindo a tela de medicamentos.`;
      }
      setAssistantReply(reply);
      speakText(reply, () => {
        setScreen('medications');
        onClose();
      });
      return;
    }

    // Já tomei o remédio
    if (text.includes('tomei') || text.includes('ja tomei') || text.includes('tomei meu remédio')) {
      onTakeNextMed();
      const reply = `Excelente, ${senior.nickname}! Registrei que você tomou seu remédio. Seus familiares foram avisados.`;
      setAssistantReply(reply);
      speakText(reply);
      return;
    }

    // Consultas
    if (text.includes('consulta') || text.includes('médico') || text.includes('medico') || text.includes('doutor')) {
      const nextApt = senior.appointments[0];
      const reply = nextApt 
        ? `Você tem consulta de ${nextApt.specialty} com ${nextApt.doctor} marcada para ${nextApt.date} às ${nextApt.time}. Abrindo suas consultas.`
        : 'Você não tem consultas pendentes no momento. Abrindo a tela de consultas.';
      setAssistantReply(reply);
      speakText(reply, () => {
        setScreen('appointments');
        onClose();
      });
      return;
    }

    // Exames
    if (text.includes('exame') || text.includes('resultado') || text.includes('sangue')) {
      const reply = `Seus exames mais recentes estão ótimos e com ritmo cardíaco normal. Abrindo a tela de exames traduzidos.`;
      setAssistantReply(reply);
      speakText(reply, () => {
        setScreen('exams');
        onClose();
      });
      return;
    }

    // Ligar para filha/filho/família
    if (text.includes('filha') || text.includes('filho') || text.includes('família') || text.includes('ligar') || text.includes('ana') || text.includes('carlos')) {
      const cg = senior.caregivers[0];
      const reply = `Ligando para ${cg?.name || 'sua família'} agora.`;
      setAssistantReply(reply);
      speakText(reply, () => {
        setScreen('family');
        onClose();
      });
      return;
    }

    // Início / Voltar
    if (text.includes('início') || text.includes('inicio') || text.includes('voltar') || text.includes('tela inicial')) {
      const reply = 'Voltando para o início.';
      setAssistantReply(reply);
      speakText(reply, () => {
        setScreen('home');
        onClose();
      });
      return;
    }

    // Fallback friendly reply
    const reply = `Você disse "${rawText}". Como posso te ajudar, Dona ${senior.nickname}? Você pode pedir: Minhas consultas, Meus remédios, Meus exames, ou dizer SOCORRO.`;
    setAssistantReply(reply);
    speakText(reply);
  };

  // Start Recognition on Open
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      return;
    }

    // Initial greeting
    const welcome = `Olá, ${senior.nickname}! Sou o Assistente Conectiva Saúde. O que você gostaria de fazer agora?`;
    setAssistantReply(welcome);
    speakText(welcome);

    // Initialize speech recognizer
    if (isSpeechRecognitionSupported()) {
      const recognizer = createSpeechRecognizer(
        (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            processCommand(text);
          }
        },
        (err) => {
          setStatusMessage('Microfone pronto. Você também pode tocar nos botões abaixo.');
        },
        () => {
          setIsListening(false);
        }
      );

      if (recognizer) {
        recognitionRef.current = recognizer;
        try {
          recognizer.start();
          setIsListening(true);
          setStatusMessage('🎙️ Ouvindo sua voz em tempo real...');
        } catch {
          setIsListening(false);
        }
      }
    } else {
      setStatusMessage('Reconhecimento por voz não suportado pelo navegador. Toque nos botões rápidos.');
    }

    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, [isOpen, senior]);

  const toggleMic = () => {
    soundFx.playClick();
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      setStatusMessage('Microfone pausado.');
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          setStatusMessage('🎙️ Ouvindo sua voz em tempo real...');
        } catch {}
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-teal-500 overflow-hidden my-auto flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white p-6 text-center relative">
          <button
            onClick={() => {
              soundFx.playClick();
              stopSpeaking();
              onClose();
            }}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-2xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-white text-teal-600 flex items-center justify-center mx-auto shadow-lg mb-2">
            <Sparkles className="w-9 h-9" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black">
            🎙️ Assistente de Voz Conectiva Saúde
          </h2>
          <p className="text-teal-100 font-bold text-sm mt-1">
            Fale livremente ou toque nos comandos rápidos
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Animated Microphone Visualizer */}
          <div className="text-center space-y-3">
            <div className="relative inline-flex items-center justify-center">
              {isListening && (
                <span className="absolute w-24 h-24 rounded-full bg-teal-400 opacity-40 animate-ping" />
              )}
              
              <button
                onClick={toggleMic}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
                  isListening
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-8 ring-emerald-100'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
                title={isListening ? 'Clique para pausar microfone' : 'Clique para ouvir'}
              >
                {isListening ? <Mic className="w-10 h-10 animate-pulse" /> : <MicOff className="w-10 h-10" />}
              </button>
            </div>

            <div className="text-sm font-black text-slate-700">
              {statusMessage}
            </div>

            {transcript && (
              <div className="bg-sky-50 border border-sky-200 p-3 rounded-2xl text-xs font-bold text-sky-900">
                Você disse: <span className="underline italic font-black">"{transcript}"</span>
              </div>
            )}
          </div>

          {/* Assistant Spoken Response Box */}
          {assistantReply && (
            <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-4 flex items-start gap-3">
              <Volume2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-xs font-black uppercase text-teal-800">
                  Resposta da Conectiva Saúde:
                </div>
                <p className="text-sm sm:text-base font-extrabold text-teal-950 mt-1 leading-snug">
                  {assistantReply}
                </p>
              </div>
            </div>
          )}

          {/* Quick Clickable Commands (Ideal for any browser / noisy environment) */}
          <div className="space-y-2">
            <div className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Exemplos de Comandos por Voz (Toque para Simular):
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedCommands.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundFx.playClick();
                    processCommand(item.cmd);
                  }}
                  className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                    item.cmd === 'Socorro'
                      ? 'border-red-300 bg-red-50 hover:bg-red-100 text-red-900 font-black'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold'
                  }`}
                >
                  <span className="text-sm">{item.label}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
