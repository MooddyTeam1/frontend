// 한글 설명: 예정되어 있는 펀딩 섹션 컴포넌트
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ProjectListResponseDTO } from "../../../features/projects/types";
import { fetchScheduledProjects } from "../../../features/projects/api/publicProjectsService";
import { PublicProjectCard } from "../../../features/projects/components/PublicProjectCard";

export const ScheduledProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<ProjectListResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadScheduledProjects = async () => {
      setLoading(true);
      try {
        const data = await fetchScheduledProjects(6);
        setProjects(data);
      } catch (error) {
        console.error("예정되어 있는 펀딩 조회 실패", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadScheduledProjects();
  }, []);

  if (loading && projects.length === 0) {
    return (
      <section className="relative space-y-4 py-12">
        {/* 한글 설명: 섹션 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50/10 to-transparent pointer-events-none" />
        <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              예정되어 있는 펀딩
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              곧 시작될 프로젝트들을 미리 확인해보세요
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-neutral-200 p-12 text-center text-sm text-neutral-500">
          데이터를 불러오는 중입니다...
        </div>
      </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="relative space-y-4 py-12">
        {/* 한글 설명: 섹션 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50/10 to-transparent pointer-events-none" />
        <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              예정되어 있는 펀딩
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              곧 시작될 프로젝트들을 미리 확인해보세요
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-dashed border-neutral-200 p-12 text-center text-sm text-neutral-500">
          예정된 펀딩이 없습니다.
        </div>
      </div>
      </section>
    );
  }

  return (
    <section className="relative space-y-4 py-12">
      {/* 한글 설명: 섹션 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50/10 to-transparent pointer-events-none" />
      <div className="relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            예정되어 있는 펀딩
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            곧 시작될 프로젝트들을 미리 확인해보세요
          </p>
        </div>
        <Link
          to="/projects?status=scheduled"
          className="text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          전체 보기 →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <PublicProjectCard key={project.id} project={project} />
        ))}
      </div>
      </div>
    </section>
  );
};

