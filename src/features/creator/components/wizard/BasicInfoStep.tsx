import React from "react";
import type { BasicInfoState } from "../../hooks/useCreatorWizard";

type BasicInfoStepProps = {
  basic: BasicInfoState;
  categoryOptions: readonly string[];
  tagSuggestions: readonly string[];
  tagInput: string;
  maxTags: number;
  maxTagLength: number;
  maxCoverImages: number;
  onBasicChange: (field: keyof BasicInfoState, value: string) => void;
  onTagInputChange: (value: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onCoverUpload: (files: FileList | null) => void;
  onSelectCover: (image: string) => void;
  onRemoveCoverImage: (image: string) => void;
  resolveCoverImageSrc: (url: string | null | undefined) => string | undefined;
  onGenerateAI?: (imageFile: File) => void; // 한글 설명: AI 설명 생성 함수
  isGeneratingAI?: boolean; // 한글 설명: AI 생성 중 로딩 상태
};

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  basic,
  categoryOptions,
  tagSuggestions,
  tagInput,
  maxTags,
  maxTagLength,
  maxCoverImages,
  onBasicChange,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onCoverUpload,
  onSelectCover,
  onRemoveCoverImage,
  resolveCoverImageSrc,
  onGenerateAI,
  isGeneratingAI = false,
}) => {
  // 한글 설명: 이미지 파일 input ref
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  // 한글 설명: 선택된 이미지 파일 상태
  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(
    null
  );

  // 한글 설명: 이미지 선택 핸들러
  // 여러 이미지를 선택해도 첫 번째 이미지(대표 이미지)만 AI 생성에 사용
  const handleImageSelect = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]; // 한글 설명: 첫 번째 파일만 선택 (대표 이미지)
      if (file && file.type.startsWith("image/")) {
        setSelectedImageFile(file); // 한글 설명: AI 생성용으로 첫 번째 이미지 저장
        // 한글 설명: 모든 이미지는 갤러리에 업로드되지만, AI는 대표 이미지만 사용
        onCoverUpload(event.target.files);
      } else {
        setSelectedImageFile(null);
      }
      // 한글 설명: input 초기화
      if (event.target.value) {
        event.target.value = "";
      }
    },
    [onCoverUpload]
  );

  // 한글 설명: AI 설명 생성 핸들러
  const handleGenerateAI = React.useCallback(async () => {
    if (!onGenerateAI) return;

    // 한글 설명: 대표 이미지(coverImageUrl)를 우선 사용
    // - 여러 이미지를 업로드해도 대표 이미지만 AI에 전송
    // - selectedImageFile이 있으면 사용, 없으면 coverImageUrl에서 이미지 가져오기
    let imageFile: File | null = selectedImageFile;

    if (!imageFile && basic.coverImageUrl) {
      // 한글 설명: coverImageUrl에서 이미지 가져오기 (fetch 사용)
      try {
        const response = await fetch(
          resolveCoverImageSrc(basic.coverImageUrl) ?? basic.coverImageUrl
        );
        const blob = await response.blob();
        const fileName = basic.coverImageUrl.split("/").pop() || "image.jpg";
        imageFile = new File([blob], fileName, { type: blob.type });
      } catch (error) {
        console.error("이미지 가져오기 실패", error);
        alert("이미지를 가져오는데 실패했습니다. 다시 시도해 주세요.");
        return;
      }
    }

    if (!imageFile) {
      alert("이미지를 먼저 업로드해 주세요.");
      return;
    }

    // 한글 설명: AI API는 한 번에 하나의 이미지만 처리하므로 대표 이미지만 전송
    onGenerateAI(imageFile);
  }, [
    selectedImageFile,
    basic.coverImageUrl,
    onGenerateAI,
    resolveCoverImageSrc,
  ]);
  return (
    <section className="space-y-6 rounded-3xl border border-neutral-200 p-6">
      {/* 제목 / 요약 */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            className="text-xs font-medium text-neutral-500"
            htmlFor="wizard-title"
          >
            프로젝트 제목
          </label>
          <input
            id="wizard-title"
            value={basic.title}
            onChange={(event) => onBasicChange("title", event.target.value)}
            placeholder="프로젝트의 핵심 메시지를 30자 이내로 정리해 주세요."
            className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-xs font-medium text-neutral-500"
            htmlFor="wizard-summary"
          >
            요약 소개
          </label>
          <textarea
            id="wizard-summary"
            rows={3}
            value={basic.summary}
            onChange={(event) => onBasicChange("summary", event.target.value)}
            placeholder="한 문단으로 프로젝트를 소개해 주세요. 어떤 문제를 해결하며, 서포터는 어떤 가치를 얻게 되나요?"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* 카테고리 / 태그 */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            className="text-xs font-medium text-neutral-500"
            htmlFor="wizard-category"
          >
            카테고리
          </label>
          <select
            id="wizard-category"
            value={basic.category}
            onChange={(event) => onBasicChange("category", event.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
          >
            <option value="">카테고리를 선택하세요</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            className="text-xs font-medium text-neutral-500"
            htmlFor="wizard-tags"
          >
            검색 태그
          </label>
          <div className="flex gap-2">
            <input
              id="wizard-tags"
              value={tagInput}
              onChange={(event) => onTagInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onAddTag(event.currentTarget.value);
                }
              }}
              placeholder="예: 친환경, 여행, 스마트홈"
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => onAddTag(tagInput)}
              className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              추가
            </button>
          </div>
          <p className="text-[11px] text-neutral-400">
            태그는 최대 {maxTags}개까지 추가할 수 있으며, 각 태그는{" "}
            {maxTagLength}자 이내로 입력해 주세요.
          </p>
        </div>

        {basic.tags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-500">선택한 태그</p>
            <div className="flex flex-wrap gap-2">
              {basic.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => onRemoveTag(tag)}
                    className="text-white/70 transition hover:text-white"
                    aria-label={`${tag} 태그 제거`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-medium text-neutral-500">태그 추천</p>
          <div className="flex flex-wrap gap-2">
            {tagSuggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onAddTag(tag)}
                className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 대표 이미지 / 갤러리 */}
      <div className="space-y-4">
        <div className="overflow-hidden rounded-3xl border border-dashed border-neutral-200">
          <div className="relative aspect-4/3 bg-neutral-100">
            <img
              src={
                resolveCoverImageSrc(basic.coverImageUrl) ??
                basic.coverImageUrl ??
                ""
              }
              alt="프로젝트 대표 이미지 미리보기"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
          </div>
          <div className="space-y-3 p-4">
            <p className="text-sm font-semibold text-neutral-900">
              대표 이미지
            </p>
            <p className="text-xs text-neutral-500">
              1200 × 675px 이상의 가로 이미지를 권장해요. 처음 업로드한 사진이
              자동으로 대표 이미지가 됩니다.
            </p>
            <div className="flex gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700">
                이미지 업로드
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>
              {(selectedImageFile || basic.coverImageUrl) && onGenerateAI && (
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGeneratingAI ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      AI 생성 중...
                    </>
                  ) : (
                    "AI로 설명 채우기"
                  )}
                </button>
              )}
            </div>
            <p className="text-[11px] text-neutral-400">
              이미지는 최대 {maxCoverImages}장까지 등록할 수 있습니다.
            </p>
          </div>
        </div>

        {basic.coverGallery.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-500">
              업로드한 이미지
            </p>
            <div className="grid grid-cols-2 gap-3">
              {basic.coverGallery.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="space-y-2 rounded-2xl border border-neutral-200 p-3"
                >
                  <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-neutral-100">
                    <img
                      src={resolveCoverImageSrc(image) ?? image}
                      alt={`프로젝트 이미지 ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {basic.coverImageUrl === image && (
                      <span className="absolute left-2 top-2 rounded-full bg-neutral-900 px-2 py-1 text-[11px] font-semibold text-white">
                        대표
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 text-xs">
                    {basic.coverImageUrl !== image && (
                      <button
                        type="button"
                        onClick={() => onSelectCover(image)}
                        className="flex-1 rounded-full border border-neutral-200 px-3 py-1 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                      >
                        대표로 사용
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveCoverImage(image)}
                      className="flex-1 rounded-full border border-neutral-200 px-3 py-1 text-neutral-500 hover:border-red-400 hover:text-red-500"
                    >
                      제거
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
