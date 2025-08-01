import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from 'wasp/client/auth';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: async () => {}
});

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return authContext;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: user, isLoading } = useAuth();
  
  const logout = async () => {
    // Implement logout logic if needed
    window.location.href = '/logout';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};