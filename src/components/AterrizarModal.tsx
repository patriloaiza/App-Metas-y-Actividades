import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, ArrowRight, ArrowLeft, Check, Cog, Flame, Calendar, Clock, Layers, Sparkles, Wrench, Loader2 } from 'lucide-react';
import { playSuccessChime } from '../utils/audio';

export const AterrizarModal: React.FC = () => {
  const {
    isAterrizarModalOpen,
    setIsAterrizarModalOpen,
    activeMetaToAterrizar,
    metasAnuales,
    torres,
    hitos,
    entregables,
    addTorre,
    addHito,
    addEntregable,
    addLadrillo,
    selectedDate,
    openAiBreakdownForMeta
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedMetaId, setSelectedMetaId] = useState<string>('');
  const [torreTitulo, setTorreTitulo] = useState<string>('');
  const [trimestre, setTrimestre] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q3');
  const [hitoTitulo, setHitoTitulo] = useState<string>('');
  const [entregableTitulo, setEntregableTitulo] = useState<string>('');
  const [ladrilloTitulo, setLadrilloTitulo] = useState<string>('');
  const [duracionMin, setDuracionMin] = useState<number>(90);
  const [bloqueTipo, setBloqueTipo] = useState<'BCM' | 'Tarea'>('BCM');

  // AI Suggestions per step
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [stepSuggestions, setStepSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (activeMetaToAterrizar) {
      setSelectedMetaId(activeMetaToAterrizar.id);
    } else if (metasAnuales.length > 0) {
      setSelectedMetaId(metasAnuales[0].id);
    }
  }, [activeMetaToAterrizar, metasAnuales, isAterrizarModalOpen]);

  // Reset suggestions on step change
  useEffect(() => {
    setStepSuggestions([]);
  }, [step]);

  if (!isAterrizarModalOpen) return null;

  const currentMeta = metasAnuales.find(m => m.id === selectedMetaId) || metasAnuales[0] || {
    id: 'meta-1',
    titulo: 'Motor de Acción',
    categoria: 'Negocio',
    colorIdentificador: '#DC2626',
    bgLight: '#FEF2F2',
    textDark: '#991B1B'
  };

  const handleSuggest = async (stepKey: 'engranaje' | 'componente' | 'ajuste' | 'chispa') => {
    setIsSuggesting(true);
    setStepSuggestions([]);

    try {
      let context = '';
      if (stepKey === 'componente') context = `Engranaje Q: ${torreTitulo || 'Validación y Activo'}`;
      if (stepKey === 'ajuste') context = `Engranaje: ${torreTitulo}, Componente: ${hitoTitulo}`;
      if (stepKey === 'chispa') context = `Ajuste Semanal: ${entregableTitulo}`;

      const res = await fetch('/api/ai/suggest-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepName: stepKey,
          goalTitle: currentMeta.titulo,
          category: currentMeta.categoria,
          context
        })
      });

      const data = await res.json();
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setStepSuggestions(data.suggestions);
      } else {
        throw new Error('Sin sugerencias');
      }
    } catch (e) {
      console.error(e);
      // Fallback actionable suggestions based on step
      if (stepKey === 'engranaje') {
        setStepSuggestions([
          'Lanzamiento de oferta validada y cierre de primeros 5 clientes',
          'Instalación del embudo de captación automatizado y activos de venta',
          'Creación y validación del producto mínimo viable con pago por adelantado'
        ]);
      } else if (stepKey === 'componente') {
        setStepSuggestions([
          'Página de checkout activa con pasarela de pago y oferta irresistible',
          'Secuencia de 5 correos de venta redactada y programada',
          'Guion de llamadas de venta probado y 10 llamadas agendadas'
        ]);
      } else if (stepKey === 'ajuste') {
        setStepSuggestions([
          'Redactar los 3 emails principales de venta directa y enviar el primero',
          'Diseñar la presentación de la masterclass y abrir inscripciones',
          'Contactar a 15 prospectos calificados con mensaje de valor personalizado'
        ]);
      } else {
        setStepSuggestions([
          'Redactar Email #1 de venta directa en Sesión BCM de 90 min',
          'Configurar pasarela Stripe y crear el link de pago para la oferta',
          'Enviar 5 mensajes directos personalizados con invitación a la llamada'
        ]);
      }
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleFinish = () => {
    if (!ladrilloTitulo.trim()) {
      alert('Por favor escribe la prioridad clave de hoy (la Chispa Diaria).');
      return;
    }

    const gearTitle = torreTitulo.trim() || `Engranaje ${trimestre}: Validación y Activos`;
    const componentTitle = hitoTitulo.trim() || 'Componente Septiembre: Activo de Monetización';
    const ajusteTitle = entregableTitulo.trim() || 'Ajuste Semanal: Entregable de Alto Impacto';
    const chispaTitle = ladrilloTitulo.trim();

    // Traceability breadcrumb
    const rutaCompleta = `[Motor de Acción: ${currentMeta.titulo.slice(0, 20)}...] ➔ [Engranaje ${trimestre}: ${gearTitle.slice(0, 22)}...] ➔ [Componente: ${componentTitle.slice(0, 18)}...] ➔ [Ajuste Semanal: ${ajusteTitle.slice(0, 18)}...] ➔ [Chispa Diaria: ${chispaTitle}]`;

    // 1. Add Engranaje (Torre)
    const newTorre = addTorre({
      metaAnualId: currentMeta.id,
      trimestre,
      entregableClave: gearTitle,
      estado: 'en_curso'
    });

    // 2. Add Componente (Hito) linked to newTorre
    const newHito = addHito({
      metaTrimestralId: newTorre.id,
      mes: 'Septiembre 2026',
      titulo: componentTitle,
      estado: 'en_curso'
    });

    // 3. Add Ajuste (Entregable) linked to newHito
    const newEntregable = addEntregable({
      hitoMensualId: newHito.id,
      semanaNumero: 39,
      semanaRango: '21 Sep — 27 Sep',
      titulo: ajusteTitle,
      estado: 'en_curso',
      esMetaActivaSemana: true
    });

    // 4. Add Chispa Diaria (Ladrillo) with exact parent motor color
    addLadrillo({
      entregableSemanalId: newEntregable.id,
      fecha: selectedDate,
      titulo: chispaTitle,
      bloqueTipo,
      duracionMinutos: duracionMin,
      completada: false,
      categoria: currentMeta.categoria.toUpperCase(),
      origenRuta: rutaCompleta,
      colorIdentificador: currentMeta.colorIdentificador,
      impacto: 'Clave'
    });

    playSuccessChime();
    setIsAterrizarModalOpen(false);
    setStep(1);
    setTorreTitulo('');
    setHitoTitulo('');
    setEntregableTitulo('');
    setLadrilloTitulo('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <div className="flex items-center gap-2">
              <Cog className="w-5 h-5 animate-spin-slow" style={{ color: currentMeta.colorIdentificador }} />
              <h2 className="font-extrabold text-base text-zinc-900">
                Calibración en Cascada del Motor de Acción
              </h2>
            </div>
            <p className="text-xs text-zinc-500">
              Paso {step} de 5: Tu motor se construye desde los grandes engranajes hasta la chispa diaria
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAterrizarModalOpen(false);
                openAiBreakdownForMeta(currentMeta);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-extrabold text-[11px] shadow-xs transition-all hover:scale-102"
              title="Abrir desglose inteligente anti-relleno en semanas, días y horas"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Desglose IA Semanas/Horas</span>
            </button>
            <button
              onClick={() => setIsAterrizarModalOpen(false)}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prominent Active Motor Indicator Banner */}
        <div
          className="px-6 py-2.5 border-b flex items-center justify-between text-xs transition-colors"
          style={{
            backgroundColor: currentMeta.bgLight,
            borderColor: `${currentMeta.colorIdentificador}40`
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: currentMeta.colorIdentificador }}
            />
            <span className="font-black truncate text-zinc-900">
              Motor Activo: {currentMeta.titulo}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: currentMeta.colorIdentificador,
                color: '#FFFFFF'
              }}
            >
              {currentMeta.categoria}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsAterrizarModalOpen(false);
                openAiBreakdownForMeta(currentMeta);
              }}
              className="sm:hidden text-[10px] font-bold text-red-700 underline"
            >
              Desglose IA &rarr;
            </button>
          </div>
        </div>

        {/* Stepper Tabs */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-zinc-100 bg-white">
          {['1. Motor (Año)', '2. Engranaje (Q)', '3. Componente (Mes)', '4. Ajuste (Sem)', '5. Chispa (Hoy)'].map((label, idx) => {
            const isCurrent = step === idx + 1;
            return (
              <div
                key={idx}
                className={`text-[10px] sm:text-[11px] font-extrabold tracking-tight pb-1 transition-colors ${
                  isCurrent ? 'border-b-2 font-black' : 'text-zinc-400'
                }`}
                style={
                  isCurrent
                    ? {
                        color: currentMeta.colorIdentificador,
                        borderBottomColor: currentMeta.colorIdentificador
                      }
                    : undefined
                }
              >
                {label}
              </div>
            );
          })}
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-4">
          {step === 1 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">
                Paso 1: El Motor de Acción (Meta Anual)
              </label>
              <select
                value={selectedMetaId}
                onChange={e => setSelectedMetaId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-sm font-semibold text-zinc-900 focus:outline-none"
                style={{ borderColor: currentMeta.colorIdentificador }}
              >
                {metasAnuales.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.titulo} ({m.categoria})
                  </option>
                ))}
              </select>
              <div
                className="p-3.5 rounded-xl border text-xs leading-relaxed"
                style={{
                  backgroundColor: currentMeta.bgLight,
                  borderColor: `${currentMeta.colorIdentificador}50`,
                  color: currentMeta.textDark
                }}
              >
                <strong>Metodología Crea y Monetiza:</strong> Has seleccionado este motor. Todas las fases y componentes derivados (engranaje, componente, ajuste y chispa) llevarán su color identificador para mantener claridad absoluta de a qué motor corresponden.
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentMeta.colorIdentificador }}
                  />
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Paso 2: Los Engranajes Principales (Trimestre Q1-Q4)
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => handleSuggest('engranaje')}
                  disabled={isSuggesting}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {isSuggesting ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  <span>Ideas anti-relleno (IA)</span>
                </button>
              </div>

              <div className="flex gap-2 mb-2">
                {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map(q => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setTrimestre(q)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      trimestre === q
                        ? 'text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                    }`}
                    style={
                      trimestre === q
                        ? {
                            backgroundColor: currentMeta.colorIdentificador,
                            borderColor: currentMeta.colorIdentificador
                          }
                        : undefined
                    }
                  >
                    {q}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={torreTitulo}
                onChange={e => setTorreTitulo(e.target.value)}
                placeholder="Ej: Lanzamiento Curso Online y Captación de 20 Clientes"
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-zinc-900 focus:outline-none"
                style={{ borderColor: currentMeta.colorIdentificador }}
              />

              {stepSuggestions.length > 0 && (
                <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 space-y-1.5 animate-fade-in">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-800">
                    ⚡ Ideas de Alto Impacto (Haz clic para usar):
                  </span>
                  <div className="space-y-1">
                    {stepSuggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => setTorreTitulo(sug)}
                        className="w-full text-left p-1.5 rounded-lg bg-white hover:bg-red-100/60 border border-red-100 text-xs text-zinc-800 font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <span className="text-red-600 font-bold">&rarr;</span>
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-zinc-500">
                ¿Qué estructura o activo estratégico debe girar durante estos 3 meses para alimentar este motor?
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentMeta.colorIdentificador }}
                  />
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Paso 3: Los Componentes del Mes (Septiembre 2026)
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => handleSuggest('componente')}
                  disabled={isSuggesting}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {isSuggesting ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  <span>Ideas anti-relleno (IA)</span>
                </button>
              </div>

              <input
                type="text"
                value={hitoTitulo}
                onChange={e => setHitoTitulo(e.target.value)}
                placeholder="Ej: Embudo de ventas instalado y masterclass lista"
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-zinc-900 focus:outline-none"
                style={{ borderColor: currentMeta.colorIdentificador }}
              />

              {stepSuggestions.length > 0 && (
                <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 space-y-1.5 animate-fade-in">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-800">
                    ⚡ Componentes Clave (Haz clic para usar):
                  </span>
                  <div className="space-y-1">
                    {stepSuggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => setHitoTitulo(sug)}
                        className="w-full text-left p-1.5 rounded-lg bg-white hover:bg-red-100/60 border border-red-100 text-xs text-zinc-800 font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <span className="text-red-600 font-bold">&rarr;</span>
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-zinc-500">
                ¿Qué módulo o activo técnico debe quedar funcionando este mes para que el engranaje gire?
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentMeta.colorIdentificador }}
                  />
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Paso 4: Ajustes y Entregables de la Semana
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => handleSuggest('ajuste')}
                  disabled={isSuggesting}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {isSuggesting ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  <span>Ideas anti-relleno (IA)</span>
                </button>
              </div>

              <input
                type="text"
                value={entregableTitulo}
                onChange={e => setEntregableTitulo(e.target.value)}
                placeholder="Ej: Redactar los 5 copys del embudo y configurar automatización"
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-zinc-900 focus:outline-none"
                style={{ borderColor: currentMeta.colorIdentificador }}
              />

              {stepSuggestions.length > 0 && (
                <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 space-y-1.5 animate-fade-in">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-800">
                    ⚡ Entregables Semanales Concretos (Haz clic para usar):
                  </span>
                  <div className="space-y-1">
                    {stepSuggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => setEntregableTitulo(sug)}
                        className="w-full text-left p-1.5 rounded-lg bg-white hover:bg-red-100/60 border border-red-100 text-xs text-zinc-800 font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <span className="text-red-600 font-bold">&rarr;</span>
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-zinc-500">
                El entregable táctico que te comprometes a entregar esta semana para avanzar con tracción.
              </p>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: currentMeta.textDark }}
                >
                  <Flame className="w-4 h-4" style={{ color: currentMeta.colorIdentificador }} />
                  <span>Paso 5: La Chispa Diaria (Acción de Hoy)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSuggest('chispa')}
                  disabled={isSuggesting}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {isSuggesting ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  <span>Ideas anti-relleno (IA)</span>
                </button>
              </div>

              <input
                type="text"
                value={ladrilloTitulo}
                onChange={e => setLadrilloTitulo(e.target.value)}
                placeholder="Ej: Redactar Email #1 de la secuencia en Sesión BCM de 90 min"
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold text-zinc-900 focus:outline-none"
                style={{ borderColor: currentMeta.colorIdentificador }}
              />

              {stepSuggestions.length > 0 && (
                <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 space-y-1.5 animate-fade-in">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-800">
                    ⚡ Chispas Diarias Quirúrgicas (Haz clic para usar):
                  </span>
                  <div className="space-y-1">
                    {stepSuggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => setLadrilloTitulo(sug)}
                        className="w-full text-left p-1.5 rounded-lg bg-white hover:bg-red-100/60 border border-red-100 text-xs text-zinc-800 font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Flame className="w-3 h-3 text-red-600 shrink-0" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                    Tipo de Ejecución
                  </label>
                  <select
                    value={bloqueTipo}
                    onChange={e => setBloqueTipo(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-zinc-50 text-zinc-900 font-semibold"
                  >
                    <option value="BCM">Sesión BCM (Creación & Monetización)</option>
                    <option value="Tarea">Tarea Operativa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                    Duración Bloque
                  </label>
                  <select
                    value={duracionMin}
                    onChange={e => setDuracionMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-zinc-50 text-zinc-900 font-semibold"
                  >
                    <option value={90}>90 minutos (Sesión BCM Óptima)</option>
                    <option value={60}>60 minutos (Creación Rápida)</option>
                    <option value={45}>45 minutos</option>
                  </select>
                </div>
              </div>

              {/* Breadcrumb trace preview with motor color accent */}
              <div className="p-3 rounded-xl bg-zinc-900 text-zinc-200 border border-zinc-800 text-[10px] font-mono leading-relaxed space-y-1">
                <div
                  className="font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5"
                  style={{ color: currentMeta.colorIdentificador }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentMeta.colorIdentificador }}
                  />
                  <span>Ruta de Trazabilidad del Motor ({currentMeta.categoria}):</span>
                </div>
                <div>
                  [Motor de Acción: {currentMeta.titulo.slice(0, 18)}...] ➔ [Engranaje {trimestre}] ➔ [Componente Septiembre] ➔ [Ajuste Semanal] ➔ [Chispa Diaria: {ladrilloTitulo || 'Acción Hoy'}]
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(prev => (prev - 1) as any)}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900 disabled:opacity-30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Atrás</span>
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(prev => (prev + 1) as any)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-xs"
              style={{ backgroundColor: currentMeta.colorIdentificador }}
            >
              <span>Siguiente</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md transition-all hover:scale-102"
              style={{ backgroundColor: currentMeta.colorIdentificador }}
            >
              <Flame className="w-4 h-4 text-white" />
              <span>Encender la Chispa Diaria</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

