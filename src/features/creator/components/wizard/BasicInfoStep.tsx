import React from "react";
import type { BasicInfoState } from "../../../hooks/useCreatorWizard";

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
}) => {
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
          <div className="relative aspect-[4/3] bg-neutral-100">
            <img
              src={basic.coverImageUrl}
              alt="프로젝트 대표 이미지 미리보기"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
          <div className="space-y-3 p-4">
            <p className="text-sm font-semibold text-neutral-900">
              대표 이미지
            </p>
            <p className="text-xs text-neutral-500">
              1200 × 675px 이상의 가로 이미지를 권장해요. 처음 업로드한 사진이
              자동으로 대표 이미지가 됩니다.
            </p>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700">
              이미지 업로드
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  onCoverUpload(event.target.files);
                  if (event.target.value) {
                    event.target.value = "";
                  }
                }}
              />
            </label>
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
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                    <img
                      src={image}
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
