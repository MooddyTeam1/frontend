import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { currencyKRW } from "../../shared/utils/format";
import {
  useCreatorWizard,
  CATEGORY_OPTIONS,
  TAG_SUGGESTIONS,
  GUIDE_SECTIONS,
  MAX_COVER_IMAGES,
  MAX_TAGS,
  MAX_TAG_LENGTH,
} from "../../features/creator/hooks/useCreatorWizard";
import { WizardStepper } from "../../features/creator/components/wizard/Stepper";
import { BasicInfoStep } from "../../features/creator/components/wizard/BasicInfoStep";
import { StoryStep } from "../../features/creator/components/wizard/StoryStep";
import { GoalStep } from "../../features/creator/components/wizard/GoalStep";
import { RewardStep } from "../../features/creator/components/wizard/RewardStep";

type CreatorWizardLocationState =
  | {
      draftId?: string;
      remoteProjectId?: string;
    }
  | undefined;

export const CreatorWizardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const locationState =
    (location.state as CreatorWizardLocationState) ?? undefined;
  const initialDraftId = locationState?.draftId ?? projectId;
  const initialRemoteProjectId = locationState?.remoteProjectId ?? projectId;

  const {
    step,
    steps,
    progress,
    errors,
    basic,
    story,
    goal,
    rewards,
    tagInput,
    averageRewardPrice,
    estimatedBackersNeeded,
    fundingDuration,
    setStory,
    setTagInput,
    updateBasicField,
    addTag,
    removeTag,
    uploadCover,
    selectCoverImage,
    removeCoverImage,
    updateGoalField,
    addReward,
    updateReward,
    removeReward,
    goNext,
    goPrev,
    selectStep,
    isSavingDraft,
    resolveCoverImageUrl,
    isRequestingReview,
    saveDraft,
    requestReview,
    remoteProjectId,
    deleteProject,
    generateAIDescription,
    isGeneratingAI,
  } = useCreatorWizard({
    initialDraftId,
    initialRemoteProjectId,
  });

  React.useEffect(() => {
    if (!remoteProjectId) return;
    if (projectId === remoteProjectId) return;
    navigate(`/creator/projects/new/${remoteProjectId}`, {
      replace: true,
      state: {
        draftId: initialDraftId ?? remoteProjectId,
        remoteProjectId,
      },
    });
  }, [remoteProjectId, projectId, navigate, initialDraftId]);

  const isLastStep = step === steps.length;

  return (
    <div className="bg-neutral-50 pb-16 pt-10">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* 한글 설명: 스토리 구성 가이드 (Container 왼쪽 경계 바로 옆에 배치) */}
        {step === 2 && (
          <aside className="absolute -left-[196px] top-80 hidden xl:block">
            <div className="sticky top-6 w-[180px] rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="mb-3 text-xs font-semibold text-neutral-900">
                스토리 구성 가이드
              </p>
              <ul className="space-y-2.5 text-[11px] text-neutral-600">
                <li>
                  <span className="font-medium text-neutral-900">
                    1. 왜 이 프로젝트인가요?
                  </span>
                  <p className="mt-1 leading-relaxed">
                    문제의식과 아이디어가 탄생한 배경을 설명해주세요.
                  </p>
                </li>
                <li>
                  <span className="font-medium text-neutral-900">
                    2. 무엇을 제공하나요?
                  </span>
                  <p className="mt-1 leading-relaxed">
                    리워드 구성과 핵심 스펙, 차별점을 구체적으로 적어주세요.
                  </p>
                </li>
                <li>
                  <span className="font-medium text-neutral-900">
                    3. 어떻게 만들고 전달하나요?
                  </span>
                  <p className="mt-1 leading-relaxed">
                    제작 일정, 검수 절차, 배송 계획을 단계별로 안내하면 신뢰도가
                    높아집니다.
                  </p>
                </li>
                <li>
                  <span className="font-medium text-neutral-900">
                    4. 위험 요소와 대응
                  </span>
                  <p className="mt-1 leading-relaxed">
                    예상 가능한 리스크와 대응 방안을 함께 안내하세요.
                  </p>
                </li>
              </ul>
            </div>
          </aside>
        )}

        <div className="space-y-8">
          {/* 헤더 */}
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              프로젝트 만들기
            </p>
            <h1 className="text-2xl font-semibold text-neutral-900 md:text-3xl">
              새로운 프로젝트 초안 작성
            </h1>
            <p className="text-sm text-neutral-600">
              기본 정보부터 리워드 구성까지 순서대로 작성하면 돼요. 작성 중인
              내용은 언제든지 임시 저장할 수 있습니다.
            </p>
          </header>

          {/* 상단 스텝퍼 */}
          <WizardStepper
            steps={steps}
            currentStep={step}
            progress={progress}
            onSelect={selectStep}
          />

          {/* 에러 메시지 */}
          {errors.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              <p className="font-semibold">확인해야 할 항목이 있어요</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 본문 */}
          <div
            className={`grid gap-6 ${
              step === 2
                ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)]"
                : "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
            }`}
          >
            <div className="space-y-6">
              {step === 1 && (
                <BasicInfoStep
                  basic={basic}
                  categoryOptions={CATEGORY_OPTIONS}
                  tagSuggestions={TAG_SUGGESTIONS}
                  tagInput={tagInput}
                  maxTags={MAX_TAGS}
                  maxTagLength={MAX_TAG_LENGTH}
                  maxCoverImages={MAX_COVER_IMAGES}
                  onBasicChange={updateBasicField}
                  onTagInputChange={setTagInput}
                  onAddTag={addTag}
                  onRemoveTag={removeTag}
                  onCoverUpload={uploadCover}
                  onSelectCover={selectCoverImage}
                  onRemoveCoverImage={removeCoverImage}
                  resolveCoverImageSrc={resolveCoverImageUrl}
                  onGenerateAI={generateAIDescription}
                  isGeneratingAI={isGeneratingAI}
                />
              )}

              {step === 2 && <StoryStep story={story} onChange={setStory} />}

              {step === 3 && (
                <GoalStep
                  goal={goal}
                  averageRewardPrice={averageRewardPrice}
                  estimatedBackersNeeded={estimatedBackersNeeded}
                  fundingDuration={fundingDuration}
                  onChange={updateGoalField}
                />
              )}

              {step === 4 && (
                <RewardStep
                  rewards={rewards}
                  onAddReward={addReward}
                  onChangeReward={updateReward}
                  onRemoveReward={removeReward}
                />
              )}
            </div>

            {/* 우측 요약/가이드 */}
            <aside className="space-y-4">
              <section className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-4 text-xs">
                <p className="text-sm font-semibold text-neutral-900">
                  프로젝트 요약
                </p>
                <dl className="space-y-1 text-neutral-600">
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-neutral-500">제목</dt>
                    <dd className="flex-1 text-right text-xs">
                      {basic.title || "미입력"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-neutral-500">카테고리</dt>
                    <dd className="flex-1 text-right text-xs">
                      {basic.category || "미선택"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-neutral-500">목표 금액</dt>
                    <dd className="flex-1 text-right text-xs">
                      {goal.goalAmount > 0
                        ? currencyKRW(goal.goalAmount)
                        : "미설정"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-neutral-500">예상 서포터</dt>
                    <dd className="flex-1 text-right text-xs">
                      {goal.goalAmount > 0 && estimatedBackersNeeded > 0
                        ? `${estimatedBackersNeeded.toLocaleString()}명`
                        : "-"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-neutral-500">펀딩 기간</dt>
                    <dd className="flex-1 text-right text-xs">
                      {fundingDuration ? `${fundingDuration}일` : "날짜 미설정"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-neutral-500">리워드 개수</dt>
                    <dd className="flex-1 text-right text-xs">
                      {rewards.length}개
                    </dd>
                  </div>
                </dl>
              </section>

              {step === 4 && (
                <section className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-4 text-xs">
                  <p className="text-sm font-semibold text-neutral-900">
                    옵션 설계 가이드
                  </p>
                  <ul className="space-y-2">
                    {GUIDE_SECTIONS.map((section) => (
                      <li key={section.title}>
                        <p className="text-[11px] font-semibold text-neutral-900">
                          {section.title}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-600">
                          {section.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </aside>
          </div>

          {/* 하단 액션 바 */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-xs">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={goPrev}
                disabled={step === 1}
                className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                이전 단계
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
              >
                {isLastStep ? "검토 전 마지막 확인" : "다음 단계"}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveDraft}
                disabled={isSavingDraft}
                className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingDraft ? "임시 저장 중..." : "임시 저장"}
              </button>
              {/* 한글 설명: 원격 프로젝트가 있을 때만 삭제 버튼 표시 */}
              {remoteProjectId && (
                <button
                  type="button"
                  onClick={deleteProject}
                  className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 hover:border-red-300 hover:bg-red-100"
                >
                  프로젝트 삭제
                </button>
              )}
              <button
                type="button"
                onClick={requestReview}
                disabled={isRequestingReview}
                className="rounded-full border border-emerald-700 bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRequestingReview ? "검토 요청 중..." : "검토 요청 보내기"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
