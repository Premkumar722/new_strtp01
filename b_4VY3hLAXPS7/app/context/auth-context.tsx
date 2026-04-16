'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  zipcode: string;
  area: string;
  city: string;
  state: string;
  country: string;
  userType: 'buyer' | 'match' | 'sell'; // buyer = just buying, match = matching pets, sell = selling pets
  petProfile?: {
    species: string;
    breed: string;
    age: number;
    month: number;
    gender: string;
    image?: string; // base64 or data URL
  };
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  register: (userData: Partial<User>) => void;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('pet-platform-user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const register = (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      zipcode: userData.zipcode || '',
      area: userData.area || '',
      city: userData.city || '',
      state: userData.state || '',
      country: userData.country || '',
      userType: userData.userType || 'buyer',
      ...(userData.petProfile && { petProfile: userData.petProfile }),
    };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('pet-platform-user', JSON.stringify(newUser));
  };

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('pet-platform-user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('pet-platform-user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('pet-platform-user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
