// 한글 설명: Admin용 정산 콘솔 페이지. 메이커 정산 관리 기능 제공
import React, { useEffect, useMemo, useState } from "react";
import { currencyKRW } from "../../../shared/utils/format";

// =========================================================================================
// 한글 설명: 정산 상태/타입 정의
// =========================================================================================
export type SettlementStatus =
  | "PENDING"
  | "READY"
  | "APPROVED"
  | "PAID"
  | "FAILED";

export interface SettlementDTO {
  id: string; // 정산 고유 ID
  makerId: string; // 메이커 ID
  makerName: string; // 메이커명
  periodFrom: string; // 정산기간 시작 (yyyy-mm-dd)
  periodTo: string; // 정산기간 종료 (yyyy-mm-dd)
  grossAmount: number; // 총 매출(결제완료 합)
  feeAmount: number; // 수수료(플랫폼/PG)
  netAmount: number; // 정산액(= gross - fee)
  status: SettlementStatus; // 정산 상태
  createdAt: string; // 생성일시 (ISO)
  updatedAt: string; // 수정일시 (ISO)
  approvedAt?: string | null; // 확정 일시
  paidAt?: string | null; // 지급 일시
}

export interface SettlementFilters {
  q: string; // 검색(메이커명/ID)
  status: SettlementStatus | "ALL";
  from: string; // 기간(시작)
  to: string; // 기간(종료)
}

// =========================================================================================
// 한글 설명: 날짜 포맷 유틸
// =========================================================================================
const formatDate = (iso?: string | null): string => {
  if (!iso) return "-";
  try {
    const date = new Date(iso);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch {
    return "-";
  }
};

// =========================================================================================
// 한글 설명: API 어댑터 (실제 API 연동 시 이 부분만 교체)
// =========================================================================================
const settlementAdapter = {
  // 한글 설명: 정산 목록 조회 (필터/정렬/페이징은 필요에 따라 확장)
  async list(filters: Partial<SettlementFilters>): Promise<SettlementDTO[]> {
    // TODO: 실제 API 연동
    console.log("[adapter] list filters:", filters);
    await wait(150);
    return MOCK_DATA; // 데모 데이터
  },

  // 한글 설명: 정산 초안 생성 (기간/메이커 조건 기반)
  async createDraft(params: {
    makerId?: string;
    from: string;
    to: string;
  }): Promise<{ id: string }> {
    console.log("[adapter] createDraft params:", params);
    await wait(300);
    return { id: "stl_tmp_" + Date.now() };
  },

  // 한글 설명: 정산 확정(승인)
  async approve(settlementId: string): Promise<void> {
    console.log("[adapter] approve:", settlementId);
    await wait(150);
  },

  // 한글 설명: 지급 실행
  async pay(settlementId: string): Promise<void> {
    console.log("[adapter] pay:", settlementId);
    await wait(300);
  },

  // 한글 설명: 실패 처리(메모 남기기 등)
  async markFailed(settlementId: string, reason: string): Promise<void> {
    console.log("[adapter] markFailed:", settlementId, reason);
    await wait(150);
  },

  // 한글 설명: 엑셀/CSV 다운로드 링크 (실제는 signed URL 등)
  async exportCSV(filters: Partial<SettlementFilters>): Promise<string> {
    console.log("[adapter] exportCSV with:", filters);
    await wait(150);
    return "/downloads/settlements.csv";
  },
};

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =========================================================================================
// 한글 설명: 정산 콘솔 메인 컴포넌트
// =========================================================================================
export const SettlementConsolePage: React.FC = () => {
  // 필터 상태
  const [filters, setFilters] = useState<SettlementFilters>({
    q: "",
    status: "ALL",
    from: "",
    to: "",
  });

  // 목록/선택/로딩
  const [items, setItems] = useState<SettlementDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SettlementDTO | null>(null);

  // 다이얼로그 상태
  const [openApprove, setOpenApprove] = useState(false);
  const [openPay, setOpenPay] = useState(false);
  const [openFail, setOpenFail] = useState(false);
  const [failReason, setFailReason] = useState("");

  // 초기/필터 변경 시 조회
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await settlementAdapter.list(filters);
        setItems(list);
      } finally {
        setLoading(false);
      }
    })();
  }, [filters.q, filters.status, filters.from, filters.to]);

  // 필터 변경 헬퍼
  const updateFilter = (k: keyof SettlementFilters) => (v: string) =>
    setFilters((s) => ({ ...s, [k]: v }));

  // CSV/엑셀 다운로드
  const handleExport = async () => {
    const url = await settlementAdapter.exportCSV(filters);
    window.open(url, "_blank");
  };

  // 초안 생성 (기간 기반)
  const handleCreateDraft = async () => {
    if (!filters.from || !filters.to) {
      alert("정산 기간(시작/종료)을 먼저 선택해주세요.");
      return;
    }
    const { id } = await settlementAdapter.createDraft({
      from: filters.from,
      to: filters.to,
    });
    alert(`정산 초안이 생성되었습니다. (id: ${id})`);
    // 재조회
    const list = await settlementAdapter.list(filters);
    setItems(list);
  };

  const canApprove = (row?: SettlementDTO | null) =>
    row && (row.status === "PENDING" || row.status === "READY");
  const canPay = (row?: SettlementDTO | null) =>
    row && row.status === "APPROVED";

  // 정산 확정
  const confirmApprove = async () => {
    if (!selected) return;
    await settlementAdapter.approve(selected.id);
    setOpenApprove(false);
    setSelected(null);
    // 재조회
    const list = await settlementAdapter.list(filters);
    setItems(list);
  };

  // 지급 실행
  const confirmPay = async () => {
    if (!selected) return;
    await settlementAdapter.pay(selected.id);
    setOpenPay(false);
    setSelected(null);
    // 재조회
    const list = await settlementAdapter.list(filters);
    setItems(list);
  };

  // 실패 처리
  const confirmFail = async () => {
    if (!selected) return;
    if (!failReason.trim()) {
      alert("실패 사유를 입력해주세요.");
      return;
    }
    await settlementAdapter.markFailed(selected.id, failReason.trim());
    setFailReason("");
    setOpenFail(false);
    setSelected(null);
    // 재조회
    const list = await settlementAdapter.list(filters);
    setItems(list);
  };

  const filtered = useMemo(() => {
    // 한글 설명: 어댑터에서 필터링한다고 가정하지만, 데모에선 클라이언트에서도 2차 필터링
    return items.filter((it) => {
      const okQ =
        !filters.q ||
        it.makerName.toLowerCase().includes(filters.q.toLowerCase()) ||
        it.makerId.toLowerCase().includes(filters.q.toLowerCase()) ||
        it.id.toLowerCase().includes(filters.q.toLowerCase());
      const okStatus = filters.status === "ALL" || it.status === filters.status;
      const okFrom = !filters.from || it.periodFrom >= filters.from;
      const okTo = !filters.to || it.periodTo <= filters.to;
      return okQ && okStatus && okFrom && okTo;
    });
  }, [items, filters]);

  return (
    <div className="w-full">
      <div className="mx-auto min-h-[70vh] max-w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-neutral-900">
              정산 콘솔
            </h1>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                엑셀 다운로드
              </button>
              <button
                onClick={handleCreateDraft}
                className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                정산 초안 생성
              </button>
            </div>
          </div>

          {/* 필터 영역 */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-3">
              <input
                type="text"
                value={filters.q}
                onChange={(e) => updateFilter("q")(e.target.value)}
                placeholder="검색: 메이커명/메이커ID/정산ID"
                className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <select
                value={filters.status}
                onChange={(e) => updateFilter("status")(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
              >
                <option value="ALL">전체</option>
                <option value="PENDING">PENDING</option>
                <option value="READY">READY</option>
                <option value="APPROVED">APPROVED</option>
                <option value="PAID">PAID</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
            <div className="col-span-6 md:col-span-2">
              <input
                type="date"
                value={filters.from}
                onChange={(e) => updateFilter("from")(e.target.value)}
                placeholder="시작일"
                className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <input
                type="date"
                value={filters.to}
                onChange={(e) => updateFilter("to")(e.target.value)}
                placeholder="종료일"
                className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div className="col-span-6 md:col-span-3 flex justify-end">
              <button
                onClick={() =>
                  setFilters({ q: "", status: "ALL", from: "", to: "" })
                }
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                초기화
              </button>
            </div>
          </div>

          {/* 목록 테이블 */}
          <div className="overflow-hidden rounded-3xl border border-neutral-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-neutral-200 bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      정산ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      메이커
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      기간
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      매출
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      수수료
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      정산액
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      상태
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      생성
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-8 text-center text-sm text-neutral-500"
                      >
                        불러오는 중…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-8 text-center text-sm text-neutral-500"
                      >
                        조건에 맞는 정산이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row) => (
                      <tr key={row.id} className="hover:bg-neutral-50">
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-neutral-900">
                          {row.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          <div className="flex flex-col">
                            <span>{row.makerName}</span>
                            <span className="text-xs text-neutral-500">
                              {row.makerId}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                          {row.periodFrom} ~ {row.periodTo}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-neutral-900">
                          {currencyKRW(row.grossAmount)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-neutral-600">
                          {currencyKRW(row.feeAmount)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-neutral-900">
                          {currencyKRW(row.netAmount)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-600">
                          {formatDate(row.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelected(row)}
                              className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                            >
                              상세
                            </button>
                            <button
                              disabled={!canApprove(row)}
                              onClick={() => {
                                setSelected(row);
                                setOpenApprove(true);
                              }}
                              className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              확정
                            </button>
                            <button
                              disabled={!canPay(row)}
                              onClick={() => {
                                setSelected(row);
                                setOpenPay(true);
                              }}
                              className="rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              지급
                            </button>
                            <button
                              onClick={() => {
                                setSelected(row);
                                setOpenFail(true);
                              }}
                              className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 transition hover:border-red-900 hover:bg-red-100"
                            >
                              실패
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 상세 다이얼로그 */}
          {selected && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-3xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-neutral-900">
                    정산 상세
                  </h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-neutral-400 transition hover:text-neutral-900"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <KV k="정산ID" v={selected.id} mono />
                    <KV k="상태" v={<StatusBadge status={selected.status} />} />
                    <KV
                      k="메이커명"
                      v={`${selected.makerName} (${selected.makerId})`}
                    />
                    <KV
                      k="기간"
                      v={`${selected.periodFrom} ~ ${selected.periodTo}`}
                    />
                    <KV k="매출" v={currencyKRW(selected.grossAmount)} />
                    <KV k="수수료" v={currencyKRW(selected.feeAmount)} />
                    <KV k="정산액" v={currencyKRW(selected.netAmount)} />
                    <KV k="생성" v={formatDate(selected.createdAt)} />
                    <KV k="수정" v={formatDate(selected.updatedAt)} />
                    <KV k="확정" v={formatDate(selected.approvedAt)} />
                    <KV k="지급" v={formatDate(selected.paidAt)} />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      onClick={() => setSelected(null)}
                      className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 확정 다이얼로그 */}
          {openApprove && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                  정산 확정
                </h2>
                <p className="mb-6 text-sm text-neutral-600">
                  해당 정산을 확정하시겠습니까? 확정 후에는 지급 단계로 진행할
                  수 있습니다.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setOpenApprove(false)}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                  >
                    취소
                  </button>
                  <button
                    onClick={confirmApprove}
                    className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                  >
                    확정
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 지급 다이얼로그 */}
          {openPay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                  지급 실행
                </h2>
                <p className="mb-6 text-sm text-neutral-600">
                  정산 지급을 실행합니다. 실제 송금/지급 처리와 연동되어야
                  합니다.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setOpenPay(false)}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                  >
                    취소
                  </button>
                  <button
                    onClick={confirmPay}
                    className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                  >
                    지급
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 실패 다이얼로그 */}
          {openFail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                  실패 처리
                </h2>
                <div className="mb-6 space-y-2">
                  <p className="text-sm text-neutral-600">
                    실패 사유를 입력해주세요(운영자만 열람).
                  </p>
                  <input
                    type="text"
                    placeholder="예: 메이커 계좌 검증 실패 / 정산 금액 불일치"
                    value={failReason}
                    onChange={(e) => setFailReason(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setOpenFail(false);
                      setFailReason("");
                    }}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                  >
                    취소
                  </button>
                  <button
                    onClick={confirmFail}
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:border-red-900 hover:bg-red-100"
                  >
                    실패 처리
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =========================================================================================
// 한글 설명: 키-값 표시용 작은 컴포넌트
// =========================================================================================
function KV({
  k,
  v,
  mono = false,
}: {
  k: React.ReactNode;
  v: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center">
      <div className="w-32 text-neutral-500">{k}</div>
      <div className={`flex-1 ${mono ? "font-mono" : ""}`}>{v}</div>
    </div>
  );
}

// =========================================================================================
// 한글 설명: 상태 배지
// =========================================================================================
function StatusBadge({ status }: { status: SettlementStatus }) {
  const map: Record<SettlementStatus, { label: string; className: string }> = {
    PENDING: {
      label: "PENDING",
      className: "border-neutral-200 text-neutral-700",
    },
    READY: {
      label: "READY",
      className: "border-neutral-300 bg-neutral-100 text-neutral-700",
    },
    APPROVED: {
      label: "APPROVED",
      className: "border-neutral-900 bg-neutral-900 text-white",
    },
    PAID: {
      label: "PAID",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    FAILED: {
      label: "FAILED",
      className: "border-red-200 bg-red-50 text-red-700",
    },
  };
  const { label, className } = map[status];
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

// =========================================================================================
// 한글 설명: 데모용 목업 데이터 (실제 연동 시 제거)
// =========================================================================================
const MOCK_DATA: SettlementDTO[] = [
  {
    id: "STL-2025-0001",
    makerId: "MK-1029",
    makerName: "알파메이커",
    periodFrom: "2025-10-01",
    periodTo: "2025-10-31",
    grossAmount: 15800000,
    feeAmount: 890000,
    netAmount: 14910000,
    status: "PENDING",
    createdAt: "2025-11-01T10:10:00Z",
    updatedAt: "2025-11-01T10:10:00Z",
    approvedAt: null,
    paidAt: null,
  },
  {
    id: "STL-2025-0002",
    makerId: "MK-2041",
    makerName: "브라보팩토리",
    periodFrom: "2025-10-01",
    periodTo: "2025-10-31",
    grossAmount: 7200000,
    feeAmount: 410000,
    netAmount: 6790000,
    status: "APPROVED",
    createdAt: "2025-11-01T10:30:00Z",
    updatedAt: "2025-11-02T08:00:00Z",
    approvedAt: "2025-11-02T08:00:00Z",
    paidAt: null,
  },
  {
    id: "STL-2025-0003",
    makerId: "MK-3300",
    makerName: "크래프트랩",
    periodFrom: "2025-10-01",
    periodTo: "2025-10-31",
    grossAmount: 2450000,
    feeAmount: 150000,
    netAmount: 2300000,
    status: "PAID",
    createdAt: "2025-11-01T11:00:00Z",
    updatedAt: "2025-11-03T11:30:00Z",
    approvedAt: "2025-11-02T09:00:00Z",
    paidAt: "2025-11-03T11:30:00Z",
  },
];
