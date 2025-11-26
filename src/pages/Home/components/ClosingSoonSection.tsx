// 한글 설명: 곧 마감되는 프로젝트 섹션 컴포넌트
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PublicProjectCard } from "../../../features/projects/components/PublicProjectCard";
import type { ProjectListResponseDTO } from "../../../features/projects/types";
import { fetchClosingSoonProjects } from "../../../features/projects/api/publicProjectsService";

export const ClosingSoonSection: React.FC = () => {
  const [projects, setProjects] = useState<ProjectListResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchClosingSoonProjects();
        setProjects(data);
      } catch (err) {
        console.error("마감 임박 프로젝트 조회 실패", err);
        setError("마감 임박 프로젝트를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <section className="relative">
      <div className="relative">
        {/* 한글 설명: 섹션 헤더 - 깨끗한 레이아웃 */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
              곧 마감되는 프로젝트
            </h2>
            <p className="text-base text-neutral-600">
              종료까지 10일 이내인 프로젝트예요. 마감 전에 얼리버드·한정 리워드를 확인해 보세요.
            </p>
          </div>
          <Link
            to="/projects?sort=ending_soon"
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
              마감 임박 프로젝트를 불러오는 중...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-12 text-center">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <PublicProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
            <p className="text-sm font-medium text-neutral-500">
              마감 임박 프로젝트가 없습니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
