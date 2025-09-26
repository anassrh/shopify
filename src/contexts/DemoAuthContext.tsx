'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface DemoAuthContextType {
  user: DemoUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

export const useDemoAuth = () => {
  const context = useContext(DemoAuthContext);
  if (context === undefined) {
    throw new Error('useDemoAuth doit être utilisé dans un DemoAuthProvider');
  }
  return context;
};

export const DemoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('demo-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Simuler un délai de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Vérifier les identifiants (simulation)
      if (email === 'admin@ninja.com' && password === 'admin123') {
        const userData: DemoUser = {
          id: '1',
          email: 'admin@ninja.com',
          name: 'Admin Ninja',
          role: 'admin'
        };
        
        setUser(userData);
        if (typeof window !== 'undefined') {
          localStorage.setItem('demo-user', JSON.stringify(userData));
        }
        
        return { error: null };
      } else if (email === 'user@ninja.com' && password === 'user123') {
        const userData: DemoUser = {
          id: '2',
          email: 'user@ninja.com',
          name: 'Utilisateur Test',
          role: 'user'
        };
        
        setUser(userData);
        if (typeof window !== 'undefined') {
          localStorage.setItem('demo-user', JSON.stringify(userData));
        }
        
        return { error: null };
      } else {
        // Vérifier si l'utilisateur existe dans le localStorage
        const savedUsers = localStorage.getItem('demo-users') || '[]';
        const users = JSON.parse(savedUsers);
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        
        if (foundUser) {
          const userData: DemoUser = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role
          };
          
          setUser(userData);
          if (typeof window !== 'undefined') {
            localStorage.setItem('demo-user', JSON.stringify(userData));
          }
          
          return { error: null };
        } else {
          return { error: new Error('Email ou mot de passe incorrect') };
        }
      }
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Simuler un délai d'inscription
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Vérifier si l'email existe déjà
      const savedUsers = localStorage.getItem('demo-users') || '[]';
      const users = JSON.parse(savedUsers);
      
      if (users.find((u: any) => u.email === email)) {
        return { error: new Error('Cet email est déjà utilisé') };
      }

      // Créer un nouvel utilisateur
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        role: 'user'
      };

      users.push(newUser);
      localStorage.setItem('demo-users', JSON.stringify(users));

      // Connecter automatiquement l'utilisateur
      const userData: DemoUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      };

      setUser(userData);
      localStorage.setItem('demo-user', JSON.stringify(userData));

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo-user');
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>;
};
