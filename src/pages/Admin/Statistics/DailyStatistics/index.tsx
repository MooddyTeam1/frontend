// 한글 설명: Admin 일일 통계 페이지. 날짜 단위로 세부 통계를 확인
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { currencyKRW } from "../../../../shared/utils/format";
import { defaultChartOptions } from "../../../../shared/components/charts/ChartConfig";

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

  // 한글 설명: Mock 데이터 (실제로는 API에서 가져옴)
  const summaryData = {
    visitors: 12450,
    pageViews: 45620,
    newUsers: 156,
    returnRate: 68.5,
    newProjects: 8,
    reviewRequests: 3,
    approvedProjects: 5,
    closedProjects: 2,
    paymentAttempts: 342,
    paymentSuccess: 312,
    paymentSuccessRate: 91.2,
    paymentFailures: 30,
    refunds: 12,
    refundAmount: 1200000,
  };

  // 한글 설명: 시간대별 결제 데이터 (Mock)
  const hourlyPaymentData = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    attempts: Math.floor(Math.random() * 30) + 10,
    success: Math.floor(Math.random() * 25) + 8,
    amount: Math.floor(Math.random() * 5000000) + 1000000,
  }));

  // 한글 설명: 프로젝트별 상세 데이터 (Mock)
  const projectDetails = [
    {
      projectId: 1,
      projectName: "Smart LED Lamp",
      makerName: "알파메이커",
      visitors: 1240,
      backers: 45,
      amount: 4500000,
      conversionRate: 3.6,
    },
    {
      projectId: 2,
      projectName: "Compact Coffee Kit",
      makerName: "브라보팩토리",
      visitors: 980,
      backers: 32,
      amount: 3200000,
      conversionRate: 3.3,
    },
  ];

  // 한글 설명: 메이커별 상세 데이터 (Mock)
  const makerDetails = [
    {
      makerId: "MK-1029",
      makerName: "알파메이커",
      projects: 2,
      backers: 67,
      amount: 6700000,
    },
    {
      makerId: "MK-2041",
      makerName: "브라보팩토리",
      projects: 1,
      backers: 32,
      amount: 3200000,
    },
  ];

  // 한글 설명: 시간대별 그래프 최대값
  const maxHourlyAmount = Math.max(...hourlyPaymentData.map((d) => d.amount));

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
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  시작일
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  종료일
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  필터 타입
                </label>
                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(
                      e.target.value as "all" | "category" | "maker" | "project"
                    )
                  }
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                >
                  <option value="all">플랫폼 전체</option>
                  <option value="category">특정 카테고리</option>
                  <option value="maker">특정 메이커</option>
                  <option value="project">특정 프로젝트</option>
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
                        ? "카테고리 선택"
                        : filterType === "maker"
                          ? "메이커 ID"
                          : "프로젝트 ID"
                  }
                  disabled={filterType === "all"}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none disabled:bg-neutral-50"
                />
              </div>
            </div>
          </section>

          {/* 선택 날짜의 요약 카드 */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-500">방문자 수 (UV)</p>
              <p className="mt-2 text-xl font-semibold text-neutral-900">
                {summaryData.visitors.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-500">페이지뷰 (PV)</p>
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
              <p className="text-xs text-neutral-500">재방문자 비율</p>
              <p className="mt-2 text-xl font-semibold text-neutral-900">
                {summaryData.returnRate}%
              </p>
            </div>
          </section>

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
                    오늘 마감된 프로젝트 수
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
                        {summaryData.paymentSuccessRate}%
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

          {/* 시간대별 결제 건수/금액 그래프 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              시간대별 결제 건수/금액 (0~24시)
            </h2>
            <div className="mt-4 h-64">
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
                            return `결제 금액: ${currencyKRW(context.parsed.y)}`;
                          } else {
                            return `결제 성공: ${context.parsed.y}건`;
                          }
                        },
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-neutral-500">
              <span>성공: {summaryData.paymentSuccess}건</span>
              <span>실패: {summaryData.paymentFailures}건</span>
            </div>
          </section>

          {/* 프로젝트별/메이커별 상세 테이블 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 프로젝트별 상세 */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                프로젝트별 상세
              </h2>
              <div className="overflow-x-auto">
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
                          {project.visitors.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-right text-neutral-600">
                          {project.backers}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-neutral-900">
                          {currencyKRW(project.amount)}
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

            {/* 메이커별 상세 */}
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                메이커별 상세
              </h2>
              <div className="overflow-x-auto">
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
                              {maker.makerId}
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
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
