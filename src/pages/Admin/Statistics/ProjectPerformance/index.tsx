// 한글 설명: Admin 프로젝트 성과 리포트 페이지. 프로젝트별 성과 분석
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { currencyKRW } from "../../../../shared/utils/format";
import { fetchAdminProjectPerformance } from "../../../../features/admin/api/adminStatisticsService";
import type { ProjectPerformanceDto } from "../../../../features/admin/types";
import { PROJECT_CATEGORY_LABELS } from "../../../../features/projects/types";

export const ProjectPerformancePage: React.FC = () => {
  // 한글 설명: 필터 상태
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterMaker, setFilterMaker] = useState<string>("all");

  // 한글 설명: API 데이터 상태
  const [performanceData, setPerformanceData] =
    useState<ProjectPerformanceDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 프로젝트 성과 데이터 조회
  const loadProjectPerformance = async () => {
    setLoading(true);
    setError(null);

    try {
      // 한글 설명: 필터 변환 (프론트엔드 → 백엔드)
      let apiCategory: string | undefined = undefined;
      if (filterCategory !== "all") {
        // 한글 설명: 프론트엔드 카테고리 값 → 백엔드 Enum 값 변환
        const categoryMap: Record<string, string> = {
          tech: "TECH",
          design: "DESIGN",
          food: "FOOD",
          fashion: "FASHION",
          beauty: "BEAUTY",
          "home-living": "HOME_LIVING",
          game: "GAME",
          art: "ART",
          publish: "PUBLISH",
        };
        apiCategory = categoryMap[filterCategory];
      }

      let apiMakerId: number | undefined = undefined;
      if (filterMaker !== "all") {
        // 한글 설명: 메이커 ID 파싱 (문자열 → 숫자)
        const makerIdNum = parseInt(filterMaker, 10);
        if (!isNaN(makerIdNum)) {
          apiMakerId = makerIdNum;
        }
      }

      const data = await fetchAdminProjectPerformance({
        category: apiCategory,
        makerId: apiMakerId,
      });
      setPerformanceData(data);
    } catch (err) {
      console.error("프로젝트 성과 데이터 조회 실패:", err);
      setError("프로젝트 성과 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 한글 설명: 필터 변경 시 자동 조회
  useEffect(() => {
    loadProjectPerformance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, filterMaker]);

  // 한글 설명: 데이터 변환 (API 응답 → UI 표시용)
  const projectPerformance = performanceData
    ? performanceData.projects.map((project) => ({
        projectId: project.projectId,
        projectName: project.projectName,
        makerName: project.makerName,
        category:
          PROJECT_CATEGORY_LABELS[
            project.category as keyof typeof PROJECT_CATEGORY_LABELS
          ] || project.category,
        funding: project.fundingAmount,
        achievementRate: project.achievementRate,
        backers: project.supporterCount,
        avgBackingAmount: project.averageSupportAmount,
        bookmarks: project.bookmarkCount,
        conversionRate: project.conversionRate,
        remainingDays: project.remainingDays,
      }))
    : [];

  // 한글 설명: 카테고리별 평균 성과 데이터 변환
  const categoryAverage = performanceData
    ? performanceData.categoryAverages.map((cat) => ({
        category:
          PROJECT_CATEGORY_LABELS[
            cat.categoryName as keyof typeof PROJECT_CATEGORY_LABELS
          ] || cat.categoryName,
        avgAchievementRate: cat.averageAchievementRate,
        avgFunding: cat.averageFundingAmount,
        successRate: cat.successRate,
      }))
    : [];

  // 한글 설명: 메이커별 평균 성과 데이터 변환
  const makerAverage = performanceData
    ? performanceData.makerAverages.map((maker) => ({
        makerId: maker.makerId.toString(),
        makerName: maker.makerName,
        projectCount: maker.projectCount,
        avgFunding: maker.averageFundingAmount,
        successRate: maker.successRate,
        isFirstProject: maker.isFirstProject,
      }))
    : [];

  // 한글 설명: 위험 프로젝트 데이터 변환
  const riskProjects = performanceData
    ? performanceData.riskProjects.map((project) => ({
        projectId: project.projectId,
        projectName: project.projectName,
        makerName: project.makerName,
        daysLeft: project.remainingDays,
        achievementRate: project.achievementRate,
        reason: project.reason,
      }))
    : [];

  // 한글 설명: 기회 프로젝트 데이터 변환
  const opportunityProjects = performanceData
    ? performanceData.opportunityProjects.map((project) => ({
        projectId: project.projectId,
        projectName: project.projectName,
        makerName: project.makerName,
        daysLeft: project.remainingDays,
        achievementRate: project.achievementRate,
        reason: project.reason,
      }))
    : [];

  return (
    <div className="w-full">
      <div className="mx-auto min-h-[80vh] max-w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                프로젝트 성과 리포트
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                프로젝트별 성과를 분석하고 위험/기회를 파악하세요
              </p>
            </div>
            <Link
              to="/admin/statistics"
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              통계 목록
            </Link>
          </div>

          {/* 필터 */}
          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">필터</h2>
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  카테고리
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setError(null);
                  }}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                >
                  <option value="all">전체</option>
                  <option value="tech">테크·가전</option>
                  <option value="design">디자인</option>
                  <option value="food">푸드</option>
                  <option value="fashion">패션</option>
                  <option value="beauty">뷰티</option>
                  <option value="home-living">홈·리빙</option>
                  <option value="game">게임</option>
                  <option value="art">아트</option>
                  <option value="publish">출판</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  메이커 ID
                </label>
                <input
                  type="text"
                  value={filterMaker === "all" ? "" : filterMaker}
                  onChange={(e) => {
                    setFilterMaker(e.target.value || "all");
                    setError(null);
                  }}
                  placeholder="메이커 ID (숫자) 또는 전체"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                />
                <p className="mt-1 text-xs text-neutral-400">
                  메이커 ID를 숫자로 입력하세요 (예: 1003)
                </p>
              </div>
            </div>
            {loading && (
              <div className="mt-4 text-center text-sm text-neutral-500">
                데이터를 불러오는 중...
              </div>
            )}
          </section>

          {/* 프로젝트별 성과 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              프로젝트별 성과
            </h2>
            {projectPerformance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                    <tr>
                      <th className="px-3 py-2 text-left">프로젝트</th>
                      <th className="px-3 py-2 text-left">카테고리</th>
                      <th className="px-3 py-2 text-right">펀딩 금액</th>
                      <th className="px-3 py-2 text-right">달성률</th>
                      <th className="px-3 py-2 text-right">후원자 수</th>
                      <th className="px-3 py-2 text-right">평균 후원액</th>
                      <th className="px-3 py-2 text-right">북마크</th>
                      <th className="px-3 py-2 text-right">전환율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {projectPerformance.map((project) => (
                      <tr key={project.projectId}>
                        <td className="px-3 py-2">
                          <div>
                            <Link
                              to={`/projects/${project.projectId}`}
                              className="font-medium text-neutral-900 hover:underline"
                            >
                              {project.projectName}
                            </Link>
                            <p className="text-xs text-neutral-500">
                              {project.makerName}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-neutral-600">
                          {project.category}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-neutral-900">
                          {currencyKRW(project.funding)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <span
                            className={`font-semibold ${
                              project.achievementRate >= 100
                                ? "text-emerald-600"
                                : project.achievementRate >= 70
                                  ? "text-amber-600"
                                  : "text-red-600"
                            }`}
                          >
                            {project.achievementRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right text-neutral-600">
                          {project.backers}명
                        </td>
                        <td className="px-3 py-2 text-right text-neutral-600">
                          {currencyKRW(project.avgBackingAmount)}
                        </td>
                        <td className="px-3 py-2 text-right text-neutral-600">
                          {project.bookmarks === 0 ? (
                            <span className="text-xs text-neutral-400">-</span>
                          ) : (
                            `${project.bookmarks}개`
                          )}
                        </td>
                        <td className="px-3 py-2 text-right text-neutral-600">
                          {project.conversionRate === 0 ? (
                            <span className="text-xs text-neutral-400">추후 제공</span>
                          ) : (
                            `${project.conversionRate.toFixed(1)}%`
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-neutral-500">
                프로젝트 데이터가 없습니다.
              </p>
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* 카테고리별 평균 성과 */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                카테고리별 평균 성과
              </h2>
              {categoryAverage.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                      <tr>
                        <th className="px-3 py-2 text-left">카테고리</th>
                        <th className="px-3 py-2 text-right">평균 달성률</th>
                        <th className="px-3 py-2 text-right">평균 펀딩액</th>
                        <th className="px-3 py-2 text-right">성공률</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {categoryAverage.map((cat, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 font-medium text-neutral-900">
                            {cat.category}
                          </td>
                          <td className="px-3 py-2 text-right text-neutral-600">
                            {cat.avgAchievementRate.toFixed(1)}%
                          </td>
                          <td className="px-3 py-2 text-right text-neutral-600">
                            {currencyKRW(cat.avgFunding)}
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-neutral-900">
                            {cat.successRate.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-neutral-500">
                  카테고리별 데이터가 없습니다.
                </p>
              )}
            </section>

            {/* 메이커별 평균 성과 */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                메이커별 평균 성과
              </h2>
              {makerAverage.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                      <tr>
                        <th className="px-3 py-2 text-left">메이커</th>
                        <th className="px-3 py-2 text-right">프로젝트 수</th>
                        <th className="px-3 py-2 text-right">평균 펀딩액</th>
                        <th className="px-3 py-2 text-right">성공률</th>
                        <th className="px-3 py-2 text-left">첫 프로젝트</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {makerAverage.map((maker) => (
                        <tr key={maker.makerId}>
                          <td className="px-3 py-2">
                            <div>
                              <p className="font-medium text-neutral-900">
                                {maker.makerName}
                              </p>
                              <p className="text-xs text-neutral-500">
                                ID: {maker.makerId}
                              </p>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right text-neutral-600">
                            {maker.projectCount}개
                          </td>
                          <td className="px-3 py-2 text-right text-neutral-600">
                            {currencyKRW(maker.avgFunding)}
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-neutral-900">
                            {maker.successRate.toFixed(1)}%
                          </td>
                          <td className="px-3 py-2">
                            {maker.isFirstProject ? (
                              <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                                첫 프로젝트
                              </span>
                            ) : (
                              <span className="text-xs text-neutral-500">
                                {maker.projectCount}번째
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-neutral-500">
                  메이커별 데이터가 없습니다.
                </p>
              )}
            </section>
          </div>

          {/* 위험/기회 프로젝트 리스트 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 위험 프로젝트 */}
            <section className="space-y-4 rounded-3xl border border-red-200 bg-red-50 p-6">
              <h2 className="text-lg font-semibold text-red-900">
                위험 프로젝트
              </h2>
              <div className="space-y-3">
                {riskProjects.length > 0 ? (
                  riskProjects.map((project) => (
                    <div
                      key={project.projectId}
                      className="rounded-2xl border border-red-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            to={`/projects/${project.projectId}`}
                            className="font-medium text-neutral-900 hover:underline"
                          >
                            {project.projectName}
                          </Link>
                          <p className="mt-1 text-xs text-neutral-500">
                            {project.makerName}
                          </p>
                          <p className="mt-2 text-xs text-red-700">
                            {project.reason}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-neutral-600">
                          {project.daysLeft < 0
                            ? "종료"
                            : project.daysLeft === 0
                              ? "D-0"
                              : `D-${project.daysLeft}`}
                        </span>
                        <span className="font-semibold text-red-600">
                          달성률: {project.achievementRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">
                    현재 위험 프로젝트가 없습니다.
                  </p>
                )}
              </div>
            </section>

            {/* 기회 프로젝트 */}
            <section className="space-y-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <h2 className="text-lg font-semibold text-emerald-900">
                기회 프로젝트
              </h2>
              <div className="space-y-3">
                {opportunityProjects.length > 0 ? (
                  opportunityProjects.map((project) => (
                    <div
                      key={project.projectId}
                      className="rounded-2xl border border-emerald-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            to={`/projects/${project.projectId}`}
                            className="font-medium text-neutral-900 hover:underline"
                          >
                            {project.projectName}
                          </Link>
                          <p className="mt-1 text-xs text-neutral-500">
                            {project.makerName}
                          </p>
                          <p className="mt-2 text-xs text-emerald-700">
                            {project.reason}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-neutral-600">
                          {project.daysLeft < 0
                            ? "종료"
                            : project.daysLeft === 0
                              ? "D-0"
                              : `D-${project.daysLeft}`}
                        </span>
                        <span className="font-semibold text-emerald-600">
                          달성률: {project.achievementRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">
                    현재 기회 프로젝트가 없습니다.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};


