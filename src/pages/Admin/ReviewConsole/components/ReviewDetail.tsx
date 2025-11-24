// 한글 설명: 심사 상세 컴포넌트 (우측)
import React, { useRef, useState, useEffect } from "react";
import { StatusBadge } from "./StatusBadge";
import { ChecklistSection } from "./ChecklistSection";
import { AutoCheckSection } from "./AutoCheckSection";
import { RejectReasonSection } from "./RejectReasonSection";
import { currencyKRW } from "../../../../shared/utils/format";
import type {
  AdminProjectDetailDTO,
  AdminMakerProfileDTO,
} from "../../../../features/admin/types";
import { fetchAdminMakerProfile } from "../../../../features/admin/api/adminProjectsService";

interface ReviewDetailProps {
  detail: AdminProjectDetailDTO | null;
  selectedProject: { id: string; title: string; makerName: string; requestAt?: string } | null;
  checks: boolean[];
  onToggleCheck: (index: number) => void;
  saveChecklist: boolean;
  onSaveChecklistChange: (value: boolean) => void;
  reasonPreset: string;
  onPresetChange: (preset: string) => void;
  reasonText: string;
  onReasonTextChange: (text: string) => void;
  onScrollToAction: () => void;
  onRejectClick: () => void;
  onApproveClick: () => void;
  isProcessing: boolean;
  rejectPresets: readonly string[];
}

// 한글 설명: 자동 점검 로직 (서버에서 제공하지 않을 경우 클라이언트에서 체크)
function localAutoChecks(detail: AdminProjectDetailDTO | null): string[] {
  if (!detail) return [];

  const issues: string[] = [];
  const story = detail.storyMarkdown || "";

  // 한글 설명: 스토리 길이 체크
  if (story.length < 120) {
    issues.push("스토리 분량 부족 (120자 미만)");
  }

  // 한글 설명: 환불/교환 안내 체크
  const storyLower = story.toLowerCase();
  if (!/환불|교환/.test(storyLower)) {
    issues.push("스토리에 교환/환불 안내 없음");
  }

  // 한글 설명: 리워드 정책 체크
  const missingPolicy = (detail.rewards || []).some(
    (r) => !r.description || !r.estShippingMonth
  );
  if (missingPolicy) {
    issues.push("일부 리워드에 배송/교환 환불 정책 누락");
  }

  return issues;
}

export const ReviewDetail: React.FC<ReviewDetailProps> = ({
  detail,
  selectedProject,
  checks,
  onToggleCheck,
  saveChecklist,
  onSaveChecklistChange,
  reasonPreset,
  onPresetChange,
  reasonText,
  onReasonTextChange,
  onScrollToAction,
  onRejectClick,
  onApproveClick,
  isProcessing,
  rejectPresets,
}) => {
  const actionRef = useRef<HTMLDivElement | null>(null);
  const [memoHighlight, setMemoHighlight] = useState(false);
  const [actionHighlight, setActionHighlight] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<string[]>([]);
  const [makerProfile, setMakerProfile] = useState<AdminMakerProfileDTO | null>(
    null
  );
  const [makerProfileLoading, setMakerProfileLoading] = useState(false);

  // 한글 설명: 자동 점검 이슈 (서버에서 제공하지 않으면 로컬 체크)
  const autoIssues = detail ? (detail as any).autoChecks || localAutoChecks(detail) : [];

  const handleScrollToReject = () => {
    actionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setPresetOpen(true);
    setMemoHighlight(true);
    setTimeout(() => setMemoHighlight(false), 2000);
  };

  const handleScrollToAction = () => {
    actionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setActionHighlight(true);
    setTimeout(() => setActionHighlight(false), 1600);
  };

  const toggleAccordion = (value: string) => {
    setAccordionOpen((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const CHECK_ITEMS = [
    "사업자/연락처 확인",
    "스토리 가이드 준수",
    "리워드 배송/교환/환불 고지",
    "금지 콘텐츠/정책 위반 여부",
  ];

  // 한글 설명: 메이커 프로필 조회
  useEffect(() => {
    if (!detail?.makerId) return;
    setMakerProfileLoading(true);
    fetchAdminMakerProfile(detail.makerId)
      .then((profile) => {
        setMakerProfile(profile);
      })
      .catch((error) => {
        console.error("메이커 프로필 조회 실패", error);
        setMakerProfile(null);
      })
      .finally(() => {
        setMakerProfileLoading(false);
      });
  }, [detail?.makerId]);

  return (
    <div className="col-span-8 flex h-[72vh] flex-col rounded-3xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 p-4">
        <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          심사 상세
        </h2>
      </div>
      <div className="grid grid-cols-12 gap-4 flex-1 overflow-hidden p-4">
        {/* 메이커 카드 */}
        <div className="col-span-4 space-y-3 overflow-y-auto">
          <div className="text-sm font-semibold text-neutral-900">메이커 정보</div>
          {makerProfileLoading ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-3 text-sm text-center text-neutral-500">
              메이커 정보 로딩 중...
            </div>
          ) : makerProfile ? (
            <div className="space-y-3">
              {/* 한글 설명: 기본 정보 */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm">
                <h3 className="font-semibold text-neutral-900 mb-3">기본 정보</h3>
                <dl className="space-y-2 text-xs">
                  <div>
                    <dt className="text-neutral-500">메이커명</dt>
                    <dd className="mt-0.5 font-medium text-neutral-900">
                      {makerProfile.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">메이커 타입</dt>
                    <dd className="mt-0.5 text-neutral-700">
                      {makerProfile.makerType === "BUSINESS" ? "사업자" : "개인"}
                    </dd>
                  </div>
                  {makerProfile.makerType === "BUSINESS" && (
                    <>
                      {makerProfile.businessName && (
                        <div>
                          <dt className="text-neutral-500">사업자명</dt>
                          <dd className="mt-0.5 text-neutral-700">
                            {makerProfile.businessName}
                          </dd>
                        </div>
                      )}
                      {makerProfile.businessNumber && (
                        <div>
                          <dt className="text-neutral-500">사업자번호</dt>
                          <dd className="mt-0.5 text-neutral-700">
                            {makerProfile.businessNumber}
                          </dd>
                        </div>
                      )}
                      {makerProfile.businessType && (
                        <div>
                          <dt className="text-neutral-500">업태</dt>
                          <dd className="mt-0.5 text-neutral-700">
                            {makerProfile.businessType}
                          </dd>
                        </div>
                      )}
                      {makerProfile.onlineSalesReportNumber && (
                        <div>
                          <dt className="text-neutral-500">통신판매업 신고번호</dt>
                          <dd className="mt-0.5 text-neutral-700">
                            {makerProfile.onlineSalesReportNumber}
                          </dd>
                        </div>
                      )}
                      {makerProfile.representative && (
                        <div>
                          <dt className="text-neutral-500">대표자</dt>
                          <dd className="mt-0.5 text-neutral-700">
                            {makerProfile.representative}
                          </dd>
                        </div>
                      )}
                      {makerProfile.establishedAt && (
                        <div>
                          <dt className="text-neutral-500">설립일</dt>
                          <dd className="mt-0.5 text-neutral-700">
                            {makerProfile.establishedAt}
                          </dd>
                        </div>
                      )}
                      {makerProfile.industryType && (
                        <div>
                          <dt className="text-neutral-500">업종</dt>
                          <dd className="mt-0.5 text-neutral-700">
                            {makerProfile.industryType}
                          </dd>
                        </div>
                      )}
                      {makerProfile.location && (
                        <div>
                          <dt className="text-neutral-500">소재지</dt>
                          <dd className="mt-0.5 text-neutral-700">
                            {makerProfile.location}
                          </dd>
                        </div>
                      )}
                    </>
                  )}
                </dl>
              </div>

              {/* 한글 설명: 연락처 정보 */}
              {(makerProfile.contactEmail || makerProfile.contactPhone) && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm">
                  <h3 className="font-semibold text-neutral-900 mb-3">연락처</h3>
                  <dl className="space-y-2 text-xs">
                    {makerProfile.contactEmail && (
                      <div>
                        <dt className="text-neutral-500">이메일</dt>
                        <dd className="mt-0.5 text-neutral-700">
                          {makerProfile.contactEmail}
                        </dd>
                      </div>
                    )}
                    {makerProfile.contactPhone && (
                      <div>
                        <dt className="text-neutral-500">전화번호</dt>
                        <dd className="mt-0.5 text-neutral-700">
                          {makerProfile.contactPhone}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {/* 한글 설명: 메이커 소개 */}
              {(makerProfile.productIntro || makerProfile.coreCompetencies) && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm">
                  <h3 className="font-semibold text-neutral-900 mb-3">메이커 소개</h3>
                  <div className="space-y-2 text-xs">
                    {makerProfile.productIntro && (
                      <div>
                        <p className="text-neutral-500 mb-1">제품 소개</p>
                        <p className="text-neutral-700 whitespace-pre-wrap">
                          {makerProfile.productIntro}
                        </p>
                      </div>
                    )}
                    {makerProfile.coreCompetencies && (
                      <div>
                        <p className="text-neutral-500 mb-1">핵심 역량</p>
                        <p className="text-neutral-700 whitespace-pre-wrap">
                          {makerProfile.coreCompetencies}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 한글 설명: 프로젝트 정보 요약 */}
              <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-3 text-sm">
                <div className="text-xs text-neutral-500 mb-2">프로젝트 정보</div>
                <div className="text-xs text-neutral-500">
                  프로젝트 상태:{" "}
                  <StatusBadge
                    kind={
                      detail?.status === "REVIEW" ||
                      (detail as any)?.reviewStatus === "REVIEW"
                        ? "REVIEW"
                        : detail?.status === "APPROVED" ||
                          (detail as any)?.reviewStatus === "APPROVED"
                          ? "APPROVED"
                          : detail?.status === "REJECTED" ||
                            (detail as any)?.reviewStatus === "REJECTED"
                            ? "REJECTED"
                            : "REVIEW"
                    }
                  />
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  프로젝트 ID: {selectedProject?.id ?? detail?.id ?? "–"}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  공개 일정: {detail?.startDate ?? "–"} → {detail?.endDate ?? "–"}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-3 text-sm">
              <div className="font-medium text-neutral-900">
                {detail?.makerName ?? selectedProject?.makerName ?? "–"}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                메이커 상세 정보를 불러올 수 없습니다.
              </div>
            </div>
          )}
          <ChecklistSection
            items={CHECK_ITEMS}
            checks={checks}
            onToggle={onToggleCheck}
            saveChecklist={saveChecklist}
            onSaveChecklistChange={onSaveChecklistChange}
          />
        </div>

        {/* 프로젝트 요약 + 액션 */}
        <div className="col-span-8 flex flex-col h-full">
          <div className="flex items-center justify-between pb-2">
            <div>
              <div className="text-sm text-neutral-500">프로젝트</div>
              <div className="text-lg font-semibold text-neutral-900">
                {detail?.title ?? selectedProject?.title ?? "항목을 선택하세요"}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleScrollToReject}
                className="flex items-center gap-1 rounded border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                title="반려 사유 작성 영역으로 이동"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                반려 사유 작성
              </button>
              <button
                type="button"
                onClick={handleScrollToAction}
                className="flex items-center gap-1 rounded border border-neutral-900 bg-neutral-900 px-2 py-1 text-xs text-white transition hover:bg-neutral-800"
                title="승인/반려 최종 처리 영역으로 이동"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                승인/반려 처리로 이동
              </button>
            </div>
          </div>
          <div className="border-t border-neutral-200"></div>

          {/* 상단 요약 카드 */}
          <div className="grid grid-cols-3 gap-3 py-3 text-sm">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              <div className="text-xs text-neutral-500">라이프사이클</div>
              <div className="mt-1">
                <StatusBadge kind={detail?.status ?? "DRAFT"} />
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              <div className="text-xs text-neutral-500">심사상태</div>
              <div className="mt-1">
                <StatusBadge
                  kind={
                    (detail as any)?.reviewStatus ??
                    (detail?.status === "REVIEW" ? "REVIEW" : "REVIEW")
                  }
                />
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              <div className="text-xs text-neutral-500">예정기간</div>
              <div className="mt-1 flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {detail?.startDate ?? "–"} ~ {detail?.endDate ?? "–"}
              </div>
            </div>
          </div>

          {/* 자동 점검 결과 */}
          <AutoCheckSection issues={autoIssues} />

          {/* 프로젝트 기본 정보 */}
          <div className="space-y-3 mb-3">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
              <h3 className="font-semibold text-neutral-900 mb-3">프로젝트 기본 정보</h3>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-neutral-500">제목</dt>
                  <dd className="mt-1 font-medium text-neutral-900">
                    {detail?.title ?? "–"}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500">카테고리</dt>
                  <dd className="mt-1 text-neutral-700">{detail?.category ?? "–"}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">목표 금액</dt>
                  <dd className="mt-1 font-medium text-neutral-900">
                    {detail?.goalAmount ? currencyKRW(detail.goalAmount) : "–"}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500">태그</dt>
                  <dd className="mt-1 text-neutral-700">
                    {detail?.tags?.length
                      ? detail.tags.join(", ")
                      : "태그 없음"}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-neutral-500">요약</dt>
                  <dd className="mt-1 text-neutral-700 whitespace-pre-wrap">
                    {detail?.summary ?? "요약 없음"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* 커버 이미지 */}
            {detail && (detail.coverImageUrl || (detail.coverGallery && detail.coverGallery.length > 0)) && (
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">커버 이미지</h3>
                <div className="grid grid-cols-2 gap-2">
                  {detail.coverImageUrl && (
                    <div className="overflow-hidden rounded-xl">
                      <img
                        src={detail.coverImageUrl}
                        alt="커버 이미지"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  {detail.coverGallery?.map((img, idx) => (
                    <div key={idx} className="overflow-hidden rounded-xl">
                      <img
                        src={img}
                        alt={`갤러리 이미지 ${idx + 1}`}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 아코디언: 스토리, 리워드 */}
          <div className="space-y-2 mb-3">
            {/* 스토리 */}
            <div className="border border-neutral-200 rounded-xl">
              <button
                type="button"
                onClick={() => toggleAccordion("story")}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-neutral-900"
              >
                <span>프로젝트 스토리 (마크다운)</span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    accordionOpen.includes("story") ? "rotate-180" : ""
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
              {accordionOpen.includes("story") && (
                <div className="p-3 border-t border-neutral-200">
                  <div className="p-3 rounded-xl bg-white border border-neutral-200 max-h-96 overflow-auto text-sm whitespace-pre-wrap">
                    {detail?.storyMarkdown ?? "스토리 없음"}
                  </div>
                </div>
              )}
            </div>

            {/* 리워드 */}
            <div className="border border-neutral-200 rounded-xl">
              <button
                type="button"
                onClick={() => toggleAccordion("rewards")}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-neutral-900"
              >
                <span>리워드 상세 정보 ({detail?.rewards?.length ?? 0}개)</span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    accordionOpen.includes("rewards") ? "rotate-180" : ""
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
              {accordionOpen.includes("rewards") && (
                <div className="p-3 border-t border-neutral-200">
                  <div className="space-y-3">
                    {detail?.rewards && detail.rewards.length > 0 ? (
                      detail.rewards.map((r) => (
                        <div
                          key={r.id}
                          className="rounded-xl border border-neutral-200 bg-white p-4 text-sm"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-neutral-900">
                              {r.title}
                            </h4>
                            <span className="font-medium text-neutral-900">
                              {currencyKRW(r.price)}
                            </span>
                          </div>
                          {r.description && (
                            <p className="text-xs text-neutral-600 mb-3 whitespace-pre-wrap">
                              {r.description}
                            </p>
                          )}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {r.limitQty !== null && (
                              <div>
                                <span className="text-neutral-500">수량 제한:</span>{" "}
                                <span className="text-neutral-700">
                                  {r.limitQty}개
                                </span>
                              </div>
                            )}
                            {r.estShippingMonth && (
                              <div>
                                <span className="text-neutral-500">예상 배송:</span>{" "}
                                <span className="text-neutral-700">
                                  {r.estShippingMonth}
                                </span>
                              </div>
                            )}
                            <div>
                              <span className="text-neutral-500">판매 가능:</span>{" "}
                              <span className="text-neutral-700">
                                {r.available ? "예" : "아니오"}
                              </span>
                            </div>
                            {r.remainingQty !== null && (
                              <div>
                                <span className="text-neutral-500">남은 수량:</span>{" "}
                                <span className="text-neutral-700">
                                  {r.remainingQty}개
                                </span>
                              </div>
                            )}
                          </div>
                          {r.optionConfig && r.optionConfig.hasOptions && (
                            <div className="mt-3 pt-3 border-t border-neutral-200">
                              <p className="text-xs font-medium text-neutral-500 mb-2">
                                옵션 구성:
                              </p>
                              <div className="space-y-1 text-xs text-neutral-600">
                                {r.optionConfig.options?.map((opt, idx) => (
                                  <div key={idx} className="pl-2">
                                    <span className="font-medium">{opt.name}</span>{" "}
                                    ({opt.type === "select" ? "선택" : "텍스트"})
                                    {opt.type === "select" && opt.choices && (
                                      <span className="text-neutral-500">
                                        {" "}
                                        - {opt.choices.join(", ")}
                                      </span>
                                    )}
                                    {opt.required && (
                                      <span className="text-red-500"> (필수)</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-500 text-center py-4">
                        리워드가 등록되지 않았습니다.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 반려 사유 프리셋 & 메모 */}
          <RejectReasonSection
            presets={rejectPresets}
            selectedPreset={reasonPreset}
            onPresetChange={onPresetChange}
            reasonText={reasonText}
            onReasonTextChange={onReasonTextChange}
            highlight={memoHighlight}
            onPresetOpenChange={setPresetOpen}
          />

          {/* 액션 영역 */}
          <div
            ref={actionRef}
            className={`mt-auto flex items-center justify-between pt-3 rounded-xl transition ${
              actionHighlight ? "ring-2 ring-sky-300 bg-sky-50" : ""
            }`}
          >
            <div className="text-xs text-neutral-400">
              요청시각:{" "}
              {selectedProject?.requestAt
                ? new Date(selectedProject.requestAt).toLocaleString("ko-KR")
                : "–"}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onRejectClick}
                disabled={!reasonText.trim() || isProcessing}
                className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:border-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title={!reasonText.trim() ? "반려 사유를 입력해 주세요" : ""}
              >
                <span className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  반려 처리
                </span>
              </button>
              <button
                type="button"
                onClick={onApproveClick}
                disabled={isProcessing || !detail}
                className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  승인 처리
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

