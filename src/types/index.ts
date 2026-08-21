export type TextSize = 'normal' | 'large' | 'xlarge';

export type AppMode = 'senior' | 'caregiver' | 'tcc';

export type SeniorScreen = 
  | 'home' 
  | 'appointments' 
  | 'medications' 
  | 'exams' 
  | 'family' 
  | 'voice' 
  | 'emergency' 
  | 'accessibility'
  | 'profile';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // e.g. "10:00"
  frequency: string; // e.g. "1 comprimido ao dia"
  notes?: string;
  takenToday: boolean;
  takenAt?: string;
  category?: 'pressao' | 'diabetes' | 'coracao' | 'vitaminas' | 'dor' | 'outro';
}

export interface Appointment {
  id: string;
  specialty: string;
  doctor: string;
  date: string;
  time: string;
  location: string;
  type: 'presencial' | 'telemedicina';
  notes?: string;
  status: 'confirmada' | 'agendada' | 'concluida';
}

export interface Exam {
  id: string;
  name: string;
  date: string;
  laboratory: string;
  status: 'disponivel' | 'em_analise';
  summarySimple: string; // Plain language translation for seniors
  medicalResult: string; // Technical result
  indicator: 'otimo' | 'atencao' | 'normal';
}

export interface Caregiver {
  id: string;
  name: string;
  relationship: string; // e.g. "Filha", "Filho", "Cuidadora Profissional"
  role: 'admin' | 'familiar' | 'cuidador';
  phone: string;
  isEmergencyContact: boolean;
  avatarUrl?: string;
  notificationsEnabled: boolean;
}

export interface Senior {
  id: string;
  name: string;
  nickname: string;
  age: number;
  birthDate: string;
  photoUrl: string;
  gender: 'F' | 'M' | 'Outro';
  phone: string;
  address: string;
  bloodType: string;
  allergies: string[];
  medicalConditions: string[];
  notes: string;
  status: 'ok' | 'remedio_pendente' | 'consulta_hoje' | 'emergencia';
  medications: Medication[];
  appointments: Appointment[];
  exams: Exam[];
  caregivers: Caregiver[];
}

export interface EmergencyCall {
  id: string;
  seniorId: string;
  seniorName: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'acionado' | 'familia_notificada' | 'samu_preparado' | 'em_atendimento' | 'cancelado';
  triggerType: 'botao_manual' | 'comando_voz' | 'sensor_queda';
  notes: string;
}

export interface Notice {
  tone: 'success' | 'warning' | 'info' | 'emergency';
  message: string;
  id?: number;
}
