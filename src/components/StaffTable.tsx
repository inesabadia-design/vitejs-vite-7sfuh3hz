import React from 'react';
import { useStaff } from '../StaffContext';
import { User, Award, GraduationCap, Circle } from 'lucide-react';

export const StaffTable = () => {
  const { employees, updateEmployeeStatus } = useStaff();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-base font-bold text-slate-800">
          Directorio General de Staff
        </h3>
        <p className="text-slate-500 text-xs mt-0.5">
          Fichas de cualificación y monitorización de disponibilidad en tiempo
          real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(employees || []).map((emp) => {
          const totalCourses = (emp.training || []).length;
          const completedCourses = (emp.training || []).filter(
            (t) => t.progress === 100
          ).length;

          return (
            <div
              key={emp.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                    {emp.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {emp.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {emp.category}
                    </p>
                  </div>
                </div>

                <select
                  value={emp.status}
                  onChange={(e) =>
                    updateEmployeeStatus(emp.id, e.target.value as any)
                  }
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer tracking-wider uppercase ${
                    emp.status === 'Disponible'
                      ? 'bg-teal-50 border-teal-200 text-teal-700'
                      : emp.status === 'Asignado'
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En entrevista">En entrevista</option>
                  <option value="Propuesto">Propuesto</option>
                  <option value="Asignado">Asignado</option>
                </select>
              </div>

              {/* Indicadores de Estudio */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5 font-medium text-slate-500">
                  <GraduationCap size={14} className="text-slate-400" /> Cursos:{' '}
                  <span className="font-bold text-slate-800">
                    {totalCourses}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-500">
                  <Award size={14} className="text-emerald-500" /> Logros:{' '}
                  <span className="font-bold text-emerald-700">
                    {completedCourses}
                  </span>
                </div>
              </div>

              {/* Barra de progreso visual si tiene cursos */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Plan de Carrera Activo:
                </p>
                {totalCourses === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">
                    Sin cursos matriculados esta semana
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1">
                    {emp.training.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between gap-2 text-[11px]"
                      >
                        <span className="font-medium text-slate-700 truncate max-w-[150px]">
                          {t.courseName}
                        </span>
                        <span
                          className={`font-mono font-bold text-[10px] ${
                            t.progress === 100
                              ? 'text-emerald-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {t.progress}%
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
