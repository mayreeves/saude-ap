import React from 'react';
import { 
  GraduationCap, 
  Heart, 
  ShieldCheck, 
  Users, 
  Accessibility, 
  Volume2, 
  AlertOctagon, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  Laptop, 
  Award, 
  BookOpen, 
  Cpu, 
  Target, 
  AlertTriangle,
  Lightbulb,
  FileCheck,
  Radio,
  Eye
} from 'lucide-react';
import { AppMode } from '../types';
import { soundFx, speakText } from '../utils/audio';

interface TccPresentationProps {
  setAppMode: (mode: AppMode) => void;
}

export const TccPresentation: React.FC<TccPresentationProps> = ({ setAppMode }) => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20 px-2 sm:px-4">
      
      {/* Hero Banner with Academic Header */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-sky-950 text-white rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-700">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Trabalho de Conclusão de Curso (TCC)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Inclusão Digital na Saúde: <br className="hidden sm:inline" />
            <span className="text-sky-400">Acessibilidade Mobile para Idosos</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-semibold leading-relaxed">
            Desenvolvimento da plataforma <strong className="text-white">Conectiva Saúde</strong> como resposta aos desafios de usabilidade, adesão farmacológica e socorro emergencial para a terceira idade.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-bold text-slate-300 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-400" />
              <span>Autora / Aluna: <strong className="text-white">Maynara M.M.</strong></span>
            </div>
            <span>•</span>
            <div>Tema: Inclusão Digital & Saúde Acessível</div>
            <span>•</span>
            <div>Ano: 2026</div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                setAppMode('senior');
                speakText('Iniciando o protótipo no Modo Idoso.');
              }}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <Smartphone className="w-5 h-5" />
              <span>Testar Protótipo Interativo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Slogan Destaque */}
      <section className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-8 text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-sky-950">
          “Conectiva Saúde — Tecnologia para cuidar de quem você ama.”
        </h2>
        <p className="text-base sm:text-lg font-extrabold text-sky-800">
          “Mais autonomia para o idoso. Mais tranquilidade para a família.”
        </p>
      </section>

      {/* 1. Introdução e Contexto */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-sky-700">
          <BookOpen className="w-7 h-7" />
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">1. Introdução & Contexto</h2>
        </div>
        <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
          A transformação digital trouxe avanços sem precedentes para a gestão da saúde através de aplicativos para agendamentos, teleconsultas e laudos de exames laboratoriais. Entretanto, grande parte da população idosa brasileira enfrenta severas barreiras cognitivas, visuais e motoras ao interagir com interfaces tradicionais projetadas sem conformidade ergonômica, gerando exclusão digital e dependência excessiva de terceiros.
        </p>
      </section>

      {/* 2. O Problema Identificado */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle className="w-7 h-7" />
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">2. O Problema Identificado</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50/70 border-2 border-red-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-lg font-black text-red-950 flex items-center gap-2">
              <span>Barreiras nos Aplicativos Atuais</span>
            </h3>
            <ul className="space-y-2 text-sm font-bold text-red-900 list-disc list-inside">
              <li>Fontes reduzidas, contraste deficiente e ícones abstratos.</li>
              <li>Navegação com fluxos complexos e excesso de opções por tela.</li>
              <li>Vocabulário médico rebuscado e mensagens de erro confusas.</li>
              <li>Falta de suporte para interação multimodal (voz e sintetizador).</li>
            </ul>
          </div>

          <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-lg font-black text-amber-950 flex items-center gap-2">
              <span>Consequências Críticas</span>
            </h3>
            <ul className="space-y-2 text-sm font-bold text-amber-900 list-disc list-inside">
              <li>Abandono ou atraso de tratamentos e esquecimento de medicamentos.</li>
              <li>Perda de consultas de rotina e acompanhamentos preventivos.</li>
              <li>Insegurança em episódios de emergência doméstica (quedas, mal-estar).</li>
              <li>Sobrecarga emocional sobre os cuidadores e familiares.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Objetivos do TCC */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-emerald-600">
          <Target className="w-7 h-7" />
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">3. Objetivos do Projeto</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              1
            </div>
            <h3 className="font-black text-emerald-950 text-base">Objetivo Geral</h3>
            <p className="text-xs sm:text-sm font-semibold text-emerald-900 leading-relaxed">
              Desenvolver uma solução mobile altamente acessível para aproximar os idosos dos serviços digitais de saúde de forma autônoma.
            </p>
          </div>

          <div className="bg-sky-50 border border-sky-200 p-5 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black">
              2
            </div>
            <h3 className="font-black text-sky-950 text-base">Melhorar a UX Geriátrica</h3>
            <p className="text-xs sm:text-sm font-semibold text-sky-900 leading-relaxed">
              Reduzir a carga cognitiva com botões táteis ampliados, feedback auditivo por voz, linguagem simples e poucos cliques por tarefa.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-5 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
              3
            </div>
            <h3 className="font-black text-purple-950 text-base">Inclusão Digital & Autonomia</h3>
            <p className="text-xs sm:text-sm font-semibold text-purple-900 leading-relaxed">
              Promover a segurança familiar com o botão SOCORRO instantâneo, monitoramento de adesão a remédios e gestão multidoso.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Público-Alvo */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-blue-700">
          <Users className="w-7 h-7" />
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">4. Público-Alvo Mapeado</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-3xl">👵👴</div>
            <h3 className="font-black text-slate-900 text-base">Idosos (60+ anos)</h3>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Pessoas com limitações visuais ou pouca intimidade digital, que necessitam de interface limpa e intuitiva.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-3xl">👨👩👧</div>
            <h3 className="font-black text-slate-900 text-base">Cuidadores e Familiares</h3>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Filhos, netos e cuidadores de enfermagem que administram o cuidado de um ou múltiplos idosos simultaneamente.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-3xl">🏥</div>
            <h3 className="font-black text-slate-900 text-base">Instituições de Saúde</h3>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Clínicas, postos do SUS e hospitais que buscam reduzir faltas e humanizar a telemedicina para idosos.
            </p>
          </div>
        </div>
      </section>

      {/* 5. A Solução Cuidar+ & Pilares de Acessibilidade */}
      <section className="bg-gradient-to-br from-sky-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-sky-400" />
          <h2 className="text-2xl sm:text-3xl font-black">5. Solução Cuidar+ & Pilares WCAG 2.2 AAA</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2">
            <span className="text-sky-300 font-black text-sm block">🔤 Tipografia Ajustável</span>
            <p className="text-slate-300 font-medium">
              Controle de tamanho de fonte dinâmico (Normal, Grande 22px, Extra Grande 26px) para atender presbiopia e baixa visão.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2">
            <span className="text-yellow-300 font-black text-sm block">🌓 Alto Contraste</span>
            <p className="text-slate-300 font-medium">
              Paleta com taxa de contraste superior a 7:1 (padrão WCAG AAA), dispensando fundos transparentes confusos.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2">
            <span className="text-emerald-300 font-black text-sm block">🎙️ Multimodalidade (Voz)</span>
            <p className="text-slate-300 font-medium">
              Síntese de fala em português (SpeechSynthesis) e reconhecimento de comandos com Speech-to-Text nativo.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2">
            <span className="text-red-300 font-black text-sm block">🚨 Botão de SOS Seguro</span>
            <p className="text-slate-300 font-medium">
              Acionamento por toque ou voz com contagem de cancelamento de 5 segundos, geolocalização e alarme acústico.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Mapeamento de Funcionalidades Desenvolvidas */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-sky-700">
          <FileCheck className="w-7 h-7" />
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">6. Mapeamento das Funcionalidades do Protótipo</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-bold text-slate-700">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-sky-700 font-black">🩺 Agendamento & Telemedicina</span>
            <p className="text-xs text-slate-600 font-semibold">
              Visualização de consultas futuras com data ampliada e simulação de vídeo-chamada interativa com médico e chat assistivo.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-emerald-700 font-black">💊 Gestão Farmacológica ("Tomei")</span>
            <p className="text-xs text-slate-600 font-semibold">
              Cartões de remédios com botões táteis "Tomei" e "Lembrar depois", feedback sonoro e sincronização com a família.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-purple-700 font-black">🧪 Exames em Linguagem Simples</span>
            <p className="text-xs text-slate-600 font-semibold">
              Tradução de laudos laboratoriais complexos em termos claros e acolhedores, com botão para ouvir o resultado por voz.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-amber-700 font-black">👨👩👧 Gestão de Vários Idosos ("Meus Idosos")</span>
            <p className="text-xs text-slate-600 font-semibold">
              Painel do cuidador para monitorar múltiplos idosos (mãe, pai, avó) em um único dashboard com alertas de socorro em tempo real.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Conclusão do TCC */}
      <section className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 text-emerald-800">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          <h2 className="text-2xl sm:text-3xl font-black">7. Conclusão do Trabalho</h2>
        </div>

        <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-semibold">
          O projeto <strong>Cuidar+</strong> demonstra que a inclusão digital na terceira idade não exige abrir mão de recursos tecnológicos modernos, mas sim desenhá-los com ergonomia, empatia e acessibilidade em primeiro lugar. Ao unir comandos por voz, tipografia generosa, simplificação de laudos e acionamento de emergência transparente, o sistema devolve autonomia aos idosos e confere paz de espírito às suas famílias.
        </p>
      </section>

      {/* 8. Rodapé de Créditos do TCC (Conforme Solicitado) */}
      <footer className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-xl border border-slate-800">
        <div className="flex justify-center">
          <img
            src="/logo.jpg"
            alt="Cuidar+ Logo"
            className="w-20 h-20 rounded-3xl object-cover shadow-2xl border-2 border-sky-400"
          />
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black">
            Cuidar<span className="text-sky-400">+</span>
          </h3>
          <p className="text-sky-300 text-base font-bold">
            Tecnologia para cuidar de quem você ama.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs sm:text-sm font-bold text-slate-400 space-y-1">
          <div>Aluna: <strong className="text-white">Maynara M.M.</strong></div>
          <div>Trabalho de Conclusão de Curso — Inclusão Digital na Saúde</div>
          <div>Acessibilidade Mobile para Idosos · 2026</div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              soundFx.playClick();
              setAppMode('senior');
            }}
            className="bg-white hover:bg-slate-100 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-colors inline-flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-sky-600" />
            <span>Voltar ao Protótipo do Aplicativo</span>
          </button>
        </div>
      </footer>

    </div>
  );
};
