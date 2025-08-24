'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  credits: number;
  created_at: string;
  last_login: string;
  is_active: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  deductCredits: (amount: number) => Promise<boolean>;
  updateCredits: (newCredits: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data when session changes
  useEffect(() => {
    if (status === 'authenticated' && session?.idToken) {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      setUser(null);
      setLoading(false);
    }
  }, [status, session?.idToken]);

  const fetchUserData = async () => {
    if (!session?.idToken) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/api/users/profile/', {
        headers: {
          'Authorization': `Bearer ${session.idToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      } else {
        setError(data.error || 'Failed to fetch user data');
      }
    } catch (err) {
      setError('Failed to fetch user data');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUserData();
  };

  const deductCredits = async (amount: number): Promise<boolean> => {
    if (!user || !session?.idToken) return false;
    
    try {
      const response = await fetch('http://localhost:8000/api/users/deduct-credits/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          description: 'Requirement generation'
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        return true;
      } else {
        setError(data.error || 'Failed to deduct credits');
        return false;
      }
    } catch (err) {
      setError('Failed to deduct credits');
      console.error('Error deducting credits:', err);
      return false;
    }
  };

  const updateCredits = (newCredits: number) => {
    if (user) {
      setUser({ ...user, credits: newCredits });
    }
  };

  const value: UserContextType = {
    user,
    loading,
    error,
    refreshUser,
    deductCredits,
    updateCredits,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
