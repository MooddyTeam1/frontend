// 한글 설명: 지금 뜨는 프로젝트 섹션 컴포넌트
import React from "react";
import { Link } from "react-router-dom";
import { TrendingProjectCard } from "../../../features/projects/components/TrendingProjectCard";
import type {
  TrendingProjectResponseDTO,
  TrendingProjectScoreResponseDTO,
} from "../../../features/projects/types";

interface TrendingProjectsSectionProps {
  projects: (TrendingProjectResponseDTO | TrendingProjectScoreResponseDTO)[];
  loading?: boolean;
}

export const TrendingProjectsSection: React.FC<
  TrendingProjectsSectionProps
> = ({ projects, loading = false }) => {
  return (
    <section className="py-12">
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <span className="text-xl">🔥</span>
            <span>지금 뜨는 프로젝트</span>
          </h2>
          <Link
            to="/projects?sort=trending"
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            인기순 전체 보기
          </Link>
        </div>
        <p className="text-sm text-neutral-600">
          최근 7일 동안 조회수·찜 수가 빠르게 늘고 있는 프로젝트예요.
          <br />
          놓치면 아쉬울지도 몰라요.
        </p>
      </div>
      {loading ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
          지금 뜨는 프로젝트를 불러오는 중...
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => {
            // 한글 설명: 프로젝트 ID 추출 (projectId 또는 id 필드 사용)
            const projectId =
              ("projectId" in project && project.projectId) ||
              ("id" in project && project.id) ||
              0;
            return <TrendingProjectCard key={projectId} project={project} />;
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
          지금 서포터들이 많이 찜한 프로젝트예요.
        </div>
      )}
    </section>
  );
};
