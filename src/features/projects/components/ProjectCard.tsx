import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { ProjectCardResponseDTO } from "../types";
import {
  currencyKRW,
  daysLeft,
  progressPct,
} from "../../../shared/utils/format";
import { ProgressBar } from "./ProgressBar";
import { useTracking } from "../../tracking/hooks/useTracking";

type ProjectCardProps = {
  project: ProjectCardResponseDTO;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // 한글 설명: 트래킹 훅 사용
  const { track } = useTracking();
  // 한글 설명: 카드 요소 참조 (Intersection Observer용)
  const cardRef = useRef<HTMLDivElement>(null);
  // 한글 설명: 이미 노출 이벤트를 전송했는지 추적
  const hasTrackedImpression = useRef(false);

  // 한글 설명: 카드가 화면에 노출될 때 이벤트 전송
  useEffect(() => {
    if (!cardRef.current || hasTrackedImpression.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedImpression.current) {
            // 한글 설명: 카드가 화면에 노출되었을 때 이벤트 전송
            const projectId = parseInt(String(project.id), 10);
            if (!isNaN(projectId)) {
              track("PROJECT_CARD_IMPRESSION", projectId, {
                category: project.category,
                status: project.status,
              });
              hasTrackedImpression.current = true;
            }
          }
        });
      },
      {
        // 한글 설명: 카드의 50% 이상이 보일 때 노출로 간주
        threshold: 0.5,
      }
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, [project.id, project.category, project.status, track]);

  // 한글 설명: 카드 클릭 시 이벤트 전송
  const handleClick = () => {
    const projectId = parseInt(String(project.id), 10);
    if (!isNaN(projectId)) {
      track("PROJECT_CARD_CLICK", projectId, {
        category: project.category,
        status: project.status,
      });
    }
  };

  return (
    <div ref={cardRef}>
      <Link
        to={`/projects/${project.id}`}
        onClick={handleClick}
        className="group flex flex-col gap-4 rounded-xl border-2 border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.02]"
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
      <h3 className="text-lg font-semibold leading-tight text-neutral-900 line-clamp-2">
        {project.title}
      </h3>
      {/* 한글 설명: 메이커 이름 표시 */}
      {project.makerName && (
        <p className="text-xs text-neutral-400">by {project.makerName}</p>
      )}
      {project.summary && (
        <p className="text-sm text-neutral-500 line-clamp-2">
          {project.summary}
        </p>
      )}
    </div>
    <div className="space-y-3 pt-2">
      {/* 한글 설명: 진행률 바와 달성률 퍼센트 함께 표시 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">달성률</span>
          <span className="font-semibold text-neutral-900">
            {progressPct(
              project.raised && !isNaN(project.raised) ? project.raised : 0,
              project.goalAmount && !isNaN(project.goalAmount)
                ? project.goalAmount
                : 0
            ).toFixed(1)}%
          </span>
        </div>
        <ProgressBar
          value={progressPct(
            project.raised && !isNaN(project.raised) ? project.raised : 0,
            project.goalAmount && !isNaN(project.goalAmount)
              ? project.goalAmount
              : 0
          )}
        />
      </div>
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
    </div>
  );
};
