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
    <section className="relative">
      <div className="relative">
        {/* 한글 설명: 섹션 헤더 - 깨끗한 레이아웃 */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
              지금 뜨는 프로젝트
            </h2>
            <p className="text-base text-neutral-600">
              최근 7일 동안 조회수·찜 수가 빠르게 늘고 있는 프로젝트예요.
            </p>
          </div>
          <Link
            to="/projects?sort=trending"
            className="hidden shrink-0 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 md:inline-flex items-center gap-1"
          >
            전체 보기
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {/* 한글 설명: 프로젝트 그리드 - 제품 중심 레이아웃 */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-xl border border-neutral-200 bg-white p-5">
                  <div className="aspect-[16/10] rounded-xl bg-neutral-200" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-neutral-200" />
                    <div className="h-4 w-1/2 rounded bg-neutral-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
            <p className="text-sm font-medium text-neutral-500">
              지금 서포터들이 많이 찜한 프로젝트예요.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
