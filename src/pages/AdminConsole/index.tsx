import React from "react";
import { Container } from "../../shared/components/Container";

const reviewQueue = [
  { id: "PROJ-104", title: "아이브로우 스마트 커피 키트", submittedAt: "2025-11-02 21:10" },
  { id: "PROJ-103", title: "친환경 캠핑 식기 세트", submittedAt: "2025-11-02 17:42" },
];

const reports = [
  { id: "REP-88", target: "댓글 #231", reason: "욕설", status: "조치 완료" },
  { id: "REP-87", target: "프로젝트 #p2", reason: "허위 정보", status: "검토 중" },
];

export const AdminConsolePage: React.FC = () => (
  <Container>
    <div className="space-y-8 py-16">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">관리자 콘솔</h1>
        <p className="text-sm text-neutral-500">
          심사 대기 프로젝트와 신고 접수 현황을 모니터링하고 승인/반려 결정을 내릴 수 있는 공간입니다.
        </p>
      </header>

      <section className="space-y-4 rounded-3xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">심사 대기함</h2>
          <button className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900">
            전체 보기
          </button>
        </div>
        <div className="divide-y divide-neutral-100 text-sm text-neutral-700">
          {reviewQueue.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-neutral-900">{item.title}</p>
                <p className="text-xs text-neutral-500">
                  {item.id} · 제출 {item.submittedAt}
                </p>
              </div>
              <div className="flex gap-2 text-xs">
                <button className="rounded-full border border-neutral-200 px-3 py-1 hover:border-emerald-500 hover:text-emerald-600">
                  승인
                </button>
                <button className="rounded-full border border-neutral-200 px-3 py-1 hover:border-red-500 hover:text-red-500">
                  반려
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">신고 현황</h2>
          <button className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900">
            로그 보기
          </button>
        </div>
        <table className="min-w-full text-left text-sm text-neutral-600">
          <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-400">
            <tr>
              <th className="py-2 pr-6">ID</th>
              <th className="py-2 pr-6">대상</th>
              <th className="py-2 pr-6">사유</th>
              <th className="py-2 pr-6">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="py-3 pr-6">{report.id}</td>
                <td className="py-3 pr-6">{report.target}</td>
                <td className="py-3 pr-6">{report.reason}</td>
                <td className="py-3 pr-6">{report.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  </Container>
);
