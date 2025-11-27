import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { useAuthStore } from "../../features/auth/stores/authStore";

const metrics = [
  { label: "최근 조회수", value: "12,450", tooltip: "최근 30일 기준" },
  { label: "후원 수", value: "386", tooltip: "PAID 상태 합산" },
  { label: "모금액", value: "₩78,200,000", tooltip: "환불 금액 포함" },
  { label: "전환률", value: "3.2%", tooltip: "페이지 방문 대비 후원" },
];

const rewardStatsByProject = [
  {
    project: "Smart LED Lamp",
    status: "LIVE",
    rewards: [
      { name: "얼리버드", price: 49_000, sold: 180, refunded: 3, stock: 20 },
      { name: "스탠다드", price: 59_000, sold: 220, refunded: 5, stock: 780 },
    ],
  },
  {
    project: "Pet AI Tracker",
    status: "ENDED",
    rewards: [
      { name: "기본", price: 99_000, sold: 640, refunded: 12, stock: 0 },
      { name: "스페셜", price: 189_000, sold: 220, refunded: 4, stock: 0 },
    ],
  },
];

const statusBadge: Record<string, string> = {
  LIVE: "bg-emerald-500/10 text-emerald-600",
  ENDED: "bg-neutral-500/10 text-neutral-600",
};

const formatKRW = (amount: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);

export const CreatorDashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <Container>
      <div className="space-y-8 py-16">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">
                크리에이터 대시보드
              </h1>
              <p className="text-sm text-neutral-500">
                {user?.name ?? "크리에이터"}님의 프로젝트 성과를 한눈에
                확인하고, 프로젝트별 리워드 판매 현황을 살펴보세요.
              </p>
            </div>
            <Link
              to="/maker/projects"
              className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold !text-white hover:bg-neutral-800"
            >
              내 프로젝트 관리
            </Link>
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
            <span>기간</span>
            <button className="rounded-full border border-neutral-900 px-3 py-1 text-neutral-900">
              최근 7일
            </button>
            <button className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900 hover:text-neutral-900">
              최근 30일
            </button>
            <button className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900 hover:text-neutral-900">
              전체
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-3xl border border-neutral-200 p-4"
              >
                <p className="text-xs text-neutral-500">{metric.label}</p>
                <p className="mt-2 text-xl font-semibold text-neutral-900">
                  {metric.value}
                </p>
                <p className="text-[11px] text-neutral-400">{metric.tooltip}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                리워드별 판매 현황
              </h2>
              <p className="text-xs text-neutral-500">
                프로젝트별 리워드 판매·환불·재고 정보를 확인하세요.
              </p>
            </div>
            <button className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900">
              보고서 다운로드
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-neutral-600">
              <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-400">
                <tr>
                  <th className="py-2 pr-6">프로젝트</th>
                  <th className="py-2 pr-6">상태</th>
                  <th className="py-2 pr-6">리워드</th>
                  <th className="py-2 pr-6">가격</th>
                  <th className="py-2 pr-6">판매</th>
                  <th className="py-2 pr-6">환불</th>
                  <th className="py-2 pr-6">재고</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rewardStatsByProject.map((project) => (
                  <React.Fragment key={project.project}>
                    <tr className="bg-neutral-50 text-xs uppercase tracking-[0.12em] text-neutral-500">
                      <td className="py-3 pr-6" colSpan={7}>
                        <div className="flex items-center gap-3">
                          <span>{project.project}</span>
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] ${statusBadge[project.status] ?? "bg-neutral-200 text-neutral-600"}`}
                          >
                            {project.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {project.rewards.map((reward) => (
                      <tr key={`${project.project}-${reward.name}`}>
                        <td className="py-3 pr-6 text-neutral-500">—</td>
                        <td className="py-3 pr-6" />
                        <td className="py-3 pr-6 text-neutral-900">
                          {reward.name}
                        </td>
                        <td className="py-3 pr-6">{formatKRW(reward.price)}</td>
                        <td className="py-3 pr-6">
                          {reward.sold.toLocaleString()}
                        </td>
                        <td className="py-3 pr-6">
                          {reward.refunded.toLocaleString()}
                        </td>
                        <td className="py-3 pr-6">
                          {reward.stock.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Container>
  );
};
