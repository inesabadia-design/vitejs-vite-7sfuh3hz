import React, { useState } from 'react';
import { StaffProvider, useStaff } from './StaffContext';
import { Dashboard } from './components/Dashboard';
import { StaffTable } from './components/StaffTable';
import { KanbanBoard } from './components/KanbanBoard';
import { TrainingView } from './components/TrainingView';
import { ProjectAssignments } from './components/ProjectAssignments';
import { BenchTasks } from './components/BenchTasks';

// Importamos la conexión real de Firebase
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

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

// ICONO OFICIAL DE GOOGLE EN SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.549 0 9s.347 2.827.957 4.039l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.844 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"/>
  </svg>
);

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
  } = useStaff();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [staffTab, setStaffTab] = useState<'main' | 'catalog'>('main');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Función mágica que abre el Login de Google obligando a elegir cuenta y asignando el rol correcto
  const handleGoogleLogin = async (role: 'manager' | 'staff') => {
    setLoading(true);
    setLoginError('');
    try {
      // Forzamos el cierre de sesión previo en Firebase para limpiar cualquier rastro de la memoria del navegador
      await signOut(auth);

      // Obligamos a Google a desplegar siempre la cajita de selección de cuenta
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email || '';
      
      // Filtro corporativo: solo correos Nfq o cualquier Gmail normal para tus pruebas de desarrollo
      const isCorporateEmail = email.endsWith('@nfq.es') || email.includes('gmail.com');
      
      if (!isCorporateEmail) {
        setLoginError(`Acceso denegado. Debes usar un correo corporativo de Nfq.`);
        await signOut(auth);
        return;
      }

      // ASIGNACIÓN ESTRICTA SEGÚN EL BOTÓN PULSADO
      if (role === 'manager') {
        // Da igual la cuenta que elijan, si pulsan mánager, el TFM simulará que entra el perfil directivo principal
        login('ines.abadia@nfq.es', '0000', 'manager');
      } else {
        // Si pulsan Portal Staff, intentamos buscar si su correo existe en el JSON local
        const isOk = login(email, '0000', 'staff');
        if (!isOk) {
          // Si entran con un Gmail personal que no está en la lista de empleados, les prestamos el perfil del primer consultor
          // para que tus compañeros puedan trastear la app como si fueran un empleado real sin que de error.
          const empAsignado = employees.find(e => e.email === email) || employees[0];
          if (empAsignado) {
            login(empAsignado.email, '0000', 'staff');
          } else {
            setLoginError('No se han encontrado perfiles de Staff disponibles.');
          }
        }
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
    { type: 'tecnicas', name: 'Python avanzado para Data Science', cert: 'NFQ-PY', icon: 'Code', desc: 'Análisis numérico y modelado de datos duros para entornos financieros.' },
    { type: 'tecnicas', name: 'Diseño de arquitecturas cloud en AWS', cert: 'NFQ-AWS', icon: 'Cpu', desc: 'Despliegue y escalado eficiente de microservicios bancarios en la nube.' },
    { type: 'tecnicas', name: 'SQL avanzado & Data Warehouse', cert: 'NFQ-SQL', icon: 'Database', desc: 'Optimización de consultas complejas y gestión de almacenes de datos masivos.' },
    { type: 'tecnicas', name: 'Streaming de datos con Apache Kafka', cert: 'NFQ-KFK', icon: 'Terminal', desc: 'Procesamiento de eventos financieros de mercado en tiempo real.' },
    { type: 'funcionales', name: 'Estructura de Mercados Financieros Mayoristas', cert: 'NFQ-FIN', icon: 'Coins', desc: 'Introducción al funcionamiento global de mesas de dinero y renta fija.' },
    { type: 'funcionales', name: 'Gestión de Riesgos de Crédito en CIB', cert: 'NFQ-RSK', icon: 'TrendingUp', desc: 'Modelado analítico y políticas de mitigación de riesgo contraparte.' },
    { type: 'funcionales', name: 'Regulación de Capital Bancario (Basilea IV)', cert: 'NFQ-REG', icon: 'FileText', desc: 'Comprensión del marco normativo internacional de solvencia bancaria.' },
    { type: 'funcionales', name: 'Análisis de procesos de negocio corporativos', cert: 'NFQ-BPA', icon: 'BarChart', desc: 'Levantamiento funcional y maquetación de flujos operativos eficientes.' },
    { type: 'cross', name: 'Metodología Agile & Gestión Scrum', cert: 'NFQ-AGL', icon: 'Users', desc: 'Gestión ágil de proyectos de software en células de trabajo dinámicas.' },
    { type: 'cross', name: 'Habilidades de presentación ante Stakeholders', cert: 'NFQ-STK', icon: 'Layers', desc: 'Oratoria y síntesis ejecutiva para comités directivos de banca.' },
    { type: 'cross', name: 'Maquetación UX/UI con Figma corporativo', cert: 'NFQ-FGM', icon: 'BookOpen', desc: 'Prototipado visual interactivo de la experiencia de usuario.' },
    { type: 'cross', name: 'Design Thinking aplicado a banca', cert: 'NFQ-DSN', icon: 'Lightbulb', desc: 'Técnicas de innovación estructurada para diseño de productos digitales.' },
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code size={18} className="text-blue-600" />;
      case 'Cpu': return <Cpu size={18} className="text-blue-600" />;
      case 'Database': return <Database size={18} className="text-blue-600" />;
      case 'Terminal': return <Terminal size={18} className="text-blue-600" />;
      case 'Coins': return <Coins size={18} className="text-amber-600" />;
      case 'TrendingUp': return <TrendingUp size={18} className="text-amber-600" />;
      case 'FileText': return <FileText size={18} className="text-amber-600" />;
      case 'BarChart': return <BarChart size={18} className="text-amber-600" />;
      case 'Users': return <Users size={18} className="text-purple-600" />;
      case 'Layers': return <Layers size={18} className="text-purple-600" />;
      case 'BookOpen': return <BookOpen size={18} className="text-purple-600" />;
      case 'Lightbulb': return <Lightbulb size={18} className="text-purple-600" />;
      default: return <BookOpen size={18} />;
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

  // PANTALLA PRINCIPAL DE LOGIN
  if (!currentUser && !isManager) {
    return (
      <div className="flex h-screen w-full bg-slate-100 items-center justify-center p-4 font-sans text-xs">
        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-xl max-w-sm w-full text-center space-y-6 relative animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center space-y-3">
            <img
              src="https://lh3.googleusercontent.com/d/1ZRUArlFz7uZOmsEB8cVRBjTHcEZQejNQ"
              alt="Nfq Logo"
              className="h-10 w-auto object-contain mb-1"
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
              Selecciona tu acceso corporativo:
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
              className="w-full h-11 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50 group px-4 active:scale-[0.98]"
            >
              <div className="shrink-0 group-hover:scale-110 transition-transform">
                <GoogleIcon />
              </div>
              <span className="font-bold text-slate-700 text-xs group-hover:text-red-600 transition-colors truncate">
                {loading ? 'Conectando...' : 'Acceso Manager con Google'}
              </span>
            </button>

            {/* BOTÓN 2: LOGIN GOOGLE STAFF */}
            <button
              disabled={loading}
              onClick={() => handleGoogleLogin('staff')}
              className="w-full h-11 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50 group px-4 active:scale-[0.98]"
            >
              <div className="shrink-0 group-hover:scale-110 transition-transform">
                <GoogleIcon />
              </div>
              <span className="font-bold text-slate-700 text-xs group-hover:text-red-600 transition-colors truncate">
                {loading ? 'Conectando...' : 'Portal Staff con Google'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => resetFactoryData()}
              className="mt-4 text-slate-400 hover:text-slate-600 flex items-center gap-1 mx-auto text-[9px] uppercase tracking-widest font-bold font-mono active:scale-95"
              title="Restaurar base de datos limpia de fábrica"
            >
              <RefreshCw size={10} /> Forzar reset de empleados
            </button>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 pt-2 border-t border-slate-100">
            <Lock size={12} /> Autenticación Google Firebase Activa
          </div>
        </div>
      </div>
    );
  }

  // VISTA 1: PORTAL STAFF (CONSULTOR)
  if (currentUser) {
    const currentEmp = employees.find((e) => e.id === currentUser.id) || currentUser;
    const googlePhoto = auth.currentUser?.photoURL || "https://lh3.googleusercontent.com/d/1ZRUArlFz7uZOmsEB8cVRBjTHcEZQejNQ";
    const activeInterviews = projects.filter((p) =>
      p.proposedCandidates.some(
        (c) =>
          c.employeeId === currentEmp.id &&
          (c.stage === 'En entrevista' || c.stage === 'Presentado como propuesta')
      )
    );
    const topSkills = getDemandedSkills();

    return (
      <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden text-xs animate-in fade-in duration-500">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-auto py-3 md:h-16 bg-white border-b border-slate-200 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 z-10 shadow-sm shrink-0 gap-3">
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-start">
              <img
                src="https://lh3.googleusercontent.com/d/1ZRUArlFz7uZOmsEB8cVRBjTHcEZQejNQ"
                alt="Nfq Logo"
                className="h-7 md:h-8 w-auto object-contain"
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
                <img src={googlePhoto} className="w-4 h-4 rounded-full object-cover" alt="" />
                <span className="font-bold text-slate-700 truncate max-w-[120px]">
                  {auth.currentUser?.displayName || currentEmp.name}
                </span>
              </div>
              <button
                onClick={handleLogoutAction}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors flex items-center gap-1 shadow-sm text-[11px] active:scale-95"
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
                  className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors flex items-center justify-center active:scale-95"
                >
                  <ArrowLeft size={14} />
                </button>
                <div>
                  <h3 className="text-xs md:text-sm font-bold text-slate-900">
                    Catálogo de Formaciones de Cuenta
                  </h3>
                  <p className="text-slate-500 text-[10px] md:text-[11px] mt-0.5 leading-tight">
                    Cualificaciones estratégicas requeridas para los proyectos de Santander CIB.
                  </p>
                </div>
              </div>
              {['tecnicas', 'funcionales', 'cross'].map((categoryType) => (
                <div key={categoryType} className="space-y-3">
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 border-l-2 border-red-500 pl-2">
                    {categoryType === 'tecnicas' ? 'Cualificaciones Técnicas' : categoryType === 'funcionales' ? 'Modelos Funcionales de Banca' : 'Habilidades Cross Management'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-2">
                    {CATALOGO_FORMACIONES.filter((f) => f.type === categoryType).map((f) => {
                      const alreadyEnrolled = currentEmp.training.some((t) => t.courseName === f.name);
                      return (
                        <div key={f.name} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 hover:shadow-md transition-all duration-300">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg shrink-0">
                                {renderIcon(f.icon)}
                              </div>
                              <span className="font-bold text-slate-800 text-[11px] leading-tight truncate">
                                {f.name}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-3">
                              {f.desc}
                            </p>
                          </div>
                          {alreadyEnrolled ? (
                            <div className="w-full text-center py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px] rounded-lg flex items-center justify-center gap-1 shadow-inner">
                              <CheckCircle size={12} /> Ya la estás haciendo
                            </div>
                          ) : (
                            <button
                              onClick={() => enrollInTraining(currentEmp.id, f.name, f.cert)}
                              className="w-full py-1.5 bg-slate-900 hover:bg-red-600 text-white font-medium text-[10px] rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1 active:scale-[0.98]"
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
                  <h3 className="text-xs md:text-sm font-bold text-slate-900 truncate">
                    ¡Hola de nuevo, {auth.currentUser?.displayName || currentEmp.name}!
                  </h3>
                  <p className="text-slate-500 text-[10px] md:text-[11px] leading-tight">
                    Pool de talento técnico homologado asignado a la cuenta de Santander CIB.
                  </p>
                </div>
                <div className="bg-slate-50 px-3 py-1.5 md:py-2 rounded-lg border border-slate-200 flex items-center gap-2 self-start sm:self-auto shadow-inner">
                  <LockIcon size={12} className="text-slate-400 shrink-0" />
                  <span className="text-slate-500 font-medium text-[10px]">
                    Mi Estado Operativo (Sólo Mánager):
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[9px] md:text-[10px] ${currentEmp.status === 'Disponible' ? 'bg-teal-50 text-teal-700 border border-teal-200' : currentEmp.status === 'Asignado' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {currentEmp.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 pb-2">
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <Bell size={14} className="text-red-500" /> Recordatorios de Procesos
                    </h4>
                    {activeInterviews.length === 0 ? (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-400 border border-slate-100 flex items-center gap-2 font-medium shadow-inner">
                        <CheckCircle size={14} className="text-teal-500 shrink-0" /> Sin citaciones pendientes.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {activeInterviews.map((p) => (
                          <div key={p.id} className="p-3 bg-red-50/50 border border-red-200 rounded-lg space-y-1">
                            <div className="font-bold text-red-700 flex items-center gap-1.5">
                              <BriefcaseIcon size={12} /> Entrevista Concertada
                            </div>
                            <p className="text-slate-700 font-medium leading-tight">
                              {p.client} — {p.projectName}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <ClipboardList size={14} className="text-red-500" /> Tareas Solicitadas
                    </h4>
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {benchTasks.map((task) => {
                        const isMine = task.assignedToName === currentEmp.name;
                        const isOpen = task.status === 'Open';
                        if (!isOpen && !isMine) return null;
                        return (
                          <div key={task.id} className={`p-3 rounded-lg border transition-all ${isMine ? 'bg-emerald-50/50 border-emerald-200 shadow-inner' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-bold text-slate-900 text-xs leading-tight">
                                {task.title}
                              </span>
                              {isMine ? (
                                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded shrink-0">
                                  En Progreso
                                </span>
                              ) : (
                                <button onClick={() => claimBenchTask(task.id, currentEmp.name)} className="px-2 py-0.5 bg-slate-900 hover:bg-red-600 text-white rounded font-medium text-[9px] transition-colors shadow-sm shrink-0 active:scale-95">
                                  Asumir
                                </button>
                              )}
                            </div>
                            <p className="text-slate-500 text-[11px] mt-1.5 leading-relaxed line-clamp-2">
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
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-200 pb-3 shrink-0">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <Target size={16} className="text-red-500" /> Radar de Oportunidades
                      </h4>
                      <span className="text-[9px] text-slate-500 font-bold bg-slate-200 px-2.5 py-1 rounded-full tracking-wider uppercase shadow-inner">
                        Basado en proyectos activos
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-2xl">
                      Estas son las tecnologías y habilidades funcionales más demandadas ahora mismo por los Managers de la cuenta Santander. Fórmate en ellas para multiplicar tus opciones de salir del Bench.
                    </p>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {topSkills.slice(0, 10).map(([skill, count]) => (
                        <div key={skill} className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-[10px] font-bold flex items-center gap-2 shadow-sm">
                          {skill}
                          <span className="bg-white text-red-600 px-1.5 py-0.5 rounded-md text-[9px] shadow-sm border border-red-100 flex items-center font-black">
                            {count} {count === 1 ? 'req' : 'reqs'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 md:p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-3 shrink-0">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <GraduationCap size={16} className="text-red-500" /> Mis Cursos y Certificaciones
                      </h4>
                      <button onClick={() => setStaffTab('catalog')} className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-bold text-[10px] flex items-center gap-1 shadow-sm w-full sm:w-auto justify-center active:scale-95">
                        <BookOpen size={12} /> Ir al Catálogo
                      </button>
                    </div>
                    {currentEmp.training.length === 0 ? (
                      <p className="text-slate-400 italic p-6 bg-slate-50 rounded-lg text-center font-medium border border-slate-100 shadow-inner">
                        Aún no estás cursando ninguna formación oficial de la cuenta Santander CIB.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
                        {currentEmp.training.map((course) => {
                          let barColor = 'bg-red-500';
                          let textLabel = course.progress + '% de avance';
                          if (course.progress === 100) { barColor = 'bg-emerald-600'; textLabel = '¡Completado!'; }
                          else if (course.progress > 50) barColor = 'bg-orange-500';
                          else if (course.progress >= 20) barColor = 'bg-amber-500';
                          return (
                            <div key={course.id} className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                              <div>
                                <div className="font-bold text-slate-800 text-xs truncate leading-tight">{course.courseName}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                                  <Award size={12} className="shrink-0" /> Certificación:{' '}
                                  <span className="font-medium text-slate-500">{course.certification}</span>
                                </div>
                              </div>
                              <div className="space-y-2.5">
                                <div className="flex justify-between items-center text-[10px] font-medium leading-none">
                                  <span className="text-slate-400">Progreso:</span>
                                  <span className={course.progress === 100 ? 'text-emerald-600 font-black' : 'text-slate-700 font-bold'}>{textLabel}</span>
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner border border-slate-100">
                                  <div className={barColor + ' h-full transition-all duration-500 ease-out'} style={{ width: course.progress + '%' }}></div>
                                </div>
                                <div className="flex justify-end gap-1.5 pt-0.5">
                                  <button onClick={() => updateTrainingProgress(currentEmp.id, course.id, course.progress - 10)} className="p-1 h-6 w-6 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-500 shadow-sm active:scale-90"><Minus size={11} /></button>
                                  <button onClick={() => updateTrainingProgress(currentEmp.id, course.id, course.progress + 10)} className="p-1 h-6 w-6 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-500 shadow-sm active:scale-90"><Plus size={11} /></button>
                                  <button onClick={() => dropTraining(currentEmp.id, course.id)} className="p-1 h-6 w-6 flex items-center justify-center bg-white border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-600 rounded transition-colors ml-1 shadow-sm active:scale-90"><Trash2 size={11} /></button>
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

  // VISTA 2: MODULO MANAGER (CUADRO DIRECTIVO)
  const googlePhoto = auth.currentUser?.photoURL || "https://fonts.gstatic.com/s/i/productlogos/googleg/v6/web-24dp/copy_of_googleg_standard_color_24dp.png";
  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden animate-in fade-in duration-500 text-xs">
      <aside className={`bg-slate-950 text-white flex flex-col transition-all duration-300 ease-in-out z-20 shadow-xl border-r border-slate-900 shrink-0 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-900 bg-slate-950 shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 pl-1.5">
              <img
                src="https://lh3.googleusercontent.com/d/1ZRUArlFz7uZOmsEB8cVRBjTHcEZQejNQ"
                alt="Nfq Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="text-xs uppercase font-black tracking-wider text-red-500 flex flex-col leading-none text-left">
                Nfq <span className="text-slate-400 font-light text-[9px] tracking-normal mt-0.5 lowercase font-mono">staff.control</span>
              </span>
            </div>
          ) : (
            <div className="mx-auto font-black text-red-500 text-xs">N</div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-slate-900 rounded-md transition-colors ml-auto text-slate-500 hover:text-white active:scale-95">
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        </div>

        <div className="p-3 flex-1 overflow-y-auto pr-2">
          <nav className="space-y-1.5">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg transition-all ${isActive ? 'bg-red-600 text-white font-bold shadow-md shadow-red-900/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'} ${!sidebarOpen && 'justify-center px-0'}`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon size={16} className={isActive ? 'text-white' : 'text-slate-500 shrink-0'} />
                  {sidebarOpen && <span className="truncate leading-none pt-0.5 text-[12px]">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-900 bg-slate-950/80">
          {sidebarOpen ? (
            <div className="flex flex-col gap-2.5">
              <button onClick={handleLogoutAction} className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] rounded-lg transition-all font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95">
                <LogOut size={12} /> Cerrar Sesión
              </button>
              <div className="flex items-center gap-3 px-1.5 pt-2.5 border-t border-slate-900">
                <img src={googlePhoto} alt="Manager Image" className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-800 shadow-inner bg-white p-0.5" />
                <div className="flex flex-col text-left overflow-hidden pt-0.5">
                  <span className="text-xs font-bold text-white truncate leading-tight">{auth.currentUser?.displayName || 'Inés Abadía'}</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest truncate mt-0.5">CIB Manager</span>
                </div>
              </div>
            </div>
          ) : (
            <img src={googlePhoto} alt="Manager" className="w-8 h-8 rounded-full object-cover mx-auto border border-slate-800 shadow-inner bg-white p-0.5" />
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-slate-100">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden md:block truncate leading-none pt-0.5">Santander CIB / Staffing Resources Control Panel</h2>
            <div className="px-3 py-1 bg-red-50 text-red-700 rounded-full font-bold text-[10px] md:hidden shadow-inner">FY26</div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="px-2.5 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 border border-slate-200 shadow-inner hidden sm:flex items-center gap-1.5">
              Año Fiscal: <span className="text-red-600 font-black">2026</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50">
          <div className="max-w-[1400px] mx-auto h-full pb-2">
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