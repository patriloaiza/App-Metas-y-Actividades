import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Play,
  Plus,
  ArrowDown,
  Calendar,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Compass,
  BookOpen,
  ArrowRight,
  Flame,
  ShieldCheck,
  Check,
  Video,
  Target
} from 'lucide-react';
import { LadrilloDiario, EstadoHabito } from '../types';
import { getMotorForLadrillo } from '../utils/cascadeColors';

export const DashboardView: React.FC = () => {
  const {
    selectedDate,
    goToPrevDay,
    goToNextDay,
    goToToday,
    metasAnuales,
    torres,
    hitos,
    entregables,
    ladrillos,
    toggleLadrillo,
    addLadrillo,
    pendientes,
    togglePendiente,
    addPendiente,
    habitos,
    updateHabitoCheck,
    agenda,
    user,
    sabiduria,
    setActiveTab,
    startFocusWithLadrillo,
    openAterrizarFlow,
    openTaskDetail,
    loadDemoData,
    isDataClean
  } = useApp();

  const activeEntregable = entregables.find(e => e.esMetaActivaSemana) || entregables[0];

  const [newPriorityTitle, setNewPriorityTitle] = useState('');
  const [newPriorityCategory, setNewPriorityCategory] = useState('CREA Y MONETIZA');
  const [isAddingPriority, setIsAddingPriority] = useState(false);

  const [newPendingTitle, setNewPendingTitle] = useState('');
  const [isAddingPending, setIsAddingPending] = useState(false);

  // Format date header string
  const formatDateHeader = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const isToday = dateStr === '2026-09-21';
    return {
      text: `${isToday ? 'Hoy - ' : ''}${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`,
      isToday
    };
  };

  const { text: dateHeaderText, isToday } = formatDateHeader(selectedDate);

  const handleAddPrioritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPriorityTitle.trim()) return;

    addLadrillo({
      fecha: selectedDate,
      titulo: newPriorityTitle.trim(),
      bloqueTipo: 'BCM',
      duracionMinutos: 90,
      completada: false,
      categoria: newPriorityCategory,
      origenRuta: 'Metodología Crea y Monetiza ➔ Chispa Diaria',
      colorIdentificador: '#DC2626',
      impacto: 'Clave'
    });

    setNewPriorityTitle('');
    setIsAddingPriority(false);
  };

  const handleAddPendingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPendingTitle.trim()) return;
    addPendiente(newPendingTitle.trim(), 'to-do');
    setNewPendingTitle('');
    setIsAddingPending(false);
  };

  // Week days for habits mini-table
  const weekDays = [
    { label: 'L 21', date: '2026-09-21' },
    { label: 'M 22', date: '2026-09-22' },
    { label: 'M 23', date: '2026-09-23' },
    { label: 'J 24', date: '2026-09-24' },
    { label: 'V 25', date: '2026-09-25' },
    { label: 'S 26', date: '2026-09-26' },
    { label: 'D 27', date: '2026-09-27' }
  ];

  const getHabitDotStyle = (status: EstadoHabito) => {
    switch (status) {
      case 'cumplido':
        return 'bg-red-600 hover:bg-red-700 ring-1 ring-red-300';
      case 'minimo':
        return 'bg-amber-500 hover:bg-amber-600 ring-1 ring-amber-300';
      case 'no_hecho':
        return 'bg-zinc-400 hover:bg-zinc-500';
      default:
        return 'bg-zinc-200 hover:bg-zinc-300';
    }
  };

  // Tag color helper
  const getCategoryTagClass = (cat: string) => {
    switch (cat.toUpperCase()) {
      case 'CREA Y MONETIZA':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'CONSULTORÍA':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MONETIZACIÓN':
      case 'VENTAS':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'MARKETING':
      case 'VALOR (DAR)':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'PRODUCTO':
      case 'TECH':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SALUD':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'VIDA':
      case 'PERSONAL':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Date Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevDay}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-red-600 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Ayer</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span className="font-bold text-sm text-zinc-900">{dateHeaderText}</span>
            {isToday && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                PRESENTE
              </span>
            )}
          </div>

          <button
            onClick={goToNextDay}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-red-600 transition-colors"
          >
            <span>Mañana</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tutorial')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-red-600" />
            <span>Ver Video Guía</span>
          </button>

          <button
            onClick={goToToday}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Hoy</span>
          </button>
        </div>
      </div>

      {/* Banner de Estado Limpio para Prueba desde Cero */}
      {isDataClean && (
        <div className="bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border border-red-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
              ✨
            </div>
            <div>
              <div className="font-bold text-sm text-zinc-900">
                Aplicación lista para prueba desde cero
              </div>
              <div className="text-xs text-zinc-600">
                Todos los datos han sido limpiados. Puedes construir tus propios motores y hábitos desde cero, o cargar los datos de ejemplo de Patricia en cualquier momento.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setActiveTab('plan')}
              className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-2xs"
            >
              Crear Roadmap &rarr;
            </button>
            <button
              onClick={() => loadDemoData()}
              className="px-3 py-1.5 rounded-xl bg-white border border-zinc-300 text-zinc-700 text-xs font-semibold hover:bg-zinc-100 transition-colors"
              title="Restaurar datos predefinidos de la metodología"
            >
              Cargar datos de ejemplo
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Left Column & Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Tu Enfoque de Hoy & Agenda de Hoy */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card: Tu Enfoque de Hoy */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <h2 className="font-extrabold text-base text-zinc-900">Tu Enfoque de Hoy</h2>
              </div>
              <span className="text-xs text-zinc-500 font-medium">Criterio: Monetización & Tracción</span>
            </div>

            {/* TOP PRIORIDADES (Ladrillos) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-600" />
                  <span>CHISPAS DIARIAS • TOP ACCIONES DE MONETIZACIÓN</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                  SESIÓN BCM 60-90 MIN
                </span>
              </div>

              {ladrillos.length === 0 && !isAddingPriority && (
                <div className="py-6 px-4 text-center rounded-2xl bg-zinc-50/70 border border-dashed border-zinc-200 space-y-1">
                  <p className="text-xs font-semibold text-zinc-700">
                    No hay Chispas Diarias programadas para hoy.
                  </p>
                  <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
                    Define la acción de alto impacto de hoy con el botón inferior o calibrándola desde el Roadmap.
                  </p>
                </div>
              )}

              {ladrillos.map(item => {
                const motor = getMotorForLadrillo(item, entregables, hitos, torres, metasAnuales);
                return (
                  <div
                    key={item.id}
                    onClick={() => openTaskDetail(item, 'ladrillo')}
                    style={{
                      borderLeftColor: motor.color,
                      borderLeftWidth: '4px'
                    }}
                    className={`group relative flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      item.completada
                        ? 'bg-zinc-50 border-zinc-200 opacity-80'
                        : 'bg-white hover:bg-zinc-50/70 border-zinc-200 shadow-2xs hover:border-zinc-400 hover:shadow-xs'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLadrillo(item.id);
                      }}
                      className="mt-0.5 shrink-0 text-red-600 transition-transform active:scale-90"
                      title={item.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
                    >
                      {item.completada ? (
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center text-white"
                          style={{ backgroundColor: motor.color }}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div
                          className="w-5 h-5 rounded-md border-2 border-zinc-400 hover:border-red-600"
                        />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={`text-sm font-bold leading-tight ${
                            item.completada ? 'line-through text-zinc-400' : 'text-zinc-900'
                          }`}
                        >
                          {item.titulo}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* BCM Indicator or Focus Launcher */}
                          {(item.bloqueTipo === 'BCM' || item.esBCM) && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                startFocusWithLadrillo(item);
                              }}
                              className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase text-white transition-all hover:scale-105 shadow-2xs"
                              style={{ backgroundColor: motor.color }}
                              title="Iniciar Sesión BCM de 90 min (Creación & Monetización)"
                            >
                              <Play className="w-2.5 h-2.5 fill-white" />
                              <span>BCM {item.duracionMinutos}m</span>
                            </button>
                          )}
                          <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-700 transition-colors">
                            Ver por dentro &rarr;
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {/* Motor identity badge */}
                        <span
                          className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1"
                          style={{
                            backgroundColor: motor.bgLight,
                            borderColor: motor.color,
                            color: motor.textDark
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: motor.color }}
                          />
                          <span>Motor de Acción: {motor.categoria}</span>
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryTagClass(
                            item.categoria
                          )}`}
                        >
                          {item.categoria}
                        </span>

                        {item.origenRuta && (
                          <span className="text-[11px] text-zinc-400 truncate">
                            {item.origenRuta}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Priority Inline Form */}
              {isAddingPriority ? (
                <form onSubmit={handleAddPrioritySubmit} className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                  <input
                    type="text"
                    value={newPriorityTitle}
                    onChange={e => setNewPriorityTitle(e.target.value)}
                    placeholder="Nombre de la Chispa Diaria (Acción de Monetización)..."
                    className="w-full text-xs font-medium p-2 bg-white rounded-xl border border-zinc-300 focus:outline-none focus:border-red-600"
                    autoFocus
                  />
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={newPriorityCategory}
                      onChange={e => setNewPriorityCategory(e.target.value)}
                      className="text-xs font-semibold p-1.5 bg-white rounded-xl border border-zinc-300 focus:outline-none"
                    >
                      <option value="CREA Y MONETIZA">CREA Y MONETIZA</option>
                      <option value="CONSULTORÍA">CONSULTORÍA</option>
                      <option value="MONETIZACIÓN">MONETIZACIÓN</option>
                      <option value="MARKETING">MARKETING</option>
                      <option value="SALUD">SALUD</option>
                      <option value="VIDA">VIDA</option>
                    </select>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingPriority(false)}
                        className="px-2.5 py-1 text-xs text-zinc-500 hover:text-zinc-800"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingPriority(true)}
                  className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-red-400 text-xs font-bold text-zinc-500 hover:text-red-600 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Acción de Alto Impacto</span>
                </button>
              )}
            </div>

            {/* BLOQUE DE PENDIENTES (TARDE) */}
            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
                  BLOQUE DE PENDIENTES (TARDE)
                </span>
                <span className="text-[11px] text-zinc-400 italic">
                  Tareas operativas sin culpa
                </span>
              </div>

              <div className="space-y-2">
                {pendientes.length === 0 && !isAddingPending && (
                  <div className="py-3 px-3 text-center rounded-xl bg-zinc-50 border border-zinc-200/60">
                    <p className="text-[11px] text-zinc-400 font-medium">
                      No hay tareas operativas en la tarde. Foco 100% despejado.
                    </p>
                  </div>
                )}

                {pendientes.map(pen => (
                  <div
                    key={pen.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50/80 hover:bg-zinc-100/70 border border-zinc-200 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => togglePendiente(pen.id)}
                        className="text-zinc-400 hover:text-red-600 shrink-0"
                      >
                        {pen.completada ? (
                          <CheckCircle2 className="w-4 h-4 text-red-600" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      <span
                        className={`truncate font-medium ${
                          pen.completada ? 'line-through text-zinc-400' : 'text-zinc-800'
                        }`}
                      >
                        {pen.titulo}
                      </span>
                    </div>

                    <span className="text-[10px] uppercase font-bold text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200 shrink-0">
                      {pen.categoria}
                    </span>
                  </div>
                ))}

                {isAddingPending ? (
                  <form onSubmit={handleAddPendingSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={newPendingTitle}
                      onChange={e => setNewPendingTitle(e.target.value)}
                      placeholder="Nueva tarea de tarde..."
                      className="flex-1 text-xs p-2 bg-white rounded-xl border border-zinc-300 focus:outline-none focus:border-red-600"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800"
                    >
                      Añadir
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingPending(false)}
                      className="px-2 text-xs text-zinc-500"
                    >
                      ✕
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAddingPending(true)}
                    className="w-full py-1.5 text-xs text-zinc-500 hover:text-zinc-800 text-center font-medium"
                  >
                    + Agregar pendiente a la tarde
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card: Agenda del Día */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <h2 className="font-extrabold text-base text-zinc-900">Agenda Estratégica del Día</h2>
              </div>
              <span className="text-xs text-zinc-500 font-medium">Bloques Protegidos</span>
            </div>

            <div className="space-y-2.5">
              {agenda.length === 0 ? (
                <div className="py-6 px-4 text-center rounded-2xl bg-zinc-50/70 border border-dashed border-zinc-200">
                  <p className="text-xs font-semibold text-zinc-600">
                    No hay bloques de agenda programados para hoy.
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Puedes programar bloques y Sesiones BCM desde la vista "Calendario & Ventas".
                  </p>
                </div>
              ) : (
                agenda.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    item.esBCM
                      ? 'bg-red-50/50 border-red-200'
                      : 'bg-zinc-50/50 border-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-zinc-500">
                      {item.horaInicio} {item.horaFin ? `— ${item.horaFin}` : ''}
                    </span>
                    <span className="text-xs font-bold text-zinc-900">
                      {item.titulo}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      item.esBCM
                        ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                        : 'bg-white text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {item.esBCM ? 'SESIÓN BCM' : item.categoria}
                  </span>
                </div>
              )))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: La Meta de Esta Semana & Hábitos */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card: La Meta de Esta Semana */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <h2 className="font-extrabold text-base text-zinc-900">Ajuste y Entregable de la Semana</h2>
              </div>
              <span className="text-xs font-mono text-zinc-500">Semana 39</span>
            </div>

            {/* Big Active Goal Display */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-red-50/60 via-white to-amber-50/30 border border-red-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  AJUSTE SEMANAL REY • MOTOR DE MONETIZACIÓN
                </span>
                <span className="text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  ALTO VALOR
                </span>
              </div>

              <div className="font-black text-xl text-zinc-900 leading-snug">
                {activeEntregable ? activeEntregable.titulo : 'Sin entregable semanal activo aún'}
              </div>

              {/* Big CTA Button: Aterrizar un paso mínimo hoy */}
              <button
                id="btn-aterrizar-paso-minimo"
                onClick={() => openAterrizarFlow()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <Flame className="w-4 h-4 text-white" />
                <span>↓ Calibrar y Encender Chispa Diaria de Hoy ↓</span>
              </button>
            </div>

            {/* Deliverable Tiles */}
            {entregables.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {entregables.slice(0, 4).map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setActiveTab('plan')}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-red-500 cursor-pointer transition-all shadow-2xs"
                  >
                    <span className="text-xs font-bold text-zinc-900 truncate mr-2" title={card.titulo}>
                      {card.titulo}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      card.estado === 'completada' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {card.estado === 'completada' ? 'LISTO' : 'EN CURSO'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-zinc-200 text-center bg-zinc-50/60">
                <p className="text-xs font-semibold text-zinc-600">Sin entregables semanales creados</p>
                <button
                  onClick={() => setActiveTab('plan')}
                  className="mt-1 text-xs text-red-600 font-bold hover:underline"
                >
                  Ir al Roadmap en Cascada para crear tu primer engranaje &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Card: Hábitos Mini-Tracker */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <h2 className="font-extrabold text-base text-zinc-900">Rituales & Hábitos</h2>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2.5 text-[10px] font-bold text-zinc-500">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  <span>CUMPLIDO</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>MVO</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-400"></span>
                  <span>PAUSA</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-200"></span>
                  <span>PEND</span>
                </div>
              </div>
            </div>

            {/* Habit Table with Days */}
            {habitos.length === 0 ? (
              <div className="py-6 px-4 text-center rounded-2xl bg-zinc-50/70 border border-dashed border-zinc-200 space-y-1">
                <p className="text-xs font-semibold text-zinc-700">
                  No hay hábitos registrados aún.
                </p>
                <p className="text-[11px] text-zinc-400">
                  Configura tus rituales matutinos y de monetización en la pestaña de Hábitos.
                </p>
                <button
                  onClick={() => setActiveTab('habitos')}
                  className="mt-2 text-xs text-red-600 font-bold hover:underline inline-block"
                >
                  Ir a Rituales & Hábitos &rarr;
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      <th className="pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        HÁBITO
                      </th>
                      {weekDays.map(d => (
                        <th
                          key={d.date}
                          className={`pb-2 text-center text-[10px] font-bold text-zinc-500 ${
                            d.date === selectedDate ? 'text-red-600 font-black' : ''
                          }`}
                        >
                          {d.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {habitos.slice(0, 5).map(h => (
                      <tr key={h.id} className="hover:bg-zinc-50/70">
                        <td className="py-2.5 text-xs font-bold text-zinc-800 pr-2">
                          {h.nombre}
                        </td>
                        {weekDays.map(d => {
                          const status = h.checks[d.date] || 'pendiente';
                          return (
                            <td key={d.date} className="py-2.5 text-center">
                              <button
                                onClick={() => updateHabitoCheck(h.id, d.date)}
                                className={`w-4 h-4 rounded-full transition-transform active:scale-90 inline-block ${getHabitDotStyle(
                                  status
                                )}`}
                                title={`${h.nombre} - ${d.label}: ${status} (Click para cambiar)`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Motivational Philosophy Quote */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600 italic text-center">
              "«La consistencia imperfecta siempre supera a la intensidad esporádica. Tu negocio agradecerá más que hagas el mínimo viable a que desaparezcas semanas.» — Patricia Loaiza"
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM STRIP: Tu Brújula & Sabiduría Cuaderno */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tu Brújula */}
        <div
          onClick={() => setActiveTab('claridad')}
          className="flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200 hover:border-red-500 cursor-pointer transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span className="font-bold text-xs text-zinc-900">Tu Brújula</span>
            <div className="flex items-center gap-1.5">
              {user.atributosYoPro.map((attr, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200"
                >
                  {attr}
                </span>
              ))}
            </div>
          </div>
          <span className="text-xs font-bold text-red-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Propuesta</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Sabiduría */}
        <div
          onClick={() => setActiveTab('sabiduria')}
          className="flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200 hover:border-red-500 cursor-pointer transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-3 truncate">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span className="font-bold text-xs text-zinc-900">Bitácora</span>
            <span className="text-xs text-zinc-500 italic truncate">
              "{sabiduria.aprendizajes[0] || 'Subir el listón aumentó el compromiso de los clientes...'}"
            </span>
          </div>
          <span className="text-xs font-bold text-red-600 shrink-0 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Lecciones</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
