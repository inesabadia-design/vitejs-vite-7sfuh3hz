import React from 'react';
import { useStaff } from '../StaffContext';
import { Award, Calendar, Plus, Minus } from 'lucide-react';

export const TrainingView = ({
  isPortalView = false,
}: {
  isPortalView?: boolean;
}) => {
  const { employees, updateTrainingProgress } = useStaff();

  // El mánager ve a todo el personal con cursos activos
  const staffWithTraining = employees.filter((e) => e.training.length > 0);

  return (
    <div className="space-y-6 text-xs text-slate-700 animate-in fade-in duration-300">
      <div>
        <h1 className="text-base font-bold text-slate-900">
          Formación y Cursos Homologados
        </h1>
        <p className="text-slate-500 text-[11px] mt-0.5">
          Seguimiento de certificaciones estratégicas para requerimientos de
          Santander CIB.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staffWithTraining.map((emp) => (
          <div
            key={emp.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-xs">{emp.name}</h3>
                <span className="text-[10px] uppercase font-mono text-slate-400">
                  {emp.category}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 font-bold rounded text-[9px]">
                {emp.profileType}
              </span>
            </div>

            <div className="space-y-4">
              {emp.training.map((course) => {
                // UNIFICADO: Lógica cromática idéntica a la del staff
                let barColor = 'bg-red-500';
                let textLabel = `${course.progress}% de avance`;

                if (course.progress === 100) {
                  barColor = 'bg-emerald-600';
                  textLabel = '¡Completado!';
                } else if (course.progress > 50) {
                  barColor = 'bg-orange-500';
                } else if (course.progress >= 20) {
                  barColor = 'bg-amber-500';
                }

                return (
                  <div
                    key={course.id}
                    className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-800">
                          {course.courseName}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Award size={12} /> Código Certificación:{' '}
                          <span className="font-mono font-bold text-slate-600">
                            {course.certification}
                          </span>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar size={12} /> Límite:{' '}
                        <span className="font-medium text-slate-600">
                          {course.estimatedCompletion}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1 text-[10px] font-medium">
                          <span className="text-slate-400">
                            Progreso oficial:
                          </span>
                          <span
                            className={`font-bold ${
                              course.progress === 100
                                ? 'text-emerald-600'
                                : 'text-slate-700'
                            }`}
                          >
                            {textLabel}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`${barColor} h-full transition-all duration-300`}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 pt-3">
                        <button
                          onClick={() =>
                            updateTrainingProgress(
                              emp.id,
                              course.id,
                              course.progress - 10
                            )
                          }
                          className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-500 transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <button
                          onClick={() =>
                            updateTrainingProgress(
                              emp.id,
                              course.id,
                              course.progress + 10
                            )
                          }
                          className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-500 transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
