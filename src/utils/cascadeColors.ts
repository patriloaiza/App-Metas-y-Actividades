import { MetaAnual, MetaTrimestral, HitoMensual, EntregableSemanal, LadrilloDiario } from '../types';

export interface MotorColorInfo {
  motorId: string;
  motorTitulo: string;
  categoria: string;
  color: string; // e.g. '#DC2626'
  bgLight: string; // e.g. '#FEF2F2'
  textDark: string; // e.g. '#991B1B'
  borderColor: string;
}

const DEFAULT_MOTOR_COLOR: MotorColorInfo = {
  motorId: 'meta-1',
  motorTitulo: 'Motor Principal Crea y Monetiza',
  categoria: 'Negocio',
  color: '#DC2626',
  bgLight: '#FEF2F2',
  textDark: '#991B1B',
  borderColor: '#F87171'
};

/**
 * Returns the color information of the Motor Anual for an Engranaje (MetaTrimestral)
 */
export function getMotorForTorre(
  torre: MetaTrimestral,
  metasAnuales: MetaAnual[]
): MotorColorInfo {
  const meta = metasAnuales.find(m => m.id === torre.metaAnualId);
  if (!meta) return DEFAULT_MOTOR_COLOR;
  return {
    motorId: meta.id,
    motorTitulo: meta.titulo,
    categoria: meta.categoria,
    color: meta.colorIdentificador || DEFAULT_MOTOR_COLOR.color,
    bgLight: meta.bgLight || DEFAULT_MOTOR_COLOR.bgLight,
    textDark: meta.textDark || DEFAULT_MOTOR_COLOR.textDark,
    borderColor: meta.colorIdentificador
  };
}

/**
 * Returns the color information of the Motor Anual for a Componente del Mes (HitoMensual)
 */
export function getMotorForHito(
  hito: HitoMensual,
  torres: MetaTrimestral[],
  metasAnuales: MetaAnual[]
): MotorColorInfo {
  const torre = torres.find(t => t.id === hito.metaTrimestralId);
  if (!torre) return DEFAULT_MOTOR_COLOR;
  return getMotorForTorre(torre, metasAnuales);
}

/**
 * Returns the color information of the Motor Anual for an Ajuste Semanal (EntregableSemanal)
 */
export function getMotorForEntregable(
  entregable: EntregableSemanal,
  hitos: HitoMensual[],
  torres: MetaTrimestral[],
  metasAnuales: MetaAnual[]
): MotorColorInfo {
  const hito = hitos.find(h => h.id === entregable.hitoMensualId);
  if (!hito) return DEFAULT_MOTOR_COLOR;
  return getMotorForHito(hito, torres, metasAnuales);
}

/**
 * Returns the color information of the Motor Anual for a Chispa Diaria (LadrilloDiario)
 */
export function getMotorForLadrillo(
  ladrillo: LadrilloDiario,
  entregables: EntregableSemanal[],
  hitos: HitoMensual[],
  torres: MetaTrimestral[],
  metasAnuales: MetaAnual[]
): MotorColorInfo {
  // 1. Trace by delivered weekly task ID
  if (ladrillo.entregableSemanalId) {
    const entregable = entregables.find(e => e.id === ladrillo.entregableSemanalId);
    if (entregable) {
      return getMotorForEntregable(entregable, hitos, torres, metasAnuales);
    }
  }

  // 2. Trace by matching colorIdentificador directly
  if (ladrillo.colorIdentificador) {
    const metaByColor = metasAnuales.find(
      m => m.colorIdentificador.toLowerCase() === ladrillo.colorIdentificador?.toLowerCase()
    );
    if (metaByColor) {
      return {
        motorId: metaByColor.id,
        motorTitulo: metaByColor.titulo,
        categoria: metaByColor.categoria,
        color: metaByColor.colorIdentificador,
        bgLight: metaByColor.bgLight,
        textDark: metaByColor.textDark,
        borderColor: metaByColor.colorIdentificador
      };
    }
  }

  // 3. Trace by category match
  if (ladrillo.categoria) {
    const catLower = ladrillo.categoria.toLowerCase();
    const metaByCat = metasAnuales.find(m => catLower.includes(m.categoria.toLowerCase()));
    if (metaByCat) {
      return {
        motorId: metaByCat.id,
        motorTitulo: metaByCat.titulo,
        categoria: metaByCat.categoria,
        color: metaByCat.colorIdentificador,
        bgLight: metaByCat.bgLight,
        textDark: metaByCat.textDark,
        borderColor: metaByCat.colorIdentificador
      };
    }
  }

  return DEFAULT_MOTOR_COLOR;
}

/**
 * Maps any arbitrary task or event category to a Motor color
 */
export function getMotorColorByCategory(
  categoria: string,
  metasAnuales: MetaAnual[]
): MotorColorInfo {
  const catLower = categoria.toLowerCase();
  
  if (catLower.includes('salud') || catLower.includes('vitalidad') || catLower.includes('descanso')) {
    const meta = metasAnuales.find(m => m.categoria === 'Salud');
    if (meta) return getMotorColorFromMeta(meta);
  }

  if (catLower.includes('finanza') || catLower.includes('dinero') || catLower.includes('patrimonio')) {
    const meta = metasAnuales.find(m => m.categoria === 'Finanzas');
    if (meta) return getMotorColorFromMeta(meta);
  }

  if (catLower.includes('personal') || catLower.includes('familia') || catLower.includes('vida')) {
    const meta = metasAnuales.find(m => m.categoria === 'Personal' || m.categoria === 'Familia');
    if (meta) return getMotorColorFromMeta(meta);
  }

  // Default to Negocio Motor
  const negocioMeta = metasAnuales.find(m => m.categoria === 'Negocio') || metasAnuales[0];
  if (negocioMeta) return getMotorColorFromMeta(negocioMeta);

  return DEFAULT_MOTOR_COLOR;
}

/**
 * Returns color info for a TareaPendiente based on category mapping
 */
export function getMotorForPendiente(
  pendiente: { categoria?: string; titulo: string },
  metasAnuales: MetaAnual[]
): MotorColorInfo {
  if (pendiente.categoria === 'finanzas') {
    const finMeta = metasAnuales.find(m => m.categoria === 'Finanzas');
    if (finMeta) return getMotorColorFromMeta(finMeta);
  }
  const titleLower = pendiente.titulo.toLowerCase();
  if (titleLower.includes('salud') || titleLower.includes('médic') || titleLower.includes('ejercicio')) {
    const salMeta = metasAnuales.find(m => m.categoria === 'Salud');
    if (salMeta) return getMotorColorFromMeta(salMeta);
  }
  if (titleLower.includes('familia') || titleLower.includes('personal') || titleLower.includes('descanso')) {
    const perMeta = metasAnuales.find(m => m.categoria === 'Personal');
    if (perMeta) return getMotorColorFromMeta(perMeta);
  }
  // Default to business/negocio
  const negMeta = metasAnuales.find(m => m.categoria === 'Negocio') || metasAnuales[0];
  if (negMeta) return getMotorColorFromMeta(negMeta);
  return DEFAULT_MOTOR_COLOR;
}

/**
 * Returns color info for an agenda block based on its category/type
 */
export function getMotorForAgendaBlock(
  bloque: { categoria: string; titulo: string; esBCM?: boolean },
  metasAnuales: MetaAnual[]
): MotorColorInfo {
  if (bloque.categoria === 'SALUD') {
    const salMeta = metasAnuales.find(m => m.categoria === 'Salud');
    if (salMeta) return getMotorColorFromMeta(salMeta);
  }
  if (bloque.categoria === 'VIDA') {
    const perMeta = metasAnuales.find(m => m.categoria === 'Personal');
    if (perMeta) return getMotorColorFromMeta(perMeta);
  }
  if (bloque.categoria === 'RITUAL') {
    const salMeta = metasAnuales.find(m => m.categoria === 'Salud');
    if (salMeta) return getMotorColorFromMeta(salMeta);
  }
  // FOCO or TRABAJO or esBCM -> Negocio
  const negMeta = metasAnuales.find(m => m.categoria === 'Negocio') || metasAnuales[0];
  if (negMeta) return getMotorColorFromMeta(negMeta);
  return DEFAULT_MOTOR_COLOR;
}

export function getMotorColorFromMeta(meta: MetaAnual): MotorColorInfo {
  return {
    motorId: meta.id,
    motorTitulo: meta.titulo,
    categoria: meta.categoria,
    color: meta.colorIdentificador,
    bgLight: meta.bgLight,
    textDark: meta.textDark,
    borderColor: meta.colorIdentificador
  };
}

export const DISTINCT_MOTOR_PALETTE = [
  { categoria: 'Negocio', color: '#DC2626', bgLight: '#FEF2F2', textDark: '#991B1B', label: 'Rojo Carmesí (Crea y Monetiza)' },
  { categoria: 'Salud', color: '#059669', bgLight: '#ECFDF5', textDark: '#065F46', label: 'Verde Esmeralda (Combustible y Vitalidad)' },
  { categoria: 'Finanzas', color: '#D97706', bgLight: '#FFFBEB', textDark: '#92400E', label: 'Ámbar Dorado (Flujo de Caja y Libertad)' },
  { categoria: 'Personal', color: '#2563EB', bgLight: '#EFF6FF', textDark: '#1E40AF', label: 'Azul Real (Familia y Tiempo Sagrado)' },
  { categoria: 'Estrategia', color: '#7C3AED', bgLight: '#F5F3FF', textDark: '#5B21B6', label: 'Violeta Estratégico (Sabiduría y Dirección)' },
  { categoria: 'Sistemas', color: '#0891B2', bgLight: '#ECFEFF', textDark: '#155E75', label: 'Cian Operativo (Automatización y Maquinaria)' },
  { categoria: 'Innovación', color: '#EA580C', bgLight: '#FFF7ED', textDark: '#9A3412', label: 'Naranja Óxido (Nuevos Activos)' },
  { categoria: 'Infraestructura', color: '#475569', bgLight: '#F8FAFC', textDark: '#1E293B', label: 'Grafito Maquinaria (Soporte Técnico)' }
];

export function getNextAvailableDistinctColor(existingMetas: MetaAnual[], desiredCategory?: string) {
  const usedColors = new Set(existingMetas.map(m => m.colorIdentificador.toLowerCase()));
  
  // Try matching by category first if color not already used
  if (desiredCategory) {
    const byCat = DISTINCT_MOTOR_PALETTE.find(p => p.categoria.toLowerCase() === desiredCategory.toLowerCase());
    if (byCat && !usedColors.has(byCat.color.toLowerCase())) {
      return byCat;
    }
  }

  // Find first unused color from distinct palette
  const unused = DISTINCT_MOTOR_PALETTE.find(p => !usedColors.has(p.color.toLowerCase()));
  if (unused) return unused;

  // Fallback cycling
  return DISTINCT_MOTOR_PALETTE[existingMetas.length % DISTINCT_MOTOR_PALETTE.length];
}

