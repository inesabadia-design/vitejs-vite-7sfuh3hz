import React, { useState, useEffect } from 'react';
import { StaffProvider, useStaff } from './StaffContext';
import { Dashboard } from './components/Dashboard';
import { StaffTable } from './components/StaffTable';
import { KanbanBoard } from './components/KanbanBoard';
import { TrainingView } from './components/TrainingView';
import { ProjectAssignments } from './components/ProjectAssignments';
import { BenchTasks } from './components/BenchTasks';

// Importamos la conexión real de Firebase
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

import {
  LayoutDashboard,
  Users,
  UserSquare2,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  Briefcase,
  ClipboardList,
  UserCheck,
  Bell,
  CheckCircle,
  Award,
  Plus,
  Minus,
  BriefcaseIcon,
  LogOut,
  Lock,
  LockIcon,
  BookOpen,
  ArrowLeft,
  Code,
  Cpu,
  Database,
  Terminal,
  Coins,
  TrendingUp,
  FileText,
  BarChart,
  Lightbulb,
  Sparkles,
  Layers,
  Trash2,
  RefreshCw,
  Target,
} from 'lucide-react';

function AppContent() {
  const {
    currentUser,
    isManager,
    login,
    logout,
    employees,
    projects,
    benchTasks,
    updateTrainingProgress,
    claimBenchTask,
    enrollInTraining,
    dropTraining,
    resetFactoryData,
    setGoogleUser, // Asegúrate de tener o añadir esta función en tu Context más adelante si hace falta, por ahora simulamos con el estado de Firebase
  } = useStaff();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [staffTab, setStaffTab] = useState<'main' | 'catalog'>('main');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Escucha activa para saber si el usuario ya está logueado en Google
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Si detecta usuario de Google, le damos acceso basándonos en su correo
        const email = user.email || '';
        // Un truco para la demo del TFM: si el correo contiene 'manager' o tú lo decides, entra como Manager, si no como Staff
        if (email.includes('manager') || email === 'ines.abadia@nfq.es') {
          login(email, '0000', 'manager');
        } else {
          login(email, '0000', 'staff');
        }
      }
    });
    return () => unsubscribe();
  }, [login]);

  // Función mágica que abre el Login de Google
  const handleGoogleLogin = async (role: 'manager' | 'staff') => {
    setLoading(true);
    setLoginError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Intentamos loguearlo en nuestro sistema usando su email real de Google
      const isOk = login(user.email || '', '0000', role);

      if (!isOk) {
        setLoginError(
          `Acceso denegado. El correo ${user.email} no está registrado en el sistema.`
        );
        await signOut(auth);
      }
    } catch (error: any) {
      console.error(error);
      setLoginError('Error al conectar con Google. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAction = async () => {
    await signOut(auth);
    logout();
  };

  const SIDEBAR_ITEMS = [
    { id: 'dashboard', label: 'Dashboard KPI', icon: LayoutDashboard },
    { id: 'directorio', label: 'Listado Staff', icon: UserSquare2 },
    { id: 'kanban', label: 'Candidates Pipeline', icon: Users },
    { id: 'assignments', label: 'Mapeo de Proyectos', icon: Briefcase },
    { id: 'training', label: 'Formación y Cursos', icon: GraduationCap },
    { id: 'benchtasks', label: 'Tareas y Necesidades', icon: ClipboardList },
  ];

  const CATALOGO_FORMACIONES = [
    {
      type: 'tecnicas',
      name: 'Python avanzado para Data Science',
      cert: 'NFQ-PY',
      icon: 'Code',
      desc: 'Análisis numérico y modelado de datos duros para entornos financieros.',
    },
    {
      type: 'tecnicas',
      name: 'Diseño de arquitecturas cloud en AWS',
      cert: 'NFQ-AWS',
      icon: 'Cpu',
      desc: 'Despliegue y escalado eficiente de microservicios bancarios en la nube.',
    },
    {
      type: 'tecnicas',
      name: 'SQL avanzado & Data Warehouse',
      cert: 'NFQ-SQL',
      icon: 'Database',
      desc: 'Optimización de consultas complejas y gestión de almacenes de datos masivos.',
    },
    {
      type: 'tecnicas',
      name: 'Streaming de datos con Apache Kafka',
      cert: 'NFQ-KFK',
      icon: 'Terminal',
      desc: 'Procesamiento de eventos financieros de mercado en tiempo real.',
    },
    {
      type: 'funcionales',
      name: 'Estructura de Mercados Financieros Mayoristas',
      cert: 'NFQ-FIN',
      icon: 'Coins',
      desc: 'Introducción al funcionamiento global de mesas de dinero y renta fija.',
    },
    {
      type: 'funcionales',
      name: 'Gestión de Riesgos de Crédito en CIB',
      cert: 'NFQ-RSK',
      icon: 'TrendingUp',
      desc: 'Modelado analítico y políticas de mitigación de riesgo contraparte.',
    },
    {
      type: 'funcionales',
      name: 'Regulación de Capital Bancario (Basilea IV)',
      cert: 'NFQ-REG',
      icon: 'FileText',
      desc: 'Comprensión del marco normativo internacional de solvencia bancaria.',
    },
    {
      type: 'funcionales',
      name: 'Análisis de procesos de negocio corporativos',
      cert: 'NFQ-BPA',
      icon: 'BarChart',
      desc: 'Levantamiento funcional y maquetación de flujos operativos eficientes.',
    },
    {
      type: 'cross',
      name: 'Metodología Agile & Gestión Scrum',
      cert: 'NFQ-AGL',
      icon: 'Users',
      desc: 'Gestión ágil de proyectos de software en células de trabajo dinámicas.',
    },
    {
      type: 'cross',
      name: 'Habilidades de presentación ante Stakeholders',
      cert: 'NFQ-STK',
      icon: 'Layers',
      desc: 'Oratoria y síntesis ejecutiva para comités directivos de banca.',
    },
    {
      type: 'cross',
      name: 'Maquetación UX/UI con Figma corporativo',
      cert: 'NFQ-FGM',
      icon: 'BookOpen',
      desc: 'Prototipado visual interactivo enfocado a la experiencia del usuario.',
    },
    {
      type: 'cross',
      name: 'Design Thinking aplicado a banca',
      cert: 'NFQ-DSN',
      icon: 'Lightbulb',
      desc: 'Técnicas de innovación estructurada para diseño de productos digitales.',
    },
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code size={18} className="text-blue-600" />;
      case 'Cpu':
        return <Cpu size={18} className="text-blue-600" />;
      case 'Database':
        return <Database size={18} className="text-blue-600" />;
      case 'Terminal':
        return <Terminal size={18} className="text-blue-600" />;
      case 'Coins':
        return <Coins size={18} className="text-amber-600" />;
      case 'TrendingUp':
        return <TrendingUp size={18} className="text-amber-600" />;
      case 'FileText':
        return <FileText size={18} className="text-amber-600" />;
      case 'BarChart':
        return <BarChart size={18} className="text-amber-600" />;
      case 'Users':
        return <Users size={18} className="text-purple-600" />;
      case 'Layers':
        return <Layers size={18} className="text-purple-600" />;
      case 'BookOpen':
        return <BookOpen size={18} className="text-purple-600" />;
      case 'Lightbulb':
        return <Lightbulb size={18} className="text-purple-600" />;
      default:
        return <BookOpen size={18} />;
    }
  };

  const getDemandedSkills = () => {
    const counts: Record<string, number> = {};
    (projects || []).forEach((p) => {
      if (p.status !== 'Closed' && p.skills) {
        p.skills.forEach((skill) => {
          counts[skill] = (counts[skill] || 0) + 1;
        });
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  // PANTALLA DE LOGIN CON BOTÓN DE GOOGLE
  if (!currentUser && !isManager) {
    const googlePhoto =
      auth.currentUser?.photoURL ||
      'https://lh3.googleusercontent.com/d/1ZRUArlFz7uZOmsEB8cVRBjTHcEZQejNQ';
    return (
      <div className="flex h-screen w-full bg-slate-100 items-center justify-center p-4 font-sans text-xs">
        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-xl max-w-sm w-full text-center space-y-6 relative">
          <div className="flex flex-col items-center space-y-3">
            <img
              src={googlePhoto}
              alt="Nfq Logo"
              className="h-12 w-12 rounded-full object-cover border border-slate-200"
            />
            <div>
              <h1 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Control Hub & Staffing
              </h1>
              <p className="text-slate-400 text-[10px] uppercase font-mono mt-0.5">
                Santander CIB Cloud Sync
              </p>
            </div>
          </div>

          <div className="h-px bg-slate-200 w-full"></div>

          <div className="space-y-4">
            <span className="text-slate-400 font-bold block text-left pl-1 text-[10px] uppercase tracking-wider mb-1">
              Iniciar sesión de forma segura:
            </span>

            {loginError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 font-bold text-center text-[10px]">
                {loginError}
              </div>
            )}

            {/* BOTÓN 1: LOGIN GOOGLE MANAGER */}
            <button
              disabled={loading}
              onClick={() => handleGoogleLogin('manager')}
              className="w-full py-4 px-6 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-red-500 rounded-xl transition-all flex items-center justify-center gap-3 group shadow-sm disabled:opacity-50"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.216 1.414 15.44 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.89 11.57-11.79 0-.79-.085-1.4-.19-1.905H12.24z"
                />
              </svg>
              <span className="font-bold text-slate-700 text-xs group-hover:text-red-600 transition-colors">
                {loading ? 'Conectando...' : 'Acceso Manager con Google'}
              </span>
            </button>

            {/* BOTÓN 2: LOGIN GOOGLE STAFF */}
            <button
              disabled={loading}
              onClick={() => handleGoogleLogin('staff')}
              className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 rounded-xl transition-all flex items-center justify-center gap-3 group shadow-md disabled:opacity-50"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#FFFFFF"
                  d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.216 1.414 15.44 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.89 11.57-11.79 0-.79-.085-1.4-.19-1.905H12.24z"
                />
              </svg>
              <span className="font-bold text-white text-xs">
                {loading ? 'Conectando...' : 'Portal Staff con Google'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => resetFactoryData()}
              className="mt-4 text-slate-400 hover:text-slate-600 flex items-center gap-1 mx-auto canvas-reset text-[9px] uppercase tracking-widest font-bold font-mono"
              title="Restaurar base de datos limpia de fábrica"
            >
              <RefreshCw size={10} /> Forzar reset de empleados
            </button>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 pt-2">
            <Lock size={12} /> Autenticación Google Firebase Activa
          </div>
        </div>
      </div>
    );
  }

  // PORTAL STAFF ENTRADO
  if (currentUser) {
    const currentEmp =
      employees.find((e) => e.id === currentUser.id) || currentUser;
    const googlePhoto =
      auth.currentUser?.photoURL ||
      'https://lh3.googleusercontent.com/d/1ZRUArlFz7uZOmsEB8cVRBjTHcEZQejNQ';
    const activeInterviews = projects.filter((p) =>
      p.proposedCandidates.some(
        (c) =>
          c.employeeId === currentEmp.id &&
          (c.stage === 'En entrevista' ||
            c.stage === 'Presentado como propuesta')
      )
    );
    const topSkills = getDemandedSkills();

    return (
      <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden text-xs">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-auto py-3 md:h-16 bg-white border-b border-slate-200 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 z-10 shadow-sm shrink-0 gap-3">
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-start">
              <img
                src={googlePhoto}
                alt="Profile"
                className="h-8 w-12 rounded-full object-cover"
              />
              <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-slate-600">
                  Portal Técnico
                </span>
                <h2 className="text-[11px] md:text-xs font-bold text-slate-800 uppercase tracking-widest">
                  Portal Staff Santander
                </h2>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-2.5 md:pt-0">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 font-bold text-[10px]">
                  Consultor:
                </span>
                <span className="font-bold text-slate-700">
                  {auth.currentUser?.displayName || currentEmp.name}
                </span>
              </div>
              <button
                onClick={handleLogoutAction}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors flex items-center gap-1 shadow-sm text-[11px]"
              >
                <LogOut size={12} /> Salir
              </button>
            </div>
          </header>

          {staffTab === 'catalog' ? (
            <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <button
                  onClick={() => setStaffTab('main')}
                  className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors flex items-center justify-center"
                >
                  <ArrowLeft size={14} />
                </button>
                <div>
                  <h3 className="text-xs md:text-sm font-bold text-slate-900">
                    Catálogo de Formaciones de Cuenta
                  </h3>
                  <p className="text-slate-500 text-[10px] md:text-[11px] mt-0.5">
                    Cualificaciones estratégicas requeridas para los proyectos
                    de Santander CIB.
                  </p>
                </div>
              </div>
              {['tecnicas', 'funcionales', 'cross'].map((categoryType) => (
                <div key={categoryType} className="space-y-3">
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 border-l-2 border-red-500 pl-2">
                    {categoryType === 'tecnicas'
                      ? 'Cualificaciones Técnicas'
                      : categoryType === 'funcionales'
                      ? 'Modelos Funcionales de Banca'
                      : 'Habilidades Cross Management'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-4">
                    {CATALOGO_FORMACIONES.filter(
                      (f) => f.type === categoryType
                    ).map((f) => {
                      const alreadyEnrolled = currentEmp.training.some(
                        (t) => t.courseName === f.name
                      );
                      return (
                        <div
                          key={f.name}
                          className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-slate-50 border rounded-lg shrink-0">
                                {renderIcon(f.icon)}
                              </div>
                              <span className="font-bold text-slate-800 text-[11px] leading-tight">
                                {f.name}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[10px] leading-relaxed">
                              {f.desc}
                            </p>
                          </div>
                          {alreadyEnrolled ? (
                            <div className="w-full text-center py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px] rounded-lg flex items-center justify-center gap-1">
                              <CheckCircle size={12} /> Ya la estás haciendo
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                enrollInTraining(currentEmp.id, f.name, f.cert)
                              }
                              className="w-full py-1.5 bg-slate-900 hover:bg-red-600 text-white font-medium text-[10px] rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1"
                            >
                              <Sparkles size={11} /> Empezar Curso
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-4 md:p-6 space-y-4 md:space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-xs md:text-sm font-bold text-slate-900">
                    ¡Hola de nuevo,{' '}
                    {auth.currentUser?.displayName || currentEmp.name}!
                  </h3>
                  <p className="text-slate-500 text-[10px] md:text-[11px]">
                    Pool de talento técnico homologado asignado a la cuenta de
                    Santander CIB.
                  </p>
                </div>
                <div className="bg-slate-50 px-3 py-1.5 md:py-2 rounded-lg border border-slate-200 flex items-center gap-2 self-start sm:self-auto">
                  <LockIcon size={12} className="text-slate-400 shrink-0" />
                  <span className="text-slate-500 font-medium text-[10px]">
                    Mi Estado Operativo (Sólo Mánager):
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[9px] md:text-[10px] ${
                      currentEmp.status === 'Disponible'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : currentEmp.status === 'Asignado'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {currentEmp.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <Bell size={14} className="text-red-500" /> Recordatorios
                      de Procesos
                    </h4>
                    {activeInterviews.length === 0 ? (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-400 border border-slate-100 flex items-center gap-2 font-medium">
                        <CheckCircle
                          size={14}
                          className="text-teal-500 shrink-0"
                        />{' '}
                        Sin citaciones pendientes.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {activeInterviews.map((p) => (
                          <div
                            key={p.id}
                            className="p-3 bg-red-50/50 border border-red-200 rounded-lg space-y-1"
                          >
                            <div className="font-bold text-red-700 flex items-center gap-1.5">
                              <BriefcaseIcon size={12} /> Entrevista Concertada
                            </div>
                            <p className="text-slate-700 font-medium">
                              {p.client} — {p.projectName}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <ClipboardList size={14} className="text-red-500" />{' '}
                      Tareas Solicitadas
                    </h4>
                    <div className="space-y-2.5">
                      {benchTasks.map((task) => {
                        const isMine = task.assignedToName === currentEmp.name;
                        const isOpen = task.status === 'Open';
                        if (!isOpen && !isMine) return null;
                        return (
                          <div
                            key={task.id}
                            className={`p-3 rounded-lg border transition-all ${
                              isMine
                                ? 'bg-emerald-50/50 border-emerald-200'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-bold text-slate-900 text-xs">
                                {task.title}
                              </span>
                              {isMine ? (
                                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded shrink-0">
                                  En Progreso
                                </span>
                              ) : (
                                <button
                                  onClick={() =>
                                    claimBenchTask(task.id, currentEmp.name)
                                  }
                                  className="px-2 py-0.5 bg-slate-900 hover:bg-red-600 text-white rounded font-medium text-[9px] transition-colors shadow-sm shrink-0"
                                >
                                  Asumir
                                </button>
                              )}
                            </div>
                            <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 md:p-5 space-y-4 bg-gradient-to-br from-white to-slate-50">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-200 pb-3">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <Target size={16} className="text-red-500" /> Radar de
                        Oportunidades
                      </h4>
                      <span className="text-[9px] text-slate-500 font-bold bg-slate-200 px-2.5 py-1 rounded-full tracking-wider uppercase">
                        Basado en proyectos activos
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-2xl">
                      Estas son las tecnologías y habilidades funcionales más
                      demandadas ahora mismo por los Managers de la cuenta
                      Santander. Fórmate en ellas para multiplicar tus opciones
                      de salir del Bench.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {topSkills.map(([skill, count]) => (
                        <div
                          key={skill}
                          className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-[10px] font-bold flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5"
                        >
                          {skill}
                          <span className="bg-white text-red-600 px-1.5 py-0.5 rounded-md text-[9px] shadow-sm border border-red-100 flex items-center">
                            {count} {count === 1 ? 'req' : 'reqs'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 md:p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-3">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <GraduationCap size={16} className="text-red-500" /> Mis
                        Cursos y Certificaciones
                      </h4>
                      <button
                        onClick={() => setStaffTab('catalog')}
                        className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-bold text-[10px] flex items-center gap-1 shadow-sm w-full sm:w-auto justify-center"
                      >
                        <BookOpen size={12} /> Ir al Catálogo
                      </button>
                    </div>
                    {currentEmp.training.length === 0 ? (
                      <p className="text-slate-400 italic p-4 bg-slate-50 rounded-lg text-center font-medium">
                        Aún no estás cursando ninguna formación oficial.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentEmp.training.map((course) => {
                          let barColor = 'bg-red-500';
                          let textLabel = course.progress + '% de avance';
                          if (course.progress === 100) {
                            barColor = 'bg-emerald-600';
                            textLabel = '¡Completado!';
                          } else if (course.progress > 50)
                            barColor = 'bg-orange-500';
                          else if (course.progress >= 20)
                            barColor = 'bg-amber-500';
                          return (
                            <div
                              key={course.id}
                              className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3"
                            >
                              <div>
                                <div className="font-bold text-slate-800 text-xs">
                                  {course.courseName}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                  <Award size={12} /> Certificación:{' '}
                                  {course.certification}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-medium">
                                  <span className="text-slate-400">
                                    Progreso:
                                  </span>
                                  <span
                                    className={
                                      course.progress === 100
                                        ? 'text-emerald-600 font-bold'
                                        : 'text-slate-700 font-bold'
                                    }
                                  >
                                    {textLabel}
                                  </span>
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                                  <div
                                    className={
                                      barColor +
                                      ' h-full transition-all duration-300'
                                    }
                                    style={{ width: course.progress + '%' }}
                                  ></div>
                                </div>
                                <div className="flex justify-end gap-1 pt-1">
                                  <button
                                    onClick={() =>
                                      updateTrainingProgress(
                                        currentEmp.id,
                                        course.id,
                                        course.progress - 10
                                      )
                                    }
                                    className="p-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-500"
                                  >
                                    <Minus size={10} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateTrainingProgress(
                                        currentEmp.id,
                                        course.id,
                                        course.progress + 10
                                      )
                                    }
                                    className="p-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-500"
                                  >
                                    <Plus size={10} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      dropTraining(currentEmp.id, course.id)
                                    }
                                    className="p-1 bg-white border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-600 rounded transition-colors ml-1"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // PORTAL MÁNAGER (VISTA COMPLETA DE RECURSOS)
  const googlePhoto =
    auth.currentUser?.photoURL ||
    'https://lh3.googleusercontent.com/d/1ZRUArlFz7uZOmsEB8cVRBjTHcEZQejNQ';
  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <aside
        className={`bg-slate-950 text-white flex flex-col transition-all duration-300 ease-in-out z-20 shadow-xl border-r border-slate-900 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-900 bg-slate-950 shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 pl-2">
              <img
                src={googlePhoto}
                alt="Nfq Logo"
                className="h-8 w-8 rounded-full object-cover shrink-0"
              />
              <span className="text-xs uppercase font-black tracking-wider text-red-500 flex flex-col leading-none text-left">
                Nfq{' '}
                <span className="text-slate-400 font-light text-[9px] tracking-normal mt-0.5 lowercase font-mono">
                  staff.control
                </span>
              </span>
            </div>
          ) : (
            <div className="mx-auto font-black text-red-500 text-xs">N</div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-slate-900 rounded-md transition-colors ml-auto text-slate-500 hover:text-white"
          >
            {sidebarOpen ? (
              <PanelLeftClose size={18} />
            ) : (
              <PanelLeftOpen size={18} />
            )}
          </button>
        </div>

        <div className="p-3 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[12px] ${
                    isActive
                      ? 'bg-red-600 text-white font-bold shadow-md shadow-red-900/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  } ${!sidebarOpen && 'justify-center px-0'}`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon
                    size={16}
                    className={isActive ? 'text-white' : 'text-slate-400'}
                  />
                  {sidebarOpen && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-900 bg-slate-950/80">
          {sidebarOpen ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleLogoutAction}
                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] rounded-lg transition-all font-bold uppercase tracking-wider flex items-center justify-center gap-1"
              >
                <LogOut size={12} /> Cerrar Sesión
              </button>
              <div className="flex items-center gap-3 px-1 pt-2 border-t border-slate-900">
                <img
                  src={googlePhoto}
                  alt="Manager Image"
                  className="w-7 h-7 rounded-full object-cover shrink-0 bg-gradient-to-tr from-red-600 to-amber-500"
                />
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-xs font-bold text-white truncate">
                    {auth.currentUser?.displayName || 'Inés Abadía'}
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest truncate">
                    CIB Manager
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <img
              src={googlePhoto}
              alt="Manager"
              className="w-7 h-7 rounded-full object-cover mx-auto bg-gradient-to-tr from-red-600 to-amber-500"
            />
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">
              Santander CIB / Staffing Resources
            </h2>
          </div>
          <div className="px-2.5 py-0.5 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 border border-slate-200">
            Año Fiscal: <span className="text-red-600">2026</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50">
          <div className="max-w-[1400px] mx-auto h-full">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'directorio' && <StaffTable />}
            {activeTab === 'kanban' && <KanbanBoard />}
            {activeTab === 'assignments' && <ProjectAssignments />}
            {activeTab === 'training' && <TrainingView isPortalView={false} />}
            {activeTab === 'benchtasks' && <BenchTasks />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <StaffProvider>
      <AppContent />
    </StaffProvider>
  );
}
