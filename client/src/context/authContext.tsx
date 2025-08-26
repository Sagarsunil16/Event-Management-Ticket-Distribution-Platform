import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: string;
  role: 'attendee' | 'organizer';
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  role: string | null;
  setRole: (role: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  role: null,
  setRole: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const storedToken = localStorage.getItem('token');


  let initialRole: string | null = null;
  if (storedToken) {
    try {
      const decoded = jwtDecode<JwtPayload>(storedToken);
      initialRole = decoded.role;
    } catch {
      initialRole = null;
    }
  }

  const [token, setTokenState] = useState<string | null>(storedToken);
  const [role, setRoleState] = useState<string | null>(initialRole);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setRoleState(decoded.role);
      } catch {
        setRoleState(null);
      }
    } else {
      localStorage.removeItem('token');
      setRoleState(null);
    }
  }, [token]);

  const setToken = (tok: string | null) => {
    setTokenState(tok);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, role, setRole: setRoleState }}>
      {children}
    </AuthContext.Provider>
  );
};
