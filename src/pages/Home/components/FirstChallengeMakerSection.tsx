// 한글 설명: 첫 도전 메이커 응원하기 섹션 컴포넌트
import React, { useEffect, useState } from "react";
import { PublicProjectCard } from "../../../features/projects/components/PublicProjectCard";
import type { ProjectListResponseDTO } from "../../../features/projects/types";
import { fetchFirstChallengeProjects } from "../../../features/projects/api/publicProjectsService";

export const FirstChallengeMakerSection: React.FC = () => {
  const [projects, setProjects] = useState<ProjectListResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFirstChallengeProjects(6);
        setProjects(data);
      } catch (err) {
        console.error("첫 도전 메이커 프로젝트 조회 실패", err);
        setError("첫 도전 메이커 프로젝트를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <section className="relative py-12">
      {/* 한글 설명: 섹션 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/10 to-transparent pointer-events-none" />
      <div className="relative">
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <span className="text-xl">🌱</span>
            <span className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-transparent">첫 도전 메이커 응원하기</span>
          </h2>
        </div>
        <p className="text-sm text-neutral-600">
          인생 첫 프로젝트에 도전한 메이커들이에요.
          <br />
          작지만 진심이 담긴 첫 시도를 함께 응원해 주세요.
        </p>
      </div>
      {loading ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
          첫 도전 메이커 프로젝트를 불러오는 중...
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
          첫 도전 메이커의 프로젝트가 없습니다.
        </div>
      )}
      </div>
    </section>
  );
};
