import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Sparkles,
  Check,
  ArrowRight,
  Loader2,
  Plus,
  Heart,
  Award,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Flame,
  Trash2,
  Target,
  Gauge,
  HelpCircle,
  TrendingUp,
  CheckCheck,
  Compass,
  Video
} from 'lucide-react';
import { playSuccessChime } from '../utils/audio';

interface OptimizacionMedicion {
  diagnosticoActual: string;
  criterioMetricoRecomendado: string;
  comoVerificarCumplimiento: string;
}

interface MetaOptimizada {
  tipo: string;
  titulo: string;
  porQueAcelera: string;
  comoMedir: string;
}

interface AiAnalysisResult {
  patronDetectado: string;
  optimizacionMedicion: OptimizacionMedicion;
  reglaDeOro: string;
  nuevasMetasOptimizadas: MetaOptimizada[];
  ajustesRecomendados: string[];
}

export const SabiduriaView: React.FC = () => {
  const {
    sabiduria,
    updateSabiduria,
    metasAnuales,
    entregables,
    addEntregable,
    addLadrillo,
    selectedDate,
    setActiveTab
  } = useApp();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AiAnalysisResult | null>(null);
  const [activeTabSubView, setActiveTabSubView] = useState<'cuadrantes' | 'analisis'>('cuadrantes');
  const [adoptedRegla, setAdoptedRegla] = useState(false);
  const [addedMetasMap, setAddedMetasMap] = useState<Record<number, boolean>>({});

  const [newItems, setNewItems] = useState({
    agradezco: '',
    aprendi: '',
    funciono: '',
    noFunciono: ''
  });

  const handleAddItem = (key: 'agradezco' | 'aprendi' | 'funciono' | 'noFunciono') => {
    const text = newItems[key].trim();
    if (!text) return;

    if (key === 'agradezco') updateSabiduria({ agradecimientos: [...sabiduria.agradecimientos, text] });
    if (key === 'aprendi') updateSabiduria({ aprendizajes: [...sabiduria.aprendizajes, text] });
    if (key === 'funciono') updateSabiduria({ queFunciono: [...sabiduria.queFunciono, text] });
    if (key === 'noFunciono') updateSabiduria({ queNoFunciono: [...sabiduria.queNoFunciono, text] });

    setNewItems(prev => ({ ...prev, [key]: '' }));
    playSuccessChime();
  };

  const handleRemoveItem = (key: 'agradezco' | 'aprendi' | 'funciono' | 'noFunciono', index: number) => {
    if (key === 'agradezco') updateSabiduria({ agradecimientos: sabiduria.agradecimientos.filter((_, i) => i !== index) });
    if (key === 'aprendi') updateSabiduria({ aprendizajes: sabiduria.aprendizajes.filter((_, i) => i !== index) });
    if (key === 'funciono') updateSabiduria({ queFunciono: sabiduria.queFunciono.filter((_, i) => i !== index) });
    if (key === 'noFunciono') updateSabiduria({ queNoFunciono: sabiduria.queNoFunciono.filter((_, i) => i !== index) });
  };

  const handleAnalyzeWithAI = async () => {
    setIsAnalyzing(true);
    setAdoptedRegla(false);

    try {
      const res = await fetch('/api/ai/wisdom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semana: sabiduria.semanaNumero || 39,
          semanaRango: sabiduria.semanaRango || '21 — 27 SEP',
          agradecimientos: sabiduria.agradecimientos,
          aprendizajes: sabiduria.aprendizajes,
          queFunciono: sabiduria.queFunciono,
          queNoFunciono: sabiduria.queNoFunciono,
          metasActivas: metasAnuales.map(m => ({ titulo: m.titulo, categoria: m.categoria })),
          entregablesSemana: entregables.map(e => ({ titulo: e.titulo, estado: e.estado }))
        })
      });

      const data = await res.json();
      setAiSuggestions(data);
      setActiveTabSubView('analisis');
      playSuccessChime();
    } catch (err) {
      console.error('Error analizando sabiduría con IA:', err);
      // Fallback rico y práctico sin puntos suspensivos
      setAiSuggestions({
        patronDetectado: 'Tu mayor velocidad de tracción ocurre cuando concentras el 100% de tu energía matutina en una sola entrega tangible de ventas o creación. La principal fuga de tiempo proviene de atender micro-urgencias y WhatsApp antes de completar tu bloque BCM.',
        optimizacionMedicion: {
          diagnosticoActual: 'Las metas de la semana tienden a medirse por "esfuerzo y horas trabajadas" en lugar de entregables con estado binario (hecho / no hecho). Esto crea la sensación de estar ocupada sin garantizar tracción real.',
          criterioMetricoRecomendado: 'Medir exclusivamente por activos tangibles terminados: "1 propuesta enviada con precio y link de cobro", "1 sistema de prospección con 10 contactos verificados", "1 pieza de contenido clave publicada".',
          comoVerificarCumplimiento: '¿Existe un enlace, documento o cobro verificable que demuestre que el entregable existe y funciona hoy?'
        },
        reglaDeOro: 'La Sesión BCM de 90 minutos se realiza antes de abrir cualquier app de mensajería: primero se construye el activo de monetización, después se atiende la reactividad.',
        nuevasMetasOptimizadas: [
          {
            tipo: 'Ajuste Semanal',
            titulo: 'Presentar y enviar propuesta con link de pago a 5 prospectos calificados',
            porQueAcelera: 'Elimina pasos intermedios y valida la oferta con dinero real en lugar de suposiciones.',
            comoMedir: '5 mensajes directos enviados con enlace de pago o llamada de cierre agendada.'
          },
          {
            tipo: 'Chispa Diaria',
            titulo: 'Redactar documento de propuesta de 1 página en Sesión BCM de 90 min',
            porQueAcelera: 'Obliga a sintetizar la promesa de valor en una sola sesión de alta potencia.',
            comoMedir: 'Documento PDF o texto final listo para presentar al cliente.'
          }
        ],
        ajustesRecomendados: [
          'Limitar las Chispas Diarias a máximo 1 o 2 de alto impacto monetario.',
          'Blindar el bloque de 09:00 a 10:30 AM en el calendario como Sesión BCM no negociable.'
        ]
      });
      setActiveTabSubView('analisis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAdoptRegla = (regla: string) => {
    updateSabiduria({ accionObligatoria: regla });
    setAdoptedRegla(true);
    playSuccessChime();
  };

  const handleAddOptimizedAction = (meta: MetaOptimizada, index: number) => {
    if (meta.tipo.toLowerCase().includes('semanal')) {
      addEntregable({
        hitoMensualId: 'hito-1',
        titulo: meta.titulo,
        semanaNumero: sabiduria.semanaNumero || 39,
        semanaRango: sabiduria.semanaRango || '21 al 27 de Septiembre',
        estado: 'en_curso',
        esMetaActivaSemana: true
      });
    } else {
      addLadrillo({
        entregableSemanalId: 'ent-1',
        titulo: meta.titulo,
        fecha: selectedDate,
        completada: false,
        duracionMinutos: 90,
        bloqueTipo: 'BCM',
        esBCM: true,
        categoria: 'CREA Y MONETIZA',
        impacto: 'Clave',
        origenRuta: `[Bitácora ORI Semanal] ➔ Chispa Optimizada: ${meta.titulo}`
      });
    }

    setAddedMetasMap(prev => ({ ...prev, [index]: true }));
    playSuccessChime();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Header */}
      <div className="space-y-3 max-w-4xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
            05 — BITÁCORA & ORI SEMANAL
          </span>
          <button
            onClick={() => setActiveTab('tutorial')}
            className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-red-600 transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-red-600" />
            <span>Ver video guía de esta pestaña</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
          Inspección ORI Semanal:{' '}
          <span className="text-red-600">Observación, Rendimiento e Inspección</span> del Motor.
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
          La mayoría de emprendedores repiten los mismos bloqueos 52 veces al año porque nunca auditan su maquinaria.
          Al presionar <strong>Inspeccionar Patrones de Oro con IA</strong>, el sistema analiza tus cuadrantes para
          <strong> corregir cómo mides tus metas</strong>, evitar tareas etéreas y sugerir acciones quirúrgicas de alta velocidad.
        </p>

        {/* Action Trigger Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleAnalyzeWithAI}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all disabled:opacity-50 hover:scale-102"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Auditan do Motor & Extrayendo Patrones de Oro...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Inspeccionar Patrones & Reglas de Oro con IA</span>
              </>
            )}
          </button>

          {/* Subview Toggle */}
          <div className="flex rounded-xl bg-zinc-100 p-1 border border-zinc-200 text-xs font-bold">
            <button
              onClick={() => setActiveTabSubView('cuadrantes')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabSubView === 'cuadrantes'
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Cuadrantes de Inspección
            </button>
            <button
              onClick={() => setActiveTabSubView('analisis')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTabSubView === 'analisis'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Análisis ORI & Patrones {aiSuggestions ? '✓' : ''}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <div>
              <h2 className="font-extrabold text-xl text-zinc-900">
                {activeTabSubView === 'cuadrantes'
                  ? 'Cuadrantes de Inspección Semanal'
                  : 'Análisis ORI: Patrones de Oro y Optimización de Metas'}
              </h2>
              <p className="text-xs text-zinc-500">
                {activeTabSubView === 'cuadrantes'
                  ? 'Registra tus reflexiones de la semana para alimentar el motor de IA.'
                  : 'Diagnóstico estratégico para medir objetivamente el éxito y eliminar tareas de relleno.'}
              </p>
            </div>
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full self-start sm:self-auto">
            SEMANA {sabiduria.semanaNumero || 39} • {sabiduria.semanaRango || '21 — 27 SEP'}
          </span>
        </div>

        {/* VIEW 1: CUADRANTES DE INSPECCIÓN */}
        {activeTabSubView === 'cuadrantes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. AGRADEZCO & VICTORIAS */}
              <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-800">
                    <Heart className="w-4 h-4 text-amber-600 fill-amber-600/20" />
                    <span>1. AGRADEZCO & CELEBRO</span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                    Victorias del Motor
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-zinc-800">
                  {sabiduria.agradecimientos.map((item, idx) => (
                    <li
                      key={idx}
                      className="group flex items-start justify-between gap-2 bg-white p-3 rounded-xl border border-amber-200/60 shadow-2xs"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold text-sm leading-none">★</span>
                        <span className="leading-snug">{item}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveItem('agradezco', idx)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-600 transition-opacity"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newItems.agradezco}
                    onChange={e => setNewItems({ ...newItems, agradezco: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && handleAddItem('agradezco')}
                    placeholder="Agradecer victoria tangible o monetización lograda..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    onClick={() => handleAddItem('agradezco')}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors"
                    title="Agregar"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 2. APRENDIZAJES TÉCNICOS */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-800">
                    <Award className="w-4 h-4 text-zinc-600" />
                    <span>2. APRENDÍ</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                    Conocimiento Clave
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-zinc-800">
                  {sabiduria.aprendizajes.map((item, idx) => (
                    <li
                      key={idx}
                      className="group flex items-start justify-between gap-2 bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-zinc-600 font-bold text-sm leading-none">•</span>
                        <span className="leading-snug">{item}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveItem('aprendi', idx)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-600 transition-opacity"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newItems.aprendi}
                    onChange={e => setNewItems({ ...newItems, aprendi: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && handleAddItem('aprendi')}
                    placeholder="Qué lección técnica o de oferta aprendiste..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-800"
                  />
                  <button
                    onClick={() => handleAddItem('aprendi')}
                    className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors"
                    title="Agregar"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 3. FUNCIONÓ (Palancas con Tracción) */}
              <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>3. FUNCIONÓ</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    Engranajes con Tracción
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-zinc-800">
                  {sabiduria.queFunciono.map((item, idx) => (
                    <li
                      key={idx}
                      className="group flex items-start justify-between gap-2 bg-white p-3 rounded-xl border border-emerald-200/60 shadow-2xs"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold text-sm leading-none">✓</span>
                        <span className="leading-snug">{item}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveItem('funciono', idx)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-600 transition-opacity"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newItems.funciono}
                    onChange={e => setNewItems({ ...newItems, funciono: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && handleAddItem('funciono')}
                    placeholder="Qué dio buen resultado monetario o de foco profundo..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    onClick={() => handleAddItem('funciono')}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors"
                    title="Agregar"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 4. NO FUNCIONÓ (Fricciones a Corregir) */}
              <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>4. NO FUNCIONÓ</span>
                  </div>
                  <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">
                    Fricciones & Fugas de Tiempo
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-zinc-800">
                  {sabiduria.queNoFunciono.map((item, idx) => (
                    <li
                      key={idx}
                      className="group flex items-start justify-between gap-2 bg-white p-3 rounded-xl border border-rose-200/60 shadow-2xs"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold text-sm leading-none">✕</span>
                        <span className="leading-snug">{item}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveItem('noFunciono', idx)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-600 transition-opacity"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newItems.noFunciono}
                    onChange={e => setNewItems({ ...newItems, noFunciono: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && handleAddItem('noFunciono')}
                    placeholder="Qué causó distracción, lentitud o dispersión..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    onClick={() => handleAddItem('noFunciono')}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors"
                    title="Agregar"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Call to Action for AI */}
            <div className="p-5 rounded-2xl bg-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-sm font-black flex items-center justify-center sm:justify-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>¿Listo para auditar la semana?</span>
                </div>
                <p className="text-xs text-zinc-400">
                  La IA detectará tus patrones de oro, optimizará la medición de tus metas y definirá tus siguientes acciones quirúrgicas.
                </p>
              </div>
              <button
                onClick={handleAnalyzeWithAI}
                disabled={isAnalyzing}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shrink-0 transition-transform active:scale-95 shadow-md flex items-center gap-2"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Inspeccionar Patrones de Oro</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: ANÁLISIS ORI & PATRONES DE ORO (IA) */}
        {activeTabSubView === 'analisis' && (
          <div className="space-y-6 animate-fade-in">
            {!aiSuggestions ? (
              <div className="text-center py-12 space-y-4 bg-zinc-50 rounded-3xl border border-dashed border-zinc-300">
                <Sparkles className="w-10 h-10 text-zinc-400 mx-auto" />
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-base font-bold text-zinc-900">
                    Aún no has ejecutado la inspección ORI de esta semana
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Llena tus cuadrantes de aprendizaje o presiona el botón para que la IA extraiga los patrones ganadores y optimice tus metas.
                  </p>
                </div>
                <button
                  onClick={handleAnalyzeWithAI}
                  disabled={isAnalyzing}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95"
                >
                  {isAnalyzing ? 'Analizando...' : 'Generar Análisis ORI Ahora'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. PATRÓN DE ORO DETECTADO */}
                <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-red-600" />
                      <span>1. PATRÓN DE ORO DETECTADO (Tracción vs Fricción)</span>
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 bg-white px-2 py-0.5 rounded border border-zinc-200">
                      Diagnóstico Semanal
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-zinc-900 leading-relaxed bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
                    {aiSuggestions.patronDetectado}
                  </p>
                </div>

                {/* 2. OPTIMIZACIÓN EN LA MEDICIÓN DE METAS (Criterio Anti-Etéreo) */}
                <div className="p-6 rounded-2xl bg-red-50/40 border border-red-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-red-600" />
                      <span>2. OPTIMIZACIÓN DE MEDICIÓN DE METAS (Criterio No Etéreo)</span>
                    </span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                      Métricas Tangibles
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    <div className="p-4 rounded-xl bg-white border border-red-100 shadow-2xs space-y-1.5">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                        Diagnóstico de Medición Actual
                      </div>
                      <p className="text-xs text-zinc-800 leading-relaxed font-medium">
                        {aiSuggestions.optimizacionMedicion.diagnosticoActual}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-red-200 shadow-2xs space-y-1.5">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-red-700">
                        Criterio Métrico Recomendado
                      </div>
                      <p className="text-xs text-zinc-950 leading-relaxed font-bold">
                        {aiSuggestions.optimizacionMedicion.criterioMetricoRecomendado}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1.5">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-600">
                        Pregunta de Auditoría Semanal
                      </div>
                      <p className="text-xs text-zinc-800 leading-relaxed font-medium italic">
                        "{aiSuggestions.optimizacionMedicion.comoVerificarCumplimiento}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. REGLA DE ORO PARA EL SIGUIENTE CICLO */}
                <div className="p-6 rounded-2xl bg-zinc-900 text-white space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>3. REGLA DE ORO INVIOLABLE (Semana {sabiduria.semanaNumero ? sabiduria.semanaNumero + 1 : 40})</span>
                    </div>
                    {adoptedRegla ? (
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/80 border border-emerald-600 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Regla Adoptada
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-400">Directriz Sagrada</span>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700 text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                    "{aiSuggestions.reglaDeOro}"
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-zinc-400">
                      Esta regla blindará tu próxima sesión BCM y eliminará distracciones operativas.
                    </p>
                    {!adoptedRegla && (
                      <button
                        onClick={() => handleAdoptRegla(aiSuggestions.reglaDeOro)}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0"
                      >
                        Adoptar como Regla Activa
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. NUEVAS METAS Y ACCIONES QUIRÚRGICAS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-800">
                      <Target className="w-4 h-4 text-red-600" />
                      <span>4. NUEVAS METAS O ACCIONES PARA ALCANZAR EL OBJETIVO MÁS RÁPIDO</span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500">
                      {aiSuggestions.nuevasMetasOptimizadas.length} acciones sin relleno
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiSuggestions.nuevasMetasOptimizadas.map((meta, idx) => {
                      const isAdded = addedMetasMap[idx];
                      return (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 shadow-2xs space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                                {meta.tipo}
                              </span>
                              <span className="text-[10px] font-bold text-zinc-400">
                                Alta Eficiencia
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-zinc-900 leading-snug">
                              {meta.titulo}
                            </h4>

                            <div className="text-xs text-zinc-600 space-y-1.5 pt-1">
                              <div>
                                <span className="font-bold text-zinc-700">Por qué acelera: </span>
                                <span>{meta.porQueAcelera}</span>
                              </div>
                              <div>
                                <span className="font-bold text-zinc-700">Cómo se mide: </span>
                                <span className="text-red-700 font-semibold">{meta.comoMedir}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-zinc-100">
                            {isAdded ? (
                              <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                                <CheckCheck className="w-4 h-4" />
                                <span>Integrado a tu Plan</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddOptimizedAction(meta, idx)}
                                className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>
                                  {meta.tipo.toLowerCase().includes('semanal')
                                    ? 'Añadir como Entregable Semanal'
                                    : 'Añadir a Chispas Diarias de Hoy'}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. AJUSTES OPERATIVOS RECOMENDADOS */}
                {aiSuggestions.ajustesRecomendados?.length > 0 && (
                  <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <div className="text-xs font-black uppercase tracking-wider text-zinc-700">
                      5. Ajustes Operativos Rápidos
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-700 font-medium list-disc list-inside">
                      {aiSuggestions.ajustesRecomendados.map((aj, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {aj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer Return Button */}
                <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
                  <button
                    onClick={() => setActiveTabSubView('cuadrantes')}
                    className="text-xs font-bold text-zinc-600 hover:text-zinc-900"
                  >
                    ← Volver a Cuadrantes de Inspección
                  </button>
                  <button
                    onClick={() => setActiveTab('plan')}
                    className="flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
                  >
                    <span>Ver Roadmap en Cascada</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
