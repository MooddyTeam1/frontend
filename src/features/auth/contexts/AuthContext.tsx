import React from "react";
import { authService, type AuthUser } from "../api/authService";

type Credentials = {
  email: string;
  password: string;
};

type SignupPayload = Credentials & {
  name: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: Credentials) => Promise<AuthUser>;
  signup: (payload: SignupPayload) => Promise<AuthUser>;
  loginWithGoogle: (credential: string) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const session = authService.getSession();
    setUser(session);
    setLoading(false);
  }, []);

  const withGuard = <T,>(fn: () => T): Promise<T> => {
    try {
      const result = fn();
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(
        error instanceof Error ? error : new Error("요청 처리 중 문제가 발생했습니다.")
      );
    }
  };

  const login = React.useCallback(
    (credentials: Credentials) =>
      withGuard(() => {
        const nextUser = authService.login(credentials);
        setUser(nextUser);
        return nextUser;
      }),
    []
  );

  const signup = React.useCallback(
    (payload: SignupPayload) =>
      withGuard(() => {
        const nextUser = authService.signup(payload);
        setUser(nextUser);
        return nextUser;
      }),
    []
  );

  const loginWithGoogle = React.useCallback(
    (credential: string) =>
      withGuard(() => {
        const nextUser = authService.loginWithGoogle({ credential });
        setUser(nextUser);
        return nextUser;
      }),
    []
  );

  const logout = React.useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      signup,
      loginWithGoogle,
      logout,
    }),
    [user, loading, login, signup, loginWithGoogle, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};
