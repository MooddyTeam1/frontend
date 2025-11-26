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
  return {
    id: String(project.id),
    slug: `project-${project.id}`, // 한글 설명: slug가 없으므로 임시 생성
    title: project.title,
    summary: project.summary ?? "",
    category: toCategoryLabel(project.category), // 한글 설명: CategoryEnum을 CategoryLabel로 변환
    coverImageUrl: project.coverImageUrl,
    goalAmount: 0, // 한글 설명: MostViewedProjectResponseDTO에는 goalAmount가 없음
    raised: 0, // 한글 설명: MostViewedProjectResponseDTO에는 raised가 없음
    backerCount: 0, // 한글 설명: MostViewedProjectResponseDTO에는 backerCount가 없음
    endDate: project.endDate ?? "",
    status:
      project.lifecycleStatus === "LIVE"
        ? "LIVE"
        : project.lifecycleStatus === "SCHEDULED"
          ? "SCHEDULED"
          : "ENDED",
    progressPercent: 0, // 한글 설명: MostViewedProjectResponseDTO에는 progressPercent가 없음
    daysRemaining: project.daysLeft,
    makerName: "", // 한글 설명: MostViewedProjectResponseDTO에는 makerName이 없음
  };
};

export const PopularProjectsSection: React.FC<PopularProjectsSectionProps> = ({
  projects,
  loading,
}) => {
  return (
    <section className="py-12">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
          <span className="text-xl">📈</span>
          <span>지금 많이 보고 있는 프로젝트</span>
        </h2>
        <Link
          to="/projects?sort=popular"
          className="text-xs text-neutral-500 hover:text-neutral-900"
        >
          인기순 전체 보기
        </Link>
      </div>
      {loading ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
          인기 프로젝트를 불러오는 중...
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={convertToProjectCard(project)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-8 text-center space-y-4">
          <p className="text-sm text-neutral-600">
            아직 눈에 띄게 몰려 보고 있는 프로젝트가 없어요.
          </p>
          <p className="text-sm text-neutral-500">
            지금 둘러보는 당신이,
            <br />곧 '지금 많이 보고 있는 프로젝트'를 만드는 첫 번째 사람이
            될지도 몰라요. 👀
          </p>
          <Link
            to="/projects"
            className="inline-block rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition"
          >
            프로젝트 둘러보기
          </Link>
        </div>
      )}
    </section>
  );
};
