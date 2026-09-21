import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, X, ArrowRight, Check, Loader2, Cog, Layers, Calendar, Flame, Wrench, Zap, ShieldCheck, Clock } from 'lucide-react';
import { MetaAnual } from '../types';
import { playSuccessChime } from '../utils/audio';

interface GeneratedTorre {
  trimestre: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  titulo: string;
  entregableClave: string;
  hitos: {
    mes: string;
    titulo: string;
    semanas: {
      semana: number;
      entregable: string;
      ladrilloHoy: string;
      duracionMin: number;
    }[];
  }[];
}

interface AccionInmediata {
  horaOEstimacion: string;
  accion: string;
  resultadoEsperado: string;
}

export const AiBreakdownModal: React.FC = () => {
  const {
    isAiBreakdownOpen,
    setIsAiBreakdownOpen,
    activeMetaToAterrizar,
    metasAnuales,
    addMetaAnual,
    addTorre,
    addHito,
    addEntregable,
    addLadrillo,
    selectedDate
  } = useApp();

  const [selectedMetaId, setSelectedMetaId] = useState<string>(
    activeMetaToAterrizar ? activeMetaToAterrizar.id : (metasAnuales[0]?.id || 'custom')
  );
  const [customGoalTitle, setCustomGoalTitle] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('Negocio');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultTorres, setResultTorres] = useState<GeneratedTorre[] | null>(null);
  const [estrategiaRapida, setEstrategiaRapida] = useState<string>('');
  const [principioAntirrelleno, setPrincipioAntirrelleno] = useState<string>('');
  const [accionesInmediatasHoras, setAccionesInmediatasHoras] = useState<AccionInmediata[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleGenerate = async () => {
    let goalTitle = customGoalTitle;
    let goalCategory = categoria;

    if (selectedMetaId !== 'custom') {
      const existing = metasAnuales.find(m => m.id === selectedMetaId);
      if (existing) {
        goalTitle = existing.titulo;
        goalCategory = existing.categoria;
      }
    }

    if (!goalTitle.trim()) {
      alert('Por favor introduce un objetivo para calibrar el motor.');
      return;
    }

    setIsLoading(true);
    setResultTorres(null);
    setEstrategiaRapida('');
    setPrincipioAntirrelleno('');
    setAccionesInmediatasHoras([]);
    setIsSuccess(false);

    try {
      const res = await fetch('/api/ai/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalTitle: goalTitle.trim(),
          category: goalCategory,
          timeHorizon: 'año'
        })
      });

      const data = await res.json();
      if (data.torres && Array.isArray(data.torres)) {
        setResultTorres(data.torres);
        setEstrategiaRapida(
          data.estrategiaRapida ||
            'Enfocarse directamente en el canal más corto hacia la monetización real: validar la oferta con pago previo antes de construir software o plataformas complejas.'
        );
        setPrincipioAntirrelleno(
          data.principioAntirrelleno ||
            'Prohibido: "investigar", "pensar", "hacer logos", o "diseñar sitios web eternos". Solo entregables concretos listos para publicar o cobrar.'
        );
        setAccionesInmediatasHoras(
          Array.isArray(data.accionesInmediatasHoras) && data.accionesInmediatasHoras.length > 0
            ? data.accionesInmediatasHoras
            : [
                {
                  horaOEstimacion: '90 min',
                  accion: 'Redactar documento de 1 página con la oferta irresistible y precio',
                  resultadoEsperado: 'Oferta lista para presentar a prospectos hoy'
                },
                {
                  horaOEstimacion: '60 min',
                  accion: 'Crear link de pago en Stripe o pasarela y probarlo',
                  resultadoEsperado: 'Mecanismo de cobro activo e inmediato'
                },
                {
                  horaOEstimacion: '90 min',
                  accion: 'Enviar mensaje directo a 10 contactos ideales ofreciendo la solución',
                  resultadoEsperado: 'Primeras conversaciones y agendamientos reales'
                }
              ]
        );
      } else {
        throw new Error('Respuesta no válida del servidor');
      }
    } catch (err) {
      console.error('Error al desglosar con IA:', err);
      // High-standard fallback
      setEstrategiaRapida(
        'Ir directo a la validación de la oferta con clientes reales y llamadas de cierre rápido, saltando etapas de desarrollo prematuro.'
      );
      setPrincipioAntirrelleno(
        'Eliminar perfeccionismo y tareas de relleno pasivas. Cada bloque de tiempo debe producir un activo de venta o entrega real.'
      );
      setAccionesInmediatasHoras([
        {
          horaOEstimacion: '90 min (Sesión BCM)',
          accion: 'Redactar la propuesta de valor y los 3 entregables clave de la oferta',
          resultadoEsperado: 'Documento de venta de 1 página terminado'
        },
        {
          horaOEstimacion: '60 min',
          accion: 'Configurar link de cobro y página simple de agendamiento',
          resultadoEsperado: 'Pasarela de pago lista para recibir dinero'
        },
        {
          horaOEstimacion: '90 min',
          accion: 'Contactar a 10 prospectos ideales con mensaje personalizado',
          resultadoEsperado: 'Primeras respuestas y llamadas agendadas'
        }
      ]);
      setResultTorres([
        {
          trimestre: 'Q3',
          titulo: 'Engranaje Q3: Validar oferta y funnel de alta conversión',
          entregableClave: 'Sistema de captación orgánico y 5 clientes cerrados',
          hitos: [
            {
              mes: 'Septiembre 2026',
              titulo: 'Componente Septiembre: Lanzamiento de masterclass y llamadas',
              semanas: [
                {
                  semana: 39,
                  entregable: 'Ajuste Semanal: Redactar los 3 emails clave de venta directa',
                  ladrilloHoy: 'Redactar Email #1 en Sesión BCM de 90 min',
                  duracionMin: 90
                }
              ]
            }
          ]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAndInject = () => {
    if (!resultTorres || resultTorres.length === 0) return;

    let metaAnualId = selectedMetaId;
    let targetColor = '#DC2626';

    // If custom goal, create the Motor de Acción first
    if (selectedMetaId === 'custom') {
      const newMetaId = 'meta-' + Date.now();
      metaAnualId = newMetaId;
      addMetaAnual({
        titulo: customGoalTitle,
        categoria: categoria as any,
        colorIdentificador: '#DC2626',
        bgLight: '#FEF2F2',
        textDark: '#991B1B',
        ano: 2026,
        descripcion: 'Motor de Acción calibrado con Asistente IA Crea y Monetiza'
      });
    } else {
      const existing = metasAnuales.find(m => m.id === selectedMetaId);
      if (existing) {
        targetColor = existing.colorIdentificador;
      }
    }

    const currentMeta = metasAnuales.find(m => m.id === metaAnualId);
    const motorName = currentMeta ? currentMeta.titulo.slice(0, 20) : customGoalTitle.slice(0, 20);

    // Inject gears, components, deliverables and first daily spark
    resultTorres.forEach((torre, tIdx) => {
      const torreId = `torre-${Date.now()}-${tIdx}`;
      addTorre({
        metaAnualId,
        trimestre: torre.trimestre || 'Q3',
        entregableClave: torre.entregableClave || torre.titulo,
        estado: 'en_curso'
      });

      torre.hitos.forEach((hito, hIdx) => {
        const hitoId = `hito-${Date.now()}-${hIdx}`;
        addHito({
          metaTrimestralId: torreId,
          mes: hito.mes || 'Septiembre 2026',
          titulo: hito.titulo,
          estado: 'en_curso'
        });

        hito.semanas.forEach((sem, sIdx) => {
          const entregableId = `entregable-${Date.now()}-${sIdx}`;
          addEntregable({
            hitoMensualId: hitoId,
            semanaNumero: 39,
            semanaRango: '21 Sep — 27 Sep',
            titulo: sem.entregable,
            estado: 'en_curso',
            esMetaActivaSemana: tIdx === 0 && hIdx === 0 && sIdx === 0
          });

          // Inject first spark to today
          if (tIdx === 0 && hIdx === 0 && sIdx === 0 && sem.ladrilloHoy) {
            const breadcrumb = `[Motor de Acción: ${motorName}...] ➔ [Engranaje ${torre.trimestre}] ➔ [Componente: ${hito.titulo.slice(0, 18)}...] ➔ [Ajuste: ${sem.entregable.slice(0, 18)}...] ➔ [Chispa Diaria: ${sem.ladrilloHoy}]`;
            addLadrillo({
              entregableSemanalId: entregableId,
              fecha: selectedDate,
              titulo: sem.ladrilloHoy,
              bloqueTipo: 'BCM',
              duracionMinutos: sem.duracionMin || 90,
              completada: false,
              categoria: categoria.toUpperCase(),
              origenRuta: breadcrumb,
              colorIdentificador: targetColor,
              impacto: 'Clave'
            });
          }
        });
      });
    });

    playSuccessChime();
    setIsSuccess(true);
    setTimeout(() => {
      setIsAiBreakdownOpen(false);
      setIsSuccess(false);
      setResultTorres(null);
    }, 1200);
  };

  if (!isAiBreakdownOpen) return null;

  const currentMetaObj = metasAnuales.find(m => m.id === selectedMetaId);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 border border-red-200 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base text-zinc-900">
                  Calibración del Motor de Acción con IA
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600 text-white">
                  Anti-Relleno
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Desglose quirúrgico en semanas, días y horas. Cero tareas etéreas ni de relleno que te desvíen.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAiBreakdownOpen(false)}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Seleccionar o Escribir Objetivo del Motor de Acción (Meta Anual)
            </label>
            <select
              value={selectedMetaId}
              onChange={e => setSelectedMetaId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="custom">-- Escribir nuevo objetivo macro de acción --</option>
              {metasAnuales.map(m => (
                <option key={m.id} value={m.id}>
                  {m.titulo} ({m.categoria})
                </option>
              ))}
            </select>
          </div>

          {selectedMetaId === 'custom' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                Descripción del Objetivo o Meta del Motor
              </label>
              <input
                type="text"
                value={customGoalTitle}
                onChange={e => setCustomGoalTitle(e.target.value)}
                placeholder="Ej: Facturar $100k con mi consultoría premium y zona privada de clientes"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                Categoría
              </label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-sm font-semibold text-zinc-900"
              >
                <option value="Negocio">Negocio & Monetización</option>
                <option value="Salud">Salud & Vitalidad (Combustible)</option>
                <option value="Finanzas">Finanzas & Rentabilidad</option>
                <option value="Personal">Personal & Calidad de Vida</option>
              </select>
            </div>

            <div className="self-end">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-black shadow-md transition-all hover:scale-102 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Diseñando ruta quirúrgica...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Desglosar con IA Anti-Relleno</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Preview */}
          {resultTorres && (
            <div className="space-y-4 pt-2 animate-fade-in">
              {/* 1. Estrategia Rápida */}
              {estrategiaRapida && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-900">
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
                    <span>Estrategia de Acción Rápida (El camino más directo)</span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed">
                    {estrategiaRapida}
                  </p>
                </div>
              )}

              {/* 2. Principio Anti-Relleno */}
              {principioAntirrelleno && (
                <div className="p-3.5 rounded-2xl bg-zinc-900 text-zinc-100 border border-zinc-800 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-400">
                    <ShieldCheck className="w-4 h-4 text-red-400" />
                    <span>Regla Anti-Relleno (Lo que NO debes hacer)</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-normal leading-relaxed">
                    {principioAntirrelleno}
                  </p>
                </div>
              )}

              {/* 3. Acciones Inmediatas en Horas */}
              {accionesInmediatasHoras.length > 0 && (
                <div className="p-4 rounded-2xl bg-white border-2 border-red-100 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-700">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span>Acciones Inmediatas en Horas (Para ejecutar hoy)</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-bold">
                      Bloques quirúrgicos de 60-90 min
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {accionesInmediatasHoras.map((acc, aIdx) => (
                      <div
                        key={aIdx}
                        className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-100 text-red-700 inline-block mb-1.5">
                            {acc.horaOEstimacion}
                          </span>
                          <p className="text-xs font-bold text-zinc-900 leading-tight">
                            {acc.accion}
                          </p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-zinc-200/60 text-[10px] text-zinc-500">
                          <strong>Resultado:</strong> {acc.resultadoEsperado}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Desglose en Semanas (Engranajes & Componentes) */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                    <Cog className="w-4 h-4" />
                    <span>Desglose en Semanas (Engranajes ➔ Componentes ➔ Ajustes)</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 font-semibold">
                    Trazabilidad en Cascada
                  </span>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {resultTorres.map((torre, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-3 border border-zinc-200 shadow-xs">
                      <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                        <Cog className="w-4 h-4 text-red-600" />
                        <span>{torre.trimestre}: {torre.titulo}</span>
                      </div>
                      <div className="text-xs text-zinc-600 mt-1 pl-6">
                        <strong>Engranaje clave:</strong> {torre.entregableClave}
                      </div>

                      {torre.hitos?.map((hito, hIdx) => (
                        <div key={hIdx} className="mt-2 pl-6 border-l-2 border-red-300 text-xs">
                          <div className="font-semibold text-zinc-900 flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-zinc-600" />
                            <span>Componente: {hito.titulo}</span>
                          </div>
                          {hito.semanas?.map((sem, sIdx) => (
                            <div key={sIdx} className="mt-1 pl-4 text-[11px] text-zinc-600">
                              <div>• Ajuste Semanal: {sem.entregable}</div>
                              {sem.ladrilloHoy && (
                                <div className="mt-0.5 text-red-700 font-bold flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-red-600" />
                                  <span>Chispa Diaria (Hoy): {sem.ladrilloHoy} ({sem.duracionMin} min Sesión BCM)</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 italic">
                    Al aprobar, se insertará en el Motor de Acción con su color respectivo.
                  </span>
                  <button
                    onClick={handleApproveAndInject}
                    disabled={isSuccess}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all hover:scale-102"
                  >
                    {isSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>¡Motor de Acción Instalado!</span>
                      </>
                    ) : (
                      <>
                        <span>Aprobar e Insertar en el Motor</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

