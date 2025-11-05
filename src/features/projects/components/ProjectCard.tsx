import React from "react";
import { Link } from "react-router-dom";
import type { Project } from "../data/mockProjects";
import { currencyKRW, daysLeft, progressPct } from "../../../shared/utils/format";
import { ProgressBar } from "./ProgressBar";

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <Link
    to={`/projects/${project.slug}`}
    className="group flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-900"
  >
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
      {project.coverImageUrl ? (
        <img
          src={project.coverImageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : null}
      {project.state !== "LIVE" && (
        <span className="absolute left-4 top-4 rounded-full border border-neutral-900 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-900">
          {project.state === "ENDED" ? "종료" : project.state}
        </span>
      )}
    </div>
    <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-neutral-500">
      <span>{project.category}</span>
      <span>D-{daysLeft(project.endDate)}</span>
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold leading-tight text-neutral-900">
        {project.title}
      </h3>
      <p className="text-sm text-neutral-500">{project.summary}</p>
    </div>
    <div className="space-y-3 pt-2">
      <ProgressBar value={progressPct(project.raised, project.goalAmount)} />
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>{currencyKRW(project.raised)}</span>
        <span>{project.backerCount}명 후원</span>
      </div>
    </div>
  </Link>
);
