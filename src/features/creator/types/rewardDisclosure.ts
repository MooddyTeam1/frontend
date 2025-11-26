// 한글 설명: 리워드 정보 고시 관련 타입 정의

// 한글 설명: 리워드 카테고리 타입
export type RewardCategory =
  | "CLOTHING" // 의류
  | "FOOTWEAR" // 구두/신발
  | "BAG" // 가방
  | "FASHION_ACCESSORIES" // 패션잡화
  | "BEDDING" // 침구류/커튼
  | "FURNITURE" // 가구
  | "KITCHENWARE" // 주방용품
  | "COSMETICS" // 화장품
  | "JEWELRY" // 귀금속/보석/시계
  | "FOOD" // 식품
  | "HEALTH_FOOD" // 건강기능식품
  | "PROCESSED_FOOD" // 가공식품
  | "BABY_PRODUCTS" // 영유아용품
  | "BOOK" // 서적
  | "DIGITAL_CONTENT" // 디지털콘텐츠
  | "OTHER"; // 기타

// 한글 설명: 리워드 카테고리 라벨
export const REWARD_CATEGORY_LABELS: Record<RewardCategory, string> = {
  CLOTHING: "의류",
  FOOTWEAR: "구두/신발",
  BAG: "가방",
  FASHION_ACCESSORIES: "패션잡화",
  BEDDING: "침구류/커튼",
  FURNITURE: "가구",
  KITCHENWARE: "주방용품",
  COSMETICS: "화장품",
  JEWELRY: "귀금속/보석/시계",
  FOOD: "식품",
  HEALTH_FOOD: "건강기능식품",
  PROCESSED_FOOD: "가공식품",
  BABY_PRODUCTS: "영유아용품",
  BOOK: "서적",
  DIGITAL_CONTENT: "디지털콘텐츠",
  OTHER: "기타",
};

// 한글 설명: 공통 리워드 정보 고시 항목
export interface RewardCommonDisclosure {
  // 한글 설명: 제조자/수입자
  manufacturer?: string | null; // 제조자
  importer?: string | null; // 수입자 (수입품인 경우)
  // 한글 설명: 제조국(원산지)
  countryOfOrigin?: string | null;
  // 한글 설명: 제조연월/출시년월/유통기한
  manufacturingDate?: string | null; // 제조연월
  releaseDate?: string | null; // 출시년월
  expirationDate?: string | null; // 유통기한
  // 한글 설명: 품질보증 기준
  qualityAssurance?: string | null;
  // 한글 설명: A/S 책임자 및 전화번호
  asContactName?: string | null; // 담당자 이름 또는 업체명
  asContactPhone?: string | null; // 전화번호
  // 한글 설명: 배송/설치비
  shippingFee?: number | null; // 배송비
  installationFee?: number | null; // 설치비
  // 한글 설명: 인증 여부
  kcCertification?: boolean | null; // KC 인증
  kcCertificationNumber?: string | null; // KC 인증번호
  functionalCertification?: boolean | null; // 기능성 인증
  importDeclaration?: boolean | null; // 수입신고 여부
}

// 한글 설명: 카테고리별 리워드 정보 고시 항목
export interface RewardCategoryDisclosure {
  // 한글 설명: 의류
  clothing?: {
    material?: string | null; // 제품 소재(섬유 조성/혼용률, %, 기능성 여부)
    color?: string | null; // 색상
    size?: string | null; // 치수
    washingMethod?: string | null; // 세탁방법
    careInstructions?: string | null; // 취급 시 주의사항
  } | null;
  // 한글 설명: 구두/신발
  footwear?: {
    mainMaterial?: string | null; // 제품 주 소재
    innerMaterial?: string | null; // 안감 (운동화)
    outerMaterial?: string | null; // 겉감 (운동화)
    color?: string | null; // 색상
    size?: string | null; // 치수
    footLength?: string | null; // 발길이(mm)
    heelHeight?: string | null; // 굽 높이(cm)
    sizeComparison?: string | null; // 해외 사이즈 표기 시 국내 사이즈 병행
    careInstructions?: string | null; // 취급 시 주의사항
  } | null;
  // 한글 설명: 가방
  bag?: {
    type?: string | null; // 종류 (백팩, 숄더백, 크로스백 등)
    material?: string | null; // 소재 (핸들/본체 등)
    color?: string | null; // 색상
    dimensions?: string | null; // 크기 및 중량 (가로, 세로, 끈 길이, 무게)
    careInstructions?: string | null; // 취급 시 주의사항
  } | null;
  // 한글 설명: 패션잡화
  fashionAccessories?: {
    type?: string | null; // 종류
    material?: string | null; // 소재
    dimensions?: string | null; // 치수(가로, 세로, 높이 등)
    careInstructions?: string | null; // 취급 시 주의사항
  } | null;
  // 한글 설명: 침구류/커튼
  bedding?: {
    material?: string | null; // 제품 소재(섬유 조성/혼용률, 충전재 포함)
    color?: string | null; // 색상
    dimensions?: string | null; // 치수
    composition?: string | null; // 제품 구성 (이불커버, 베개커버, 쿠션커버 수량 등)
    washingMethod?: string | null; // 세탁방법
    careInstructions?: string | null; // 취급 시 주의사항
  } | null;
  // 한글 설명: 가구
  furniture?: {
    productName?: string | null; // 품명 (4인용 소파, 6인 식탁 등)
    color?: string | null; // 색상
    composition?: string | null; // 구성품(테이블, 의자 개수 등)
    mainMaterial?: string | null; // 주요 소재(등받이, 상판, 프레임, 바닥 등)
    dimensions?: string | null; // 크기(가로, 세로, 높이 등)
  } | null;
  // 한글 설명: 주방용품
  kitchenware?: {
    productName?: string | null; // 품명 및 모델명
    material?: string | null; // 재질
    composition?: string | null; // 구성품(구성품명 + 수량)
    dimensions?: string | null; // 크기
    releaseDate?: string | null; // 동일 모델 출시년월
    importDeclarationText?: string | null; // 식품위생법에 따른 수입기구·용기 신고 문구
  } | null;
  // 한글 설명: 화장품
  cosmetics?: {
    volume?: string | null; // 용량 또는 중량(ml, g)
    specifications?: string | null; // 제품 주요 사양(피부 타입, 색상/호수 등)
    expirationDate?: string | null; // 사용기한 또는 개봉 후 사용 기간
    manufacturingDate?: string | null; // 개봉 후 사용기간 표기 시 제조연월일도 표기
    usageMethod?: string | null; // 사용방법
    ingredients?: string | null; // 전성분 전체
    functionalCosmetic?: boolean | null; // 기능성 화장품 여부
    kfdaApproval?: boolean | null; // 식약처 심사 필유무
    precautions?: string | null; // 사용 시 주의사항
  } | null;
  // 한글 설명: 귀금속/보석/시계
  jewelry?: {
    material?: string | null; // 소재/순도/밴드 재질(시계)
    weight?: string | null; // 중량
    originInfo?: string | null; // 제조국 및 원산지/가공지 정보
    size?: string | null; // 치수(호수 + mm 등)
    careInstructions?: string | null; // 착용 시 주의사항
    specifications?: string | null; // 주요 사양/등급, 기능, 방수 등
    warrantyProvided?: boolean | null; // 보증서 제공 여부
  } | null;
  // 한글 설명: 식품
  food?: {
    packagingInfo?: string | null; // 포장 단위별 용량(중량)/수량/크기
    producer?: string | null; // 생산자(수입품이면 수입자 포함)
    originInfo?: string | null; // 제조국/원산지
    manufacturingDate?: string | null; // 제조연월일(또는 포장일/생산연도)
    expirationDate?: string | null; // 유통기한/품질유지기한
    legalDisclosures?: string | null; // 관련 법상 표시 사항
    composition?: string | null; // 상품 구성
    storageMethod?: string | null; // 보관방법/취급방법
  } | null;
  // 한글 설명: 건강기능식품
  healthFood?: {
    foodType?: string | null; // 식품의 유형
    manufacturerInfo?: string | null; // 제조업소 명칭 및 소재지
    manufacturingDate?: string | null; // 제조연월일
    expirationDate?: string | null; // 유통기한/품질유지기한
    packagingInfo?: string | null; // 포장단위별 용량(중량), 수량
    ingredients?: string | null; // 원재료명 및 함량(원산지 포함)
    nutritionInfo?: string | null; // 영양정보
    functionInfo?: string | null; // 기능정보
    intakeInfo?: string | null; // 섭취량, 섭취방법, 주의사항, 부작용 가능성
    gmoInfo?: string | null; // 유전자변형 건강기능식품 여부
    reviewInfo?: string | null; // 표시·광고 사전심의필 유무 및 심의번호
    importDeclarationText?: string | null; // 수입품: 건강기능식품에 관한 법률에 따른 수입신고를 필함
  } | null;
  // 한글 설명: 가공식품
  processedFood?: {
    foodType?: string | null; // 식품의 유형
    producerInfo?: string | null; // 생산자 및 소재지(수입품이면 수입자, 제조국 포함)
    manufacturingDate?: string | null; // 제조연월일
    expirationDate?: string | null; // 유통기한/품질유지기한
    packagingInfo?: string | null; // 포장단위별 용량(중량), 수량
    ingredients?: string | null; // 원재료명 및 함량(원산지 포함)
    nutritionInfo?: string | null; // 영양성분
    gmoInfo?: string | null; // 유전자변형 식품 여부
    specialFoodInfo?: string | null; // 영유아식/체중조절식 등 특수용도 식품의 광고심의 및 부작용 관련 표시
    importDeclarationText?: string | null; // 수입품: 식품위생법에 따른 수입신고를 필함
  } | null;
  // 한글 설명: 영유아용품
  babyProducts?: {
    productName?: string | null; // 품명 및 모델명
    kcCertificationType?: string | null; // KC 인증종류
    kcCertificationNumber?: string | null; // KC 인증번호
    dimensions?: string | null; // 크기, 중량
    color?: string | null; // 색상
    material?: string | null; // 재질(섬유 혼용률 포함)
    ageRange?: string | null; // 사용 연령 또는 체중 범위
    releaseDate?: string | null; // 동일 모델 출시년월
    careInstructions?: string | null; // 취급방법 및 주의사항, 안전표시
  } | null;
  // 한글 설명: 서적
  book?: {
    bookTitle?: string | null; // 도서명
    author?: string | null; // 저자
    publisher?: string | null; // 출판사
    dimensions?: string | null; // 크기(가로 × 세로 × 두께/전자책은 파일 용량)
    pageCount?: string | null; // 쪽수(전자책 제외 가능)
    composition?: string | null; // 제품 구성(낱권/세트/부록 CD 등)
    publishDate?: string | null; // 출간일 또는 출간 예정일
    tableOfContents?: string | null; // 목차 또는 책 소개
    targetAge?: string | null; // 아동용 학습 교재일 경우 사용 연령
  } | null;
  // 한글 설명: 디지털콘텐츠
  digitalContent?: {
    producer?: string | null; // 제작자 또는 공급자
    usageConditions?: string | null; // 이용조건, 이용기간
    deliveryMethod?: string | null; // 상품 제공 방식(다운로드, 스트리밍, CD 등)
    systemRequirements?: string | null; // 최소 시스템 사양, 필수 소프트웨어
    cancellationEffect?: string | null; // 청약철회·계약 해제/해지에 따른 효과
  } | null;
  // 한글 설명: 기타
  other?: {
    [key: string]: string | null | undefined; // 기타 카테고리별 자유 필드
  } | null;
}

// 한글 설명: 전체 리워드 정보 고시 타입
export interface RewardDisclosure {
  category: RewardCategory; // 리워드 카테고리
  common: RewardCommonDisclosure; // 공통 정보
  categorySpecific: RewardCategoryDisclosure; // 카테고리별 정보
}

