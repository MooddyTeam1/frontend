// 한글 설명: 카테고리별 리워드 정보 고시 컴포넌트
import React from "react";
import type { RewardDisclosure, RewardCategory } from "../../types/rewardDisclosure";

type CategorySpecificDisclosureProps = {
  category: RewardCategory;
  value: RewardDisclosure["categorySpecific"];
  onChange: (categorySpecific: RewardDisclosure["categorySpecific"]) => void;
};

export const CategorySpecificDisclosure: React.FC<
  CategorySpecificDisclosureProps
> = ({ category, value, onChange }) => {
  // 한글 설명: 의류 카테고리 필드
  if (category === "CLOTHING") {
    const clothing = value.clothing ?? {};
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              제품 소재 (섬유 조성/혼용률, %, 기능성 여부)
            </label>
            <input
              type="text"
              value={clothing.material ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  clothing: { ...clothing, material: e.target.value || null },
                })
              }
              placeholder="예: 면 100%, 폴리에스터 80% + 스판덱스 20%"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">색상</label>
            <input
              type="text"
              value={clothing.color ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  clothing: { ...clothing, color: e.target.value || null },
                })
              }
              placeholder="예: 블랙, 화이트, 네이비"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              치수 (옵션별 S/M/L, 90/95/100 또는 어깨/가슴 등 cm 단위)
            </label>
            <input
              type="text"
              value={clothing.size ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  clothing: { ...clothing, size: e.target.value || null },
                })
              }
              placeholder="예: S(90), M(95), L(100)"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              세탁방법
            </label>
            <input
              type="text"
              value={clothing.washingMethod ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  clothing: {
                    ...clothing,
                    washingMethod: e.target.value || null,
                  },
                })
              }
              placeholder="예: 세탁기 가능, 손세탁 권장"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-medium text-neutral-500">
              취급 시 주의사항
            </label>
            <textarea
              rows={2}
              value={clothing.careInstructions ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  clothing: {
                    ...clothing,
                    careInstructions: e.target.value || null,
                  },
                })
              }
              placeholder="예: 이염 주의, 드라이클리닝 권장"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  // 한글 설명: 식품 카테고리 필드
  if (category === "FOOD") {
    const food = value.food ?? {};
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              포장 단위별 용량(중량)/수량/크기
            </label>
            <input
              type="text"
              value={food.packagingInfo ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  food: { ...food, packagingInfo: e.target.value || null },
                })
              }
              placeholder="예: 1kg × 2개"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              생산자 (수입품이면 수입자 포함)
            </label>
            <input
              type="text"
              value={food.producer ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  food: { ...food, producer: e.target.value || null },
                })
              }
              placeholder="생산자명"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              제조국/원산지
            </label>
            <input
              type="text"
              value={food.originInfo ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  food: { ...food, originInfo: e.target.value || null },
                })
              }
              placeholder="예: 한국, 제주도"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              제조연월일 (또는 포장일/생산연도)
            </label>
            <input
              type="date"
              value={food.manufacturingDate ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  food: {
                    ...food,
                    manufacturingDate: e.target.value || null,
                  },
                })
              }
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              유통기한/품질유지기한
            </label>
            <input
              type="date"
              value={food.expirationDate ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  food: { ...food, expirationDate: e.target.value || null },
                })
              }
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-medium text-neutral-500">
              관련 법상 표시 사항 (유전자변형 여부, 축산물 등급, 수입신고 문구 등)
            </label>
            <textarea
              rows={2}
              value={food.legalDisclosures ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  food: {
                    ...food,
                    legalDisclosures: e.target.value || null,
                  },
                })
              }
              placeholder="예: 유전자변형 없음, 1등급"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              상품 구성
            </label>
            <input
              type="text"
              value={food.composition ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  food: { ...food, composition: e.target.value || null },
                })
              }
              placeholder="예: 대두 1kg × 2개"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              보관방법/취급방법
            </label>
            <input
              type="text"
              value={food.storageMethod ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  food: { ...food, storageMethod: e.target.value || null },
                })
              }
              placeholder="예: 냉장 보관, 직사광선 피하기"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  // 한글 설명: 디지털콘텐츠 카테고리 필드
  if (category === "DIGITAL_CONTENT") {
    const digital = value.digitalContent ?? {};
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              제작자 또는 공급자
            </label>
            <input
              type="text"
              value={digital.producer ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  digitalContent: {
                    ...digital,
                    producer: e.target.value || null,
                  },
                })
              }
              placeholder="제작자명 또는 회사명"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              이용조건, 이용기간
            </label>
            <input
              type="text"
              value={digital.usageConditions ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  digitalContent: {
                    ...digital,
                    usageConditions: e.target.value || null,
                  },
                })
              }
              placeholder="예: 1년간 무제한 이용"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              상품 제공 방식
            </label>
            <input
              type="text"
              value={digital.deliveryMethod ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  digitalContent: {
                    ...digital,
                    deliveryMethod: e.target.value || null,
                  },
                })
              }
              placeholder="예: 다운로드, 스트리밍, CD"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              최소 시스템 사양, 필수 소프트웨어
            </label>
            <input
              type="text"
              value={digital.systemRequirements ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  digitalContent: {
                    ...digital,
                    systemRequirements: e.target.value || null,
                  },
                })
              }
              placeholder="예: Windows 10 이상, Chrome 최신 버전"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-medium text-neutral-500">
              청약철회·계약 해제/해지에 따른 효과
            </label>
            <textarea
              rows={2}
              value={digital.cancellationEffect ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  digitalContent: {
                    ...digital,
                    cancellationEffect: e.target.value || null,
                  },
                })
              }
              placeholder="예: 디지털 콘텐츠의 특성상 청약철회가 제한될 수 있습니다."
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  // 한글 설명: 구두/신발 카테고리 필드
  if (category === "FOOTWEAR") {
    const footwear = value.footwear ?? {};
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              제품 주 소재
            </label>
            <input
              type="text"
              value={footwear.mainMaterial ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  footwear: {
                    ...footwear,
                    mainMaterial: e.target.value || null,
                  },
                })
              }
              placeholder="예: 가죽, 합성피혁"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              겉감 (운동화)
            </label>
            <input
              type="text"
              value={footwear.outerMaterial ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  footwear: {
                    ...footwear,
                    outerMaterial: e.target.value || null,
                  },
                })
              }
              placeholder="운동화인 경우"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              안감 (운동화)
            </label>
            <input
              type="text"
              value={footwear.innerMaterial ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  footwear: {
                    ...footwear,
                    innerMaterial: e.target.value || null,
                  },
                })
              }
              placeholder="운동화인 경우"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">색상</label>
            <input
              type="text"
              value={footwear.color ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  footwear: { ...footwear, color: e.target.value || null },
                })
              }
              placeholder="예: 블랙, 화이트"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">치수</label>
            <input
              type="text"
              value={footwear.size ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  footwear: { ...footwear, size: e.target.value || null },
                })
              }
              placeholder="예: 250, 260, 270"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              발길이 (mm)
            </label>
            <input
              type="text"
              value={footwear.footLength ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  footwear: {
                    ...footwear,
                    footLength: e.target.value || null,
                  },
                })
              }
              placeholder="예: 250mm"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              굽 높이 (cm, 해당 시)
            </label>
            <input
              type="text"
              value={footwear.heelHeight ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  footwear: {
                    ...footwear,
                    heelHeight: e.target.value || null,
                  },
                })
              }
              placeholder="예: 5cm"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              해외 사이즈 표기 시 국내 사이즈 병행
            </label>
            <input
              type="text"
              value={footwear.sizeComparison ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  footwear: {
                    ...footwear,
                    sizeComparison: e.target.value || null,
                  },
                })
              }
              placeholder="예: US 9 = 270mm"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-medium text-neutral-500">
              취급 시 주의사항 (재질별 관리법)
            </label>
            <textarea
              rows={2}
              value={footwear.careInstructions ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  footwear: {
                    ...footwear,
                    careInstructions: e.target.value || null,
                  },
                })
              }
              placeholder="예: 가죽은 방수 스프레이 사용 권장"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  // 한글 설명: 가방 카테고리 필드
  if (category === "BAG") {
    const bag = value.bag ?? {};
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              종류 (백팩, 숄더백, 크로스백 등)
            </label>
            <input
              type="text"
              value={bag.type ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  bag: { ...bag, type: e.target.value || null },
                })
              }
              placeholder="예: 백팩"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              소재 (핸들/본체 등)
            </label>
            <input
              type="text"
              value={bag.material ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  bag: { ...bag, material: e.target.value || null },
                })
              }
              placeholder="예: 가죽, 나일론"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">색상</label>
            <input
              type="text"
              value={bag.color ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  bag: { ...bag, color: e.target.value || null },
                })
              }
              placeholder="예: 블랙, 브라운"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              크기 및 중량 (가로, 세로, 끈 길이, 무게)
            </label>
            <input
              type="text"
              value={bag.dimensions ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  bag: { ...bag, dimensions: e.target.value || null },
                })
              }
              placeholder="예: 가로 30cm × 세로 40cm, 무게 500g"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-medium text-neutral-500">
              취급 시 주의사항
            </label>
            <textarea
              rows={2}
              value={bag.careInstructions ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  bag: { ...bag, careInstructions: e.target.value || null },
                })
              }
              placeholder="예: 물에 젖지 않도록 주의"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  // 한글 설명: 화장품 카테고리 필드
  if (category === "COSMETICS") {
    const cosmetics = value.cosmetics ?? {};
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              용량 또는 중량 (ml, g)
            </label>
            <input
              type="text"
              value={cosmetics.volume ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  cosmetics: { ...cosmetics, volume: e.target.value || null },
                })
              }
              placeholder="예: 30ml, 50g"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              제품 주요 사양 (피부 타입, 색상/호수 등)
            </label>
            <input
              type="text"
              value={cosmetics.specifications ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  cosmetics: {
                    ...cosmetics,
                    specifications: e.target.value || null,
                  },
                })
              }
              placeholder="예: 지성 피부용, 21호"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              사용기한 또는 개봉 후 사용 기간
            </label>
            <input
              type="date"
              value={cosmetics.expirationDate ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  cosmetics: {
                    ...cosmetics,
                    expirationDate: e.target.value || null,
                  },
                })
              }
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              제조연월일 (개봉 후 사용기간 표기 시 필수)
            </label>
            <input
              type="date"
              value={cosmetics.manufacturingDate ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  cosmetics: {
                    ...cosmetics,
                    manufacturingDate: e.target.value || null,
                  },
                })
              }
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              사용방법
            </label>
            <input
              type="text"
              value={cosmetics.usageMethod ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  cosmetics: {
                    ...cosmetics,
                    usageMethod: e.target.value || null,
                  },
                })
              }
              placeholder="예: 세안 후 적당량을 얼굴에 펴 발라주세요"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              전성분 전체
            </label>
            <input
              type="text"
              value={cosmetics.ingredients ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  cosmetics: {
                    ...cosmetics,
                    ingredients: e.target.value || null,
                  },
                })
              }
              placeholder="예: 정제수, 글리세린, ..."
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cosmetics.functionalCosmetic ?? false}
                onChange={(e) =>
                  onChange({
                    ...value,
                    cosmetics: {
                      ...cosmetics,
                      functionalCosmetic: e.target.checked,
                    },
                  })
                }
                className="rounded border-neutral-300"
              />
              <span className="text-xs text-neutral-700">
                기능성 화장품 여부
              </span>
            </label>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cosmetics.kfdaApproval ?? false}
                onChange={(e) =>
                  onChange({
                    ...value,
                    cosmetics: {
                      ...cosmetics,
                      kfdaApproval: e.target.checked,
                    },
                  })
                }
                className="rounded border-neutral-300"
              />
              <span className="text-xs text-neutral-700">
                식약처 심사 필유무
              </span>
            </label>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-medium text-neutral-500">
              사용 시 주의사항
            </label>
            <textarea
              rows={2}
              value={cosmetics.precautions ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  cosmetics: {
                    ...cosmetics,
                    precautions: e.target.value || null,
                  },
                })
              }
              placeholder="예: 눈에 들어가지 않도록 주의하세요"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  // 한글 설명: 서적 카테고리 필드
  if (category === "BOOK") {
    const book = value.book ?? {};
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              도서명
            </label>
            <input
              type="text"
              value={book.bookTitle ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  book: { ...book, bookTitle: e.target.value || null },
                })
              }
              placeholder="도서명"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">저자</label>
            <input
              type="text"
              value={book.author ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  book: { ...book, author: e.target.value || null },
                })
              }
              placeholder="저자명"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              출판사 (독립 출간물은 '해당사항 없음' 가능)
            </label>
            <input
              type="text"
              value={book.publisher ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  book: { ...book, publisher: e.target.value || null },
                })
              }
              placeholder="출판사명"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              크기 (가로 × 세로 × 두께 / 전자책은 파일 용량)
            </label>
            <input
              type="text"
              value={book.dimensions ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  book: { ...book, dimensions: e.target.value || null },
                })
              }
              placeholder="예: 148mm × 210mm × 15mm"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              쪽수 (전자책 제외 가능)
            </label>
            <input
              type="text"
              value={book.pageCount ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  book: { ...book, pageCount: e.target.value || null },
                })
              }
              placeholder="예: 300쪽"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              제품 구성 (낱권/세트/부록 CD 등)
            </label>
            <input
              type="text"
              value={book.composition ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  book: { ...book, composition: e.target.value || null },
                })
              }
              placeholder="예: 낱권, 세트 3권"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              출간일 또는 출간 예정일
            </label>
            <input
              type="date"
              value={book.publishDate ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  book: { ...book, publishDate: e.target.value || null },
                })
              }
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              사용 연령 (아동용 학습 교재일 경우)
            </label>
            <input
              type="text"
              value={book.targetAge ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  book: { ...book, targetAge: e.target.value || null },
                })
              }
              placeholder="예: 7세 이상"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-medium text-neutral-500">
              목차 또는 책 소개
            </label>
            <textarea
              rows={3}
              value={book.tableOfContents ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  book: {
                    ...book,
                    tableOfContents: e.target.value || null,
                  },
                })
              }
              placeholder="목차 또는 책 소개를 입력하세요"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  // 한글 설명: 기타 카테고리는 기본 메시지 표시
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center">
      <p className="text-xs text-neutral-500">
        {category === "OTHER"
          ? "기타 카테고리는 추가 정보 입력이 필요하지 않습니다."
          : "해당 카테고리의 상세 정보 입력 기능은 준비 중입니다."}
      </p>
    </div>
  );
};

