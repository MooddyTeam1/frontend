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

const USERS_KEY = "fundit:auth:users";
const SESSION_KEY = "fundit:auth:session";

const signupSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상 입력해 주세요."),
  email: z.string().email("올바른 이메일을 입력해 주세요."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

const loginSchema = signupSchema.pick({ email: true, password: true });

const createId = () => `user_${Math.random().toString(36).slice(2, 10)}`;

const encodeBase64 = (input: string) => {
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(input);
  }
  const globalBuffer = (globalThis as { Buffer?: typeof Buffer }).Buffer;
  if (globalBuffer) {
    return globalBuffer.from(input, "utf-8").toString("base64");
  }
  return input;
};

const decodeBase64Url = (input: string) => {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const decode =
    (typeof window !== "undefined" ? window.atob : (globalThis as { atob?: typeof atob }).atob) ??
    ((value: string) => Buffer.from(value, "base64").toString("binary"));
  return decode(normalized);
};

const hashPassword = (email: string, password: string) =>
  encodeBase64(`${email}:${password}`);

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

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

const writeUsers = (users: StoredUser[]) => {
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

const writeSession = (user: AuthUser | null) => {
  if (!isBrowser()) return;
  if (!user) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

const decodeGoogleCredential = (credential: string) => {
  try {
    const [, payload] = credential.split(".");
    if (!payload) return null;
    const binary = decodeBase64Url(payload);
    const json = decodeURIComponent(
      Array.from(binary)
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(json) as {
      sub: string;
      email?: string;
      name?: string;
      picture?: string;
    };
  } catch (error) {
    console.warn("Failed to decode Google credential", error);
    return null;
  }
};

const upsertUser = (user: StoredUser) => {
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
  getSession: () => readSession(),
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
  logout: () => {
    writeSession(null);
  },
};
