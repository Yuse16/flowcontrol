"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { EmployeeTable } from '@/components/manager/EmployeeTable';
import { TaskAssignmentModal } from '@/components/manager/TaskAssignmentModal';
import { TeamActivityFeed } from '@/components/manager/TeamActivityFeed';
import { StatWidget } from '@/components/dashboard/StatWidget';
import { Users, AlertTriangle, Briefcase, TrendingUp } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function ManagerPage() {
  const { isManager, users, isLoaded } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-uzala-purple border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isManager) {
    redirect('/dashboard');
  }

  const handleAssignTask = (userId: string) => {
    setSelectedUser(userId);
    setIsModalOpen(true);
  };

  const handleSaveAssignment = (userId: string, title: string, priority: string) => {
    console.log(`Assigned "${title}" [${priority}] to user ${userId}`);
    alert(`¡Tarea asignada con éxito al empleado!`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Panel Gerencial</h1>
          <p className="text-gray-400">Monitorea el rendimiento del equipo y asigna recursos.</p>
        </div>
        <button 
          onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-primary/20"
        >
          Asignar Nueva Tarea
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget title="Total Empleados" value={users.filter(u => u.role === 'employee').length.toString()} trend="Activos" trendUp={true} icon={<Users size={24} />} colorClass="text-blue-400" />
        <StatWidget title="Productividad Global" value="0%" trend="+0% v. sem" trendUp={true} icon={<TrendingUp size={24} />} colorClass="text-green-500" />
        <StatWidget title="Tareas Abiertas" value="0" trend="-0 hoy" trendUp={true} icon={<Briefcase size={24} />} colorClass="text-purple-400" />
        <StatWidget title="Alertas de Retraso" value="0" trend="Requiere atención" trendUp={false} icon={<AlertTriangle size={24} />} colorClass="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EmployeeTable employees={users} onAssignTask={handleAssignTask} />
        </div>
        <div>
          <TeamActivityFeed />
        </div>
      </div>

      <TaskAssignmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
        preSelectedUserId={selectedUser}
        onAssign={handleSaveAssignment}
      />
    </div>
  );
}
