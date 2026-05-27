import React from 'react';
import { useStaff } from '../StaffContext';
import { Briefcase, User, ShieldCheck, AlertCircle } from 'lucide-react';

export const ProjectAssignments = () => {
  const { projects, employees } = useStaff();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-base font-bold text-slate-800">
          Mapeo de Asignaciones Bancarias
        </h3>
        <p className="text-slate-500 text-xs mt-0.5">
          Cuadrante operativo de recursos integrados en proyectos de clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(projects || []).map((project) => {
          const assignedTeam = (project.proposedCandidates || [])
            .filter((c) => c.stage === 'Asignado')
            .map((c) => (employees || []).find((e) => e.id === c.employeeId))
            .filter(Boolean);

          return (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Briefcase size={16} className="text-red-500" />{' '}
                    {project.projectName}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Cliente Cuenta: {project.client}
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border rounded font-mono font-bold text-[9px]">
                  {project.roleRequired}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Equipo In-Situ Asignado:
                </p>
                {assignedTeam.length === 0 ? (
                  <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-800 font-medium text-[11px]">
                    <AlertCircle size={14} className="shrink-0" />
                    Puesto vacante. Pendiente de cerrar proceso en el Pipeline.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assignedTeam.map((emp: any) => (
                      <div
                        key={emp.id}
                        className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-emerald-600" />
                          <span className="font-bold text-slate-800 text-[11px]">
                            {emp.name}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <ShieldCheck size={10} /> Activo en Cuenta
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
