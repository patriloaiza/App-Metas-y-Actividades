import React from 'react';
import { useApp } from '../context/AppContext';
import { LogoCreaYMonetiza } from './LogoCreaYMonetiza';
import {
  Video,
  Play,
  Calendar,
  Sparkles,
  Menu,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Target
} from 'lucide-react';

interface TopHeaderProps {
  onToggleMobileSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    activeTab,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    goToPrevDay,
    goToNextDay,
    goToToday,
    setIsFocusModeOpen,
    ladrillos
  } = useApp();

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    inicio: {
      title: 'Foco Diario & Acción',
      subtitle: 'Tus prioridades de monetización y ejecución de hoy'
    },
    plan: {
      title: 'Roadmap en Cascada: Crear a Monetizar',
      subtitle: 'Aterrizaje en 5 niveles: De la gran visión a la tarea de hoy'
    },
    habitos: {
      title: 'Rituales & Hábitos de Alto Rendimiento',
      subtitle: 'Disciplina flexible y consistencia con Mínimo Viable (MVO)'
    },
    calendario: {
      title: 'Calendario Estratégico & Ventas',
      subtitle: 'Lanzamientos, entregas VIP y sincronización con tu energía'
    },
    claridad: {
      title: 'Brújula & Propuesta de Valor',
      subtitle: 'Tu identidad de consultora, oferta irresistible y límites sagrados'
    },
    sabiduria: {
      title: 'Bitácora de Sabiduría & ROI Semanal',
      subtitle: 'Cuadrantes de análisis y extracción de reglas de oro con IA'
    },
    balance: {
      title: 'Balance Creación vs. Vida Personal',
      subtitle: 'Equilibrio de energía 80/20 y prevención de fatiga'
    },
    tutorial: {
      title: 'Video Tutorial & Guía de la Metodología',
      subtitle: 'Cómo usar cada sección según el marco de Patricia Loaiza'
    }
  };

  const currentInfo = tabTitles[activeTab] || tabTitles.inicio;
  const isToday = selectedDate === '2026-09-21';

  // Find if there is an uncompleted BCM brick
  const uncompletedBcm = ladrillos.find(l => (l.bloqueTipo === 'BCM' || l.esBCM) && !l.completada);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-6 py-3.5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            title="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="md:hidden">
            <LogoCreaYMonetiza variant="light" size="xs" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-zinc-900">
                {currentInfo.title}
              </h1>
              <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                Crea & Monetiza
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium hidden sm:block">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions & Video Guide Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Explain Tab Video Button */}
          {activeTab !== 'tutorial' && (
            <button
              onClick={() => setActiveTab('tutorial')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 transition-all shadow-2xs hover:scale-102"
              title="Ver video explicativo y guía para esta pestaña"
            >
              <Video className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">¿Para qué sirve esta pestaña?</span>
              <span className="sm:hidden">Video Guía</span>
            </button>
          )}

          {/* Quick BCM Launcher */}
          <button
            onClick={() => setIsFocusModeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white transition-all shadow-xs hover:scale-102"
            title="Iniciar Sesión BCM (Bloque de Creación & Monetización de 90 min)"
          >
            <Play className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span className="hidden sm:inline">Iniciar Sesión BCM (90 min)</span>
            <span className="sm:hidden">BCM</span>
          </button>

          {/* Date Navigator for Daily Views */}
          {activeTab === 'inicio' && (
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-xl border border-zinc-200">
              <button
                onClick={goToPrevDay}
                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-white transition-colors"
                title="Día anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={goToToday}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                  isToday
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-white'
                }`}
                title="Ir a Hoy"
              >
                Hoy
              </button>

              <button
                onClick={goToNextDay}
                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-white transition-colors"
                title="Día siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
