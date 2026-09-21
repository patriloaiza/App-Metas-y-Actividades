import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Check, Flame, Sparkles, Trash2 } from 'lucide-react';
import { EstadoHabito, Habito } from '../types';

export const HabitosView: React.FC = () => {
  const { habitos, updateHabitoCheck, addHabito, deleteHabito, selectedDate } = useApp();

  const [viewMode, setViewMode] = useState<'dia' | 'semana'>('semana');
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCat, setNewHabitCat] = useState<Habito['categoria']>('Ritual mañana');
  const [newHabitMin, setNewHabitMin] = useState('');
  const [newHabitFreq, setNewHabitFreq] = useState(7);

  const weekDays = [
    { label: 'Lun 21', date: '2026-09-21' },
    { label: 'Mar 22', date: '2026-09-22' },
    { label: 'Mié 23', date: '2026-09-23' },
    { label: 'Jue 24', date: '2026-09-24' },
    { label: 'Vie 25', date: '2026-09-25' },
    { label: 'Sáb 26', date: '2026-09-26' },
    { label: 'Dom 27', date: '2026-09-27' }
  ];

  const getStatusColor = (status: EstadoHabito) => {
    switch (status) {
      case 'cumplido':
        return 'bg-red-600 hover:bg-red-700 text-white shadow-2xs';
      case 'minimo':
        return 'bg-amber-500 hover:bg-amber-600 text-white';
      case 'no_hecho':
        return 'bg-zinc-400 hover:bg-zinc-500 text-white';
      default:
        return 'bg-zinc-200 hover:bg-zinc-300 text-zinc-500';
    }
  };

  const ritualHabits = habitos.filter(h => h.categoria === 'Ritual mañana');
  const businessHabits = habitos.filter(h => h.categoria !== 'Ritual mañana');

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabito(newHabitName.trim(), newHabitCat, newHabitMin, newHabitFreq);
    setNewHabitName('');
    setNewHabitMin('');
    setIsAddingHabit(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Header */}
      <div className="space-y-3 max-w-4xl">
        <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-red-600">
          03 — HÁBITOS & RITUALES DE SOSTENIBILIDAD
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
          Disciplina flexible:{' '}
          <span className="text-red-600">los hábitos recurrentes que hacen girar el motor</span>{' '}
          (incluso en los días más difíciles).
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
          Ten organizados tus hábitos de vida y negocio, ajusta frecuencias, pausa cuando lo necesites
          y vuelve sin perder todo tu progreso. Diseñas hábitos que se adaptan a tu realidad diaria,
          no a una versión "perfecta" de ti. Si solo tienes 10 minutos, avanzarás 10 minutos en tu mínimo viable. Mantén el
          progreso vivo sin la culpa de no ser "perfecto".
        </p>

        <div className="text-xs font-bold text-red-700">
          Crea y Monetiza te ayuda a enfocarte en el <span className="underline font-black">progreso y tracción real</span>, no en la parálisis por perfección.
        </div>
      </div>

      {/* Main Habits Container */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-6">
        {/* Container Top Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="font-extrabold text-xl text-zinc-900">Hábitos del Motor</h2>
            <button
              onClick={() => setIsAddingHabit(true)}
              className="px-3 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1 border border-red-200"
            >
              <Plus className="w-3.5 h-3.5 text-red-600" />
              <span>Nuevo Hábito</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-zinc-600">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-600"></span> IDEAL
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span> MÍNIMO VIABLE
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-zinc-400"></span> NO SE HIZO
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-zinc-200"></span> PENDIENTE
              </span>
            </div>

            {/* Día / Semana toggle */}
            <div className="bg-zinc-100 p-1 rounded-full border border-zinc-200 flex items-center text-xs font-bold">
              <button
                onClick={() => setViewMode('dia')}
                className={`px-3 py-1 rounded-full transition-all ${
                  viewMode === 'dia' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
                }`}
              >
                DÍA
              </button>
              <button
                onClick={() => setViewMode('semana')}
                className={`px-3 py-1 rounded-full transition-all ${
                  viewMode === 'semana' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
                }`}
              >
                SEMANA
              </button>
            </div>
          </div>
        </div>

        {/* Add Habit Inline Modal */}
        {isAddingHabit && (
          <form onSubmit={handleCreateHabit} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Crear Nuevo Hábito con Mínimo Viable
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                autoFocus
                value={newHabitName}
                onChange={e => setNewHabitName(e.target.value)}
                placeholder="Nombre del hábito (ej: Prospección diaria)"
                className="px-3 py-2 rounded-xl border border-zinc-300 text-xs"
              />
              <input
                type="text"
                value={newHabitMin}
                onChange={e => setNewHabitMin(e.target.value)}
                placeholder="Mínimo viable (ej: 1 mensaje de valor)"
                className="px-3 py-2 rounded-xl border border-zinc-300 text-xs"
              />
              <select
                value={newHabitCat}
                onChange={e => setNewHabitCat(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
              >
                <option value="Ritual mañana">Ritual mañana</option>
                <option value="Negocio + propósito">Negocio + propósito</option>
                <option value="Salud + vitalidad">Salud + vitalidad</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingHabit(false)}
                className="px-3 py-1.5 text-xs text-zinc-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
              >
                Guardar Hábito
              </button>
            </div>
          </form>
        )}

        {/* Section 1: Ritual Mañana */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-700">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Ritual mañana (Energía y Claridad)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-100 text-[11px] font-bold text-zinc-500">
                  <th className="pb-2 w-1/3">HÁBITO</th>
                  {weekDays.map(d => (
                    <th key={d.date} className="pb-2 text-center">
                      <div className="text-[10px] text-zinc-500 uppercase">{d.label.split(' ')[0]}</div>
                      <div className={`font-black text-xs ${d.date === selectedDate ? 'text-red-600' : ''}`}>
                        {d.label.split(' ')[1]}
                      </div>
                    </th>
                  ))}
                  <th className="pb-2 text-right">RACHA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {ritualHabits.map(h => (
                  <tr key={h.id} className="hover:bg-zinc-50/70">
                    <td className="py-3 pr-2">
                      <div className="font-bold text-xs text-zinc-900 flex items-baseline gap-2">
                        <span>{h.nombre}</span>
                        <span className="text-[10px] text-zinc-400 font-normal">
                          {Object.values(h.checks).filter(s => s === 'cumplido' || s === 'minimo').length}/7
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{h.minimoViable}</div>
                    </td>
                    {weekDays.map(d => {
                      const status = h.checks[d.date] || 'pendiente';
                      return (
                        <td key={d.date} className="py-3 text-center">
                          <button
                            onClick={() => updateHabitoCheck(h.id, d.date)}
                            className={`w-6 h-6 rounded-lg transition-transform active:scale-90 inline-flex items-center justify-center font-bold text-[10px] ${getStatusColor(
                              status
                            )}`}
                            title={`${h.nombre} (${d.label}): ${status}`}
                          >
                            {status === 'cumplido' && '✓'}
                            {status === 'minimo' && '•'}
                            {status === 'no_hecho' && '✕'}
                          </button>
                        </td>
                      );
                    })}
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        <Flame className="w-3 h-3 text-amber-600" />
                        <span>{h.streakActual}d</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Negocio + Propósito */}
        <div className="space-y-3 pt-4 border-t border-zinc-100">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-700">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Negocio, Tracción & Monetización</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-zinc-100">
                {businessHabits.map(h => (
                  <tr key={h.id} className="hover:bg-zinc-50/70">
                    <td className="py-3 pr-2 w-1/3">
                      <div className="font-bold text-xs text-zinc-900 flex items-baseline gap-2">
                        <span>{h.nombre}</span>
                        <span className="text-[10px] text-zinc-400 font-normal">
                          {Object.values(h.checks).filter(s => s === 'cumplido' || s === 'minimo').length}/
                          {h.frecuenciaSemanal}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{h.minimoViable}</div>
                    </td>
                    {weekDays.map(d => {
                      const status = h.checks[d.date] || 'pendiente';
                      return (
                        <td key={d.date} className="py-3 text-center">
                          <button
                            onClick={() => updateHabitoCheck(h.id, d.date)}
                            className={`w-6 h-6 rounded-lg transition-transform active:scale-90 inline-flex items-center justify-center font-bold text-[10px] ${getStatusColor(
                              status
                            )}`}
                            title={`${h.nombre} (${d.label}): ${status}`}
                          >
                            {status === 'cumplido' && '✓'}
                            {status === 'minimo' && '•'}
                            {status === 'no_hecho' && '✕'}
                          </button>
                        </td>
                      );
                    })}
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        <Flame className="w-3 h-3 text-amber-600" />
                        <span>{h.streakActual}d</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Highlighting Card */}
        <div className="p-5 rounded-3xl bg-red-50/50 border border-red-200 space-y-2">
          <h3 className="font-black text-base text-zinc-900">
            El progreso se sostiene, no se rompe.
          </h3>
          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
            Si el miércoles no alcanzaste el tiempo ideal y solo pudiste hacer el mínimo viable, tu Motor sigue en marcha. Ninguna de las dos cosas borra
            lo que ya construiste. Avanza con serenidad mental y vuelve al día siguiente sin reproches.
          </p>
        </div>
      </div>
    </div>
  );
};
