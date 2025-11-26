import { create } from "zustand";
import { persist } from "zustand/middleware";

// 한글 설명: 테마 타입 정의 (기본, 파스텔톤, 네온)
export type ThemeType = "default" | "pastel" | "neon";

type ThemeColors = {
  // 한글 설명: 주요 색상 팔레트
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
  focus: string;
};

// 한글 설명: 각 테마별 색상 정의
const themePalettes: Record<ThemeType, ThemeColors> = {
  default: {
    // 한글 설명: 기본 테마 - 중성적인 회색 톤
    primary: "#171717", // neutral-900
    secondary: "#525252", // neutral-600
    accent: "#171717", // neutral-900
    background: "#fafafa", // neutral-50
    surface: "#ffffff", // white
    text: "#171717", // neutral-900
    textSecondary: "#525252", // neutral-600
    border: "#e5e5e5", // neutral-200
    hover: "#171717", // neutral-900
    focus: "#171717", // neutral-900
  },
  pastel: {
    // 한글 설명: 파스텔톤 테마 - 부드럽고 따뜻한 색상
    primary: "#a78bfa", // violet-400
    secondary: "#f0abfc", // fuchsia-300
    accent: "#86efac", // green-400
    background: "#fef3c7", // amber-100
    surface: "#ffffff", // white
    text: "#6b21a8", // violet-800
    textSecondary: "#7c3aed", // violet-600
    border: "#e9d5ff", // violet-200
    hover: "#8b5cf6", // violet-500
    focus: "#7c3aed", // violet-600
  },
  neon: {
    // 한글 설명: 네온 테마 - 선명하고 강렬한 색상
    primary: "#00ff88", // neon green
    secondary: "#00d4ff", // neon cyan
    accent: "#ff00ff", // neon magenta
    background: "#0a0a0a", // near black
    surface: "#1a1a1a", // dark gray
    text: "#00ff88", // neon green
    textSecondary: "#00d4ff", // neon cyan
    border: "#00ff88", // neon green
    hover: "#00ff88", // neon green
    focus: "#00ff88", // neon green
  },
};

type ThemeStore = {
  // 한글 설명: 현재 선택된 테마
  theme: ThemeType;
  // 한글 설명: 현재 테마의 색상 팔레트
  colors: ThemeColors;
  // 한글 설명: 테마 변경 액션
  setTheme: (theme: ThemeType) => void;
  // 한글 설명: 테마 색상 가져오기
  getColor: (key: keyof ThemeColors) => string;
};

// 한글 설명: 테마 상태를 관리하는 Zustand store. localStorage에 저장되어 새로고침 후에도 유지됨.
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "default",
      colors: themePalettes.default,

      // 한글 설명: 테마 변경 및 CSS 변수 업데이트
      setTheme: (theme: ThemeType) => {
        const colors = themePalettes[theme];
        set({ theme, colors });
        
        // 한글 설명: CSS 변수를 동적으로 업데이트
        if (typeof document !== "undefined") {
          const root = document.documentElement;
          Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--theme-${key}`, value);
          });
        }
      },

      // 한글 설명: 특정 색상 값 가져오기
      getColor: (key: keyof ThemeColors) => {
        return get().colors[key];
      },
    }),
    {
      name: "moa-theme-storage", // 한글 설명: localStorage 키 이름
      // 한글 설명: 초기화 시 CSS 변수 설정
      onRehydrateStorage: () => {
        return (state) => {
          if (state && typeof document !== "undefined") {
            const root = document.documentElement;
            Object.entries(state.colors).forEach(([key, value]) => {
              root.style.setProperty(`--theme-${key}`, value);
            });
          }
        };
      },
    }
  )
);

// 한글 설명: 앱 초기화 시 테마 적용
if (typeof document !== "undefined") {
  const store = useThemeStore.getState();
  const root = document.documentElement;
  Object.entries(store.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
}

