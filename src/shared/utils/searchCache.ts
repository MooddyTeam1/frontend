// 한글 설명: 검색어 캐싱 및 추천 목록 관리를 위한 유틸 함수 모듈

const SEARCH_CACHE_KEY = "fundit:search:projects";
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10분

export interface SearchCacheEntry {
  query: string;
  expiresAt: number;
}

// 한글 설명: sessionStorage에서 검색어 캐시를 읽어오고, 만료된 항목은 정리한다.
export function loadSearchCache(now: number = Date.now()): SearchCacheEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.sessionStorage.getItem(SEARCH_CACHE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as SearchCacheEntry[];
    const valid = parsed.filter((entry) => entry.expiresAt > now);

    // 만료된 항목이 있으면 정리된 결과를 다시 저장
    if (valid.length !== parsed.length) {
      window.sessionStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(valid));
    }

    return valid;
  } catch {
    return [];
  }
}

// 한글 설명: 검색어 캐시를 저장한다.
export function saveSearchCache(entries: SearchCacheEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(entries));
  } catch {
    // storage가 가득 찼거나 실패해도 앱 동작에는 영향 없음
  }
}

// 한글 설명: 새로운 검색어를 캐시에 추가하거나 만료 시간을 갱신한다.
export function upsertSearchQuery(
  query: string,
  ttlMs: number = DEFAULT_TTL_MS
): void {
  const trimmed = query.trim();
  if (!trimmed) return;

  const now = Date.now();
  const entries = loadSearchCache(now);
  const existingIndex = entries.findIndex(
    (entry) => entry.query.toLowerCase() === trimmed.toLowerCase()
  );

  const expiresAt = now + ttlMs;

  if (existingIndex >= 0) {
    entries[existingIndex].expiresAt = expiresAt;
  } else {
    entries.unshift({ query: trimmed, expiresAt });
  }

  // 한글 설명: 너무 많은 검색어가 쌓이지 않도록 상한 설정 (최근 30개까지만 유지)
  const limited = entries.slice(0, 30);
  saveSearchCache(limited);
}

// 한글 설명: 현재 입력한 검색어에 맞는 추천 검색어 목록을 반환한다.
export function getSuggestionsForQuery(
  input: string,
  maxResults = 8
): string[] {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return [];

  const entries = loadSearchCache();

  // 최근 검색어 중 입력값을 포함하는 항목을 상위에서부터 반환
  const matches = entries
    .map((entry) => entry.query)
    .filter((query, index, self) => self.indexOf(query) === index)
    .filter((query) => query.toLowerCase().includes(trimmed));

  return matches.slice(0, maxResults);
}




