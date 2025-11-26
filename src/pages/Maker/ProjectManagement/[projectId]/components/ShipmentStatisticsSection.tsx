// 한글 설명: 배송 통계 및 리포트 섹션 컴포넌트
import React, { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { fetchShipmentStatistics } from "../../../../../features/maker/projectManagement/api/shipmentService";
import type { ShipmentStatisticsDTO } from "../../../../../features/maker/projectManagement/types/shipment";
import { defaultChartOptions } from "../../../../../shared/components/charts/ChartConfig";

type ShipmentStatisticsSectionProps = {
  projectId: number;
};

export const ShipmentStatisticsSection: React.FC<
  ShipmentStatisticsSectionProps
> = ({ projectId }) => {
  const [statistics, setStatistics] = useState<ShipmentStatisticsDTO | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // 한글 설명: 통계 데이터 조회
  useEffect(() => {
    const loadStatistics = async () => {
      setLoading(true);
      try {
        const data = await fetchShipmentStatistics(projectId);
        setStatistics(data);
      } catch (error) {
        console.error("배송 통계 조회 실패", error);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [projectId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <p className="text-center text-sm text-neutral-500">통계 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <p className="text-center text-sm text-neutral-500">통계 데이터가 없습니다.</p>
      </div>
    );
  }

  // 한글 설명: 통계 데이터 유효성 검사
  if (
    !statistics.statusChart ||
    !statistics.deliveryPeriodAnalysis ||
    !statistics.courierStatistics
  ) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <p className="text-center text-sm text-neutral-500">
          통계 데이터 형식이 올바르지 않습니다.
        </p>
      </div>
    );
  }

  // 한글 설명: 배송 현황 차트 데이터
  const statusChartData = {
    labels: statistics.statusChart.labels || [],
    datasets: [
      {
        label: "배송 준비 중",
        data: statistics.statusChart.ready || [],
        borderColor: "rgb(234, 179, 8)",
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "배송 중",
        data: statistics.statusChart.shipped || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "배송 완료",
        data: statistics.statusChart.delivered || [],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "문제/보류",
        data: statistics.statusChart.issue || [],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // 한글 설명: 배송 기간 분포 차트 데이터
  const periodDistributionData = {
    labels: (statistics.deliveryPeriodAnalysis.periodDistribution || []).map(
      (p) => p.period
    ),
    datasets: [
      {
        label: "건수",
        data: (statistics.deliveryPeriodAnalysis.periodDistribution || []).map(
          (p) => p.count
        ),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
      },
    ],
  };

  // 한글 설명: 택배사별 통계 차트 데이터
  const courierChartData = {
    labels: (statistics.courierStatistics || []).map((c) => c.courierName),
    datasets: [
      {
        label: "건수",
        data: (statistics.courierStatistics || []).map((c) => c.count),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* 한글 설명: 배송 기간 분석 요약 */}
      <div className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-6 md:grid-cols-3">
        <div className="space-y-1">
          <p className="text-xs text-neutral-500">평균 배송 기간</p>
          <p className="text-2xl font-semibold text-neutral-900">
            {statistics.deliveryPeriodAnalysis.averageDays.toFixed(1)}일
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-neutral-500">최단 배송 기간</p>
          <p className="text-2xl font-semibold text-green-600">
            {statistics.deliveryPeriodAnalysis.minDays}일
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-neutral-500">최장 배송 기간</p>
          <p className="text-2xl font-semibold text-red-600">
            {statistics.deliveryPeriodAnalysis.maxDays}일
          </p>
        </div>
      </div>

      {/* 한글 설명: 배송 현황 차트 */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">
          배송 현황 추이
        </h3>
        <div className="h-64">
          <Line data={statusChartData} options={defaultChartOptions} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 한글 설명: 배송 기간 분포 */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">
            배송 기간 분포
          </h3>
          <div className="h-64">
            <Bar
              data={periodDistributionData}
              options={{
                ...defaultChartOptions,
                scales: {
                  ...defaultChartOptions.scales,
                  y: {
                    ...defaultChartOptions.scales?.y,
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 space-y-2">
            {statistics.deliveryPeriodAnalysis.periodDistribution.map(
              (period, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-neutral-600">{period.period}</span>
                  <span className="font-medium text-neutral-900">
                    {period.count}건
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* 한글 설명: 택배사별 통계 */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">
            택배사별 통계
          </h3>
          <div className="h-64">
            <Doughnut
              data={courierChartData}
              options={{
                ...defaultChartOptions,
                plugins: {
                  ...defaultChartOptions.plugins,
                  legend: {
                    ...defaultChartOptions.plugins?.legend,
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 space-y-2">
            {statistics.courierStatistics.map((courier, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-neutral-600">{courier.courierName}</span>
                <div className="flex items-center gap-4">
                  <span className="text-neutral-500">
                    평균 {courier.averageDays.toFixed(1)}일
                  </span>
                  <span className="font-medium text-neutral-900">
                    {courier.count}건
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

