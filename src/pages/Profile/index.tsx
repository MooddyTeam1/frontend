import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { useAuth } from "../../features/auth/contexts/AuthContext";
import {
  useProjectStore,
  type ProjectDraft,
} from "../../features/creator/stores/projectStore";

const SupporterView: React.FC = () => {
  // 한글 설명: 서포터 탭 전용 뷰. 왼쪽에 작은 프로필 카드, 오른쪽에 메인 콘텐츠를 배치한다.
  const { user } = useAuth();
  const mySupporterUrl = user?.id ? `/supporters/${user.id}` : undefined;

  return (
    <div className="flex gap-6">
      {/* 왼쪽: 작은 프로필 카드 */}
      <aside className="w-48 shrink-0">
        <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-neutral-100" />
            <div className="w-full text-center">
              <p className="truncate text-sm font-medium text-neutral-900">
                {user?.name ?? "서포터"}
              </p>
              {mySupporterUrl ? (
                <Link
                  to={mySupporterUrl}
                  className="mt-2 block rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                >
                  프로필 보기
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </aside>

      {/* 오른쪽: 메인 콘텐츠 */}
      <section className="min-w-0 flex-1 space-y-6 rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">최근 후원</h2>
          <div className="flex gap-2">
            <Link
              to="/settings/supporter"
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              서포터 설정
            </Link>
            <Link
              to="/settings/account"
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              계정 설정
            </Link>
          </div>
        </div>
        <p className="text-xs text-neutral-500">
          실제 결제 내역이 연동되면 여기에서 상태를 확인할 수 있습니다.
        </p>
        <div className="rounded-2xl border border-neutral-100 p-4 text-neutral-600">
          아직 후원한 프로젝트가 없습니다.
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900">
            관심 프로젝트
          </h3>
          <p className="text-xs text-neutral-500">
            찜한 프로젝트가 표시됩니다. 프로젝트 상세에서 하트를 눌러 저장해
            보세요.
          </p>
          <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-neutral-500">
            관심 목록이 비어 있습니다.
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900">계정 알림</h3>
          <div className="rounded-2xl border border-neutral-100 p-4 text-xs text-neutral-500">
            이메일 인증, 결제 수단, 배송지 관리 기능이 곧 추가될 예정입니다.
          </div>
        </div>
      </section>
    </div>
  );
};

const stageMeta: Array<{
  status: ProjectDraft["status"];
  title: string;
  description: string;
  link: string;
}> = [
  {
    status: "DRAFT",
    title: "작성 중",
    description: "아직 제출하지 않은 초안 프로젝트",
    link: "/creator/projects/new",
  },
  {
    status: "REVIEW",
    title: "심사 중",
    description: "승인 대기 중인 프로젝트",
    link: "/creator/dashboard",
  },
  {
    status: "APPROVED",
    title: "승인됨",
    description: "검토를 통과해 공개를 준비 중입니다.",
    link: "/creator/dashboard",
  },
  {
    status: "SCHEDULED",
    title: "공개 예정",
    description: "LIVE 예정일을 기다리고 있는 프로젝트",
    link: "/creator/dashboard",
  },
  {
    status: "LIVE",
    title: "진행 중",
    description: "현재 후원받고 있는 프로젝트",
    link: "/creator/dashboard",
  },
  {
    status: "ENDED",
    title: "종료",
    description: "마감된 프로젝트 및 정산을 확인하세요.",
    link: "/creator/dashboard",
  },
  {
    status: "REJECTED",
    title: "반려됨",
    description: "수정 후 다시 제출이 필요한 프로젝트",
    link: "/creator/dashboard",
  },
];

const statusLabel: Record<ProjectDraft["status"], string> = {
  DRAFT: "작성 중",
  REVIEW: "심사 중",
  APPROVED: "승인됨",
  SCHEDULED: "공개 예정",
  LIVE: "진행 중",
  ENDED: "종료",
  REJECTED: "반려됨",
};

const MakerView: React.FC<{ displayName: string; drafts: ProjectDraft[] }> = ({
  displayName,
  drafts,
}) => {
  const liveCount = drafts.filter((draft) => draft.status === "LIVE").length;
  const reviewCount = drafts.filter(
    (draft) => draft.status === "REVIEW"
  ).length;
  const endedCount = drafts.filter((draft) => draft.status === "ENDED").length;
  const savedCount = drafts.length;

  const stageCounts = drafts.reduce<Record<ProjectDraft["status"], number>>(
    (acc, draft) => ({ ...acc, [draft.status]: (acc[draft.status] ?? 0) + 1 }),
    {
      DRAFT: 0,
      REVIEW: 0,
      APPROVED: 0,
      SCHEDULED: 0,
      LIVE: 0,
      ENDED: 0,
      REJECTED: 0,
    }
  );

  const dashboardStats = [
    { label: "저장한 초안", value: savedCount.toLocaleString() },
    { label: "심사 중", value: reviewCount.toLocaleString() },
    { label: "진행 중 프로젝트", value: liveCount.toLocaleString() },
    { label: "종료된 프로젝트", value: endedCount.toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              메이커 대시보드
            </h2>
            <p className="text-xs text-neutral-500">
              저장한 프로젝트와 진행 상황을 한눈에 확인하세요.
            </p>
          </div>
          <Link
            to="/creator/dashboard"
            className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
          >
            대시보드 상세
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-neutral-100 p-4"
            >
              <p className="text-xs text-neutral-500">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-neutral-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            내 프로젝트
          </h2>
          <Link
            to="/creator/projects/new"
            className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
          >
            새 프로젝트 만들기
          </Link>
        </div>
        <p className="text-xs text-neutral-500">
          상태별로 프로젝트를 살펴보고 필요한 작업을 이어서 진행하세요.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {stageMeta.map((stage) => (
            <Link
              key={stage.status}
              to={stage.link}
              className="space-y-2 rounded-2xl border border-neutral-100 p-4 transition hover:-translate-y-0.5 hover:border-neutral-900"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-900">
                  {stage.title}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {stageCounts[stage.status]?.toLocaleString?.() ?? 0}개
                </span>
              </div>
              <p className="text-xs text-neutral-500">{stage.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            프로필 카드
          </h2>
          <div className="flex gap-2 text-xs">
            <Link
              to="/settings/maker"
              className="rounded-full border border-neutral-200 px-3 py-1 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              메이커 설정
            </Link>
            <Link
              to="/creator/dashboard"
              className="rounded-full border border-neutral-200 px-3 py-1 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              프로젝트 관리
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-100 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            CREATOR
          </p>
          <h3 className="mt-2 text-lg font-semibold text-neutral-900">
            {displayName || "새로운 메이커"}
          </h3>
          <p className="mt-2 text-sm text-neutral-600">
            소개 글을 작성하면 후원자에게 더 많은 신뢰를 줄 수 있습니다. 제작
            배경이나 목표를 간단히 적어 주세요.
          </p>
          <div className="mt-4 space-y-1 text-xs text-neutral-500">
            <p>홈페이지: example.com</p>
            <p>소셜 링크: instagram.com/username</p>
            <p>
              상태별 프로젝트:{" "}
              {Object.entries(stageCounts)
                .filter(([, count]) => count > 0)
                .map(
                  ([status, count]) =>
                    `${statusLabel[status as ProjectDraft["status"]]} ${count}개`
                )
                .join(", ") || "등록된 프로젝트가 없습니다."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  return (
    <Container>
      <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col gap-6 py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900">
            마이페이지
          </h1>
          <p className="text-sm text-neutral-500">
            서포터와 메이커 역할을 전환하며 필요한 정보를 빠르게 살펴보세요.
          </p>
        </header>

        <div className="flex items-center gap-2 rounded-full border border-neutral-200 p-1 text-sm text-neutral-600">
          <NavLink
            to="supporter"
            end
            className={({ isActive }) =>
              `flex items-center justify-center flex-1 rounded-full px-4 py-2 transition ${isActive ? "bg-neutral-900 text-white" : "hover:text-neutral-900"}`
            }
          >
            서포터 보기
          </NavLink>
          <NavLink
            to="maker"
            className={({ isActive }) =>
              `flex items-center justify-center flex-1 rounded-full px-4 py-2 transition ${isActive ? "bg-neutral-900 text-white" : "hover:text-neutral-900"}`
            }
          >
            메이커 보기
          </NavLink>
        </div>

        <Outlet />
      </div>
    </Container>
  );
};

// 한글 설명: 라우트 하위에서 사용할 컴포넌트. 기존 뷰를 그대로 노출한다.
export const ProfileSupporterRoute: React.FC = () => {
  return <SupporterView />;
};

export const ProfileMakerRoute: React.FC = () => {
  const { user } = useAuth();
  const drafts = useProjectStore((state) => state.drafts);
  return <MakerView displayName={user?.name ?? "크리에이터"} drafts={drafts} />;
};
