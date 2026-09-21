import {
  UserYoPro,
  MetaAnual,
  MetaTrimestral,
  HitoMensual,
  EntregableSemanal,
  LadrilloDiario,
  TareaPendiente,
  Habito,
  BloqueAgenda,
  CicloSabiduria,
  ConfiguracionEnergia
} from '../types';

export const DEMO_USER: UserYoPro = {
  id: 'cm-user-patricia',
  nombre: 'Patricia Loaiza',
  atributosYoPro: ['Estratega de Alto Valor', 'Monetización Ágil', 'Certeza Implacable'],
  queQuiero: [
    'Construir un ecosistema de consultoría escalable y de alto impacto financiero para mí y mis clientes.',
    'Ayudar a emprendedores y profesionales a crear ofertas irresistibles y monetizar con rentabilidad.',
    'Vivir con libertad de tiempo: trabajar 4 días a la semana con total presencia familiar y paz mental.',
    'Sostener mi vitalidad, salud y bienestar como el activo más sagrado de mi negocio.'
  ],
  queNoQuiero: [
    'Aceptar clientes quejumbrosos, tóxicos o que no asumen la responsabilidad de implementar.',
    'Vender horas sueltas sin un marco metodológico estructurado.',
    'Caer en la trampa del perfeccionismo que retrasa los lanzamientos y la monetización.',
    'Jornadas caóticas llenas de urgencias ajenas que interrumpen mi tiempo de creación y descanso.'
  ]
};

// ==========================================
// METODOLOGÍA CREA Y MONETIZA - PATRICIA LOAIZA
// MOTOR DE MONETIZACIÓN: CADENA DE PLANEACIÓN DINÁMICA
// 1. Motor de Monetización (Año)
// 2. Engranajes Principales (Trimestre)
// 3. Componentes del Mes (Mes)
// 4. Ajustes y Entregables (Semana)
// 5. La Chispa Diaria (Día - Sesión BCM)
// ==========================================

export const DEMO_METAS_ANUALES: MetaAnual[] = [
  {
    id: 'meta-1',
    titulo: 'Motor Principal: $100k con Consultoría VIP y Zona de Clientes Crea y Monetiza',
    categoria: 'Negocio',
    colorIdentificador: '#DC2626', // Rojo CM
    bgLight: '#FEF2F2',
    textDark: '#991B1B',
    ano: 2026,
    progreso: 72,
    descripcion: 'Maquinaria técnica, escalable y predecible que genera activos digitales, atracción continua e ingresos recurrentes.'
  },
  {
    id: 'meta-2',
    titulo: 'Motor de Energía & Vitalidad: Fuerza, Nutrición y Descanso Reparador',
    categoria: 'Salud',
    colorIdentificador: '#059669', // Verde Esmeralda (Combustible Biológico)
    bgLight: '#ECFDF5',
    textDark: '#065F46',
    ano: 2026,
    progreso: 85,
    descripcion: 'El combustible biológico del motor. Rutina de entrenamiento 4x semana y sueño sagrado de 8h sin pantallas.'
  },
  {
    id: 'meta-3',
    titulo: 'Motor Patrimonial: Flujo de Caja Libre, Reinversión y Fondo de Libertad',
    categoria: 'Finanzas',
    colorIdentificador: '#D97706', // Ámbar dorado (Flujo de Caja)
    bgLight: '#FFFBEB',
    textDark: '#92400E',
    ano: 2026,
    progreso: 60,
    descripcion: 'Engranaje de acumulación de activos, reinversión estratégica y rentabilidad de consultoría.'
  },
  {
    id: 'meta-4',
    titulo: 'Motor de Calidad de Vida: Retiros Trimestrales de Desconexión Familiar',
    categoria: 'Personal',
    colorIdentificador: '#2563EB', // Azul Real (Libertad y Familia)
    bgLight: '#EFF6FF',
    textDark: '#1E40AF',
    ano: 2026,
    progreso: 45,
    descripcion: 'Espacios sagrados de desconexión comercial para disfrutar la libertad que genera el motor de monetización.'
  }
];

// Engranajes Principales (Trimestre)
export const DEMO_TORRES: MetaTrimestral[] = [
  {
    id: 'torre-1',
    metaAnualId: 'meta-1',
    trimestre: 'Q3',
    entregableClave: 'Engranaje Q3: Validar el Sistema Crea y Monetiza con primer grupo VIP y activar prospección',
    estado: 'en_curso'
  },
  {
    id: 'torre-2',
    metaAnualId: 'meta-3',
    trimestre: 'Q3',
    entregableClave: 'Engranaje Q3: Optimizar márgenes de rentabilidad y cerrar 4 clientes de alto ticket',
    estado: 'en_curso'
  },
  {
    id: 'torre-3',
    metaAnualId: 'meta-2',
    trimestre: 'Q3',
    entregableClave: 'Engranaje Q3: Consolidar el hábito matutino de ejercicio antes de cualquier tarea comercial',
    estado: 'completada'
  },
  {
    id: 'torre-4',
    metaAnualId: 'meta-4',
    trimestre: 'Q3',
    entregableClave: 'Engranaje Q3: Bloquear espacios sagrados de presencia familiar y fines de semana libres de pantallas',
    estado: 'en_curso'
  }
];

// Componentes del Mes (Mes)
export const DEMO_HITOS: HitoMensual[] = [
  {
    id: 'hito-1',
    metaTrimestralId: 'torre-1',
    mes: 'Septiembre 2026',
    titulo: 'Componente Septiembre: Herramienta de Planificación CM instalada con Video Tutorial & Guía Oficial',
    estado: 'en_curso'
  },
  {
    id: 'hito-2',
    metaTrimestralId: 'torre-2',
    mes: 'Septiembre 2026',
    titulo: 'Componente Septiembre: Embudo de Captación y 8 diagnósticos estratégicos agendados',
    estado: 'en_curso'
  },
  {
    id: 'hito-3',
    metaTrimestralId: 'torre-3',
    mes: 'Septiembre 2026',
    titulo: 'Componente Septiembre: Protocolo de energía matutino blindado sin revisar notificaciones',
    estado: 'completada'
  },
  {
    id: 'hito-4',
    metaTrimestralId: 'torre-4',
    mes: 'Septiembre 2026',
    titulo: 'Componente Septiembre: Desconexión digital nocturna a las 8:00 PM y salidas familiares',
    estado: 'en_curso'
  }
];

// Ajustes y Entregables (Semana)
export const DEMO_ENTREGABLES: EntregableSemanal[] = [
  {
    id: 'entregable-1',
    hitoMensualId: 'hito-1',
    semanaNumero: 39,
    semanaRango: '21 Sep — 27 Sep',
    titulo: 'Ajuste Semanal: Desplegar el video explicativo de la metodología y la navegación del Motor',
    estado: 'en_curso',
    esMetaActivaSemana: true
  },
  {
    id: 'entregable-2',
    hitoMensualId: 'hito-1',
    semanaNumero: 39,
    semanaRango: '21 Sep — 27 Sep',
    titulo: 'Ajuste Semanal: Guion técnico y enlaces de onboarding para clientes de Patricia Loaiza',
    estado: 'en_curso'
  },
  {
    id: 'entregable-3',
    hitoMensualId: 'hito-2',
    semanaNumero: 39,
    semanaRango: '21 Sep — 27 Sep',
    titulo: 'Ajuste Semanal: Publicar 3 copys de alto valor y enviar propuesta a 2 prospectos calificados',
    estado: 'pendiente'
  },
  {
    id: 'entregable-4',
    hitoMensualId: 'hito-4',
    semanaNumero: 39,
    semanaRango: '21 Sep — 27 Sep',
    titulo: 'Ajuste Semanal: Ritual de fin de semana con cena en familia y desconexión en naturaleza',
    estado: 'en_curso'
  }
];

// Chispas Diarias (Día - Prioridad Clave)
export const DEMO_LADRILLOS: LadrilloDiario[] = [
  {
    id: 'ladrillo-1',
    entregableSemanalId: 'entregable-1',
    fecha: '2026-09-21',
    titulo: 'Configurar la nueva nomenclatura del Motor de Monetización y Sesiones BCM',
    bloqueTipo: 'BCM',
    duracionMinutos: 90,
    completada: true,
    categoria: 'CREA Y MONETIZA',
    origenRuta: '[Motor: $100k] ➔ [Engranaje Q3: Lanzamiento Metodología] ➔ [Componente Septiembre: Herramienta Digital] ➔ [Ajuste Semanal: Navegación del Motor] ➔ [Chispa Diaria: Configurar BCM]',
    colorIdentificador: '#DC2626',
    impacto: 'Clave'
  },
  {
    id: 'ladrillo-2',
    entregableSemanalId: 'entregable-2',
    fecha: '2026-09-21',
    titulo: 'Grabar y enlazar el video tutorial del Motor para la zona privada de clientes',
    bloqueTipo: 'BCM',
    duracionMinutos: 60,
    completada: false,
    categoria: 'CONSULTORÍA',
    origenRuta: '[Motor: $100k] ➔ [Engranaje Q3: Onboarding VIP] ➔ [Componente Septiembre: Video Tutorial] ➔ [Ajuste Semanal: Guion Técnico] ➔ [Chispa Diaria: Grabar Video]',
    colorIdentificador: '#DC2626',
    impacto: 'Alto'
  },
  {
    id: 'ladrillo-3',
    entregableSemanalId: 'entregable-3',
    fecha: '2026-09-21',
    titulo: 'Enviar propuesta de consultoría y seguimiento directo a 2 prospectos VIP',
    bloqueTipo: 'Tarea',
    duracionMinutos: 45,
    completada: false,
    categoria: 'MONETIZACIÓN',
    origenRuta: '[Motor: Flujo de Caja] ➔ [Engranaje Q3: Cierre Clientes] ➔ [Componente Septiembre: Embudo Diagnóstico] ➔ [Ajuste Semanal: Prospección Activa] ➔ [Chispa Diaria: Enviar Propuestas]',
    colorIdentificador: '#D97706',
    impacto: 'Alto'
  },
  {
    id: 'ladrillo-4',
    entregableSemanalId: 'entregable-1',
    fecha: '2026-09-22',
    titulo: 'Sesión BCM: Redactar secuencia de correos de captación y caso de estudio',
    bloqueTipo: 'BCM',
    duracionMinutos: 90,
    completada: false,
    categoria: 'CREA Y MONETIZA',
    origenRuta: '[Motor: $100k] ➔ [Engranaje Q3: Lanzamiento Metodología] ➔ [Componente Septiembre: Herramienta Digital] ➔ [Ajuste Semanal: Navegación del Motor] ➔ [Chispa Diaria: Emails]',
    colorIdentificador: '#DC2626',
    impacto: 'Clave'
  },
  {
    id: 'ladrillo-5',
    entregableSemanalId: 'entregable-4',
    fecha: '2026-09-22',
    titulo: 'Caminata 45 min al aire libre y desconexión digital para renovar energía',
    bloqueTipo: 'Tarea',
    duracionMinutos: 45,
    completada: false,
    categoria: 'SALUD',
    origenRuta: '[Motor: Energía & Vitalidad] ➔ [Engranaje Q3: Hábito Matutino] ➔ [Componente Septiembre: Protocolo de Energía] ➔ [Ajuste Semanal: Caminata]',
    colorIdentificador: '#059669',
    impacto: 'Medio'
  },
  {
    id: 'ladrillo-6',
    entregableSemanalId: 'entregable-2',
    fecha: '2026-09-23',
    titulo: 'Sesión BCM: Diseñar presentación de diagnóstico comercial de alto ticket',
    bloqueTipo: 'BCM',
    duracionMinutos: 75,
    completada: false,
    categoria: 'CONSULTORÍA',
    origenRuta: '[Motor: $100k] ➔ [Engranaje Q3: Onboarding VIP] ➔ [Componente Septiembre: Video Tutorial] ➔ [Chispa Diaria: Presentación]',
    colorIdentificador: '#DC2626',
    impacto: 'Clave'
  },
  {
    id: 'ladrillo-7',
    entregableSemanalId: 'entregable-3',
    fecha: '2026-09-23',
    titulo: 'Auditar métricas de flujo de caja y costos fijos de herramientas',
    bloqueTipo: 'Tarea',
    duracionMinutos: 45,
    completada: false,
    categoria: 'FINANZAS',
    origenRuta: '[Motor: Flujo de Caja] ➔ [Engranaje Q3: Rentabilidad] ➔ [Componente Septiembre: Embudo] ➔ [Chispa Diaria: Auditoría]',
    colorIdentificador: '#D97706',
    impacto: 'Medio'
  },
  {
    id: 'ladrillo-8',
    entregableSemanalId: 'entregable-1',
    fecha: '2026-09-24',
    titulo: 'Sesión BCM: Grabar módulo interactivo de bienvenida y metodología',
    bloqueTipo: 'BCM',
    duracionMinutos: 90,
    completada: false,
    categoria: 'CREA Y MONETIZA',
    origenRuta: '[Motor: $100k] ➔ [Engranaje Q3: Lanzamiento Metodología] ➔ [Componente Septiembre: Herramienta Digital] ➔ [Chispa Diaria: Grabar Módulo]',
    colorIdentificador: '#DC2626',
    impacto: 'Clave'
  },
  {
    id: 'ladrillo-9',
    entregableSemanalId: 'entregable-4',
    fecha: '2026-09-24',
    titulo: 'Tarde de calidad familiar: desconexión de llamadas a las 6:00 PM',
    bloqueTipo: 'Tarea',
    duracionMinutos: 90,
    completada: false,
    categoria: 'PERSONAL',
    origenRuta: '[Motor: Calidad de Vida] ➔ [Engranaje Q3: Presencia Familiar] ➔ [Componente Septiembre: Desconexión] ➔ [Chispa Diaria: Familia]',
    colorIdentificador: '#4F46E5',
    impacto: 'Alto'
  },
  {
    id: 'ladrillo-10',
    entregableSemanalId: 'entregable-3',
    fecha: '2026-09-25',
    titulo: 'Cierre semanal de facturación y transferencia al fondo de paz mental',
    bloqueTipo: 'Tarea',
    duracionMinutos: 30,
    completada: false,
    categoria: 'FINANZAS',
    origenRuta: '[Motor: Flujo de Caja] ➔ [Engranaje Q3: Rentabilidad] ➔ [Componente Septiembre: Embudo] ➔ [Chispa Diaria: Cierre Financiero]',
    colorIdentificador: '#D97706',
    impacto: 'Alto'
  }
];

export const DEMO_PENDIENTES: TareaPendiente[] = [
  {
    id: 'pen-1',
    titulo: 'Actualizar enlaces del video tutorial en la zona privada',
    fecha: '2026-09-21',
    completada: true,
    categoria: 'admin'
  },
  {
    id: 'pen-2',
    titulo: 'Revisar métricas de facturación y cobros de consultoría',
    fecha: '2026-09-21',
    completada: false,
    categoria: 'finanzas'
  },
  {
    id: 'pen-3',
    titulo: 'Responder dudas a los clientes en la comunidad VIP',
    fecha: '2026-09-21',
    completada: false,
    categoria: 'mensajes'
  },
  {
    id: 'pen-4',
    titulo: 'Enviar enlace de bienvenida a nuevo cliente inscrito',
    fecha: '2026-09-22',
    completada: false,
    categoria: 'to-do'
  },
  {
    id: 'pen-5',
    titulo: 'Preparar reporte de ingresos y gastos de la quincena',
    fecha: '2026-09-23',
    completada: false,
    categoria: 'finanzas'
  },
  {
    id: 'pen-6',
    titulo: 'Confirmar sesión estratégica con mentor invitado',
    fecha: '2026-09-24',
    completada: false,
    categoria: 'admin'
  },
  {
    id: 'pen-7',
    titulo: 'Exportar métricas de la semana y balance de energía',
    fecha: '2026-09-25',
    completada: false,
    categoria: 'admin'
  }
];

export const DEMO_HABITOS: Habito[] = [
  {
    id: 'hab-1',
    nombre: 'Ritual de Mentalidad & Claridad (Quietud y Visión)',
    categoria: 'Ritual mañana',
    minimoViable: 'Mínimo: 5 min de visualización y respiración',
    frecuenciaSemanal: 7,
    streakActual: 38,
    checks: {
      '2026-09-21': 'cumplido',
      '2026-09-22': 'cumplido',
      '2026-09-23': 'cumplido',
      '2026-09-24': 'cumplido',
      '2026-09-25': 'cumplido',
      '2026-09-26': 'cumplido',
      '2026-09-27': 'cumplido'
    }
  },
  {
    id: 'hab-2',
    nombre: 'Monetización Activa: Contactar / Aportar Valor a 2 Clientes',
    categoria: 'Negocio + propósito',
    minimoViable: 'Mínimo: 1 mensaje genuino de conexión',
    frecuenciaSemanal: 5,
    streakActual: 19,
    checks: {
      '2026-09-21': 'cumplido',
      '2026-09-22': 'cumplido',
      '2026-09-23': 'cumplido',
      '2026-09-24': 'cumplido',
      '2026-09-25': 'cumplido',
      '2026-09-26': 'cumplido',
      '2026-09-27': 'cumplido'
    }
  },
  {
    id: 'hab-3',
    nombre: 'Crear Contenido con Metodología Crea y Monetiza',
    categoria: 'Negocio + propósito',
    minimoViable: 'Mínimo: Anotar 1 idea clave o testimonio',
    frecuenciaSemanal: 5,
    streakActual: 14,
    checks: {
      '2026-09-21': 'cumplido',
      '2026-09-22': 'cumplido',
      '2026-09-23': 'minimo',
      '2026-09-24': 'minimo',
      '2026-09-25': 'cumplido',
      '2026-09-26': 'cumplido',
      '2026-09-27': 'cumplido'
    }
  },
  {
    id: 'hab-4',
    nombre: 'Entrenamiento Físico & Vitalidad',
    categoria: 'Salud + vitalidad',
    minimoViable: 'Mínimo: 15 min de caminata o estiramiento',
    frecuenciaSemanal: 5,
    streakActual: 16,
    checks: {
      '2026-09-21': 'cumplido',
      '2026-09-22': 'cumplido',
      '2026-09-23': 'no_hecho',
      '2026-09-24': 'cumplido',
      '2026-09-25': 'cumplido',
      '2026-09-26': 'no_hecho',
      '2026-09-27': 'cumplido'
    }
  },
  {
    id: 'hab-5',
    nombre: 'Lectura Estratégica & Crecimiento',
    categoria: 'Ritual mañana',
    minimoViable: 'Mínimo: 2 páginas con subrayado',
    frecuenciaSemanal: 6,
    streakActual: 21,
    checks: {
      '2026-09-21': 'cumplido',
      '2026-09-22': 'cumplido',
      '2026-09-23': 'cumplido',
      '2026-09-24': 'minimo',
      '2026-09-25': 'cumplido',
      '2026-09-26': 'cumplido',
      '2026-09-27': 'cumplido'
    }
  },
  {
    id: 'hab-6',
    nombre: 'Principio DAR: Entregar valor sin esperar nada a cambio',
    categoria: 'Negocio + propósito',
    minimoViable: 'Mínimo: 1 consejo o respuesta profunda a un seguidor',
    frecuenciaSemanal: 4,
    streakActual: 11,
    checks: {
      '2026-09-21': 'cumplido',
      '2026-09-22': 'cumplido',
      '2026-09-23': 'cumplido',
      '2026-09-24': 'cumplido',
      '2026-09-25': 'cumplido',
      '2026-09-26': 'cumplido',
      '2026-09-27': 'cumplido'
    }
  }
];

export const DEMO_AGENDA: BloqueAgenda[] = [
  {
    id: 'ag-1',
    horaInicio: '07:30',
    horaFin: '08:45',
    titulo: 'Ritual de la Mañana: Claridad, Ejercicio & Combustible del Motor',
    categoria: 'RITUAL',
    fecha: '2026-09-21',
    esBCM: false
  },
  {
    id: 'ag-2',
    horaInicio: '09:00',
    horaFin: '10:30',
    titulo: 'Sesión BCM (Creación & Monetización): Activos, Ofertas y Engranajes',
    categoria: 'FOCO',
    fecha: '2026-09-21',
    esBCM: true
  },
  {
    id: 'ag-3',
    horaInicio: '11:00',
    horaFin: '12:30',
    titulo: 'Sesión 1 a 1 con Cliente de Consultoría VIP',
    categoria: 'TRABAJO',
    fecha: '2026-09-21',
    esBCM: false
  },
  {
    id: 'ag-4',
    horaInicio: '13:00',
    horaFin: '14:30',
    titulo: 'Almuerzo Consciente & Caminata al Aire Libre',
    categoria: 'SALUD',
    fecha: '2026-09-21',
    esBCM: false
  },
  {
    id: 'ag-5',
    horaInicio: '15:30',
    horaFin: '16:45',
    titulo: 'Revisión Estratégica de Propuestas & Seguimiento a Clientes',
    categoria: 'FOCO',
    fecha: '2026-09-21',
    esBCM: false
  },
  {
    id: 'ag-6',
    horaInicio: '17:30',
    horaFin: '19:30',
    titulo: 'Tiempo Sagrado en Familia & Desconexión Digital',
    categoria: 'VIDA',
    fecha: '2026-09-21',
    esBCM: false
  },
  {
    id: 'ag-7',
    horaInicio: '09:00',
    horaFin: '10:30',
    titulo: 'Sesión BCM: Secuencia de correos & Contenidos de Monetización',
    categoria: 'FOCO',
    fecha: '2026-09-22',
    esBCM: true
  },
  {
    id: 'ag-8',
    horaInicio: '15:00',
    horaFin: '16:30',
    titulo: 'Llamada de Estrategia con Prospecto VIP',
    categoria: 'TRABAJO',
    fecha: '2026-09-22',
    esBCM: false
  },
  {
    id: 'ag-9',
    horaInicio: '09:00',
    horaFin: '10:15',
    titulo: 'Sesión BCM: Diseño de Oferta Irresistible',
    categoria: 'FOCO',
    fecha: '2026-09-23',
    esBCM: true
  },
  {
    id: 'ag-10',
    horaInicio: '16:00',
    horaFin: '17:00',
    titulo: 'Revisión Financiera y Flujo de Caja',
    categoria: 'TRABAJO',
    fecha: '2026-09-23',
    esBCM: false
  },
  {
    id: 'ag-11',
    horaInicio: '09:00',
    horaFin: '10:30',
    titulo: 'Sesión BCM: Grabación de Casos de Éxito',
    categoria: 'FOCO',
    fecha: '2026-09-24',
    esBCM: true
  },
  {
    id: 'ag-12',
    horaInicio: '17:00',
    horaFin: '19:00',
    titulo: 'Espacio de Vida & Familia (Desconexión)',
    categoria: 'VIDA',
    fecha: '2026-09-24',
    esBCM: false
  },
  {
    id: 'ag-13',
    horaInicio: '09:30',
    horaFin: '11:00',
    titulo: 'Calibración Semanal y Cierre de Metas',
    categoria: 'FOCO',
    fecha: '2026-09-25',
    esBCM: false
  }
];

export const DEMO_SABIDURIA: CicloSabiduria = {
  id: 'sab-39',
  semanaNumero: 39,
  semanaRango: '21 Sep — 27 Sep 2026',
  agradecimientos: [
    'Agradezco los nuevos testimonios de clientes que validan el Motor de Monetización Crea y Monetiza.',
    'Agradezco la energía física y claridad mental para calibrar los engranajes de mi negocio con serenidad.',
    'Agradezco haber cerrado la semana con ingresos consistentes sin trabajar horas extras en la noche.'
  ],
  aprendizajes: [
    'Subir el listón de admisión en la consultoría aumentó el compromiso de los clientes y aceleró sus resultados.',
    'Cuando las tareas de creación se hacen a primera hora en Sesiones BCM, la tarde fluye sin estrés.',
    'Tener un video explicativo claro ahorra horas de soporte repetitivo tanto para mí como para mis clientes.'
  ],
  queFunciono: [
    'El bloque matutino de 90 minutos de Sesión BCM sin teléfono: ensamblé el componente clave en tiempo récord.',
    'La llamada de diagnóstico con el marco Crea y Monetiza cerró la venta en 35 minutos.',
    'Mantener el ritual de caminata para despejar la mente antes del almuerzo.'
  ],
  queNoFunciono: [
    'Abrir el correo electrónico antes de la Sesión BCM: me dispersó con dos mensajes no urgentes.',
    'Aceptar una reunión imprevista que frenó la inercia del motor de creación.',
    'No haber agendado con antelación el tiempo de descanso y desconexión del fin de semana.'
  ],
  ajustesSiguienteSemana: [
    'Blindar el teléfono en modo avión hasta las 11:30 AM todos los días laborables para proteger las Sesiones BCM.',
    'Concentrar las sesiones de consultoría únicamente martes y jueves por la tarde para dejar lunes y miércoles 100% para creación de activos.'
  ],
  accionObligatoria: 'Bloquear religiosamente los lunes de 9:00 a 10:30 AM para la Sesión BCM del entregable de la semana.',
  completada: true
};

export const DEMO_ENERGIA: ConfiguracionEnergia = {
  cronotipo: 'ignicion_matutina',
  horaPicoInicio: '08:30',
  horaPicoFin: '11:30',
  regimenOperacion: 'aceleracion_bcm',
  recomendarSesionBCM: 'Sesión BCM de Ignición (09:00 - 10:30)'
};

// ==========================================
// ESTADO LIMPIO PARA PRUEBA DESDE CERO
// ==========================================
export const EMPTY_USER: UserYoPro = {
  id: 'cm-user-nuevo',
  nombre: 'Patricia Loaiza',
  atributosYoPro: [],
  queQuiero: [],
  queNoQuiero: []
};

export const EMPTY_METAS_ANUALES: MetaAnual[] = [];
export const EMPTY_TORRES: MetaTrimestral[] = [];
export const EMPTY_HITOS: HitoMensual[] = [];
export const EMPTY_ENTREGABLES: EntregableSemanal[] = [];
export const EMPTY_LADRILLOS: LadrilloDiario[] = [];
export const EMPTY_PENDIENTES: TareaPendiente[] = [];
export const EMPTY_HABITOS: Habito[] = [];
export const EMPTY_AGENDA: BloqueAgenda[] = [];

export const EMPTY_SABIDURIA: CicloSabiduria = {
  id: 'sab-clean-39',
  semanaNumero: 39,
  semanaRango: '21 Sep — 27 Sep 2026',
  agradecimientos: [],
  aprendizajes: [],
  queFunciono: [],
  queNoFunciono: [],
  ajustesSiguienteSemana: [],
  accionObligatoria: '',
  completada: false
};

export const EMPTY_ENERGIA: ConfiguracionEnergia = {
  cronotipo: 'ignicion_matutina',
  horaPicoInicio: '08:30',
  horaPicoFin: '11:30',
  regimenOperacion: 'aceleracion_bcm',
  recomendarSesionBCM: 'Sesión BCM de Ignición (09:00 - 10:30)'
};

// Configuración por defecto: INICIA LIMPIO PARA PRUEBA DESDE CERO
export const INITIAL_USER = EMPTY_USER;
export const INITIAL_METAS_ANUALES = EMPTY_METAS_ANUALES;
export const INITIAL_TORRES = EMPTY_TORRES;
export const INITIAL_HITOS = EMPTY_HITOS;
export const INITIAL_ENTREGABLES = EMPTY_ENTREGABLES;
export const INITIAL_LADRILLOS = EMPTY_LADRILLOS;
export const INITIAL_PENDIENTES = EMPTY_PENDIENTES;
export const INITIAL_HABITOS = EMPTY_HABITOS;
export const INITIAL_AGENDA = EMPTY_AGENDA;
export const INITIAL_SABIDURIA = EMPTY_SABIDURIA;
export const INITIAL_ENERGIA = EMPTY_ENERGIA;
