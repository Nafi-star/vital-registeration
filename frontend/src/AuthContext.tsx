import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi, initApiAuth, setApiAuthToken, getApiAuthToken } from './api';

type AuthContextValue = {
  adminUsername: string | null;
  isAdmin: boolean;
  ready: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const logout = useCallback(() => {
    setApiAuthToken(null);
    setAdminUsername(null);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    setApiAuthToken(res.access_token);
    setAdminUsername(res.username);
  }, []);

  useEffect(() => {
    initApiAuth();
    const token = getApiAuthToken();
    if (!token) {
      setReady(true);
      return;
    }
    authApi
      .me()
      .then((m) => setAdminUsername(m.username))
      .catch(() => {
        setApiAuthToken(null);
        setAdminUsername(null);
      })
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(
    () => ({
      adminUsername,
      isAdmin: Boolean(adminUsername),
      ready,
      login,
      logout,
    }),
    [adminUsername, ready, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
