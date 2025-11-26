// 한글 설명: 지금 많이 보고 있는 프로젝트 섹션 컴포넌트
import React from "react";
import { Link } from "react-router-dom";
import { ProjectCard } from "../../../features/projects/components/ProjectCard";
import type {
  ProjectCardResponseDTO,
  MostViewedProjectResponseDTO,
} from "../../../features/projects/types";
import { toCategoryLabel } from "../../../shared/utils/categorymapper";

interface PopularProjectsSectionProps {
  projects: MostViewedProjectResponseDTO[];
  loading: boolean;
}

// 한글 설명: MostViewedProjectResponseDTO를 ProjectCardResponseDTO로 변환
const convertToProjectCard = (
  project: MostViewedProjectResponseDTO
): ProjectCardResponseDTO => {
  // 한글 설명: 달성률 계산 (goalAmount와 raised가 있는 경우)
  const achievementRate =
    project.goalAmount &&
    project.goalAmount > 0 &&
    project.raised !== null &&
    project.raised !== undefined
      ? Math.min((project.raised / project.goalAmount) * 100, 100)
      : 0;

  return {
    id: String(project.id),
    slug: `project-${project.id}`, // 한글 설명: slug가 없으므로 임시 생성
    title: project.title,
    summary: project.summary ?? "",
    category: toCategoryLabel(project.category), // 한글 설명: CategoryEnum을 CategoryLabel로 변환
    coverImageUrl: project.coverImageUrl,
    goalAmount: project.goalAmount ?? 0, // 한글 설명: optional 필드 사용
    raised: project.raised ?? 0, // 한글 설명: optional 필드 사용
    backerCount: project.backerCount ?? 0, // 한글 설명: optional 필드 사용
    endDate: project.endDate ?? "",
    status:
      project.lifecycleStatus === "LIVE"
        ? "LIVE"
        : project.lifecycleStatus === "SCHEDULED"
          ? "SCHEDULED"
          : "ENDED",
    progressPercent: achievementRate, // 한글 설명: 계산된 달성률
    daysRemaining: project.daysLeft,
    makerName: project.makerName ?? "", // 한글 설명: optional 필드 사용
  };
};

export const PopularProjectsSection: React.FC<PopularProjectsSectionProps> = ({
  projects,
  loading,
}) => {
  return (
    <section className="relative">
      <div className="relative">
        {/* 한글 설명: 섹션 헤더 - 깨끗한 레이아웃 */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
              지금 많이 보고 있는 프로젝트
            </h2>
            <p className="text-base text-neutral-600">
              최근 1시간 동안 가장 많은 관심을 받은 프로젝트예요.
            </p>
          </div>
          <Link
            to="/projects?sort=popular"
            className="hidden shrink-0 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 md:inline-flex items-center gap-1"
          >
            전체 보기
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {/* 한글 설명: 프로젝트 그리드 */}
        {loading ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-12 text-center">
            <p className="text-sm font-medium text-neutral-500">
              인기 프로젝트를 불러오는 중...
            </p>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={convertToProjectCard(project)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center space-y-4">
            <p className="text-base font-medium text-neutral-700">
              아직 눈에 띄게 몰려 보고 있는 프로젝트가 없어요.
            </p>
            <p className="text-sm text-neutral-600">
              지금 둘러보는 당신이,
              <br />곧 '지금 많이 보고 있는 프로젝트'를 만드는 첫 번째 사람이 될지도 몰라요.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/40 transition-all hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-indigo-500/60 hover:scale-105"
            >
              프로젝트 둘러보기
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
