import React, { useState } from 'react';
import { 
  User, 
  X, 
  Heart, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Pill, 
  CalendarDays, 
  FileText, 
  Users, 
  ShieldCheck, 
  Activity,
  Edit,
  Camera
} from 'lucide-react';
import { Senior } from '../types';
import { soundFx } from '../utils/audio';
import { PhotoPickerModal } from './PhotoPickerModal';

interface SeniorProfileModalProps {
  senior: Senior;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePhoto?: (seniorId: string, photoDataUrl: string) => void;
  voiceEnabled?: boolean;
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=200&auto=format&fit=crop&q=80';

export const SeniorProfileModal: React.FC<SeniorProfileModalProps> = ({
  senior,
  isOpen,
  onClose,
  onUpdatePhoto,
  voiceEnabled = false,
}) => {
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);

  if (!isOpen) return null;

  const handlePhotoSelected = (dataUrl: string) => {
    onUpdatePhoto?.(senior.id, dataUrl);
  };

  const handlePhotoRemoved = () => {
    onUpdatePhoto?.(senior.id, DEFAULT_AVATAR);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-auto animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto space-y-6">
          
          {/* Top Header */}
          <div className="flex items-start justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              {/* Clickable Avatar — triggers photo picker */}
              <div className="relative group flex-shrink-0">
                <img
                  src={senior.photoUrl}
                  alt={senior.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-sky-200 shadow-md"
                />
                {onUpdatePhoto && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setIsPhotoPickerOpen(true);
                    }}
                    className="absolute inset-0 rounded-3xl bg-black/45 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity cursor-pointer"
                    title="Alterar foto de perfil"
                    aria-label="Alterar foto de perfil"
                  >
                    <Camera className="w-7 h-7 text-white drop-shadow" />
                    <span className="text-white text-[10px] font-black mt-1 drop-shadow">Alterar</span>
                  </button>
                )}
                {/* Small camera badge */}
                {onUpdatePhoto && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setIsPhotoPickerOpen(true);
                    }}
                    className="absolute -bottom-1.5 -right-1.5 bg-sky-600 text-white p-1.5 rounded-full border-2 border-white shadow-md hover:bg-sky-700 transition-colors"
                    title="Trocar foto"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-sky-100 text-sky-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                    Ficha do Idoso
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {senior.age} anos · Nasc.: {senior.birthDate}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {senior.name}
                </h2>

                <p className="text-sm font-bold text-slate-500">
                  Atendido carinhosamente como: <strong className="text-sky-700">"{senior.nickname}"</strong>
                </p>

                {onUpdatePhoto && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setIsPhotoPickerOpen(true);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-xl border border-sky-200 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Alterar Foto de Perfil
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2.5 text-slate-400 hover:text-slate-700 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Vital Health Information Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-red-500" />
              <span>Informações Clínicas de Resgate</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-red-50 p-3 rounded-2xl border border-red-200">
                <span className="text-red-600 block text-[10px] uppercase font-black">Tipo Sanguíneo</span>
                <strong className="text-lg text-red-900 font-black">{senior.bloodType}</strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-black">Telefone</span>
                <strong className="text-xs text-slate-800 font-bold block truncate">{senior.phone}</strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 sm:col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase font-black">Endereço Residencial</span>
                <strong className="text-xs text-slate-800 font-bold block truncate">{senior.address}</strong>
              </div>
            </div>

            {/* Allergies & Conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200">
                <span className="text-red-700 font-black uppercase tracking-wider block mb-1">
                  ⚠️ Alergias Conhecidas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {senior.allergies.length > 0 ? (
                    senior.allergies.map((alg, i) => (
                      <span key={i} className="bg-white text-red-800 font-black px-2 py-0.5 rounded-md border border-red-200">
                        {alg}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 font-bold">Nenhuma alergia relatada</span>
                  )}
                </div>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <span className="text-amber-800 font-black uppercase tracking-wider block mb-1">
                  🩺 Condições de Saúde Diagnosticadas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {senior.medicalConditions.map((cond, i) => (
                    <span key={i} className="bg-white text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Medications and Appointments Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
            
            {/* Medications Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-slate-700 font-black">
                <span className="flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  Medicamentos Contínuos ({senior.medications.length})
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                {senior.medications.map((m) => (
                  <div key={m.id} className="bg-white p-2.5 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="text-slate-900 font-black">{m.name}</div>
                      <div className="text-slate-500 text-[11px]">{m.dosage} — {m.time}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      m.takenToday ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {m.takenToday ? 'Tomou' : 'Pendente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-slate-700 font-black">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-sky-600" />
                  Contatos de Emergência ({senior.caregivers.length})
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                {senior.caregivers.map((cg) => (
                  <div key={cg.id} className="bg-white p-2.5 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="text-slate-900 font-black">{cg.name}</div>
                      <div className="text-slate-500 text-[11px]">{cg.relationship} · {cg.phone}</div>
                    </div>
                    <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-black">
                      Alerta SOS
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Notes */}
          {senior.notes && (
            <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 text-xs font-semibold text-sky-950">
              <strong className="block text-sky-900 font-black uppercase mb-1">
                Observações e Preferências do Idoso
              </strong>
              <p>{senior.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3 rounded-2xl text-sm shadow-md"
            >
              Fechar Perfil
            </button>
          </div>

        </div>
      </div>

      {/* Photo Picker Modal */}
      <PhotoPickerModal
        isOpen={isPhotoPickerOpen}
        onClose={() => setIsPhotoPickerOpen(false)}
        onPhotoSelected={handlePhotoSelected}
        onPhotoRemoved={handlePhotoRemoved}
        currentPhoto={senior.photoUrl}
        voiceEnabled={voiceEnabled}
      />
    </>
  );
};
