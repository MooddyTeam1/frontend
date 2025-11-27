// 카테고리 라벨/코드 매퍼 (프론트 ↔ 백엔드 Enum)

// UI에 노출되는 카테고리 라벨 모음 (유니코드 이스케이프로 안전하게 정의)
export const CATEGORY_OPTIONS = [
  "\uD14C\uD06C",          // 테크
  "\uB514\uC790\uC778",    // 디자인
  "\uD478\uB4DC",          // 푸드
  "\uD328\uC158",          // 패션
  "\uBDF0\uD2F0",          // 뷰티
  "\uD648\u00B7\uB9AC\uBE59", // 홈·리빙
  "\uAC8C\uC784",          // 게임
  "\uC608\uC220",          // 예술
  "\uCD9C\uD310",          // 출판
] as const;

export type CategoryLabel = (typeof CATEGORY_OPTIONS)[number];

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

const CATEGORY_LABEL_TO_ENUM: Record<CategoryLabel, CategoryEnum> = {
  "\uD14C\uD06C": "TECH",                 // 테크
  "\uB514\uC790\uC778": "DESIGN",         // 디자인
  "\uD478\uB4DC": "FOOD",                 // 푸드
  "\uD328\uC158": "FASHION",              // 패션
  "\uBDF0\uD2F0": "BEAUTY",               // 뷰티
  "\uD648\u00B7\uB9AC\uBE59": "HOME_LIVING", // 홈·리빙
  "\uAC8C\uC784": "GAME",                 // 게임
  "\uC608\uC220": "ART",                  // 예술
  "\uCD9C\uD310": "PUBLISH",              // 출판
};

const CATEGORY_ENUM_TO_LABEL: Record<CategoryEnum, CategoryLabel> = {
  TECH: "\uD14C\uD06C",
  DESIGN: "\uB514\uC790\uC778",
  FOOD: "\uD478\uB4DC",
  FASHION: "\uD328\uC158",
  BEAUTY: "\uBDF0\uD2F0",
  HOME_LIVING: "\uD648\u00B7\uB9AC\uBE59",
  GAME: "\uAC8C\uC784",
  ART: "\uC608\uC220",
  PUBLISH: "\uCD9C\uD310",
};

export function toCategoryEnum(label: CategoryLabel): CategoryEnum {
  return CATEGORY_LABEL_TO_ENUM[label];
}

export function toCategoryLabel(code: CategoryEnum): CategoryLabel {
  return CATEGORY_ENUM_TO_LABEL[code];
}
