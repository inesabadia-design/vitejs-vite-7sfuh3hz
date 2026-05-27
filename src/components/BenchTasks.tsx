import React, { useState } from 'react';
import { useStaff } from '../StaffContext';
import { Trash2, Plus, ClipboardList, CheckCircle, Clock } from 'lucide-react';

export const BenchTasks = () => {
  const { benchTasks, addBenchTask, deleteBenchTask } = useStaff();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestedBy, setRequestedBy] = useState('Inés Abadía');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    addBenchTask({ title, description, requestedBy });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 text-xs text-slate-700 animate-in fade-in duration-300">
      <div>
        <h1 className="text-base font-bold text-slate-900">
          Gestión de Tareas y Necesidades (Bench)
        </h1>
        <p className="text-slate-500 text-[11px] mt-0.5">
          Lanza solicitudes de apoyo urgentes para que los consultores
          disponibles puedan asumirlas desde su portal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de creación */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit">
          <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b pb-2">
            <Plus size={14} className="text-red-500" /> Crear Nueva Necesidad
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Título de la Tarea
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Maquetación PPT Comité"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-red-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Descripción Detallada
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe los requerimientos y skills que hacen falta..."
                rows={4}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-red-500 font-medium resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Solicitado por (Manager)
              </label>
              <input
                type="text"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-red-500 font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-sm mt-2"
            >
              Publicar en el Bench
            </button>
          </form>
        </div>

        {/* Lista de tareas con botón de papelera */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b pb-2">
            <ClipboardList size={14} className="text-red-500" /> Historial de
            Tareas Activas ({benchTasks.length})
          </h3>

          {benchTasks.length === 0 ? (
            <p className="text-slate-400 italic p-4 text-center">
              No hay ninguna tarea publicada en el Bench actualmente.
            </p>
          ) : (
            <div className="space-y-3">
              {benchTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-start gap-4 hover:border-slate-300 transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-xs">
                        {task.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 ${
                          task.status === 'Open'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {task.status === 'Open' ? (
                          <>
                            {' '}
                            <Clock size={10} /> Buscando Ayuda{' '}
                          </>
                        ) : (
                          <>
                            {' '}
                            <CheckCircle size={10} /> En Progreso por{' '}
                            {task.assignedToName}{' '}
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                      {task.description}
                    </p>
                    <div className="text-[10px] text-slate-400">
                      Publicado por:{' '}
                      <span className="font-semibold text-slate-500">
                        {task.requestedBy}
                      </span>
                    </div>
                  </div>

                  {/* ¡EL BOTÓN DE PAPELERA ELIMINADOR AQUÍ! */}
                  <button
                    onClick={() => deleteBenchTask(task.id)}
                    className="p-1.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-600 rounded-lg transition-colors shrink-0 shadow-sm"
                    title="Eliminar tarea de prueba"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
