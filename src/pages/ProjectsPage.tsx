import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/primitives/Container";
import { ProjectCard } from "../components/ProjectCard";
import { useQuery } from "../hooks/useQuery";
import { mockProjects } from "../utils/mock";

const sortOptions = [
  { key: "popular", label: "인기" },
  { key: "ending_soon", label: "마감 임박" },
  { key: "new", label: "최신" },
];

export const ProjectsPage: React.FC = () => {
  const q = useQuery();
  const searchQuery = (q.get("search") || "").toLowerCase();
  const sort = q.get("sort") || "popular";

  let list = mockProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery) ||
      project.summary.toLowerCase().includes(searchQuery)
  );

  if (sort === "ending_soon") {
    list = [...list].sort(
      (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    );
  } else if (sort === "new") {
    list = [...list].reverse();
  }

  return (
    <Container>
      <div className="space-y-12 py-16">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Explore</p>
          <h1 className="text-3xl font-semibold text-neutral-900">모든 프로젝트</h1>
          <p className="max-w-2xl text-sm text-neutral-500">
            상상력을 지지하는 프로젝트들을 모았습니다. 정렬을 바꿔보며 새로운 아이디어를 탐색해보세요.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-neutral-500">정렬</span>
          {sortOptions.map(({ key, label }) => (
            <Link
              key={key}
              to={`/projects?search=${encodeURIComponent(searchQuery)}&sort=${key}`}
              className={`rounded-full border px-3 py-1 ${
                sort === key
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-200 p-16 text-center text-sm text-neutral-500">
            검색 결과가 없습니다. 다른 키워드를 시도해보세요.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {list.map((project) => (
              <ProjectCard key={project.id} p={project} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};
