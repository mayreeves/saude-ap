import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  Accessibility,
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BellRing,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  Home,
  Info,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  RotateCcw,
  ShieldCheck,
  Stethoscope,
  Syringe,
  UserPlus,
  Volume2,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Screen = 'home' | 'appointments' | 'medications' | 'exams' | 'help' | 'accessibility' | 'booking' | 'support';
type TextSize = 'normal' | 'large' | 'xlarge';
type Appointment = { id: number; specialty: string; doctor: string; date: string; time: string; location: string };
type Notice = { tone: 'success' | 'warning' | 'info'; message: string };

const specialties = [
  { name: 'Cardiologia', doctors: ['Dr. João Santos', 'Dra. Ana Costa'] },
  { name: 'Clínica geral', doctors: ['Dra. Beatriz Lima', 'Dr. Carlos Oliveira'] },
  { name: 'Oftalmologia', doctors: ['Dra. Helena Martins', 'Dr. Paulo Mendes'] },
];
const dates = ['20 de agosto de 2026', '21 de agosto de 2026', '24 de agosto de 2026'];
const times = ['08:00', '10:30', '14:30', '16:00'];
const initialAppointment: Appointment = { id: 1, specialty: 'Cardiologia', doctor: 'Dr. João Santos', date: '20 de agosto de 2026', time: '14:30', location: 'Clínica Saúde Fácil — Sala 3' };

function speak(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [screen, setScreen] = useState<Screen>('home');
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('saude-facil-appointments');
    return saved ? JSON.parse(saved) : [initialAppointment];
  });
  const [textSize, setTextSize] = useState<TextSize>(() => (localStorage.getItem('saude-facil-text-size') as TextSize) || 'normal');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('saude-facil-contrast') === 'true');
  const [voiceEnabled, setVoiceEnabled] = useState(() => localStorage.getItem('saude-facil-voice') !== 'false');
  const [reduceMotion, setReduceMotion] = useState(() => localStorage.getItem('saude-facil-motion') === 'true');
  const [notice, setNotice] = useState<Notice | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      (async () => { setSession(nextSession); if (!nextSession) setScreen('home'); })();
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => { localStorage.setItem('saude-facil-appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('saude-facil-text-size', textSize); }, [textSize]);
  useEffect(() => { localStorage.setItem('saude-facil-contrast', String(highContrast)); }, [highContrast]);
  useEffect(() => { localStorage.setItem('saude-facil-voice', String(voiceEnabled)); }, [voiceEnabled]);
  useEffect(() => { localStorage.setItem('saude-facil-motion', String(reduceMotion)); }, [reduceMotion]);
  useEffect(() => { if (notice) { const timer = window.setTimeout(() => setNotice(null), 5000); return () => window.clearTimeout(timer); } }, [notice]);

  const navigate = (next: Screen) => { setScreen(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); };
  const announce = (message: string, tone: Notice['tone'] = 'success') => { setNotice({ message, tone }); if (voiceEnabled) speak(message); };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setScreen('home');
  };
  const readScreen = () => {
    const copy: Record<Screen, string> = {
      home: 'Início. Olá. Como podemos ajudar você hoje? Escolha uma das opções de saúde.',
      appointments: `Minhas consultas. Você tem ${appointments.length} consulta${appointments.length === 1 ? '' : 's'}.`,
      medications: 'Meus medicamentos. Losartana 50 miligramas. Tomar às oito horas, uma vez ao dia.',
      exams: 'Meus exames. Exame de sangue, realizado em 10 de agosto de 2026. Resultado disponível.',
      help: 'Ajuda. Encontre respostas para as dúvidas mais comuns.',
      accessibility: 'Acessibilidade. Personalize o tamanho do texto, o contraste e a leitura por voz.',
      booking: 'Marcar consulta. Escolha uma especialidade, um profissional, uma data e um horário.',
      support: 'Atendimento. Estamos aqui para ajudar você.',
    };
    speak(copy[screen]);
  };

  if (!authReady) {
    return <div className={`app-shell text-${textSize} ${highContrast ? 'high-contrast' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}><div className="loading-screen"><span className="brand-mark"><HeartIcon /></span><p>Carregando Saúde Fácil…</p></div></div>;
  }

  if (!session) {
    return <div className={`app-shell text-${textSize} ${highContrast ? 'high-contrast' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}><LoginScreen voiceEnabled={voiceEnabled} /></div>;
  }

  const userName = session.user.email?.split('@')[0] || 'Maria';

  return (
    <div className={`app-shell text-${textSize} ${highContrast ? 'high-contrast' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}>
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand" onClick={() => navigate('home')} aria-label="Ir para o início">
            <span className="brand-mark"><HeartIcon /></span>
            <span><strong>Saúde Fácil</strong><small>Cuidado que entende você</small></span>
          </button>
          <div className="top-actions">
            <button className="outline-button compact" onClick={() => navigate('accessibility')}><Accessibility size={20} /><span>Acessibilidade</span></button>
            <button className="outline-button compact" onClick={readScreen}><Volume2 size={20} /><span>Ouvir</span></button>
            <button className="outline-button compact sign-out-button" onClick={handleSignOut} aria-label="Sair da conta"><LogOut size={20} /><span>Sair</span></button>
            <button className="menu-button" aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)}><Menu size={24} /></button>
          </div>
        </div>
        {menuOpen && <nav className="quick-menu" aria-label="Menu rápido"><button onClick={() => navigate('home')}><Home size={20} /> Início</button><button onClick={() => navigate('support')}><Phone size={20} /> Atendimento</button><button onClick={() => navigate('accessibility')}><Accessibility size={20} /> Acessibilidade</button><button onClick={handleSignOut}><LogOut size={20} /> Sair da conta</button></nav>}
      </header>

      <main className="main-content" id="main-content">
        {notice && <div className={`notice ${notice.tone}`} role="alert" aria-live="polite"><span className="notice-icon">{notice.tone === 'success' ? <Check size={22} /> : notice.tone === 'warning' ? <AlertCircle size={22} /> : <Info size={22} />}</span><span>{notice.message}</span><button aria-label="Fechar aviso" onClick={() => setNotice(null)}><X size={20} /></button></div>}
        {screen === 'home' && <HomeScreen navigate={navigate} appointments={appointments} userName={userName} />}
        {screen === 'appointments' && <AppointmentsScreen appointments={appointments} navigate={navigate} onSelect={setSelectedAppointment} onCancel={setCancelTarget} />}
        {screen === 'medications' && <MedicationsScreen navigate={navigate} voiceEnabled={voiceEnabled} />}
        {screen === 'exams' && <ExamsScreen navigate={navigate} announce={announce} />}
        {screen === 'help' && <HelpScreen navigate={navigate} voiceEnabled={voiceEnabled} />}
        {screen === 'accessibility' && <AccessibilityScreen textSize={textSize} setTextSize={setTextSize} highContrast={highContrast} setHighContrast={setHighContrast} voiceEnabled={voiceEnabled} setVoiceEnabled={setVoiceEnabled} reduceMotion={reduceMotion} setReduceMotion={setReduceMotion} navigate={navigate} />}
        {screen === 'booking' && <BookingScreen navigate={navigate} onConfirm={(appointment) => { setAppointments((current) => [...current, { ...appointment, id: Date.now() }]); announce('Consulta marcada com sucesso!'); navigate('appointments'); }} />}
        {screen === 'support' && <SupportScreen navigate={navigate} announce={announce} />}
      </main>

      {selectedAppointment && <AppointmentModal appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} onCancel={() => { setCancelTarget(selectedAppointment); setSelectedAppointment(null); }} voiceEnabled={voiceEnabled} />}
      {cancelTarget && <ConfirmModal title="Cancelar consulta?" description={`Deseja realmente cancelar a consulta de ${cancelTarget.specialty} com ${cancelTarget.doctor}?`} onClose={() => setCancelTarget(null)} onConfirm={() => { setAppointments((current) => current.filter((item) => item.id !== cancelTarget.id)); setCancelTarget(null); announce('Consulta cancelada.'); }} />}
      <BottomNav screen={screen} navigate={navigate} />
    </div>
  );
}

function HeartIcon() { return <Activity size={25} strokeWidth={2.5} />; }

function LoginScreen({ voiceEnabled }: { voiceEnabled: boolean }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) { setError('Por favor, preencha seu e-mail e sua senha.'); return; }
    setLoading(true); setError('');
    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setError(''); setMode('login'); setEmail(''); setPassword('');
        if (voiceEnabled) speak('Conta criada com sucesso. Agora você pode entrar.');
      }
    } catch {
      setError('Não foi possível entrar. Confira seu e-mail e senha e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand"><span className="brand-mark large"><HeartIcon /></span><div><strong>Saúde Fácil</strong><small>Cuidado que entende você</small></div></div>
        <p className="eyebrow center">{mode === 'login' ? 'Bem-vindo de volta' : 'Criar sua conta'}</p>
        <h1>{mode === 'login' ? 'Entrar na sua conta' : 'Vamos criar seu acesso'}</h1>
        <p className="login-subtitle">Use seu e-mail e senha para acessar seus serviços de saúde.</p>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">E-mail</label>
          <div className="input-wrap"><Mail size={20} className="input-icon" /><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@exemplo.com" autoComplete="email" required /></div>
          <label htmlFor="password">Senha</label>
          <div className="input-wrap"><Lock size={20} className="input-icon" /><input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>
          {error && <div className="login-error" role="alert"><AlertCircle size={20} /><span>{error}</span></div>}
          <button type="submit" className="primary-button full-width" disabled={loading}>{loading ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar conta'} {mode === 'login' ? <ArrowRight size={20} /> : <UserPlus size={20} />}</button>
        </form>
        <div className="login-switch">{mode === 'login' ? <p>Não tem uma conta? <button onClick={() => { setMode('signup'); setError(''); }}>Criar conta</button></p> : <p>Já tem uma conta? <button onClick={() => { setMode('login'); setError(''); }}>Entrar</button></p>}</div>
        <div className="login-trust"><ShieldCheck size={22} /><span>Seus dados estão protegidos com segurança.</span></div>
      </div>
    </div>
  );
}
function BackButton({ navigate, label = 'Voltar' }: { navigate: (screen: Screen) => void; label?: string }) { return <button className="back-button" onClick={() => navigate('home')}><ArrowLeft size={21} /> {label}</button>; }
function PageHeader({ eyebrow, title, description, navigate }: { eyebrow?: string; title: string; description?: string; navigate: (screen: Screen) => void }) { return <div className="page-header"><BackButton navigate={navigate} /><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>; }

function HomeScreen({ navigate, appointments, userName }: { navigate: (screen: Screen) => void; appointments: Appointment[]; userName: string }) {
  const actions = [
    { title: 'Marcar consulta', desc: 'Escolha um profissional e horário', icon: <CalendarDays />, screen: 'booking' as Screen, className: 'blue' },
    { title: 'Minhas consultas', desc: appointments.length ? `${appointments.length} consulta${appointments.length > 1 ? 's' : ''} marcada${appointments.length > 1 ? 's' : ''}` : 'Nenhuma consulta marcada', icon: <Stethoscope />, screen: 'appointments' as Screen, className: 'teal' },
    { title: 'Meus medicamentos', desc: 'Veja seus horários e orientações', icon: <Syringe />, screen: 'medications' as Screen, className: 'green' },
    { title: 'Meus exames', desc: 'Acesse seus resultados', icon: <FileText />, screen: 'exams' as Screen, className: 'gold' },
    { title: 'Atendimento', desc: 'Estamos aqui para ajudar', icon: <Phone />, screen: 'support' as Screen, className: 'coral' },
  ];
  return <>
    <section className="welcome-panel"><div><p className="eyebrow">Quarta-feira, 12 de agosto</p><h1>Olá, {userName}<span className="punctuation">!</span></h1><p className="welcome-copy">Como podemos ajudar você hoje?</p></div><div className="welcome-illustration" aria-hidden="true"><ShieldCheck size={44} /><span>Seu cuidado<br />em boas mãos</span></div></section>
    <section className="section-block"><div className="section-heading"><div><p className="eyebrow">Acesso rápido</p><h2>Escolha uma opção</h2></div><span className="step-hint">Toque para acessar</span></div><div className="service-grid">{actions.map((action) => <button key={action.title} className={`service-card ${action.className}`} onClick={() => navigate(action.screen)}><span className="service-icon">{action.icon}</span><span className="service-content"><strong>{action.title}</strong><small>{action.desc}</small></span><ArrowRight className="service-arrow" size={23} /></button>)}</div></section>
    <section className="reassurance-card"><span className="reassurance-icon"><ShieldCheck size={24} /></span><div><strong>Seus dados estão protegidos</strong><p>Esta é uma demonstração com dados fictícios.</p></div></section>
  </>;
}

function AppointmentsScreen({ appointments, navigate, onSelect, onCancel }: { appointments: Appointment[]; navigate: (screen: Screen) => void; onSelect: (appointment: Appointment) => void; onCancel: (appointment: Appointment) => void }) {
  return <><PageHeader eyebrow="Cuidado contínuo" title="Minhas consultas" description="Veja seus próximos compromissos de saúde." navigate={navigate} /><div className="toolbar"><span className="count-pill"><CalendarDays size={18} /> {appointments.length} {appointments.length === 1 ? 'consulta marcada' : 'consultas marcadas'}</span><button className="primary-button small" onClick={() => navigate('booking')}><Plus size={19} /> Marcar outra</button></div><div className="stack-list">{appointments.length ? appointments.map((item) => <article className="appointment-card" key={item.id}><div className="date-badge"><strong>{item.date.split(' ')[0]}</strong><span>AGO</span></div><div className="appointment-main"><span className="card-label">PRÓXIMA CONSULTA</span><h2>{item.specialty}</h2><p><Stethoscope size={18} /> {item.doctor}</p><p><Clock3 size={18} /> {item.time}</p><p><MapPin size={18} /> {item.location}</p><div className="card-actions"><button className="outline-button" onClick={() => onSelect(item)}>Ver detalhes</button><button className="text-button danger-text" onClick={() => onCancel(item)}>Cancelar</button></div></div></article>) : <EmptyState icon={<CalendarDays />} title="Você não tem consultas marcadas" description="Quando marcar uma consulta, ela aparecerá aqui." action="Marcar consulta" onAction={() => navigate('booking')} />}</div></>;
}

function MedicationsScreen({ navigate, voiceEnabled }: { navigate: (screen: Screen) => void; voiceEnabled: boolean }) {
  return <><PageHeader eyebrow="Sua rotina de cuidado" title="Meus medicamentos" description="Organizamos seus horários para ficar mais fácil lembrar." navigate={navigate} /><div className="reminder-banner"><BellRing size={25} /><div><strong>Próximo horário hoje</strong><span>Losartana às 08:00</span></div><span className="status-tag">Tomar hoje</span></div><div className="stack-list"><article className="medication-card"><div className="medication-icon"><Syringe size={28} /></div><div className="medication-content"><div className="card-label">MEDICAMENTO DE USO DIÁRIO</div><h2>Losartana 50 mg</h2><div className="medication-details"><span><Clock3 size={18} /> 08:00</span><span><RotateCcw size={18} /> 1 vez ao dia</span></div><p className="muted-copy">Siga sempre a orientação do seu médico.</p><button className="outline-button" onClick={() => voiceEnabled && speak('Losartana 50 miligramas. Tomar às oito horas, uma vez ao dia.') }><Volume2 size={18} /> Ouvir orientação</button></div></article></div><InfoBox text="Não altere seus medicamentos sem conversar com um profissional de saúde." /></>;
}

function ExamsScreen({ navigate, announce }: { navigate: (screen: Screen) => void; announce: (message: string, tone?: Notice['tone']) => void }) { return <><PageHeader eyebrow="Resultados" title="Meus exames" description="Seus resultados ficam organizados e fáceis de encontrar." navigate={navigate} /><div className="stack-list"><article className="exam-card"><div className="exam-icon"><FileText size={29} /></div><div className="exam-content"><div className="card-label">10 DE AGOSTO DE 2026</div><h2>Exame de sangue</h2><p>Solicitado pela Clínica Saúde Fácil</p><span className="result-status"><Check size={17} /> Resultado disponível</span><button className="primary-button full-mobile" onClick={() => announce('O resultado do exame de sangue está disponível para visualização.', 'info')}><FileText size={19} /> Ver resultado</button></div></article></div><InfoBox text="Os resultados desta demonstração são fictícios e não representam dados médicos reais." /></>; }

function HelpScreen({ navigate, voiceEnabled }: { navigate: (screen: Screen) => void; voiceEnabled: boolean }) { const questions = ['Como marcar uma consulta?', 'Como visualizar minha consulta?', 'Como aumentar o tamanho das letras?', 'Como ativar a leitura por voz?', 'Como entrar em contato com atendimento?']; const answers = ['Toque em “Marcar consulta” na tela inicial e siga as etapas. É rápido e simples.', 'Toque em “Minhas consultas” na tela inicial para ver todos os detalhes.', 'Abra “Acessibilidade” no topo e escolha o tamanho que for mais confortável.', 'Abra “Acessibilidade” e ative a opção “Leitura por voz”.', 'Toque em “Atendimento” e escolha ligar ou enviar uma mensagem.']; const [open, setOpen] = useState<number | null>(null); return <><PageHeader eyebrow="Estamos com você" title="Como podemos ajudar?" description="Toque em uma pergunta para ver a resposta." navigate={navigate} /><div className="faq-list">{questions.map((question, index) => <div className={`faq-item ${open === index ? 'open' : ''}`} key={question}><button onClick={() => { setOpen(open === index ? null : index); if (voiceEnabled) speak(`${question}. ${answers[index]}`); }} aria-expanded={open === index}><span className="faq-number">{index + 1}</span><strong>{question}</strong><ChevronDown size={22} /></button>{open === index && <p>{answers[index]}</p>}</div>)}</div><div className="help-footer"><HelpCircle size={28} /><div><strong>Não encontrou o que precisava?</strong><p>Fale com nossa equipe de atendimento.</p></div><button className="outline-button" onClick={() => navigate('support')}>Pedir ajuda</button></div></>; }

function AccessibilityScreen({ textSize, setTextSize, highContrast, setHighContrast, voiceEnabled, setVoiceEnabled, reduceMotion, setReduceMotion, navigate }: { textSize: TextSize; setTextSize: (size: TextSize) => void; highContrast: boolean; setHighContrast: (value: boolean) => void; voiceEnabled: boolean; setVoiceEnabled: (value: boolean) => void; reduceMotion: boolean; setReduceMotion: (value: boolean) => void; navigate: (screen: Screen) => void }) { return <><PageHeader eyebrow="Personalize sua experiência" title="Acessibilidade" description="Escolha as opções que deixam o Saúde Fácil melhor para você." navigate={navigate} /><div className="settings-list"><section className="setting-card"><div className="setting-heading"><span className="setting-icon"><Accessibility size={24} /></span><div><h2>Tamanho do texto</h2><p>Escolha o tamanho mais confortável para ler.</p></div></div><div className="text-size-options"><button className={textSize === 'normal' ? 'selected' : ''} onClick={() => setTextSize('normal')}><span className="a-small">A</span><strong>Normal</strong></button><button className={textSize === 'large' ? 'selected' : ''} onClick={() => setTextSize('large')}><span className="a-medium">A</span><strong>Grande</strong></button><button className={textSize === 'xlarge' ? 'selected' : ''} onClick={() => setTextSize('xlarge')}><span className="a-large">A</span><strong>Muito grande</strong></button></div></section><ToggleSetting icon={<ContrastIcon />} title="Alto contraste" description="Aumenta a diferença entre textos e fundos." value={highContrast} onChange={setHighContrast} /><ToggleSetting icon={<Volume2 />} title="Leitura por voz" description="Permite ouvir informações importantes em voz alta." value={voiceEnabled} onChange={setVoiceEnabled} /><ToggleSetting icon={<Activity />} title="Reduzir animações" description="Deixa os movimentos da tela mais discretos." value={reduceMotion} onChange={setReduceMotion} /></div><div className="settings-note"><ShieldCheck size={22} /><span>Suas escolhas ficam salvas automaticamente neste aparelho.</span></div><button className="primary-button settings-done" onClick={() => navigate('home')}><Check size={20} /> Concluir</button></>; }
function ContrastIcon() { return <span className="contrast-icon">◐</span>; }
function ToggleSetting({ icon, title, description, value, onChange }: { icon: ReactNode; title: string; description: string; value: boolean; onChange: (value: boolean) => void }) { return <section className="setting-card toggle-card"><div className="setting-heading"><span className="setting-icon">{icon}</span><div><h2>{title}</h2><p>{description}</p></div></div><button className={`toggle ${value ? 'on' : ''}`} role="switch" aria-checked={value} aria-label={`${title}: ${value ? 'ativado' : 'desativado'}`} onClick={() => onChange(!value)}><span>{value ? 'Ativado' : 'Desativado'}</span><i /></button></section>; }

function BookingScreen({ navigate, onConfirm }: { navigate: (screen: Screen) => void; onConfirm: (appointment: Appointment) => void }) { const [step, setStep] = useState(1); const [specialty, setSpecialty] = useState(specialties[0].name); const [doctor, setDoctor] = useState(specialties[0].doctors[0]); const [date, setDate] = useState(dates[0]); const [time, setTime] = useState(times[2]); const currentSpecialty = useMemo(() => specialties.find((item) => item.name === specialty) || specialties[0], [specialty]); const chooseSpecialty = (value: string) => { setSpecialty(value); const match = specialties.find((item) => item.name === value); setDoctor(match?.doctors[0] || ''); }; return <><PageHeader eyebrow="Novo cuidado" title="Marcar consulta" description="Vamos fazer isso juntos, em poucos passos." navigate={navigate} /><div className="progress"><div className="progress-line"><span style={{ width: `${step * 25}%` }} /></div><div className="progress-labels"><span className={step >= 1 ? 'active' : ''}>Especialidade</span><span className={step >= 2 ? 'active' : ''}>Profissional</span><span className={step >= 3 ? 'active' : ''}>Data e hora</span><span className={step >= 4 ? 'active' : ''}>Confirmar</span></div></div><section className="booking-card">{step === 1 && <ChoiceStep title="Qual especialidade você precisa?" options={specialties.map((item) => item.name)} value={specialty} onChange={chooseSpecialty} onNext={() => setStep(2)} />}{step === 2 && <ChoiceStep title="Escolha o profissional" options={currentSpecialty.doctors} value={doctor} onChange={setDoctor} onBack={() => setStep(1)} onNext={() => setStep(3)} />}{step === 3 && <div className="choice-step"><h2>Escolha o melhor dia e horário</h2><label>Data da consulta</label><div className="choice-options two-columns">{dates.map((item) => <button className={date === item ? 'choice selected' : 'choice'} onClick={() => setDate(item)} key={item}>{item}</button>)}</div><label>Horário</label><div className="choice-options time-grid">{times.map((item) => <button className={time === item ? 'choice selected' : 'choice'} onClick={() => setTime(item)} key={item}>{item}</button>)}</div><StepActions onBack={() => setStep(2)} onNext={() => setStep(4)} /></div>}{step === 4 && <div className="confirm-step"><span className="confirm-icon"><CalendarDays size={31} /></span><h2>Confira sua consulta</h2><p>Está tudo certo? Confirme para finalizar.</p><div className="summary-box"><SummaryRow label="Especialidade" value={specialty} /><SummaryRow label="Profissional" value={doctor} /><SummaryRow label="Data" value={date} /><SummaryRow label="Horário" value={time} /><SummaryRow label="Local" value="Clínica Saúde Fácil — Sala 3" /></div><StepActions onBack={() => setStep(3)} onNext={() => onConfirm({ id: 0, specialty, doctor, date, time, location: 'Clínica Saúde Fácil — Sala 3' })} nextLabel="Confirmar consulta" /></div>}</section></>; }
function ChoiceStep({ title, options, value, onChange, onNext, onBack }: { title: string; options: string[]; value: string; onChange: (value: string) => void; onNext: () => void; onBack?: () => void }) { return <div className="choice-step"><h2>{title}</h2><div className="choice-options">{options.map((item) => <button className={value === item ? 'choice selected' : 'choice'} onClick={() => onChange(item)} key={item}><span>{item}</span>{value === item && <Check size={21} />}</button>)}</div><StepActions onBack={onBack} onNext={onNext} /></div>; }
function StepActions({ onBack, onNext, nextLabel = 'Continuar' }: { onBack?: () => void; onNext: () => void; nextLabel?: string }) { return <div className="step-actions">{onBack && <button className="outline-button" onClick={onBack}><ArrowLeft size={19} /> Voltar</button>}<button className="primary-button" onClick={onNext}>{nextLabel} <ArrowRight size={19} /></button></div>; }
function SummaryRow({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }

function SupportScreen({ navigate, announce }: { navigate: (screen: Screen) => void; announce: (message: string, tone?: Notice['tone']) => void }) { return <><PageHeader eyebrow="Estamos aqui" title="Atendimento" description="Escolha a forma mais confortável para pedir ajuda." navigate={navigate} /><div className="support-card"><div className="support-avatar"><Phone size={30} /></div><h2>Como podemos ajudar?</h2><p>Nossa equipe está pronta para orientar você.</p><div className="support-actions"><button className="support-action primary" onClick={() => announce('A ligação para o atendimento foi simulada. Em uma versão completa, ela seria iniciada agora.', 'info')}><Phone size={25} /><span><strong>Ligar para atendimento</strong><small>Falar com uma pessoa</small></span><ArrowRight size={20} /></button><button className="support-action" onClick={() => announce('Sua mensagem foi registrada. Nossa equipe responderá em breve.', 'success')}><MessageCircle size={25} /><span><strong>Enviar mensagem</strong><small>Escrever para a equipe</small></span><ArrowRight size={20} /></button><button className="support-action" onClick={() => announce('Pedido de ajuda registrado. Nossa equipe entrará em contato.', 'success')}><HelpCircle size={25} /><span><strong>Preciso de ajuda</strong><small>Solicitar orientação</small></span><ArrowRight size={20} /></button></div></div></>; }
function InfoBox({ text }: { text: string }) { return <div className="info-box"><Info size={22} /><span>{text}</span></div>; }
function EmptyState({ icon, title, description, action, onAction }: { icon: ReactNode; title: string; description: string; action: string; onAction: () => void }) { return <div className="empty-state"><span>{icon}</span><h2>{title}</h2><p>{description}</p><button className="primary-button" onClick={onAction}>{action}</button></div>; }
function AppointmentModal({ appointment, onClose, onCancel, voiceEnabled }: { appointment: Appointment; onClose: () => void; onCancel: () => void; voiceEnabled: boolean }) { return <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="appointment-title"><button className="modal-close" onClick={onClose} aria-label="Fechar"><X size={22} /></button><span className="modal-icon"><CalendarDays size={27} /></span><p className="eyebrow">Detalhes da consulta</p><h2 id="appointment-title">{appointment.specialty}</h2><div className="modal-details"><SummaryRow label="Profissional" value={appointment.doctor} /><SummaryRow label="Data" value={appointment.date} /><SummaryRow label="Horário" value={appointment.time} /><SummaryRow label="Local" value={appointment.location} /></div><div className="modal-actions"><button className="outline-button" onClick={() => voiceEnabled && speak(`Consulta de ${appointment.specialty}, com ${appointment.doctor}, dia ${appointment.date}, às ${appointment.time}.`)}><Volume2 size={18} /> Ouvir</button><button className="text-button danger-text" onClick={onCancel}>Cancelar consulta</button></div></div></div>; }
function ConfirmModal({ title, description, onClose, onConfirm }: { title: string; description: string; onClose: () => void; onConfirm: () => void }) { return <div className="modal-backdrop"><div className="modal confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><span className="warning-icon"><AlertCircle size={28} /></span><h2 id="confirm-title">{title}</h2><p>{description}</p><div className="modal-actions"><button className="outline-button" onClick={onClose}>Não, voltar</button><button className="danger-button" onClick={onConfirm}>Sim, cancelar</button></div></div></div>; }
function BottomNav({ screen, navigate }: { screen: Screen; navigate: (screen: Screen) => void }) { const items = [{ label: 'Início', icon: <Home />, screen: 'home' as Screen }, { label: 'Consultas', icon: <CalendarDays />, screen: 'appointments' as Screen }, { label: 'Medicamentos', icon: <Syringe />, screen: 'medications' as Screen }, { label: 'Ajuda', icon: <HelpCircle />, screen: 'help' as Screen }]; return <nav className="bottom-nav" aria-label="Navegação principal">{items.map((item) => <button className={screen === item.screen ? 'active' : ''} onClick={() => navigate(item.screen)} key={item.label}>{item.icon}<span>{item.label}</span></button>)}</nav>; }

export default App;
