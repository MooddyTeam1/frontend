// 한글 설명: 오늘의 테마 배너 컴포넌트
import React from "react";
// 한글 설명: Link는 현재 미사용
// import { Link } from "react-router-dom";

export const ThemeBanner: React.FC = () => {
  // 한글 설명: TODO - 실제 테마 데이터는 백엔드 API에서 가져올 예정
  const theme = {
    emoji: "🎁",
    title: "연말 선물 준비하기",
    description:
      "집들이·연말모임·크리스마스에 어울리는 프로젝트만 모았어요.",
    projects: [], // 한글 설명: 테마별 프로젝트 목록 (추후 API 연동)
  };

  return (
    <section className="border-b border-neutral-200/50 bg-gradient-to-br from-neutral-100/50 via-white to-neutral-50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200/50 bg-gradient-to-br from-white via-neutral-50/50 via-white to-neutral-100/30 p-8 shadow-xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-3xl">{theme.emoji}</span>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                오늘의 테마: "{theme.title}"
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                {theme.description}
              </p>
            </div>
          </div>
          {theme.projects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {/* 한글 설명: 테마별 프로젝트 카드 표시 (추후 구현) */}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-200/50 bg-gradient-to-br from-neutral-50/50 to-white p-6 text-center text-sm text-neutral-500">
              테마별 프로젝트를 준비 중이에요.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

