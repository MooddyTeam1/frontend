// 한글 설명: Admin 수익 리포트 페이지. 플랫폼 수익 및 정산 관련 리포트
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { currencyKRW } from "../../../../shared/utils/format";

export const RevenueReportPage: React.FC = () => {
  // 한글 설명: 필터 상태
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(1)).toISOString().split("T")[0], // 한글 설명: 이번 달 1일
    to: new Date().toISOString().split("T")[0],
  });
  const [filterMaker, setFilterMaker] = useState("");
  const [filterProject, setFilterProject] = useState("");

  // 한글 설명: 플랫폼 매출 데이터 (Mock)
  const platformRevenue = {
    totalPayment: 1250000000, // 한글 설명: 총 결제 금액
    paymentFee: 37500000, // 한글 설명: 결제 수수료 (카드/PG) - 3%
    platformFee: 62500000, // 한글 설명: 플랫폼 수수료 - 5%
    otherCosts: 5000000, // 한글 설명: 기타 비용
    netRevenue: 20000000, // 한글 설명: 순수익 (플랫폼 수수료 - PG 수수료 - 기타 비용)
  };

  // 한글 설명: 메이커 정산 데이터 (Mock)
  const makerSettlement = {
    totalSettlement: 1150000000, // 한글 설명: 메이커에게 지급해야 할 총 정산 금액
    pending: 450000000, // 한글 설명: 정산 예정
    processing: 200000000, // 한글 설명: 처리 중
    completed: 500000000, // 한글 설명: 정산 완료
    onHold: 0, // 한글 설명: 보류
  };

  // 한글 설명: 수수료 정책별 분석 데이터 (Mock)
  const feePolicyAnalysis = [
    {
      policy: "일반 프로젝트 (5%)",
      projects: 120,
      amount: 1000000000,
      fee: 50000000,
      contribution: 80.0, // 한글 설명: 수익 기여도
    },
    {
      policy: "특별 기획전 (3%)",
      projects: 20,
      amount: 200000000,
      fee: 6000000,
      contribution: 9.6,
    },
    {
      policy: "프로모션 적용 (2%)",
      projects: 10,
      amount: 50000000,
      fee: 1000000,
      contribution: 1.6,
    },
  ];

  // 한글 설명: 세부 테이블 데이터 (Mock)
  const detailTable = [
    {
      date: "2025-11-07",
      projectName: "Smart LED Lamp",
      makerName: "알파메이커",
      paymentAmount: 4500000,
      pgFee: 135000,
      platformFee: 225000,
      settlementAmount: 4140000,
      status: "완료",
    },
    {
      date: "2025-11-07",
      projectName: "Compact Coffee Kit",
      makerName: "브라보팩토리",
      paymentAmount: 3200000,
      pgFee: 96000,
      platformFee: 160000,
      settlementAmount: 2944000,
      status: "처리 중",
    },
    {
      date: "2025-11-06",
      projectName: "Pet AI Tracker",
      makerName: "크래프트랩",
      paymentAmount: 5600000,
      pgFee: 168000,
      platformFee: 280000,
      settlementAmount: 5152000,
      status: "예정",
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
                수익 리포트
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                플랫폼 수익 및 정산 현황을 확인하세요
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
                  메이커
                </label>
                <input
                  type="text"
                  value={filterMaker}
                  onChange={(e) => setFilterMaker(e.target.value)}
                  placeholder="메이커 ID"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  프로젝트
                </label>
                <input
                  type="text"
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  placeholder="프로젝트 ID"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* 플랫폼 매출(수수료) */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              플랫폼 매출(수수료)
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="text-xs text-neutral-500">총 결제 금액</p>
                <p className="mt-2 text-xl font-semibold text-neutral-900">
                  {currencyKRW(platformRevenue.totalPayment)}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="text-xs text-neutral-500">결제 수수료 (PG)</p>
                <p className="mt-2 text-xl font-semibold text-red-600">
                  -{currencyKRW(platformRevenue.paymentFee)}
                </p>
                <p className="mt-1 text-xs text-neutral-500">3%</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="text-xs text-neutral-500">플랫폼 수수료</p>
                <p className="mt-2 text-xl font-semibold text-emerald-600">
                  +{currencyKRW(platformRevenue.platformFee)}
                </p>
                <p className="mt-1 text-xs text-neutral-500">5%</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="text-xs text-neutral-500">기타 비용</p>
                <p className="mt-2 text-xl font-semibold text-red-600">
                  -{currencyKRW(platformRevenue.otherCosts)}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-900 bg-neutral-900 p-4">
                <p className="text-xs text-white">순수익</p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {currencyKRW(platformRevenue.netRevenue)}
                </p>
              </div>
            </div>
          </section>

          {/* 메이커 정산 관점 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              메이커 정산 관점
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="text-xs text-neutral-500">총 정산 금액</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-900">
                  {currencyKRW(makerSettlement.totalSettlement)}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs text-amber-700">정산 예정</p>
                <p className="mt-2 text-2xl font-semibold text-amber-900">
                  {currencyKRW(makerSettlement.pending)}
                </p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-xs text-blue-700">처리 중</p>
                <p className="mt-2 text-2xl font-semibold text-blue-900">
                  {currencyKRW(makerSettlement.processing)}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs text-emerald-700">정산 완료</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-900">
                  {currencyKRW(makerSettlement.completed)}
                </p>
              </div>
            </div>
          </section>

          {/* 수수료 정책별 분석 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              수수료 정책별 분석
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                  <tr>
                    <th className="px-3 py-2 text-left">정책</th>
                    <th className="px-3 py-2 text-right">프로젝트 수</th>
                    <th className="px-3 py-2 text-right">결제 금액</th>
                    <th className="px-3 py-2 text-right">수수료</th>
                    <th className="px-3 py-2 text-right">기여도</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {feePolicyAnalysis.map((policy, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 font-medium text-neutral-900">
                        {policy.policy}
                      </td>
                      <td className="px-3 py-2 text-right text-neutral-600">
                        {policy.projects}개
                      </td>
                      <td className="px-3 py-2 text-right text-neutral-600">
                        {currencyKRW(policy.amount)}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-neutral-900">
                        {currencyKRW(policy.fee)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-100">
                            <div
                              className="h-full bg-neutral-900"
                              style={{ width: `${policy.contribution}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-neutral-900">
                            {policy.contribution}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 세부 테이블 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              세부 내역
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                  <tr>
                    <th className="px-3 py-2 text-left">날짜</th>
                    <th className="px-3 py-2 text-left">프로젝트명</th>
                    <th className="px-3 py-2 text-left">메이커명</th>
                    <th className="px-3 py-2 text-right">결제 금액</th>
                    <th className="px-3 py-2 text-right">PG 수수료</th>
                    <th className="px-3 py-2 text-right">플랫폼 수수료</th>
                    <th className="px-3 py-2 text-right">메이커 정산 금액</th>
                    <th className="px-3 py-2 text-left">정산 상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {detailTable.map((row, idx) => {
                    const statusColors = {
                      완료: "bg-emerald-50 text-emerald-700",
                      "처리 중": "bg-blue-50 text-blue-700",
                      예정: "bg-amber-50 text-amber-700",
                      보류: "bg-red-50 text-red-700",
                    };
                    return (
                      <tr key={idx}>
                        <td className="px-3 py-2 text-neutral-600">
                          {row.date}
                        </td>
                        <td className="px-3 py-2 font-medium text-neutral-900">
                          {row.projectName}
                        </td>
                        <td className="px-3 py-2 text-neutral-600">
                          {row.makerName}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-neutral-900">
                          {currencyKRW(row.paymentAmount)}
                        </td>
                        <td className="px-3 py-2 text-right text-red-600">
                          -{currencyKRW(row.pgFee)}
                        </td>
                        <td className="px-3 py-2 text-right text-emerald-600">
                          +{currencyKRW(row.platformFee)}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-neutral-900">
                          {currencyKRW(row.settlementAmount)}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              statusColors[
                                row.status as keyof typeof statusColors
                              ] || "bg-neutral-100 text-neutral-700"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
