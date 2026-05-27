import React from 'react';
import { useStaff } from '../StaffContext';
import {
  Users,
  Briefcase,
  UserCheck,
  TrendingUp,
  AlertCircle,
  Code,
} from 'lucide-react';

export const Dashboard = () => {
  const { employees, projects } = useStaff();

  const totalStaff = employees.length;
  const availableStaff = employees.filter(
    (e) => e.status === 'Disponible'
  ).length;
  const assignedStaff = employees.filter((e) => e.status === 'Asignado').length;
  const inProcess = employees.filter(
    (e) => e.status === 'En entrevista' || e.status === 'Propuesto'
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total Staff
            </p>
            <p className="text-2xl font-black text-slate-800">{totalStaff}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Disponibles
            </p>
            <p className="text-2xl font-black text-slate-800">
              {availableStaff}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Asignados
            </p>
            <p className="text-2xl font-black text-slate-800">
              {assignedStaff}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              En Pipeline
            </p>
            <p className="text-2xl font-black text-slate-800">{inProcess}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <Briefcase className="text-red-600" size={20} />
          <h3 className="font-bold text-slate-800 text-lg">
            Proyectos Activos & Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(projects || []).map((project) => (
            <div
              key={project.id}
              className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 hover:bg-white transition-colors hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {project.projectName}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {project.client} —{' '}
                    <span className="text-slate-700">
                      {project.roleRequired}
                    </span>
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded text-[9px] font-bold uppercase tracking-wider">
                  {project.status}
                </span>
              </div>

              <div className="mb-4 flex flex-wrap gap-1.5">
                {(project.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded text-[9px] font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Code size={10} className="text-red-500" /> {skill}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                  <Users size={12} /> Candidatos en proceso:
                </p>

                {(project.proposedCandidates || []).length === 0 ? (
                  <div className="p-3 bg-slate-100/50 rounded-lg flex items-center gap-2 text-slate-400">
                    <AlertCircle size={14} />
                    <p className="text-[11px] font-medium italic">
                      No hay perfiles propuestos aún.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(project.proposedCandidates || []).map((cand, idx) => {
                      const emp = employees.find(
                        (e) => e.id === cand.employeeId
                      );
                      let badgeColor =
                        'bg-amber-100 text-amber-700 border-amber-200';
                      if (cand.stage === 'Asignado')
                        badgeColor =
                          'bg-emerald-100 text-emerald-700 border-emerald-200';
                      if (cand.stage === 'Rechazado')
                        badgeColor = 'bg-red-100 text-red-700 border-red-200';

                      return (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm"
                        >
                          <span className="text-[11px] font-bold text-slate-700">
                            {emp?.name || 'Usuario eliminado'}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badgeColor}`}
                          >
                            {cand.stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
