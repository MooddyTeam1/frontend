// 한글 설명: Admin 일일 통계 페이지. 날짜 단위로 세부 통계를 확인
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { currencyKRW } from "../../../../shared/utils/format";
import { defaultChartOptions } from "../../../../shared/components/charts/ChartConfig";
import { fetchAdminDailyStatistics } from "../../../../features/admin/api/adminStatisticsService";
import type { DailyStatisticsDto } from "../../../../features/admin/types";

export const DailyStatisticsPage: React.FC = () => {
  // 한글 설명: 필터 상태
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split("T")[0], // 한글 설명: 오늘 날짜
    to: new Date().toISOString().split("T")[0],
  });
  const [filterType, setFilterType] = useState<
    "all" | "category" | "maker" | "project"
  >("all");
  const [filterValue, setFilterValue] = useState("");

  // 한글 설명: API 데이터 상태
  const [dailyData, setDailyData] = useState<DailyStatisticsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 일일 통계 데이터 조회
  const loadDailyStatistics = async () => {
    // 한글 설명: 날짜 범위 검증
    if (!dateRange.from || !dateRange.to) {
      setError("시작일과 종료일을 모두 선택해주세요.");
      return;
    }

    if (new Date(dateRange.from) > new Date(dateRange.to)) {
      setError("시작일이 종료일보다 이후일 수 없습니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 한글 설명: 필터 타입 변환 (프론트엔드 → 백엔드)
      let apiFilterType: "PLATFORM" | "CATEGORY" | "MAKER" | undefined = undefined;
      if (filterType === "category" && filterValue) {
        apiFilterType = "CATEGORY";
      } else if (filterType === "maker" && filterValue) {
        apiFilterType = "MAKER";
      }

      const data = await fetchAdminDailyStatistics({
        startDate: dateRange.from,
        endDate: dateRange.to,
        filterType: apiFilterType,
        filterValue: filterValue || undefined,
      });
      setDailyData(data);
    } catch (err) {
      console.error("일일 통계 데이터 조회 실패:", err);
      setError("일일 통계 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 한글 설명: 날짜 범위 또는 필터 변경 시 자동 조회
  useEffect(() => {
    loadDailyStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.from, dateRange.to, filterType, filterValue]);

  // 한글 설명: 데이터 변환 (API 응답 → UI 표시용)
  const summaryData = dailyData
    ? {
        visitors: dailyData.traffic.uniqueVisitors, // 추후 구현 (현재 항상 0)
        pageViews: dailyData.traffic.pageViews, // 추후 구현 (현재 항상 0)
        newUsers: dailyData.traffic.newUsers,
        returnRate: dailyData.traffic.returningRate, // 추후 구현 (현재 항상 0.0)
        newProjects: dailyData.projectActivity.newProjectCount,
        reviewRequests: dailyData.projectActivity.reviewRequestedCount,
        approvedProjects: dailyData.projectActivity.approvedCount,
        closedProjects: dailyData.projectActivity.closedTodayCount,
        paymentAttempts: dailyData.paymentStatistics.attemptCount,
        paymentSuccess: dailyData.paymentStatistics.successCount,
        paymentSuccessRate: dailyData.paymentStatistics.successRate,
        paymentFailures: dailyData.paymentStatistics.failureCount,
        refunds: dailyData.paymentStatistics.refundCount,
        refundAmount: dailyData.paymentStatistics.refundAmount,
      }
    : null;

  // 한글 설명: 시간대별 결제 데이터 변환
  const hourlyPaymentData = dailyData
    ? dailyData.hourlyChart.data.map((item) => ({
        hour: item.hour,
        attempts: item.successCount + item.failureCount,
        success: item.successCount,
        failure: item.failureCount,
        amount: item.successAmount,
      }))
    : [];

  // 한글 설명: 프로젝트별 상세 데이터 변환
  const projectDetails = dailyData
    ? dailyData.projectDetails.map((project) => ({
        projectId: project.projectId,
        projectName: project.projectName,
        makerName: project.makerName,
        visitors: 0, // 백엔드 응답에 없음 (추후 구현)
        backers: project.orderCount,
        amount: project.fundingAmount,
        conversionRate: project.conversionRate, // 추후 구현 (현재 항상 0.0)
      }))
    : [];

  // 한글 설명: 메이커별 상세 데이터 변환
  const makerDetails = dailyData
    ? dailyData.makerDetails.map((maker) => ({
        makerId: maker.makerId.toString(),
        makerName: maker.makerName,
        projects: maker.projectCount,
        backers: maker.orderCount,
        amount: maker.fundingAmount,
      }))
    : [];

  // 한글 설명: 시간대별 그래프 최대값 (현재 미사용)
  // const maxHourlyAmount =
  //   hourlyPaymentData.length > 0
  //     ? Math.max(...hourlyPaymentData.map((d) => d.amount))
  //     : 0;

  return (
    <div className="w-full">
      <div className="mx-auto min-h-[80vh] max-w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">일일 통계</h1>
              <p className="mt-1 text-sm text-neutral-500">
                날짜 단위로 세부 통계를 확인하세요
              </p>
            </div>
            <Link
              to="/admin/statistics"
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              통계 목록
            </Link>
          </div>

          {/* 상단 필터 */}
          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">
              필터
            </h2>
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  시작일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => {
                    setDateRange({ ...dateRange, from: e.target.value });
                    setError(null);
                  }}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  종료일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => {
                    setDateRange({ ...dateRange, to: e.target.value });
                    setError(null);
                  }}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  필터 타입
                </label>
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(
                      e.target.value as "all" | "category" | "maker" | "project"
                    );
                    setFilterValue(""); // 필터 타입 변경 시 값 초기화
                  }}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                >
                  <option value="all">플랫폼 전체</option>
                  <option value="category">특정 카테고리</option>
                  <option value="maker">특정 메이커</option>
                  <option value="project" disabled>특정 프로젝트 (API 미지원)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  필터 값
                </label>
                <input
                  type="text"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder={
                    filterType === "all"
                      ? "전체"
                      : filterType === "category"
                        ? "카테고리 Enum (예: TECH, DESIGN)"
                        : filterType === "maker"
                          ? "메이커 ID (예: 1003)"
                          : "프로젝트 필터는 미지원"
                  }
                  disabled={filterType === "all" || filterType === "project"}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none disabled:bg-neutral-50"
                />
                {filterType === "category" && (
                  <p className="mt-1 text-xs text-neutral-400">
                    영문 Enum만 입력 (TECH, DESIGN, FOOD 등)
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

          {/* 선택 날짜의 요약 카드 */}
          {summaryData ? (
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <p className="text-xs text-neutral-500">
                  방문자 수 (UV) {summaryData.visitors === 0 && (
                    <span className="text-xs text-neutral-400">(추후 제공 예정)</span>
                  )}
                </p>
                <p className="mt-2 text-xl font-semibold text-neutral-900">
                  {summaryData.visitors.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <p className="text-xs text-neutral-500">
                  페이지뷰 (PV) {summaryData.pageViews === 0 && (
                    <span className="text-xs text-neutral-400">(추후 제공 예정)</span>
                  )}
                </p>
                <p className="mt-2 text-xl font-semibold text-neutral-900">
                  {summaryData.pageViews.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <p className="text-xs text-neutral-500">신규 가입자 수</p>
                <p className="mt-2 text-xl font-semibold text-neutral-900">
                  {summaryData.newUsers}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <p className="text-xs text-neutral-500">
                  재방문자 비율 {summaryData.returnRate === 0 && (
                    <span className="text-xs text-neutral-400">(추후 제공 예정)</span>
                  )}
                </p>
                <p className="mt-2 text-xl font-semibold text-neutral-900">
                  {summaryData.returnRate.toFixed(1)}%
                </p>
              </div>
            </section>
          ) : (
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-neutral-200 bg-white p-4"
                >
                  <div className="h-6 w-24 animate-pulse rounded bg-neutral-200"></div>
                  <div className="mt-2 h-8 w-32 animate-pulse rounded bg-neutral-200"></div>
                </div>
              ))}
            </section>
          )}

          {summaryData ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* 프로젝트 & 펀딩 지표 */}
              <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-neutral-900">
                  프로젝트 & 펀딩
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <p className="text-xs text-neutral-500">
                      신규 등록 프로젝트 수
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-neutral-900">
                      {summaryData.newProjects}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <p className="text-xs text-neutral-500">
                      심사 요청된 프로젝트 수
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-neutral-900">
                      {summaryData.reviewRequests}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <p className="text-xs text-neutral-500">승인된 프로젝트 수</p>
                    <p className="mt-2 text-2xl font-semibold text-neutral-900">
                      {summaryData.approvedProjects}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <p className="text-xs text-neutral-500">
                      종료된 프로젝트 수
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-neutral-900">
                      {summaryData.closedProjects}
                    </p>
                  </div>
                </div>
              </section>

              {/* 결제/정산 관련 지표 */}
              <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-neutral-900">
                  결제 / 정산 관련
                </h2>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neutral-500">결제 시도 건수</p>
                      <p className="text-lg font-semibold text-neutral-900">
                        {summaryData.paymentAttempts}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neutral-500">
                        결제 성공 건수 & 성공률
                      </p>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-neutral-900">
                          {summaryData.paymentSuccess}
                        </p>
                        <p className="text-xs text-emerald-600">
                          {summaryData.paymentSuccessRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neutral-500">결제 실패 건수</p>
                      <p className="text-lg font-semibold text-red-600">
                        {summaryData.paymentFailures}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neutral-500">
                        환불/취소 건수 & 금액
                      </p>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-neutral-900">
                          {summaryData.refunds}건
                        </p>
                        <p className="text-xs text-neutral-600">
                          {currencyKRW(summaryData.refundAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {[1, 2].map((i) => (
                <section
                  key={i}
                  className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6"
                >
                  <div className="h-6 w-32 animate-pulse rounded bg-neutral-200"></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div
                        key={j}
                        className="rounded-2xl border border-neutral-200 p-4"
                      >
                        <div className="h-4 w-24 animate-pulse rounded bg-neutral-200"></div>
                        <div className="mt-2 h-8 w-16 animate-pulse rounded bg-neutral-200"></div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* 시간대별 결제 건수/금액 그래프 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              시간대별 결제 건수/금액 (0~23시)
            </h2>
            <div className="mt-4 h-64">
              {hourlyPaymentData.length > 0 ? (
                <Bar
                  data={{
                    labels: hourlyPaymentData.map((d) => `${d.hour}시`),
                    datasets: [
                      {
                        label: "결제 금액",
                        data: hourlyPaymentData.map((d) => d.amount),
                        backgroundColor: "rgba(16, 185, 129, 0.8)",
                        borderColor: "rgb(16, 185, 129)",
                        borderWidth: 1,
                        yAxisID: "y",
                      },
                      {
                        label: "결제 성공 건수",
                        data: hourlyPaymentData.map((d) => d.success),
                        backgroundColor: "rgba(59, 130, 246, 0.8)",
                        borderColor: "rgb(59, 130, 246)",
                        borderWidth: 1,
                        yAxisID: "y1",
                      },
                      {
                        label: "결제 실패 건수",
                        data: hourlyPaymentData.map((d) => d.failure),
                        backgroundColor: "rgba(239, 68, 68, 0.8)",
                        borderColor: "rgb(239, 68, 68)",
                        borderWidth: 1,
                        yAxisID: "y1",
                      },
                    ],
                  }}
                  options={{
                    ...defaultChartOptions,
                    scales: {
                      ...defaultChartOptions.scales,
                      y: {
                        ...defaultChartOptions.scales?.y,
                        position: "left" as const,
                        title: {
                          display: true,
                          text: "결제 금액",
                        },
                        ticks: {
                          ...defaultChartOptions.scales?.y?.ticks,
                          callback: (value) => {
                            return currencyKRW(Number(value));
                          },
                        },
                      },
                      y1: {
                        type: "linear" as const,
                        position: "right" as const,
                        grid: {
                          drawOnChartArea: false,
                        },
                        title: {
                          display: true,
                          text: "결제 건수",
                        },
                      },
                    },
                    plugins: {
                      ...defaultChartOptions.plugins,
                      tooltip: {
                        ...defaultChartOptions.plugins?.tooltip,
                        callbacks: {
                          label: (context) => {
                            if (context.datasetIndex === 0) {
                              return `결제 금액: ${currencyKRW(context.parsed.y ?? 0)}`;
                            } else if (context.datasetIndex === 1) {
                              return `결제 성공: ${context.parsed.y}건`;
                            } else {
                              return `결제 실패: ${context.parsed.y}건`;
                            }
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-neutral-500">
                  시간대별 데이터가 없습니다.
                </div>
              )}
            </div>
            {summaryData && (
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-neutral-500">
                <span>성공: {summaryData.paymentSuccess}건</span>
                <span>실패: {summaryData.paymentFailures}건</span>
              </div>
            )}
          </section>

          {/* 프로젝트별/메이커별 상세 테이블 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 프로젝트별 상세 */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                프로젝트별 상세
              </h2>
              <div className="overflow-x-auto">
                {projectDetails.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                      <tr>
                        <th className="px-3 py-2 text-left">프로젝트</th>
                        <th className="px-3 py-2 text-right">방문자</th>
                        <th className="px-3 py-2 text-right">후원</th>
                        <th className="px-3 py-2 text-right">금액</th>
                        <th className="px-3 py-2 text-right">전환율</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {projectDetails.map((project) => (
                        <tr key={project.projectId}>
                          <td className="px-3 py-2">
                            <div>
                              <p className="font-medium text-neutral-900">
                                {project.projectName}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {project.makerName}
                              </p>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right text-neutral-600">
                            {project.visitors === 0 ? (
                              <span className="text-xs text-neutral-400">추후 제공</span>
                            ) : (
                              project.visitors.toLocaleString()
                            )}
                          </td>
                          <td className="px-3 py-2 text-right text-neutral-600">
                            {project.backers}
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-neutral-900">
                            {currencyKRW(project.amount)}
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
                ) : (
                  <p className="py-8 text-center text-sm text-neutral-500">
                    해당 기간에 주문이 있는 프로젝트가 없습니다.
                  </p>
                )}
              </div>
            </section>

            {/* 메이커별 상세 */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                메이커별 상세
              </h2>
              <div className="overflow-x-auto">
                {makerDetails.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                      <tr>
                        <th className="px-3 py-2 text-left">메이커</th>
                        <th className="px-3 py-2 text-right">프로젝트</th>
                        <th className="px-3 py-2 text-right">후원</th>
                        <th className="px-3 py-2 text-right">금액</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {makerDetails.map((maker) => (
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
                            {maker.projects}
                          </td>
                          <td className="px-3 py-2 text-right text-neutral-600">
                            {maker.backers}
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-neutral-900">
                            {currencyKRW(maker.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="py-8 text-center text-sm text-neutral-500">
                    해당 기간에 주문이 있는 메이커가 없습니다.
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

