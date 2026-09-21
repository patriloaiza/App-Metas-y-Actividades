export type CategoriaMeta = 'Negocio' | 'Salud' | 'Pareja' | 'Espiritualidad' | 'Finanzas' | 'Familia' | 'Personal';

export type EstadoTarea = 'pendiente' | 'en_curso' | 'completada' | 'pausada';

export type EstadoHabito = 'cumplido' | 'minimo' | 'no_hecho' | 'pendiente';

export interface UserYoPro {
  id: string;
  nombre: string;
  atributosYoPro: string[]; // 3 virtudes (ej. "Sabio", "Amor total", "Certeza")
  queQuiero: string[];
  queNoQuiero: string[];
}

export interface MetaAnual {
  id: string;
  titulo: string;
  categoria: CategoriaMeta;
  colorIdentificador: string; // ej: '#1E5C47' (verde), '#8C6B1B' (oro), '#24548A' (azul), etc.
  bgLight: string;
  textDark: string;
  ano: number;
  progreso: number; // 0-100
  descripcion?: string;
}

export interface MetaTrimestral {
  id: string;
  metaAnualId: string;
  trimestre: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  entregableClave: string;
  estado: EstadoTarea;
}

export interface HitoMensual {
  id: string;
  metaTrimestralId: string;
  mes: string; // ej: "Septiembre 2026"
  titulo: string;
  estado: EstadoTarea;
}

export interface EntregableSemanal {
  id: string;
  hitoMensualId: string;
  semanaNumero: number;
  semanaRango: string; // ej: "21 Sep — 27 Sep"
  titulo: string;
  estado: EstadoTarea;
  esMetaActivaSemana?: boolean;
}

export interface LadrilloDiario {
  id: string;
  entregableSemanalId?: string;
  fecha: string; // YYYY-MM-DD
  titulo: string;
  bloqueTipo: 'BCM' | 'Tarea';
  esBCM?: boolean;
  duracionMinutos: number; // 60, 90, etc.
  completada: boolean;
  categoria: string;
  origenRuta?: string; // Trazabilidad: [Motor: $100k] ➔ [Engranaje Q4: Lanzamiento] ➔ [Componente Octubre: Embudo] ➔ [Ajuste Semanal: Copys] ➔ [Chispa Diaria: Redactar Email #1]
  colorIdentificador?: string;
  impacto?: 'Alto' | 'Medio' | 'Clave';
}

export interface TareaPendiente {
  id: string;
  titulo: string;
  fecha: string;
  completada: boolean;
  nota?: string;
  categoria: 'admin' | 'to-do' | 'mensajes' | 'finanzas';
}

export interface Habito {
  id: string;
  nombre: string;
  categoria: 'Ritual mañana' | 'Negocio + propósito' | 'Salud + vitalidad';
  minimoViable: string; // ej: "Mínimo: 15m", "Mínimo: 2m lectura"
  frecuenciaSemanal: number; // ej 7, 5, 3
  streakActual: number;
  // Key: YYYY-MM-DD
  checks: Record<string, EstadoHabito>;
}

export interface BloqueAgenda {
  id: string;
  horaInicio: string; // "11:00"
  horaFin?: string;
  titulo: string;
  categoria: 'TRABAJO' | 'SALUD' | 'FOCO' | 'VIDA' | 'RITUAL';
  fecha: string;
  esBCM?: boolean;
}

export interface CicloSabiduria {
  id: string;
  semanaNumero: number;
  semanaRango: string;
  agradecimientos: string[];
  aprendizajes: string[];
  queFunciono: string[];
  queNoFunciono: string[];
  ajustesSiguienteSemana: string[];
  accionObligatoria: string;
  completada: boolean;
}

export interface ConfiguracionEnergia {
  cronotipo: 'ignicion_matutina' | 'potencia_continua' | 'torque_vespertino' | 'alondra' | 'colibri' | 'buho';
  horaPicoInicio: string; // ej: "08:30"
  horaPicoFin: string; // ej: "11:30"
  regimenOperacion?: 'aceleracion_bcm' | 'traccion_comercial' | 'calibracion_sistemas' | 'enfriamiento_motor';
  recomendarSesionBCM?: string;
  cicloMenstrualActivo?: boolean;
  faseCiclo?: string;
}

// ==========================================
// Metodología Crea y Monetiza - Patricia Loaiza
// Entidades y Nomenclatura del Motor:
// ==========================================
export type MotorMonetizacion = MetaAnual;
export type EngranajePrincipal = MetaTrimestral;
export type ComponenteMes = HitoMensual;
export type AjusteSemanal = EntregableSemanal;
export type ChispaDiaria = LadrilloDiario;
export type InspeccionMotor = CicloSabiduria;

