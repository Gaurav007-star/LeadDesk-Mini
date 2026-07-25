import { useState, useEffect, type ReactNode } from "react";
import api from "@/lib/api";
import { getToken, setToken, removeToken } from "@/lib/auth";
import { AuthContext, type AuthContextType } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        if (!cancelled) setUser(res.data.user);
      } catch {
        if (!cancelled) removeToken();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAuth();
    return () => { cancelled = true; };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
