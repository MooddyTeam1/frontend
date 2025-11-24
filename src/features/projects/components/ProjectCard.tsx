import React from "react";
import { Link } from "react-router-dom";
import type { ProjectCardResponseDTO } from "../types";
import {
  currencyKRW,
  daysLeft,
  progressPct,
} from "../../../shared/utils/format";
import { ProgressBar } from "./ProgressBar";

type ProjectCardProps = {
  project: ProjectCardResponseDTO;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <Link
    to={`/projects/${project.id}`}
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
      {/* 한글 설명: 상태 뱃지 - live가 아닐 때만 표시 (scheduled면 "공개 예정", ended면 "종료") */}
      {project.status !== "LIVE" && (
        <span className="absolute right-4 top-4 rounded-full border border-neutral-900 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-900">
          {project.status === "SCHEDULED"
            ? "공개 예정"
            : project.status === "ENDED"
              ? "종료"
              : project.status}
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
      <ProgressBar
        value={progressPct(
          project.raised && !isNaN(project.raised) ? project.raised : 0,
          project.goalAmount && !isNaN(project.goalAmount)
            ? project.goalAmount
            : 0
        )}
      />
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>
          {project.raised && !isNaN(project.raised)
            ? currencyKRW(project.raised)
            : currencyKRW(0)}
        </span>
        <span>
          {project.backerCount &&
          !isNaN(project.backerCount) &&
          project.backerCount > 0
            ? `${project.backerCount}명 후원`
            : "0명 후원"}
        </span>
      </div>
    </div>
  </Link>
);
