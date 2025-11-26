// 한글 설명: Admin 수익 리포트 페이지. 플랫폼 수익 및 정산 관련 리포트
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { currencyKRW } from "../../../../shared/utils/format";
import { fetchAdminRevenueReport } from "../../../../features/admin/api/adminStatisticsService";
import type { RevenueReportDto } from "../../../../features/admin/types";

export const RevenueReportPage: React.FC = () => {
  // 한글 설명: 필터 상태
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(1)).toISOString().split("T")[0], // 한글 설명: 이번 달 1일
    to: new Date().toISOString().split("T")[0],
  });
  const [filterMaker, setFilterMaker] = useState("");
  const [filterProject, setFilterProject] = useState("");

  // 한글 설명: API 데이터 상태
  const [revenueData, setRevenueData] = useState<RevenueReportDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 수익 리포트 데이터 조회
  const loadRevenueReport = async () => {
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
      const data = await fetchAdminRevenueReport({
        startDate: dateRange.from,
        endDate: dateRange.to,
        makerId: filterMaker ? parseInt(filterMaker, 10) : undefined,
        projectId: filterProject ? parseInt(filterProject, 10) : undefined,
      });
      setRevenueData(data);
    } catch (err) {
      console.error("수익 리포트 데이터 조회 실패:", err);
      setError("수익 리포트 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 한글 설명: 날짜 범위 또는 필터 변경 시 자동 조회
  useEffect(() => {
    loadRevenueReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.from, dateRange.to, filterMaker, filterProject]);

  // 한글 설명: 데이터 변환 (API 응답 → UI 표시용)
  const platformRevenue = revenueData
    ? {
        totalPayment: revenueData.platformRevenue.totalPaymentAmount,
        paymentFee: revenueData.platformRevenue.pgFeeAmount,
        platformFee: revenueData.platformRevenue.platformFeeAmount,
        otherCosts: revenueData.platformRevenue.otherCosts,
        netRevenue: revenueData.platformRevenue.netPlatformProfit, // 플랫폼 몫 = 플랫폼 수수료
        pgFeeRate: revenueData.platformRevenue.pgFeeRate, // 5%
        platformFeeRate: revenueData.platformRevenue.platformFeeRate, // 10%
      }
    : null;

  // 한글 설명: 메이커 정산 데이터 변환
  const makerSettlement = revenueData
    ? {
        totalSettlement: revenueData.makerSettlementSummary.totalSettlementAmount,
        pending: revenueData.makerSettlementSummary.pendingAmount,
        processing: revenueData.makerSettlementSummary.processingAmount,
        completed: revenueData.makerSettlementSummary.completedAmount,
        onHold: 0, // 백엔드에 없음 (API 연결 안 됨)
      }
    : null;

  // 한글 설명: 수수료 정책별 분석 데이터 변환
  const feePolicyAnalysis = revenueData
    ? revenueData.feePolicyAnalysis.policies.map((policy) => ({
        policy: policy.policyName,
        projects: policy.projectCount,
        amount: policy.paymentAmount,
        fee: policy.feeAmount,
        contribution: policy.contributionRate,
      }))
    : [];

  // 한글 설명: 세부 테이블 데이터 변환
  const detailTable = revenueData
    ? revenueData.details.map((detail) => {
        // 한글 설명: 정산 상태 한글 변환
        const statusMap: Record<string, string> = {
          PENDING: "예정",
          FIRST_PAID: "처리 중",
          FINAL_READY: "처리 중",
          COMPLETED: "완료",
        };

        return {
          date: detail.date,
          projectName: detail.projectName,
          makerName: detail.makerName,
          paymentAmount: detail.paymentAmount,
          pgFee: detail.pgFee,
          platformFee: detail.platformFee,
          settlementAmount: detail.makerSettlementAmount,
          status: statusMap[detail.settlementStatus] || detail.settlementStatus,
        };
      })
    : [];

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
                  메이커 ID
                </label>
                <input
                  type="text"
                  value={filterMaker}
                  onChange={(e) => {
                    setFilterMaker(e.target.value);
                    // 한글 설명: 프로젝트 필터와 동시에 사용 시 프로젝트 필터 우선
                    if (e.target.value && filterProject) {
                      setFilterProject("");
                    }
                  }}
                  placeholder="메이커 ID (숫자)"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  프로젝트 ID
                </label>
                <input
                  type="text"
                  value={filterProject}
                  onChange={(e) => {
                    setFilterProject(e.target.value);
                    // 한글 설명: 프로젝트 필터 선택 시 메이커 필터 초기화 (백엔드에서 projectId 우선)
                    if (e.target.value && filterMaker) {
                      setFilterMaker("");
                    }
                  }}
                  placeholder="프로젝트 ID (숫자)"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                />
                <p className="mt-1 text-xs text-neutral-400">
                  프로젝트 ID 입력 시 메이커 필터는 무시됩니다
                </p>
              </div>
            </div>
            {loading && (
              <div className="mt-4 text-center text-sm text-neutral-500">
                데이터를 불러오는 중...
              </div>
            )}
          </section>

          {/* 플랫폼 매출(수수료) */}
          {platformRevenue ? (
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
                  <p className="mt-1 text-xs text-neutral-500">
                    {platformRevenue.pgFeeRate}%
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200 p-4">
                  <p className="text-xs text-neutral-500">플랫폼 수수료</p>
                  <p className="mt-2 text-xl font-semibold text-emerald-600">
                    +{currencyKRW(platformRevenue.platformFee)}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {platformRevenue.platformFeeRate}%
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200 p-4">
                  <p className="text-xs text-neutral-500">
                    기타 비용 {platformRevenue.otherCosts === 0 && (
                      <span className="text-xs text-neutral-400">(미구현)</span>
                    )}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-red-600">
                    -{currencyKRW(platformRevenue.otherCosts)}
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-900 bg-neutral-900 p-4">
                  <p className="text-xs text-white">플랫폼 몫</p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    {currencyKRW(platformRevenue.netRevenue)}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    (플랫폼 수수료 {platformRevenue.platformFeeRate}%)
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600">
                <p>
                  <strong>메이커 지급액:</strong>{" "}
                  {currencyKRW(
                    platformRevenue.totalPayment -
                      platformRevenue.paymentFee -
                      platformRevenue.platformFee -
                      platformRevenue.otherCosts
                  )}
                </p>
              </div>
            </section>
          ) : (
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                플랫폼 매출(수수료)
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {[1, 2, 3, 4, 5].map((i) => (
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

          {/* 메이커 정산 관점 */}
          {makerSettlement ? (
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
                  <p className="mt-1 text-xs text-amber-600">(PENDING)</p>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-xs text-blue-700">처리 중</p>
                  <p className="mt-2 text-2xl font-semibold text-blue-900">
                    {currencyKRW(makerSettlement.processing)}
                  </p>
                  <p className="mt-1 text-xs text-blue-600">
                    (FIRST_PAID + FINAL_READY)
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs text-emerald-700">정산 완료</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-900">
                    {currencyKRW(makerSettlement.completed)}
                  </p>
                  <p className="mt-1 text-xs text-emerald-600">(COMPLETED)</p>
                </div>
              </div>
            </section>
          ) : (
            <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                메이커 정산 관점
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
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

          {/* 수수료 정책별 분석 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              수수료 정책별 분석
            </h2>
            {feePolicyAnalysis.length > 0 ? (
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
                              {policy.contribution.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-neutral-500">
                수수료 정책 데이터가 없습니다.
              </p>
            )}
            {feePolicyAnalysis.length === 1 && (
              <p className="mt-2 text-xs text-neutral-400">
                현재는 일반 프로젝트(10%) 정책만 적용됩니다.
              </p>
            )}
          </section>

          {/* 세부 테이블 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              세부 내역
            </h2>
            {detailTable.length > 0 ? (
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
            ) : (
              <p className="py-8 text-center text-sm text-neutral-500">
                해당 기간에 주문이 없습니다.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

