import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, AlertCircle, PieChart, Activity, Heart, Briefcase, Zap, Sparkles, DollarSign, TrendingUp, Clock, Target, ArrowUpRight } from 'lucide-react';

export const BalanceView: React.FC = () => {
  const { ladrillos, habitos } = useApp();

  const completedLadrillos = ladrillos.filter(l => l.completada).length;
  const totalLadrillos = ladrillos.length;

  const businessBricks = ladrillos.filter(l => l.categoria === 'CREA Y MONETIZA' || l.categoria === 'CONSULTORÍA' || l.categoria === 'MONETIZACIÓN' || l.categoria === 'VENTAS' || l.categoria === 'FOCO').length;
  const lifeBricks = ladrillos.filter(l => l.categoria === 'SALUD' || l.categoria === 'VIDA' || l.categoria === 'PERSONAL' || l.categoria === 'RITUAL').length;

  const totalBricksCount = Math.max(1, businessBricks + lifeBricks);
  const porcentajeNegocio = Math.round((businessBricks / totalBricksCount) * 100) || 68;
  const porcentajeVida = 100 - porcentajeNegocio;

  // Calculadora interactiva de ROI Semanal BCM
  const [horasBCMSemana, setHorasBCMSemana] = useState<number>(12);
  const [ticketPromedio, setTicketPromedio] = useState<number>(1500); // USD
  const [ventasAlMes, setVentasAlMes] = useState<number>(3); // ventas por mes

  // Facturación mensual estimada = ventasAlMes * ticketPromedio
  const facturacionMensual = ventasAlMes * ticketPromedio;
  const facturacionSemanal = Math.round(facturacionMensual / 4);
  const valorHoraBCM = Math.round(facturacionSemanal / Math.max(1, horasBCMSemana));

  const balanceMetricas = {
    porcentajeNegocio,
    porcentajeVida,
    horasBCMSemana: 13.5,
    alertaDesbalance: porcentajeNegocio > 75
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Header */}
      <div className="space-y-3 max-w-4xl">
        <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-red-600">
          06 — ROI SEMANAL & BALANCE DE ENERGÍA 20/80
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
          Retorno de inversión semanal:{' '}
          <span className="text-red-600">el valor financiero de tu foco y tu paz</span>.
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
          Crea y Monetiza de Patricia Loaiza no busca que trabajes más horas, sino que el 20% de tu tiempo
          en <strong className="text-zinc-900">Sesiones BCM</strong> genere el 80% de tus ingresos, protegiendo
          estrictamente tu salud, tu sueño y tu tiempo en familia.
        </p>
      </div>

      {/* Primary ROI Cards (Patricia Loaiza Brand Colors: Red, Charcoal & Amber) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Valor por Hora de Sesión BCM */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white rounded-3xl p-6 shadow-md border border-zinc-800 space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-red-600/20 transition-all"></div>
          
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-400">
              ROI Semanal de Foco
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-baseline gap-1">
              ${valorHoraBCM} <span className="text-xs font-bold text-zinc-400">USD / hr</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1 font-medium">
              Valor generado por hora de Sesión BCM
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-between text-[11px]">
            <span className="text-zinc-300">Vs. hora reactiva dispersa:</span>
            <span className="font-bold text-red-400">~14x más rentable</span>
          </div>
        </div>

        {/* Card 2: Horas en Sesiones BCM */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
              Horas en Sesiones BCM
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-zinc-900">
              {balanceMetricas.horasBCMSemana} hrs
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              Acumuladas esta semana en bloques de 60 a 90 min
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-red-50 text-[11px] text-red-700 font-semibold border border-red-200">
            Equivale a más de 30 horas de trabajo reactivo en piloto automático.
          </div>
        </div>

        {/* Card 3: Chispas Diarias Encendidas */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
              Tracción de Chispas Diarias
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-zinc-900">
              {completedLadrillos} / {totalLadrillos}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              Acciones atómicas que alimentaron el motor esta semana
            </div>
          </div>

          <div className="text-xs text-zinc-600 italic">
            "Cada Chispa Diaria ejecutada en una Sesión BCM añade una pieza sólida a tu maquinaria de ventas."
          </div>
        </div>
      </div>

      {/* Interactive ROI Calculator Section */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-4 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <h2 className="font-extrabold text-lg text-zinc-900">
                Calculadora de Rentabilidad • Metodología Crea y Monetiza
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Simula cómo el blindar tus Sesiones BCM multiplica tu facturación sin quemar tu energía
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-black text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            Marco Patricia Loaiza
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-5">
            {/* Slider 1: Horas BCM */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-zinc-800">
                  Horas Semanales Dedicadas a Sesiones BCM (Creación de Ofertas, Contenido & Ventas)
                </label>
                <span className="font-mono text-sm font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                  {horasBCMSemana} hrs/sem
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="25"
                step="1"
                value={horasBCMSemana}
                onChange={e => setHorasBCMSemana(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 mt-1 font-mono">
                <span>4 hrs (Mínimo Viable)</span>
                <span>12 hrs (Recomendado Patricia Loaiza)</span>
                <span>25 hrs (Límite Máximo Sostenible)</span>
              </div>
            </div>

            {/* Inputs: Ticket & Ventas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                  Precio Promedio de tu Oferta / Consultoría (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-600 font-bold text-xs">$</span>
                  <input
                    type="number"
                    value={ticketPromedio}
                    onChange={e => setTicketPromedio(Math.max(100, Number(e.target.value)))}
                    className="w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                  Nuevos Clientes o Ventas Mensuales Estimadas
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={ventasAlMes}
                    onChange={e => setVentasAlMes(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <span className="absolute right-3 top-2.5 text-zinc-600 text-xs font-medium">clientes/mes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Output Display */}
          <div className="p-6 rounded-2xl bg-zinc-900 text-white space-y-4 border border-zinc-800 shadow-sm">
            <div className="text-xs font-extrabold uppercase tracking-wider text-red-400 flex items-center justify-between">
              <span>Resultado Financiero</span>
              <TrendingUp className="w-4 h-4 text-red-400" />
            </div>

            <div className="space-y-1">
              <div className="text-xs text-zinc-400">Facturación Proyectada / Mes</div>
              <div className="text-2xl font-black text-white tracking-tight">
                ${facturacionMensual.toLocaleString()} USD
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 space-y-1">
              <div className="text-xs text-zinc-400">Retorno por cada Hora BCM</div>
              <div className="text-xl font-black text-red-400">
                ${valorHoraBCM} USD <span className="text-xs text-zinc-400 font-normal">/ hora</span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 leading-relaxed pt-1">
              Con solo <strong className="text-white">{horasBCMSemana} horas de foco</strong> a la semana, tu motor genera tracción predecible sin sacrificar tus fines de semana.
            </div>
          </div>
        </div>
      </div>

      {/* Energy & Vitality Ratio (Negocio vs. Vida) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ratio Card */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Distribución de Energía Semanal (20/80)
            </span>
            <PieChart className="w-4 h-4 text-red-600" />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-zinc-900">
                {balanceMetricas.porcentajeNegocio}% Creación & Negocio
              </span>
              <span className="text-sm font-bold text-red-600">
                {balanceMetricas.porcentajeVida}% Vida & Salud
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3.5 bg-zinc-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${balanceMetricas.porcentajeNegocio}%` }}
                className="bg-red-600 h-full transition-all duration-500"
                title={`${balanceMetricas.porcentajeNegocio}% Creación`}
              />
              <div
                style={{ width: `${balanceMetricas.porcentajeVida}%` }}
                className="bg-zinc-300 h-full transition-all duration-500"
                title={`${balanceMetricas.porcentajeVida}% Vida`}
              />
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            Rango óptimo según Patricia Loaiza: 60-70% Enfoque Estratégico en Sesiones BCM / 30-40% Renovación biológica y vida personal.
          </p>
        </div>

        {/* Pilares de Vitalidad del Emprendedor */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-zinc-900">
              Pilares de Vitalidad No Negociables
            </h3>
            <Activity className="w-4 h-4 text-red-600" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Sueño & Desconexión', val: '8.2 hrs', status: 'Óptimo', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { label: 'Movimiento Físico', val: '5/7 días', status: 'En racha', color: 'bg-red-50 text-red-700 border-red-200' },
              { label: 'Nutrición & Agua', val: 'Cumplido', status: 'Verde', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { label: 'Presencia Pareja/Hijos', val: 'Agendado', status: 'Inamovible', color: 'bg-amber-50 text-amber-800 border-amber-200' }
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="text-[11px] text-zinc-500 font-medium">{item.label}</div>
                <div className="text-base font-black text-zinc-900">{item.val}</div>
                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-md border ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wellness & Calibration Alert Box */}
      {balanceMetricas.alertaDesbalance && (
        <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 flex items-start gap-4 shadow-xs">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-amber-900">
              Recomendación de Calibración • Crea y Monetiza
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              Detectamos que has completado varias Sesiones BCM de alta intensidad mental en las últimas 72 horas.
              Asegúrate de proteger tu caminata vespertina, cenar sin pantallas y desconectar antes de las 21:30 para recargar el motor.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
