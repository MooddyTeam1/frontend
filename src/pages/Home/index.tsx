import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { currencyKRW } from "../../shared/utils/format";
import { useAuthStore } from "../../features/auth/stores/authStore";
import type {
  ProjectCardResponseDTO,
  TrendingProjectScoreResponseDTO,
  MostViewedProjectResponseDTO,
  ProjectListResponseDTO,
} from "../../features/projects/types";
import {
  fetchTrendingScoredProjects,
  fetchMostViewedProjects,
  fetchNearGoalProjects,
} from "../../features/projects/api/publicProjectsService";
// import { fetchProjectsByCategory } from "../../features/projects/api/projectService"; // 한글 설명: API 미구현으로 주석 처리
import { PersonalizedRecommendationSection } from "./components/PersonalizedRecommendationSection";
import { TrendingProjectsSection } from "./components/TrendingProjectsSection";
import { ClosingSoonSection } from "./components/ClosingSoonSection";
import { ScheduledProjectsSection } from "./components/ScheduledProjectsSection";
import { NewlyUploadedSection } from "./components/NewlyUploadedSection";
import { PopularProjectsSection } from "./components/PopularProjectsSection";
import { NearGoalProjectsSection } from "./components/NearGoalProjectsSection";
import { SuccessMakerNewSection } from "./components/SuccessMakerNewSection";
import { FirstChallengeMakerSection } from "./components/FirstChallengeMakerSection";
import { CategoryQuickFilter } from "./components/CategoryQuickFilter";
import { ThemeBanner } from "./components/ThemeBanner";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { MakerStorySection } from "./components/MakerStorySection";
import { InterestSettingBanner } from "./components/InterestSettingBanner";

export const HomePage: React.FC = () => {
  // 한글 설명: 로그인 상태 확인
  const { isAuthenticated } = useAuthStore();

  // 한글 설명: 추후 실서비스 API 연동을 통해 채울 성과/개인화 섹션들
  const [trending, setTrending] = useState<TrendingProjectScoreResponseDTO[]>(
    []
  ); // 🔥 지금 뜨는 프로젝트 (점수 기반)
  const personalized = useMemo<ProjectCardResponseDTO[]>(() => [], []); // 🧩 취향 기반 추천 (관심 카테고리)

  // 한글 설명: 신규 추가 섹션들
  const [popularProjects, setPopularProjects] = useState<
    MostViewedProjectResponseDTO[]
  >([]); // 📈 지금 많이 보고 있는 프로젝트 (뷰 기준)
  const [nearGoalProjects, setNearGoalProjects] = useState<
    ProjectListResponseDTO[]
  >([]); // 💰 목표 달성에 가까운 프로젝트 (달성률 70~95%)

  const [loadingTrending, setLoadingTrending] = useState(false);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [loadingNearGoal, setLoadingNearGoal] = useState(false);
  // 한글 설명: 하이라이트 카드용 프로젝트 (trending의 첫 번째 항목)
  const highlight = trending[0]
    ? {
        id: String(trending[0].projectId ?? trending[0].id ?? 0),
        title: trending[0].title,
        summary: trending[0].summary ?? "",
        raised: 0, // 한글 설명: trending API에는 raised 정보가 없음
        backerCount: 0, // 한글 설명: trending API에는 backerCount 정보가 없음
      }
    : null;

  // 한글 설명: 지금 뜨는 프로젝트 조회 (점수 기반)
  useEffect(() => {
    const loadTrending = async () => {
      setLoadingTrending(true);
      try {
        const projects = await fetchTrendingScoredProjects(6); // 한글 설명: 최대 6개 조회
        setTrending(projects);
      } catch (error) {
        console.error("지금 뜨는 프로젝트 조회 실패", error);
      } finally {
        setLoadingTrending(false);
      }
    };

    loadTrending();
  }, []);

  // 한글 설명: 인기 프로젝트 조회 (뷰 기준) - API 미구현으로 빈 배열 유지
  useEffect(() => {
    // 한글 설명: API 미구현으로 빈 배열 유지, 나중에 API 구현 시 아래 주석 해제
    // const loadPopularProjects = async () => {
    //   _setLoadingPopular(true);
    //   try {
    //     // 한글 설명: category는 필수이므로 기본값으로 "TECH" 사용 (실제로는 전체 조회가 필요하면 백엔드 API 변경 필요)
    //     const response = await fetchProjectsByCategory({
    //       category: "TECH" as ProjectCategory, // 한글 설명: ⚠️ 임시 - 전체 카테고리 조회 API가 필요할 수 있음
    //       sort: "popular",
    //       size: 6,
    //     });
    //     // 한글 설명: response.items가 존재하는지 확인 후 설정
    //     if (response && response.items && Array.isArray(response.items)) {
    //       _setPopularProjects(response.items);
    //     } else {
    //       _setPopularProjects([]);
    //     }
    //   } catch (error) {
    //     console.error("인기 프로젝트 조회 실패", error);
    //   } finally {
    //     _setLoadingPopular(false);
    //   }
    // };

    // 한글 설명: 지금 많이 보고 있는 프로젝트 조회 (뷰 기준)
    const loadPopularProjects = async () => {
      setLoadingPopular(true);
      try {
        // 한글 설명: GET /public/projects/most-viewed?minutes=60&size=6 API 호출
        const projects = await fetchMostViewedProjects(60, 6); // 한글 설명: 최근 60분, 최대 6개 조회
        setPopularProjects(projects);
      } catch (error) {
        console.error("지금 많이 보고 있는 프로젝트 조회 실패", error);
        setPopularProjects([]);
      } finally {
        setLoadingPopular(false);
      }
    };

    loadPopularProjects();
  }, []);

  // 한글 설명: 목표 달성 임박 프로젝트 조회 (달성률 70~95%)
  useEffect(() => {
    const loadNearGoalProjects = async () => {
      setLoadingNearGoal(true);
      try {
        // 한글 설명: GET /public/projects/near-goal?size=6 API 호출
        const projects = await fetchNearGoalProjects(6);
        setNearGoalProjects(projects);
      } catch (error) {
        console.error("목표 달성 임박 프로젝트 조회 실패", error);
        setNearGoalProjects([]);
      } finally {
        setLoadingNearGoal(false);
      }
    };

    loadNearGoalProjects();
  }, []);

  return (
    <>
      {/* 한글 설명: 관심사 설정 배너 (헤더 바로 아래, 관심사가 설정되지 않은 경우만 표시) */}
      <InterestSettingBanner />

      {/* 상단 히어로 + 하이라이트 카드 */}
      <section className="border-b border-neutral-200 bg-white">
        <Container>
          <div className="grid gap-10 py-20 md:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Crowdfunding, refined
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-5xl">
                당신의 '첫 시도'를 함께 검증해주는 크라우드펀딩, MOA
              </h1>
              <p className="max-w-xl text-base text-neutral-500">
                작지만 단단한 아이디어를,
                <br />
                데이터로 검증하고, 팬과 함께 키워가는 공간입니다.
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

              {/* 한글 설명: 이런 사람에게 추천 */}
              <div className="mt-8 space-y-3">
                <p className="text-sm font-medium text-neutral-700">
                  이런 사람에게 추천
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex items-start gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                    <span className="text-xl">🧑‍🍳</span>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium text-neutral-900">
                        소규모 브랜드 / 1인 메이커
                      </p>
                      <p className="text-xs text-neutral-600">
                        생산 최소 수량이 부담될 때
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                    <span className="text-xl">🧪</span>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium text-neutral-900">
                        새로운 제품을 테스트하고 싶은 스타트업
                      </p>
                      <p className="text-xs text-neutral-600">
                        정식 론칭 전, 시장 반응이 궁금할 때
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                    <span className="text-xl">🎨</span>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium text-neutral-900">
                        창작자·디자이너
                      </p>
                      <p className="text-xs text-neutral-600">
                        굿즈, 아트워크를 소규모로 시도해 보고 싶을 때
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 한글 설명: 신뢰/지표 라인 */}
              <div className="mt-6 border-t border-neutral-200 pt-4">
                <p className="text-xs text-neutral-500">
                  현재 준비 중인 프로젝트 12개 · 누적 성공률 74% · 평균 3일 안에
                  첫 후원 발생
                </p>
              </div>
            </div>
            {highlight ? (
              <div className="hidden flex-col gap-6 rounded-3xl border border-neutral-200 bg-neutral-100 p-8 md:flex">
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Highlight
                </span>
                <h2 className="text-2xl font-semibold text-neutral-900">
                  {highlight.title}
                </h2>
                <p className="text-sm text-neutral-600">{highlight.summary}</p>
                <div className="text-sm text-neutral-500">
                  현재{" "}
                  {highlight.raised && !isNaN(highlight.raised)
                    ? currencyKRW(highlight.raised)
                    : currencyKRW(0)}{" "}
                  ·{" "}
                  {highlight.backerCount &&
                  !isNaN(highlight.backerCount) &&
                  highlight.backerCount > 0
                    ? `${highlight.backerCount}명 후원`
                    : "0명 후원"}
                </div>
                <Link
                  to={`/projects/${highlight.id}`}
                  className="self-start rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
                >
                  프로젝트 살펴보기
                </Link>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* 한글 설명: 카테고리 퀵 필터 */}
      <CategoryQuickFilter />

      {/* 한글 설명: 오늘의 테마 배너 */}
      <ThemeBanner />

      <Container>
        {/* 1. 당신을 위한 추천 - 로그인된 사용자에게만 표시 */}
        {isAuthenticated && (
          <PersonalizedRecommendationSection
            projects={personalized}
            userName={useAuthStore.getState().user?.name ?? null}
          />
        )}

        {/* 2. 지금 뜨는 프로젝트 */}
        <TrendingProjectsSection
          projects={trending}
          loading={loadingTrending}
        />

        {/* 3. 곧 마감되는 프로젝트 */}
        <ClosingSoonSection />

        {/* 4. 예정되어 있는 펀딩 */}
        <ScheduledProjectsSection />

        {/* 5. 방금 업로드된 신규 프로젝트 */}
        <NewlyUploadedSection />

        {/* 6. 지금 많이 보고 있는 프로젝트 */}
        <PopularProjectsSection
          projects={popularProjects}
          loading={loadingPopular}
        />

        {/* 7. 목표 달성에 가까운 프로젝트 */}
        <NearGoalProjectsSection
          projects={nearGoalProjects}
          loading={loadingNearGoal}
        />

        {/* 8. 성공 메이커의 새 프로젝트 */}
        <SuccessMakerNewSection />

        {/* 9. 첫 도전 메이커 응원하기 */}
        <FirstChallengeMakerSection />
      </Container>

      {/* 10. 어떻게 작동하나요 섹션 */}
      <HowItWorksSection />

      {/* 11. 메이커 스토리 섹션 */}
      <MakerStorySection />

      {/* 12. 푸터 위 브랜드 톤 문구 */}
      <section className="border-t border-neutral-200 bg-white py-12">
        <Container>
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              MOA는 "작지만 의미 있는 시도들"이 더 많이 등장하도록 돕는
              크라우드펀딩 플랫폼입니다.
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              우리는 '될까?' 하는 고민 대신,
              <br />
              '한번 해보자'라는 시도들이 더 많아지길 바랍니다.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
};
