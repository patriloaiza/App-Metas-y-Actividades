import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import { toggleFocusAmbience, playSuccessChime } from '../utils/audio';
import { LadrilloDiario } from '../types';

export const FocusBCMModal: React.FC = () => {
  const {
    isFocusModeOpen,
    setIsFocusModeOpen,
    activeFocusLadrillo,
    ladrillos,
    toggleLadrillo
  } = useApp();

  const [selectedLadrillo, setSelectedLadrillo] = useState<LadrilloDiario | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number>(90);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(90 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync active focus brick on open
  useEffect(() => {
    if (activeFocusLadrillo) {
      setSelectedLadrillo(activeFocusLadrillo);
      const mins = activeFocusLadrillo.duracionMinutos || 90;
      setDurationMinutes(mins);
      setTimeLeftSeconds(mins * 60);
    } else if (ladrillos.length > 0) {
      const firstUncompleted = ladrillos.find(l => !l.completada) || ladrillos[0];
      setSelectedLadrillo(firstUncompleted);
      const mins = firstUncompleted.duracionMinutos || 90;
      setDurationMinutes(mins);
      setTimeLeftSeconds(mins * 60);
    }
  }, [activeFocusLadrillo, isFocusModeOpen, ladrillos]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds(prev => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0 && isRunning) {
      setIsRunning(false);
      playSuccessChime();
      if (selectedLadrillo && !selectedLadrillo.completada) {
        toggleLadrillo(selectedLadrillo.id);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeftSeconds, selectedLadrillo, toggleLadrillo]);

  // Audio ambience
  useEffect(() => {
    if (!isFocusModeOpen) {
      setIsAudioOn(false);
      toggleFocusAmbience(false);
    }
  }, [isFocusModeOpen]);

  const toggleSound = () => {
    const nextState = !isAudioOn;
    setIsAudioOn(nextState);
    toggleFocusAmbience(nextState);
  };

  const setPresetTime = (mins: number) => {
    setDurationMinutes(mins);
    setTimeLeftSeconds(mins * 60);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeLeftSeconds(durationMinutes * 60);
    setIsRunning(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = ((durationMinutes * 60 - timeLeftSeconds) / (durationMinutes * 60)) * 100;

  if (!isFocusModeOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#07080A]/95 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      {/* Outer Card */}
      <div
        className={`w-full max-w-2xl bg-[#0F1015] border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-2xl relative transition-all ${
          isFullscreen ? 'h-screen w-screen max-w-none rounded-none justify-center' : ''
        }`}
      >
        {/* Top bar controls */}
        <div className="w-full flex items-center justify-between mb-4 text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
              MODO FOCO • SESIÓN BCM (BLOQUES DE CREACIÓN & MONETIZACIÓN)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                isAudioOn
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
              }`}
              title={isAudioOn ? 'Silenciar sonido de concentración' : 'Activar sonido de concentración profunda'}
            >
              {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white transition-colors"
              title="Pantalla completa"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                setIsFocusModeOpen(false);
                toggleFocusAmbience(false);
                setIsAudioOn(false);
              }}
              className="p-2 rounded-xl bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white transition-colors"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Ladrillo Header */}
        <div className="w-full p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 mb-4">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
              SESIÓN BCM: CREACIÓN DE PRODUCTOS O VENTAS
            </span>
            {selectedLadrillo?.categoria && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
                {selectedLadrillo.categoria}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="font-bold text-lg text-white">
              {selectedLadrillo ? selectedLadrillo.titulo : 'Selecciona una acción para enfocar'}
            </div>
            {selectedLadrillo && (
              <button
                onClick={() => {
                  toggleLadrillo(selectedLadrillo.id);
                  playSuccessChime();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedLadrillo.completada
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{selectedLadrillo.completada ? 'Completado' : 'Marcar Hecho'}</span>
              </button>
            )}
          </div>

          {selectedLadrillo?.origenRuta && (
            <div className="mt-2 text-xs text-red-300/80 flex items-center gap-1 font-mono">
              <span className="opacity-70">Aterrizada desde:</span> {selectedLadrillo.origenRuta}
            </div>
          )}
        </div>

        {/* Big Timer Circle */}
        <div className="my-6 relative flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="#27272A"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="#DC2626"
                strokeWidth="4"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPct) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                {formatTime(timeLeftSeconds)}
              </span>
              <span className="text-xs font-medium text-red-400 mt-1">
                {isRunning ? '🔥 Sesión BCM en Ejecución' : 'Sesión BCM en pausa'}
              </span>
            </div>
          </div>
        </div>

        {/* Timer Presets */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { label: '60 min (Creación Rápida)', mins: 60 },
            { label: '90 min (Sesión BCM Óptima)', mins: 90 },
            { label: '30 min (Sprint de Ajuste)', mins: 30 }
          ].map(p => (
            <button
              key={p.mins}
              onClick={() => setPresetTime(p.mins)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                durationMinutes === p.mins
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-4">
          <button
            id="btn-toggle-timer"
            onClick={() => {
              const next = !isRunning;
              setIsRunning(next);
              if (next && !isAudioOn) {
                setIsAudioOn(true);
                toggleFocusAmbience(true);
              }
            }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-lg transition-all active:scale-95"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            <span>{isRunning ? 'Pausar Sesión BCM' : 'Iniciar Sesión BCM (Crear & Monetizar)'}</span>
          </button>

          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
            title="Reiniciar temporizador"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Anti-distraction rule quote */}
        <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 text-center max-w-md">
          <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span>Regla sagrada Crea y Monetiza: WhatsApp cerrado, sin llamadas reactivas. Tu Motor de Monetización se construye en este bloque de 60 a 90 min.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
