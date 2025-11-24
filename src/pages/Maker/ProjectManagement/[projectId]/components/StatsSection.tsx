// 한글 설명: 프로젝트 통계 및 분석 섹션
import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import type { MakerProjectDetailDTO } from "../../../../../features/maker/projectManagement/types";
import { currencyKRW } from "../../../../../shared/utils/format";
import { defaultChartOptions } from "../../../../../shared/components/charts/ChartConfig";

type StatsSectionProps = {
  project: MakerProjectDetailDTO;
};

export const StatsSection: React.FC<StatsSectionProps> = ({ project }) => {
  const { stats, dailyStats, channelStats, rewardSalesStats } = project;

  return (
    <div className="space-y-6">
      {/* 한글 설명: 요약 카드 */}
      <div className="grid gap-4 rounded-3xl border border-neutral-200 bg-white p-6 md:grid-cols-4">
        <div className="space-y-1">
          <p className="text-xs text-neutral-500">오늘 방문수</p>
          <p className="text-2xl font-semibold text-neutral-900">
            {stats.todayViews.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-400">
            전체 {stats.totalViews.toLocaleString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-neutral-500">전체 모금액</p>
          <p className="text-2xl font-semibold text-green-600">
            {currencyKRW(stats.totalRaised)}
          </p>
          <p className="text-xs text-neutral-400">
            목표 대비 {stats.progressPercent.toFixed(1)}%
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-neutral-500">서포터 수</p>
          <p className="text-2xl font-semibold text-neutral-900">
            {stats.supporterCount.toLocaleString()}명
          </p>
          <p className="text-xs text-neutral-400">
            재후원 {stats.repeatSupporterRate.toFixed(1)}%
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-neutral-500">평균 후원 금액</p>
          <p className="text-2xl font-semibold text-neutral-900">
            {currencyKRW(stats.averageSupportAmount)}
          </p>
          {stats.topReward && (
            <p className="text-xs text-neutral-400">
              인기: {stats.topReward.title}
            </p>
          )}
        </div>
      </div>

      {/* 한글 설명: 일별 통계 그래프 */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          일별 통계
        </h2>
        <div className="h-64">
          <Line
            data={{
              labels: dailyStats.map((stat) => {
                const date = new Date(stat.date);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }),
              datasets: [
                {
                  label: "방문수",
                  data: dailyStats.map((stat) => stat.views),
                  borderColor: "rgb(59, 130, 246)",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  tension: 0.4,
                  fill: true,
                },
                {
                  label: "후원수",
                  data: dailyStats.map((stat) => stat.supporters),
                  borderColor: "rgb(16, 185, 129)",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  tension: 0.4,
                  fill: true,
                },
                {
                  label: "모금액 (만원)",
                  data: dailyStats.map((stat) => Math.round(stat.amount / 10000)),
                  borderColor: "rgb(168, 85, 247)",
                  backgroundColor: "rgba(168, 85, 247, 0.1)",
                  tension: 0.4,
                  fill: true,
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
                    text: "방문수 / 후원수",
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
                    text: "모금액 (만원)",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* 한글 설명: 채널별 유입 통계 */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          채널별 유입
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64">
            <Doughnut
              data={{
                labels: channelStats.map((c) => c.channel),
                datasets: [
                  {
                    data: channelStats.map((c) => c.count),
                    backgroundColor: [
                      "rgba(59, 130, 246, 0.8)",
                      "rgba(16, 185, 129, 0.8)",
                      "rgba(251, 146, 60, 0.8)",
                      "rgba(168, 85, 247, 0.8)",
                      "rgba(236, 72, 153, 0.8)",
                    ],
                    borderColor: [
                      "rgb(59, 130, 246)",
                      "rgb(16, 185, 129)",
                      "rgb(251, 146, 60)",
                      "rgb(168, 85, 247)",
                      "rgb(236, 72, 153)",
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
                        return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="space-y-3">
            {channelStats.map((channel) => (
              <div key={channel.channel} className="flex items-center gap-4">
                <div className="w-24 text-xs text-neutral-500">
                  {channel.channel}
                </div>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${channel.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right text-xs text-neutral-700">
                  {channel.count.toLocaleString()} ({channel.percentage.toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 한글 설명: 리워드별 판매 비중 */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          리워드별 판매 비중
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64">
            <Doughnut
              data={{
                labels: rewardSalesStats.map((r) => r.rewardTitle),
                datasets: [
                  {
                    data: rewardSalesStats.map((r) => r.salesCount),
                    backgroundColor: [
                      "rgba(168, 85, 247, 0.8)",
                      "rgba(59, 130, 246, 0.8)",
                      "rgba(16, 185, 129, 0.8)",
                      "rgba(251, 146, 60, 0.8)",
                    ],
                    borderColor: [
                      "rgb(168, 85, 247)",
                      "rgb(59, 130, 246)",
                      "rgb(16, 185, 129)",
                      "rgb(251, 146, 60)",
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
                        const reward = rewardSalesStats[context.dataIndex];
                        return `${label}: ${value}개 (${currencyKRW(reward.totalAmount)})`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="space-y-3">
            {rewardSalesStats.map((reward) => (
              <div key={reward.rewardId} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-900">
                      {reward.rewardTitle}
                    </span>
                    <span className="text-neutral-500">
                      {reward.salesCount}개 · {currencyKRW(reward.totalAmount)}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${reward.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right text-xs font-semibold text-neutral-700">
                  {reward.percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

