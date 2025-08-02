import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  userType: 'student' | 'startup';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, userType: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const authToken = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');

    if (authToken && userEmail && userType) {
      setUser({
        email: userEmail,
        userType: userType as 'student' | 'startup'
      });
    }
  }, []);

  const login = (email: string, userType: string) => {
    const userData = {
      email,
      userType: userType as 'student' | 'startup'
    };
    setUser(userData);
    localStorage.setItem('authToken', 'demo-token');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userType', userType);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 