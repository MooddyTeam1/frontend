// 카테고리 한글 옵션 (이미 있는 코드)
export const CATEGORY_OPTIONS = [
  "테크",
  "디자인",
  "푸드",
  "패션",
  "뷰티",
  "홈·리빙",
  "게임",
  "예술",
  "출판",
] as const;

// ✅ 한글 카테고리 타입
export type CategoryLabel = (typeof CATEGORY_OPTIONS)[number];

// ✅ 백엔드 Enum 문자열 타입
//    (스프링의 Category enum 이름과 정확히 맞춰줌)
export type CategoryEnum =
  | "TECH"
  | "DESIGN"
  | "FOOD"
  | "FASHION"
  | "BEAUTY"
  | "HOME_LIVING"
  | "GAME"
  | "ART"
  | "PUBLISH";

// ✅ 한글 → 백엔드 enum 코드 매핑 테이블
const CATEGORY_LABEL_TO_ENUM: Record<CategoryLabel, CategoryEnum> = {
  테크: "TECH",
  디자인: "DESIGN",
  푸드: "FOOD",
  패션: "FASHION",
  뷰티: "BEAUTY",
  "홈·리빙": "HOME_LIVING",
  게임: "GAME",
  예술: "ART",
  출판: "PUBLISH",
};

// ✅ 백엔드 enum 코드 → 한글 라벨 매핑 테이블 (역방향도 필요할 때 사용)
const CATEGORY_ENUM_TO_LABEL: Record<CategoryEnum, CategoryLabel> = {
  TECH: "테크",
  DESIGN: "디자인",
  FOOD: "푸드",
  FASHION: "패션",
  BEAUTY: "뷰티",
  HOME_LIVING: "홈·리빙",
  GAME: "게임",
  ART: "예술",
  PUBLISH: "출판",
};

/**
 * 한글 카테고리 라벨 → 백엔드 enum 문자열로 변환
 * 예) "테크" -> "TECH"
 */
export function toCategoryEnum(label: CategoryLabel): CategoryEnum {
  return CATEGORY_LABEL_TO_ENUM[label];
}

/**
 * 백엔드 enum 문자열 → 한글 카테고리 라벨로 변환
 * 예) "TECH" -> "테크"
 */
export function toCategoryLabel(code: CategoryEnum): CategoryLabel {
  return CATEGORY_ENUM_TO_LABEL[code];
}
