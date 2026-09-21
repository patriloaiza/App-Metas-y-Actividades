import React from 'react';
import { useApp, TabType } from '../context/AppContext';
import { LogoCreaYMonetiza } from './LogoCreaYMonetiza';
import {
  Target,
  Layers,
  Flame,
  Calendar,
  Compass,
  BookOpen,
  Scale,
  Video,
  HeartHandshake,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  onOpenDarModal: () => void;
  onOpenEnergyModal: () => void;
}

interface NavItem {
  id: TabType;
  nombre: string;
  subtitulo: string;
  icono: any;
  badge?: string;
  destacado?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  onOpenDarModal,
  onOpenEnergyModal
}) => {
  const { activeTab, setActiveTab, user, resetAllData, loadDemoData, isDataClean } = useApp();

  const navigationItems: NavItem[] = [
    {
      id: 'inicio',
      nombre: 'Foco Diario & Acción',
      subtitulo: 'Chispas Diarias & Sesiones BCM',
      icono: Target,
      badge: 'Hoy'
    },
    {
      id: 'plan',
      nombre: 'Roadmap en Cascada',
      subtitulo: 'De la Visión a la Monetización',
      icono: Layers,
      badge: 'Estrategia'
    },
    {
      id: 'habitos',
      nombre: 'Rituales de Escala',
      subtitulo: 'Disciplina & Mínimo Viable',
      icono: Flame,
      badge: undefined
    },
    {
      id: 'calendario',
      nombre: 'Calendario & Ventas',
      subtitulo: 'Lanzamientos y Energía',
      icono: Calendar,
      badge: undefined
    },
    {
      id: 'claridad',
      nombre: 'Brújula & Propuesta',
      subtitulo: 'Identidad, Oferta y Límites',
      icono: Compass,
      badge: undefined
    },
    {
      id: 'sabiduria',
      nombre: 'Bitácora & ORI Semanal',
      subtitulo: 'Inspección del Motor & Patrones de Oro',
      icono: BookOpen,
      badge: 'IA'
    },
    {
      id: 'balance',
      nombre: 'Balance 80/20',
      subtitulo: 'Negocio vs. Vida Personal',
      icono: Scale,
      badge: undefined
    },
    {
      id: 'tutorial',
      nombre: 'Video Tutorial & Guía',
      subtitulo: 'Cómo usar cada pestaña',
      icono: Video,
      badge: 'Importante',
      destacado: true
    }
  ];

  return (
    <aside
      className={`relative flex flex-col bg-[#0B0C10] text-zinc-300 border-r border-zinc-800/80 transition-all duration-300 shrink-0 z-30 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-800/70 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="space-y-1 overflow-hidden">
            <LogoCreaYMonetiza variant="dark" size="sm" />
            <div className="flex items-center gap-1.5 pt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-950/80 text-red-400 border border-red-800/50">
                Zona Privada
              </span>
              <span className="text-[10px] text-zinc-400 font-medium truncate">
                Patricia Loaiza
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto">
            {/* Small icon badge in collapsed mode with exact logo symbol */}
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center p-1 border border-zinc-800 shadow-md">
              <img
                src="/Logo crea y monetiza.png"
                alt="CM"
                className="w-full h-full object-cover object-left"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ${
            isCollapsed ? 'mx-auto mt-2' : ''
          }`}
          title={isCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Video Callout Banner (when not collapsed) */}
      {!isCollapsed && activeTab !== 'tutorial' && (
        <div className="mx-3 mt-3 p-3 rounded-2xl bg-gradient-to-br from-red-950/60 to-zinc-900 border border-red-800/40 text-left">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-600/30 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
              <Video className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-white leading-tight">
                ¿Nueva aquí? Mira el video
              </div>
              <div className="text-[10px] text-zinc-400 leading-snug truncate">
                Explicación de cada pestaña
              </div>
              <button
                onClick={() => setActiveTab('tutorial')}
                className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors underline underline-offset-2"
              >
                <span>Ver Tutorial de la Metodología</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
        <div className={`px-2 pb-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-500 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? '•••' : 'Metodología Crea y Monetiza'}
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icono;
          const isActive = activeTab === item.id;
          const isSpecial = item.destacado;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? `${item.nombre} - ${item.subtitulo}` : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all relative group ${
                isActive
                  ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-950/40'
                  : isSpecial
                  ? 'bg-zinc-900/80 text-red-400 hover:bg-zinc-800 hover:text-red-300 border border-red-900/40'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full" />
              )}

              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive
                    ? 'text-white'
                    : isSpecial
                    ? 'text-red-500'
                    : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <div className="truncate">
                    <div className={`text-xs leading-tight truncate ${isActive ? 'text-white font-extrabold' : 'text-zinc-200 font-medium'}`}>
                      {item.nombre}
                    </div>
                    <div className={`text-[10px] leading-tight truncate mt-0.5 ${isActive ? 'text-red-100' : 'text-zinc-500'}`}>
                      {item.subtitulo}
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isSpecial
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Auxiliary Actions & Tools Footer */}
      <div className="p-3 border-t border-zinc-800/80 space-y-2 bg-[#08090C]">
        {!isCollapsed && (
          <div className="px-2 text-[10px] font-black uppercase tracking-wider text-zinc-500">
            Aceleradores de Energía
          </div>
        )}

        <div className="space-y-1">
          {/* Principio DAR */}
          <button
            onClick={onOpenDarModal}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Principio DAR: Aporte de valor desinteresado"
          >
            <HeartHandshake className="w-4 h-4 text-orange-400 shrink-0" />
            {!isCollapsed && <span className="truncate">Principio DAR (Valor)</span>}
          </button>

          {/* Ajustes de Energía / Cronotipo */}
          <button
            onClick={onOpenEnergyModal}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Arquitectura de Potencia, Cronotipo & Horas Pico"
          >
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            {!isCollapsed && <span className="truncate">Cronotipo & Ritmo del Motor</span>}
          </button>

          {/* Limpiar toda la app para prueba desde cero */}
          <button
            onClick={() => {
              if (window.confirm('¿Deseas reiniciar toda la app para hacer una prueba limpia desde cero? Se vaciarán los motores, tareas y hábitos actuales.')) {
                resetAllData();
              }
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Limpiar toda la app para prueba desde cero"
          >
            <RotateCcw className="w-4 h-4 text-red-500 shrink-0" />
            {!isCollapsed && <span className="truncate">Limpiar App (Prueba de cero)</span>}
          </button>

          {/* Si está limpia, opción rápida para recargar ejemplo si se desea */}
          {isDataClean && (
            <button
              onClick={() => loadDemoData()}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-left text-xs font-semibold text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/40 transition-colors ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
              title="Cargar datos de ejemplo para explorar"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              {!isCollapsed && <span className="truncate">Cargar datos ejemplo</span>}
            </button>
          )}
        </div>

        {/* User Identity Footer */}
        <div className={`pt-2 border-t border-zinc-850 flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : 'px-1'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm">
            PL
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                Patricia Loaiza
              </div>
              <div className="text-[10px] text-red-400 font-medium truncate">
                Consultora & Mentora
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
