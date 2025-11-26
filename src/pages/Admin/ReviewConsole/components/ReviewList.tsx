// 한글 설명: 심사 대기 목록 컴포넌트 (좌측)
import React from "react";
import { StatusBadge } from "./StatusBadge";
import type { AdminProjectReviewDTO } from "../../../../features/admin/types";

interface ReviewListProps {
  projects: AdminProjectReviewDTO[];
  selectedId: string | null;
  onSelect: (project: AdminProjectReviewDTO) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: "REVIEW" | "APPROVED" | "REJECTED" | "ALL";
  onFilterChange: (filter: "REVIEW" | "APPROVED" | "REJECTED" | "ALL") => void;
  onRefresh: () => void;
  loading?: boolean;
}

// 한글 설명: 프로젝트 ID 추출 헬퍼
const getProjectId = (project: AdminProjectReviewDTO): string => {
  return project.id ?? project.projectId ?? project.project ?? "";
};

// 한글 설명: 메이커 이름 추출 헬퍼
const getMakerName = (project: AdminProjectReviewDTO): string => {
  return project.makerName ?? project.maker ?? "알 수 없음";
};

// 한글 설명: 제출 시각 추출 헬퍼
const getSubmittedAt = (project: AdminProjectReviewDTO): string | undefined => {
  return project.submittedAt ?? project.requestAt;
};

// 한글 설명: 심사 상태 추출 헬퍼
const getReviewStatus = (project: AdminProjectReviewDTO): string => {
  return project.reviewStatus ?? (project as any).projectReviewStatus ?? "REVIEW";
};

// 한글 설명: 라이프사이클 상태 추출 헬퍼
const getLifecycleStatus = (project: AdminProjectReviewDTO): string => {
  return project.status ?? "DRAFT";
};

export const ReviewList: React.FC<ReviewListProps> = ({
  projects,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  onRefresh,
  loading = false,
}) => {
  return (
    <div className="col-span-3 flex h-[72vh] flex-col rounded-3xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 p-4">
        <h2 className="text-base font-semibold text-neutral-900">심사 대기/이력</h2>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          <div className="relative w-full">
            <svg
              className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="프로젝트/메이커 검색"
              className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-8 pr-3 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>
          <select
            value={filter}
            onChange={(e) =>
              onFilterChange(e.target.value as typeof filter)
            }
            className="w-36 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          >
            <option value="REVIEW">심사대기</option>
            <option value="APPROVED">승인됨</option>
            <option value="REJECTED">반려됨</option>
            <option value="ALL">전체</option>
          </select>
          <button
            type="button"
            onClick={onRefresh}
            title="목록 새로고침"
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
        <div className="border-t border-neutral-200"></div>
        <div className="flex-1 space-y-2 overflow-y-auto pr-2">
          {loading ? (
            <div className="py-8 text-center text-sm text-neutral-500">
              로딩 중...
            </div>
          ) : projects.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-500">
              {filter === "REVIEW"
                ? "심사 대기 중인 프로젝트가 없습니다"
                : "표시할 프로젝트가 없습니다"}
            </div>
          ) : (
            projects.map((item) => {
              const projectId = getProjectId(item);
              const reviewStatus = getReviewStatus(item);
              const lifecycleStatus = getLifecycleStatus(item);
              const makerName = getMakerName(item);
              const submittedAt = getSubmittedAt(item);
              const isSelected = selectedId === projectId;

              return (
                <button
                  key={projectId}
                  onClick={() => onSelect(item)}
                  className={`w-full rounded-xl border p-3 text-left transition hover:shadow-sm ${
                    isSelected
                      ? "border-blue-300 bg-blue-50"
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="truncate font-medium text-neutral-900">
                      {item.title}
                    </div>
                    <StatusBadge kind={reviewStatus} />
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                    <span className="truncate">{makerName}</span>
                    <span>•</span>
                    <StatusBadge kind={lifecycleStatus} />
                  </div>
                  <div className="mt-1 text-[11px] text-neutral-400">
                    요청:{" "}
                    {submittedAt
                      ? new Date(submittedAt).toLocaleString("ko-KR")
                      : "–"}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

