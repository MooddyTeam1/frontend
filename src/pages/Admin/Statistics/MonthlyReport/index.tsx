// 한글 설명: Admin 월별 리포트 페이지. 팀장/경영진에게 보고 가능한 단위 리포트
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { currencyKRW } from "../../../../shared/utils/format";
import { defaultChartOptions } from "../../../../shared/components/charts/ChartConfig";

export const MonthlyReportPage: React.FC = () => {
  // 한글 설명: 선택된 월 상태
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // 한글 설명: YYYY-MM 형식
  );
  const [compareMonth, setCompareMonth] = useState("previous"); // 한글 설명: "previous" | "lastYear" | "none"

  // 한글 설명: Mock 데이터 (실제로는 API에서 가져옴)
  const monthlyKPI = {
    totalFunding: 1250000000,
    fundingChange: 12.5, // 한글 설명: 전월 대비 %
    successProjects: 45,
    failedProjects: 8,
    newMakers: 24,
    newSupporters: 156,
  };

  // 한글 설명: 일별 펀딩 추이 데이터 (Mock)
  const dailyFundingData = Array.from({ length: 30 }, (_, day) => ({
    day: day + 1,
    funding: Math.floor(Math.random() * 50000000) + 20000000,
  }));

  // 한글 설명: 프로젝트 성공률 분석 데이터 (Mock)
  const successRateData = {
    byStart: {
      total: 120,
      success: 45,
      rate: 37.5,
    },
    byEnd: {
      total: 100,
      success: 45,
      rate: 45.0,
    },
    byCategory: [
      { category: "테크·가전", total: 30, success: 15, rate: 50.0 },
      { category: "디자인", total: 25, success: 10, rate: 40.0 },
      { category: "푸드", total: 20, success: 8, rate: 40.0 },
      { category: "패션", total: 15, success: 5, rate: 33.3 },
    ],
    byGoalRange: [
      { range: "소액 (100만원 미만)", total: 40, success: 20, rate: 50.0 },
      { range: "중간 (100~1000만원)", total: 50, success: 20, rate: 40.0 },
      { range: "고액 (1000만원 이상)", total: 30, success: 5, rate: 16.7 },
    ],
  };

  // 한글 설명: 리텐션 & 활동도 데이터 (Mock)
  const retentionData = {
    repeatBackerRate: 68.5, // 한글 설명: 재후원 유저 비율
    existingVsNew: {
      existing: 1240,
      new: 560,
      existingRate: 68.9,
    },
  };

  // 한글 설명: PDF 다운로드 핸들러 (Mock)
  const handleDownloadPDF = () => {
    alert("PDF 다운로드 기능은 준비 중입니다.");
    // 한글 설명: 실제로는 API 호출하여 PDF 생성 및 다운로드
  };

  // 한글 설명: 그래프 최대값 계산
  const maxFunding = Math.max(...dailyFundingData.map((d) => d.funding));

  return (
    <div className="w-full">
      <div className="mx-auto min-h-[80vh] max-w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                월별 리포트
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                팀장/경영진에게 보고 가능한 단위 리포트
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/admin/statistics"
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
              >
                통계 목록
              </Link>
              <button
                onClick={handleDownloadPDF}
                className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                PDF 다운로드
              </button>
            </div>
          </div>

          {/* 상단 선택 */}
          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">
              리포트 기간 선택
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  대상 월
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  비교할 월
                </label>
                <select
                  value={compareMonth}
                  onChange={(e) => setCompareMonth(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                >
                  <option value="none">비교 없음</option>
                  <option value="previous">전월</option>
                  <option value="lastYear">전년 동월</option>
                </select>
              </div>
            </div>
          </section>

          {/* 월간 KPI 요약 */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              월간 KPI 요약
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <p className="text-xs text-neutral-500">월간 총 펀딩 금액</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-900">
                  {currencyKRW(monthlyKPI.totalFunding)}
                </p>
                <p className="mt-1 text-sm text-emerald-600">
                  전월 대비 +{monthlyKPI.fundingChange}%
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <p className="text-xs text-neutral-500">
                  월간 성공 종료 프로젝트 수
                </p>
                <p className="mt-2 text-2xl font-semibold text-neutral-900">
                  {monthlyKPI.successProjects}개
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  목표 달성률 &gt;= 100%
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <p className="text-xs text-neutral-500">실패 종료 프로젝트 수</p>
                <p className="mt-2 text-2xl font-semibold text-red-600">
                  {monthlyKPI.failedProjects}개
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <p className="text-xs text-neutral-500">신규 메이커 수</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-900">
                  {monthlyKPI.newMakers}명
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <p className="text-xs text-neutral-500">신규 서포터 수</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-900">
                  {monthlyKPI.newSupporters}명
                </p>
              </div>
            </div>
          </section>

          {/* 월간 펀딩 추이 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                월간 펀딩 추이
              </h2>
              {compareMonth !== "none" && (
                <span className="text-xs text-neutral-500">
                  {compareMonth === "previous" ? "전월" : "전년 동월"} 비교
                </span>
              )}
            </div>
            <div className="mt-4 h-64">
              <Line
                data={{
                  labels: dailyFundingData.map((d) => `${d.day}일`),
                  datasets: [
                    {
                      label: "일별 펀딩 금액",
                      data: dailyFundingData.map((d) => d.funding),
                      borderColor: "rgb(16, 185, 129)",
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      tension: 0.4,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  ...defaultChartOptions,
                  plugins: {
                    ...defaultChartOptions.plugins,
                    tooltip: {
                      ...defaultChartOptions.plugins?.tooltip,
                      callbacks: {
                        label: (context) => {
                          return `펀딩 금액: ${currencyKRW(context.parsed.y)}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </section>

          {/* 프로젝트 성공률 분석 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              프로젝트 성공률 분석
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/* 시작 기준 vs 종료 기준 */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-700">
                  시작 기준 vs 종료 기준
                </h3>
                <div className="space-y-2">
                  <div className="rounded-xl border border-neutral-200 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">시작 기준</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {successRateData.byStart.rate}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">
                      {successRateData.byStart.success} /{" "}
                      {successRateData.byStart.total}개
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-200 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">종료 기준</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {successRateData.byEnd.rate}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">
                      {successRateData.byEnd.success} /{" "}
                      {successRateData.byEnd.total}개
                    </p>
                  </div>
                </div>
              </div>

              {/* 목표 금액 구간별 성공률 */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-700">
                  목표 금액 구간별 성공률
                </h3>
                <div className="space-y-2">
                  {successRateData.byGoalRange.map((range, idx) => (
                    <div key={idx} className="rounded-xl border border-neutral-200 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">
                          {range.range}
                        </span>
                        <span className="text-sm font-semibold text-neutral-900">
                          {range.rate}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        {range.success} / {range.total}개
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 카테고리별 성공률 */}
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-neutral-700">
                카테고리별 성공률
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                    <tr>
                      <th className="px-3 py-2 text-left">카테고리</th>
                      <th className="px-3 py-2 text-right">전체</th>
                      <th className="px-3 py-2 text-right">성공</th>
                      <th className="px-3 py-2 text-right">성공률</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {successRateData.byCategory.map((cat, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 font-medium text-neutral-900">
                          {cat.category}
                        </td>
                        <td className="px-3 py-2 text-right text-neutral-600">
                          {cat.total}개
                        </td>
                        <td className="px-3 py-2 text-right text-neutral-600">
                          {cat.success}개
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-neutral-900">
                          {cat.rate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 리텐션 & 활동도 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              리텐션 & 활동도
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="text-xs text-neutral-500">재후원 유저 비율</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-900">
                  {retentionData.repeatBackerRate}%
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  한 번 이상 후원한 유저 대비 재후원 유저 비율
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="text-xs text-neutral-500">
                  기존 서포터 vs 신규 서포터
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">기존</span>
                    <span className="text-lg font-semibold text-neutral-900">
                      {retentionData.existingVsNew.existing}명 (
                      {retentionData.existingVsNew.existingRate}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">신규</span>
                    <span className="text-lg font-semibold text-neutral-900">
                      {retentionData.existingVsNew.new}명 (
                      {100 - retentionData.existingVsNew.existingRate}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

