import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  demoAccounts: any[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, location?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (selectedUser: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [demoAccounts, setDemoAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load demo accounts from API
  useEffect(() => {
    fetch('/api/auth/demo-accounts')
      .then(res => res.json())
      .then(data => {
        if (data.demoAccounts) {
          setDemoAccounts(data.demoAccounts);
          // Check saved session or default to first demo user (Aarav Sharma) if nothing stored
          const savedUser = localStorage.getItem('ccap_user');
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              setUser(data.demoAccounts[1] || data.demoAccounts[0]);
            }
          } else if (data.demoAccounts.length > 1) {
            // Default to Citizen user for quick presentation
            setUser(data.demoAccounts[1]);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load demo accounts:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser(data.user);
      localStorage.setItem('ccap_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server network error' };
    }
  };

  const register = async (name: string, email: string, password: string, location?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, location }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      localStorage.setItem('ccap_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server network error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ccap_user');
  };

  const switchUser = (selectedUser: User) => {
    setUser(selectedUser);
    localStorage.setItem('ccap_user', JSON.stringify(selectedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        demoAccounts,
        login,
        register,
        logout,
        switchUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
