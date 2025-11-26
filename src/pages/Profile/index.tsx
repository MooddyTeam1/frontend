import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { useAuthStore } from "../../features/auth/stores/authStore";
import { useMyProjectsStore } from "../../features/projects/stores/myProjectsStore";
import { MakerView } from "./components/MakerView";
import { SupporterView } from "./components/SupporterView";
import { statusLabel } from "./constants";

// 한글 설명: 마이페이지 루트 컴포넌트. 서포터/메이커 뷰 전환 및 공통 레이아웃을 담당한다.
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

        <div className="flex items-center gap-2 rounded-full border border-neutral-200 p-1 text-sm">
          <NavLink
            to="/profile/supporter"
            end
            className={({ isActive }) =>
              `flex flex-1 items-center justify-center rounded-full px-4 py-2 font-medium transition ${
                isActive
                  ? "bg-neutral-900 !text-white"
                  : "text-neutral-600 hover:text-neutral-900"
              }`
            }
          >
            서포터 보기
          </NavLink>
          <NavLink
            to="/profile/maker"
            className={({ isActive }) =>
              `flex flex-1 items-center justify-center rounded-full px-4 py-2 font-medium transition ${
                isActive
                  ? "bg-neutral-900 !text-white"
                  : "text-neutral-600 hover:text-neutral-900"
              }`
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

// 한글 설명: 서포터 탭 라우트에 노출되는 뷰를 반환한다.
export const ProfileSupporterRoute: React.FC = () => {
  return <SupporterView />;
};

// 한글 설명: 메이커 탭 라우트에 노출되는 뷰를 반환한다.
export const ProfileMakerRoute: React.FC = () => {
  const { user } = useAuthStore();
  const fetchOverview = useMyProjectsStore((state) => state.fetchOverview);
  const resetProjectsError = useMyProjectsStore((state) => state.resetError);

  // 한글 설명: 메이커 보기 탭 클릭 시 프로젝트 요약 정보를 새로고침
  React.useEffect(() => {
    resetProjectsError();
    fetchOverview({ force: true }).catch(() => undefined);
  }, [fetchOverview, resetProjectsError]);

  return <MakerView displayName={user?.name ?? "크리에이터"} />;
};

export { statusLabel };
