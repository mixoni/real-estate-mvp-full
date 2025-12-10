'use client';

import axios from 'axios';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'ADMIN' | 'AGENT' | 'USER';

type User = {
  id: number;
  email: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  
    const resInterceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          setUser(null);
          setToken(null);
          router.push('/login');
        }
        return Promise.reject(err);
      }
    );
  
    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, [token, router]);
  

  const login = async (email: string, password: string): Promise<User> => {
    const res = await axios.post<{
      user: User;
      accessToken: string;
    }>('http://localhost:4000/auth/login', { email, password });

    setUser(res.data.user);
    setToken(res.data.accessToken);

    return res.data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
