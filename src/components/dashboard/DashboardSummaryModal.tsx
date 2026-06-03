"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Clock, Calendar, Edit2, Trash2, Package, ClipboardList } from 'lucide-react';
import { Activity } from '@/types/activity';
import { ActivityModal } from '@/components/activities/ActivityModal';

interface DashboardSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  activities: Activity[];
  category: 'scheduled' | 'completed' | 'pending' | 'restock';
  onUpdateActivity: (id: string, updates: Partial<Activity>) => void;
  onDeleteActivity: (id: string) => void;
  onToggleCompletion: (id: string) => void;
}

export function DashboardSummaryModal({
  isOpen,
  onClose,
  title,
  activities,
  category,
  onUpdateActivity,
  onDeleteActivity,
  onToggleCompletion,
}: DashboardSummaryModalProps) {
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const isCompletedView = category === 'completed';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl glass border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${
                  category === 'scheduled' ? 'bg-uzala-purple/20 text-uzala-purple' :
                  category === 'completed' ? 'bg-green-500/20 text-green-400' :
                  category === 'pending' ? 'bg-teal-500/20 text-teal-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {category === 'scheduled' && <Calendar size={24} />}
                  {category === 'completed' && <CheckCircle2 size={24} />}
                  {category === 'pending' && <ClipboardList size={24} />}
                  {category === 'restock' && <Package size={24} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{activities.length} elementos en total</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {activities.length > 0 ? (
                activities.map((activity, idx) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`group flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      activity.estado === 'completado' 
                        ? 'bg-white/[0.02] border border-white/5' 
                        : 'glass bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {!isCompletedView && (
                      <button
                        onClick={() => onToggleCompletion(activity.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          activity.estado === 'completado'
                            ? 'bg-uzala-purple border-uzala-purple text-white'
                            : 'border-white/20 hover:border-uzala-purple text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold truncate ${activity.estado === 'completado' ? 'text-gray-500 line-through' : 'text-white'}`}>
                          {activity.titulo || activity.title}
                        </h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                          activity.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                          activity.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          activity.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-teal-500/20 text-teal-400'
                        }`}>
                          {activity.priority === 'urgent' ? 'Crítica' : activity.priority}
                        </span>
                      </div>
                      
                      {isCompletedView ? (
                        <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                          <span className="flex items-center gap-1 text-green-500/80">
                            <CheckCircle2 size={10} /> 
                            Completado: {activity.fechaCompletado ? new Date(activity.fechaCompletado).toLocaleDateString() : 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> 
                            Hora: {activity.fechaCompletado ? new Date(activity.fechaCompletado).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {activity.descripcion || activity.description || 'Sin descripción'}
                        </p>
                      )}
                    </div>

                    {!isCompletedView && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingActivity(activity)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteActivity(activity.id)}
                          className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600 mb-4">
                    {category === 'scheduled' && <Calendar size={32} />}
                    {category === 'completed' && <CheckCircle2 size={32} />}
                    {category === 'pending' && <ClipboardList size={32} />}
                    {category === 'restock' && <Package size={32} />}
                  </div>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No hay nada que mostrar aquí</p>
                  <p className="text-gray-600 text-xs mt-1">Tu lista está limpia por ahora ✨</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-end">
              <button 
                onClick={onClose}
                className="px-8 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-sm transition-all border border-white/5"
              >
                Cerrar Resumen
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Modal Hooked Up */}
      {editingActivity && (
        <ActivityModal
          isOpen={!!editingActivity}
          onClose={() => setEditingActivity(null)}
          onSave={(data) => {
            onUpdateActivity(editingActivity.id, data);
            setEditingActivity(null);
          }}
          onDelete={() => {
            onDeleteActivity(editingActivity.id);
            setEditingActivity(null);
          }}
          initialData={editingActivity}
        />
      )}
    </AnimatePresence>
  );
}
