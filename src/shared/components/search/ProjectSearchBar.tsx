import React from "react";
import { useNavigate } from "react-router-dom";
import type { CategoryKey } from "../CategoryGridPicker";
import { getSuggestionsForQuery, upsertSearchQuery } from "../../utils/searchCache";
import { CATEGORY_OPTIONS as CATEGORY_LABELS, toCategoryLabel } from "../../utils/categorymapper";

interface ProjectSearchBarProps {
  initialValue: string;
  sort: string;
  category: CategoryKey;
}

// 한글 설명: 의미 없는 검색어(한 글자 자음 모음, 랜덤 영문 등)를 필터링하는 함수
export function isMeaningfulQuery(raw: string): boolean {
  const query = raw.trim();
  if (query.length < 2) return false;

  // 한글 완성형 또는 숫자가 하나라도 포함되어 있으면 의미 있는 검색어로 간주
  if (/[가-힣0-9]/.test(query)) {
    return true;
  }

  // 영문만 있는 경우는 최소 3글자 이상일 때만 허용 (예: as, q, zz 등은 제외)
  if (/^[a-zA-Z]+$/.test(query) && query.length >= 3) {
    return true;
  }

  // 자음/모음만 또는 특수문자만으로 이루어진 경우는 제외
  if (/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(query)) return false;
  if (/^[^a-zA-Z0-9가-힣]+$/.test(query)) return false;

  return false;
}

// 한글 설명: 추천 검색어에서 입력 부분을 <strong> 태그로 감싸는 하이라이트 함수
export function highlightQuery(text: string, query: string): React.ReactNode {
  const trimmed = query.trim();
  if (!trimmed) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmed.toLowerCase();

  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + trimmed.length);
  const after = text.slice(index + trimmed.length);

  return (
    <>
      {before}
      <strong className="font-semibold text-neutral-900">{match}</strong>
      {after}
    </>
  );
}

// 한글 설명: 프로젝트 검색 입력 + 추천 검색어 드롭다운 컴포넌트
export const ProjectSearchBar: React.FC<ProjectSearchBarProps> = ({
  initialValue,
  sort,
  category,
}) => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(initialValue);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);

  // 한글 설명: 입력이 멈췄을 때만 추천 검색어를 갱신하는 디바운스 효과
  React.useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const handler = window.setTimeout(() => {
      if (!isMeaningfulQuery(value)) {
        setSuggestions([]);
        return;
      }

      const next = getSuggestionsForQuery(value);
      setSuggestions(next);
    }, 300); // 300ms 디바운스 (trailing edge)

    return () => window.clearTimeout(handler);
  }, [value]);

  const performSearch = (query: string) => {
    const trimmed = query.trim();

    // 1) 카테고리 직접 입력 매칭은 의미성 검사 이전에 우선 처리
    if (trimmed) {
      const normalizeCat = (s: string) =>
        s
          .normalize("NFC")
          .replace(/\s+/g, "")
          .replace(/[\p{P}\p{S}]/gu, ""); // 구분점/기호 제거 (홈·리빙 등)

      const norm = normalizeCat(trimmed);

      // 1) 한글 라벨 매칭 (공백/구분점 제거 후 일치)
      const labelMap = (CATEGORY_LABELS as readonly string[]).reduce<Record<string, string>>(
        (acc, label) => {
          acc[normalizeCat(label)] = label;
          return acc;
        },
        {}
      );
      const matchedLabel = labelMap[norm];
      if (matchedLabel) {
        const params = new URLSearchParams();
        params.set("sort", sort);
        params.set("category", matchedLabel);
        navigate(`/projects?${params.toString()}`);
        setOpen(false);
        return;
      }

      // 2) 영문 enum/별칭 매칭 (tech/design/food/fashion/beauty/home/homeliving/game/art/publish)
      const code = norm.toUpperCase();
      const enums = [
        "TECH",
        "DESIGN",
        "FOOD",
        "FASHION",
        "BEAUTY",
        "HOME_LIVING",
        "GAME",
        "ART",
        "PUBLISH",
      ] as const;
      const aliases: Record<string, typeof enums[number]> = {
        TECH: "TECH",
        DESIGN: "DESIGN",
        FOOD: "FOOD",
        FASHION: "FASHION",
        BEAUTY: "BEAUTY",
        HOME: "HOME_LIVING",
        HOMELIVING: "HOME_LIVING",
        HOME_LIVING: "HOME_LIVING",
        GAME: "GAME",
        ART: "ART",
        PUBLISH: "PUBLISH",
        BOOK: "PUBLISH",
      };
      const codeKey = aliases[code];
      if (codeKey) {
        const label = toCategoryLabel(codeKey as any);
        const params = new URLSearchParams();
        params.set("sort", sort);
        params.set("category", label);
        navigate(`/projects?${params.toString()}`);
        setOpen(false);
        return;
      }
    }

    if (!trimmed || !isMeaningfulQuery(trimmed)) {
      return;
    }

    // 한글 설명: 검색어를 캐시에 저장하여 이후 추천 목록으로 사용
    upsertSearchQuery(trimmed);

    const params = new URLSearchParams();
    if (trimmed) {
      params.set("search", trimmed);
    }
    params.set("sort", sort);
    if (category !== "all") {
      params.set("category", category);
    }

    navigate(`/projects?${params.toString()}`);
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performSearch(value);
  };

  const handleSuggestionClick = (query: string) => {
    setValue(query);
    performSearch(query);
  };

  const meaningfulSuggestions = suggestions.filter((item) =>
    isMeaningfulQuery(item)
  );

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600"
      >
        <input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="프로젝트 검색 (예: 테크, 푸드, 메이커명 등)"
          className="min-w-0 flex-1 bg-transparent placeholder:text-neutral-400 focus:outline-none"
        />
        <button
          type="submit"
          className="text-neutral-500 hover:text-neutral-900"
        >
          검색
        </button>
      </form>

      {/* 한글 설명: 추천 검색어 드롭다운 */}
      {open && meaningfulSuggestions.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
          <ul className="max-h-64 divide-y divide-neutral-100 text-sm">
            {meaningfulSuggestions.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className="flex w-full items-center justify-between px-4 py-2 text-left text-neutral-700 hover:bg-neutral-50"
                >
                  <span className="truncate">
                    {highlightQuery(item, value)}
                  </span>
                  <span className="ml-3 text-[11px] text-neutral-400">
                    최근 검색
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};




