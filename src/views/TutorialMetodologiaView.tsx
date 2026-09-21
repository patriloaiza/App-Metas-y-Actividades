import React, { useState } from 'react';
import { useApp, TabType } from '../context/AppContext';
import {
  Play,
  Video,
  Edit3,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Layers,
  Calendar,
  Flame,
  Target,
  Compass,
  BookOpen,
  Scale,
  Save
} from 'lucide-react';

interface TabGuideInfo {
  id: string;
  tabKey: TabType;
  nombre: string;
  icono: React.ReactNode;
  tagline: string;
  paraQueSirve: string;
  comoSeUsa: string[];
  consejoPatricia: string;
  videoTimestamp?: string;
}

export const TutorialMetodologiaView: React.FC = () => {
  const { setActiveTab } = useApp();

  // Custom Video URL with persistence
  const [videoUrl, setVideoUrl] = useState<string>(() => {
    return localStorage.getItem('cm_tutorial_video_url') || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  });
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [tempVideoUrl, setTempVideoUrl] = useState(videoUrl);

  const [selectedGuideTab, setSelectedGuideTab] = useState<string>('general');

  const handleSaveVideoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setVideoUrl(tempVideoUrl);
    localStorage.setItem('cm_tutorial_video_url', tempVideoUrl);
    setIsEditingVideo(false);
  };

  const tabsGuides: TabGuideInfo[] = [
    {
      id: 'general',
      tabKey: 'tutorial',
      nombre: 'Visión General del Sistema CM',
      icono: <Sparkles className="w-4 h-4 text-red-500" />,
      tagline: 'De la dispersión al foco implacable en creación y monetización',
      paraQueSirve: 'Este sistema es tu centro de operaciones diario y estratégico dentro de la consultoría de Patricia Loaiza. Une tu visión a largo plazo con la acción que genera facturación hoy, protegiendo tu salud y energía personal.',
      comoSeUsa: [
        '1. Abre la herramienta al iniciar tu día de trabajo o en tu ritual de la mañana.',
        '2. Revisa tu "Foco Diario" para saber exactamente cuáles son tus bloques no negociables de hoy.',
        '3. Conecta cada tarea con tu "Roadmap en Cascada" para que nunca trabajes en vacío.',
        '4. Al finalizar la semana, completa tu "Bitácora de Sabiduría" para evaluar resultados y ajustar.'
      ],
      consejoPatricia: '«No necesitas más horas en el día, necesitas que cada hora esté vinculada a una oferta, un cliente o un avance tangible. Si no mueve la aguja de tu facturación o de tu paz mental, no va en tu agenda de la mañana.»'
    },
    {
      id: 'foco',
      tabKey: 'inicio',
      nombre: '1. Foco Diario & Sesiones BCM',
      icono: <Target className="w-4 h-4 text-red-500" />,
      tagline: 'La ejecución del día: prioridades de monetización y bloques BCM de concentración profunda',
      paraQueSirve: 'Sirve para erradicar la procrastinación y la fatiga por decisión. Te dice con absoluta claridad qué 2 o 3 acciones debes culminar hoy para considerar tu jornada un éxito rotundo.',
      comoSeUsa: [
        'Identifica tus 3 Chispas Diarias de Alto Impacto vinculadas a tu meta semanal.',
        'Activa la Sesión BCM (Bloque de Creación & Monetización) de 90 o 60 minutos con sonido binaural integrado.',
        'Envía las tareas reactivas (correos, facturas, mensajes) al "Bloque de Tarde" para no interrumpir tu pico de energía.',
        'Marca tus hábitos diarios en la matriz rápida de sostenibilidad.'
      ],
      consejoPatricia: '«Haz lo que genera tracción antes del mediodía. Las tareas operativas se hacen con la energía restante de la tarde.»'
    },
    {
      id: 'roadmap',
      tabKey: 'plan',
      nombre: '2. Desglose del Motor (Crear a Monetizar)',
      icono: <Layers className="w-4 h-4 text-red-500" />,
      tagline: 'Aterrizaje en 5 niveles: Motor Anual ➔ Engranaje ➔ Componente ➔ Ajuste ➔ Chispa Diaria',
      paraQueSirve: 'Descompone grandes metas de facturación o consultoría en pasos matemáticamente digeribles. Cada Chispa Diaria de hoy tiene trazabilidad directa con tu Motor de Monetización Anual.',
      comoSeUsa: [
        'Nivel 1 (Motor de Monetización Anual): Define tu meta y maquinaria macro de facturación y negocio.',
        'Nivel 2 (Engranaje Principal Trimestral): Qué sistema construyes en cada trimestre (oferta, validación, escalado).',
        'Nivel 3 (Componente del Mes): Activos y entregables clave con fecha fija.',
        'Nivel 4 (Ajuste y Entregable Semanal): Tu calibración semanal de entregables.',
        'Nivel 5 (Chispa Diaria): Acciones atómicas que aparecen automáticamente en tu Foco Diario y Sesiones BCM.',
        'Usa el botón "Asistente IA Crea y Monetiza" para que la inteligencia artificial despiece cualquier proyecto automáticamente.'
      ],
      consejoPatricia: '«Un negocio no se escala con intenciones, se escala con sprints y engranajes medibles. Si no sabes qué hito toca este mes, tu día a día será reactivo.»'
    },
    {
      id: 'rituales',
      tabKey: 'habitos',
      nombre: '3. Rituales & Hábitos de Escala',
      icono: <Flame className="w-4 h-4 text-red-500" />,
      tagline: 'Disciplina flexible y Mínimo Viable Operativo (MVO)',
      paraQueSirve: 'Garantiza consistencia sin quemarte. Incluye la regla del Mínimo Viable (MVO) para que nunca rompas una racha, incluso en días de baja energía o imprevistos.',
      comoSeUsa: [
        'Configura tus hábitos en 3 pilares: Ritual de la Mañana, Negocio + Monetización, y Salud + Vitalidad.',
        'Si un día no puedes hacer la rutina completa, haz el MVO (ej: en vez de 45 min de lectura, 2 páginas; en vez de 1 hora de contenido, 1 idea anotada).',
        'Lleva el control de tus rachas continuas.'
      ],
      consejoPatricia: '«La consistencia imperfecta supera siempre a la intensidad esporádica. Tu negocio agradecerá más que hagas el mínimo viable a que desaparezcas semanas.»'
    },
    {
      id: 'calendario',
      tabKey: 'calendario',
      nombre: '4. Calendario Estratégico & Ventas',
      icono: <Calendar className="w-4 h-4 text-red-500" />,
      tagline: 'Planificador de lanzamientos, reuniones y protección de ritmos biológicos',
      paraQueSirve: 'Visualiza tus campañas de ventas, semanas de apertura de carrito, entrega a clientes y protege tus días libres.',
      comoSeUsa: [
        'Activa las capas de eventos, fases lunares y ritmo biológico/hormonal.',
        'Sincroniza tus compromisos y exporta tu archivo .ics para Google Calendar, Apple Calendar o Outlook.',
        'Programa tus semanas de "Carga Alta" (lanzamientos) alternadas con semanas de "Carga Liviana" para recuperación.'
      ],
      consejoPatricia: '«El tiempo en el calendario es tu activo más valioso. Si tú no llenas tu agenda con tus prioridades de monetización, otros la llenarán con sus urgencias.»'
    },
    {
      id: 'brujula',
      tabKey: 'claridad',
      nombre: '5. Brújula & Propuesta de Valor',
      icono: <Compass className="w-4 h-4 text-red-500" />,
      tagline: 'Tu arquetipo de autoridad, visión irrenunciable y límites sagrados',
      paraQueSirve: 'Define quién eres como líder de tu negocio. Establece con claridad tu oferta, tus virtudes de éxito y la lista estricta de "Lo que NO permito" (clientes no ideales, tarifas bajas, distracciones).',
      comoSeUsa: [
        'Declara tus 3 virtudes del Consultor/Emprendedor PRO.',
        'Escribe lo que realmente QUIERES construir en tu vida y negocio.',
        'Anota tus "Límites Innegociables" para saber cuándo decir que NO sin culpa.'
      ],
      consejoPatricia: '«La claridad atrae dinero. Cuando sabes con precisión a quién sirves y qué no toleras, tu autoridad y tus precios se multiplican.»'
    },
    {
      id: 'bitacora',
      tabKey: 'sabiduria',
      nombre: '6. Bitácora de Sabiduría & Métricas',
      icono: <BookOpen className="w-4 h-4 text-red-500" />,
      tagline: 'Cierre semanal reflexivo con IA: Qué funcionó, qué aprendiste y regla de oro',
      paraQueSirve: 'Permite que cada semana sea mejor que la anterior. Analiza los 4 cuadrantes: Agradezco, Aprendí, Qué Funcionó, Qué No Funcionó.',
      comoSeUsa: [
        'Dedica 20 minutos cada domingo o viernes por la tarde.',
        'Llena los 4 cuadrantes con honestidad radical.',
        'Presiona el botón "Analizar con IA Crea y Monetiza" para extraer patrones ocultos y tu Regla de Oro para el siguiente ciclo.'
      ],
      consejoPatricia: '«Cometer errores es parte de emprender; repetirlos por no reflexionar es lo que estanca tu crecimiento. La bitácora es tu maestría personal.»'
    },
    {
      id: 'balance',
      tabKey: 'balance',
      nombre: '7. Balance Creación vs. Vida',
      icono: <Scale className="w-4 h-4 text-red-500" />,
      tagline: 'Equilibrio de energía 80/20 y prevención de fatiga',
      paraQueSirve: 'Mide la distribución real entre horas de creación/monetización y horas dedicadas a tu cuerpo, mente y seres queridos.',
      comoSeUsa: [
        'Revisa el gráfico de proporción Negocio vs. Vida.',
        'Detecta a tiempo las alertas de desbalance antes de que se conviertan en agotamiento.'
      ],
      consejoPatricia: '«De nada sirve monetizar en grande si estás destruyendo tu paz o tu salud en el proceso. El verdadero éxito es un negocio rentable con una vida disfrutable.»'
    }
  ];

  const currentTabGuide = tabsGuides.find(t => t.id === selectedGuideTab) || tabsGuides[0];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0F1015] via-[#171821] to-[#251216] border border-red-950/40 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Zona Privada de Clientes • Metodología Oficial
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Centro de Video Tutoriales & Guía del Sistema
            </h1>
            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Bienvenida a la herramienta oficial de la metodología <strong className="text-white font-bold">Crea y Monetiza</strong> por <strong className="text-red-400 font-bold">Patricia Loaiza</strong>. Aquí tienes el paso a paso detallado de cómo usar cada sección para acelerar tus resultados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsEditingVideo(!isEditingVideo)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 border border-zinc-700 transition-colors shadow-sm"
              title="Configurar enlace de video propio"
            >
              <Edit3 className="w-4 h-4 text-red-400" />
              <span>{isEditingVideo ? 'Cerrar Edición' : 'Cambiar Video Tutorial'}</span>
            </button>
          </div>
        </div>

        {/* Video URL Edit Drawer */}
        {isEditingVideo && (
          <form onSubmit={handleSaveVideoUrl} className="mt-6 p-4 rounded-2xl bg-black/40 border border-red-500/30 space-y-3 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  URL del Video Explicativo de Patricia Loaiza (YouTube embed, Loom o Vimeo):
                </label>
                <input
                  type="text"
                  value={tempVideoUrl}
                  onChange={(e) => setTempVideoUrl(e.target.value)}
                  placeholder="Ej: https://www.youtube.com/embed/... o https://www.loom.com/embed/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingVideo(false)}
                  className="px-3 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400">
              💡 Tip: Puedes grabar tu video en <strong>Loom</strong> o subirlo como no listado a <strong>YouTube</strong> y pegar el enlace aquí para que todos tus clientes lo visualicen en su panel.
            </p>
          </form>
        )}
      </div>

      {/* Main Grid: Video Player + Interactive Tab Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Video Player Container */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">
                    Video Masterclass: Cómo usar tu Sistema Crea y Monetiza
                  </h2>
                  <p className="text-[11px] text-zinc-500">
                    Por Patricia Loaiza • Duración sugerida: 8-12 min
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-black uppercase">
                Tutorial Oficial
              </span>
            </div>

            {/* Video Player Frame with Fallback / Embedded Simulation */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-lg group">
              {videoUrl.includes('youtube.com') || videoUrl.includes('loom.com') || videoUrl.includes('vimeo.com') ? (
                <iframe
                  src={videoUrl}
                  title="Video Explicativo Crea y Monetiza - Patricia Loaiza"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                /* Sophisticated fallback player if custom URL isn't an embed iframe */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-zinc-900 to-black text-white relative">
                  <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer mb-3">
                    <Play className="w-7 h-7 ml-1 fill-white" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Espacio para tu Video Explicativo de Consultoría
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-sm mb-4">
                    Personaliza este reproductor haciendo clic en "Cambiar Video Tutorial" arriba para incrustar tu video de Loom, YouTube o Vimeo.
                  </p>
                  <button
                    onClick={() => setIsEditingVideo(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-zinc-200 transition-colors border border-white/10"
                  >
                    Vincular Video de Loom / YouTube
                  </button>
                </div>
              )}
            </div>

            {/* Video Controls & Chapter Quick Links */}
            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-zinc-200/80 space-y-2.5">
              <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                Capítulos rápidos del tutorial:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setSelectedGuideTab('foco')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-left text-[11px] font-semibold text-zinc-700 hover:border-red-400 hover:text-red-600 transition-colors"
                >
                  ⏱️ 01:15 Foco & BCM
                </button>
                <button
                  onClick={() => setSelectedGuideTab('roadmap')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-left text-[11px] font-semibold text-zinc-700 hover:border-red-400 hover:text-red-600 transition-colors"
                >
                  ⚙️ 03:40 Motor Roadmap
                </button>
                <button
                  onClick={() => setSelectedGuideTab('rituales')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-left text-[11px] font-semibold text-zinc-700 hover:border-red-400 hover:text-red-600 transition-colors"
                >
                  ⚡ 06:10 Hábitos
                </button>
                <button
                  onClick={() => setSelectedGuideTab('bitacora')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-left text-[11px] font-semibold text-zinc-700 hover:border-red-400 hover:text-red-600 transition-colors"
                >
                  📈 08:30 Sabiduría
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tab-by-Tab Methodology Guide */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-red-500" />
                Guía de Cada Pestaña
              </h3>
              <span className="text-[11px] text-zinc-400 font-medium">
                Selecciona para ver detalles
              </span>
            </div>

            {/* Horizontal or Grid Tab Selector */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-100 rounded-2xl">
              {tabsGuides.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGuideTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedGuideTab === tab.id
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                  }`}
                >
                  {tab.icono}
                  <span className="truncate">{tab.nombre.split('.')[1] || tab.nombre}</span>
                </button>
              ))}
            </div>

            {/* Detailed Guide Card for Selected Tab */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-zinc-100 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-base font-extrabold text-zinc-900">
                    {currentTabGuide.nombre}
                  </h4>
                  {currentTabGuide.tabKey !== 'tutorial' && (
                    <button
                      onClick={() => setActiveTab(currentTabGuide.tabKey)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors border border-red-200"
                    >
                      <span>Abrir pestaña</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-red-600 font-semibold mt-0.5">
                  {currentTabGuide.tagline}
                </p>
              </div>

              {/* ¿Para qué sirve? */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-zinc-900 block uppercase tracking-wider">
                  ¿Para qué sirve en tu negocio?
                </span>
                <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  {currentTabGuide.paraQueSirve}
                </p>
              </div>

              {/* Paso a paso */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-900 block uppercase tracking-wider">
                  Cómo usarla paso a paso:
                </span>
                <ul className="space-y-1.5">
                  {currentTabGuide.comoSeUsa.map((paso, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{paso}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Consejo Clave de Patricia Loaiza */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50/50 border border-red-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-red-800 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  <span>El Consejo de Patricia Loaiza:</span>
                </div>
                <p className="text-xs text-zinc-800 italic leading-relaxed">
                  {currentTabGuide.consejoPatricia}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
