// 한글 설명: Admin 요약 대시보드 페이지. 플랫폼 상황을 한눈에 보는 대시보드
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { currencyKRW } from "../../../../shared/utils/format";
import { defaultChartOptions } from "../../../../shared/components/charts/ChartConfig";

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

  // 한글 설명: Mock 데이터 (실제로는 API에서 가져옴)
  const kpiData = {
    totalFunding: { value: 1250000000, change: "+12.5%", trend: "up" as const },
    totalPayments: { value: 3420, change: "+8.3%", trend: "up" as const },
    platformFee: { value: 62500000, change: "+12.5%", trend: "up" as const },
    newProjects: { value: 24, change: "+2", trend: "up" as const },
    newUsers: { value: 156, change: "+18", trend: "up" as const },
    activeSupporters: { value: 1240, change: "+5.2%", trend: "up" as const },
  };

  // 한글 설명: 기간별 매출 추이 데이터 (Mock)
  const trendData = [
    { date: "11/01", funding: 45000000, projects: 12, backers: 320 },
    { date: "11/02", funding: 52000000, projects: 15, backers: 380 },
    { date: "11/03", funding: 48000000, projects: 14, backers: 350 },
    { date: "11/04", funding: 61000000, projects: 18, backers: 420 },
    { date: "11/05", funding: 55000000, projects: 16, backers: 390 },
    { date: "11/06", funding: 67000000, projects: 19, backers: 450 },
    { date: "11/07", funding: 72000000, projects: 21, backers: 480 },
  ];

  // 한글 설명: 카테고리별 성과 데이터 (Mock)
  const categoryPerformance = [
    { category: "테크·가전", funding: 450000000, projects: 45, backers: 3200 },
    { category: "디자인", funding: 320000000, projects: 38, backers: 2400 },
    { category: "푸드", funding: 280000000, projects: 32, backers: 2100 },
    { category: "패션", funding: 200000000, projects: 28, backers: 1800 },
  ];

  // 한글 설명: Top 프로젝트 데이터 (Mock)
  const topProjects = [
    {
      rank: 1,
      projectId: 1,
      thumbnail: null,
      title: "Smart LED Lamp 프로젝트",
      makerName: "알파메이커",
      achievementRate: 245,
      raised: 24500000,
      daysLeft: 12,
    },
    {
      rank: 2,
      projectId: 2,
      thumbnail: null,
      title: "Compact Coffee Kit",
      makerName: "브라보팩토리",
      achievementRate: 198,
      raised: 19800000,
      daysLeft: 8,
    },
    {
      rank: 3,
      projectId: 3,
      thumbnail: null,
      title: "Pet AI Tracker",
      makerName: "크래프트랩",
      achievementRate: 156,
      raised: 15600000,
      daysLeft: 15,
    },
    {
      rank: 4,
      projectId: 4,
      thumbnail: null,
      title: "Eco-Friendly Water Bottle",
      makerName: "그린라이프",
      achievementRate: 142,
      raised: 14200000,
      daysLeft: 20,
    },
    {
      rank: 5,
      projectId: 5,
      thumbnail: null,
      title: "Wireless Earbuds Pro",
      makerName: "테크노바",
      achievementRate: 128,
      raised: 12800000,
      daysLeft: 5,
    },
  ];

  // 한글 설명: 경고/알림 데이터 (Mock)
  const alerts = [
    {
      type: "warning" as const,
      title: "어제 대비 오늘 결제 성공률 급감",
      message:
        "결제 성공률이 85%에서 72%로 하락했습니다. PG 오류 가능성을 확인해주세요.",
    },
    {
      type: "info" as const,
      title: "환불 비율이 평소보다 높음",
      message: "최근 7일간 환불 비율이 평균 대비 3.2%p 증가했습니다.",
    },
  ];

  // 한글 설명: 그래프 최대값 계산 (y축 스케일링용)
  const maxValue = Math.max(
    ...trendData.map((d) =>
      chartOption === "funding"
        ? d.funding
        : chartOption === "projects"
          ? d.projects
          : d.backers
    )
  );

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
                            return `펀딩 금액: ${currencyKRW(value)}`;
                          } else if (chartOption === "projects") {
                            return `프로젝트 수: ${value}개`;
                          } else {
                            return `후원 건수: ${value.toLocaleString()}건`;
                          }
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* 카테고리별 성과 Top N */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                카테고리별 성과 Top 4
              </h2>
              <div className="space-y-3">
                {categoryPerformance.map((cat, idx) => (
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
                    </div>
                    {/* 한글 설명: 간단한 진행 바 */}
                    <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full bg-neutral-900"
                        style={{
                          width: `${
                            (cat.funding / categoryPerformance[0].funding) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 카테고리별 펀딩 비율 파이 차트 */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                카테고리별 펀딩 비율
              </h2>
              <div className="h-64">
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
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {categoryPerformance.map((cat, idx) => {
                  const total = categoryPerformance.reduce(
                    (sum, c) => sum + c.funding,
                    0
                  );
                  const percentage = ((cat.funding / total) * 100).toFixed(1);
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
            </section>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top 프로젝트 카드 */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                Top 프로젝트 (펀딩액 기준)
              </h2>
              <div className="space-y-3">
                {topProjects.map((project) => (
                  <TopProjectCard key={project.rank} {...project} />
                ))}
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
