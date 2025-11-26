// 한글 설명: 지금 뜨는 프로젝트용 카드 컴포넌트 (TrendingProjectResponseDTO 또는 TrendingProjectScoreResponseDTO 사용)
import React from "react";
import { Link } from "react-router-dom";
import type {
  TrendingProjectResponseDTO,
  TrendingProjectScoreResponseDTO,
  ProjectCategory,
} from "../types";
import { PROJECT_CATEGORY_LABELS } from "../types";
import { currencyKRW, progressPct } from "../../../shared/utils/format";
import { ProgressBar } from "./ProgressBar";

interface TrendingProjectCardProps {
  project: TrendingProjectResponseDTO | TrendingProjectScoreResponseDTO;
}

// 한글 설명: 날짜 문자열로부터 남은 일수 계산
const calculateDaysLeft = (
  endDate: string | null | undefined
): number | null => {
  if (!endDate) return null;
  try {
    const diff = new Date(endDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  } catch {
    return null;
  }
};

// 한글 설명: D-day 표기 포맷팅
const formatDaysLeft = (
  daysLeft: number | null | undefined,
  liveEndAt?: string | null,
  endDate?: string | null
): string => {
  // 한글 설명: LIVE 상태이고 liveEndAt이 있으면 liveEndAt을 사용해서 계산
  let actualDaysLeft = daysLeft;
  if ((daysLeft === null || daysLeft === undefined) && liveEndAt) {
    actualDaysLeft = calculateDaysLeft(liveEndAt);
  }
  // 한글 설명: 여전히 없으면 endDate 사용
  if ((actualDaysLeft === null || actualDaysLeft === undefined) && endDate) {
    actualDaysLeft = calculateDaysLeft(endDate);
  }

  // 한글 설명: undefined나 null이면 "마감" 표시
  if (actualDaysLeft === null || actualDaysLeft === undefined) return "마감";
  if (actualDaysLeft === 0) return "D-0";
  // 한글 설명: 음수면 "마감" 표시
  if (actualDaysLeft < 0) return "마감";
  return `D-${actualDaysLeft}`;
};

export const TrendingProjectCard: React.FC<TrendingProjectCardProps> = ({
  project,
}) => {
  // 한글 설명: 프로젝트 ID 추출 (projectId 또는 id 필드 사용)
  const projectId =
    ("projectId" in project && project.projectId) ||
    ("id" in project && project.id) ||
    0;

  // 한글 설명: 백엔드에서 온 category enum을 한글 라벨로 변환
  // 한글 설명: PROJECT_CATEGORY_LABELS를 사용하여 한글 라벨 표시
  const categoryLabel =
    PROJECT_CATEGORY_LABELS[project.category as ProjectCategory] ||
    project.category;

  // 한글 설명: 상태 표시 (live면 "진행중", scheduled면 "공개 예정")
  const getStatusLabel = (): string | null => {
    if (project.live) {
      return null; // 한글 설명: LIVE 상태는 뱃지 표시 안 함
    }
    if (project.scheduled) {
      return "공개 예정";
    }
    // 한글 설명: lifecycleStatus에 따른 라벨 매핑
    switch (project.lifecycleStatus) {
      case "ENDED":
        return "종료";
      case "SCHEDULED":
        return "공개 예정";
      case "LIVE":
        return null; // 한글 설명: LIVE는 뱃지 표시 안 함
      case "DRAFT":
        return "작성 중";
      case "CANCELED":
        return "취소됨";
      case "NONE":
        return null; // 한글 설명: NONE 상태는 뱃지 표시 안 함
      default:
        // 한글 설명: 알 수 없는 상태는 lifecycleStatus를 그대로 표시하거나 null 반환
        return project.lifecycleStatus || null;
    }
  };

  const statusLabel = getStatusLabel();

  return (
    <Link
      to={`/projects/${projectId}`}
      className="group flex flex-col gap-4 rounded-xl border-2 border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.02]"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        {project.coverImageUrl ? (
          <img
            src={project.coverImageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg className="h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* 한글 설명: 진행 상태 뱃지 (live가 아닐 때만 표시) - 오른쪽 위에 배치 */}
        {statusLabel && (
          <span className="absolute right-4 top-4 rounded-full border border-neutral-900 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-900">
            {statusLabel}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-neutral-500">
        <span>{categoryLabel}</span>
        <span>
          {formatDaysLeft(
            project.daysLeft,
            "liveEndAt" in project ? project.liveEndAt : undefined,
            project.endDate
          )}
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold leading-tight text-neutral-900 line-clamp-2">
          {project.title}
        </h3>
        {/* 한글 설명: 메이커 이름 표시 */}
        {"makerName" in project && project.makerName && (
          <p className="text-xs text-neutral-400">by {project.makerName}</p>
        )}
        {project.summary && (
          <p className="text-sm text-neutral-500 line-clamp-2">
            {project.summary}
          </p>
        )}
      </div>
      <div className="space-y-3 pt-2">
        {/* 한글 설명: 진행률 바와 달성률 퍼센트 함께 표시 (goalAmount와 raised가 있는 경우) */}
        {"goalAmount" in project &&
        project.goalAmount !== null &&
        project.goalAmount !== undefined &&
        project.goalAmount > 0 ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">달성률</span>
              <span className="font-semibold text-neutral-900">
                {progressPct(
                  ("raised" in project && project.raised) || 0,
                  project.goalAmount
                ).toFixed(1)}%
              </span>
            </div>
            <ProgressBar
              value={progressPct(
                ("raised" in project && project.raised) || 0,
                project.goalAmount
              )}
            />
          </div>
        ) : null}
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>
            {/* 한글 설명: 모금액 표시 (raised가 있는 경우) */}
            {"raised" in project &&
            project.raised !== null &&
            project.raised !== undefined &&
            !isNaN(project.raised)
              ? currencyKRW(project.raised)
              : currencyKRW(0)}
          </span>
          <span>
            {/* 한글 설명: 후원자 수 표시 (backerCount가 있는 경우) */}
            {"backerCount" in project &&
            project.backerCount !== null &&
            project.backerCount !== undefined &&
            !isNaN(project.backerCount) &&
            project.backerCount > 0
              ? `${project.backerCount}명 후원`
              : "0명 후원"}
          </span>
        </div>
      </div>
    </Link>
  );
};
