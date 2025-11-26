import React, { useEffect } from "react";
import { useThemeStore, type ThemeType } from "../stores/themeStore";

// 한글 설명: 테마 선택 UI 컴포넌트
export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  // 한글 설명: 컴포넌트 마운트 시 테마 적용
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  // 한글 설명: 테마 옵션 정의
  const themes: Array<{ value: ThemeType; label: string; description: string }> = [
    {
      value: "default",
      label: "기본",
      description: "중성적인 회색 톤",
    },
    {
      value: "pastel",
      label: "파스텔톤",
      description: "부드럽고 따뜻한 색상",
    },
    {
      value: "neon",
      label: "네온",
      description: "선명하고 강렬한 색상",
    },
  ];

  return (
    <div className="relative">
      {/* 한글 설명: 테마 선택 드롭다운 */}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeType)}
        className="appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2 pr-8 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-2"
        style={{
          backgroundColor: "var(--theme-surface)",
          color: "var(--theme-text)",
          borderColor: "var(--theme-border)",
        }}
      >
        {themes.map((themeOption) => (
          <option key={themeOption.value} value={themeOption.value}>
            {themeOption.label}
          </option>
        ))}
      </select>
      {/* 한글 설명: 드롭다운 화살표 아이콘 */}
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: "var(--theme-textSecondary)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

// 한글 설명: 테마 선택 버튼 그룹 컴포넌트 (라디오 버튼 스타일)
export const ThemeSelectorButtons: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  // 한글 설명: 테마 옵션 정의
  const themes: Array<{ value: ThemeType; label: string; emoji: string }> = [
    { value: "default", label: "기본", emoji: "⚪" },
    { value: "pastel", label: "파스텔톤", emoji: "🌸" },
    { value: "neon", label: "네온", emoji: "💚" },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm" style={{ color: "var(--theme-textSecondary)" }}>
        테마:
      </span>
      <div className="flex gap-1 rounded-lg border p-1" style={{ borderColor: "var(--theme-border)" }}>
        {themes.map((themeOption) => (
          <button
            key={themeOption.value}
            type="button"
            onClick={() => setTheme(themeOption.value)}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-all ${
              theme === themeOption.value
                ? "shadow-sm"
                : "opacity-60 hover:opacity-100"
            }`}
            style={{
              backgroundColor:
                theme === themeOption.value
                  ? "var(--theme-primary)"
                  : "transparent",
              color:
                theme === themeOption.value
                  ? "var(--theme-surface)"
                  : "var(--theme-text)",
            }}
          >
            <span>{themeOption.emoji}</span>
            <span>{themeOption.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

