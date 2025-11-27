import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container } from "../../shared/components/Container";
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

      {/* 한글 설명: 상단 히어로 섹션 - 강한 시각적 임팩트와 감각적인 컬러 조합 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50/50 via-pink-50/30 to-orange-50/40">
        {/* 한글 설명: 다층 그라데이션 배경 - 감각적인 컬러 조합 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-purple-100/30 via-pink-100/20 to-orange-100/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.15),transparent_50%)]" />
        
        {/* 한글 설명: 애니메이션 배경 패턴 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(236,72,153,0.05)_1px,transparent_1px)] bg-[size:6rem_6rem] animate-pulse" />
        
        {/* 한글 설명: 장식적 원형 요소 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <Container>
          <div className="relative py-24 md:py-32 lg:py-40">
            <div className="mx-auto max-w-4xl text-center space-y-10">
              {/* 한글 설명: 상단 라벨 - 코랄 액센트 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-100 to-orange-100 border border-pink-200/50">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 animate-pulse" />
                <p className="text-sm font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 uppercase">
                  크라우드펀딩 플랫폼
                </p>
              </div>
              
              {/* 한글 설명: 메인 헤드라인 - 자연스럽고 모던한 타이포그래피 */}
              <h1 className="text-4xl font-bold leading-relaxed tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
                <span className="block mb-1.5">
                  <span className="inline-block font-semibold">당신의</span>{" "}
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-bold">
                    아이디어를
                  </span>
                </span>
                <span className="block mt-1.5">
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 via-pink-600 to-orange-500 font-bold">
                    실제로
                  </span>{" "}
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-orange-500 to-pink-600 font-bold">
                    만들어보세요
                  </span>
                </span>
              </h1>
              
              {/* 한글 설명: 서브 텍스트 - 더 큰 사이즈 */}
              <p className="mx-auto max-w-2xl text-xl text-neutral-700 md:text-2xl leading-relaxed">
                작지만 단단한 아이디어를 데이터로 검증하고,
                <br className="hidden md:block" />
                팬과 함께 키워가는 크라우드펀딩 플랫폼입니다.
              </p>
              
              {/* 한글 설명: CTA 버튼 - 강한 그라데이션과 그림자 */}
              <div className="flex flex-col items-center justify-center gap-5 sm:flex-row pt-4">
                <Link
                  to="/projects"
                  className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-indigo-500/40 transition-all hover:shadow-indigo-500/60 hover:scale-105 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
                >
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
                  <span className="relative">프로젝트 둘러보기</span>
                  <svg className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/creator/projects/new"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-indigo-600 bg-white px-10 py-5 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 hover:scale-105 shadow-lg"
                >
                  프로젝트 시작하기
                </Link>
              </div>
              
              {/* 한글 설명: 신뢰 지표 - 더 강한 시각적 임팩트 */}
              <div className="pt-12 border-t-2 border-indigo-200/50">
                <div className="flex flex-wrap items-center justify-center gap-8 text-base text-neutral-700">
                  <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/50 group-hover:scale-110 transition-transform">
                      12
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">개</div>
                      <div className="text-sm text-neutral-600">준비 중인 프로젝트</div>
                    </div>
                  </div>
                  <div className="hidden sm:block w-1 h-8 rounded-full bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300" />
                  <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-pink-500/50 group-hover:scale-110 transition-transform">
                      74
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600">%</div>
                      <div className="text-sm text-neutral-600">누적 성공률</div>
                    </div>
                  </div>
                  <div className="hidden sm:block w-1 h-8 rounded-full bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300" />
                  <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
                      3
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">일</div>
                      <div className="text-sm text-neutral-600">평균 첫 후원 발생</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 한글 설명: 카테고리 퀵 필터 */}
      <CategoryQuickFilter />

      {/* 한글 설명: 오늘의 테마 배너 */}
      <ThemeBanner />

      {/* 한글 설명: 프로젝트 섹션들 - 부드러운 배경 전환 */}
      <div className="relative bg-gradient-to-b from-indigo-50/30 via-white to-white">
        <Container className="relative py-16 md:py-20">
          {/* 한글 설명: 섹션 간격을 위한 래퍼 */}
          <div className="space-y-20 md:space-y-24">
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
          </div>
        </Container>
      </div>

      {/* 10. 어떻게 작동하나요 섹션 */}
      <HowItWorksSection />

      {/* 11. 메이커 스토리 섹션 */}
      <MakerStorySection />

      {/* 한글 설명: 푸터 위 브랜드 톤 문구 - 감각적인 그라데이션 배경 */}
      <section className="border-t-2 border-indigo-200/50 bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-pink-50/80 py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 md:text-3xl">
              MOA는 "작지만 의미 있는 시도들"이 더 많이 등장하도록 돕는
              크라우드펀딩 플랫폼입니다.
            </p>
            <p className="text-lg text-neutral-700 md:text-xl">
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
