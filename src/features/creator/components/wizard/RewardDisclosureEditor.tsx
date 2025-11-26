// 한글 설명: 리워드 정보 고시 편집 컴포넌트
import React from "react";
import type { RewardDisclosure, RewardCategory } from "../../types/rewardDisclosure";
import { REWARD_CATEGORY_LABELS } from "../../types/rewardDisclosure";
import { CategorySpecificDisclosure } from "./CategorySpecificDisclosure";

type RewardDisclosureEditorProps = {
  value: RewardDisclosure;
  onChange: (disclosure: RewardDisclosure) => void;
};

export const RewardDisclosureEditor: React.FC<RewardDisclosureEditorProps> = ({
  value,
  onChange,
}) => {
  const handleCommonChange = (field: keyof RewardDisclosure["common"], val: string | number | boolean | null) => {
    onChange({
      ...value,
      common: {
        ...value.common,
        [field]: val,
      },
    });
  };

  const handleCategoryChange = (category: RewardCategory) => {
    onChange({
      ...value,
      category,
      categorySpecific: {}, // 카테고리 변경 시 기존 카테고리별 정보 초기화
    });
  };

  return (
    <div className="space-y-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">
          리워드 정보 고시
        </h3>
        <span className="text-xs text-neutral-500">
          소비자 보호를 위한 필수 정보입니다
        </span>
      </div>

      {/* 카테고리 선택 */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-500">
          리워드 종류 / 카테고리 *
        </label>
        <select
          value={value.category}
          onChange={(e) => handleCategoryChange(e.target.value as RewardCategory)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
        >
          {Object.entries(REWARD_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* 공통 정보 */}
      <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
        <h4 className="text-xs font-semibold text-neutral-900">공통 정보</h4>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              제조자
            </label>
            <input
              type="text"
              value={value.common.manufacturer ?? ""}
              onChange={(e) => handleCommonChange("manufacturer", e.target.value || null)}
              placeholder="제조사명 또는 메이커 상호"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              수입자 (수입품인 경우만)
            </label>
            <input
              type="text"
              value={value.common.importer ?? ""}
              onChange={(e) => handleCommonChange("importer", e.target.value || null)}
              placeholder="수입자명"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              제조국(원산지) *
            </label>
            <input
              type="text"
              value={value.common.countryOfOrigin ?? ""}
              onChange={(e) => handleCommonChange("countryOfOrigin", e.target.value || null)}
              placeholder="예: 한국, 중국, 미국"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              제조연월
            </label>
            <input
              type="month"
              value={value.common.manufacturingDate ?? ""}
              onChange={(e) => handleCommonChange("manufacturingDate", e.target.value || null)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              출시년월
            </label>
            <input
              type="month"
              value={value.common.releaseDate ?? ""}
              onChange={(e) => handleCommonChange("releaseDate", e.target.value || null)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              유통기한
            </label>
            <input
              type="date"
              value={value.common.expirationDate ?? ""}
              onChange={(e) => handleCommonChange("expirationDate", e.target.value || null)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-medium text-neutral-500">
              품질보증 기준
            </label>
            <input
              type="text"
              value={value.common.qualityAssurance ?? ""}
              onChange={(e) => handleCommonChange("qualityAssurance", e.target.value || null)}
              placeholder="예: 관련 법 및 소비자분쟁해결 기준에 따름"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              A/S 책임자
            </label>
            <input
              type="text"
              value={value.common.asContactName ?? ""}
              onChange={(e) => handleCommonChange("asContactName", e.target.value || null)}
              placeholder="담당자 이름 또는 업체명"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              A/S 전화번호
            </label>
            <input
              type="tel"
              value={value.common.asContactPhone ?? ""}
              onChange={(e) => handleCommonChange("asContactPhone", e.target.value || null)}
              placeholder="010-0000-0000"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              배송비 (원)
            </label>
            <input
              type="number"
              min={0}
              value={value.common.shippingFee ?? ""}
              onChange={(e) => handleCommonChange("shippingFee", e.target.value ? Number(e.target.value) : null)}
              placeholder="0"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">
              설치비 (원)
            </label>
            <input
              type="number"
              min={0}
              value={value.common.installationFee ?? ""}
              onChange={(e) => handleCommonChange("installationFee", e.target.value ? Number(e.target.value) : null)}
              placeholder="0"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={value.common.kcCertification ?? false}
                  onChange={(e) => handleCommonChange("kcCertification", e.target.checked)}
                  className="rounded border-neutral-300"
                />
                <span className="text-xs text-neutral-700">KC 인증</span>
              </label>
              {value.common.kcCertification && (
                <input
                  type="text"
                  value={value.common.kcCertificationNumber ?? ""}
                  onChange={(e) => handleCommonChange("kcCertificationNumber", e.target.value || null)}
                  placeholder="KC 인증번호"
                  className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value.common.functionalCertification ?? false}
                onChange={(e) => handleCommonChange("functionalCertification", e.target.checked)}
                className="rounded border-neutral-300"
              />
              <span className="text-xs text-neutral-700">기능성 인증</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value.common.importDeclaration ?? false}
                onChange={(e) => handleCommonChange("importDeclaration", e.target.checked)}
                className="rounded border-neutral-300"
              />
              <span className="text-xs text-neutral-700">수입신고</span>
            </label>
          </div>
        </div>
      </div>

      {/* 카테고리별 정보 */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h4 className="mb-4 text-xs font-semibold text-neutral-900">
          {REWARD_CATEGORY_LABELS[value.category]} 추가 정보
        </h4>
        <CategorySpecificDisclosure
          category={value.category}
          value={value.categorySpecific}
          onChange={(categorySpecific) =>
            onChange({ ...value, categorySpecific })
          }
        />
      </div>
    </div>
  );
};

