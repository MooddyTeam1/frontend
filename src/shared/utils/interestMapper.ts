// 한글 설명: 관심사 ID와 한글 이름 매핑 유틸리티 (categoryMapper 패턴 참고)

// 한글 설명: 관심사 ID 타입
export type InterestId = "tech" | "game" | "food" | "eco";

// 한글 설명: 관심사 한글 이름 타입
export type InterestName = "테크" | "게임" | "푸드" | "환경";

// 한글 설명: 관심사 ID → 한글 이름 매핑 테이블
const INTEREST_ID_TO_NAME: Record<InterestId, InterestName> = {
  tech: "테크",
  game: "게임",
  food: "푸드",
  eco: "환경",
};

// 한글 설명: 한글 이름 → 관심사 ID 매핑 테이블 (역방향)
const INTEREST_NAME_TO_ID: Record<InterestName, InterestId> = {
  테크: "tech",
  게임: "game",
  푸드: "food",
  환경: "eco",
};

/**
 * 한글 설명: 관심사 ID → 한글 이름으로 변환
 * 예) "tech" -> "테크"
 */
export function toInterestName(id: InterestId | string): string {
  if (id in INTEREST_ID_TO_NAME) {
    return INTEREST_ID_TO_NAME[id as InterestId];
  }
  // 한글 설명: 매핑에 없는 경우 원본 반환 (이미 한글이거나 알 수 없는 값)
  return id;
}

/**
 * 한글 설명: 한글 이름 → 관심사 ID로 변환
 * 예) "테크" -> "tech"
 */
export function toInterestId(name: InterestName | string): InterestId | string {
  if (name in INTEREST_NAME_TO_ID) {
    return INTEREST_NAME_TO_ID[name as InterestName];
  }
  // 한글 설명: 매핑에 없는 경우 원본 반환
  return name;
}


