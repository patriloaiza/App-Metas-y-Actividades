import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Castle,
  Layers,
  Calendar,
  Hammer,
  Plus,
  Sparkles,
  ArrowRight,
  Check,
  Play,
  Video,
  Target,
  Filter,
  Eye,
  ChevronRight,
  Flame,
  Cog,
  Maximize2
} from 'lucide-react';
import { MetaAnual, MetaTrimestral, HitoMensual, EntregableSemanal, LadrilloDiario } from '../types';
import {
  getMotorForTorre,
  getMotorForHito,
  getMotorForEntregable,
  getMotorForLadrillo,
  getNextAvailableDistinctColor,
  DISTINCT_MOTOR_PALETTE
} from '../utils/cascadeColors';
import {
  CascadeInspectorModal,
  CascadeInspectionTarget
} from '../components/CascadeInspectorModal';

export const PlanView: React.FC = () => {
  const {
    metasAnuales,
    torres,
    hitos,
    entregables,
    ladrillos,
    openAterrizarFlow,
    openAiBreakdownForMeta,
    addMetaAnual,
    addTorre,
    addHito,
    addEntregable,
    addLadrillo,
    selectedDate,
    startFocusWithLadrillo,
    setActiveTab
  } = useApp();

  const [activeCastilloFilter, setActiveCastilloFilter] = useState<string | 'all'>('all');
  const [isAddingCastillo, setIsAddingCastillo] = useState(false);
  const [newCastilloTitle, setNewCastilloTitle] = useState('');
  const [newCastilloCat, setNewCastilloCat] = useState<'Negocio' | 'Salud' | 'Finanzas' | 'Personal'>('Negocio');
  
  // State for inspecting any card inside the cascade
  const [inspectionTarget, setInspectionTarget] = useState<CascadeInspectionTarget | null>(null);

  const handleAddCastillo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCastilloTitle.trim()) return;

    // Pick guaranteed distinct, non-repeating brand color
    const distinct = getNextAvailableDistinctColor(metasAnuales, newCastilloCat);

    addMetaAnual({
      titulo: newCastilloTitle.trim(),
      categoria: newCastilloCat,
      colorIdentificador: distinct.color,
      bgLight: distinct.bgLight,
      textDark: distinct.textDark,
      ano: 2026,
      descripcion: ''
    });

    setNewCastilloTitle('');
    setIsAddingCastillo(false);
  };

  // Filter items if a specific motor is selected
  const filteredMetas = metasAnuales.filter(
    m => activeCastilloFilter === 'all' || m.id === activeCastilloFilter
  );

  const filteredTorres = torres.filter(t => {
    if (activeCastilloFilter === 'all') return true;
    const motor = getMotorForTorre(t, metasAnuales);
    return motor.motorId === activeCastilloFilter;
  });

  const filteredHitos = hitos.filter(h => {
    if (activeCastilloFilter === 'all') return true;
    const motor = getMotorForHito(h, torres, metasAnuales);
    return motor.motorId === activeCastilloFilter;
  });

  const filteredEntregables = entregables.filter(e => {
    if (activeCastilloFilter === 'all') return true;
    const motor = getMotorForEntregable(e, hitos, torres, metasAnuales);
    return motor.motorId === activeCastilloFilter;
  });

  const filteredLadrillos = ladrillos.filter(l => {
    if (activeCastilloFilter === 'all') return true;
    const motor = getMotorForLadrillo(l, entregables, hitos, torres, metasAnuales);
    return motor.motorId === activeCastilloFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Header */}
      <div className="space-y-3 max-w-4xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
            02 — ROADMAP EN CASCADA
          </span>
          <button
            onClick={() => setActiveTab('tutorial')}
            className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-red-600 transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-red-600" />
            <span>Ver video explicativo de esta pestaña</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
          Metodología Crea y Monetiza: Calibración en cascada del{' '}
          <span className="text-red-600">Motor de Acción.</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
          Cada fase y componente de la cascada hereda el <strong>color identificador de su Motor de Acción</strong> (sin repetir colores) para que siempre sepas con certeza qué pilar estratégico estás impulsando. <strong>Haz clic en cualquier tarjeta para ver qué contiene por dentro</strong> (objetivo, engranajes, entregables y chispas).
        </p>

        {/* Action triggers */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => openAiBreakdownForMeta()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition-all hover:scale-102"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Calibrar Motor de Acción con IA (Anti-Relleno)</span>
          </button>

          <button
            onClick={() => openAterrizarFlow()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-2xs"
          >
            <Layers className="w-4 h-4 text-red-400" />
            <span>Calibrar en Cascada (Paso a Paso)</span>
          </button>

          <button
            onClick={() => setIsAddingCastillo(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold border border-zinc-200 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Motor de Acción</span>
          </button>
        </div>
      </div>

      {/* Add Castillo Modal / Form */}
      {isAddingCastillo && (
        <form onSubmit={handleAddCastillo} className="p-5 bg-white rounded-2xl border border-zinc-300 max-w-xl shadow-md space-y-3">
          <h3 className="text-sm font-bold text-zinc-900">Registrar Nueva Meta Motor Anual</h3>
          <input
            type="text"
            autoFocus
            value={newCastilloTitle}
            onChange={e => setNewCastilloTitle(e.target.value)}
            placeholder="Ej: Facturar $100k con mi consultoría Crea y Monetiza..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-red-600"
          />
          <div className="flex items-center justify-between flex-wrap gap-2">
            <select
              value={newCastilloCat}
              onChange={e => setNewCastilloCat(e.target.value as any)}
              className="text-xs px-3 py-1.5 rounded-lg border border-zinc-300 bg-white"
            >
              <option value="Negocio">Negocio (Crea y Monetiza)</option>
              <option value="Salud">Salud (Combustible y Vitalidad)</option>
              <option value="Finanzas">Finanzas (Flujo de Caja)</option>
              <option value="Personal">Personal (Familia y Tiempo Sagrado)</option>
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAddingCastillo(false)}
                className="text-xs px-3 py-1 text-zinc-500 hover:text-zinc-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="text-xs px-4 py-1.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
              >
                Guardar Motor
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Interactive 5-Column Cascade */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-2xs space-y-6">
        {/* Cascade Header & Motor Filter Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <div>
              <h2 className="font-extrabold text-lg text-zinc-900">
                Cascada Estratégica con Tarjetas Inspeccionables
              </h2>
              <p className="text-xs text-zinc-500">
                Colores únicos por motor. Haz clic sobre cualquier tarjeta para desplegar su estructura interna.
              </p>
            </div>
          </div>

          {/* Filter Pills by Motor */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-zinc-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filtrar Motor:
            </span>
            <button
              onClick={() => setActiveCastilloFilter('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                activeCastilloFilter === 'all'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Todos ({metasAnuales.length})
            </button>
            {metasAnuales.map(m => {
              const isSelected = activeCastilloFilter === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveCastilloFilter(isSelected ? 'all' : m.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    isSelected ? 'ring-2 shadow-xs' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: m.bgLight,
                    borderColor: m.colorIdentificador,
                    color: m.textDark
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: m.colorIdentificador }}
                  />
                  <span>{m.categoria}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The 5 Columns Grid - Fully Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {/* COL 1: 2026 (Año / El Motor) */}
          <div className="bg-zinc-50/70 rounded-2xl p-3.5 border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-zinc-900">2026 • AÑO</span>
                <span className="text-[9px] font-extrabold px-1 rounded bg-red-600 text-white">MOTOR</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500">
                {filteredMetas.length} METAS
              </span>
            </div>

            <div className="space-y-2">
              {filteredMetas.map(m => {
                const isSelected = activeCastilloFilter === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setInspectionTarget({ type: 'motor', data: m })}
                    style={{
                      backgroundColor: m.bgLight,
                      borderColor: m.colorIdentificador,
                      borderLeftWidth: '5px'
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer hover:shadow-md transition-all text-left group relative ${
                      isSelected ? 'ring-2 ring-offset-1 shadow-xs' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: m.colorIdentificador,
                          color: '#FFFFFF'
                        }}
                      >
                        {m.categoria}
                      </span>
                      <span className="text-[10px] font-black text-zinc-700">{m.progreso}%</span>
                    </div>

                    <div className="text-xs font-bold text-zinc-900 leading-tight">
                      {m.titulo}
                    </div>

                    <div className="mt-2.5 pt-1.5 border-t border-zinc-200/60 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-500 font-semibold group-hover:text-red-700 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Ver por dentro
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAterrizarFlow(m);
                        }}
                        className="text-[10px] font-bold text-red-600 hover:underline"
                      >
                        Calibrar ➔
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsAddingCastillo(true)}
              className="w-full py-2 text-[11px] font-bold text-zinc-500 hover:text-red-600 text-center rounded-xl hover:bg-zinc-100 transition-colors"
            >
              + AGREGAR MOTOR
            </button>
          </div>

          {/* COL 2: Q3 • Jul, Ago, Sep (Torres / Engranajes) */}
          <div className="bg-zinc-50/70 rounded-2xl p-3.5 border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-zinc-900">Q3 • TRIMESTRE</span>
                <span className="text-[9px] font-extrabold px-1 rounded bg-amber-500 text-white">ENGRANAJE</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500">
                {filteredTorres.length} ACTIVOS
              </span>
            </div>

            <div className="space-y-2">
              {filteredTorres.map(t => {
                const motor = getMotorForTorre(t, metasAnuales);
                return (
                  <div
                    key={t.id}
                    onClick={() => setInspectionTarget({ type: 'engranaje', data: t })}
                    style={{
                      backgroundColor: motor.bgLight,
                      borderColor: motor.color,
                      borderLeftWidth: '5px'
                    }}
                    className="p-3.5 rounded-xl border text-left shadow-2xs hover:shadow-md cursor-pointer transition-all group"
                  >
                    {/* Motor identity badge */}
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: motor.color }}
                        />
                        <span
                          className="text-[9px] font-black uppercase tracking-wider truncate"
                          style={{ color: motor.textDark }}
                        >
                          Motor {motor.categoria}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-zinc-400 group-hover:text-zinc-700 flex items-center gap-0.5">
                        <Eye className="w-2.5 h-2.5" /> Ver
                      </span>
                    </div>

                    <div className="text-xs font-bold text-zinc-900 leading-tight">
                      {t.entregableClave}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-zinc-500">
                      <span className="font-bold">{t.trimestre}</span>
                      <span
                        className="font-bold uppercase text-[9px] px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${motor.color}20`,
                          color: motor.textDark
                        }}
                      >
                        {t.estado}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => openAterrizarFlow()}
              className="w-full py-2 text-[11px] font-bold text-zinc-500 hover:text-red-600 text-center rounded-xl hover:bg-zinc-100 transition-colors"
            >
              + ATERRIZAR ENGRANAJE
            </button>
          </div>

          {/* COL 3: Septiembre (Componentes / Hitos) */}
          <div className="bg-zinc-50/70 rounded-2xl p-3.5 border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-zinc-900">SEPTIEMBRE</span>
                <span className="text-[9px] font-extrabold px-1 rounded bg-red-600 text-white">COMPONENTE</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500">
                {filteredHitos.length} HITOS
              </span>
            </div>

            <div className="space-y-2">
              {filteredHitos.map(h => {
                const motor = getMotorForHito(h, torres, metasAnuales);
                return (
                  <div
                    key={h.id}
                    onClick={() => setInspectionTarget({ type: 'componente', data: h })}
                    style={{
                      backgroundColor: motor.bgLight,
                      borderColor: motor.color,
                      borderLeftWidth: '5px'
                    }}
                    className="p-3.5 rounded-xl border text-left shadow-2xs hover:shadow-md cursor-pointer transition-all group"
                  >
                    {/* Motor identity badge */}
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: motor.color }}
                        />
                        <span
                          className="text-[9px] font-black uppercase tracking-wider truncate"
                          style={{ color: motor.textDark }}
                        >
                          Motor {motor.categoria}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-zinc-400 group-hover:text-zinc-700 flex items-center gap-0.5">
                        <Eye className="w-2.5 h-2.5" /> Ver
                      </span>
                    </div>

                    <div className="text-xs font-bold text-zinc-900 leading-tight">
                      {h.titulo}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-zinc-500">
                      <span>{h.mes}</span>
                      <span
                        className="font-bold uppercase text-[9px] px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${motor.color}20`,
                          color: motor.textDark
                        }}
                      >
                        {h.estado}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => openAterrizarFlow()}
              className="w-full py-2 text-[11px] font-bold text-zinc-500 hover:text-red-600 text-center rounded-xl hover:bg-zinc-100 transition-colors"
            >
              + AÑADIR COMPONENTE
            </button>
          </div>

          {/* COL 4: S39 (Ajuste Semanal / Entregables) */}
          <div className="bg-zinc-50/70 rounded-2xl p-3.5 border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-zinc-900">SEMANA 39</span>
                <span className="text-[9px] font-extrabold px-1 rounded bg-red-600 text-white">AJUSTE</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500">
                {filteredEntregables.length} ENTREGABLES
              </span>
            </div>

            <div className="space-y-2">
              {filteredEntregables.map(e => {
                const motor = getMotorForEntregable(e, hitos, torres, metasAnuales);
                return (
                  <div
                    key={e.id}
                    onClick={() => setInspectionTarget({ type: 'ajuste', data: e })}
                    style={{
                      backgroundColor: motor.bgLight,
                      borderColor: motor.color,
                      borderLeftWidth: '5px'
                    }}
                    className={`p-3.5 rounded-xl border text-left shadow-2xs hover:shadow-md cursor-pointer transition-all group ${
                      e.esMetaActivaSemana ? 'ring-1' : ''
                    }`}
                  >
                    {/* Motor identity badge */}
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: motor.color }}
                        />
                        <span
                          className="text-[9px] font-black uppercase tracking-wider truncate"
                          style={{ color: motor.textDark }}
                        >
                          Motor {motor.categoria}
                        </span>
                      </div>
                      {e.esMetaActivaSemana && (
                        <span
                          className="text-[9px] font-black uppercase px-1 rounded"
                          style={{ backgroundColor: motor.color, color: '#FFFFFF' }}
                        >
                          ACTIVA
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-zinc-900 leading-tight">
                      {e.titulo}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-zinc-500">
                      <span>{e.semanaRango}</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <Eye className="w-3 h-3 opacity-60" /> {e.estado}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => openAterrizarFlow()}
              className="w-full py-2 text-[11px] font-bold text-red-600 hover:text-red-800 text-center rounded-xl hover:bg-zinc-100 transition-colors"
            >
              + DEFINIR AJUSTE
            </button>
          </div>

          {/* COL 5: Ladrillo Diario (Chispas Hoy) */}
          <div className="bg-zinc-50/70 rounded-2xl p-3.5 border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-zinc-900">HOY</span>
                <span className="text-[9px] font-extrabold px-1 rounded bg-zinc-900 text-white">CHISPA</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500">
                {filteredLadrillos.length} TAREAS
              </span>
            </div>

            <div className="space-y-2">
              {filteredLadrillos.map(l => {
                const motor = getMotorForLadrillo(l, entregables, hitos, torres, metasAnuales);
                return (
                  <div
                    key={l.id}
                    onClick={() => setInspectionTarget({ type: 'chispa', data: l })}
                    style={{
                      backgroundColor: motor.bgLight,
                      borderColor: motor.color,
                      borderLeftWidth: '5px'
                    }}
                    className={`p-3.5 rounded-xl border text-left shadow-2xs hover:shadow-md cursor-pointer transition-all group ${
                      l.completada ? 'opacity-60 line-through' : ''
                    }`}
                  >
                    {/* Motor identity badge */}
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: motor.color }}
                        />
                        <span
                          className="text-[9px] font-black uppercase tracking-wider truncate"
                          style={{ color: motor.textDark }}
                        >
                          Motor {motor.categoria}
                        </span>
                      </div>
                      {(l.bloqueTipo === 'BCM' || l.esBCM) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startFocusWithLadrillo(l);
                          }}
                          className="text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs shrink-0 text-white hover:scale-105 transition-transform"
                          style={{ backgroundColor: motor.color }}
                          title="Iniciar Sesión BCM"
                        >
                          BCM
                        </button>
                      )}
                    </div>

                    <div className="text-xs font-bold leading-tight text-zinc-900">
                      {l.titulo}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                      <span>{l.duracionMinutos} min</span>
                      <span className="font-bold flex items-center gap-1 text-zinc-700">
                        <Eye className="w-3 h-3 text-zinc-400" />
                        {l.impacto || 'Clave'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveTab('inicio')}
              className="w-full py-2 text-[11px] font-bold text-zinc-700 hover:text-red-600 text-center rounded-xl hover:bg-zinc-100 transition-colors"
            >
              ➔ IR A EJECUCIÓN HOY
            </button>
          </div>
        </div>
      </div>

      {/* Card Inspection Modal */}
      <CascadeInspectorModal
        target={inspectionTarget}
        onClose={() => setInspectionTarget(null)}
        onSelectSubTarget={(sub) => setInspectionTarget(sub)}
      />
    </div>
  );
};
