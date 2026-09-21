import React from 'react';
import { useApp, TabType } from '../context/AppContext';
import { LogoCreaYMonetiza } from './LogoCreaYMonetiza';
import {
  Compass,
  Calendar,
  Layers,
  CheckCircle2,
  BookOpen,
  PieChart,
  Play,
  Sparkles,
  HeartHandshake,
  RotateCcw,
  Zap
} from 'lucide-react';

interface NavbarProps {
  onOpenDarModal?: () => void;
  onOpenEnergyModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDarModal, onOpenEnergyModal }) => {
  const {
    activeTab,
    setActiveTab,
    isFocusModeOpen,
    setIsFocusModeOpen,
    openAiBreakdownForMeta,
    resetAllData,
    user
  } = useApp();

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'inicio', label: 'Inicio', icon: CheckCircle2 },
    { id: 'habitos', label: 'Hábitos', icon: CheckCircle2 },
    { id: 'plan', label: 'Plan', icon: Layers },
    { id: 'calendario', label: 'Calendario', icon: Calendar },
    { id: 'sabiduria', label: 'Sabiduría', icon: BookOpen },
    { id: 'claridad', label: 'Claridad', icon: Compass },
    { id: 'balance', label: 'Balance 20/80', icon: PieChart }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#EAE6DF] px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-2 cursor-pointer select-none group"
            id="brand-logo-btn"
          >
            <LogoCreaYMonetiza variant="light" size="sm" />
          </div>
        </div>

        {/* Navigation Tabs (matches pill bar in screenshot 1) */}
        <nav className="hidden md:flex items-center bg-[#F1EFEA] p-1 rounded-full border border-[#E4DEC3]/60 shadow-inner">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-[#144637] shadow-sm font-semibold'
                    : 'text-[#5C6661] hover:text-[#144637] hover:bg-white/50'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Special DAR pill */}
          <button
            id="nav-tab-dar"
            onClick={onOpenDarModal}
            className="ml-1 px-3 py-1 rounded-full text-xs font-bold text-[#9E3E2B] bg-[#FCEEEA] hover:bg-[#F8DDD6] transition-colors border border-[#F5D2C8]"
            title="Principio DAR: Publicar valor y generosidad"
          >
            DAR
          </button>
        </nav>

        {/* Action Controls & User Profile */}
        <div className="flex items-center gap-2">
          {/* Quick BCM Timer Launcher */}
          <button
            id="btn-start-bcm-header"
            onClick={() => setIsFocusModeOpen(!isFocusModeOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all text-xs font-semibold shadow-xs hover:shadow active:scale-95"
            title="Iniciar Sesión BCM (Bloque de Creación & Monetización - 60 a 90 min)"
          >
            <Play className="w-3.5 h-3.5 fill-current text-white" />
            <span className="hidden sm:inline">Sesión BCM</span>
          </button>

          {/* AI Strategy Breakdown */}
          <button
            id="btn-ai-assistant-header"
            onClick={() => openAiBreakdownForMeta()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-all text-xs font-medium border border-red-200"
            title="Asistente IA Crea y Monetiza: Desglosar engranajes con IA"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">IA Motor</span>
          </button>

          {/* Energy & Bio-cycle Indicator */}
          <button
            id="btn-energy-modal-header"
            onClick={onOpenEnergyModal}
            className="p-1.5 rounded-full bg-white text-[#5C6661] hover:text-[#144637] hover:bg-[#F1EFEA] border border-[#EAE6DF] transition-colors"
            title="Configurar picos de energía y ritmo circadiano"
          >
            <Zap className="w-4 h-4 text-amber-500" />
          </button>

          {/* Reset Demo Data */}
          <button
            id="btn-reset-data-header"
            onClick={() => {
              if (window.confirm('¿Deseas reiniciar los datos de ejemplo de Be PRO?')) {
                resetAllData();
              }
            }}
            className="p-1.5 rounded-full bg-white text-[#5C6661] hover:text-[#9E3E2B] hover:bg-[#FCEEEA] border border-[#EAE6DF] transition-colors"
            title="Restaurar datos de ejemplo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* User Yo PRO Avatar (JC) */}
          <div
            id="user-avatar-btn"
            onClick={() => setActiveTab('claridad')}
            className="w-8 h-8 rounded-full bg-[#165A42] text-white font-bold text-xs flex items-center justify-center cursor-pointer ring-2 ring-[#E8F3EE] hover:ring-[#165A42] transition-all"
            title={`El Yo PRO: ${user.nombre} (${user.atributosYoPro.join(' • ')})`}
          >
            <span>JC</span>
          </div>
        </div>
      </div>

      {/* Mobile Nav Pills Bar */}
      <div className="flex md:hidden items-center justify-start overflow-x-auto pt-2.5 pb-0.5 gap-1.5 no-scrollbar">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium transition-all ${
                isActive
                  ? 'bg-[#144637] text-white font-semibold shadow-xs'
                  : 'bg-[#F1EFEA] text-[#5C6661]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
        <button
          onClick={onOpenDarModal}
          className="px-2.5 py-1 rounded-full text-xs font-bold text-[#9E3E2B] bg-[#FCEEEA] border border-[#F5D2C8] whitespace-nowrap"
        >
          DAR
        </button>
      </div>
    </header>
  );
};
