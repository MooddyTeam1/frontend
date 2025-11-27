// 한글 설명: 프로젝트 상세 페이지의 리워드 탭 컴포넌트 (정보고시 전용)
import React, { useEffect, useState } from "react";
import { currencyKRW } from "../../../shared/utils/format";
import { fetchPublicProjectRewards } from "../api/publicProjectsService";
import type { PublicRewardResponseDTO } from "../types";

interface ProjectRewardsTabProps {
  projectId: number; // 프로젝트 ID
}

export const ProjectRewardsTab: React.FC<ProjectRewardsTabProps> = ({
  projectId,
}) => {
  const [rewards, setRewards] = useState<PublicRewardResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 리워드 목록 조회
  useEffect(() => {
    const loadRewards = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPublicProjectRewards(projectId);
        setRewards(data);
      } catch (err) {
        console.error("리워드 목록 조회 실패:", err);
        setError("리워드 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadRewards();
  }, [projectId]);

  // 한글 설명: 예상 배송일 포맷팅 (YYYY-MM-DD → YYYY년 MM월)
  const formatDeliveryDate = (dateStr: string | null): string => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      return `${year}년 ${month}월`;
    } catch {
      return dateStr;
    }
  };


  if (loading) {
    return (
      <div className="rounded-3xl border border-neutral-200 p-6 text-center text-sm text-neutral-500">
        리워드 정보를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="rounded-3xl border border-neutral-200 p-6 text-center text-sm text-neutral-500">
        준비된 리워드가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {rewards.map((reward) => (
        <div
          key={reward.id}
          className={`rounded-3xl border border-neutral-200 p-6 ${
            !reward.active ? "opacity-60" : ""
          }`}
        >
          {/* 한글 설명: 리워드 헤더 */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {reward.name}
                </h3>
                {!reward.active && (
                  <span className="rounded-full bg-neutral-200 px-2 py-1 text-xs text-neutral-600">
                    소진
                  </span>
                )}
              </div>
              {reward.description && (
                <p className="mt-2 text-sm text-neutral-600">
                  {reward.description}
                </p>
              )}
            </div>
            <div className="ml-4 text-right">
              <p className="text-xl font-semibold text-neutral-900">
                {currencyKRW(reward.price)}
              </p>
            </div>
          </div>

          {/* 한글 설명: 옵션 그룹 표시 */}
          {reward.optionGroups && reward.optionGroups.length > 0 && (
            <div className="mb-4 space-y-3">
              {reward.optionGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-2">
                  <p className="text-sm font-medium text-neutral-700">
                    {group.groupName}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.optionValues.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          option.stockQuantity > 0
                            ? "border-neutral-200 bg-white text-neutral-900"
                            : "border-neutral-100 bg-neutral-50 text-neutral-400"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{option.optionValue}</span>
                          {option.addPrice > 0 && (
                            <span className="text-xs text-neutral-500">
                              (+{currencyKRW(option.addPrice)})
                            </span>
                          )}
                        </div>
                        {option.stockQuantity > 0 && (
                          <p className="mt-1 text-xs text-neutral-500">
                            재고 {option.stockQuantity}개
                          </p>
                        )}
                        {option.stockQuantity === 0 && (
                          <p className="mt-1 text-xs text-red-500">품절</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 한글 설명: 리워드 세트 표시 */}
          {reward.rewardSets && reward.rewardSets.length > 0 && (
            <div className="mb-4 space-y-3">
              <p className="text-sm font-medium text-neutral-700">세트 옵션</p>
              <div className="space-y-2">
                {reward.rewardSets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className={`rounded-lg border p-3 ${
                      set.stockQuantity > 0
                        ? "border-neutral-200 bg-white"
                        : "border-neutral-100 bg-neutral-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-900">
                        {set.setName}
                      </span>
                      {set.stockQuantity > 0 ? (
                        <span className="text-xs text-neutral-500">
                          재고 {set.stockQuantity}개
                        </span>
                      ) : (
                        <span className="text-xs text-red-500">품절</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 한글 설명: 재고 및 배송 정보 */}
          <div className="mb-4 grid grid-cols-2 gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-sm">
            <div>
              <p className="text-xs text-neutral-500">재고 수량</p>
              <p className="mt-1 font-medium text-neutral-900">
                {reward.stockQuantity > 0
                  ? `${reward.stockQuantity}개`
                  : "품절"}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">예상 배송일</p>
              <p className="mt-1 font-medium text-neutral-900">
                {formatDeliveryDate(reward.estimatedDeliveryDate)}
              </p>
            </div>
          </div>

          {/* 한글 설명: 정보고시 표시 */}
          {reward.disclosure && (
            <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="mb-3 text-sm font-semibold text-neutral-900">
                상품 정보 고시
              </p>
              <div className="space-y-2 text-xs text-neutral-600">
                {reward.disclosure.common.manufacturer && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">제조자</span>
                    <span>{reward.disclosure.common.manufacturer}</span>
                  </div>
                )}
                {reward.disclosure.common.brandName && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">브랜드명</span>
                    <span>{reward.disclosure.common.brandName}</span>
                  </div>
                )}
                {reward.disclosure.common.originCountry && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">원산지</span>
                    <span>{reward.disclosure.common.originCountry}</span>
                  </div>
                )}
                {reward.disclosure.common.deliveryInfo && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">배송 정보</span>
                    <span>{reward.disclosure.common.deliveryInfo}</span>
                  </div>
                )}
                {reward.disclosure.categorySpecific.certifications && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">인증 정보</span>
                    <span>
                      {reward.disclosure.categorySpecific.certifications}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      ))}
    </div>
  );
};

