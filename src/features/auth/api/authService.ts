import { z } from "zod";

export type AuthProvider = "credentials" | "google";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  imageUrl?: string;
  provider: AuthProvider;
};

type StoredUser = AuthUser & {
  passwordHash?: string;
};

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

type GooglePayload = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
};

const USERS_KEY = "fundit:auth:users";
const SESSION_KEY = "fundit:auth:session";

const signupSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상 입력해 주세요."),
  email: z.string().email("올바른 이메일을 입력해 주세요."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

const loginSchema = signupSchema.pick({ email: true, password: true });

const createId = (): string =>
  `user_${Math.random().toString(36).slice(2, 10)}`;

const isBrowser = (): boolean =>
  typeof window !== "undefined" && !!window.localStorage;

/**
 * 브라우저/전역 환경에서 base64 인코딩
 * (보안 해시가 아니라 데모용이므로, btoa가 없으면 그냥 원본 리턴)
 */
const encodeBase64 = (input: string): string => {
  // 브라우저
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(input);
  }

  // 다른 환경에서 btoa가 있을 경우
  const globalAny = globalThis as any;
  if (typeof globalAny.btoa === "function") {
    return globalAny.btoa(input);
  }

  // 최악의 경우 (로컬 데모용이므로 그대로 리턴)
  return input;
};

/**
 * base64url → 일반 base64 → 디코딩
 */
const decodeBase64Url = (input: string): string => {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");

  // 패딩 보정
  const padded =
    base64.length % 4 === 0
      ? base64
      : base64 + "=".repeat(4 - (base64.length % 4));

  // 브라우저 atob
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    return window.atob(padded);
  }

  // 다른 환경에서 atob가 있을 경우
  const globalAny = globalThis as any;
  if (typeof globalAny.atob === "function") {
    return globalAny.atob(padded);
  }

  // fallback
  return padded;
};

const hashPassword = (email: string, password: string): string =>
  encodeBase64(`${email}:${password}`);

const readUsers = (): StoredUser[] => {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Failed to parse stored users", error);
    return [];
  }
};

const writeUsers = (users: StoredUser[]): void => {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const readSession = (): AuthUser | null => {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthUser;
    return parsed?.id ? parsed : null;
  } catch (error) {
    console.warn("Failed to parse stored session", error);
    return null;
  }
};

const writeSession = (user: AuthUser | null): void => {
  if (!isBrowser()) return;
  if (!user) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

/**
 * Google Credential (JWT) payload 디코딩
 */
const decodeGoogleCredential = (
  credential: string
): GooglePayload | null => {
  try {
    const [, payload] = credential.split(".");
    if (!payload) return null;

    const binary = decodeBase64Url(payload);

    const json = decodeURIComponent(
      Array.from(binary)
        .map((char: string) => {
          const hex = char.charCodeAt(0).toString(16).padStart(2, "0");
          return `%${hex}`;
        })
        .join("")
    );

    return JSON.parse(json) as GooglePayload;
  } catch (error) {
    console.warn("Failed to decode Google credential", error);
    return null;
  }
};

const upsertUser = (user: StoredUser): void => {
  const users = readUsers();
  const index = users.findIndex((item) => item.email === user.email);
  if (index >= 0) {
    users[index] = { ...users[index], ...user };
  } else {
    users.push(user);
  }
  writeUsers(users);
};

export const authService = {
  getSession: (): AuthUser | null => readSession(),

  signup: (input: SignupInput): AuthUser => {
    const { name, email, password } = signupSchema.parse(input);
    const users = readUsers();

    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("이미 가입된 이메일입니다.");
    }

    const stored: StoredUser = {
      id: createId(),
      email,
      name,
      provider: "credentials",
      passwordHash: hashPassword(email.toLowerCase(), password),
    };

    users.push(stored);
    writeUsers(users);

    const sessionUser: AuthUser = {
      id: stored.id,
      email: stored.email,
      name: stored.name,
      provider: stored.provider,
    };

    writeSession(sessionUser);
    return sessionUser;
  },

  login: (input: LoginInput): AuthUser => {
    const { email, password } = loginSchema.parse(input);
    const users = readUsers();

    const target = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (!target || target.provider !== "credentials") {
      throw new Error("해당 사용자를 찾을 수 없습니다.");
    }

    const hashed = hashPassword(email.toLowerCase(), password);
    if (target.passwordHash !== hashed) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    const sessionUser: AuthUser = {
      id: target.id,
      email: target.email,
      name: target.name,
      provider: target.provider,
      imageUrl: target.imageUrl,
    };

    writeSession(sessionUser);
    return sessionUser;
  },

  loginWithGoogle: ({ credential }: GoogleCredentialInput): AuthUser => {
    const payload = decodeGoogleCredential(credential);

    if (!payload?.email) {
      throw new Error("구글 로그인 정보를 확인할 수 없습니다.");
    }

    const users = readUsers();

    const existing = users.find(
      (user) => user.email.toLowerCase() === payload.email!.toLowerCase()
    );

    const stored: StoredUser = existing
      ? {
          ...existing,
          name: existing.name ?? payload.name,
          imageUrl: payload.picture ?? existing.imageUrl,
          provider: "google",
        }
      : {
          id: createId(),
          email: payload.email,
          name: payload.name,
          imageUrl: payload.picture,
          provider: "google",
        };

    upsertUser(stored);

    const sessionUser: AuthUser = {
      id: stored.id,
      email: stored.email,
      name: stored.name,
      imageUrl: stored.imageUrl,
      provider: stored.provider,
    };

    writeSession(sessionUser);
    return sessionUser;
  },

  logout: (): void => {
    writeSession(null);
  },
};
