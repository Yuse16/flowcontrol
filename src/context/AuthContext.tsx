"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types/user';

const STORAGE_KEY = 'uzala_user_profile';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Jorge', email: 'jorge@uzala.app', role: 'manager', department: 'Dirección' },
];

interface AuthContextType {
  currentUser: User;
  users: User[];
  updateProfile: (name: string) => void;
  switchRole: (role: UserRole) => void;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    }
  }, [currentUser, isLoaded]);

  const updateProfile = (name: string) => {
    setCurrentUser(prev => ({ ...prev, name }));
  };

  const switchRole = (role: UserRole) => {
    // Para modo producción con BD real aquí cambiaríamos de sesión
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      users: MOCK_USERS, 
      updateProfile,
      switchRole,
      isManager: currentUser.role === 'manager' || currentUser.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
