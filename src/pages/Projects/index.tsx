import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { ProjectCard } from "../../features/projects/components/ProjectCard";
import { useQuery } from "../../shared/hooks/useQuery";
import { mockProjects } from "../../features/projects/data/mockProjects";

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
          <h1 className="text-3xl font-semibold text-neutral-900">전체 프로젝트</h1>
          <p className="max-w-2xl text-sm text-neutral-500">
            마음에 드는 프로젝트를 찾아보세요. 검색어와 정렬을 조합해 새로운 아이디어를 탐색할 수 있어요.
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
            검색 결과가 없습니다. 다른 키워드를 입력해 보세요.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {list.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};
