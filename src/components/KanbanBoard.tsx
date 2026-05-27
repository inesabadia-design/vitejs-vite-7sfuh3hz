import React from 'react';
import { useStaff } from '../StaffContext';
import { User, ArrowRight } from 'lucide-react';

export const KanbanBoard = () => {
  const { employees, projects, updateCandidateStage } = useStaff();

  const COLUMNS = [
    {
      id: 'Presentado como propuesta',
      title: 'Propuestos',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
    },
    {
      id: 'En entrevista',
      title: 'En Entrevista',
      color: 'bg-amber-50 border-amber-200 text-amber-700',
    },
    {
      id: 'Asignado',
      title: 'Asignados / Cerrados',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    },
    {
      id: 'Rechazado',
      title: 'Desestimados',
      color: 'bg-red-50 border-red-200 text-red-700',
    },
  ];

  const getCardsByColumn = (columnId: string) => {
    const cards: any[] = [];
    (projects || []).forEach((project) => {
      (project.proposedCandidates || []).forEach((cand) => {
        if (cand.stage === columnId) {
          const emp = (employees || []).find((e) => e.id === cand.employeeId);
          cards.push({
            id: cand.employeeId,
            employeeName: emp ? emp.name : 'Consultor Externo',
            category: emp ? emp.category : 'Especialista',
            projectName: project.projectName,
            projectId: project.id,
            client: project.client,
            currentStage: cand.stage,
          });
        }
      });
    });
    return cards;
  };

  const handleMoveStage = (
    projectId: string,
    employeeId: string,
    currentStage: string
  ) => {
    let nextStage: any = 'Rechazado';
    if (currentStage === 'Presentado como propuesta')
      nextStage = 'En entrevista';
    if (currentStage === 'En entrevista') nextStage = 'Asignado';
    if (currentStage === 'Asignado') nextStage = 'Rechazado';
    if (currentStage === 'Rechazado') nextStage = 'Presentado como propuesta';
    updateCandidateStage(projectId, employeeId, nextStage);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-base font-bold text-slate-800">
          Pipeline de Candidatos CIB
        </h3>
        <p className="text-slate-500 text-xs mt-0.5">
          Control evolutivo de los perfiles de Staff propuestos para células del
          Santander.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const cards = getCardsByColumn(col.id);
          return (
            <div
              key={col.id}
              className="bg-slate-100/80 rounded-xl p-4 border border-slate-200 flex flex-col min-h-[500px]"
            >
              <div
                className={`p-2.5 rounded-lg border font-bold text-xs uppercase tracking-wider mb-3 shadow-sm ${col.color} flex justify-between items-center`}
              >
                <span>{col.title}</span>
                <span className="bg-white/60 px-2 py-0.5 rounded-md text-[10px] shadow-sm">
                  {cards.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {cards.length === 0 ? (
                  <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-slate-400 font-medium italic text-[11px] bg-white/40">
                    Sin candidatos
                  </div>
                ) : (
                  cards.map((card, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow"
                    >
                      <div>
                        <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                          <User size={12} className="text-slate-400" />{' '}
                          {card.employeeName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {card.category}
                        </div>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px]">
                        <span className="font-bold text-slate-500 block text-[9px] uppercase tracking-wider">
                          Proyecto Destino:
                        </span>
                        <span className="font-bold text-slate-700">
                          {card.projectName}
                        </span>
                        <span className="text-slate-400 block text-[10px]">
                          {card.client}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          handleMoveStage(
                            card.projectId,
                            card.id,
                            card.currentStage
                          )
                        }
                        className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[10px] rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        Avanzar Etapa{' '}
                        <ArrowRight size={12} className="text-red-500" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
