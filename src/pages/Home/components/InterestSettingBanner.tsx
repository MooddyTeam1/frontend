// 한글 설명: 관심사 설정 배너 컴포넌트 (홈 페이지 헤더 바로 아래 표시)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/stores/authStore";
import { useSupporterStore } from "../../../features/supporter/stores/supporterStore";
import {
  CATEGORY_OPTIONS,
  type CategoryLabel,
} from "../../../shared/utils/categorymapper";
import { supporterService } from "../../../features/supporter/api/supporterService";
import type { SupporterProfileDTO } from "../../../features/supporter/types";

// 한글 설명: readonly 배열을 mutable 배열로 변환
const CATEGORY_OPTIONS_MUTABLE = [...CATEGORY_OPTIONS] as CategoryLabel[];

/**
 * 한글 설명: 관심사 설정 배너 컴포넌트
 * - 관심사가 설정되지 않은 서포터에게 표시
 * - 관심사를 선택할 수 있는 UI 제공
 * - 설정 완료 시 배너 숨김
 */
export const InterestSettingBanner: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { fetchMyProfile } = useSupporterStore();
  const [profile, setProfile] = useState<SupporterProfileDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<CategoryLabel[]>([]);
  const [saving, setSaving] = useState(false);

  // 한글 설명: 로그인하지 않았거나 프로필이 없으면 표시하지 않음
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await supporterService.getMyProfile();
        setProfile(data);
        setSelectedInterests(data.interests as CategoryLabel[]);
      } catch (error) {
        console.error("프로필 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, user?.id]);

  // 한글 설명: 관심사가 설정되어 있으면 배너를 표시하지 않음
  if (loading || !profile || (profile.interests && profile.interests.length > 0)) {
    return null;
  }

  /**
   * 한글 설명: 관심사 토글
   */
  const toggleInterest = (label: CategoryLabel) => {
    setSelectedInterests((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  /**
   * 한글 설명: 관심사 저장
   */
  const handleSave = async () => {
    if (selectedInterests.length === 0) {
      alert("최소 1개 이상의 관심사를 선택해주세요.");
      return;
    }

    try {
      setSaving(true);
      await supporterService.updateMyProfile({
        interests: selectedInterests,
      });
      // 한글 설명: 프로필 새로고침
      await fetchMyProfile();
      alert("관심사가 설정되었습니다.");
    } catch (error) {
      console.error("관심사 저장 실패:", error);
      alert("관심사 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  /**
   * 한글 설명: 설정 페이지로 이동
   */
  const handleGoToSettings = () => {
    navigate("/settings/supporter");
  };

  return (
    <div className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-neutral-900">
              관심사 설정하기
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              관심사와 선호도를 알려주시면 더 잘 맞는 프로젝트를 추천해드려요.
            </p>
          </div>

          {/* 한글 설명: 관심사 선택 UI */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS_MUTABLE.map((categoryLabel) => {
                const active = selectedInterests.includes(categoryLabel);
                return (
                  <button
                    key={categoryLabel}
                    type="button"
                    onClick={() => toggleInterest(categoryLabel)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {categoryLabel}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || selectedInterests.length === 0}
                className="rounded-full border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                type="button"
                onClick={handleGoToSettings}
                className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400"
              >
                상세 설정
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

