// 한글 설명: Admin 요약 대시보드 페이지. 플랫폼 상황을 한눈에 보는 대시보드
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { currencyKRW } from "../../../../shared/utils/format";
import { defaultChartOptions } from "../../../../shared/components/charts/ChartConfig";
import { fetchAdminDashboardSummary } from "../../../../features/admin/api/adminStatisticsService";
import type { DashboardSummaryDto } from "../../../../features/admin/types";
import { PROJECT_CATEGORY_LABELS } from "../../../../features/projects/types";

// 한글 설명: KPI 카드 컴포넌트
interface KPICardProps {
  label: string;
  value: string | number;
  change?: string; // 한글 설명: 전일/전월 대비 변화율
  trend?: "up" | "down" | "neutral";
}

const KPICard: React.FC<KPICardProps> = ({ label, value, change, trend }) => {
  const trendColor =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
        ? "text-red-600"
        : "text-neutral-500";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-900">{value}</p>
      {change && (
        <p className={`mt-1 text-xs ${trendColor}`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {change}
        </p>
      )}
    </div>
  );
};

// 한글 설명: Top 프로젝트 카드 컴포넌트
interface TopProjectCardProps {
  rank: number;
  thumbnail: string | null;
  title: string;
  makerName: string;
  achievementRate: number;
  raised: number;
  daysLeft: number | null;
  projectId: number;
}

const TopProjectCard: React.FC<TopProjectCardProps> = ({
  rank,
  thumbnail,
  title,
  makerName,
  achievementRate,
  raised,
  daysLeft,
  projectId,
}) => {
  return (
    <Link
      to={`/projects/${projectId}`}
      className="group flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-900"
    >
      <div className="relative flex-shrink-0">
        <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
          {rank}
        </span>
        <div className="h-20 w-20 overflow-hidden rounded-xl bg-neutral-100">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
              이미지 없음
            </div>
          )}
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div>
          <h3 className="truncate text-sm font-semibold text-neutral-900">
            {title}
          </h3>
          <p className="text-xs text-neutral-500">{makerName}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">달성률</span>
            <span className="font-semibold text-neutral-900">
              {achievementRate}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full bg-neutral-900 transition-all"
              style={{ width: `${Math.min(achievementRate, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <span>{currencyKRW(raised)}</span>
            <span>
              {daysLeft !== null
                ? daysLeft === 0
                  ? "오늘 마감"
                  : `D-${daysLeft}`
                : "마감"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// 한글 설명: 경고/알림 카드 컴포넌트
interface AlertCardProps {
  type: "warning" | "error" | "info";
  title: string;
  message: string;
}

const AlertCard: React.FC<AlertCardProps> = ({ type, title, message }) => {
  const colors = {
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${colors[type]}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs opacity-90">{message}</p>
    </div>
  );
};

export const SummaryDashboardPage: React.FC = () => {
  // 한글 설명: 그래프 옵션 상태 (펀딩 금액 / 프로젝트 수 / 후원 건수)
  const [chartOption, setChartOption] = useState<
    "funding" | "projects" | "backers"
  >("funding");

  // 한글 설명: API 데이터 상태
  const [dashboardData, setDashboardData] = useState<DashboardSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 대시보드 데이터 조회
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminDashboardSummary();
        setDashboardData(data);
      } catch (err) {
        console.error("대시보드 데이터 조회 실패:", err);
        setError("대시보드 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // 한글 설명: KPI 데이터 변환 (API 응답 → UI 표시용)
  const kpiData = dashboardData
    ? {
        totalFunding: {
          value: dashboardData.kpiSummary.totalFundingAmount.value,
          change: dashboardData.kpiSummary.totalFundingAmount.changeRate !== 0
            ? `${dashboardData.kpiSummary.totalFundingAmount.changeRate >= 0 ? "+" : ""}${dashboardData.kpiSummary.totalFundingAmount.changeRate.toFixed(1)}%`
            : undefined,
          trend: dashboardData.kpiSummary.totalFundingAmount.changeRate > 0
            ? "up" as const
            : dashboardData.kpiSummary.totalFundingAmount.changeRate < 0
              ? "down" as const
              : "neutral" as const,
        },
        totalPayments: {
          value: dashboardData.kpiSummary.totalOrderCount.value,
          change: dashboardData.kpiSummary.totalOrderCount.changeRate !== 0
            ? `${dashboardData.kpiSummary.totalOrderCount.changeRate >= 0 ? "+" : ""}${dashboardData.kpiSummary.totalOrderCount.changeRate.toFixed(1)}%`
            : undefined,
          trend: dashboardData.kpiSummary.totalOrderCount.changeRate > 0
            ? "up" as const
            : dashboardData.kpiSummary.totalOrderCount.changeRate < 0
              ? "down" as const
              : "neutral" as const,
        },
        platformFee: {
          value: dashboardData.kpiSummary.platformFeeRevenue.value,
          change: dashboardData.kpiSummary.platformFeeRevenue.changeRate !== 0
            ? `${dashboardData.kpiSummary.platformFeeRevenue.changeRate >= 0 ? "+" : ""}${dashboardData.kpiSummary.platformFeeRevenue.changeRate.toFixed(1)}%`
            : undefined,
          trend: dashboardData.kpiSummary.platformFeeRevenue.changeRate > 0
            ? "up" as const
            : dashboardData.kpiSummary.platformFeeRevenue.changeRate < 0
              ? "down" as const
              : "neutral" as const,
        },
        newProjects: {
          value: dashboardData.kpiSummary.newProjectCount.value,
          change: dashboardData.kpiSummary.newProjectCount.changeAmount !== 0
            ? `${dashboardData.kpiSummary.newProjectCount.changeAmount >= 0 ? "+" : ""}${dashboardData.kpiSummary.newProjectCount.changeAmount}`
            : undefined,
          trend: dashboardData.kpiSummary.newProjectCount.changeAmount > 0
            ? "up" as const
            : dashboardData.kpiSummary.newProjectCount.changeAmount < 0
              ? "down" as const
              : "neutral" as const,
        },
        newUsers: {
          value: dashboardData.kpiSummary.newUserCount.value,
          change: dashboardData.kpiSummary.newUserCount.changeAmount !== 0
            ? `${dashboardData.kpiSummary.newUserCount.changeAmount >= 0 ? "+" : ""}${dashboardData.kpiSummary.newUserCount.changeAmount}`
            : undefined,
          trend: dashboardData.kpiSummary.newUserCount.changeAmount > 0
            ? "up" as const
            : dashboardData.kpiSummary.newUserCount.changeAmount < 0
              ? "down" as const
              : "neutral" as const,
        },
        activeSupporters: {
          value: dashboardData.kpiSummary.activeSupporterCount.value,
          change: dashboardData.kpiSummary.activeSupporterCount.changeRate !== 0
            ? `${dashboardData.kpiSummary.activeSupporterCount.changeRate >= 0 ? "+" : ""}${dashboardData.kpiSummary.activeSupporterCount.changeRate.toFixed(1)}%`
            : undefined,
          trend: dashboardData.kpiSummary.activeSupporterCount.changeRate > 0
            ? "up" as const
            : dashboardData.kpiSummary.activeSupporterCount.changeRate < 0
              ? "down" as const
              : "neutral" as const,
        },
      }
    : null;

  // 한글 설명: 트렌드 데이터 변환
  const trendData = dashboardData
    ? dashboardData.trendChart.data.map((item) => ({
        date: item.date,
        funding: item.fundingAmount,
        projects: item.projectCount,
        backers: item.orderCount,
      }))
    : [];

  // 한글 설명: 카테고리별 성과 데이터 변환
  const categoryPerformance = dashboardData
    ? dashboardData.categoryPerformance.categories.map((cat) => ({
        category: PROJECT_CATEGORY_LABELS[cat.categoryName as keyof typeof PROJECT_CATEGORY_LABELS] || cat.categoryName,
        funding: cat.fundingAmount,
        projects: cat.projectCount,
        backers: cat.orderCount,
        fundingRatio: cat.fundingRatio,
      }))
    : [];

  // 한글 설명: Top 프로젝트 데이터 변환
  const topProjects = dashboardData
    ? dashboardData.topProjects.map((project, idx) => ({
        rank: idx + 1,
        projectId: project.projectId,
        thumbnail: project.coverImageUrl || null, // 한글 설명: 백엔드에서 coverImageUrl 제공 시 사용
        title: project.projectName,
        makerName: project.makerName,
        achievementRate: project.achievementRate,
        raised: project.fundingAmount,
        daysLeft: project.remainingDays,
      }))
    : [];

  // 한글 설명: 알림 데이터 변환 (타입 매핑)
  const alerts = dashboardData
    ? dashboardData.alerts.map((alert) => ({
        type: alert.type.toLowerCase() as "warning" | "error" | "info",
        title: alert.title,
        message: alert.message,
      }))
    : [];

  // 한글 설명: 그래프 최대값 계산 (y축 스케일링용) (현재 미사용)
  // const maxValue = trendData.length > 0
  //   ? Math.max(
  //       ...trendData.map((d) =>
  //         chartOption === "funding"
  //           ? d.funding
  //           : chartOption === "projects"
  //             ? d.projects
  //             : d.backers
  //       )
  //     )
  //   : 0;

  // 한글 설명: 로딩 상태
  if (loading) {
    return (
      <div className="w-full">
        <div className="mx-auto min-h-[80vh] max-w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-neutral-500">대시보드 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 한글 설명: 에러 상태
  if (error || !dashboardData) {
    return (
      <div className="w-full">
        <div className="mx-auto min-h-[80vh] max-w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-sm font-medium text-red-600">{error || "데이터를 불러올 수 없습니다."}</p>
              <p className="mt-2 text-xs text-neutral-500">
                API 연결을 확인해주세요. (GET /api/admin/statistics/dashboard)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto min-h-[80vh] max-w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                요약 대시보드
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                플랫폼 상황을 한눈에 확인하세요
              </p>
            </div>
            <Link
              to="/admin"
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              대시보드로
            </Link>
          </div>

          {/* 오늘 / 이번 달 핵심 KPI */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              오늘 / 이번 달 핵심 KPI
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kpiData && (
                <>
                  <KPICard
                    label="총 펀딩 금액"
                    value={currencyKRW(kpiData.totalFunding.value)}
                    change={kpiData.totalFunding.change}
                    trend={kpiData.totalFunding.trend}
                  />
                  <KPICard
                    label="총 결제 건수"
                    value={kpiData.totalPayments.value.toLocaleString()}
                    change={kpiData.totalPayments.change}
                    trend={kpiData.totalPayments.trend}
                  />
                  <KPICard
                    label="플랫폼 수수료 수익"
                    value={currencyKRW(kpiData.platformFee.value)}
                    change={kpiData.platformFee.change}
                    trend={kpiData.platformFee.trend}
                  />
                  <KPICard
                    label="신규 프로젝트 수"
                    value={kpiData.newProjects.value}
                    change={kpiData.newProjects.change}
                    trend={kpiData.newProjects.trend}
                  />
                  <KPICard
                    label="신규 가입자 수"
                    value={kpiData.newUsers.value}
                    change={kpiData.newUsers.change}
                    trend={kpiData.newUsers.trend}
                  />
                  <KPICard
                    label="활성 서포터 수"
                    value={kpiData.activeSupporters.value.toLocaleString()}
                    change={kpiData.activeSupporters.change}
                    trend={kpiData.activeSupporters.trend}
                  />
                </>
              )}
            </div>
          </section>

          {/* 기간별 매출 추이 그래프 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                기간별 매출(펀딩 금액) 추이
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartOption("funding")}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    chartOption === "funding"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  }`}
                >
                  펀딩 금액
                </button>
                <button
                  onClick={() => setChartOption("projects")}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    chartOption === "projects"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  }`}
                >
                  프로젝트 수
                </button>
                <button
                  onClick={() => setChartOption("backers")}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    chartOption === "backers"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  }`}
                >
                  후원 건수
                </button>
              </div>
            </div>
            <div className="mt-6 h-64">
              {trendData.length > 0 ? (
                <Bar
                  data={{
                    labels: trendData.map((d) => d.date),
                    datasets: [
                      {
                        label:
                          chartOption === "funding"
                            ? "펀딩 금액"
                            : chartOption === "projects"
                              ? "프로젝트 수"
                              : "후원 건수",
                        data: trendData.map((d) =>
                          chartOption === "funding"
                            ? d.funding
                            : chartOption === "projects"
                              ? d.projects
                              : d.backers
                        ),
                        backgroundColor:
                          chartOption === "funding"
                            ? "rgba(16, 185, 129, 0.8)"
                            : chartOption === "projects"
                              ? "rgba(59, 130, 246, 0.8)"
                              : "rgba(168, 85, 247, 0.8)",
                        borderColor:
                          chartOption === "funding"
                            ? "rgb(16, 185, 129)"
                            : chartOption === "projects"
                              ? "rgb(59, 130, 246)"
                              : "rgb(168, 85, 247)",
                        borderWidth: 1,
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
                            const value = context.parsed.y;
                            if (chartOption === "funding") {
                              return `펀딩 금액: ${currencyKRW(value ?? 0)}`;
                            } else if (chartOption === "projects") {
                              return `프로젝트 수: ${value ?? 0}개`;
                            } else {
                              return `후원 건수: ${(value ?? 0).toLocaleString()}건`;
                            }
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-neutral-500">
                  트렌드 데이터가 없습니다.
                </div>
              )}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* 카테고리별 성과 Top N */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                카테고리별 성과 Top 4
              </h2>
              <div className="space-y-3">
                {categoryPerformance.length > 0 ? (
                  categoryPerformance.map((cat, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-neutral-900">
                          {cat.category}
                        </span>
                        <span className="text-neutral-600">
                          {currencyKRW(cat.funding)}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-neutral-500">
                        <span>프로젝트: {cat.projects}개</span>
                        <span>후원: {cat.backers.toLocaleString()}건</span>
                        {cat.fundingRatio !== undefined && (
                          <span>비율: {cat.fundingRatio.toFixed(1)}%</span>
                        )}
                      </div>
                      {/* 한글 설명: 간단한 진행 바 */}
                      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full bg-neutral-900"
                          style={{
                            width: `${
                              categoryPerformance[0]?.funding
                                ? (cat.funding / categoryPerformance[0].funding) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">카테고리 데이터가 없습니다.</p>
                )}
              </div>
            </section>

            {/* 카테고리별 펀딩 비율 파이 차트 */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                카테고리별 펀딩 비율
              </h2>
              <div className="h-64">
                {categoryPerformance.length > 0 ? (
                  <Pie
                    data={{
                      labels: categoryPerformance.map((c) => c.category),
                      datasets: [
                        {
                          data: categoryPerformance.map((c) => c.funding),
                          backgroundColor: [
                            "rgba(23, 23, 23, 0.8)",
                            "rgba(82, 82, 82, 0.8)",
                            "rgba(115, 115, 115, 0.8)",
                            "rgba(163, 163, 163, 0.8)",
                          ],
                          borderColor: [
                            "rgb(23, 23, 23)",
                            "rgb(82, 82, 82)",
                            "rgb(115, 115, 115)",
                            "rgb(163, 163, 163)",
                          ],
                          borderWidth: 2,
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
                              const label = context.label || "";
                              const value = context.parsed || 0;
                              const total = context.dataset.data.reduce(
                                (a: number, b: number) => a + b,
                                0
                              );
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `${label}: ${currencyKRW(value)} (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-neutral-500">
                    카테고리 데이터가 없습니다.
                  </div>
                )}
              </div>
              {categoryPerformance.length > 0 && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {categoryPerformance.map((cat, idx) => {
                    const total = categoryPerformance.reduce(
                      (sum, c) => sum + c.funding,
                      0
                    );
                    const percentage = total > 0 ? ((cat.funding / total) * 100).toFixed(1) : "0.0";
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor:
                              idx === 0
                                ? "#171717"
                                : idx === 1
                                  ? "#525252"
                                  : idx === 2
                                    ? "#737373"
                                    : "#a3a3a3",
                          }}
                        />
                        <span className="text-neutral-600">{cat.category}</span>
                        <span className="font-medium text-neutral-900">
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top 프로젝트 카드 */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                Top 프로젝트 (펀딩액 기준)
              </h2>
              <div className="space-y-3">
                {topProjects.length > 0 ? (
                  topProjects.map((project) => (
                    <TopProjectCard key={project.rank} {...project} />
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">프로젝트 데이터가 없습니다.</p>
                )}
              </div>
            </section>

            {/* 경고/알림 영역 */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                경고 / 알림
              </h2>
              <div className="space-y-3">
                {alerts.length > 0 ? (
                  alerts.map((alert, idx) => <AlertCard key={idx} {...alert} />)
                ) : (
                  <p className="text-sm text-neutral-500">
                    현재 경고 사항이 없습니다.
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
