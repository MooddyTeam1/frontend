import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/primitives/Container";
import { ProjectCard } from "../components/ProjectCard";
import { currencyKRW } from "../utils/format";
import { mockProjects } from "../utils/mock";

export const HomePage: React.FC = () => {
  const trending = mockProjects.slice(0, 3);
  const highlight = trending[0];
  const endingSoon = [...mockProjects].sort(
    (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  );

  return (
    <>
      <section className="border-b border-neutral-200 bg-white">
        <Container>
          <div className="grid gap-10 py-20 md:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Crowdfunding, refined
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-5xl">
                Minimal ideas, meaningful backers.
              </h1>
              <p className="max-w-xl text-base text-neutral-500">
                FUND·IT curates independent creators with thoughtful projects. Back the concepts you
                want to live with—or launch your own in minutes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/projects"
                  className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
                >
                  프로젝트 둘러보기
                </Link>
                <Link
                  to="/creator/projects/new"
                  className="rounded-full border border-transparent bg-neutral-200 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-900 hover:bg-white hover:text-neutral-900"
                >
                  프로젝트 시작하기
                </Link>
              </div>
            </div>
            {highlight ? (
              <div className="hidden flex-col gap-6 rounded-3xl border border-neutral-200 bg-neutral-100 p-8 md:flex">
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Highlight</span>
                <h2 className="text-2xl font-semibold text-neutral-900">{highlight.title}</h2>
                <p className="text-sm text-neutral-600">{highlight.summary}</p>
                <div className="text-sm text-neutral-500">
                  현재 {currencyKRW(highlight.raised)} 모금 · {highlight.backerCount}명 참여
                </div>
                <Link
                  to={`/projects/${highlight.slug}`}
                  className="self-start rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
                >
                  프로젝트 살펴보기
                </Link>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <Container>
        <section className="py-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Trending</h2>
            <Link to="/projects" className="text-sm text-neutral-500 hover:text-neutral-900">
              모든 프로젝트 보기 →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {trending.map((project) => (
              <ProjectCard key={project.id} p={project} />
            ))}
          </div>
        </section>

        <section className="pb-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">마감 임박</h2>
            <Link
              to="/projects?sort=ending_soon"
              className="text-sm text-neutral-500 hover:text-neutral-900"
            >
              더 살펴보기 →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {endingSoon.map((project) => (
              <ProjectCard key={project.id} p={project} />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
};
