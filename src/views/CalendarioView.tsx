import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  Check,
  Download,
  Moon,
  Heart,
  Sparkles,
  Plus,
  Clock,
  ChevronLeft,
  ChevronRight,
  Flame,
  Layers,
  CheckCircle2,
  Circle,
  Tag
} from 'lucide-react';
import { playSuccessChime } from '../utils/audio';
import {
  getMotorForLadrillo,
  getMotorForAgendaBlock,
  getMotorForPendiente
} from '../utils/cascadeColors';

export const CalendarioView: React.FC = () => {
  const {
    isCalendarConnected,
    setIsCalendarConnected,
    energia,
    metasAnuales,
    torres,
    hitos,
    entregables,
    ladrillos,
    agenda,
    pendientes,
    selectedDate,
    setSelectedDate,
    toggleLadrillo,
    togglePendiente,
    addLadrillo,
    startFocusWithLadrillo,
    openAterrizarFlow,
    openTaskDetail
  } = useApp();

  const [capaEventos, setCapaEventos] = useState(true);
  const [capaFasesLunares, setCapaFasesLunares] = useState(false);
  const [capaHorasPico, setCapaHorasPico] = useState(true);
  const [vistaModo, setVistaModo] = useState<'mes' | 'dia'>('mes');
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [isAddingQuickTask, setIsAddingQuickTask] = useState(false);

  // Month configuration: September 2026
  // Sep 1, 2026 is Tuesday. Monday is Aug 31.
  // 30 days in September.
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  // Helper to format date string: 2026-09-DD
  const formatDateStr = (dayNum: number): string => {
    return `2026-09-${String(dayNum).padStart(2, '0')}`;
  };

  // Human readable title for currently selected date
  const getSelectedDateLabel = (dateStr: string) => {
    const parts = dateStr.split('-');
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

  // Get tasks for a given date
  const getTasksForDate = (dateStr: string) => {
    const dayLadrillos = ladrillos.filter(l => l.fecha === dateStr);
    const dayAgenda = agenda.filter(a => a.fecha === dateStr);
    const dayPendientes = pendientes.filter(p => p.fecha === dateStr);
    return { dayLadrillos, dayAgenda, dayPendientes };
  };

  // Tasks for the currently selected date
  const {
    dayLadrillos: currentLadrillos,
    dayAgenda: currentAgenda,
    dayPendientes: currentPendientes
  } = getTasksForDate(selectedDate);

  const totalTasksCurrentDay =
    currentLadrillos.length + currentAgenda.length + currentPendientes.length;

  const handleCreateQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;

    const defaultMotor = metasAnuales[0];
    addLadrillo({
      fecha: selectedDate,
      titulo: quickTaskTitle.trim(),
      bloqueTipo: 'BCM',
      duracionMinutos: 90,
      completada: false,
      categoria: defaultMotor?.categoria || 'NEGOCIO',
      origenRuta: `[Motor: ${defaultMotor?.titulo || 'Crea y Monetiza'}] ➔ Chispa Diaria`,
      colorIdentificador: defaultMotor?.colorIdentificador || '#DC2626',
      impacto: 'Clave'
    });

    setQuickTaskTitle('');
    setIsAddingQuickTask(false);
    playSuccessChime();
  };

  const downloadIcsFile = () => {
    let icsEvents = '';

    agenda.forEach((ag, idx) => {
      const cleanTime = ag.horaInicio.replace(':', '') + '00';
      const cleanDate = ag.fecha.replace(/-/g, '');
      icsEvents += `
BEGIN:VEVENT
UID:crea-monetiza-${ag.id}-${idx}@creaymonetiza.com
DTSTAMP:20260921T090000Z
DTSTART:${cleanDate}T${cleanTime}Z
SUMMARY:${ag.titulo}
DESCRIPTION:Metodología Crea y Monetiza por Patricia Loaiza (${ag.categoria})
STATUS:CONFIRMED
END:VEVENT`;
    });

    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Crea y Monetiza//Patricia Loaiza//ES
CALSCALE:GREGORIAN${icsEvents}
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Crea_y_Monetiza_Calendario_Estrategico.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playSuccessChime();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Intro */}
      <div className="space-y-3 max-w-4xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
            04 — CALENDARIO ESTRATÉGICO
          </span>
          <span className="text-xs font-bold text-zinc-500">
            Visualización con código de color por Motor del Año
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
          Calendario de ejecución diaria con los{' '}
          <span className="text-red-600">colores de cada motor del año.</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
          Cada tarea asignada al día (Chispa Diaria, Sesión BCM o bloque de agenda) muestra automáticamente el <strong>color identificador de su Motor Anual</strong> para que sepas en qué meta de facturación, salud o vida estás invirtiendo tu energía.
        </p>

        {/* Legend of Motors */}
        <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-2">
          <div className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-zinc-500" />
            <span>Código de Colores de tus Motores Anuales:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {metasAnuales.map(m => (
              <div
                key={m.id}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all"
                style={{
                  backgroundColor: m.bgLight,
                  borderColor: m.colorIdentificador,
                  color: m.textDark
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-2xs"
                  style={{ backgroundColor: m.colorIdentificador }}
                />
                <span className="truncate max-w-[200px]">{m.titulo}</span>
                <span className="text-[10px] font-black uppercase opacity-75">
                  ({m.categoria})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Calendar Card */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-6">
        {/* Top Controls: Month Title & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-xl text-zinc-900">Septiembre 2026</h2>
                <span className="text-[10px] font-black bg-zinc-900 text-white px-2 py-0.5 rounded-full">
                  SEMANA 39
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Selecciona cualquier día para inspeccionar sus tareas asignadas con su color de motor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher */}
            <div className="flex rounded-xl bg-zinc-100 p-1 border border-zinc-200 text-xs font-bold">
              <button
                onClick={() => setVistaModo('mes')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  vistaModo === 'mes'
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Vista Mes
              </button>
              <button
                onClick={() => setVistaModo('dia')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  vistaModo === 'dia'
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Vista Día ({selectedDate.slice(8)})
              </button>
            </div>

            {/* Export .ics */}
            <button
              onClick={downloadIcsFile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 text-xs font-bold shadow-2xs"
              title="Exportar archivo iCal (.ics) sincronizable"
            >
              <Download className="w-3.5 h-3.5 text-red-600" />
              <span>Exportar .ics</span>
            </button>
          </div>
        </div>

        {/* Sync with Google Calendar Banner */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-zinc-300 flex items-center justify-center text-red-600">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">
                Sincronización en Tiempo Real
              </div>
              <div className="text-[11px] text-zinc-500">
                Lo que agendas en Crea y Monetiza bloquea tiempo en tu Google Calendar y protege tus Sesiones BCM.
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCalendarConnected(!isCalendarConnected)}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              isCalendarConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-zinc-100 text-zinc-500 border-zinc-200'
            }`}
          >
            ● {isCalendarConnected ? 'CALENDARIO CONECTADO' : 'CALENDARIO DESCONECTADO'}
          </button>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={capaEventos}
              onChange={e => setCapaEventos(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded accent-red-600"
            />
            <span className="text-zinc-800">TAREAS & BLOQUES DE MOTORES (ACTIVA)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={capaFasesLunares}
              onChange={e => setCapaFasesLunares(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded accent-amber-500"
            />
            <span className="text-zinc-600">FASES LUNARES</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={capaHorasPico}
              onChange={e => setCapaHorasPico(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded accent-red-600"
            />
            <span className="text-zinc-800 font-bold">HORAS PICO BCM ({energia.horaPicoInicio} - {energia.horaPicoFin})</span>
          </label>
        </div>

        {/* Calendar Grid Mode */}
        {vistaModo === 'mes' && (
          <div className="space-y-3">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2">
              {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map((dName, idx) => (
                <div
                  key={dName}
                  className={`text-center font-extrabold text-[11px] py-1 tracking-wider ${
                    idx >= 5 ? 'text-zinc-400' : 'text-zinc-700'
                  }`}
                >
                  {dName}
                </div>
              ))}
            </div>

            {/* 7-Column Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Previous month trailing cell: Aug 31 (Monday) */}
              <div className="min-h-[105px] p-2 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex flex-col justify-between opacity-50">
                <span className="text-xs font-bold text-zinc-400">31 Ago</span>
                <span className="text-[9px] text-zinc-400 italic">Mes anterior</span>
              </div>

              {/* September 1 to 30 */}
              {daysInMonth.map(dayNum => {
                const dateStr = formatDateStr(dayNum);
                const isSelected = selectedDate === dateStr;
                const { dayLadrillos, dayAgenda, dayPendientes } = getTasksForDate(dateStr);
                const totalDayItems = dayLadrillos.length + dayAgenda.length + dayPendientes.length;

                return (
                  <div
                    key={dayNum}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`min-h-[115px] p-2 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-red-50/30 border-red-500 ring-2 ring-red-500 shadow-xs'
                        : totalDayItems > 0
                        ? 'bg-white border-zinc-200 hover:border-zinc-400 hover:shadow-2xs'
                        : 'bg-white border-zinc-100 hover:border-zinc-300'
                    }`}
                  >
                    {/* Top Day Header */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-black ${
                          isSelected
                            ? 'text-red-700 bg-red-100 px-1.5 py-0.5 rounded-md'
                            : 'text-zinc-800'
                        }`}
                      >
                        {dayNum}
                      </span>

                      <div className="flex items-center gap-1">
                        {capaFasesLunares && dayNum === 21 && (
                          <span title="Luna Creciente">
                            <Moon className="w-3 h-3 text-amber-500" />
                          </span>
                        )}

                        {capaHorasPico && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-amber-500"
                            title={`Ventana Pico BCM: ${energia.horaPicoInicio} - ${energia.horaPicoFin}`}
                          />
                        )}

                        {totalDayItems > 0 && (
                          <span
                            className="text-[9px] font-extrabold px-1 rounded-full bg-zinc-900 text-white"
                            title={`${totalDayItems} elementos para hoy`}
                          >
                            {totalDayItems}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tasks with respective Motor Color pills */}
                    <div className="space-y-1 mt-1.5 overflow-hidden">
                      {/* Ladrillos Diarios (Chispas) */}
                      {dayLadrillos.map(lad => {
                        const motor = getMotorForLadrillo(
                          lad,
                          entregables,
                          hitos,
                          torres,
                          metasAnuales
                        );
                        return (
                          <div
                            key={lad.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              openTaskDetail(lad, 'ladrillo');
                            }}
                            style={{
                              backgroundColor: motor.bgLight,
                              borderColor: motor.color,
                              color: motor.textDark
                            }}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded border-l-2 truncate flex items-center gap-1 shadow-2xs cursor-pointer hover:brightness-95 hover:scale-[1.02] transition-transform"
                            title={`[Motor de Acción: ${motor.motorTitulo}] ${lad.titulo} - Clic para ver tarjeta completa`}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: motor.color }}
                            />
                            <span className="truncate">{lad.titulo}</span>
                          </div>
                        );
                      })}

                      {/* Agenda Blocks */}
                      {dayAgenda.map(ag => {
                        const motor = getMotorForAgendaBlock(ag, metasAnuales);
                        return (
                          <div
                            key={ag.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              openTaskDetail(ag, 'agenda');
                            }}
                            style={{
                              backgroundColor: motor.bgLight,
                              borderColor: motor.color,
                              color: motor.textDark
                            }}
                            className="text-[9px] font-semibold px-1.5 py-0.5 rounded border-l-2 truncate flex items-center gap-1 cursor-pointer hover:brightness-95 hover:scale-[1.02] transition-transform"
                            title={`[Motor de Acción: ${motor.motorTitulo}] ${ag.horaInicio} - ${ag.titulo} - Clic para ver tarjeta completa`}
                          >
                            <Clock className="w-2.5 h-2.5 shrink-0" style={{ color: motor.color }} />
                            <span className="truncate">{ag.titulo}</span>
                          </div>
                        );
                      })}

                      {/* Pendientes */}
                      {dayPendientes.map(pen => {
                        const motor = getMotorForPendiente(pen, metasAnuales);
                        return (
                          <div
                            key={pen.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              openTaskDetail(pen, 'pendiente');
                            }}
                            style={{
                              backgroundColor: motor.bgLight,
                              borderColor: motor.color,
                              color: motor.textDark
                            }}
                            className="text-[9px] font-medium px-1.5 py-0.5 rounded border-l-2 truncate flex items-center gap-1 opacity-90 cursor-pointer hover:brightness-95 hover:scale-[1.02] transition-transform"
                            title={`[Motor de Acción: ${motor.motorTitulo}] ${pen.titulo} - Clic para ver tarjeta completa`}
                          >
                            <span
                              className="w-1 h-1 rounded-full shrink-0"
                              style={{ backgroundColor: motor.color }}
                            />
                            <span className="truncate">{pen.titulo}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Day Inspector Panel */}
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200/90 shadow-2xs space-y-5">
            {/* Panel Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                  <h3 className="text-base font-black text-zinc-900">
                    Tareas Asignadas para el {getSelectedDateLabel(selectedDate)}
                  </h3>
                </div>
                <p className="text-xs text-zinc-500">
                  Total: {totalTasksCurrentDay} actividades programadas con el color de su motor correspondiente
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingQuickTask(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-red-400" />
                  <span>Añadir Tarea a este Día</span>
                </button>

                <button
                  onClick={() => openAterrizarFlow()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Flame className="w-3.5 h-3.5 text-white" />
                  <span>Aterrizar desde Motor</span>
                </button>
              </div>
            </div>

            {/* Inline Quick Add */}
            {isAddingQuickTask && (
              <form onSubmit={handleCreateQuickTask} className="p-3 bg-white rounded-2xl border border-zinc-300 space-y-2">
                <input
                  type="text"
                  autoFocus
                  value={quickTaskTitle}
                  onChange={e => setQuickTaskTitle(e.target.value)}
                  placeholder={`Nueva tarea para el ${selectedDate}...`}
                  className="w-full text-xs font-semibold p-2 rounded-xl border border-zinc-300 focus:outline-none focus:border-red-600"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingQuickTask(false)}
                    className="text-xs px-3 py-1 text-zinc-500 hover:text-zinc-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="text-xs px-3 py-1 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
                  >
                    Guardar Tarea
                  </button>
                </div>
              </form>
            )}

            {/* Content List */}
            {totalTasksCurrentDay === 0 ? (
              <div className="text-center py-8 space-y-2">
                <CalendarIcon className="w-8 h-8 text-zinc-300 mx-auto" />
                <p className="text-xs font-bold text-zinc-500">
                  No hay tareas asignadas aún para este día.
                </p>
                <button
                  onClick={() => setIsAddingQuickTask(true)}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  + Agregar una Chispa Diaria o Bloque
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. Ladrillos Diarios (Chispas de Motor) */}
                {currentLadrillos.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-black uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-red-600" />
                      <span>Chispas Diarias & Tareas de Motores ({currentLadrillos.length})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {currentLadrillos.map(lad => {
                        const motor = getMotorForLadrillo(
                          lad,
                          entregables,
                          hitos,
                          torres,
                          metasAnuales
                        );
                        return (
                          <div
                            key={lad.id}
                            onClick={() => openTaskDetail(lad, 'ladrillo')}
                            style={{
                              backgroundColor: motor.bgLight,
                              borderColor: motor.color,
                              borderLeftWidth: '5px'
                            }}
                            className={`p-3 rounded-2xl border flex items-start gap-3 shadow-2xs transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] group ${
                              lad.completada ? 'opacity-60' : ''
                            }`}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLadrillo(lad.id);
                              }}
                              className="mt-0.5 text-zinc-400 hover:text-zinc-600 shrink-0"
                            >
                              {lad.completada ? (
                                <CheckCircle2
                                  className="w-4 h-4"
                                  style={{ color: motor.color }}
                                />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: motor.color,
                                    color: '#FFFFFF'
                                  }}
                                >
                                  Motor: {motor.categoria}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {(lad.bloqueTipo === 'BCM' || lad.esBCM) && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startFocusWithLadrillo(lad);
                                      }}
                                      className="text-[9px] font-black px-2 py-0.5 rounded text-white shadow-2xs hover:scale-105 transition-transform"
                                      style={{ backgroundColor: motor.color }}
                                      title="Iniciar Sesión BCM"
                                    >
                                      BCM {lad.duracionMinutos}m
                                    </button>
                                  )}
                                  <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-700 transition-colors">
                                    Ver tarjeta &rarr;
                                  </span>
                                </div>
                              </div>

                              <div
                                className={`text-xs font-bold leading-tight ${
                                  lad.completada ? 'line-through text-zinc-400' : 'text-zinc-900'
                                }`}
                              >
                                {lad.titulo}
                              </div>

                              <div className="mt-1 text-[10px] text-zinc-500 font-medium truncate">
                                {lad.origenRuta || `Asignado a: ${motor.motorTitulo}`}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Bloques de Agenda */}
                {currentAgenda.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-black uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-700" />
                      <span>Bloques de Agenda & Sesiones Programadas ({currentAgenda.length})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {currentAgenda.map(ag => {
                        const motor = getMotorForAgendaBlock(ag, metasAnuales);
                        return (
                          <div
                            key={ag.id}
                            onClick={() => openTaskDetail(ag, 'agenda')}
                            style={{
                              backgroundColor: motor.bgLight,
                              borderColor: motor.color,
                              borderLeftWidth: '5px'
                            }}
                            className="p-3 rounded-2xl border flex items-start gap-3 shadow-2xs cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all group"
                          >
                            <div
                              className="px-2 py-1 rounded-xl text-center font-black text-xs shrink-0"
                              style={{
                                backgroundColor: motor.color,
                                color: '#FFFFFF'
                              }}
                            >
                              {ag.horaInicio}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: `${motor.color}25`,
                                    color: motor.textDark
                                  }}
                                >
                                  Motor {motor.categoria} • {ag.categoria}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {ag.esBCM && (
                                    <span
                                      className="text-[9px] font-black px-1.5 py-0.5 rounded text-white"
                                      style={{ backgroundColor: motor.color }}
                                    >
                                      SESIÓN BCM
                                    </span>
                                  )}
                                  <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-700 transition-colors">
                                    Ver tarjeta &rarr;
                                  </span>
                                </div>
                              </div>

                              <div className="text-xs font-bold text-zinc-900 leading-tight">
                                {ag.titulo}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Tareas Pendientes Operativas */}
                {currentPendientes.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-black uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-700" />
                      <span>Tareas Pendientes del Día ({currentPendientes.length})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {currentPendientes.map(pen => {
                        const motor = getMotorForPendiente(pen, metasAnuales);
                        return (
                          <div
                            key={pen.id}
                            onClick={() => openTaskDetail(pen, 'pendiente')}
                            style={{
                              backgroundColor: motor.bgLight,
                              borderColor: motor.color,
                              borderLeftWidth: '5px'
                            }}
                            className={`p-3 rounded-2xl border flex items-start gap-2.5 shadow-2xs cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all group ${
                              pen.completada ? 'opacity-60' : ''
                            }`}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePendiente(pen.id);
                              }}
                              className="mt-0.5 text-zinc-400 hover:text-zinc-600 shrink-0"
                            >
                              {pen.completada ? (
                                <CheckCircle2
                                  className="w-4 h-4"
                                  style={{ color: motor.color }}
                                />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <span
                                className={`text-xs font-bold leading-tight ${
                                  pen.completada ? 'line-through text-zinc-400' : 'text-zinc-900'
                                }`}
                              >
                                {pen.titulo}
                              </span>
                              <div className="mt-1 flex items-center justify-between gap-1.5 text-[10px]">
                                <div className="flex items-center gap-1">
                                  <span
                                    className="font-black uppercase"
                                    style={{ color: motor.textDark }}
                                  >
                                    {motor.categoria}
                                  </span>
                                  <span className="text-zinc-400">• {pen.categoria}</span>
                                </div>
                                <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-700 transition-colors">
                                  Ver tarjeta &rarr;
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
