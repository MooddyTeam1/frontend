// 한글 설명: Admin 월별 리포트 페이지. 팀장/경영진에게 보고 가능한 단위 리포트
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { currencyKRW } from "../../../../shared/utils/format";
import { defaultChartOptions } from "../../../../shared/components/charts/ChartConfig";
import { fetchAdminMonthlyReport } from "../../../../features/admin/api/adminStatisticsService";
import type { MonthlyReportDto } from "../../../../features/admin/types";
import { PROJECT_CATEGORY_LABELS } from "../../../../features/projects/types";

export const MonthlyReportPage: React.FC = () => {
  // 한글 설명: 선택된 월 상태
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // 한글 설명: YYYY-MM 형식
  );
  const [compareMonthOption, setCompareMonthOption] = useState<
    "none" | "previous" | "lastYear"
  >("previous"); // 한글 설명: "previous" | "lastYear" | "none"

  // 한글 설명: API 데이터 상태
  const [monthlyData, setMonthlyData] = useState<MonthlyReportDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 비교 월 계산
  const getCompareMonth = (): string | undefined => {
    if (compareMonthOption === "none") return undefined;
    if (compareMonthOption === "previous") {
      // 한글 설명: 전월 계산
      const date = new Date(selectedMonth + "-01");
      date.setMonth(date.getMonth() - 1);
      return date.toISOString().slice(0, 7);
    }
    if (compareMonthOption === "lastYear") {
      // 한글 설명: 전년 동월 계산
      const date = new Date(selectedMonth + "-01");
      date.setFullYear(date.getFullYear() - 1);
      return date.toISOString().slice(0, 7);
    }
    return undefined;
  };

  // 한글 설명: 월별 리포트 데이터 조회
  const loadMonthlyReport = async () => {
    if (!selectedMonth) {
      setError("대상 월을 선택해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchAdminMonthlyReport({
        targetMonth: selectedMonth,
        compareMonth: getCompareMonth(),
      });
      setMonthlyData(data);
    } catch (err) {
      console.error("월별 리포트 데이터 조회 실패:", err);
      setError("월별 리포트 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 한글 설명: 월 또는 비교 옵션 변경 시 자동 조회
  useEffect(() => {
    loadMonthlyReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, compareMonthOption]);

  // 한글 설명: 데이터 변환 (API 응답 → UI 표시용)
  const monthlyKPI = monthlyData
    ? {
        totalFunding: monthlyData.kpi.totalFundingAmount.value,
        fundingChange: monthlyData.kpi.totalFundingAmount.changeRate,
        fundingChangeAmount: monthlyData.kpi.totalFundingAmount.changeAmount,
        successProjects: monthlyData.kpi.successProjectCount,
        failedProjects: monthlyData.kpi.failedProjectCount,
        newMakers: monthlyData.kpi.newMakerCount,
        newSupporters: monthlyData.kpi.newSupporterCount,
      }
    : null;

  // 한글 설명: 일별 펀딩 추이 데이터 변환
  const dailyFundingData = monthlyData
    ? monthlyData.trendChart.data.map((item) => {
        // 한글 설명: "11/15" 형식에서 일 추출
        const day = parseInt(item.date.split("/")[1], 10);
        return {
          day,
          date: item.date,
          funding: item.fundingAmount,
          projectCount: item.projectCount,
          orderCount: item.orderCount,
        };
      })
    : [];

  // 한글 설명: 프로젝트 성공률 분석 데이터 변환
  const successRateData = monthlyData
    ? {
        byStart: {
          total: monthlyData.successRate.startBased.totalCount,
          success: monthlyData.successRate.startBased.successCount,
          rate: monthlyData.successRate.startBased.rate,
        },
        byEnd: {
          total: monthlyData.successRate.endBased.totalCount,
          success: monthlyData.successRate.endBased.successCount,
          rate: monthlyData.successRate.endBased.rate,
        },
        byCategory: monthlyData.categorySuccessRate.categories.map((cat) => ({
          category:
            PROJECT_CATEGORY_LABELS[
              cat.categoryName as keyof typeof PROJECT_CATEGORY_LABELS
            ] || cat.categoryName,
          total: cat.totalCount,
          success: cat.successCount,
          rate: cat.successRate,
        })),
        byGoalRange: monthlyData.goalAmountRange.ranges.map((range) => ({
          range: range.rangeName,
          total: range.totalCount,
          success: range.successCount,
          rate: range.successRate,
        })),
      }
    : null;

  // 한글 설명: 리텐션 & 활동도 데이터 변환
  const retentionData = monthlyData
    ? {
        repeatBackerRate: monthlyData.retention.repeatSupporterRate,
        existingVsNew: {
          existing: monthlyData.retention.existingSupporterCount,
          new: monthlyData.retention.newSupporterCount,
          existingRate: monthlyData.retention.existingRatio,
        },
      }
    : null;

  // 한글 설명: PDF 다운로드 핸들러 (Mock)
  const handleDownloadPDF = () => {
    alert("PDF 다운로드 기능은 준비 중입니다.");
    // 한글 설명: 실제로는 API 호출하여 PDF 생성 및 다운로드
  };

  // 한글 설명: 그래프 최대값 계산 (현재 미사용)
  // const maxFunding =
  //   dailyFundingData.length > 0
  //     ? Math.max(...dailyFundingData.map((d) => d.funding))
  //     : 0;

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
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  대상 월 <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setError(null);
                  }}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  비교할 월
                </label>
                <select
                  value={compareMonthOption}
                  onChange={(e) =>
                    setCompareMonthOption(
                      e.target.value as "none" | "previous" | "lastYear"
                    )
                  }
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                >
                  <option value="none">비교 없음</option>
                  <option value="previous">전월 (자동)</option>
                  <option value="lastYear">전년 동월</option>
                </select>
                {compareMonthOption === "previous" && monthlyData && (
                  <p className="mt-1 text-xs text-neutral-400">
                    비교 월: {monthlyData.compareMonth}
                  </p>
                )}
              </div>
            </div>
            {loading && (
              <div className="mt-4 text-center text-sm text-neutral-500">
                데이터를 불러오는 중...
              </div>
            )}
          </section>

          {/* 월간 KPI 요약 */}
          {monthlyKPI ? (
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
                  {monthlyKPI.fundingChange !== 0 && (
                    <p
                      className={`mt-1 text-sm ${
                        monthlyKPI.fundingChange > 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      전월 대비{" "}
                      {monthlyKPI.fundingChange > 0 ? "+" : ""}
                      {monthlyKPI.fundingChange.toFixed(1)}% (
                      {monthlyKPI.fundingChangeAmount > 0 ? "+" : ""}
                      {currencyKRW(Math.abs(monthlyKPI.fundingChangeAmount))})
                    </p>
                  )}
                  {monthlyKPI.fundingChange === 0 && (
                    <p className="mt-1 text-sm text-neutral-500">전월과 동일</p>
                  )}
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
          ) : (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-neutral-900">
                월간 KPI 요약
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-neutral-200 bg-white p-6"
                  >
                    <div className="h-4 w-24 animate-pulse rounded bg-neutral-200"></div>
                    <div className="mt-2 h-8 w-32 animate-pulse rounded bg-neutral-200"></div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 월간 펀딩 추이 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                월간 펀딩 추이
              </h2>
              {compareMonthOption !== "none" && monthlyData && (
                <span className="text-xs text-neutral-500">
                  {monthlyData.compareMonth} 비교
                </span>
              )}
            </div>
            <div className="mt-4 h-64">
              {dailyFundingData.length > 0 ? (
                <Line
                  data={{
                    labels: dailyFundingData.map((d) => d.date),
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
                            const index = context.dataIndex;
                            const data = dailyFundingData[index];
                            return [
                              `펀딩 금액: ${currencyKRW(context.parsed.y ?? 0)}`,
                              `프로젝트: ${data.projectCount}개`,
                              `주문: ${data.orderCount}건`,
                            ];
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-neutral-500">
                  해당 월에 주문 데이터가 없습니다.
                </div>
              )}
            </div>
          </section>

          {/* 프로젝트 성공률 분석 */}
          {successRateData ? (
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
                          {successRateData.byStart.rate.toFixed(1)}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        {successRateData.byStart.success} /{" "}
                        {successRateData.byStart.total}개
                      </p>
                      {successRateData.byStart.total === 0 && (
                        <p className="mt-1 text-xs text-neutral-400">
                          해당 월에 시작한 프로젝트가 없습니다.
                        </p>
                      )}
                    </div>
                    <div className="rounded-xl border border-neutral-200 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">종료 기준</span>
                        <span className="text-sm font-semibold text-neutral-900">
                          {successRateData.byEnd.rate.toFixed(1)}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        {successRateData.byEnd.success} /{" "}
                        {successRateData.byEnd.total}개
                      </p>
                      {successRateData.byEnd.total === 0 && (
                        <p className="mt-1 text-xs text-neutral-400">
                          해당 월에 종료된 프로젝트가 없습니다.
                        </p>
                      )}
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
                      <div
                        key={idx}
                        className="rounded-xl border border-neutral-200 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-neutral-500">
                            {range.range}
                          </span>
                          <span className="text-sm font-semibold text-neutral-900">
                            {range.rate.toFixed(1)}%
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">
                          {range.success} / {range.total}개
                        </p>
                        {range.total === 0 && (
                          <p className="mt-1 text-xs text-neutral-400">
                            해당 구간에 프로젝트가 없습니다.
                          </p>
                        )}
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
                {successRateData.byCategory.length > 0 ? (
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
                              {cat.rate.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-neutral-500">
                    카테고리별 데이터가 없습니다.
                  </p>
                )}
              </div>
            </section>
          ) : (
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                프로젝트 성공률 분석
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 w-32 animate-pulse rounded bg-neutral-200"></div>
                    <div className="space-y-2">
                      {[1, 2].map((j) => (
                        <div
                          key={j}
                          className="rounded-xl border border-neutral-200 p-3"
                        >
                          <div className="h-4 w-24 animate-pulse rounded bg-neutral-200"></div>
                          <div className="mt-2 h-4 w-16 animate-pulse rounded bg-neutral-200"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 리텐션 & 활동도 */}
          {retentionData ? (
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                리텐션 & 활동도
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 p-4">
                  <p className="text-xs text-neutral-500">재후원 유저 비율</p>
                  <p className="mt-2 text-2xl font-semibold text-neutral-900">
                    {retentionData.repeatBackerRate.toFixed(1)}%
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    기존 서포터 비율 (이전에 가입했지만 이번 달에도 주문한 유저)
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
                        {retentionData.existingVsNew.existing.toLocaleString()}명 (
                        {retentionData.existingVsNew.existingRate.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">신규</span>
                      <span className="text-lg font-semibold text-neutral-900">
                        {retentionData.existingVsNew.new.toLocaleString()}명 (
                        {retentionData.existingVsNew.existingRate !== 100
                          ? (100 - retentionData.existingVsNew.existingRate).toFixed(1)
                          : "0.0"}
                        %)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                리텐션 & 활동도
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-neutral-200 p-4"
                  >
                    <div className="h-4 w-24 animate-pulse rounded bg-neutral-200"></div>
                    <div className="mt-2 h-8 w-32 animate-pulse rounded bg-neutral-200"></div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};


