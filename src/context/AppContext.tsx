import React, { createContext, useContext, useState, useEffect } from 'react';
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
  ConfiguracionEnergia,
  EstadoHabito
} from '../types';
import {
  INITIAL_USER,
  INITIAL_METAS_ANUALES,
  INITIAL_TORRES,
  INITIAL_HITOS,
  INITIAL_ENTREGABLES,
  INITIAL_LADRILLOS,
  INITIAL_PENDIENTES,
  INITIAL_HABITOS,
  INITIAL_AGENDA,
  INITIAL_SABIDURIA,
  INITIAL_ENERGIA,
  EMPTY_USER,
  EMPTY_METAS_ANUALES,
  EMPTY_TORRES,
  EMPTY_HITOS,
  EMPTY_ENTREGABLES,
  EMPTY_LADRILLOS,
  EMPTY_PENDIENTES,
  EMPTY_HABITOS,
  EMPTY_AGENDA,
  EMPTY_SABIDURIA,
  EMPTY_ENERGIA,
  DEMO_USER,
  DEMO_METAS_ANUALES,
  DEMO_TORRES,
  DEMO_HITOS,
  DEMO_ENTREGABLES,
  DEMO_LADRILLOS,
  DEMO_PENDIENTES,
  DEMO_HABITOS,
  DEMO_AGENDA,
  DEMO_SABIDURIA,
  DEMO_ENERGIA
} from '../data/seedData';
import { playSuccessChime } from '../utils/audio';
import { DISTINCT_MOTOR_PALETTE, getNextAvailableDistinctColor } from '../utils/cascadeColors';

export type TabType = 'inicio' | 'habitos' | 'plan' | 'calendario' | 'sabiduria' | 'claridad' | 'balance' | 'tutorial';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  goToPrevDay: () => void;
  goToNextDay: () => void;
  goToToday: () => void;

  user: UserYoPro;
  updateUser: (updater: Partial<UserYoPro>) => void;

  metasAnuales: MetaAnual[];
  torres: MetaTrimestral[];
  hitos: HitoMensual[];
  entregables: EntregableSemanal[];
  ladrillos: LadrilloDiario[];
  pendientes: TareaPendiente[];
  habitos: Habito[];
  agenda: BloqueAgenda[];
  sabiduria: CicloSabiduria;
  energia: ConfiguracionEnergia;

  // Actions
  toggleLadrillo: (id: string) => void;
  addLadrillo: (ladrillo: Omit<LadrilloDiario, 'id'>) => void;
  deleteLadrillo: (id: string) => void;

  togglePendiente: (id: string) => void;
  addPendiente: (titulo: string, categoria?: 'admin' | 'to-do' | 'mensajes' | 'finanzas') => void;
  deletePendiente: (id: string) => void;

  updateHabitoCheck: (habitoId: string, fecha: string) => void;
  addHabito: (nombre: string, categoria: Habito['categoria'], minimoViable: string, frecuenciaSemanal: number) => void;
  deleteHabito: (id: string) => void;

  addMetaAnual: (meta: Omit<MetaAnual, 'id' | 'progreso'>) => MetaAnual;
  addTorre: (torre: Omit<MetaTrimestral, 'id'> & { id?: string }) => MetaTrimestral;
  addHito: (hito: Omit<HitoMensual, 'id'> & { id?: string }) => HitoMensual;
  addEntregable: (entregable: Omit<EntregableSemanal, 'id'> & { id?: string }) => EntregableSemanal;

  addAgendaBlock: (block: Omit<BloqueAgenda, 'id'>) => void;
  deleteAgendaBlock: (id: string) => void;

  updateSabiduria: (updater: Partial<CicloSabiduria>) => void;
  updateEnergia: (updater: Partial<ConfiguracionEnergia>) => void;
  resetAllData: () => void;
  loadDemoData: () => void;
  isDataClean: boolean;

  // Modals & Focus State
  isFocusModeOpen: boolean;
  setIsFocusModeOpen: (open: boolean) => void;
  activeFocusLadrillo: LadrilloDiario | null;
  startFocusWithLadrillo: (ladrillo: LadrilloDiario) => void;

  isAterrizarModalOpen: boolean;
  setIsAterrizarModalOpen: (open: boolean) => void;
  activeMetaToAterrizar: MetaAnual | null;
  openAterrizarFlow: (meta?: MetaAnual) => void;

  isAiBreakdownOpen: boolean;
  setIsAiBreakdownOpen: (open: boolean) => void;
  openAiBreakdownForMeta: (meta?: MetaAnual) => void;

  // Calendar sync status
  isCalendarConnected: boolean;
  setIsCalendarConnected: (connected: boolean) => void;

  // Task Detail Inspection
  inspectedTask: { item: LadrilloDiario | BloqueAgenda | TareaPendiente; type: 'ladrillo' | 'agenda' | 'pendiente' } | null;
  openTaskDetail: (item: LadrilloDiario | BloqueAgenda | TareaPendiente, type: 'ladrillo' | 'agenda' | 'pendiente') => void;
  closeTaskDetail: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'crea_monetiza_patricia_clean_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-21');

  // Load or fallback to seedData
  const [user, setUser] = useState<UserYoPro>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [metasAnuales, setMetasAnuales] = useState<MetaAnual[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'metas');
    if (!saved) return INITIAL_METAS_ANUALES;
    try {
      const parsed: MetaAnual[] = JSON.parse(saved);
      // Guarantee strictly unique, non-repeating colors for all metas
      const seen = new Set<string>();
      return parsed.map((m, idx) => {
        const colorLower = (m.colorIdentificador || '').toLowerCase();
        if (seen.has(colorLower) || colorLower === '#be123c' || !m.colorIdentificador) {
          const distinct = DISTINCT_MOTOR_PALETTE[idx % DISTINCT_MOTOR_PALETTE.length];
          m.colorIdentificador = distinct.color;
          m.bgLight = distinct.bgLight;
          m.textDark = distinct.textDark;
        }
        seen.add(m.colorIdentificador.toLowerCase());
        return m;
      });
    } catch {
      return INITIAL_METAS_ANUALES;
    }
  });

  const [torres, setTorres] = useState<MetaTrimestral[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'torres');
    return saved ? JSON.parse(saved) : INITIAL_TORRES;
  });

  const [hitos, setHitos] = useState<HitoMensual[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'hitos');
    return saved ? JSON.parse(saved) : INITIAL_HITOS;
  });

  const [entregables, setEntregables] = useState<EntregableSemanal[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'entregables');
    return saved ? JSON.parse(saved) : INITIAL_ENTREGABLES;
  });

  const [ladrillos, setLadrillos] = useState<LadrilloDiario[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'ladrillos');
    return saved ? JSON.parse(saved) : INITIAL_LADRILLOS;
  });

  const [pendientes, setPendientes] = useState<TareaPendiente[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'pendientes');
    return saved ? JSON.parse(saved) : INITIAL_PENDIENTES;
  });

  const [habitos, setHabitos] = useState<Habito[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'habitos');
    return saved ? JSON.parse(saved) : INITIAL_HABITOS;
  });

  const [agenda, setAgenda] = useState<BloqueAgenda[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'agenda');
    return saved ? JSON.parse(saved) : INITIAL_AGENDA;
  });

  const [sabiduria, setSabiduria] = useState<CicloSabiduria>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'sabiduria');
    return saved ? JSON.parse(saved) : INITIAL_SABIDURIA;
  });

  const [energia, setEnergia] = useState<ConfiguracionEnergia>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'energia');
    return saved ? JSON.parse(saved) : INITIAL_ENERGIA;
  });

  const [isCalendarConnected, setIsCalendarConnected] = useState<boolean>(true);

  // Focus mode & Modals
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [activeFocusLadrillo, setActiveFocusLadrillo] = useState<LadrilloDiario | null>(null);

  const [isAterrizarModalOpen, setIsAterrizarModalOpen] = useState(false);
  const [activeMetaToAterrizar, setActiveMetaToAterrizar] = useState<MetaAnual | null>(null);

  const [isAiBreakdownOpen, setIsAiBreakdownOpen] = useState(false);

  // Persist automatically
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'metas', JSON.stringify(metasAnuales));
  }, [metasAnuales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'torres', JSON.stringify(torres));
  }, [torres]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'hitos', JSON.stringify(hitos));
  }, [hitos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'entregables', JSON.stringify(entregables));
  }, [entregables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'ladrillos', JSON.stringify(ladrillos));
  }, [ladrillos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'pendientes', JSON.stringify(pendientes));
  }, [pendientes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'habitos', JSON.stringify(habitos));
  }, [habitos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'agenda', JSON.stringify(agenda));
  }, [agenda]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'sabiduria', JSON.stringify(sabiduria));
  }, [sabiduria]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'energia', JSON.stringify(energia));
  }, [energia]);

  // Clean legacy stored keys once on mount so app opens cleanly
  useEffect(() => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('crea_monetiza_patricia_v1_')) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore
    }
  }, []);

  // Date Navigation
  const goToPrevDay = () => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate('2026-09-21');
  };

  // User Updater
  const updateUser = (updater: Partial<UserYoPro>) => {
    setUser(prev => ({ ...prev, ...updater }));
  };

  // Ladrillos
  const toggleLadrillo = (id: string) => {
    setLadrillos(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextVal = !item.completada;
          if (nextVal) playSuccessChime();
          return { ...item, completada: nextVal };
        }
        return item;
      })
    );
  };

  const addLadrillo = (item: Omit<LadrilloDiario, 'id'>) => {
    const newItem: LadrilloDiario = {
      ...item,
      id: 'lad-' + Date.now()
    };
    setLadrillos(prev => [newItem, ...prev]);
  };

  const deleteLadrillo = (id: string) => {
    setLadrillos(prev => prev.filter(l => l.id !== id));
  };

  // Pendientes
  const togglePendiente = (id: string) => {
    setPendientes(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextVal = !p.completada;
          if (nextVal) playSuccessChime();
          return { ...p, completada: nextVal };
        }
        return p;
      })
    );
  };

  const addPendiente = (titulo: string, categoria: TareaPendiente['categoria'] = 'to-do') => {
    if (!titulo.trim()) return;
    const item: TareaPendiente = {
      id: 'pen-' + Date.now(),
      titulo: titulo.trim(),
      fecha: selectedDate,
      completada: false,
      categoria
    };
    setPendientes(prev => [...prev, item]);
  };

  const deletePendiente = (id: string) => {
    setPendientes(prev => prev.filter(p => p.id !== id));
  };

  // Hábitos: Cycle through 'cumplido' -> 'minimo' -> 'no_hecho' -> 'pendiente'
  const updateHabitoCheck = (habitoId: string, fecha: string) => {
    setHabitos(prev =>
      prev.map(h => {
        if (h.id === habitoId) {
          const current = h.checks[fecha] || 'pendiente';
          const nextState: Record<EstadoHabito, EstadoHabito> = {
            pendiente: 'cumplido',
            cumplido: 'minimo',
            minimo: 'no_hecho',
            no_hecho: 'pendiente'
          };
          const next = nextState[current];
          if (next === 'cumplido' || next === 'minimo') {
            playSuccessChime();
          }
          return {
            ...h,
            checks: {
              ...h.checks,
              [fecha]: next
            }
          };
        }
        return h;
      })
    );
  };

  const addHabito = (
    nombre: string,
    categoria: Habito['categoria'],
    minimoViable: string,
    frecuenciaSemanal: number
  ) => {
    const newHab: Habito = {
      id: 'hab-' + Date.now(),
      nombre,
      categoria,
      minimoViable: minimoViable || 'Mínimo: 2 minutos de acción',
      frecuenciaSemanal: frecuenciaSemanal || 5,
      streakActual: 1,
      checks: {
        [selectedDate]: 'cumplido'
      }
    };
    setHabitos(prev => [...prev, newHab]);
  };

  const deleteHabito = (id: string) => {
    setHabitos(prev => prev.filter(h => h.id !== id));
  };

  // Cascading additions
  const addMetaAnual = (meta: Omit<MetaAnual, 'id' | 'progreso'>): MetaAnual => {
    // Pick guaranteed distinct, non-repeated color
    const usedColors = new Set(metasAnuales.map(m => m.colorIdentificador.toLowerCase()));
    let finalColor = meta.colorIdentificador;
    let finalBg = meta.bgLight;
    let finalText = meta.textDark;

    if (!finalColor || usedColors.has(finalColor.toLowerCase())) {
      const distinct = getNextAvailableDistinctColor(metasAnuales, meta.categoria);
      finalColor = distinct.color;
      finalBg = distinct.bgLight;
      finalText = distinct.textDark;
    }

    const newMeta: MetaAnual = {
      ...meta,
      colorIdentificador: finalColor,
      bgLight: finalBg,
      textDark: finalText,
      id: 'meta-' + Date.now(),
      progreso: 0
    };
    setMetasAnuales(prev => [...prev, newMeta]);
    return newMeta;
  };

  const addTorre = (torre: Omit<MetaTrimestral, 'id'> & { id?: string }): MetaTrimestral => {
    const newTorre: MetaTrimestral = {
      ...torre,
      id: torre.id || 'torre-' + Date.now()
    };
    setTorres(prev => [...prev, newTorre]);
    return newTorre;
  };

  const addHito = (hito: Omit<HitoMensual, 'id'> & { id?: string }): HitoMensual => {
    const newHito: HitoMensual = {
      ...hito,
      id: hito.id || 'hito-' + Date.now()
    };
    setHitos(prev => [...prev, newHito]);
    return newHito;
  };

  const addEntregable = (entregable: Omit<EntregableSemanal, 'id'> & { id?: string }): EntregableSemanal => {
    const newEntregable: EntregableSemanal = {
      ...entregable,
      id: entregable.id || 'entregable-' + Date.now()
    };
    setEntregables(prev => [...prev, newEntregable]);
    return newEntregable;
  };

  // Agenda blocks
  const addAgendaBlock = (block: Omit<BloqueAgenda, 'id'>) => {
    const newBlock: BloqueAgenda = {
      ...block,
      id: 'ag-' + Date.now()
    };
    setAgenda(prev => [...prev, newBlock]);
  };

  const deleteAgendaBlock = (id: string) => {
    setAgenda(prev => prev.filter(a => a.id !== id));
  };

  // Wisdom & Energy
  const updateSabiduria = (updater: Partial<CicloSabiduria>) => {
    setSabiduria(prev => ({ ...prev, ...updater }));
  };

  const updateEnergia = (updater: Partial<ConfiguracionEnergia>) => {
    setEnergia(prev => ({ ...prev, ...updater }));
  };

  const resetAllData = () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('crea_monetiza_patricia_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error(e);
    }
    setUser(EMPTY_USER);
    setMetasAnuales(EMPTY_METAS_ANUALES);
    setTorres(EMPTY_TORRES);
    setHitos(EMPTY_HITOS);
    setEntregables(EMPTY_ENTREGABLES);
    setLadrillos(EMPTY_LADRILLOS);
    setPendientes(EMPTY_PENDIENTES);
    setHabitos(EMPTY_HABITOS);
    setAgenda(EMPTY_AGENDA);
    setSabiduria(EMPTY_SABIDURIA);
    setEnergia(EMPTY_ENERGIA);
    setSelectedDate('2026-09-21');
    playSuccessChime();
  };

  const loadDemoData = () => {
    setUser(DEMO_USER);
    setMetasAnuales(DEMO_METAS_ANUALES);
    setTorres(DEMO_TORRES);
    setHitos(DEMO_HITOS);
    setEntregables(DEMO_ENTREGABLES);
    setLadrillos(DEMO_LADRILLOS);
    setPendientes(DEMO_PENDIENTES);
    setHabitos(DEMO_HABITOS);
    setAgenda(DEMO_AGENDA);
    setSabiduria(DEMO_SABIDURIA);
    setEnergia(DEMO_ENERGIA);
    setSelectedDate('2026-09-21');
    playSuccessChime();
  };

  const isDataClean = metasAnuales.length === 0 && ladrillos.length === 0 && habitos.length === 0;

  // Focus Handlers
  const startFocusWithLadrillo = (ladrillo: LadrilloDiario) => {
    setActiveFocusLadrillo(ladrillo);
    setIsFocusModeOpen(true);
  };

  // Modal Flow triggers
  const openAterrizarFlow = (meta?: MetaAnual) => {
    setActiveMetaToAterrizar(meta || metasAnuales[0] || null);
    setIsAterrizarModalOpen(true);
  };

  const openAiBreakdownForMeta = (meta?: MetaAnual) => {
    setActiveMetaToAterrizar(meta || metasAnuales[0] || null);
    setIsAiBreakdownOpen(true);
  };

  // Inspected Task Detail Modal State
  const [inspectedTask, setInspectedTask] = useState<{
    item: LadrilloDiario | BloqueAgenda | TareaPendiente;
    type: 'ladrillo' | 'agenda' | 'pendiente';
  } | null>(null);

  const openTaskDetail = (
    item: LadrilloDiario | BloqueAgenda | TareaPendiente,
    type: 'ladrillo' | 'agenda' | 'pendiente'
  ) => {
    setInspectedTask({ item, type });
  };

  const closeTaskDetail = () => {
    setInspectedTask(null);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        goToPrevDay,
        goToNextDay,
        goToToday,
        user,
        updateUser,
        metasAnuales,
        torres,
        hitos,
        entregables,
        ladrillos,
        pendientes,
        habitos,
        agenda,
        sabiduria,
        energia,
        toggleLadrillo,
        addLadrillo,
        deleteLadrillo,
        togglePendiente,
        addPendiente,
        deletePendiente,
        updateHabitoCheck,
        addHabito,
        deleteHabito,
        addMetaAnual,
        addTorre,
        addHito,
        addEntregable,
        addAgendaBlock,
        deleteAgendaBlock,
        updateSabiduria,
        updateEnergia,
        resetAllData,
        loadDemoData,
        isDataClean,
        isFocusModeOpen,
        setIsFocusModeOpen,
        activeFocusLadrillo,
        startFocusWithLadrillo,
        isAterrizarModalOpen,
        setIsAterrizarModalOpen,
        activeMetaToAterrizar,
        openAterrizarFlow,
        isAiBreakdownOpen,
        setIsAiBreakdownOpen,
        openAiBreakdownForMeta,
        isCalendarConnected,
        setIsCalendarConnected,
        inspectedTask,
        openTaskDetail,
        closeTaskDetail
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
};
