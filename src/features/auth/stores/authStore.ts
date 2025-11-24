// src/features/auth/stores/useAuthStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authService, type AuthUser } from "../api/authService";
import { useSupporterStore } from "../../supporter/stores/supporterStore";

type Credentials = {
  email: string;
  password: string;
};

type SignupPayload = Credentials & {
  name: string;
};

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  // Actions
  login: (credentials: Credentials) => Promise<AuthUser>;
  signup: (payload: SignupPayload) => Promise<AuthUser>;
  loginWithGoogle: (credential: string) => Promise<AuthUser>;
  completeSocialLogin: (tokens: {
    accessToken: string;
    refreshToken?: string | null;
  }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
};

/**
 * ✅ 인증 상태를 관리하는 Zustand store
 * - Redux DevTools와 연동되어 상태/액션을 모니터링 가능
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      // 🧩 앱 시작 시 세션 초기화
      initialize: async () => {
        set({ loading: true });
        try {
          // 👉 여기서 백엔드 `/profile/me` 같은 걸 호출한다고 가정
          const session = await authService.getSession();
          set({
            user: session,
            isAuthenticated: !!session,
            loading: false,
          });
        } catch (e) {
          // 세션 복구 실패하면 그냥 로그아웃 상태로
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },

      // ✉️ 이메일/비밀번호 로그인
      login: async (credentials: Credentials) => {
        try {
          set({ loading: true });
          const nextUser = await authService.login(credentials);
          set({
            user: nextUser,
            isAuthenticated: true,
            loading: false,
          });
          return nextUser;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // 🆕 회원가입
      signup: async (payload: SignupPayload) => {
        try {
          set({ loading: true });
          const nextUser = await authService.signup(payload);
          set({
            user: nextUser,
            isAuthenticated: true,
            loading: false,
          });
          return nextUser;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // 🔐 Google 로그인
      loginWithGoogle: async (credential: string) => {
        try {
          set({ loading: true });
          const nextUser = await authService.loginWithGoogle({ credential });
          set({
            user: nextUser,
            isAuthenticated: true,
            loading: false,
          });
          return nextUser;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // 🔁 소셜 로그인 완료 (리디렉션 방식)
      completeSocialLogin: async ({ accessToken, refreshToken }) => {
        try {
          set({ loading: true });
          authService.persistTokens({ accessToken, refreshToken });
          const session = await authService.getSession();
          if (!session) {
            authService.clearTokens();
            throw new Error("사용자 정보를 불러오지 못했습니다.");
          }
          set({
            user: session,
            isAuthenticated: true,
            loading: false,
          });
          return session;
        } catch (error) {
          authService.clearTokens();
          set({ loading: false });
          throw error;
        }
      },

      // 🚪 로그아웃
      logout: async () => {
        set({ loading: true });
        try {
          await authService.logout();
        } finally {
          useSupporterStore.getState().reset();
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },
    }),
    { name: "auth-store" } // Redux DevTools에 보이는 스토어 이름
  )
);

// 🔍 개발 환경에서 window에 노출해서 콘솔에서 디버깅
if (import.meta.env.DEV) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).authStore = useAuthStore;
}
