// 한글 설명: 당신을 위한 추천 섹션 컴포넌트
import React from "react";
import { ProjectCard } from "../../../features/projects/components/ProjectCard";
import type { ProjectCardResponseDTO } from "../../../features/projects/types";

interface PersonalizedRecommendationSectionProps {
  projects: ProjectCardResponseDTO[];
  userName?: string | null;
}

export const PersonalizedRecommendationSection: React.FC<
  PersonalizedRecommendationSectionProps
> = ({ projects, userName }) => {
  return (
    <section className="relative py-12">
      {/* 한글 설명: 섹션 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/10 to-transparent pointer-events-none" />
      <div className="relative">
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <span className="text-xl">🧩</span>
            <span className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-transparent">당신을 위한 추천</span>
          </h2>
        </div>
        {userName ? (
          <p className="text-sm text-neutral-600">
            {userName}님이 관심 있어 할 만한 프로젝트를 모아봤어요.
            <br />
            최근에 본 프로젝트와 비슷한 카테고리부터 보여드릴게요.
          </p>
        ) : (
          <p className="text-sm text-neutral-600">
            로그인하면 관심 카테고리와 후원 이력을 기반으로 개인화 추천이
            제공돼요.
            <br />
            지금은 MOA에서 주목하는 프로젝트를 보여드리고 있어요.
          </p>
        )}
      </div>
      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
          {userName
            ? "아직 추천할 프로젝트가 없어요. 프로젝트를 둘러보시면 맞춤 추천이 제공될 예정이에요."
            : "로그인하면 관심사·후원 이력을 기반으로 개인화 추천이 제공될 예정이에요."}
        </div>
      )}
      </div>
    </section>
  );
};
