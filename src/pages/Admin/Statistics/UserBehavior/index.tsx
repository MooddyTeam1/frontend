// 한글 설명: Admin 유저 행동/퍼널 리포트 페이지. 유저 행동 분석 및 전환율 확인
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { defaultChartOptions } from "../../../../shared/components/charts/ChartConfig";

export const UserBehaviorPage: React.FC = () => {
  // 한글 설명: 필터 상태
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [channel, setChannel] = useState("all");

  // 한글 설명: 펀딩 퍼널 데이터 (Mock)
  const funnelData = {
    homeListViews: 50000, // 한글 설명: 홈/리스트 노출
    projectDetailViews: 12000, // 한글 설명: 프로젝트 상세 페이지 진입
    rewardSelected: 3500, // 한글 설명: 리워드 선택
    paymentPageViews: 2800, // 한글 설명: 결제 페이지 진입
    paymentCompleted: 2400, // 한글 설명: 결제 완료
  };

  // 한글 설명: 퍼널 단계별 전환율 계산
  const conversionRates = {
    listToDetail: (funnelData.projectDetailViews / funnelData.homeListViews) * 100,
    detailToReward: (funnelData.rewardSelected / funnelData.projectDetailViews) * 100,
    rewardToPayment: (funnelData.paymentPageViews / funnelData.rewardSelected) * 100,
    paymentToComplete: (funnelData.paymentCompleted / funnelData.paymentPageViews) * 100,
    overall: (funnelData.paymentCompleted / funnelData.homeListViews) * 100,
  };

  // 한글 설명: 추가 행동 분석 데이터 (Mock)
  const behaviorData = {
    bookmarkToBacking: {
      bookmarks: 5000,
      backings: 800,
      rate: 16.0,
    },
    notificationToBacking: {
      notifications: 2000,
      backings: 400,
      rate: 20.0,
    },
  };

  // 한글 설명: 유입 채널별 전환율 데이터 (Mock)
  const channelData = [
    {
      channel: "직접 유입",
      visitors: 25000,
      backings: 1200,
      conversionRate: 4.8,
      revenue: 120000000,
    },
    {
      channel: "검색",
      visitors: 15000,
      backings: 600,
      conversionRate: 4.0,
      revenue: 60000000,
    },
    {
      channel: "광고 캠페인",
      visitors: 8000,
      backings: 400,
      conversionRate: 5.0,
      revenue: 40000000,
    },
    {
      channel: "SNS/인플루언서",
      visitors: 2000,
      backings: 200,
      conversionRate: 10.0,
      revenue: 20000000,
    },
  ];

  // 한글 설명: 퍼널 최대값 (그래프 스케일링용)
  const maxFunnelValue = funnelData.homeListViews;

  return (
    <div className="w-full">
      <div className="mx-auto min-h-[80vh] max-w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                유저 행동 / 퍼널 리포트
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                유저 행동 분석 및 전환율을 확인하세요
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
            <div className="grid gap-4 md:grid-cols-3">
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
                  유입 채널
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                >
                  <option value="all">전체</option>
                  <option value="direct">직접 유입</option>
                  <option value="search">검색</option>
                  <option value="ad">광고 캠페인</option>
                  <option value="sns">SNS/인플루언서</option>
                </select>
              </div>
            </div>
          </section>

          {/* 펀딩 퍼널 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">펀딩 퍼널</h2>
            <div className="h-64">
              <Bar
                data={{
                  labels: [
                    "홈/리스트 노출",
                    "프로젝트 상세 진입",
                    "리워드 선택",
                    "결제 페이지 진입",
                    "결제 완료",
                  ],
                  datasets: [
                    {
                      label: "사용자 수",
                      data: [
                        funnelData.homeListViews,
                        funnelData.projectDetailViews,
                        funnelData.rewardSelected,
                        funnelData.paymentPageViews,
                        funnelData.paymentCompleted,
                      ],
                      backgroundColor: [
                        "rgba(23, 23, 23, 0.8)",
                        "rgba(82, 82, 82, 0.8)",
                        "rgba(115, 115, 115, 0.8)",
                        "rgba(163, 163, 163, 0.8)",
                        "rgba(16, 185, 129, 0.8)",
                      ],
                      borderColor: [
                        "rgb(23, 23, 23)",
                        "rgb(82, 82, 82)",
                        "rgb(115, 115, 115)",
                        "rgb(163, 163, 163)",
                        "rgb(16, 185, 129)",
                      ],
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  ...defaultChartOptions,
                  indexAxis: "y" as const,
                  plugins: {
                    ...defaultChartOptions.plugins,
                    tooltip: {
                      ...defaultChartOptions.plugins?.tooltip,
                      callbacks: {
                        label: (context) => {
                          const value = context.parsed.x;
                          const labels = [
                            "홈/리스트 노출",
                            "프로젝트 상세 페이지 진입",
                            "리워드 선택",
                            "결제 페이지 진입",
                            "결제 완료",
                          ];
                          const conversions = [
                            null,
                            conversionRates.listToDetail,
                            conversionRates.detailToReward,
                            conversionRates.rewardToPayment,
                            conversionRates.paymentToComplete,
                          ];
                          const conversion = conversions[context.dataIndex];
                          if (conversion !== null) {
                            return `${labels[context.dataIndex]}: ${value.toLocaleString()}명 (전환율: ${conversion.toFixed(1)}%)`;
                          }
                          return `${labels[context.dataIndex]}: ${value.toLocaleString()}명`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">
                  전체 전환율
                </span>
                <span className="text-2xl font-bold text-neutral-900">
                  {conversionRates.overall.toFixed(2)}%
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                홈/리스트 노출 대비 결제 완료 비율
              </p>
            </div>
          </section>

          {/* 추가 행동 분석 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              추가 행동 분석
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="text-xs text-neutral-500">
                  북마크(찜) → 실제 후원 전환율
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">북마크</span>
                    <span className="text-lg font-semibold text-neutral-900">
                      {behaviorData.bookmarkToBacking.bookmarks.toLocaleString()}개
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">후원</span>
                    <span className="text-lg font-semibold text-neutral-900">
                      {behaviorData.bookmarkToBacking.backings}건
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-2">
                    <span className="text-xs text-neutral-500">전환율</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {behaviorData.bookmarkToBacking.rate}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="text-xs text-neutral-500">
                  알림 신청 → 후원 전환율
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">알림 신청</span>
                    <span className="text-lg font-semibold text-neutral-900">
                      {behaviorData.notificationToBacking.notifications.toLocaleString()}건
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">후원</span>
                    <span className="text-lg font-semibold text-neutral-900">
                      {behaviorData.notificationToBacking.backings}건
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-2">
                    <span className="text-xs text-neutral-500">전환율</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {behaviorData.notificationToBacking.rate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 유입 채널별 전환율 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              유입 채널별 전환율
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                  <tr>
                    <th className="px-3 py-2 text-left">채널</th>
                    <th className="px-3 py-2 text-right">방문자</th>
                    <th className="px-3 py-2 text-right">후원</th>
                    <th className="px-3 py-2 text-right">전환율</th>
                    <th className="px-3 py-2 text-right">매출</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {channelData.map((channel, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 font-medium text-neutral-900">
                        {channel.channel}
                      </td>
                      <td className="px-3 py-2 text-right text-neutral-600">
                        {channel.visitors.toLocaleString()}명
                      </td>
                      <td className="px-3 py-2 text-right text-neutral-600">
                        {channel.backings}건
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span
                          className={`font-semibold ${
                            channel.conversionRate >= 5
                              ? "text-emerald-600"
                              : channel.conversionRate >= 4
                                ? "text-amber-600"
                                : "text-red-600"
                          }`}
                        >
                          {channel.conversionRate}%
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-neutral-900">
                        {channel.revenue.toLocaleString()}원
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
  );
};

