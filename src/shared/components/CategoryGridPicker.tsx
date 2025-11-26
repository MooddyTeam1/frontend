import React from "react";
import { type CategoryLabel } from "../utils/categorymapper";

export type CategoryKey = "all" | CategoryLabel;

export interface CategoryOption {
  key: CategoryKey;
  label: string;
  icon: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { key: "all", label: "전체", icon: "🌐" },
  { key: "테크", label: "테크", icon: "💡" },
  { key: "디자인", label: "디자인", icon: "🎨" },
  { key: "푸드", label: "푸드", icon: "🍽️" },
  { key: "패션", label: "패션", icon: "👗" },
  { key: "뷰티", label: "뷰티", icon: "💄" },
  { key: "홈·리빙", label: "홈·리빙", icon: "🏠" },
  { key: "게임", label: "게임", icon: "🎮" },
  { key: "예술", label: "예술", icon: "🖼️" },
  { key: "출판", label: "출판", icon: "📚" },
];

interface CategoryGridPickerProps {
  open: boolean;
  selectedKey?: CategoryKey | null;
  onClose: () => void;
  onSelect: (category: CategoryOption) => void;
}

export const CategoryGridPicker: React.FC<CategoryGridPickerProps> = ({
  open,
  selectedKey,
  onClose,
  onSelect,
}) => {
  if (!open) return null;

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Category</p>
            <h2 className="text-lg font-semibold text-neutral-900">어떤 프로젝트를 둘러볼까요?</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <span className="sr-only">닫기</span>
            ✕
          </button>
        </header>

        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
          {CATEGORY_OPTIONS.map((category) => {
            const active = selectedKey === category.key;
            return (
              <button
                key={category.key}
                type="button"
                onClick={() => {
                  onSelect(category);
                  onClose();
                }}
                className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left text-sm transition ${
                  active
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-900 hover:text-neutral-900"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-lg">
                  <span>{category.icon}</span>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{category.label}</p>
                  {category.key === "all" ? (
                    <p className={`text-xs ${active ? "text-white/80" : "text-neutral-500"}`}>
                      모든 카테고리의 프로젝트를 함께 보여줘요.
                    </p>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          선택한 카테고리는 상단 필터에 표시되며, 나중에 언제든지 변경할 수 있어요.
        </p>
      </div>
    </div>
  );
};

