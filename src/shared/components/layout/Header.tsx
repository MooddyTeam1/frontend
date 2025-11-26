import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORY_OPTIONS as CATEGORY_LABELS, toCategoryLabel } from "../../utils/categorymapper";
import { useAuthStore } from "../../../features/auth/stores/authStore";
import { NotificationBell } from "../../../features/notifications/components/NotificationBell";
import { Container } from "../Container";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [search, setSearch] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();

    // 카테고리 직접 입력 인식 (홈 검색창도 카테고리 전환 지원)
    if (query) {
      const normalizeCat = (s: string) =>
        s
          .normalize("NFC")
          .replace(/\s+/g, "")
          .replace(/[\p{P}\p{S}]/gu, "");

      const norm = normalizeCat(query);
      // 한글 라벨 매칭
      const labelMap = (CATEGORY_LABELS as readonly string[]).reduce<Record<string, string>>(
        (acc, label) => {
          acc[normalizeCat(label)] = label;
          return acc;
        },
        {}
      );
      const matchedLabel = labelMap[norm];
      if (matchedLabel) {
        const params = new URLSearchParams();
        params.set("sort", "popular");
        params.set("category", matchedLabel);
        navigate(`/projects?${params.toString()}`);
        return;
      }
      // 영문 enum/별칭 매칭
      const code = norm.toUpperCase();
      const aliases: Record<string, string> = {
        TECH: "TECH",
        DESIGN: "DESIGN",
        FOOD: "FOOD",
        FASHION: "FASHION",
        BEAUTY: "BEAUTY",
        HOME: "HOME_LIVING",
        HOMELIVING: "HOME_LIVING",
        HOME_LIVING: "HOME_LIVING",
        GAME: "GAME",
        ART: "ART",
        PUBLISH: "PUBLISH",
        BOOK: "PUBLISH",
      };
      const codeKey = aliases[code];
      if (codeKey) {
        const label = toCategoryLabel(codeKey as any);
        const params = new URLSearchParams();
        params.set("sort", "popular");
        params.set("category", label);
        navigate(`/projects?${params.toString()}`);
        return;
      }
    }

    navigate(query ? `/projects?search=${encodeURIComponent(query)}` : "/projects");
  };

  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "";

  return (
    <header className="sticky top-0 z-40 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50 via-purple-50/80 to-pink-50 backdrop-blur-sm shadow-sm">
      <Container>
        <div className="flex items-center gap-6 py-3.5">
          {/* 한글 설명: 로고 - 자연스럽고 모던한 스타일 */}
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
          >
            MO<span className="text-neutral-700">A</span>
          </Link>
          
          {/* 한글 설명: 네비게이션 메뉴 - 기본 상태에서도 명확한 구분 */}
          <nav className="hidden items-center gap-2 text-sm font-medium text-neutral-700 md:flex">
            <Link 
              to="/projects" 
              className="px-4 py-2 rounded-lg border border-neutral-200/60 bg-white/80 backdrop-blur-sm transition-all hover:text-indigo-600 hover:bg-white hover:border-indigo-300 hover:shadow-sm"
            >
              프로젝트 둘러보기
            </Link>
            <Link
              to="/projects?sort=ending_soon"
              className="px-4 py-2 rounded-lg border border-neutral-200/60 bg-white/80 backdrop-blur-sm transition-all hover:text-indigo-600 hover:bg-white hover:border-indigo-300 hover:shadow-sm"
            >
              마감 임박
            </Link>
            <Link 
              to="/creator/projects/new" 
              className="px-4 py-2 rounded-lg border border-neutral-200/60 bg-white/80 backdrop-blur-sm transition-all hover:text-indigo-600 hover:bg-white hover:border-indigo-300 hover:shadow-sm"
            >
              프로젝트 만들기
            </Link>
            {isAuthenticated && (
              <Link
                to="/creator/dashboard"
                className="px-4 py-2 rounded-lg border border-neutral-200/60 bg-white/80 backdrop-blur-sm transition-all hover:text-indigo-600 hover:bg-white hover:border-indigo-300 hover:shadow-sm"
              >
                대시보드
              </Link>
            )}
          </nav>
          
          {/* 한글 설명: 모바일 탐색 링크 */}
          <Link
            to="/projects"
            className="ml-auto text-sm font-medium text-neutral-700 hover:text-indigo-600 md:hidden transition-colors"
          >
            탐색
          </Link>
          
          {/* 한글 설명: 검색 폼 - 깔끔하고 모던한 스타일 */}
          <form
            onSubmit={handleSubmit}
            className="ml-auto hidden items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50/50 px-3.5 py-2 text-sm text-neutral-700 sm:flex focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-sm transition-all"
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="프로젝트 검색"
              className="w-40 bg-transparent placeholder:text-neutral-400 focus:outline-none"
            />
            <button
              type="submit"
              className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
            >
              검색
            </button>
          </form>

          {/* 한글 설명: 사용자 메뉴 */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* 한글 설명: 알림 벨 아이콘 */}
              <NotificationBell />
              <Link
                to={user?.role === "ADMIN" ? "/admin" : "/profile"}
                className="hidden text-sm font-medium text-neutral-700 hover:text-indigo-600 md:inline transition-colors"
              >
                {displayName}님
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-sm font-medium text-neutral-700 hover:text-indigo-600 md:inline-flex transition-colors"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition-all hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-indigo-500/40"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
};
