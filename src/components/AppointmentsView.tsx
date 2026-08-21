import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  ArrowLeft, 
  Video, 
  Volume2, 
  CheckCircle2, 
  X,
  Stethoscope
} from 'lucide-react';
import { Senior, Appointment, SeniorScreen } from '../types';
import { soundFx, speakText } from '../utils/audio';
import { TelemedicineModal } from './TelemedicineModal';

interface AppointmentsViewProps {
  senior: Senior;
  setScreen: (screen: SeniorScreen) => void;
  onAddAppointment: (seniorId: string, newApt: Omit<Appointment, 'id'>) => void;
  voiceEnabled: boolean;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  senior,
  setScreen,
  onAddAppointment,
  voiceEnabled,
}) => {
  const [activeTelemedicineApt, setActiveTelemedicineApt] = useState<Appointment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form fields
  const [specialty, setSpecialty] = useState('Cardiologia');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('28 de Agosto de 2026');
  const [time, setTime] = useState('14:30');
  const [location, setLocation] = useState('Hospital São Camilo');
  const [type, setType] = useState<'presencial' | 'telemedicina'>('presencial');
  const [notes, setNotes] = useState('');

  const handleReadAppointment = (apt: Appointment) => {
    soundFx.playClick();
    speakText(`Consulta de ${apt.specialty} com ${apt.doctor}. Marcada para ${apt.date} às ${apt.time}. Local: ${apt.location}. ${apt.type === 'telemedicina' ? 'Esta consulta é por Telemedicina online.' : 'Consulta presencial.'}`);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor.trim()) return;

    soundFx.playClick();
    onAddAppointment(senior.id, {
      specialty,
      doctor: doctor.trim(),
      date,
      time,
      location: type === 'telemedicina' ? 'Consulta Online Cuidar+' : location.trim(),
      type,
      notes: notes.trim(),
      status: 'confirmada',
    });

    setIsAddModalOpen(false);
    setDoctor('');
    setNotes('');

    if (voiceEnabled) {
      speakText(`Consulta com ${doctor} agendada com sucesso.`);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      
      {/* Header & Back button */}
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
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>+ Agendar Consulta</span>
        </button>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-br from-sky-600 to-blue-700 text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-sky-600/15">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-sky-100 bg-white/20 px-3 py-1 rounded-full">
              Atendimento Médico
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
              🩺 Minhas Consultas
            </h1>
            <p className="text-sky-100 font-bold text-base mt-1">
              Próximos agendamentos e teleconsultas de {senior.nickname}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white text-sky-600 flex items-center justify-center font-black text-2xl shadow-lg">
            {senior.appointments.length}
          </div>
        </div>
      </div>

      {/* List of Appointments */}
      <div className="space-y-4">
        {senior.appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border-2 border-dashed border-slate-200 space-y-2">
            <CalendarDays className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-xl font-black text-slate-800">Nenhuma consulta agendada</h3>
            <p className="text-sm font-bold text-slate-500">
              Clique em "+ Agendar Consulta" para registrar um atendimento.
            </p>
          </div>
        ) : (
          senior.appointments.map((apt) => {
            const isTelemed = apt.type === 'telemedicina';
            const dateParts = apt.date.split(' ');
            const dayNum = dateParts[0] || '25';
            const monthName = dateParts[2] || 'Ago';

            return (
              <div
                key={apt.id}
                className="bg-white rounded-3xl p-6 border-2 border-sky-200 hover:border-sky-400 shadow-lg transition-all space-y-4"
              >
                <div className="flex items-start gap-4">
                  {/* Big Date Badge */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex flex-col items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-2xl font-black leading-none">{dayNum}</span>
                    <span className="text-xs font-black uppercase tracking-wider mt-1">{monthName.slice(0, 3)}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-sky-100 text-sky-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                        {apt.specialty}
                      </span>
                      {isTelemed ? (
                        <span className="bg-purple-100 text-purple-800 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Video className="w-3 h-3" /> Telemedicina
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                          Presencial
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 mt-1">
                      {apt.doctor}
                    </h2>
                  </div>

                  <button
                    onClick={() => handleReadAppointment(apt)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
                    title="Ouvir informações da consulta"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Details list */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-sm font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <span>Horário: <strong>{apt.time}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <span>Local: <strong>{apt.location}</strong></span>
                  </div>

                  {apt.notes && (
                    <div className="text-xs font-bold text-slate-500 pt-1 border-t border-slate-200 mt-1">
                      💡 Lembrete: {apt.notes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-1">
                  {isTelemed ? (
                    <button
                      onClick={() => setActiveTelemedicineApt(apt)}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-4 px-6 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                      <Video className="w-6 h-6" />
                      <span>INICIAR TELECONSULTA AGORA (SIMULAÇÃO)</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 bg-sky-50/70 p-3 rounded-2xl border border-sky-200">
                      <span className="flex items-center gap-1.5 text-sky-900">
                        <CheckCircle2 className="w-4 h-4 text-sky-600" />
                        Consulta confirmada. Lembrete ativo 24h antes.
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Add Appointment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Agendar Consulta</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 mt-4 text-sm font-bold text-slate-700">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Especialidade Médica *
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-sky-500 text-sm font-bold focus:outline-none"
                >
                  <option value="Cardiologia">Cardiologia</option>
                  <option value="Geriatria">Geriatria</option>
                  <option value="Oftalmologia">Oftalmologia</option>
                  <option value="Ortopedia">Ortopedia</option>
                  <option value="Clínica Geral">Clínica Geral</option>
                  <option value="Nutrição">Nutrição</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Nome do Médico / Profissional *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dr. Roberto Mendonça"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-sky-500 text-base font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                    Data *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 28 de Agosto de 2026"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-sky-500 text-sm font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                    Horário *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 14:30"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-sky-500 text-sm font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Tipo de Consulta
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('presencial')}
                    className={`py-3 rounded-2xl font-black text-xs border-2 transition-all ${
                      type === 'presencial' ? 'border-sky-600 bg-sky-50 text-sky-900' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Presencial
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('telemedicina')}
                    className={`py-3 rounded-2xl font-black text-xs border-2 transition-all ${
                      type === 'telemedicina' ? 'border-purple-600 bg-purple-50 text-purple-900' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Telemedicina Online
                  </button>
                </div>
              </div>

              {type === 'presencial' && (
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                    Local / Endereço da Clínica
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Hospital São Camilo — Sala 302"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-sky-500 text-sm font-bold focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Observações / Recomendações
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Levar exames anteriores e chegar 15 minutos antes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-sky-500 text-sm font-bold focus:outline-none"
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
                  className="bg-sky-600 hover:bg-sky-700 text-white font-black px-6 py-3 rounded-2xl text-sm shadow-md"
                >
                  Salvar Consulta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Telemedicine Simulation Modal */}
      {activeTelemedicineApt && (
        <TelemedicineModal
          senior={senior}
          appointment={activeTelemedicineApt}
          isOpen={!!activeTelemedicineApt}
          onClose={() => setActiveTelemedicineApt(null)}
        />
      )}

    </div>
  );
};
