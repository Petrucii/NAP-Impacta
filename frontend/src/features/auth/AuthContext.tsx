import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_TOKEN_KEY, api, extractApiError } from '@/lib/api';
import type { AdminUser } from '@/types/api';

type AuthState = {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(token));

  useEffect(() => {
    let active = true;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const resp = await api.get<AdminUser>('/auth/me');
        if (active) setUser(resp.data);
      } catch {
        if (active) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const resp = await api.post<{ accessToken: string; expiresIn: number }>('/auth/login', {
        email,
        password,
      });
      localStorage.setItem(AUTH_TOKEN_KEY, resp.data.accessToken);
      setToken(resp.data.accessToken);
    } catch (err) {
      throw extractApiError(err);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setUser(null);
    window.location.href = '/admin/login';
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading, login, logout],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth deve estar dentro de AuthProvider');
  return ctx;
}
