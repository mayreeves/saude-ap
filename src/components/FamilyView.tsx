import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  MessageCircle, 
  Plus, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Bell, 
  X, 
  Volume2,
  Heart
} from 'lucide-react';
import { Senior, Caregiver, SeniorScreen } from '../types';
import { soundFx, speakText } from '../utils/audio';

interface FamilyViewProps {
  senior: Senior;
  setScreen: (screen: SeniorScreen) => void;
  onAddCaregiver: (seniorId: string, newCg: Omit<Caregiver, 'id'>) => void;
  voiceEnabled: boolean;
}

export const FamilyView: React.FC<FamilyViewProps> = ({
  senior,
  setScreen,
  onAddCaregiver,
  voiceEnabled,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [simulatedCallName, setSimulatedCallName] = useState<string | null>(null);

  // Add Caregiver Form state
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Filho(a)');
  const [phone, setPhone] = useState('(11) 9');
  const [role, setRole] = useState<'admin' | 'familiar' | 'cuidador'>('familiar');

  const handleCall = (cg: Caregiver) => {
    soundFx.playClick();
    setSimulatedCallName(cg.name);
    speakText(`Chamando ${cg.name}, ${cg.relationship}.`);
    setTimeout(() => {
      // open tel link
      window.location.href = `tel:${cg.phone.replace(/\D/g, '')}`;
    }, 1200);
  };

  const handleWhatsApp = (cg: Caregiver) => {
    soundFx.playClick();
    speakText(`Enviando mensagem para ${cg.name} no WhatsApp.`);
    const cleanPhone = cg.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${cg.name}, tudo bem? Aqui é ${senior.nickname} enviando uma mensagem pelo aplicativo Conectiva Saúde.`);
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  const handleCreateCaregiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    soundFx.playClick();
    onAddCaregiver(senior.id, {
      name: name.trim(),
      relationship: relationship.trim(),
      phone: phone.trim(),
      role,
      isEmergencyContact: true,
      notificationsEnabled: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    setIsAddModalOpen(false);
    setName('');
    setPhone('(11) 9');

    if (voiceEnabled) {
      speakText(`${name} foi adicionado à sua lista de familiares com sucesso.`);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      
      {/* Back and Header */}
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
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>+ Adicionar Familiar</span>
        </button>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-amber-500/15">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-100 bg-white/20 px-3 py-1 rounded-full">
              Rede de Proteção e Cuidado
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
              👨👩👧 Minha Família & Cuidadores
            </h1>
            <p className="text-amber-100 font-bold text-base mt-1">
              Contatos rápidos autorizados para acompanhar {senior.nickname}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white text-amber-600 flex items-center justify-center font-black text-2xl shadow-lg">
            {senior.caregivers.length}
          </div>
        </div>
      </div>

      {/* Call in Progress Modal Toast */}
      {simulatedCallName && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-in fade-in duration-200 border-2 border-emerald-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-emerald-400">Ligação em andamento</div>
              <div className="text-base font-black">Discando para: {simulatedCallName}...</div>
            </div>
          </div>

          <button
            onClick={() => setSimulatedCallName(null)}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl font-bold"
          >
            Fechar
          </button>
        </div>
      )}

      {/* List of Caregivers & Family */}
      <div className="space-y-4">
        {senior.caregivers.map((cg) => (
          <div
            key={cg.id}
            className="bg-white rounded-3xl p-6 border-2 border-amber-200 hover:border-amber-400 shadow-lg transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={cg.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={cg.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-300 shadow"
                />

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                      {cg.relationship}
                    </span>

                    {cg.role === 'admin' && (
                      <span className="bg-sky-100 text-sky-800 text-xs font-black px-2 py-0.5 rounded-full">
                        Responsável Principal
                      </span>
                    )}

                    {cg.isEmergencyContact && (
                      <span className="bg-red-100 text-red-800 text-xs font-black px-2 py-0.5 rounded-full">
                        Recebe SOS
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    {cg.name}
                  </h2>

                  <div className="text-sm font-bold text-slate-500 mt-0.5">
                    {cg.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons (Huge, Accessible) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleCall(cg)}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black py-4 px-6 rounded-2xl text-lg shadow-md flex items-center justify-center gap-2 transition-transform border-2 border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              >
                <Phone className="w-6 h-6" />
                <span>LIGAR PARA {cg.name.split(' ')[0].toUpperCase()}</span>
              </button>

              <button
                onClick={() => handleWhatsApp(cg)}
                className="bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-900 font-black py-4 px-6 rounded-2xl text-base flex items-center justify-center gap-2 transition-transform border-2 border-emerald-300"
              >
                <MessageCircle className="w-6 h-6 text-emerald-600" />
                <span>Mensagem WhatsApp</span>
              </button>
            </div>

            {/* Permissions list */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs font-bold text-slate-600 flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Bell className="w-4 h-4 text-amber-600" />
                Recebe alertas de remédios atrasados e emergências
              </span>
              <span className="text-emerald-700 font-black">Autorizado</span>
            </div>

          </div>
        ))}
      </div>

      {/* Add Caregiver Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Novo Familiar / Cuidador</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCaregiver} className="space-y-4 mt-4 text-sm font-bold text-slate-700">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ana Cláudia Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-amber-500 text-base font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                    Grau de Parentesco *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Filha, Filho, Cuidador"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-amber-500 text-sm font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                    Telefone com DDD *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 98765-4321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-amber-500 text-sm font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Nível de Acesso
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-amber-500 text-sm font-bold focus:outline-none"
                >
                  <option value="admin">Administrador (Controle Total)</option>
                  <option value="familiar">Familiar (Acompanhamento e SOS)</option>
                  <option value="cuidador">Cuidador Profissional</option>
                </select>
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
                  className="bg-amber-600 hover:bg-amber-700 text-white font-black px-6 py-3 rounded-2xl text-sm shadow-md"
                >
                  Salvar Familiar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
