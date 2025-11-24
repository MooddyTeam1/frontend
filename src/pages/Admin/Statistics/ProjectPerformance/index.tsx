// 한글 설명: Admin 프로젝트 성과 리포트 페이지. 프로젝트별 성과 분석
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { currencyKRW } from "../../../../shared/utils/format";

export const ProjectPerformancePage: React.FC = () => {
  // 한글 설명: 필터 상태
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMaker, setFilterMaker] = useState("all");

  // 한글 설명: 프로젝트별 성과 데이터 (Mock)
  const projectPerformance = [
    {
      projectId: 1,
      projectName: "Smart LED Lamp",
      makerName: "알파메이커",
      category: "테크·가전",
      funding: 24500000,
      goalAmount: 10000000,
      achievementRate: 245,
      backers: 156,
      avgBackingAmount: 157051,
      bookmarks: 342,
      visitors: 1240,
      conversionRate: 12.6,
    },
    {
      projectId: 2,
      projectName: "Compact Coffee Kit",
      makerName: "브라보팩토리",
      category: "푸드",
      funding: 19800000,
      goalAmount: 10000000,
      achievementRate: 198,
      backers: 132,
      avgBackingAmount: 150000,
      bookmarks: 289,
      visitors: 980,
      conversionRate: 13.5,
    },
    {
      projectId: 3,
      projectName: "Pet AI Tracker",
      makerName: "크래프트랩",
      category: "테크·가전",
      funding: 15600000,
      goalAmount: 10000000,
      achievementRate: 156,
      backers: 98,
      avgBackingAmount: 159184,
      bookmarks: 234,
      visitors: 850,
      conversionRate: 11.5,
    },
  ];

  // 한글 설명: 카테고리별 평균 성과 데이터 (Mock)
  const categoryAverage = [
    {
      category: "테크·가전",
      avgAchievementRate: 185.5,
      avgFunding: 20000000,
      successRate: 65.0,
      projectCount: 30,
    },
    {
      category: "디자인",
      avgAchievementRate: 142.3,
      avgFunding: 15000000,
      successRate: 55.0,
      projectCount: 25,
    },
    {
      category: "푸드",
      avgAchievementRate: 128.7,
      avgFunding: 12000000,
      successRate: 50.0,
      projectCount: 20,
    },
  ];

  // 한글 설명: 메이커별 평균 성과 데이터 (Mock)
  const makerAverage = [
    {
      makerId: "MK-1029",
      makerName: "알파메이커",
      projectCount: 3,
      avgFunding: 22000000,
      successRate: 100.0,
      isFirstProject: false,
    },
    {
      makerId: "MK-2041",
      makerName: "브라보팩토리",
      projectCount: 1,
      avgFunding: 19800000,
      successRate: 100.0,
      isFirstProject: true,
    },
  ];

  // 한글 설명: 위험/기회 프로젝트 데이터 (Mock)
  const riskProjects = [
    {
      type: "위험" as const,
      projectId: 10,
      projectName: "Low Performance Project",
      makerName: "테스트메이커",
      daysLeft: 3,
      achievementRate: 45,
      goalAmount: 10000000,
      raised: 4500000,
      reason: "마감 임박인데 달성률 낮음",
    },
  ];

  const opportunityProjects = [
    {
      type: "기회" as const,
      projectId: 11,
      projectName: "High Potential Project",
      makerName: "성공메이커",
      daysLeft: 25,
      achievementRate: 85,
      goalAmount: 10000000,
      raised: 8500000,
      reason: "초기 반응이 매우 좋은 프로젝트",
    },
  ];

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
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  카테고리
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                >
                  <option value="all">전체</option>
                  <option value="tech">테크·가전</option>
                  <option value="design">디자인</option>
                  <option value="food">푸드</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">메이커</label>
                <select
                  value={filterMaker}
                  onChange={(e) => setFilterMaker(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                >
                  <option value="all">전체</option>
                  <option value="MK-1029">알파메이커</option>
                  <option value="MK-2041">브라보팩토리</option>
                </select>
              </div>
            </div>
          </section>

          {/* 프로젝트별 성과 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              프로젝트별 성과
            </h2>
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
                          {project.achievementRate}%
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-neutral-600">
                        {project.backers}명
                      </td>
                      <td className="px-3 py-2 text-right text-neutral-600">
                        {currencyKRW(project.avgBackingAmount)}
                      </td>
                      <td className="px-3 py-2 text-right text-neutral-600">
                        {project.bookmarks}개
                      </td>
                      <td className="px-3 py-2 text-right text-neutral-600">
                        {project.conversionRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* 카테고리별 평균 성과 */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                카테고리별 평균 성과
              </h2>
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
                          {cat.avgAchievementRate}%
                        </td>
                        <td className="px-3 py-2 text-right text-neutral-600">
                          {currencyKRW(cat.avgFunding)}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-neutral-900">
                          {cat.successRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 메이커별 평균 성과 */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                메이커별 평균 성과
              </h2>
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
                              {maker.makerId}
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
                          {maker.successRate}%
                        </td>
                        <td className="px-3 py-2">
                          {maker.isFirstProject ? (
                            <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                              첫 프로젝트
                            </span>
                          ) : (
                            <span className="text-xs text-neutral-500">N번째</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                          D-{project.daysLeft}
                        </span>
                        <span className="font-semibold text-red-600">
                          달성률: {project.achievementRate}%
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
                          D-{project.daysLeft}
                        </span>
                        <span className="font-semibold text-emerald-600">
                          달성률: {project.achievementRate}%
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

