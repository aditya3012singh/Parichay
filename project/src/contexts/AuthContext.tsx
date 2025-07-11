import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { apiService } from '../services/api'; // Adjust path if needed
import { User } from '../types'; // Make sure your User type is correctly defined

// Updated interface to include setUser
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void; // ✅ Included setUser
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    phone: string,
    role: 'USER' | 'PROVIDER' | 'ADMIN'
  ) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // 🔐 Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiService.signin(email, password);
      if (res.jwt && res.user) {
        localStorage.setItem('token', res.jwt);
        localStorage.setItem('user', JSON.stringify(res.user));
        setUser(res.user);
        return true;
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
    return false;
  };

  // 🧾 Signup
  const signup = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    role: 'USER' | 'PROVIDER' | 'ADMIN'
  ): Promise<boolean> => {
    try {
      const res = await apiService.signup({ name, email, password, phone, role });
      if (res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        setUser(res.user);
        return true;
      }
    } catch (err) {
      console.error('Signup failed:', err);
    }
    return false;
  };

  // 🔓 Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
