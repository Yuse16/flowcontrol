import { User } from '@/types/user';
import { MoreHorizontal, AlertCircle } from 'lucide-react';

interface EmployeeTableProps {
  employees: User[];
  onAssignTask: (userId: string) => void;
}

const getMockStats = (id: string) => {
  const hash = parseInt(id) * 17;
  const total = (hash % 15) + 5;
  const completed = (hash % total);
  const delayed = (hash % 3) === 0 ? 1 : 0;
  return { total, completed, delayed, progress: Math.round((completed/total)*100) };
};

export function EmployeeTable({ employees, onAssignTask }: EmployeeTableProps) {
  return (
    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Rendimiento del Equipo</h3>
        <button className="text-sm text-gray-400 hover:text-white transition-colors">Ver todos</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
              <th className="p-4 font-medium">Empleado</th>
              <th className="p-4 font-medium">Departamento</th>
              <th className="p-4 font-medium">Progreso</th>
              <th className="p-4 font-medium text-center">Estado</th>
              <th className="p-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {employees.filter(e => e.role === 'employee').map(emp => {
              const stats = getMockStats(emp.id);
              return (
                <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary/20">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{emp.name}</p>
                        <p className="text-xs text-gray-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">{emp.department}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${stats.progress}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{stats.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {stats.delayed > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        <AlertCircle size={12} /> {stats.delayed} Atrasadas
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        Al día
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onAssignTask(emp.id)}
                      className="text-xs font-medium text-primary hover:text-white px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors mr-2 opacity-0 group-hover:opacity-100"
                    >
                      Asignar Tarea
                    </button>
                    <button className="text-gray-500 hover:text-white transition-colors p-1">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
