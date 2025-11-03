import React from "react";
import { Link } from "react-router-dom";
import { currencyKRW, daysLeft, progressPct } from "../utils/format";
import { Project } from "../utils/mock";
import { ProgressBar } from "./ProgressBar";

export const ProjectCard: React.FC<{ p: Project }> = ({ p }) => (
  <Link
    to={`/projects/${p.slug}`}
    className="group flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-900"
  >
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
      {p.coverImageUrl ? (
        <img
          src={p.coverImageUrl}
          alt={p.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : null}
      {p.state !== "LIVE" && (
        <span className="absolute left-4 top-4 rounded-full border border-neutral-900 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-900">
          {p.state === "ENDED" ? "마감" : p.state}
        </span>
      )}
    </div>
    <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-neutral-500">
      <span>{p.category}</span>
      <span>D-{daysLeft(p.endDate)}</span>
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold leading-tight text-neutral-900">{p.title}</h3>
      <p className="text-sm text-neutral-500">{p.summary}</p>
    </div>
    <div className="space-y-3 pt-2">
      <ProgressBar value={progressPct(p.raised, p.goalAmount)} />
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>{currencyKRW(p.raised)}</span>
        <span>{p.backerCount}명 후원</span>
      </div>
    </div>
  </Link>
);
