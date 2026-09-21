import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Sparkles, Check, Plus, ShieldAlert, Heart, Target, Video } from 'lucide-react';
import { playSuccessChime } from '../utils/audio';

export const ClaridadView: React.FC = () => {
  const { user, updateUser, setActiveTab } = useApp();

  const [newAttribute, setNewAttribute] = useState('');
  const [newQuiero, setNewQuiero] = useState('');
  const [newNoQuiero, setNewNoQuiero] = useState('');

  const handleAddAttr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttribute.trim()) return;
    updateUser({
      atributosYoPro: [...user.atributosYoPro, newAttribute.trim()]
    });
    setNewAttribute('');
    playSuccessChime();
  };

  const handleAddQuiero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuiero.trim()) return;
    updateUser({
      queQuiero: [...user.queQuiero, newQuiero.trim()]
    });
    setNewQuiero('');
    playSuccessChime();
  };

  const handleAddNoQuiero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoQuiero.trim()) return;
    updateUser({
      queNoQuiero: [...user.queNoQuiero, newNoQuiero.trim()]
    });
    setNewNoQuiero('');
    playSuccessChime();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Header */}
      <div className="space-y-3 max-w-4xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
            01 — CLARIDAD & PROPUESTA DE VALOR
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
          Tu Brújula de Negocio:{' '}
          <span className="text-red-600">Lo que construyes y tus límites sagrados.</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
          En la metodología Crea y Monetiza de Patricia Loaiza, antes de redactar una propuesta o abrir la agenda de consultorías, necesitas blindar tu identidad, definir exactamente qué resultados deseas crear y qué condiciones no tolerarás jamás.
        </p>
      </div>

      {/* Main Brújula Box */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-xl text-zinc-900">Tu Brújula Estratégica</h2>
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">
            HERRAMIENTA CREA Y MONETIZA
          </span>
        </div>

        {/* 1. MI IDENTIDAD ESTRATÉGICA */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-zinc-900">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>MI IDENTIDAD (MENTALIDAD DE ALTO VALOR)</span>
            </div>
            <span className="text-[10px] text-zinc-500">Arquetipo rector</span>
          </div>

          <p className="text-xs text-zinc-600 italic">
            "La versión de mí que ofrece soluciones de alto valor con total certeza, abundancia y paz mental, sin dejarse arrastrar por la prisa o la complacencia."
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {user.atributosYoPro.map((attr, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200"
              >
                {attr}
              </span>
            ))}
          </div>

          <form onSubmit={handleAddAttr} className="flex gap-2 pt-2 max-w-sm">
            <input
              type="text"
              value={newAttribute}
              onChange={e => setNewAttribute(e.target.value)}
              placeholder="Nueva cualidad (ej: Certeza Implacable)..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-zinc-300 bg-white focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700"
            >
              + Agregar
            </button>
          </form>
        </div>

        {/* 2. LO QUE QUIERO (MI VISIÓN & OFERTA) */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-red-700">
              <Target className="w-4 h-4 text-red-600" />
              <span>LO QUE QUIERO (MI VISIÓN DE MONETIZACIÓN)</span>
            </div>
            <span className="text-[10px] text-zinc-500">Destino deseado</span>
          </div>

          <div className="space-y-2">
            {user.queQuiero.map((item: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-zinc-200 text-xs font-medium text-zinc-800 shadow-2xs"
              >
                <span className="font-bold text-red-600 shrink-0">{idx + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddQuiero} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newQuiero}
              onChange={e => setNewQuiero(e.target.value)}
              placeholder="Escribe algo que sí quieres construir en tu negocio y vida..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-zinc-300 bg-white focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700"
            >
              + Guardar
            </button>
          </form>
        </div>

        {/* 3. LO QUE NO QUIERO (MIS NO NEGOCIABLES) */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-zinc-900">
              <ShieldAlert className="w-4 h-4 text-zinc-700" />
              <span>LO QUE NO QUIERO (MIS NO NEGOCIABLES)</span>
            </div>
            <span className="text-[10px] text-zinc-500">Límites sagrados</span>
          </div>

          <div className="space-y-2">
            {user.queNoQuiero.map((item: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-red-200/80 text-xs font-medium text-zinc-800 shadow-2xs"
              >
                <span className="font-bold text-red-600 shrink-0">✕ {idx + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddNoQuiero} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newNoQuiero}
              onChange={e => setNewNoQuiero(e.target.value)}
              placeholder="Escribe algo que no estás dispuesto a tolerar jamás en tu negocio..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-zinc-300 bg-white focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800"
            >
              + Guardar
            </button>
          </form>
        </div>

        {/* Highlight Quote */}
        <div className="p-5 rounded-3xl bg-red-50/50 border border-red-200/80 space-y-2 text-center">
          <p className="text-xs sm:text-sm text-zinc-800 font-medium leading-relaxed">
            <strong className="text-red-700 font-bold">
              "«Vender con certeza nace de saber con absoluta claridad qué valor aportas y a quién no debes dejar entrar a tu negocio.»"
            </strong>{' '}
            — Patricia Loaiza
          </p>
        </div>
      </div>
    </div>
  );
};
