import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("buddy_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // This would be replaced with actual API call in the future
      // For now just simulate a login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      if (email === "demo@example.com" && password === "password") {
        const userData: User = {
          id: "1",
          name: "Demo User",
          email: "demo@example.com",
          avatar: "https://ui-avatars.com/api/?name=Demo+User&background=random",
        };
        
        setUser(userData);
        localStorage.setItem("buddy_user", JSON.stringify(userData));
        toast.success("Logged in successfully");
        return;
      }
      
      throw new Error("Invalid credentials");
    } catch (error) {
      toast.error("Login failed: Invalid email or password");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // This would be replaced with actual API call in the future
      // For now just simulate a signup delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      };
      
      setUser(userData);
      localStorage.setItem("buddy_user", JSON.stringify(userData));
      toast.success("Account created successfully");
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("buddy_user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
