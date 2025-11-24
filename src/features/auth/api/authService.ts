import { isAxiosError } from "axios";
import { z } from "zod";
import api from "../../../services/api";

// 한글 설명: 인증 공급자 타입 정의
export type AuthProvider = "credentials" | "google";

// 한글 설명: 사용자 역할 타입 정의 (백엔드 ENUM과 동일하게 관리)
export type UserRole = "USER" | "ADMIN" | "SUPPORTER" | "MAKER";

// 한글 설명: 프론트에서 사용하는 인증 사용자 정보 타입
export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  imageUrl?: string | null;
  provider: AuthProvider;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string | null;
};

type AuthTokenPair = {
  accessToken: string;
  refreshToken?: string | null;
};

// 한글 설명: 회원가입/로그인 입력 타입 정의
type SignupInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type GoogleCredentialInput = {
  credential: string;
};

// 한글 설명: 백엔드에서 내려주는 토큰 응답 타입
type AuthTokenResponse = AuthTokenPair & {
  tokenType?: string;
  expiresIn?: number;
};

// 한글 설명: /profile/me 응답 DTO
type ProfileMeResponse = {
  id: string;
  email: string;
  name?: string | null;
  imageUrl?: string | null;
  provider: AuthProvider;
  role: UserRole;
  createdAt: string;
  updatedAt?: string | null;
};

const ACCESS_TOKEN_STORAGE_KEY = "accessToken";
const REFRESH_TOKEN_STORAGE_KEY = "refreshToken";

const signupSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상 입력해 주세요."),
  email: z.string().email("올바른 이메일을 입력해 주세요."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

const loginSchema = z.object({
  email: z.string().email("올바른 이메일을 입력해 주세요."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

// 한글 설명: 브라우저 환경 여부 체크
const isBrowser = (): boolean =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

// 한글 설명: 토큰을 localStorage에 저장
const persistTokensToStorage = ({ accessToken, refreshToken }: AuthTokenPair) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
};

// 한글 설명: 저장된 토큰 제거
const clearTokensInStorage = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
};

// 한글 설명: 저장된 액세스 토큰 조회
const getStoredAccessToken = (): string | null => {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

// 한글 설명: 백엔드 오류를 사용자 친화적인 메시지로 변환
const toReadableError = (error: unknown): Error => {
  if (isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message;
    return new Error(message ?? "인증 요청 처리 중 오류가 발생했습니다.");
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error("알 수 없는 오류가 발생했습니다.");
};

// 한글 설명: /profile/me 결과를 프론트 AuthUser 형태로 변환
const normalizeProfile = (profile: ProfileMeResponse): AuthUser => ({
  id: profile.id,
  email: profile.email,
  name: profile.name ?? null,
  imageUrl: profile.imageUrl ?? null,
  provider: profile.provider,
  role: profile.role,
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt ?? null,
});

// 한글 설명: 현재 로그인한 사용자 정보를 조회
const fetchMyProfile = async (): Promise<AuthUser> => {
  try {
    const { data } = await api.get<ProfileMeResponse>("/profile/me");
    console.log("[authService] GET /profile/me 응답", data);
    return normalizeProfile(data);
  } catch (error) {
    throw toReadableError(error);
  }
};

export const authService = {
  // 한글 설명: 토큰 직접 저장/삭제 유틸 제공 (소셜 로그인 콜백 등에서 사용)
  persistTokens: (tokens: AuthTokenPair) => persistTokensToStorage(tokens),
  clearTokens: () => clearTokensInStorage(),

  // 한글 설명: 저장된 토큰으로 세션 복구 (토큰 없거나 실패 시 null 반환)
  getSession: async (): Promise<AuthUser | null> => {
    const token = getStoredAccessToken();
    if (!token) {
      return null;
    }
    try {
      return await fetchMyProfile();
    } catch (error) {
      clearTokensInStorage();
      console.warn("세션 복구 실패:", error);
      return null;
    }
  },

  // 한글 설명: 회원가입 → 토큰 저장 → 프로필 조회
  signup: async (input: SignupInput): Promise<AuthUser> => {
    try {
      const payload = signupSchema.parse(input);
      console.log("[authService] POST /auth/signup 요청 본문", payload);
      const { data } = await api.post<AuthTokenResponse>(
        "/auth/signup",
        payload
      );
      console.log("[authService] POST /auth/signup 응답", data);
      persistTokensToStorage(data);
      return await fetchMyProfile();
    } catch (error) {
      throw toReadableError(error);
    }
  },

  // 한글 설명: 로그인 → 토큰 저장 → 프로필 조회
  login: async (input: LoginInput): Promise<AuthUser> => {
    try {
      const payload = loginSchema.parse(input);
      console.log("[authService] POST /auth/login 요청 본문", payload);
      const { data } = await api.post<AuthTokenResponse>(
        "/auth/login",
        payload
      );
      console.log("[authService] POST /auth/login 응답", data);
      persistTokensToStorage(data);
      return await fetchMyProfile();
    } catch (error) {
      throw toReadableError(error);
    }
  },

  // 한글 설명: 구글 로그인 → 토큰 저장 → 프로필 조회
  loginWithGoogle: async ({
    credential,
  }: GoogleCredentialInput): Promise<AuthUser> => {
    try {
      if (!credential) {
        throw new Error("구글 인증 토큰을 전달해 주세요.");
      }
      console.log("[authService] POST /auth/login/google 요청 본문", {
        credentialPreview: `${credential.slice(0, 10)}...`,
      });
      const { data } = await api.post<AuthTokenResponse>(
        "/auth/login/google",
        { credential }
      );
      console.log("[authService] POST /auth/login/google 응답", data);
      persistTokensToStorage(data);
      return await fetchMyProfile();
    } catch (error) {
      throw toReadableError(error);
    }
  },

  // 한글 설명: 로그아웃 → 토큰 제거
  logout: async (): Promise<void> => {
    try {
      console.log("[authService] POST /auth/logout 요청");
      await api.post("/auth/logout");
      console.log("[authService] POST /auth/logout 응답 성공");
    } catch (error) {
      console.warn("로그아웃 API 호출 실패:", error);
    } finally {
      clearTokensInStorage();
    }
  },
};
