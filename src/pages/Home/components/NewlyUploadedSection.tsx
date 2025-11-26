// 한글 설명: 방금 업로드된 신규 프로젝트 섹션 컴포넌트
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PublicProjectCard } from "../../../features/projects/components/PublicProjectCard";
import type { ProjectListResponseDTO } from "../../../features/projects/types";
import { fetchNewlyUploadedProjects } from "../../../features/projects/api/publicProjectsService";

export const NewlyUploadedSection: React.FC = () => {
  const [projects, setProjects] = useState<ProjectListResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNewlyUploadedProjects(6);
        setProjects(data);
      } catch (err) {
        console.error("신규 프로젝트 조회 실패", err);
        setError("신규 프로젝트를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <section className="relative py-12">
      {/* 한글 설명: 섹션 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/10 to-transparent pointer-events-none" />
      <div className="relative">
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <span className="text-xl">🆕</span>
            <span className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-transparent">방금 업로드된 신규 프로젝트</span>
          </h2>
          <Link
            to="/projects?sort=new"
            className="text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            최신순 전체 보기 →
          </Link>
        </div>
        <p className="text-sm text-neutral-600">
          오늘·어제 등록된 따끈한 신규 프로젝트예요.
          <br />
          가장 먼저 후원자가 되어보고 싶다면 여기부터 둘러보세요.
        </p>
      </div>
      {loading ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
          신규 프로젝트를 불러오는 중...
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
          신규 프로젝트가 없습니다.
        </div>
      )}
      </div>
    </section>
  );
};
