// 한글 설명: 공개 프로젝트 카드 컴포넌트 (ProjectListResponseDTO 전용, 뱃지 지원)
import React from "react";
import { Link } from "react-router-dom";
import type { ProjectListResponseDTO, ProjectCategory } from "../types";
import { PROJECT_CATEGORY_LABELS } from "../types";
import { currencyKRW, progressPct } from "../../../shared/utils/format";
import { ProgressBar } from "./ProgressBar";

interface PublicProjectCardProps {
  project: ProjectListResponseDTO;
}

// 한글 설명: endDate 기준으로 남은 일수 계산
const calculateDaysLeft = (endDate: string | null): number | null => {
  if (!endDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(diff, 0);
};

// 한글 설명: D-day 표기 포맷팅
const formatDaysLeft = (daysLeft: number | null): string => {
  if (daysLeft === null) return "마감";
  if (daysLeft === 0) return "오늘 마감";
  return `D-${daysLeft}`;
};

export const PublicProjectCard: React.FC<PublicProjectCardProps> = ({
  project,
}) => {
  // 한글 설명: 백엔드에서 온 category enum을 한글 라벨로 변환
  // 한글 설명: PROJECT_CATEGORY_LABELS를 사용하여 한글 라벨 표시
  const categoryLabel =
    PROJECT_CATEGORY_LABELS[project.category as ProjectCategory] ||
    project.category;
  const daysLeft = calculateDaysLeft(project.endDate);
  const daysLeftText = formatDaysLeft(daysLeft);

  // 한글 설명: 뱃지 목록 생성
  const badges: Array<{ label: string; className: string }> = [];
  if (project.badgeNew) {
    badges.push({ label: "신규", className: "bg-blue-100 text-blue-800" });
  }
  if (project.badgeClosingSoon) {
    badges.push({ label: "마감 임박", className: "bg-red-100 text-red-800" });
  }
  if (project.badgeSuccessMaker) {
    badges.push({
      label: "성공 메이커",
      className: "bg-emerald-100 text-emerald-800",
    });
  }
  if (project.badgeFirstChallengeMaker) {
    badges.push({
      label: "첫 도전",
      className: "bg-purple-100 text-purple-800",
    });
  }

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex flex-col gap-4 rounded-xl border-2 border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.02]"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
        {project.coverImageUrl ? (
          <img
            src={project.coverImageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        {/* 한글 설명: 뱃지 표시 - 오른쪽 위에 배치 */}
        {badges.length > 0 && (
          <div className="absolute right-4 top-4 flex flex-wrap gap-2 justify-end">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className={`rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-neutral-500">
        <span>{categoryLabel}</span>
        <span>{daysLeftText}</span>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold leading-tight text-neutral-900 line-clamp-2">
          {project.title}
        </h3>
        {/* 한글 설명: 메이커 이름 표시 */}
        {project.maker && (
          <p className="text-xs text-neutral-400">by {project.maker}</p>
        )}
        {project.summary && (
          <p className="text-sm text-neutral-500 line-clamp-2">
            {project.summary}
          </p>
        )}
      </div>
      <div className="space-y-3 pt-2">
        {/* 한글 설명: 달성률 표시 (achievementRate가 있을 때만) */}
        {project.achievementRate !== null &&
        project.achievementRate !== undefined ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">달성률</span>
              <span className="font-semibold text-neutral-900">
                {project.achievementRate}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all shadow-sm"
                style={{ width: `${Math.min(project.achievementRate, 100)}%` }}
              />
            </div>
          </div>
        ) : (
          // 한글 설명: achievementRate가 없으면 raised/goalAmount로 진행률 표시
          project.goalAmount !== null &&
          project.goalAmount !== undefined &&
          project.goalAmount > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">달성률</span>
                <span className="font-semibold text-neutral-900">
                  {progressPct(
                    project.raised ?? 0,
                    project.goalAmount ?? 0
                  ).toFixed(1)}%
                </span>
              </div>
              <ProgressBar
                value={progressPct(project.raised ?? 0, project.goalAmount ?? 0)}
              />
            </div>
          )
        )}
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>
            {project.raised !== null &&
            project.raised !== undefined &&
            !isNaN(project.raised)
              ? currencyKRW(project.raised)
              : currencyKRW(0)}
          </span>
          <span>
            {project.backerCount !== null &&
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
