import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CheckCircle2,
  Circle,
  Play,
  Flame,
  Clock,
  Layers,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  Wrench,
  Check
} from 'lucide-react';
import { LadrilloDiario, BloqueAgenda, TareaPendiente } from '../types';
import {
  getMotorForLadrillo,
  getMotorForAgendaBlock,
  getMotorForPendiente
} from '../utils/cascadeColors';

export const TaskDetailModal: React.FC = () => {
  const {
    inspectedTask,
    closeTaskDetail,
    metasAnuales,
    torres,
    hitos,
    entregables,
    toggleLadrillo,
    togglePendiente,
    startFocusWithLadrillo,
    openAterrizarFlow
  } = useApp();

  if (!inspectedTask) return null;

  const { item, type } = inspectedTask;

  // Derive item characteristics based on type
  let title = '';
  let date = '';
  let isCompleted = false;
  let isBCM = false;
  let durationMin = 90;
  let motorData = {
    color: '#DC2626',
    bgLight: '#FEF2F2',
    textDark: '#991B1B',
    categoria: 'Negocio',
    motorTitulo: 'Motor de Acción',
    motorId: 'meta-1'
  };
  let origenRuta = '';
  let impacto = 'Clave';

  // Find linked entities for rich internal breakdown
  let linkedEntregable: any = null;
  let linkedHito: any = null;
  let linkedTorre: any = null;
  let linkedMeta: any = null;

  if (type === 'ladrillo') {
    const lad = item as LadrilloDiario;
    title = lad.titulo;
    date = lad.fecha;
    isCompleted = lad.completada;
    isBCM = lad.bloqueTipo === 'BCM' || !!lad.esBCM;
    durationMin = lad.duracionMinutos || 90;
    origenRuta = lad.origenRuta || '';
    impacto = lad.impacto || 'Clave';

    motorData = getMotorForLadrillo(lad, entregables, hitos, torres, metasAnuales);

    if (lad.entregableSemanalId) {
      linkedEntregable = entregables.find(e => e.id === lad.entregableSemanalId);
      if (linkedEntregable) {
        linkedHito = hitos.find(h => h.id === linkedEntregable.hitoMensualId);
        if (linkedHito) {
          linkedTorre = torres.find(t => t.id === linkedHito.metaTrimestralId);
          if (linkedTorre) {
            linkedMeta = metasAnuales.find(m => m.id === linkedTorre.metaAnualId);
          }
        }
      }
    }

    if (!linkedMeta && motorData.motorId) {
      linkedMeta = metasAnuales.find(m => m.id === motorData.motorId);
    }
  } else if (type === 'agenda') {
    const ag = item as BloqueAgenda;
    title = ag.titulo;
    date = ag.fecha;
    isCompleted = false;
    isBCM = !!ag.esBCM;
    durationMin = 90;
    motorData = getMotorForAgendaBlock(ag, metasAnuales);
    impacto = ag.esBCM ? 'Clave' : 'Alto';
    origenRuta = `[Motor de Acción: ${motorData.motorTitulo}] ➔ Horario: ${ag.horaInicio}`;
    linkedMeta = metasAnuales.find(m => m.id === motorData.motorId);
  } else if (type === 'pendiente') {
    const p = item as TareaPendiente;
    title = p.titulo;
    date = p.fecha;
    isCompleted = p.completada;
    isBCM = false;
    durationMin = 30;
    motorData = getMotorForPendiente(p, metasAnuales);
    impacto = 'Medio';
    origenRuta = `[Pendiente Rápido] ➔ ${p.categoria}`;
    linkedMeta = metasAnuales.find(m => m.id === motorData.motorId);
  }

  const handleToggle = () => {
    if (type === 'ladrillo') {
      toggleLadrillo(item.id);
    } else if (type === 'pendiente') {
      togglePendiente(item.id);
    }
  };

  const handleStartFocus = () => {
    if (type === 'ladrillo') {
      startFocusWithLadrillo(item as LadrilloDiario);
    } else {
      // Convert to transient ladrillo to launch focus
      startFocusWithLadrillo({
        id: item.id,
        fecha: date,
        titulo: title,
        bloqueTipo: 'BCM',
        duracionMinutos: durationMin,
        completada: isCompleted,
        categoria: motorData.categoria.toUpperCase(),
        colorIdentificador: motorData.color,
        impacto: 'Clave'
      });
    }
    closeTaskDetail();
  };

  const handleCalibrateCascade = () => {
    closeTaskDetail();
    openAterrizarFlow(linkedMeta || metasAnuales[0]);
  };

  // Format date nicely
  const formatDateLabel = (dStr: string) => {
    if (!dStr) return '';
    const parts = dStr.split('-');
    if (parts.length < 3) return dStr;
    const year = parts[0];
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(Number(year), month, day);
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${dayNames[dateObj.getDay()]}, ${day} de ${monthNames[month]} ${year}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Motor Header Badge */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: motorData.bgLight,
            borderColor: `${motorData.color}40`
          }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-xs ring-2 ring-white"
              style={{ backgroundColor: motorData.color }}
            />
            <div>
              <div
                className="text-[10px] font-black uppercase tracking-wider"
                style={{ color: motorData.textDark }}
              >
                Motor de Acción: {motorData.categoria}
              </div>
              <div className="text-xs font-bold text-zinc-900 truncate max-w-xs sm:max-w-md">
                {motorData.motorTitulo}
              </div>
            </div>
          </div>

          <button
            onClick={closeTaskDetail}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Title & Status Card */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 leading-snug">
                {title}
              </h2>

              <button
                type="button"
                onClick={handleToggle}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all active:scale-95"
                style={
                  isCompleted
                    ? {
                        backgroundColor: motorData.bgLight,
                        borderColor: motorData.color,
                        color: motorData.textDark
                      }
                    : {
                        backgroundColor: '#F4F4F5',
                        borderColor: '#E4E4E7',
                        color: '#52525B'
                      }
                }
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" style={{ color: motorData.color }} />
                    <span>Completada</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-zinc-400" />
                    <span>Pendiente</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span
                className="font-extrabold px-2.5 py-1 rounded-full text-white text-[11px] flex items-center gap-1 shadow-2xs"
                style={{ backgroundColor: motorData.color }}
              >
                {isBCM ? <Flame className="w-3.5 h-3.5 text-white" /> : <Clock className="w-3.5 h-3.5" />}
                <span>{isBCM ? `Sesión BCM ${durationMin} min` : `Tarea ${durationMin} min`}</span>
              </span>

              <span className="font-semibold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Calendar className="w-3 h-3 text-zinc-500" />
                <span>{formatDateLabel(date)}</span>
              </span>

              <span className="font-bold text-zinc-700 bg-zinc-100 px-2 py-1 rounded-full text-[11px]">
                Impacto: <strong className="text-zinc-900">{impacto}</strong>
              </span>
            </div>
          </div>

          {/* INSIDE THE TASK: Detailed Cascade Ancestry */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3.5">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4" style={{ color: motorData.color }} />
                <span>Estructura Interna: ¿A qué corresponde en tu Motor?</span>
              </span>
              <span
                className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: motorData.bgLight, color: motorData.textDark }}
              >
                Trazabilidad 100%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* 1. Motor de Acción */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 font-black text-[10px] mt-0.5"
                  style={{ backgroundColor: motorData.color }}
                >
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                    Motor de Acción (Meta Anual 2026)
                  </div>
                  <div className="font-extrabold text-zinc-900 mt-0.5">
                    {linkedMeta?.titulo || motorData.motorTitulo}
                  </div>
                  {linkedMeta?.progreso !== undefined && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${linkedMeta.progreso}%`,
                            backgroundColor: motorData.color
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-zinc-500">
                        {linkedMeta.progreso}% completado
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Engranaje Trimestral */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <div className="w-6 h-6 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 font-black text-[10px] mt-0.5">
                  2
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                    Engranaje Trimestral ({linkedTorre?.trimestre || 'Q3 2026'})
                  </div>
                  <div className="font-bold text-zinc-800 mt-0.5">
                    {linkedTorre?.entregableClave || 'Estructura principal de tracción y activos'}
                  </div>
                </div>
              </div>

              {/* 3. Componente Mensual */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <div className="w-6 h-6 rounded-lg bg-zinc-800 text-white flex items-center justify-center shrink-0 font-black text-[10px] mt-0.5">
                  3
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                    Componente del Mes ({linkedHito?.mes || 'Septiembre 2026'})
                  </div>
                  <div className="font-bold text-zinc-800 mt-0.5">
                    {linkedHito?.titulo || 'Activo nuclear instalado para alimentar el motor'}
                  </div>
                </div>
              </div>

              {/* 4. Ajuste Semanal */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <div className="w-6 h-6 rounded-lg bg-zinc-700 text-white flex items-center justify-center shrink-0 font-black text-[10px] mt-0.5">
                  4
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                    Ajuste Semanal ({linkedEntregable?.semanaRango || 'Semana Activa'})
                  </div>
                  <div className="font-bold text-zinc-800 mt-0.5">
                    {linkedEntregable?.titulo || 'Entregable táctico de alto impacto de la semana'}
                  </div>
                </div>
              </div>

              {/* 5. Chispa Diaria */}
              <div
                className="flex items-start gap-3 p-2.5 rounded-xl border shadow-2xs"
                style={{
                  backgroundColor: motorData.bgLight,
                  borderColor: motorData.color
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 font-black text-[10px] mt-0.5"
                  style={{ backgroundColor: motorData.color }}
                >
                  <Flame className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[10px] font-black uppercase tracking-wider"
                    style={{ color: motorData.textDark }}
                  >
                    Chispa Diaria de Hoy
                  </div>
                  <div className="font-black text-zinc-900 mt-0.5">
                    {title}
                  </div>
                  <div className="text-[11px] text-zinc-600 mt-0.5">
                    Duración recomendada: {durationMin} minutos sin interrupciones.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumb Path Banner */}
          {origenRuta && (
            <div className="p-3 rounded-xl bg-zinc-900 text-zinc-200 text-[10px] font-mono leading-relaxed border border-zinc-800">
              <span className="font-bold uppercase tracking-wider text-red-400 block mb-0.5">
                Ruta Completa en Cascada:
              </span>
              <span>{origenRuta}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCalibrateCascade}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 hover:text-zinc-900 hover:underline"
          >
            <Wrench className="w-3.5 h-3.5 text-zinc-500" />
            <span>Calibrar Cascada de este Motor</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeTaskDetail}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-200/60 transition-colors"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={handleStartFocus}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md transition-all hover:scale-102"
              style={{ backgroundColor: motorData.color }}
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              <span>Iniciar Sesión BCM {durationMin}m</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
