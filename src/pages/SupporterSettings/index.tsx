import React from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import type { SupporterProfileDTO } from "../../features/supporter/types";
import {
  type SupporterStoreState,
  useSupporterStore,
} from "../../features/supporter/stores/supporterStore";
import { useAuthStore } from "../../features/auth/stores/authStore";
import { uploadImage } from "../../features/uploads/api/imageUploadService";
import { resolveImageUrl } from "../../shared/utils/image";
import {
  CATEGORY_OPTIONS,
  type CategoryLabel,
} from "../../shared/utils/categoryMapper";
import {
  getSupporterOnboardingData,
  saveSupporterOnboardingStep1,
  saveSupporterOnboardingStep2,
} from "../../features/onboarding/api/supporterOnboardingApi";
import { SupporterOnboardingSummarySection } from "../../features/onboarding/components/SupporterOnboardingSummarySection";
import type {
  ProjectCategory,
  ProjectStylePreference,
  BudgetRange,
  FundingExperience,
  AcquisitionChannel,
} from "../../features/onboarding/types/supporterOnboarding";
import {
  PROJECT_STYLE_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  FUNDING_EXPERIENCE_OPTIONS,
  ACQUISITION_CHANNEL_OPTIONS,
  categoryLabelToEnum,
} from "../../features/onboarding/types/supporterOnboarding";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// 한글 설명: 전화번호를 010-1234-5678 형식으로 자동 포맷팅하는 함수
const formatPhoneNumber = (value: string): string => {
  // 한글 설명: 숫자만 추출
  const numbers = value.replace(/\D/g, "");

  // 한글 설명: 숫자가 없으면 빈 문자열 반환
  if (numbers.length === 0) return "";

  // 한글 설명: 11자리 초과 시 자르기
  const limitedNumbers = numbers.slice(0, 11);

  // 한글 설명: 길이에 따라 포맷팅
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 7) {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
  }
};

type SupporterProfileFormState = {
  displayName: string;
  bio: string;
  imageUrl: string;
  interests: string[];
  phone: string;
  address1: string;
  address2: string;
  postalCode: string;
  isDefaultAddress: boolean; // 한글 설명: 기본 배송지로 설정 여부
};

const emptyFormState: SupporterProfileFormState = {
  displayName: "",
  bio: "",
  imageUrl: "",
  interests: [],
  phone: "",
  address1: "",
  address2: "",
  postalCode: "",
  isDefaultAddress: false,
};

const convertToFormState = (
  profile: SupporterProfileDTO | null
): SupporterProfileFormState => ({
  displayName: profile?.displayName ?? "",
  bio: profile?.bio ?? "",
  imageUrl: profile?.imageUrl ?? "",
  interests: profile?.interests ?? [],
  phone: profile?.phone ?? "",
  address1: profile?.address1 ?? "",
  address2: profile?.address2 ?? "",
  postalCode: profile?.postalCode ?? "",
  // 한글 설명: 기본 배송지 여부는 주소가 있으면 true로 설정 (또는 API에서 받아온 값 사용)
  isDefaultAddress: !!(
    profile?.address1 && profile?.address1.trim().length > 0
  ),
});

export const SupporterSettingsPage: React.FC = () => {
  // 한글 설명: 서포터 프로필을 API와 동기화하면서 폼 편집을 제공한다.
  const navigate = useNavigate();
  const [form, setForm] =
    React.useState<SupporterProfileFormState>(emptyFormState);
  // 한글 설명: 관심사는 카테고리 매퍼의 카테고리 옵션을 사용
  const allInterests: CategoryLabel[] = CATEGORY_OPTIONS;
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    emptyFormState.imageUrl
  );
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const previewObjectUrlRef = React.useRef<string | null>(null);
  const [useLocalPreview, setUseLocalPreview] = React.useState(false);

  // 한글 설명: 온보딩 선택사항 상태 (알림설정 제외)
  const [onboardingData, setOnboardingData] = React.useState<{
    preferredStyles: Set<ProjectStylePreference>;
    budgetRange: BudgetRange | undefined;
    fundingExperience: FundingExperience | undefined;
    acquisitionChannel: AcquisitionChannel | undefined;
    acquisitionChannelEtc: string;
  }>({
    preferredStyles: new Set(),
    budgetRange: undefined,
    fundingExperience: undefined,
    acquisitionChannel: undefined,
    acquisitionChannelEtc: "",
  });
  const [loadingOnboarding, setLoadingOnboarding] = React.useState(false);
  const [savingOnboarding, setSavingOnboarding] = React.useState(false);
  const [isOnboardingExpanded, setIsOnboardingExpanded] = React.useState(false); // 한글 설명: 기타 섹션 접힘/펼침 상태

  const { user } = useAuthStore();
  const userId = user?.id ?? null;

  const profileSelector = React.useMemo(
    () => (state: SupporterStoreState) =>
      userId ? state.getProfile(userId) : null,
    [userId]
  );

  const supporterProfile = useSupporterStore(profileSelector);
  const storeLoading = useSupporterStore((state) => state.loading);
  const storeError = useSupporterStore((state) => state.error);
  const fetchMyProfile = useSupporterStore((state) => state.fetchMyProfile);
  const saveMyProfile = useSupporterStore((state) => state.saveMyProfile);

  const hasRequestedRef = React.useRef(false);

  React.useEffect(() => {
    // 한글 설명: 로컬 미리보기가 없을 때만 서버 이미지로 동기화한다.
    if (useLocalPreview) return;
    const resolved =
      form.imageUrl && form.imageUrl.trim().length > 0
        ? (resolveImageUrl(form.imageUrl) ?? form.imageUrl)
        : null;
    setImagePreview(resolved ?? null);
  }, [form.imageUrl, useLocalPreview]);

  React.useEffect(() => {
    if (!userId) {
      hasRequestedRef.current = false;
      return;
    }
    if (supporterProfile) {
      hasRequestedRef.current = true;
      return;
    }
    if (hasRequestedRef.current) return;

    hasRequestedRef.current = true;
    fetchMyProfile().catch(() => {
      hasRequestedRef.current = false;
    });
  }, [userId, supporterProfile, fetchMyProfile]);

  React.useEffect(() => {
    if (!supporterProfile) return;
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
    setUseLocalPreview(false);
    setForm(convertToFormState(supporterProfile));
    const resolved =
      supporterProfile.imageUrl && supporterProfile.imageUrl.trim().length > 0
        ? (resolveImageUrl(supporterProfile.imageUrl) ??
          supporterProfile.imageUrl)
        : null;
    setImagePreview(resolved ?? null);
  }, [supporterProfile]);

  // 한글 설명: 온보딩 데이터 조회
  React.useEffect(() => {
    const loadOnboardingData = async () => {
      try {
        setLoadingOnboarding(true);
        const data = await getSupporterOnboardingData();
        setOnboardingData({
          preferredStyles: new Set(data.preferredStyles ?? []),
          budgetRange: data.budgetRange,
          fundingExperience: data.fundingExperience,
          acquisitionChannel: data.acquisitionChannel,
          acquisitionChannelEtc: data.acquisitionChannelEtc ?? "",
        });
      } catch (error) {
        console.error("온보딩 데이터 조회 실패", error);
        // 한글 설명: 에러가 발생해도 계속 진행 (온보딩 데이터가 없을 수 있음)
      } finally {
        setLoadingOnboarding(false);
      }
    };
    loadOnboardingData();
  }, []);

  React.useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
    };
  }, []);

  const updateFormField = <Key extends keyof SupporterProfileFormState>(
    key: Key,
    value: SupporterProfileFormState[Key]
  ) => {
    if (key === "imageUrl") {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
      setUseLocalPreview(false);
    }
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 한글 설명: 관심사 토글 (카테고리 라벨 사용)
  const toggleInterest = (label: CategoryLabel) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(label)
        ? prev.interests.filter((item) => item !== label)
        : [...prev.interests, label],
    }));
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있어요.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      alert("프로필 이미지는 5MB 이하로 업로드해 주세요.");
      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
      const previewUrl = URL.createObjectURL(file);
      previewObjectUrlRef.current = previewUrl;
      setImagePreview(previewUrl);
      setUseLocalPreview(true);
      const response = await uploadImage(file);
      setForm((prev) => ({
        ...prev,
        imageUrl: response.url,
      }));
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "이미지를 업로드하는 중 문제가 발생했습니다."
      );
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
      setUseLocalPreview(false);
      const resolved =
        form.imageUrl && form.imageUrl.trim().length > 0
          ? (resolveImageUrl(form.imageUrl) ?? form.imageUrl)
          : null;
      setImagePreview(resolved ?? null);
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
    setForm((prev) => ({
      ...prev,
      imageUrl: "",
    }));
    setImagePreview(null);
    setUseLocalPreview(false);
  };

  const handleResetToServer = () => {
    // 한글 설명: 취소 버튼 클릭 시 프로필 페이지로 이동
    navigate("/profile/supporter");
  };

  const buildUpdatePayload = React.useCallback(
    () =>
      ({
        displayName: form.displayName.trim() || null,
        bio: form.bio.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
        interests: form.interests,
        phone: form.phone.trim() || null,
        address1: form.address1.trim() || null,
        address2: form.address2.trim() || null,
        postalCode: form.postalCode.trim() || null,
      }) satisfies Partial<SupporterProfileDTO>,
    [form]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      setSubmitError("로그인이 필요한 기능입니다.");
      return;
    }

    setSubmitSuccess(false);
    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload = buildUpdatePayload();
      const saved = await saveMyProfile(payload);
      setForm(convertToFormState(saved));
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
      setUseLocalPreview(false);
      const resolved =
        saved.imageUrl && saved.imageUrl.trim().length > 0
          ? (resolveImageUrl(saved.imageUrl) ?? saved.imageUrl)
          : null;
      setImagePreview(resolved ?? null);
      setSubmitSuccess(true);
      // 한글 설명: 저장 성공 시 프로필 페이지로 이동 (0.5초 후)
      setTimeout(() => {
        navigate("/profile/supporter");
      }, 500);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "프로필 저장 중 문제가 발생했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      {/* 한글 설명: 서포터 프로필 설정 페이지. 닉네임/소개, 아바타, 연락처/주소, 관심사 선택 */}
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col gap-6 py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900">
            서포터 프로필
          </h1>
          <p className="text-sm text-neutral-500">
            후원 시 표시될 프로필과 기본 정보를 관리합니다.
          </p>
        </header>

        <section className="space-y-4 rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {storeError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                <p className="font-medium">
                  프로필 정보를 불러오지 못했습니다.
                </p>
                <p className="mt-1">{storeError}</p>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center rounded-full border border-red-300 px-3 py-1 text-[11px] font-medium text-red-600 hover:border-red-500 hover:text-red-700"
                  onClick={() => {
                    hasRequestedRef.current = false;
                    fetchMyProfile().catch(() => {
                      hasRequestedRef.current = false;
                    });
                  }}
                >
                  다시 시도
                </button>
              </div>
            ) : null}

            {submitSuccess ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                변경 사항이 저장되었습니다.
              </div>
            ) : null}
            {submitError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {submitError}
              </div>
            ) : null}
            {storeLoading && !supporterProfile ? (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
                프로필 정보를 불러오는 중입니다...
              </div>
            ) : null}

            {/* 닉네임, 소개 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500">
                  닉네임
                </label>
                <input
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  placeholder="닉네임"
                  value={form.displayName}
                  onChange={(event) =>
                    updateFormField("displayName", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500">
                  프로필 이미지
                </label>
                <div className="space-y-3 rounded-2xl border border-neutral-200 p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="프로필 미리보기"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[11px] text-neutral-400">
                          미리보기
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 text-xs text-neutral-500">
                      <button
                        type="button"
                        onClick={handleImageUploadClick}
                        className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white disabled:opacity-60"
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? "업로드 중..." : "이미지 업로드"}
                      </button>
                      {imagePreview ? (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                        >
                          이미지 제거
                        </button>
                      ) : null}
                      <p>JPG, PNG, GIF 이미지를 5MB 이하로 업로드해 주세요.</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500">
                      직접 입력
                    </label>
                    <input
                      className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                      placeholder="https://..."
                      value={form.imageUrl}
                      onChange={(event) =>
                        updateFormField("imageUrl", event.target.value)
                      }
                    />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-medium text-neutral-500">
                  소개
                </label>
                <textarea
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  rows={3}
                  placeholder="간단한 자기소개를 입력하세요"
                  value={form.bio}
                  onChange={(event) =>
                    updateFormField("bio", event.target.value)
                  }
                />
              </div>
            </div>

            {/* 연락처, 주소 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500">
                  연락처
                </label>
                <input
                  type="tel"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  placeholder="010-0000-0000"
                  value={form.phone}
                  onChange={(event) => {
                    // 한글 설명: 입력값을 자동 포맷팅하여 저장
                    const formatted = formatPhoneNumber(event.target.value);
                    updateFormField("phone", formatted);
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500">
                  우편번호
                </label>
                <input
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  placeholder="00000"
                  value={form.postalCode}
                  onChange={(event) =>
                    updateFormField("postalCode", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-medium text-neutral-500">
                  주소 (기본)
                </label>
                <input
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  placeholder="도로명 주소를 입력하세요"
                  value={form.address1}
                  onChange={(event) =>
                    updateFormField("address1", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-medium text-neutral-500">
                  주소 상세
                </label>
                <input
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  placeholder="동/호수 등 상세 주소를 입력하세요"
                  value={form.address2}
                  onChange={(event) =>
                    updateFormField("address2", event.target.value)
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isDefaultAddress}
                    onChange={(event) =>
                      updateFormField("isDefaultAddress", event.target.checked)
                    }
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span className="text-xs text-neutral-600">
                    이 주소를 기본 배송지로 설정
                  </span>
                </label>
                <p className="mt-1 text-[11px] text-neutral-400">
                  기본 배송지로 설정하면 후원 시 자동으로 이 주소가 사용됩니다.
                </p>
              </div>
            </div>

            {/* 관심사 멀티 선택 */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">
                관심사
              </label>
              <div className="flex flex-wrap gap-2">
                {allInterests.map((categoryLabel) => {
                  const active = form.interests.includes(categoryLabel);
                  return (
                    <button
                      key={categoryLabel}
                      type="button"
                      onClick={() => toggleInterest(categoryLabel)}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        active
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                      }`}
                    >
                      {categoryLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 기타 (온보딩 선택사항) - 접힌 상태 기본값 */}
            <div className="space-y-2 border-t border-neutral-200 pt-4">
              <button
                type="button"
                onClick={() => setIsOnboardingExpanded(!isOnboardingExpanded)}
                className="flex w-full items-center justify-between text-xs font-medium text-neutral-500 hover:text-neutral-900"
              >
                <span>기타</span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    isOnboardingExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* 한글 설명: 접힌 상태일 때는 표시하지 않음 */}
              {isOnboardingExpanded && (
                <div className="space-y-4 pt-2">
                  {/* 한글 설명: 선호하는 프로젝트 스타일 */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500">
                      선호하는 프로젝트 스타일
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PROJECT_STYLE_OPTIONS.map((option) => {
                        const isSelected = onboardingData.preferredStyles.has(
                          option.value
                        );
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setOnboardingData((prev) => {
                                const next = new Set(prev.preferredStyles);
                                if (next.has(option.value)) {
                                  next.delete(option.value);
                                } else {
                                  next.add(option.value);
                                }
                                return { ...prev, preferredStyles: next };
                              });
                            }}
                            className={`rounded-full border px-3 py-1 text-xs ${
                              isSelected
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 한글 설명: 유입 경로 */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500">
                      MOA를 어떻게 알게 되셨나요?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ACQUISITION_CHANNEL_OPTIONS.map((option) => {
                        const isSelected =
                          onboardingData.acquisitionChannel === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setOnboardingData((prev) => ({
                                ...prev,
                                acquisitionChannel: option.value,
                              }));
                            }}
                            className={`rounded-full border px-3 py-1 text-xs ${
                              isSelected
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                    {/* 한글 설명: 기타 선택 시 직접 입력 필드 */}
                    {onboardingData.acquisitionChannel === "OTHER" && (
                      <input
                        type="text"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
                        placeholder="어떻게 알게 되셨는지 입력해 주세요"
                        value={onboardingData.acquisitionChannelEtc}
                        onChange={(e) =>
                          setOnboardingData((prev) => ({
                            ...prev,
                            acquisitionChannelEtc: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>

                  {/* 한글 설명: 예산 범위 */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500">
                      평소 후원 예산 범위
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {BUDGET_RANGE_OPTIONS.map((option) => {
                        const isSelected =
                          onboardingData.budgetRange === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setOnboardingData((prev) => ({
                                ...prev,
                                budgetRange: option.value,
                              }));
                            }}
                            className={`rounded-full border px-3 py-1 text-xs ${
                              isSelected
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 한글 설명: 후원 경험 */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500">
                      크라우드펀딩 후원 경험
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FUNDING_EXPERIENCE_OPTIONS.map((option) => {
                        const isSelected =
                          onboardingData.fundingExperience === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setOnboardingData((prev) => ({
                                ...prev,
                                fundingExperience: option.value,
                              }));
                            }}
                            className={`rounded-full border px-3 py-1 text-xs ${
                              isSelected
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 한글 설명: 온보딩 데이터 저장 버튼 */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!userId) {
                          alert("로그인이 필요한 기능입니다.");
                          return;
                        }

                        setSavingOnboarding(true);
                        try {
                          // 한글 설명: Step1 저장 (관심 카테고리 + 선호 스타일)
                          const interestCategories: ProjectCategory[] =
                            form.interests.map((label) =>
                              categoryLabelToEnum(label)
                            );
                          await saveSupporterOnboardingStep1({
                            interestCategories,
                            preferredStyles:
                              onboardingData.preferredStyles.size > 0
                                ? Array.from(onboardingData.preferredStyles)
                                : undefined,
                          });

                          // 한글 설명: Step2 저장 (알림설정 제외)
                          await saveSupporterOnboardingStep2({
                            budgetRange: onboardingData.budgetRange,
                            fundingExperience: onboardingData.fundingExperience,
                            acquisitionChannel:
                              onboardingData.acquisitionChannel,
                            acquisitionChannelEtc:
                              onboardingData.acquisitionChannel === "OTHER" &&
                              onboardingData.acquisitionChannelEtc.trim()
                                ? onboardingData.acquisitionChannelEtc.trim()
                                : null,
                            // 한글 설명: 알림설정은 제외 (수정 불가)
                          });

                          alert("온보딩 선택사항이 저장되었습니다.");
                        } catch (error) {
                          console.error("온보딩 데이터 저장 실패", error);
                          alert(
                            error instanceof Error
                              ? error.message
                              : "온보딩 선택사항 저장 중 문제가 발생했습니다."
                          );
                        } finally {
                          setSavingOnboarding(false);
                        }
                      }}
                      disabled={savingOnboarding || loadingOnboarding}
                      className="rounded-full border border-neutral-900 px-4 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white disabled:opacity-60"
                    >
                      {savingOnboarding
                        ? "저장 중..."
                        : "온보딩 선택사항 저장"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 액션 */}
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="rounded-full border border-neutral-900 px-4 py-2 font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "저장 중..." : "변경 사항 저장"}
              </button>
              <button
                type="button"
                onClick={handleResetToServer}
                className="rounded-full border border-neutral-200 px-4 py-2 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
              >
                취소
              </button>
            </div>
          </form>
        </section>

        {/* 한글 설명: 관심사 & 추천 설정 섹션 */}
        <SupporterOnboardingSummarySection />
      </div>
    </Container>
  );
};
