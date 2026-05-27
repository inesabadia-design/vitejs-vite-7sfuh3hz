export type StaffStatus =
  | 'Disponible'
  | 'En entrevista'
  | 'Propuesto'
  | 'Asignado';

export interface Training {
  id: string;
  courseName: string;
  progress: number;
  certification: string;
  estimatedCompletion: string;
}

export interface Task {
  id: string;
  description: string;
  date: string;
  status: 'Completada' | 'Pendiente';
}

export interface Employee {
  id: string;
  name: string;
  category: string;
  status: StaffStatus;
  isBlocked: boolean;
  training: Training[];
  tasks: Task[];
}

export interface Candidate {
  employeeId: string;
  stage:
    | 'Presentado como propuesta'
    | 'En entrevista'
    | 'Rechazado'
    | 'Asignado';
}

export interface Project {
  id: string;
  client: string;
  projectName: string;
  status: 'Open' | 'Closed';
  roleRequired: string;
  skills: string[];
  proposedCandidates: Candidate[];
}

export interface BenchTask {
  id: string;
  title: string;
  description: string;
  requestedBy: string;
  status: 'Open' | 'Assigned' | 'Completed';
  assignedToName?: string;
}

// 1. POOL DE STAFF DE LA CUENTA SANTANDER (Jerarquía real corporativa)
export const initialEmployees: Employee[] = [
  {
    id: 'e1',
    name: 'Laura Gomez',
    category: 'Senior Consultant',
    status: 'Disponible',
    isBlocked: false,
    training: [
      {
        id: 't1',
        courseName: 'Python avanzado para Data Science',
        progress: 100,
        certification: 'NFQ-PY',
        estimatedCompletion: '2026-10-30',
      },
    ],
    tasks: [],
  },
  {
    id: 'e2',
    name: 'Carlos Ruiz',
    category: 'Consultant',
    status: 'En entrevista',
    isBlocked: true,
    training: [
      {
        id: 't2',
        courseName: 'Diseño de arquitecturas cloud en AWS',
        progress: 50,
        certification: 'NFQ-AWS',
        estimatedCompletion: '2026-12-15',
      },
    ],
    tasks: [],
  },
  {
    id: 'e3',
    name: 'Javier Marin',
    category: 'Associate',
    status: 'Disponible',
    isBlocked: false,
    training: [
      {
        id: 't3',
        courseName: 'Metodología Agile & Gestión Scrum',
        progress: 100,
        certification: 'NFQ-AGL',
        estimatedCompletion: '2026-05-20',
      },
    ],
    tasks: [],
  },
  {
    id: 'e4',
    name: 'Elena Torres',
    category: 'Manager',
    status: 'Propuesto',
    isBlocked: true,
    training: [],
    tasks: [],
  },
  {
    id: 'e5',
    name: 'Miguel Santos',
    category: 'Senior Consultant',
    status: 'Disponible',
    isBlocked: false,
    training: [
      {
        id: 't4',
        courseName: 'Estructura de Mercados Financieros Mayoristas',
        progress: 20,
        certification: 'NFQ-FIN',
        estimatedCompletion: '2026-11-10',
      },
    ],
    tasks: [],
  },
  {
    id: 'e6',
    name: 'Sofia Castro',
    category: 'Consultant',
    status: 'Disponible',
    isBlocked: false,
    training: [],
    tasks: [],
  },
  {
    id: 'e7',
    name: 'David Navarro',
    category: 'Associate',
    status: 'Asignado',
    isBlocked: true,
    training: [],
    tasks: [],
  },
  {
    id: 'e8',
    name: 'Ana Herrero',
    category: 'Analyst',
    status: 'Disponible',
    isBlocked: false,
    training: [],
    tasks: [],
  },
];

// 2. PROYECTOS EXCLUSIVOS DE SANTANDER CIB
export const initialProjects: Project[] = [
  {
    id: 'p1',
    client: 'Santander CIB',
    projectName: 'Migración Cloud Mayorista',
    status: 'Open',
    roleRequired: 'Senior Consultant',
    skills: ['AWS', 'Python', 'SQL Avanzado'],
    proposedCandidates: [{ employeeId: 'e2', stage: 'En entrevista' }],
  },
  {
    id: 'p2',
    client: 'Santander CIB',
    projectName: 'Motor de Riesgos Basilea',
    status: 'Open',
    roleRequired: 'Manager',
    skills: ['Riesgos CIB', 'Python', 'Basilea IV'],
    proposedCandidates: [
      { employeeId: 'e4', stage: 'Presentado como propuesta' },
    ],
  },
  {
    id: 'p3',
    client: 'Santander CIB',
    projectName: 'Streaming Market Data',
    status: 'Open',
    roleRequired: 'Consultant',
    skills: ['Apache Kafka', 'Java', 'SQL Avanzado'],
    proposedCandidates: [],
  },
  {
    id: 'p4',
    client: 'Santander CIB',
    projectName: 'Plataforma Tesorería Corporativa',
    status: 'Open',
    roleRequired: 'Associate',
    skills: ['UX/UI Figma', 'Agile/Scrum', 'Design Thinking'],
    proposedCandidates: [{ employeeId: 'e7', stage: 'Asignado' }],
  },
  {
    id: 'p5',
    client: 'Santander CIB',
    projectName: 'Automatización de Procesos RPA',
    status: 'Open',
    roleRequired: 'Analyst',
    skills: ['Análisis BPA', 'Python', 'Presentación Stakeholders'],
    proposedCandidates: [],
  },
];

export const initialBenchTasks: BenchTask[] = [
  {
    id: 'bt1',
    title: 'Refactorización Script SQL',
    description:
      'Necesitamos optimizar una query que tarda demasiado en el entorno de preproducción del Santander.',
    requestedBy: 'Inés Abadía',
    status: 'Open',
  },
  {
    id: 'bt2',
    title: 'Maquetación PPT Comité',
    description:
      'Dar formato corporativo a la presentación mensual de resultados para el comité de dirección.',
    requestedBy: 'Inés Abadía',
    status: 'Assigned',
    assignedToName: 'Javier Marin',
  },
  {
    id: 'bt3',
    title: 'Análisis de logs Kafka',
    description:
      'Revisar los eventos huérfanos del último despliegue en el nodo de mercados.',
    requestedBy: 'Inés Abadía',
    status: 'Open',
  },
];
