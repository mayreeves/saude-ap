import React, { useState } from 'react';
import { 
  Pill, 
  Clock, 
  Check, 
  Plus, 
  Volume2, 
  ArrowLeft, 
  Calendar, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  X,
  Bell
} from 'lucide-react';
import { Senior, Medication, SeniorScreen } from '../types';
import { soundFx, speakText } from '../utils/audio';

interface MedicationsViewProps {
  senior: Senior;
  setScreen: (screen: SeniorScreen) => void;
  onUpdateMedication: (seniorId: string, medicationId: string, taken: boolean) => void;
  onAddMedication: (seniorId: string, newMed: Omit<Medication, 'id' | 'takenToday'>) => void;
  voiceEnabled: boolean;
}

export const MedicationsView: React.FC<MedicationsViewProps> = ({
  senior,
  setScreen,
  onUpdateMedication,
  onAddMedication,
  voiceEnabled,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'taken'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMedName, setCelebrationMedName] = useState('');

  // Form state for adding new medication
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [newFrequency, setNewFrequency] = useState('1 vez ao dia');
  const [newNotes, setNewNotes] = useState('');

  const takenCount = senior.medications.filter(m => m.takenToday).length;
  const totalCount = senior.medications.length;
  const percentTaken = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  const filteredMeds = senior.medications.filter(m => {
    if (filter === 'pending') return !m.takenToday;
    if (filter === 'taken') return m.takenToday;
    return true;
  });

  const handleTakeMed = (med: Medication) => {
    soundFx.playSuccess();
    soundFx.vibrate([100, 50, 150]);
    onUpdateMedication(senior.id, med.id, true);
    setCelebrationMedName(med.name);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3500);

    if (voiceEnabled) {
      speakText(`Excelente, ${senior.nickname}! Você tomou o remédio ${med.name}. Seu familiar foi avisado que está tudo certo.`);
    }
  };

  const handleSnooze = (med: Medication) => {
    soundFx.playClick();
    if (voiceEnabled) {
      speakText(`Lembrete adiado para ${med.name}. Vamos avisar você novamente em 15 minutos.`);
    }
  };

  const handleReadMed = (med: Medication) => {
    soundFx.playClick();
    speakText(`Medicamento ${med.name}. Dosagem: ${med.dosage}. Horário: às ${med.time}. Frequência: ${med.frequency}. Observação: ${med.notes || 'Nenhuma'}. Status: ${med.takenToday ? 'Já foi tomado hoje' : 'Pendente de tomar'}.`);
  };

  const handleCreateMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDosage.trim()) return;

    soundFx.playClick();
    onAddMedication(senior.id, {
      name: newName.trim(),
      dosage: newDosage.trim(),
      time: newTime,
      frequency: newFrequency,
      notes: newNotes.trim(),
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewDosage('');
    setNewNotes('');

    if (voiceEnabled) {
      speakText(`Medicamento ${newName} cadastrado com sucesso.`);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      
      {/* Back button & Page Header */}
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

        <button
          onClick={() => {
            soundFx.playClick();
            setIsAddModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>+ Adicionar Remédio</span>
        </button>
      </div>

      {/* Title & Progress Summary Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-emerald-600/15">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-100 bg-white/20 px-3 py-1 rounded-full">
              Cuidados Diários
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
              💊 Meus Medicamentos
            </h1>
            <p className="text-emerald-100 font-bold text-base mt-1">
              Controle simples e lembretes para {senior.nickname}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white text-emerald-600 flex items-center justify-center font-black text-2xl shadow-lg">
            {percentTaken}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs font-black text-emerald-100">
            <span>Progresso de hoje: {takenCount} de {totalCount} tomados</span>
            <span>{totalCount - takenCount} restantes</span>
          </div>
          <div className="w-full bg-emerald-950/40 rounded-full h-4 p-0.5">
            <div 
              className="bg-emerald-300 h-full rounded-full transition-all duration-500 shadow"
              style={{ width: `${percentTaken}%` }}
            />
          </div>
        </div>
      </div>

      {/* Celebration Popup Toast */}
      {showCelebration && (
        <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in zoom-in-95 duration-200 border-2 border-emerald-300">
          <Sparkles className="w-8 h-8 animate-spin text-yellow-300" />
          <div className="flex-1">
            <div className="font-black text-lg">Muito bem! Remédio registrado!</div>
            <div className="text-xs text-emerald-100 font-bold">
              {celebrationMedName} foi marcado como tomado com sucesso.
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 text-xs sm:text-sm font-black text-slate-600">
        <button
          onClick={() => {
            soundFx.playClick();
            setFilter('all');
          }}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            filter === 'all' ? 'bg-white text-emerald-800 shadow-md font-black' : 'hover:text-slate-900'
          }`}
        >
          Todos ({senior.medications.length})
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setFilter('pending');
          }}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            filter === 'pending' ? 'bg-white text-amber-800 shadow-md font-black' : 'hover:text-slate-900'
          }`}
        >
          Pendentes ({senior.medications.filter(m => !m.takenToday).length})
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setFilter('taken');
          }}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            filter === 'taken' ? 'bg-white text-emerald-800 shadow-md font-black' : 'hover:text-slate-900'
          }`}
        >
          Já Tomados ({senior.medications.filter(m => m.takenToday).length})
        </button>
      </div>

      {/* Medications List */}
      <div className="space-y-4">
        {filteredMeds.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border-2 border-dashed border-slate-200 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800">Nenhum remédio nessa categoria</h3>
            <p className="text-sm font-bold text-slate-500">
              {filter === 'pending' ? 'Todos os medicamentos de hoje já foram tomados!' : 'Nenhum medicamento encontrado.'}
            </p>
          </div>
        ) : (
          filteredMeds.map((med) => {
            const isTaken = med.takenToday;

            return (
              <div
                key={med.id}
                className={`rounded-3xl p-6 border-3 transition-all ${
                  isTaken
                    ? 'bg-slate-50 border-slate-200 opacity-90'
                    : 'bg-white border-amber-300 shadow-lg ring-2 ring-amber-100'
                }`}
              >
                {/* Header of the Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black shadow ${
                        isTaken ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-500 text-white animate-pulse'
                      }`}
                    >
                      <Pill className="w-8 h-8" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {med.time}
                        </span>

                        {isTaken ? (
                          <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Tomado às {med.takenAt || med.time}
                          </span>
                        ) : (
                          <span className="text-xs font-black bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                            Pendente agora
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                        {med.name}
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReadMed(med)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
                    title="Ouvir informações deste remédio"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Dosage & Notes Info */}
                <div className="mt-4 bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200 text-sm space-y-1">
                  <div className="font-extrabold text-slate-800">
                    💊 Dosagem: <span className="text-slate-600 font-bold">{med.dosage}</span>
                  </div>
                  <div className="font-extrabold text-slate-800">
                    🕒 Frequência: <span className="text-slate-600 font-bold">{med.frequency}</span>
                  </div>
                  {med.notes && (
                    <div className="text-xs font-bold text-slate-500 pt-1 border-t border-slate-200 mt-1">
                      💡 Observação: {med.notes}
                    </div>
                  )}
                </div>

                {/* Action Buttons (Large, Touch-Friendly) */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {!isTaken ? (
                    <>
                      <button
                        onClick={() => handleTakeMed(med)}
                        className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black py-4 px-6 rounded-2xl text-lg shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all border-2 border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                      >
                        <Check className="w-6 h-6 stroke-[3]" />
                        <span>TOMEI MEU REMÉDIO</span>
                      </button>

                      <button
                        onClick={() => handleSnooze(med)}
                        className="bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black py-4 px-6 rounded-2xl text-base flex items-center justify-center gap-2 transition-all border-2 border-slate-200"
                      >
                        <Bell className="w-5 h-5 text-amber-600" />
                        <span>Lembrar Depois</span>
                      </button>
                    </>
                  ) : (
                    <div className="col-span-full flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-emerald-900 font-bold text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Registrado com sucesso! Cuidador já foi notificado.</span>
                      </div>
                      <button
                        onClick={() => onUpdateMedication(senior.id, med.id, false)}
                        className="text-xs underline text-slate-500 hover:text-slate-800"
                        title="Desfazer marcação caso tenha clicado por engano"
                      >
                        Desfazer
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Add Medication Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  <Pill className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Novo Medicamento</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateMed} className="space-y-4 mt-4 text-sm font-bold text-slate-700">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Nome do Medicamento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Losartana, Dipirona, Insulina..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 text-base font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                    Dosagem *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 50mg, 1 comprimido"
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 text-sm font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                    Horário Principal *
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 text-sm font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Frequência
                </label>
                <input
                  type="text"
                  placeholder="Ex: 1 vez ao dia pela manhã, de 8 em 8h..."
                  value={newFrequency}
                  onChange={(e) => setNewFrequency(e.target.value)}
                  className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 text-sm font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Observações para o idoso
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Tomar com um copo cheio de água após a refeição"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 text-sm font-bold focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-100 font-black text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-2xl text-sm shadow-md"
                >
                  Salvar Medicamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
