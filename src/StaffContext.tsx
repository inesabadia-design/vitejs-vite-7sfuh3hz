import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Employee,
  Project,
  StaffStatus,
  Training,
  BenchTask,
} from './mockData';
import {
  initialEmployees,
  initialProjects,
  initialBenchTasks,
} from './mockData';

interface StaffContextType {
  employees: Employee[];
  projects: Project[];
  benchTasks: BenchTask[];
  currentUser: Employee | null;
  isManager: boolean;
  login: (email: string, pass: string, role: 'manager' | 'staff') => boolean;
  logout: () => void;
  updateEmployeeStatus: (id: string, newStatus: StaffStatus) => void;
  addEmployee: (employee: any) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  updateTrainingProgress: (
    employeeId: string,
    trainingId: string,
    progress: number
  ) => void;
  addProject: (project: any) => void;
  updateCandidateStage: (
    projectId: string,
    employeeId: string,
    newStage: any
  ) => void;
  addBenchTask: (task: any) => void;
  claimBenchTask: (taskId: string, employeeName: string) => void;
  enrollInTraining: (
    employeeId: string,
    courseName: string,
    certification: string
  ) => void;
  deleteBenchTask: (id: string) => void;
  dropTraining: (employeeId: string, trainingId: string) => void;
  resetFactoryData: () => void;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const StaffProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('nfq_v3_employees');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((e: any) => ({
        ...e,
        training: e.training || [],
        tasks: e.tasks || [],
      }));
    }
    return initialEmployees;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('nfq_v3_projects');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((p: any) => ({
        ...p,
        proposedCandidates: p.proposedCandidates || [],
        skills: p.skills || [],
      }));
    }
    return initialProjects;
  });

  const [benchTasks, setBenchTasks] = useState<BenchTask[]>(() => {
    const saved = localStorage.getItem('nfq_v3_benchtasks');
    return saved ? JSON.parse(saved) : initialBenchTasks;
  });

  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    localStorage.setItem('nfq_v3_employees', JSON.stringify(employees));
  }, [employees]);
  useEffect(() => {
    localStorage.setItem('nfq_v3_projects', JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem('nfq_v3_benchtasks', JSON.stringify(benchTasks));
  }, [benchTasks]);

  const resetFactoryData = () => {
    localStorage.removeItem('nfq_v3_employees');
    localStorage.removeItem('nfq_v3_projects');
    localStorage.removeItem('nfq_v3_benchtasks');
    setEmployees(initialEmployees);
    setProjects(initialProjects);
    setBenchTasks(initialBenchTasks);
    setCurrentUser(null);
    setIsManager(false);
  };

  const login = (
    email: string,
    pass: string,
    role: 'manager' | 'staff'
  ): boolean => {
    if (pass !== '0000') return false;
    const cleanEmail = email
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (role === 'manager' && cleanEmail === 'ines.abadia@nfq.es') {
      setIsManager(true);
      setCurrentUser(null);
      return true;
    }

    if (role === 'staff') {
      const found = employees.find((e) => {
        const empEmail = e.name
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '.');
        return `${empEmail}@nfq.es` === cleanEmail;
      });
      if (found) {
        setIsManager(false);
        setCurrentUser(found);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsManager(false);
  };

  const getIsBlocked = (status: StaffStatus) => {
    return (
      status === 'En entrevista' ||
      status === 'Propuesto' ||
      status === 'Asignado'
    );
  };

  const updateEmployeeStatus = (id: string, newStatus: StaffStatus) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? { ...emp, status: newStatus, isBlocked: getIsBlocked(newStatus) }
          : emp
      )
    );
  };

  const addEmployee = (empData: any) => {
    const newEmployee: Employee = {
      ...empData,
      id: uuidv4(),
      isBlocked: getIsBlocked(empData.status),
      training: [],
      tasks: [],
    };
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const updated = { ...emp, ...updates };
          if (updates.status) updated.isBlocked = getIsBlocked(updates.status);
          return updated;
        }
        return emp;
      })
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const updateTrainingProgress = (
    employeeId: string,
    trainingId: string,
    progress: number
  ) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? {
              ...emp,
              training: emp.training.map((t) =>
                t.id === trainingId
                  ? { ...t, progress: Math.min(100, Math.max(0, progress)) }
                  : t
              ),
            }
          : emp
      )
    );
  };

  const addProject = (projectData: any) => {
    setProjects((prev) => [
      ...prev,
      { ...projectData, id: uuidv4(), proposedCandidates: [], skills: [] },
    ]);
  };

  const updateCandidateStage = (
    projectId: string,
    employeeId: string,
    newStage: any
  ) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            proposedCandidates: (proj.proposedCandidates || []).map((cand) =>
              cand.employeeId === employeeId
                ? { ...cand, stage: newStage }
                : cand
            ),
          };
        }
        return proj;
      })
    );
    updateEmployeeStatus(employeeId, newStage);
  };

  const addBenchTask = (taskData: any) => {
    setBenchTasks((prev) => [
      ...prev,
      { ...taskData, id: uuidv4(), status: 'Open' },
    ]);
  };

  const claimBenchTask = (taskId: string, employeeName: string) => {
    setBenchTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: 'Assigned', assignedToName: employeeName }
          : task
      )
    );
  };

  const enrollInTraining = (
    employeeId: string,
    courseName: string,
    certification: string
  ) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          if (emp.training.some((t) => t.courseName === courseName)) return emp;
          const newCourse = {
            id: uuidv4(),
            courseName,
            progress: 0,
            certification,
            estimatedCompletion: '2026-10-30',
          };
          return { ...emp, training: [...emp.training, newCourse] };
        }
        return emp;
      })
    );
  };

  const deleteBenchTask = (id: string) => {
    setBenchTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const dropTraining = (employeeId: string, trainingId: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? {
              ...emp,
              training: emp.training.filter((t) => t.id !== trainingId),
            }
          : emp
      )
    );
  };

  return (
    <StaffContext.Provider
      value={{
        employees,
        projects,
        benchTasks,
        currentUser,
        isManager,
        login,
        logout,
        updateEmployeeStatus,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        updateTrainingProgress,
        addProject,
        updateCandidateStage,
        addBenchTask,
        claimBenchTask,
        enrollInTraining,
        deleteBenchTask,
        dropTraining,
        resetFactoryData,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (context === undefined)
    throw new Error('useStaff must be used within a StaffProvider');
  return context;
};
