import React, { useState } from 'react';
import { X, Zap, Check, Gauge, Cog, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSuccessChime } from '../utils/audio';

interface EnergySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnergySettingsModal: React.FC<EnergySettingsModalProps> = ({ isOpen, onClose }) => {
  const { energia, updateEnergia } = useApp();

  const [cronotipo, setCronotipo] = useState(
    energia.cronotipo || 'ignicion_matutina'
  );
  const [horaPicoInicio, setHoraPicoInicio] = useState(energia.horaPicoInicio || '08:30');
  const [horaPicoFin, setHoraPicoFin] = useState(energia.horaPicoFin || '11:30');
  const [regimenOperacion, setRegimenOperacion] = useState(
    energia.regimenOperacion || 'aceleracion_bcm'
  );
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateEnergia({
      cronotipo: cronotipo as any,
      horaPicoInicio,
      horaPicoFin,
      regimenOperacion: regimenOperacion as any,
      recomendarSesionBCM: `Sesión BCM de Alto Impacto (${horaPicoInicio} - ${horaPicoFin})`
    });
    playSuccessChime();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const cronotiposData = [
    {
      id: 'ignicion_matutina',
      alias: 'alondra',
      nombre: 'Ignición Temprana (Engranaje del Alba)',
      horario: 'Pico: 07:00 - 11:30',
      descripcion: 'Máxima combustión y compresión matutina. Ideal para blindar la Sesión BCM antes del ruido externo.'
    },
    {
      id: 'potencia_continua',
      alias: 'colibri',
      nombre: 'Potencia Continua (Engranaje Central)',
      horario: 'Pico: 10:00 - 14:00',
      descripcion: 'Velocidad de crucero sostenida. Óptimo para ensamblar activos y calibrar la máquina en horas centrales.'
    },
    {
      id: 'torque_vespertino',
      alias: 'buho',
      nombre: 'Alto Torque (Engranaje Vespertino)',
      horario: 'Pico: 16:00 - 20:00',
      descripcion: 'Máxima aceleración y fluidez mental al caer la tarde, con enfoque prolongado sin interrupciones.'
    }
  ];

  const regimenesOperativos = [
    {
      id: 'aceleracion_bcm',
      icono: Flame,
      titulo: 'Modo Ignición BCM (Creación Pura)',
      descripcion: 'Alta compresión mental para construir ofertas, activos y materiales de alto impacto.'
    },
    {
      id: 'traccion_comercial',
      icono: Gauge,
      titulo: 'Modo Tracción Comercial (Engranaje de Ventas)',
      descripcion: 'Energía externa: diagnósticos, prospección activa y llamadas de cierre de alto ticket.'
    },
    {
      id: 'calibracion_sistemas',
      icono: Cog,
      titulo: 'Modo Calibración (Ajuste de Tuercas)',
      descripcion: 'Optimización de procesos, automatizaciones, métricas y pulido de entregables.'
    },
    {
      id: 'enfriamiento_motor',
      icono: ShieldAlert,
      titulo: 'Modo Enfriamiento & Lubricación (Descanso Sagrado)',
      descripcion: 'Mantenimiento no negociable del motor biológico para evitar sobrecalentamiento o fricción.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header con colores de marca Patricia Loaiza */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base text-zinc-900 tracking-tight">
                  Arquitectura de Potencia & Cronotipo del Motor
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                  Crea y Monetiza
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Alinea las Sesiones BCM cuando tu motor biológico tiene máxima compresión y cero fricción.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Cronotipo del Motor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-800">
                Régimen Biológico de tu Motor (Cronotipo)
              </label>
              <span className="text-[11px] font-semibold text-red-600">
                Analogía de Engranajes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {cronotiposData.map(c => {
                const isSelected = cronotipo === c.id || cronotipo === c.alias;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => {
                      setCronotipo(c.id as any);
                      if (c.id === 'ignicion_matutina') {
                        setHoraPicoInicio('07:30');
                        setHoraPicoFin('11:00');
                      } else if (c.id === 'potencia_continua') {
                        setHoraPicoInicio('10:00');
                        setHoraPicoFin('13:30');
                      } else {
                        setHoraPicoInicio('16:00');
                        setHoraPicoFin('19:30');
                      }
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-zinc-950 text-white border-red-600 ring-2 ring-red-600/30 shadow-md'
                        : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[10px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-red-600 text-white' : 'bg-zinc-200 text-zinc-700'
                        }`}>
                          {c.horario}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-red-400" />}
                      </div>
                      <div className="text-xs font-black leading-tight mt-1">
                        {c.nombre}
                      </div>
                    </div>
                    <p className={`text-[10px] mt-2 leading-relaxed ${
                      isSelected ? 'text-zinc-300' : 'text-zinc-500'
                    }`}>
                      {c.descripcion}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horas Pico de Combustión BCM */}
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-red-600" />
                <span className="text-xs font-black uppercase tracking-wider text-zinc-900">
                  Ventana de Máxima Presión de Vapor (Sesión BCM)
                </span>
              </div>
              <span className="text-[11px] font-bold text-zinc-500">
                Bloque diario protegido
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                  Inicio de Ignición BCM
                </label>
                <input
                  type="time"
                  value={horaPicoInicio}
                  onChange={e => setHoraPicoInicio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-mono font-bold text-zinc-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                  Fin de Ignición BCM
                </label>
                <input
                  type="time"
                  value={horaPicoFin}
                  onChange={e => setHoraPicoFin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-mono font-bold text-zinc-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 italic">
              "Si proteges estos 90 minutos diarios, tu motor avanzará más que en 8 horas de dispersión y reuniones improductivas."
            </p>
          </div>

          {/* Estado Operativo & Lubricación de la Maquinaria */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                <Cog className="w-4 h-4 text-red-600" />
                <span>Régimen Operativo Actual de la Maquinaria</span>
              </label>
              <span className="text-[10px] font-mono font-bold text-zinc-400">
                LUBRICACIÓN & RENDIMIENTO
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {regimenesOperativos.map(reg => {
                const IconComponent = reg.icono;
                const isSelected = regimenOperacion === reg.id;
                return (
                  <button
                    type="button"
                    key={reg.id}
                    onClick={() => setRegimenOperacion(reg.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-red-50/80 border-red-600 ring-1 ring-red-500 shadow-xs'
                        : 'bg-white border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1 rounded-md ${
                        isSelected ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-xs font-bold leading-tight ${
                        isSelected ? 'text-red-950 font-black' : 'text-zinc-800'
                      }`}>
                        {reg.titulo}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 pl-6 leading-tight">
                      {reg.descripcion}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Save Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
            <span className="text-[11px] font-semibold text-zinc-400">
              Metodología Crea y Monetiza • Patricia Loaiza
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-xl transition-colors"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition-all hover:scale-102"
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Motor Calibrado</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-white" />
                    <span>Guardar Calibración</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
