import React, { useState, useEffect } from 'react';
import { 
  Home, 
  CalendarDays, 
  Pill, 
  FileText, 
  Users, 
  AlertOctagon, 
  Volume2, 
  Sparkles,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

import { AppMode, SeniorScreen, Senior, TextSize, Medication, Appointment, Caregiver } from './types';
import { initialSeniors, tccInfo } from './data/initialData';
import { soundFx, speakText, stopSpeaking } from './utils/audio';

// Components
import { Header } from './components/Header';
import { SeniorHome } from './components/SeniorHome';
import { MedicationsView } from './components/MedicationsView';
import { AppointmentsView } from './components/AppointmentsView';
import { ExamsView } from './components/ExamsView';
import { FamilyView } from './components/FamilyView';
import { EmergencyModal } from './components/EmergencyModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { CaregiverDashboard } from './components/CaregiverDashboard';
import { AddSeniorModal } from './components/AddSeniorModal';
import { SeniorProfileModal } from './components/SeniorProfileModal';
import { TccPresentation } from './components/TccPresentation';
import { PhoneFrame } from './components/PhoneFrame';

export function App() {
  // App Mode (Senior, Caregiver Dashboard, TCC Showcase)
  const [appMode, setAppMode] = useState<AppMode>('senior');
  
  // Senior sub-screen
  const [seniorScreen, setSeniorScreen] = useState<SeniorScreen>('home');

  // Seniors dataset state with localStorage persistence
  const [seniors, setSeniors] = useState<Senior[]>(() => {
    const saved = localStorage.getItem('cuidar-plus-seniors-v2');
    return saved ? JSON.parse(saved) : initialSeniors;
  });

  const [activeSeniorId, setActiveSeniorId] = useState<string>(() => {
    const saved = localStorage.getItem('cuidar-plus-active-senior');
    return saved || 'senior-1';
  });

  // Accessibility state
  const [textSize, setTextSize] = useState<TextSize>(() => {
    return (localStorage.getItem('cuidar-plus-text-size') as TextSize) || 'normal';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('cuidar-plus-high-contrast') === 'true';
  });

  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    return localStorage.getItem('cuidar-plus-voice-enabled') !== 'false';
  });

  const [phoneFrameMode, setPhoneFrameMode] = useState<boolean>(false);

  // Modals & Active Emergency
  const [activeEmergencySenior, setActiveEmergencySenior] = useState<Senior | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isAddSeniorOpen, setIsAddSeniorOpen] = useState(false);
  const [profileModalSenior, setProfileModalSenior] = useState<Senior | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('cuidar-plus-seniors-v2', JSON.stringify(seniors));
  }, [seniors]);

  useEffect(() => {
    localStorage.setItem('cuidar-plus-active-senior', activeSeniorId);
  }, [activeSeniorId]);

  useEffect(() => {
    localStorage.setItem('cuidar-plus-text-size', textSize);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('cuidar-plus-high-contrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('cuidar-plus-voice-enabled', String(voiceEnabled));
  }, [voiceEnabled]);

  // Current active senior object
  const activeSenior = seniors.find(s => s.id === activeSeniorId) || seniors[0] || initialSeniors[0];

  // Handler: Update Medication (Tomei / Pendente)
  const handleUpdateMedication = (seniorId: string, medicationId: string, taken: boolean) => {
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setSeniors(prev =>
      prev.map(s => {
        if (s.id !== seniorId) return s;
        return {
          ...s,
          medications: s.medications.map(m => {
            if (m.id !== medicationId) return m;
            return {
              ...m,
              takenToday: taken,
              takenAt: taken ? timeNow : undefined,
            };
          }),
        };
      })
    );
  };

  // Handler: Add Medication
  const handleAddMedication = (seniorId: string, newMed: Omit<Medication, 'id' | 'takenToday'>) => {
    setSeniors(prev =>
      prev.map(s => {
        if (s.id !== seniorId) return s;
        const created: Medication = {
          ...newMed,
          id: `med-${Date.now()}`,
          takenToday: false,
        };
        return {
          ...s,
          medications: [...s.medications, created],
        };
      })
    );
  };

  // Handler: Add Appointment
  const handleAddAppointment = (seniorId: string, newApt: Omit<Appointment, 'id'>) => {
    setSeniors(prev =>
      prev.map(s => {
        if (s.id !== seniorId) return s;
        const created: Appointment = {
          ...newApt,
          id: `apt-${Date.now()}`,
        };
        return {
          ...s,
          appointments: [...s.appointments, created],
        };
      })
    );
  };

  // Handler: Add Caregiver
  const handleAddCaregiver = (seniorId: string, newCg: Omit<Caregiver, 'id'>) => {
    setSeniors(prev =>
      prev.map(s => {
        if (s.id !== seniorId) return s;
        const created: Caregiver = {
          ...newCg,
          id: `cg-${Date.now()}`,
        };
        return {
          ...s,
          caregivers: [...s.caregivers, created],
        };
      })
    );
  };

  // Handler: Add Senior
  const handleAddSenior = (newSenior: Senior) => {
    setSeniors(prev => [...prev, newSenior]);
    setActiveSeniorId(newSenior.id);
  };

  // Handler: Update Senior Photo
  const handleUpdateSeniorPhoto = (seniorId: string, photoDataUrl: string) => {
    setSeniors(prev =>
      prev.map(s => s.id === seniorId ? { ...s, photoUrl: photoDataUrl } : s)
    );
    // Keep profile modal in sync with updated data
    setProfileModalSenior(prev =>
      prev && prev.id === seniorId ? { ...prev, photoUrl: photoDataUrl } : prev
    );
  };

  // Handler: Trigger Emergency
  const handleTriggerEmergency = (targetSenior?: Senior) => {
    const victim = targetSenior || activeSenior;
    setActiveEmergencySenior(victim);
    setIsEmergencyModalOpen(true);
  };

  // Handler: Close Emergency
  const handleCloseEmergency = () => {
    setIsEmergencyModalOpen(false);
    setActiveEmergencySenior(null);
  };

  return (
    <div className={`min-h-screen text-size-${textSize} ${highContrast ? 'high-contrast-mode' : ''} bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors duration-200`}>
      
      {/* Top Universal Header */}
      <Header
        appMode={appMode}
        setAppMode={setAppMode}
        seniors={seniors}
        activeSenior={activeSenior}
        setActiveSeniorId={setActiveSeniorId}
        textSize={textSize}
        setTextSize={setTextSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        phoneFrameMode={phoneFrameMode}
        setPhoneFrameMode={setPhoneFrameMode}
        onTriggerEmergency={() => handleTriggerEmergency(activeSenior)}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        activeEmergencySenior={activeEmergencySenior}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        
        <PhoneFrame active={phoneFrameMode && appMode === 'senior'} onToggle={() => setPhoneFrameMode(!phoneFrameMode)}>
          
          {/* MODE 1: SENIOR PERSPECTIVE */}
          {appMode === 'senior' && (
            <div className="w-full">
              {seniorScreen === 'home' && (
                <SeniorHome
                  senior={activeSenior}
                  setScreen={setSeniorScreen}
                  onTriggerEmergency={() => handleTriggerEmergency(activeSenior)}
                  onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
                  voiceEnabled={voiceEnabled}
                  onOpenProfile={() => setProfileModalSenior(activeSenior)}
                />
              )}

              {seniorScreen === 'medications' && (
                <MedicationsView
                  senior={activeSenior}
                  setScreen={setSeniorScreen}
                  onUpdateMedication={handleUpdateMedication}
                  onAddMedication={handleAddMedication}
                  voiceEnabled={voiceEnabled}
                />
              )}

              {seniorScreen === 'appointments' && (
                <AppointmentsView
                  senior={activeSenior}
                  setScreen={setSeniorScreen}
                  onAddAppointment={handleAddAppointment}
                  voiceEnabled={voiceEnabled}
                />
              )}

              {seniorScreen === 'exams' && (
                <ExamsView
                  senior={activeSenior}
                  setScreen={setSeniorScreen}
                  voiceEnabled={voiceEnabled}
                />
              )}

              {seniorScreen === 'family' && (
                <FamilyView
                  senior={activeSenior}
                  setScreen={setSeniorScreen}
                  onAddCaregiver={handleAddCaregiver}
                  voiceEnabled={voiceEnabled}
                />
              )}
            </div>
          )}

          {/* MODE 2: CAREGIVER / FAMILY DASHBOARD */}
          {appMode === 'caregiver' && (
            <CaregiverDashboard
              seniors={seniors}
              activeSenior={activeSenior}
              onSelectSenior={(id) => setActiveSeniorId(id)}
              onOpenAddSenior={() => setIsAddSeniorOpen(true)}
              onOpenSeniorProfile={(s) => setProfileModalSenior(s)}
              onTriggerEmergencyForSenior={(s) => handleTriggerEmergency(s)}
              activeEmergencySenior={activeEmergencySenior}
              setAppMode={setAppMode}
            />
          )}

          {/* MODE 3: TCC ACADEMIC SHOWCASE */}
          {appMode === 'tcc' && (
            <TccPresentation setAppMode={setAppMode} />
          )}

        </PhoneFrame>

      </main>

      {/* Floating Bottom Quick Bar in Senior Mode */}
      {appMode === 'senior' && (
        <nav 
          aria-label="Navegação rápida do idoso"
          className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-sky-200 shadow-2xl p-2 sm:p-3"
        >
          <div className="max-w-2xl mx-auto flex items-center justify-around gap-1">
            <button
              onClick={() => {
                soundFx.playClick();
                setSeniorScreen('home');
                if (voiceEnabled) speakText('Tela inicial');
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl flex-1 text-center font-extrabold text-xs transition-colors ${
                seniorScreen === 'home' ? 'text-sky-600 bg-sky-50' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Início</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setSeniorScreen('medications');
                if (voiceEnabled) speakText('Meus medicamentos');
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl flex-1 text-center font-extrabold text-xs transition-colors ${
                seniorScreen === 'medications' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Pill className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Remédios</span>
            </button>

            {/* Middle Big Floating SOS Button */}
            <button
              onClick={() => handleTriggerEmergency(activeSenior)}
              className="flex flex-col items-center justify-center -mt-6 bg-red-600 hover:bg-red-700 active:scale-95 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl shadow-red-500/50 border-4 border-white transition-transform"
              title="Chamar SOCORRO agora"
            >
              <AlertOctagon className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-red-600 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-wider">SOS</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setSeniorScreen('appointments');
                if (voiceEnabled) speakText('Minhas consultas');
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl flex-1 text-center font-extrabold text-xs transition-colors ${
                seniorScreen === 'appointments' ? 'text-sky-600 bg-sky-50' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Consultas</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setIsVoiceAssistantOpen(true);
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-2xl flex-1 text-center font-extrabold text-xs text-teal-600 hover:bg-teal-50"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
              <span>Voz</span>
            </button>
          </div>
        </nav>
      )}

      {/* Emergency Modal */}
      {isEmergencyModalOpen && activeEmergencySenior && (
        <EmergencyModal
          senior={activeEmergencySenior}
          isOpen={isEmergencyModalOpen}
          onClose={handleCloseEmergency}
        />
      )}

      {/* Voice Assistant Modal */}
      {isVoiceAssistantOpen && (
        <VoiceAssistantModal
          senior={activeSenior}
          isOpen={isVoiceAssistantOpen}
          onClose={() => setIsVoiceAssistantOpen(false)}
          setScreen={setSeniorScreen}
          onTriggerEmergency={() => handleTriggerEmergency(activeSenior)}
          onTakeNextMed={() => {
            const nextPending = activeSenior.medications.find(m => !m.takenToday);
            if (nextPending) {
              handleUpdateMedication(activeSenior.id, nextPending.id, true);
            }
          }}
        />
      )}

      {/* Add Senior Modal */}
      {isAddSeniorOpen && (
        <AddSeniorModal
          isOpen={isAddSeniorOpen}
          onClose={() => setIsAddSeniorOpen(false)}
          onAddSenior={handleAddSenior}
        />
      )}

      {/* Senior Full Profile Modal */}
      {profileModalSenior && (
        <SeniorProfileModal
          senior={profileModalSenior}
          isOpen={!!profileModalSenior}
          onClose={() => setProfileModalSenior(null)}
          onUpdatePhoto={handleUpdateSeniorPhoto}
          voiceEnabled={voiceEnabled}
        />
      )}

    </div>
  );
}
export default App;
