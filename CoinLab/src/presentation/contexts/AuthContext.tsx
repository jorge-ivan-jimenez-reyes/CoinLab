import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUseCase } from '../../domain/usecases/AuthUseCase';
import { AuthRepository } from '../../infrastructure/api/AuthRepository';
import { User } from '../../domain/entities/User';
import { AuthCredentialsDTO } from '../../domain/entities/DTOs/AuthCredentialsDTO';
import { UserRegistrationDTO } from '../../domain/entities/DTOs/UserRegistrationDTO';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (credentials: AuthCredentialsDTO) => Promise<void>;
  register: (userData: UserRegistrationDTO) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const authRepository = new AuthRepository();
  const authUseCase = new AuthUseCase(authRepository);

  useEffect(() => {
    async function loadUserData() {
      try {
        const currentUser = await authUseCase.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  const login = async (credentials: AuthCredentialsDTO) => {
    try {
      setLoading(true);
      const loggedUser = await authUseCase.login(credentials);
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UserRegistrationDTO) => {
    try {
      setLoading(true);
      const newUser = await authUseCase.register(userData);
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authUseCase.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    await authUseCase.forgotPassword(email);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    await authUseCase.resetPassword(token, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
} 