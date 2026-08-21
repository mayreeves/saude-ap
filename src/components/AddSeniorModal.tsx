import React, { useState } from 'react';
import { UserPlus, X, User, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import { Senior } from '../types';
import { soundFx, speakText } from '../utils/audio';

interface AddSeniorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSenior: (senior: Senior) => void;
}

const sampleAvatars = [
  'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
];

export const AddSeniorModal: React.FC<AddSeniorModalProps> = ({
  isOpen,
  onClose,
  onAddSenior,
}) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('75');
  const [birthDate, setBirthDate] = useState('10/06/1951');
  const [gender, setGender] = useState<'F' | 'M' | 'Outro'>('F');
  const [phone, setPhone] = useState('(11) 9');
  const [address, setAddress] = useState('Rua das Acácias, 250 — São Paulo, SP');
  const [bloodType, setBloodType] = useState('O+');
  const [allergiesText, setAllergiesText] = useState('Nenhuma conhecida');
  const [conditionsText, setConditionsText] = useState('Hipertensão leve');
  const [notes, setNotes] = useState('Gosta de caminhar de manhã');
  const [photoUrl, setPhotoUrl] = useState(sampleAvatars[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundFx.playSuccess();
    const newSenior: Senior = {
      id: `senior-${Date.now()}`,
      name: name.trim(),
      nickname: nickname.trim() || name.trim().split(' ')[0],
      age: parseInt(age) || 70,
      birthDate,
      gender,
      phone,
      address,
      bloodType,
      allergies: allergiesText.split(',').map(s => s.trim()).filter(Boolean),
      medicalConditions: conditionsText.split(',').map(s => s.trim()).filter(Boolean),
      notes,
      photoUrl,
      status: 'ok',
      medications: [
        {
          id: `med-${Date.now()}-1`,
          name: 'Polivitamínico Sênior',
          dosage: '1 comprimido',
          time: '09:00',
          frequency: 'Pela manhã',
          takenToday: false,
          notes: 'Tomar com água',
        },
      ],
      appointments: [],
      exams: [],
      caregivers: [
        {
          id: `cg-${Date.now()}-1`,
          name: 'Familiar Responsável',
          relationship: 'Familiar Principal',
          role: 'admin',
          phone: '(11) 98765-4321',
          isEmergencyContact: true,
          notificationsEnabled: true,
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        },
      ],
    };

    onAddSenior(newSenior);
    speakText(`Idoso ${newSenior.nickname} cadastrado com sucesso.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-auto animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Cadastrar Novo Idoso</h2>
              <p className="text-xs text-slate-500 font-bold">Adicione mãe, pai, avós ou familiares</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-sm font-bold text-slate-700">
          
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">
              Escolha uma Foto de Perfil
            </label>
            <div className="flex gap-3">
              {sampleAvatars.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="Avatar"
                  onClick={() => setPhotoUrl(url)}
                  className={`w-14 h-14 rounded-2xl object-cover cursor-pointer border-3 transition-all ${
                    photoUrl === url ? 'border-emerald-600 scale-105 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Maria de Lourdes Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 text-sm font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                Como prefere ser chamado (Apelido) *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Dona Maria, Vovô João"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 text-sm font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                Idade *
              </label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 text-sm font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                Gênero
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 text-sm font-bold focus:outline-none"
              >
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                Tipo Sanguíneo
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 text-sm font-bold focus:outline-none"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-1">
              Endereço Residencial (Para envio de SOS)
            </label>
            <input
              type="text"
              placeholder="Rua, número, bairro e cidade"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 text-sm font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-1">
              Alergias (Separadas por vírgula)
            </label>
            <input
              type="text"
              placeholder="Ex: Dipirona, Penicilina, Frutos do Mar"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 text-sm font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-1">
              Condições Médicas Importantes
            </label>
            <input
              type="text"
              placeholder="Ex: Hipertensão, Diabetes Tipo 2, Artrose"
              value={conditionsText}
              onChange={(e) => setConditionsText(e.target.value)}
              className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 text-sm font-bold focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-100 font-black text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-2xl text-sm shadow-md"
            >
              Concluir Cadastro
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
