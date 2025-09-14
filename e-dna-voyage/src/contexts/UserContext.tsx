import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'researcher' | 'student' | 'institution' | 'admin';
  institution?: string;
  location?: string;
  bio?: string;
  publications?: string;
  citations?: string;
  createdProjects?: string;
  countries?: string;
  recentDiscoveries?: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

interface UserContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load user data from localStorage on initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('e-dna-user');
      const savedAuth = localStorage.getItem('e-dna-auth');
      
      if (savedUser && savedAuth) {
        try {
          const user = JSON.parse(savedUser);
          const isAuthenticated = JSON.parse(savedAuth);
          
          if (isAuthenticated && user) {
            setAuthState({
              isAuthenticated: true,
              user,
              isLoading: false
            });
          } else {
            setAuthState({
              isAuthenticated: false,
              user: null,
              isLoading: false
            });
            setShowAuthModal(true);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false
          });
          setShowAuthModal(true);
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false
        });
        setShowAuthModal(true);
      }
    }
  }, []);

  // Save user data to localStorage whenever auth state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (authState.isAuthenticated && authState.user) {
        localStorage.setItem('e-dna-user', JSON.stringify(authState.user));
        localStorage.setItem('e-dna-auth', JSON.stringify(true));
      } else {
        localStorage.removeItem('e-dna-user');
        localStorage.removeItem('e-dna-auth');
      }
    }
  }, [authState]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage (simulating database)
      const existingUsers = JSON.parse(localStorage.getItem('e-dna-users') || '[]');
      const user = existingUsers.find((u: User) => u.email === email);
      
      if (user) {
        setAuthState({
          isAuthenticated: true,
          user: {
            ...user,
            lastLogin: new Date().toISOString()
          },
          isLoading: false
        });
        setShowAuthModal(false);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('e-dna-users') || '[]');
      const userExists = existingUsers.some((u: User) => u.email === userData.email);
      
      if (userExists) {
        return false;
      }
      
      // Create new user
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      // Save to localStorage (simulating database)
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('e-dna-users', JSON.stringify(updatedUsers));
      
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        isLoading: false
      });
      setShowAuthModal(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
    setShowAuthModal(true);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
      
      // Update in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('e-dna-users') || '[]');
      const updatedUsers = existingUsers.map((u: User) => 
        u.id === authState.user!.id ? updatedUser : u
      );
      localStorage.setItem('e-dna-users', JSON.stringify(updatedUsers));
    }
  };

  const value: UserContextType = {
    ...authState,
    login,
    signup,
    logout,
    updateProfile,
    showAuthModal,
    setShowAuthModal
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
