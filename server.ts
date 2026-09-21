import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Crea y Monetiza - Patricia Loaiza",
    timestamp: new Date().toISOString()
  });
});

// Endpoint: Desglose de Metas con Asistente IA del Motor de Acción (Metodología Patricia Loaiza)
// Descompone en acciones realizables en semanas, días y horas, sin tareas de relleno ni etéreas
app.post("/api/ai/breakdown", async (req, res) => {
  const { goalTitle, category, timeHorizon = "año", customContext } = req.body;
  if (!goalTitle) {
    return res.status(400).json({ error: "goalTitle es requerido" });
  }

  const ai = getGemini();

  if (!ai) {
    // Retorno de plantilla estructurada del Motor de Acción si no hay API key
    return res.json({
      success: true,
      source: "template",
      estrategiaRapida: `Para lograr "${goalTitle}" de la forma más rápida y directa: elimina preparaciones innecesarias, empaqueta tu oferta/activo central en 48 horas y haz contacto directo con prospectos o ejecuta el activo clave sin rodeos operativos.`,
      principioAntirrelleno: "Prohibido investigar sin ejecutar. Cada bloque de tiempo debe producir un activo tangible que acerque al cumplimiento indiscutible del objetivo.",
      torres: [
        {
          trimestre: "Q1",
          titulo: `Engranaje Q1: Activo Central & Tracción Rápida (${goalTitle.slice(0, 30)})`,
          entregableClave: "Activo fundamental construido, validado y produciendo resultados reales medibles",
          hitos: [
            {
              mes: "Septiembre 2026",
              titulo: "Componente Septiembre: Lanzamiento y ejecución del activo nuclear",
              semanas: [
                {
                  semana: 39,
                  semanaRango: "21 Sep — 27 Sep",
                  entregable: "Ajuste Semanal: Propuesta estructurada en 1 página y 10 contactos directos realizados",
                  ladrilloHoy: "Chispa Diaria: Redactar la propuesta de valor y enviar a 3 prospectos clave en Sesión BCM",
                  duracionMin: 90,
                  horasEstimadas: 1.5,
                  porQueEsCrucial: "Te obliga a tener feedback de mercado real en 90 minutos en lugar de semanas de planeación pasiva."
                },
                {
                  semana: 40,
                  semanaRango: "28 Sep — 04 Oct",
                  entregable: "Ajuste Semanal: Cierre de los primeros acuerdos y protocolo de entrega listo",
                  ladrilloHoy: "Chispa Diaria: Sesión de diagnóstico y cierre con clientes potenciales",
                  duracionMin: 90,
                  horasEstimadas: 1.5,
                  porQueEsCrucial: "Genera tracción real y monetización sin postergaciones."
                }
              ]
            }
          ]
        },
        {
          trimestre: "Q2",
          titulo: `Engranaje Q2: Maquinaria y Consolidación (${goalTitle.slice(0, 30)})`,
          entregableClave: "Sistema automatizado de captación y entrega recurrente sin fricción",
          hitos: [
            {
              mes: "Diciembre 2026",
              titulo: "Componente Diciembre: Escala y optimización de conversión",
              semanas: [
                {
                  semana: 48,
                  semanaRango: "23 Nov — 29 Nov",
                  entregable: "Ajuste Semanal: Embudo de conversión directa y testimonios documentados",
                  ladrilloHoy: "Chispa Diaria: Grabar video explicativo de 5 minutos y programar difusión",
                  duracionMin: 60,
                  horasEstimadas: 1.0,
                  porQueEsCrucial: "Activo permanente que trabaja de forma continua."
                }
              ]
            }
          ]
        }
      ],
      accionesInmediatasHoras: [
        {
          titulo: "Definir oferta concreta de 1 página con precio y promesa",
          duracionMin: 90,
          bloqueTipo: "BCM",
          impacto: "Clave",
          resultadoTangible: "Documento PDF de 1 página listo para enviar"
        },
        {
          titulo: "Contactar a 5 personas clave con mensaje personalizado",
          duracionMin: 60,
          bloqueTipo: "BCM",
          impacto: "Clave",
          resultadoTangible: "5 conversaciones iniciadas con respuestas reales"
        }
      ]
    });
  }

  try {
    const prompt = `Actúa como la Asistente Estratégica de Acción y Negocios de la metodología "Crea y Monetiza" de Patricia Loaiza.
La premisa central es el "MOTOR DE ACCIÓN": una maquinaria disciplinada y de alto impacto que traduce metas macro en acciones quirúrgicas, no etéreas, que fuerzan el cumplimiento del objetivo.

REGLAS INFLEXIBLES:
1. CERO TAREAS DE RELLENO O ETÉREAS: Prohibido sugerir "investigar el mercado", "leer sobre el tema", "hacer lluvia de ideas" o "reflexionar". Cada acción debe terminar con un entregable físico o digital irrefutable (un documento, una oferta enviada, un código subido, una llamada cerrada, un video publicado, etc.).
2. RUTA MÁS RÁPIDA Y EFICIENTE: Diseña el camino más corto hacia el resultado.
3. DESGLOSE MULTINIVEL OBLIGATORIO:
   - Motor de Acción (Meta Anual)
   - Engranajes Trimestrales (Trimestres Q1-Q4)
   - Componentes del Mes (Activos instalados)
   - Ajustes Semanales (Entregables medibles de cada semana)
   - Chispas Diarias y Horas (Bloques de 60 o 90 minutos de Sesión BCM de Creación y Monetización que se completan hoy o en horas precisas).

DATOS DEL USUARIO:
Objetivo del Motor de Acción: "${goalTitle}"
Categoría: "${category || 'Negocio'}"
Horizonte: "${timeHorizon}"
${customContext ? `Contexto adicional: "${customContext}"` : ''}

Debes responder ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
{
  "estrategiaRapida": "Explicación concisa y directa de cómo lograr esta meta de la forma más rápida y eficiente posible sin perder tiempo en preparaciones.",
  "principioAntirrelleno": "Regla tajante de qué NO hacer y qué ignorar para no caer en parálisis por análisis o tareas accesorias.",
  "torres": [
    {
      "trimestre": "Q1",
      "titulo": "Engranaje Q1: Título claro del activo o maquinaria trimestral",
      "entregableClave": "Entregable concreto de 3 meses que mueve la aguja",
      "hitos": [
        {
          "mes": "Septiembre 2026",
          "titulo": "Componente del Mes: Módulo o activo tangible instalado",
          "semanas": [
            {
              "semana": 39,
              "semanaRango": "21 Sep — 27 Sep",
              "entregable": "Ajuste Semanal: Entregable de la semana (medible y no negociable)",
              "ladrilloHoy": "Chispa Diaria: Acción de 60-90 min para hoy en Sesión BCM sin distracciones",
              "duracionMin": 90,
              "horasEstimadas": 1.5,
              "porQueEsCrucial": "Explicación de 1 línea de por qué esta acción obliga a cumplir la meta y no es relleno"
            },
            {
              "semana": 40,
              "semanaRango": "28 Sep — 04 Oct",
              "entregable": "Ajuste Semanal: Siguiente entregable semanal concreto",
              "ladrilloHoy": "Chispa Diaria: Acción diaria ejecutable en 60-90 min",
              "duracionMin": 90,
              "horasEstimadas": 1.5,
              "porQueEsCrucial": "Razón de impacto de esta acción"
            }
          ]
        }
      ]
    },
    {
      "trimestre": "Q2",
      "titulo": "Engranaje Q2: Título de la estructura del siguiente trimestre",
      "entregableClave": "Entregable concreto trimestral",
      "hitos": [
        {
          "mes": "Diciembre 2026",
          "titulo": "Componente Diciembre: Activo de escala o consolidación",
          "semanas": [
            {
              "semana": 48,
              "semanaRango": "23 Nov — 29 Nov",
              "entregable": "Ajuste Semanal: Entregable concreto",
              "ladrilloHoy": "Chispa Diaria: Acción quirúrgica de 60-90 min",
              "duracionMin": 60,
              "horasEstimadas": 1.0,
              "porQueEsCrucial": "Impacto real"
            }
          ]
        }
      ]
    }
  ],
  "accionesInmediatasHoras": [
    {
      "titulo": "Acción quirúrgica realizable en las próximas 24 horas",
      "duracionMin": 90,
      "bloqueTipo": "BCM",
      "impacto": "Clave",
      "resultadoTangible": "El entregable físico/digital exacto que queda terminado"
    },
    {
      "titulo": "Segunda acción quirúrgica complementaria",
      "duracionMin": 60,
      "bloqueTipo": "BCM",
      "impacto": "Clave",
      "resultadoTangible": "El resultado medible obtenido"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json({ success: true, source: "gemini", ...data });
  } catch (error: any) {
    console.error("Error en Gemini breakdown:", error);
    return res.status(500).json({ error: error.message || "Error al procesar con IA" });
  }
});

// Endpoint: Sugerencias Quirúrgicas Anti-Relleno para pasos específicos
app.post("/api/ai/suggest-step", async (req, res) => {
  const { goalTitle, stepName, currentInputs } = req.body;
  const ai = getGemini();

  if (!ai) {
    return res.json({
      success: true,
      source: "template",
      sugerencias: [
        `Crear el entregable nuclear de "${goalTitle.slice(0, 25)}" en una Sesión BCM de 90 min`,
        `Redactar la propuesta de valor y enviarla a 3 personas en 60 min`,
        `Configurar y publicar el activo mínimo viable sin perfeccionismo`
      ]
    });
  }

  try {
    const prompt = `Actúa como la Asistente Estratégica Anti-Relleno de Patricia Loaiza (Metodología Crea y Monetiza / Motor de Acción).
El usuario está calibrando el objetivo: "${goalTitle}".
Paso actual de calibración: "${stepName}".
Valores actuales: ${JSON.stringify(currentInputs || {})}.

Dame 3 opciones de acciones QUIRÚRGICAS, NO ETÉREAS y SIN TAREAS DE RELLENO que obliguen a avanzar de la forma más rápida y eficiente posible (en bloques de 60-90 min o entregables de horas/semana).
Devuelve un JSON:
{
  "sugerencias": [
    "Opción 1: Acción de alto impacto con entregable tangible",
    "Opción 2: Acción alternativa rápida y directa",
    "Opción 3: Acción de validación o cierre inmediato"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, ...parsed });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint: Mantenimiento e Inspección del Motor (Ciclo de Sabiduría & ORI Semanal - Feedback Loop)
app.post("/api/ai/wisdom", async (req, res) => {
  const agradecimientos = req.body.agradecimientos || req.body.agradezco || [];
  const aprendizajes = req.body.aprendizajes || req.body.aprendi || [];
  const queFunciono = req.body.queFunciono || req.body.funciono || [];
  const queNoFunciono = req.body.queNoFunciono || req.body.noFunciono || [];
  const semana = req.body.semana || 39;
  const semanaRango = req.body.semanaRango || "21 — 27 SEP";
  const metasContexto = req.body.metasActivas || [];

  const ai = getGemini();

  const heuristicFallback = {
    success: true,
    source: "heuristic",
    patronDetectado: "Tu mayor velocidad de tracción ocurre cuando concentras el 100% de tu energía matutina en una sola entrega tangible de ventas o creación. La principal fuga de potencia ocurre al diluir la mañana respondiendo mensajes reactivos antes de haber concluido tu bloque BCM.",
    optimizacionMedicion: {
      diagnosticoActual: "Las metas de la semana tienden a medirse por 'esfuerzo y horas dedicadas' en lugar de entregables con estado binario (hecho / no hecho). Esto genera la ilusión de estar ocupado sin asegurar monetización.",
      criterioMetricoRecomendado: "Medir exclusivamente por activos tangibles terminados: '1 propuesta con link de pago enviada', '1 sistema de prospección con 10 contactos reales', '1 pieza de contenido clave publicada'.",
      comoVerificarCumplimiento: "¿Existe un enlace, documento o cobro verificable que demuestre que el entregable existe y funciona hoy?"
    },
    reglaDeOro: "La Sesión BCM de 90 minutos se realiza antes de abrir cualquier app de mensajería o bandeja de entrada: primero se construye el activo, después se atiende la reactividad.",
    nuevasMetasOptimizadas: [
      {
        tipo: "Ajuste Semanal",
        titulo: "Publicar y presentar oferta con llamado directo a 5 prospectos calificados",
        porQueAcelera: "Elimina pasos intermedios y valida la oferta con retroalimentación real del mercado.",
        comoMedir: "5 mensajes personalizados enviados con enlace de agendamiento o pago registrado."
      },
      {
        tipo: "Chispa Diaria",
        titulo: "Redactar documento de propuesta de 1 página en Sesión BCM de 90 min",
        porQueAcelera: "Obliga a sintetizar la promesa de valor en una sola sesión de alta combustión sin distracciones.",
        comoMedir: "Documento PDF o texto final listo para presentar al cliente."
      }
    ],
    ajustesRecomendados: [
      "No agregar más de 2 Chispas Diarias por jornada: menos tareas, pero 100% terminadas.",
      "Programar las 5 Sesiones BCM de la semana en la agenda el domingo a las 18:00 para blindar el tiempo."
    ],
    // Backward compatibility keys
    patronExito: "Concentrar la energía matutina en Sesiones BCM de 90 min sin teléfono acelera la facturación.",
    ajusteEstrategico: "Primero el bloque BCM; cero WhatsApp o tareas operativas antes de terminar la chispa diaria.",
    accionSemanaSiguiente: "Bloquear en agenda tus 5 Sesiones BCM de la semana desde el domingo a las 18:00."
  };

  if (!ai) {
    return res.json(heuristicFallback);
  }

  try {
    const prompt = `Actúa como mentora estratégica de alta precisión de la "Metodología Crea y Monetiza" de Patricia Loaiza.
La usuaria está ejecutando la inspección de su BITÁCORA Y ORI SEMANAL (Observación, Rendimiento e Inspección) de su Motor de Acción.

OBJETIVO DEL ANÁLISIS:
Devuelve un análisis CORTO, PRÁCTICO y CONTUNDENTE que sirva para:
1. Detectar el PATRÓN DE ORO: Qué palanca real generó tracción y qué fricción frenó el motor esta semana (sin rodeos ni generalidades).
2. OPTIMIZAR LA FORMA DE MEDIR METAS: Analizar si las metas se están midiendo con criterios etéreos ("avanzar", "pensar", "trabajar duro") y proporcionar una métrica tangible, binaria y objetiva para saber con certeza si se cumplieron o no.
3. DEFINIR LA REGLA DE ORO: Una directriz operativa inviolable para el siguiente ciclo.
4. DEFINIR NUEVAS METAS O ACCIONES OPTIMIZADAS: 2 acciones no etéreas (1 Ajuste Semanal y 1 Chispa Diaria de 60-90 min BCM) para llegar al objetivo más rápido y sin tareas de relleno.

DATOS INGRESADOS POR LA USUARIA:
- Semana evaluada: Semana ${semana} (${semanaRango})
- Agradecimientos / Victorias: ${JSON.stringify(agradecimientos)}
- Aprendizajes técnicos y estratégicos: ${JSON.stringify(aprendizajes)}
- Lo que funcionó (engranajes con tracción): ${JSON.stringify(queFunciono)}
- Lo que NO funcionó (fricciones, dispersión, cuellos de botella): ${JSON.stringify(queNoFunciono)}
- Metas de referencia: ${JSON.stringify(metasContexto)}

REGLAS OBLIGATORIAS:
- NUNCA uses puntos suspensivos ("..."), plantillas vacías ni textos genéricos.
- El tono debe ser profesional, inspirador y orientado a resultados de negocio y bienestar sostenible.
- Cada recomendación debe ser accionable de inmediato.

Devuelve estrictamente un JSON con este formato:
{
  "patronDetectado": "Diagnóstico de 2-3 oraciones sobre la causa raíz del avance o bloqueo esta semana.",
  "optimizacionMedicion": {
    "diagnosticoActual": "Evaluación clara de cómo se están midiendo las metas y por qué requiere afinación.",
    "criterioMetricoRecomendado": "Métrica binaria y cuantificable sugerida para medir el éxito real.",
    "comoVerificarCumplimiento": "Pregunta de control semanal para auditar si la meta se logró sin ambigüedades."
  },
  "reglaDeOro": "Frase contundente e inviolable de 1 oración para la próxima semana.",
  "nuevasMetasOptimizadas": [
    {
      "tipo": "Ajuste Semanal",
      "titulo": "Meta semanal quirúrgica orientada a monetización o tracción",
      "porQueAcelera": "Por qué esta meta es más eficiente que tareas dispersas",
      "comoMedir": "Forma exacta de medir su cumplimiento"
    },
    {
      "tipo": "Chispa Diaria",
      "titulo": "Acción inmediata realizable en 60-90 min de foco BCM",
      "porQueAcelera": "Elimina el paso intermedio y va directo al grano",
      "comoMedir": "Entregable final tangible"
    }
  ],
  "ajustesRecomendados": [
    "Ajuste operativo práctico 1",
    "Ajuste operativo práctico 2"
  ],
  "patronExito": "Resumen conciso del patrón ganador",
  "ajusteEstrategico": "Regla clara para calibrar los engranajes",
  "accionSemanaSiguiente": "1 acción obligatoria para la próxima semana"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      source: "gemini",
      patronDetectado: parsed.patronDetectado || parsed.patronExito || heuristicFallback.patronDetectado,
      optimizacionMedicion: parsed.optimizacionMedicion || heuristicFallback.optimizacionMedicion,
      reglaDeOro: parsed.reglaDeOro || parsed.ajusteEstrategico || heuristicFallback.reglaDeOro,
      nuevasMetasOptimizadas: Array.isArray(parsed.nuevasMetasOptimizadas) && parsed.nuevasMetasOptimizadas.length > 0
        ? parsed.nuevasMetasOptimizadas
        : heuristicFallback.nuevasMetasOptimizadas,
      ajustesRecomendados: Array.isArray(parsed.ajustesRecomendados) && parsed.ajustesRecomendados.length > 0
        ? parsed.ajustesRecomendados
        : heuristicFallback.ajustesRecomendados,
      patronExito: parsed.patronExito || parsed.patronDetectado || heuristicFallback.patronExito,
      ajusteEstrategico: parsed.ajusteEstrategico || parsed.reglaDeOro || heuristicFallback.ajusteEstrategico,
      accionSemanaSiguiente: parsed.accionSemanaSiguiente || heuristicFallback.accionSemanaSiguiente
    });
  } catch (err: any) {
    console.error("Error generating wisdom AI analysis:", err);
    return res.json(heuristicFallback);
  }
});

// Vite / Static Middleware setup
async function setupServer() {
  const publicPath = path.join(process.cwd(), "public");
  app.use(express.static(publicPath));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Crea y Monetiza - Patricia Loaiza server running on port ${PORT}`);
  });
}

setupServer();
