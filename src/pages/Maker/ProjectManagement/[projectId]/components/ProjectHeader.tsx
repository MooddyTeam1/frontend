// 한글 설명: 프로젝트 상세 관리 페이지 헤더 컴포넌트
import React from "react";
import { Link } from "react-router-dom";
import type { MakerProjectDetailDTO } from "../../../../../features/maker/projectManagement/types";
import { currencyKRW } from "../../../../../shared/utils/format";

const STATUS_BADGE_COLORS: Record<
  MakerProjectDetailDTO["status"],
  string
> = {
  DRAFT: "bg-neutral-200 text-neutral-700",
  REVIEW: "bg-blue-100 text-blue-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  SCHEDULED: "bg-purple-100 text-purple-700",
  LIVE: "bg-green-100 text-green-700",
  ENDED_SUCCESS: "bg-emerald-100 text-emerald-700",
  ENDED_FAILED: "bg-orange-100 text-orange-700",
  REJECTED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<MakerProjectDetailDTO["status"], string> = {
  DRAFT: "작성중",
  REVIEW: "심사중",
  APPROVED: "승인됨",
  SCHEDULED: "공개예정",
  LIVE: "진행중",
  ENDED_SUCCESS: "달성 종료",
  ENDED_FAILED: "실패 종료",
  REJECTED: "반려됨",
};

type ProjectHeaderProps = {
  project: MakerProjectDetailDTO;
};

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const getDDay = (daysLeft: number | null): string => {
    if (daysLeft === null) return "종료됨";
    if (daysLeft < 0) return "종료됨";
    if (daysLeft === 0) return "D-Day";
    return `D-${daysLeft}`;
  };

  return (
    <div className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6">
      {/* 한글 설명: 프로젝트 기본 정보 */}
      <div className="flex gap-6">
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
          {project.thumbnailUrl ? (
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400">
              이미지 없음
            </div>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">
                {project.title}
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                {project.summary}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                STATUS_BADGE_COLORS[project.status]
              }`}
            >
              {STATUS_LABELS[project.status]}
            </span>
          </div>

          {/* 한글 설명: 진행 정보 */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-neutral-500">목표 금액</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">
                {currencyKRW(project.goalAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">현재 모금액</p>
              <p className="mt-1 text-sm font-semibold text-green-600">
                {currencyKRW(project.currentAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">달성률</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">
                {project.progressPercent.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">서포터 수</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">
                {project.supporterCount}명
              </p>
            </div>
          </div>

          {/* 한글 설명: D-Day 및 날짜 정보 */}
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span>
              {getDDay(project.daysLeft)}
              {project.endDate &&
                ` (${new Date(project.endDate).toLocaleDateString("ko-KR")})`}
            </span>
            {project.startDate && (
              <span>
                시작: {new Date(project.startDate).toLocaleDateString("ko-KR")}
              </span>
            )}
          </div>

          {/* 한글 설명: 액션 버튼 */}
          <div className="flex flex-wrap gap-2">
            {(project.status === "LIVE" ||
              project.status === "ENDED_SUCCESS" ||
              project.status === "ENDED_FAILED") && (
              <a
                href={`/projects/${project.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                프로젝트 페이지 보기
              </a>
            )}
            {project.status === "DRAFT" && (
              <Link
                to={`/creator/projects/new/${project.id}`}
                className="rounded border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                스토리 수정
              </Link>
            )}
            <Link
              to={`/creator/rewards?projectId=${project.id}`}
              className="rounded border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              리워드 관리
            </Link>
            {project.status === "SCHEDULED" && (
              <button
                type="button"
                className="rounded border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                일정 변경 요청
              </button>
            )}
            {project.status === "LIVE" && (
              <button
                type="button"
                className="rounded border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
              >
                조기종료 요청
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

