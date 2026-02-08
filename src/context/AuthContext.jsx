import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../utils/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(null);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setCurrentRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("currentRole");
  }, []);

  const fetchUserProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/user/profile");
      setUser(response.data);

      if (response.data.role && response.data.role.length > 0) {
        const savedRole = localStorage.getItem("currentRole");
        setCurrentRole(savedRole || response.data.role[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Erreur récupération profil:", error);
      logout();
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const login = async (email, password) => {
    console.log("entative de connexion à:", api.defaults.baseURL);
    console.log("Email:", email);
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      setToken(token);
      localStorage.setItem("token", token);
      setUser(user);

      if (user.role && user.role.length > 0) {
        setCurrentRole(user.role[0]);
        localStorage.setItem("currentRole", user.role[0]);
      }

      return { success: true, user };
    } catch (error) {
      console.error("Erreur connexion:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de connexion",
      };
    }
  };

  const switchRole = (newRole) => {
    if (user?.role?.includes(newRole)) {
      setCurrentRole(newRole);
      localStorage.setItem("currentRole", newRole);
      return true;
    }
    return false;
  };

  const value = {
    user,
    token,
    loading,
    currentRole,
    isAuthenticated: !!user,
    login,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
