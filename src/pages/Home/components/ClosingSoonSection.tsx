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
    <section className="py-12">
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <span className="text-xl">🎯</span>
            <span>곧 마감되는 프로젝트</span>
          </h2>
          <Link
            to="/projects?sort=ending_soon"
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            마감임박순 전체 보기
          </Link>
        </div>
        <p className="text-sm text-neutral-600">
          종료까지 10일 이내인 프로젝트예요.
          <br />
          마감 전에 얼리버드·한정 리워드를 확인해 보세요.
        </p>
      </div>
      {loading ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
          마감 임박 프로젝트를 불러오는 중...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <PublicProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
          마감 임박 프로젝트가 없습니다.
        </div>
      )}
    </section>
  );
};
