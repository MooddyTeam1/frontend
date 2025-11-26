// 한글 설명: 목표 달성에 가까운 프로젝트 섹션 컴포넌트
import React from "react";
import { Link } from "react-router-dom";
import { PublicProjectCard } from "../../../features/projects/components/PublicProjectCard";
import type { ProjectListResponseDTO } from "../../../features/projects/types";

interface NearGoalProjectsSectionProps {
  projects: ProjectListResponseDTO[];
  loading: boolean;
}

export const NearGoalProjectsSection: React.FC<
  NearGoalProjectsSectionProps
> = ({ projects, loading }) => {
  return (
    <section className="relative py-12">
      {/* 한글 설명: 섹션 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/10 to-transparent pointer-events-none" />
      <div className="relative">
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <span className="text-xl">💰</span>
            <span className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-transparent">목표 달성에 가까운 프로젝트</span>
          </h2>
          <Link
            to="/projects?sort=progress"
            className="text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            달성률순 전체 보기 →
          </Link>
        </div>
        <p className="text-sm text-neutral-600">
          목표 달성률이 높은 프로젝트예요.
          <br />
          성공에 가까워진 프로젝트를 함께 응원해 보세요.
        </p>
      </div>
      {loading ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
          목표 달성 임박 프로젝트를 불러오는 중...
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <PublicProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
          목표 달성 임박 프로젝트가 없습니다.
        </div>
      )}
      </div>
    </section>
  );
};
