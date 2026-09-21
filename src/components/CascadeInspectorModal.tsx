import React from 'react';
import {
  X,
  Layers,
  Sparkles,
  Flame,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  ArrowRight,
  Target,
  Play,
  Check,
  ChevronRight,
  ShieldCheck,
  Cog,
  Wrench,
  Compass
} from 'lucide-react';
import {
  MetaAnual,
  MetaTrimestral,
  HitoMensual,
  EntregableSemanal,
  LadrilloDiario
} from '../types';
import { useApp } from '../context/AppContext';
import {
  getMotorForTorre,
  getMotorForHito,
  getMotorForEntregable,
  getMotorForLadrillo,
  getMotorColorFromMeta
} from '../utils/cascadeColors';

export type CascadeInspectionTarget =
  | { type: 'motor'; data: MetaAnual }
  | { type: 'engranaje'; data: MetaTrimestral }
  | { type: 'componente'; data: HitoMensual }
  | { type: 'ajuste'; data: EntregableSemanal }
  | { type: 'chispa'; data: LadrilloDiario };

interface CascadeInspectorModalProps {
  target: CascadeInspectionTarget | null;
  onClose: () => void;
  onSelectSubTarget?: (subTarget: CascadeInspectionTarget) => void;
}

export const CascadeInspectorModal: React.FC<CascadeInspectorModalProps> = ({
  target,
  onClose,
  onSelectSubTarget
}) => {
  const {
    metasAnuales,
    torres,
    hitos,
    entregables,
    ladrillos,
    toggleLadrillo,
    startFocusWithLadrillo,
    openAiBreakdownForMeta,
    openAterrizarFlow
  } = useApp();

  if (!target) return null;

  // Derive Motor, Parent Chain, and Child Entities
  let motorColor = '#DC2626';
  let motorBg = '#FEF2F2';
  let motorText = '#991B1B';
  let motorCategoria = 'Negocio';
  let motorTitulo = '';
  let levelTitle = '';
  let levelSubtitle = '';
  let levelBadge = '';

  let parentMotor: MetaAnual | undefined;
  let parentTorre: MetaTrimestral | undefined;
  let parentHito: HitoMensual | undefined;
  let parentEntregable: EntregableSemanal | undefined;

  // Sub-items
  let childTorres: MetaTrimestral[] = [];
  let childHitos: HitoMensual[] = [];
  let childEntregables: EntregableSemanal[] = [];
  let childLadrillos: LadrilloDiario[] = [];

  if (target.type === 'motor') {
    const m = target.data as MetaAnual;
    parentMotor = m;
    const colorInfo = getMotorColorFromMeta(m);
    motorColor = colorInfo.color;
    motorBg = colorInfo.bgLight;
    motorText = colorInfo.textDark;
    motorCategoria = m.categoria;
    motorTitulo = m.titulo;
    levelTitle = 'MOTOR DE ACCIÓN (META ANUAL)';
    levelSubtitle = 'Pilar Estratégico del Año • Dirección Principal';
    levelBadge = 'NIVEL 1: MOTOR';

    childTorres = torres.filter(t => t.metaAnualId === m.id);
    const torreIds = new Set(childTorres.map(t => t.id));
    childHitos = hitos.filter(h => torreIds.has(h.metaTrimestralId));
    const hitoIds = new Set(childHitos.map(h => h.id));
    childEntregables = entregables.filter(e => hitoIds.has(e.hitoMensualId));
    const entIds = new Set(childEntregables.map(e => e.id));
    childLadrillos = ladrillos.filter(l => Boolean(l.entregableSemanalId && entIds.has(l.entregableSemanalId)));
  } else if (target.type === 'engranaje') {
    const t = target.data as MetaTrimestral;
    parentTorre = t;
    const colorInfo = getMotorForTorre(t, metasAnuales);
    motorColor = colorInfo.color;
    motorBg = colorInfo.bgLight;
    motorText = colorInfo.textDark;
    motorCategoria = colorInfo.categoria;
    motorTitulo = colorInfo.motorTitulo;
    parentMotor = metasAnuales.find(m => m.id === t.metaAnualId) || metasAnuales.find(m => m.id === colorInfo.motorId);
    levelTitle = 'ENGRANAJE TRIMESTRAL (ACTIVO CLAVE)';
    levelSubtitle = `${t.trimestre} • Activo que produce tracción real`;
    levelBadge = 'NIVEL 2: ENGRANAJE';

    childHitos = hitos.filter(h => h.metaTrimestralId === t.id);
    const hitoIds = new Set(childHitos.map(h => h.id));
    childEntregables = entregables.filter(e => hitoIds.has(e.hitoMensualId));
    const entIds = new Set(childEntregables.map(e => e.id));
    childLadrillos = ladrillos.filter(l => Boolean(l.entregableSemanalId && entIds.has(l.entregableSemanalId)));
  } else if (target.type === 'componente') {
    const h = target.data as HitoMensual;
    parentHito = h;
    const colorInfo = getMotorForHito(h, torres, metasAnuales);
    motorColor = colorInfo.color;
    motorBg = colorInfo.bgLight;
    motorText = colorInfo.textDark;
    motorCategoria = colorInfo.categoria;
    motorTitulo = colorInfo.motorTitulo;
    parentTorre = torres.find(t => t.id === h.metaTrimestralId);
    if (parentTorre) {
      parentMotor = metasAnuales.find(m => m.id === parentTorre?.metaAnualId);
    }
    if (!parentMotor) {
      parentMotor = metasAnuales.find(m => m.id === colorInfo.motorId);
    }
    levelTitle = 'COMPONENTE DEL MES (HITO)';
    levelSubtitle = `${h.mes} • Ensamblaje mensual de la maquinaria`;
    levelBadge = 'NIVEL 3: COMPONENTE';

    childEntregables = entregables.filter(e => e.hitoMensualId === h.id);
    const entIds = new Set(childEntregables.map(e => e.id));
    childLadrillos = ladrillos.filter(l => Boolean(l.entregableSemanalId && entIds.has(l.entregableSemanalId)));
  } else if (target.type === 'ajuste') {
    const e = target.data as EntregableSemanal;
    parentEntregable = e;
    const colorInfo = getMotorForEntregable(e, hitos, torres, metasAnuales);
    motorColor = colorInfo.color;
    motorBg = colorInfo.bgLight;
    motorText = colorInfo.textDark;
    motorCategoria = colorInfo.categoria;
    motorTitulo = colorInfo.motorTitulo;
    parentHito = hitos.find(h => h.id === e.hitoMensualId);
    if (parentHito) {
      parentTorre = torres.find(t => t.id === parentHito?.metaTrimestralId);
      if (parentTorre) {
        parentMotor = metasAnuales.find(m => m.id === parentTorre?.metaAnualId);
      }
    }
    if (!parentMotor) {
      parentMotor = metasAnuales.find(m => m.id === colorInfo.motorId);
    }
    levelTitle = 'AJUSTE SEMANAL (ENTREGABLE)';
    levelSubtitle = `${e.semanaRango} • Compromiso no negociable de la semana`;
    levelBadge = 'NIVEL 4: AJUSTE';

    childLadrillos = ladrillos.filter(l => l.entregableSemanalId === e.id);
  } else if (target.type === 'chispa') {
    const l = target.data as LadrilloDiario;
    const colorInfo = getMotorForLadrillo(l, entregables, hitos, torres, metasAnuales);
    motorColor = colorInfo.color;
    motorBg = colorInfo.bgLight;
    motorText = colorInfo.textDark;
    motorCategoria = colorInfo.categoria;
    motorTitulo = colorInfo.motorTitulo;
    parentEntregable = entregables.find(e => e.id === l.entregableSemanalId);
    if (parentEntregable) {
      parentHito = hitos.find(h => h.id === parentEntregable?.hitoMensualId);
      if (parentHito) {
        parentTorre = torres.find(t => t.id === parentHito?.metaTrimestralId);
        if (parentTorre) {
          parentMotor = metasAnuales.find(m => m.id === parentTorre?.metaAnualId);
        }
      }
    }
    if (!parentMotor) {
      parentMotor = metasAnuales.find(m => m.id === colorInfo.motorId);
    }
    levelTitle = 'CHISPA DIARIA (LADRILLO)';
    levelSubtitle = `${l.fecha} • Acción de alto impacto del día`;
    levelBadge = 'NIVEL 5: CHISPA';
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header Card */}
        <div
          style={{ backgroundColor: motorBg, borderBottomColor: `${motorColor}30` }}
          className="p-5 sm:p-6 border-b flex items-start justify-between relative"
        >
          <div className="space-y-1.5 pr-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                style={{ backgroundColor: motorColor, color: '#FFFFFF' }}
                className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-2xs"
              >
                {levelBadge}
              </span>
              <span
                style={{ color: motorText, borderColor: `${motorColor}40` }}
                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border"
              >
                Motor {motorCategoria}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight leading-snug">
              {target.type === 'motor' && (target.data as MetaAnual).titulo}
              {target.type === 'engranaje' && (target.data as MetaTrimestral).entregableClave}
              {target.type === 'componente' && (target.data as HitoMensual).titulo}
              {target.type === 'ajuste' && (target.data as EntregableSemanal).titulo}
              {target.type === 'chispa' && (target.data as LadrilloDiario).titulo}
            </h2>

            <p className="text-xs font-semibold text-zinc-600">{levelSubtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/10 text-zinc-500 hover:text-zinc-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-zinc-800">
          {/* Breadcrumb de la Maquinaria */}
          <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/80 space-y-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-zinc-400" />
              <span>Ruta en la Cascada de la Maquinaria</span>
            </span>

            <div className="flex items-center flex-wrap gap-1.5 text-xs">
              {parentMotor && (
                <button
                  onClick={() => onSelectSubTarget && onSelectSubTarget({ type: 'motor', data: parentMotor! })}
                  className="px-2 py-1 rounded-md text-[11px] font-bold border transition-all hover:scale-102 flex items-center gap-1"
                  style={{
                    backgroundColor: target.type === 'motor' ? motorColor : '#FFFFFF',
                    color: target.type === 'motor' ? '#FFFFFF' : motorText,
                    borderColor: motorColor
                  }}
                >
                  <span>Motor: {parentMotor.categoria}</span>
                </button>
              )}

              {parentTorre && (
                <>
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                  <button
                    onClick={() => onSelectSubTarget && onSelectSubTarget({ type: 'engranaje', data: parentTorre! })}
                    className="px-2 py-1 rounded-md text-[11px] font-bold border transition-all hover:scale-102 flex items-center gap-1"
                    style={{
                      backgroundColor: target.type === 'engranaje' ? motorColor : '#FFFFFF',
                      color: target.type === 'engranaje' ? '#FFFFFF' : motorText,
                      borderColor: motorColor
                    }}
                  >
                    <span>Engranaje: {parentTorre.trimestre}</span>
                  </button>
                </>
              )}

              {parentHito && (
                <>
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                  <button
                    onClick={() => onSelectSubTarget && onSelectSubTarget({ type: 'componente', data: parentHito! })}
                    className="px-2 py-1 rounded-md text-[11px] font-bold border transition-all hover:scale-102 flex items-center gap-1"
                    style={{
                      backgroundColor: target.type === 'componente' ? motorColor : '#FFFFFF',
                      color: target.type === 'componente' ? '#FFFFFF' : motorText,
                      borderColor: motorColor
                    }}
                  >
                    <span>Componente: {parentHito.mes}</span>
                  </button>
                </>
              )}

              {parentEntregable && (
                <>
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                  <button
                    onClick={() => onSelectSubTarget && onSelectSubTarget({ type: 'ajuste', data: parentEntregable! })}
                    className="px-2 py-1 rounded-md text-[11px] font-bold border transition-all hover:scale-102 flex items-center gap-1"
                    style={{
                      backgroundColor: target.type === 'ajuste' ? motorColor : '#FFFFFF',
                      color: target.type === 'ajuste' ? '#FFFFFF' : motorText,
                      borderColor: motorColor
                    }}
                  >
                    <span>Ajuste: {parentEntregable.semanaRango}</span>
                  </button>
                </>
              )}

              {target.type === 'chispa' && (
                <>
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                  <span
                    style={{ backgroundColor: motorColor, color: '#FFFFFF' }}
                    className="px-2 py-1 rounded-md text-[11px] font-bold shadow-2xs"
                  >
                    Chispa: Hoy
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Section: CONTENIDO ESPECÍFICO DE LA TARJETA */}

          {/* 1. MOTOR VIEW */}
          {target.type === 'motor' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Progreso Anual</div>
                  <div className="text-lg font-black text-zinc-900 mt-0.5">
                    {(target.data as MetaAnual).progreso}%
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Engranajes Q1-Q4</div>
                  <div className="text-lg font-black text-zinc-900 mt-0.5">
                    {childTorres.length} Activos
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Chispas Hoy</div>
                  <div className="text-lg font-black text-zinc-900 mt-0.5">
                    {childLadrillos.length} Tareas
                  </div>
                </div>
              </div>

              {/* Engranajes Trimestrales vinculados */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                    <Cog className="w-4 h-4 text-red-600" />
                    <span>Engranajes Trimestrales (Torres de Tracción)</span>
                  </h4>
                  <span className="text-[11px] font-bold text-zinc-500">
                    {childTorres.length} engranajes
                  </span>
                </div>

                <div className="space-y-2">
                  {childTorres.map(t => (
                    <div
                      key={t.id}
                      onClick={() => onSelectSubTarget && onSelectSubTarget({ type: 'engranaje', data: t })}
                      className="p-3 rounded-xl border border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700">
                            {t.trimestre}
                          </span>
                          <span className="text-xs font-bold text-zinc-900">
                            {t.entregableClave}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                        {t.estado}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón rápido de IA para calibrar este motor */}
              <div className="p-4 rounded-2xl bg-zinc-900 text-white flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black flex items-center gap-1.5 text-white">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Calibrar este Motor con IA (Anti-Relleno)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Descompón esta meta anual en semanas, días y horas con acciones quirúrgicas no etéreas.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    openAiBreakdownForMeta(target.data as MetaAnual);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shrink-0 transition-transform active:scale-95"
                >
                  Calibrar
                </button>
              </div>
            </div>
          )}

          {/* 2. ENGRANAJE VIEW */}
          {target.type === 'engranaje' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Trimestre</div>
                  <div className="text-base font-black text-zinc-900 mt-0.5">
                    {(target.data as MetaTrimestral).trimestre}
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Estado Operativo</div>
                  <div className="text-base font-black text-emerald-700 mt-0.5">
                    {(target.data as MetaTrimestral).estado}
                  </div>
                </div>
              </div>

              {/* Componentes Mensuales vinculados */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-red-600" />
                  <span>Componentes Mensuales (Hitos del Trimestre)</span>
                </h4>

                <div className="space-y-2">
                  {childHitos.map(h => (
                    <div
                      key={h.id}
                      onClick={() => onSelectSubTarget && onSelectSubTarget({ type: 'componente', data: h })}
                      className="p-3 rounded-xl border border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-black uppercase text-zinc-500">{h.mes}</div>
                        <div className="text-xs font-bold text-zinc-900">{h.titulo}</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {h.estado}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. COMPONENTE VIEW */}
          {target.type === 'componente' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Mes Activo</div>
                  <div className="text-base font-black text-zinc-900 mt-0.5">
                    {(target.data as HitoMensual).mes}
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Estado</div>
                  <div className="text-base font-black text-emerald-700 mt-0.5">
                    {(target.data as HitoMensual).estado}
                  </div>
                </div>
              </div>

              {/* Entregables Semanales vinculados */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-red-600" />
                  <span>Ajustes Semanales (Entregables Comprometidos)</span>
                </h4>

                <div className="space-y-2">
                  {childEntregables.map(e => (
                    <div
                      key={e.id}
                      onClick={() => onSelectSubTarget && onSelectSubTarget({ type: 'ajuste', data: e })}
                      className="p-3 rounded-xl border border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-black text-red-700">{e.semanaRango}</div>
                        <div className="text-xs font-bold text-zinc-900">{e.titulo}</div>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                        Ver Chispas ➔
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. AJUSTE (ENTREGABLE SEMANAL) VIEW */}
          {target.type === 'ajuste' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-1">
                <div className="text-[10px] font-bold uppercase text-zinc-500">Semana Correspondiente</div>
                <div className="text-sm font-black text-zinc-900">
                  {(target.data as EntregableSemanal).semanaRango}
                </div>
                <p className="text-xs text-zinc-600 mt-1">
                  "El entregable semanal es la unidad fundamental de tracción: debe ser un activo tangible que pueda ser publicado, cobrado o probado."
                </p>
              </div>

              {/* Chispas Diarias vinculadas con interacción de completado y BCM */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-red-600" />
                    <span>Chispas Diarias que Construyen este Entregable ({childLadrillos.length})</span>
                  </h4>
                </div>

                {childLadrillos.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic p-3 bg-zinc-50 rounded-xl">
                    No hay chispas programadas directamente en la base de datos para esta semana.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {childLadrillos.map(lad => (
                      <div
                        key={lad.id}
                        className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                          lad.completada
                            ? 'bg-zinc-50/70 border-zinc-200 opacity-70'
                            : 'bg-white border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleLadrillo(lad.id)}
                            className="mt-0.5 shrink-0 text-red-600"
                          >
                            {lad.completada ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Circle className="w-4 h-4 text-zinc-400" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <div
                              className={`text-xs font-bold leading-tight ${
                                lad.completada ? 'line-through text-zinc-400' : 'text-zinc-900'
                              }`}
                            >
                              {lad.titulo}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
                              <span>{lad.fecha}</span>
                              <span>•</span>
                              <span>{lad.duracionMinutos} min</span>
                              <span>•</span>
                              <span className="font-semibold text-zinc-700">{lad.impacto || 'Clave'}</span>
                            </div>
                          </div>
                        </div>

                        {(lad.bloqueTipo === 'BCM' || lad.esBCM) && (
                          <button
                            onClick={() => {
                              onClose();
                              startFocusWithLadrillo(lad);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-red-600 text-white shadow-2xs hover:bg-red-700 transition-transform active:scale-95 shrink-0 flex items-center gap-1"
                          >
                            <Flame className="w-3 h-3" />
                            <span>Sesión BCM</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. CHISPA (LADRILLO DIARIO) VIEW */}
          {target.type === 'chispa' && (
            <div className="space-y-5">
              {(() => {
                const l = target.data as LadrilloDiario;
                return (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase">Duración Estimada</div>
                        <div className="text-base font-black text-zinc-900 mt-0.5">
                          {l.duracionMinutos} Minutos
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase">Impacto en el Motor</div>
                        <div className="text-base font-black text-red-600 mt-0.5">
                          {l.impacto || 'Máximo (Monetización)'}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                      <div className="text-[10px] font-bold uppercase text-zinc-500">
                        Ruta de Trazabilidad Completa
                      </div>
                      <div className="text-xs font-mono font-medium text-zinc-800 leading-relaxed">
                        {l.origenRuta || `[Motor: ${motorTitulo}] ➔ [Ajuste: ${parentEntregable?.titulo || 'Entregable Activo'}]`}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white">
                      <span className="text-xs font-bold text-zinc-700">Estado de Ejecución:</span>
                      <button
                        onClick={() => toggleLadrillo(l.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          l.completada
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {l.completada ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Completada</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Pendiente de Encendido</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Launch BCM Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onClose();
                          startFocusWithLadrillo(l);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition-transform active:scale-98"
                      >
                        <Flame className="w-4 h-4 text-white" />
                        <span>Iniciar Sesión BCM con esta Chispa (Bloque Protegido)</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-500">
            Metodología Crea y Monetiza • Motor de Acción
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
          >
            Cerrar Inspección
          </button>
        </div>
      </div>
    </div>
  );
};
