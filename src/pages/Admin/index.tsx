import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../features/auth/stores/authStore";
import { useNavigate } from "react-router-dom";

// 한글 설명: Admin 대시보드 페이지. 관리자 전용 기능을 제공한다.
export const AdminPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full">
      <div className="mx-auto min-h-[70vh] max-w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900">
                관리자 대시보드
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                {user?.name}님, 관리자 페이지에 오신 것을 환영합니다.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              로그아웃
            </button>
          </div>

          {/* 통계 카드 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-neutral-200 p-6">
              <p className="text-xs text-neutral-500">총 사용자 수</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">-</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-6">
              <p className="text-xs text-neutral-500">총 프로젝트 수</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">-</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-6">
              <p className="text-xs text-neutral-500">심사 대기 중</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">-</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-6">
              <p className="text-xs text-neutral-500">총 모금액</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">-</p>
            </div>
          </div>

          {/* 관리 기능 섹션 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 프로젝트 관리 */}
            <div className="space-y-4 rounded-3xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                프로젝트 관리
              </h2>
              <p className="text-sm text-neutral-500">
                프로젝트 심사, 승인, 거부 등을 관리할 수 있습니다.
              </p>
              <div className="space-y-2">
                <Link
                  to="/admin/review"
                  className="block w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  심사 콘솔 (신규)
                </Link>
                <Link
                  to="/admin/projects?status=review"
                  className="block w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  심사 대기 프로젝트
                </Link>
                <Link
                  to="/admin/projects"
                  className="block w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  모든 프로젝트 보기
                </Link>
              </div>
            </div>

            {/* 사용자 관리 */}
            <div className="space-y-4 rounded-3xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                사용자 관리
              </h2>
              <p className="text-sm text-neutral-500">
                사용자 목록, 권한 관리 등을 할 수 있습니다.
              </p>
              <div className="space-y-2">
                <button className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50">
                  전체 사용자 목록
                </button>
                <button className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50">
                  메이커 관리
                </button>
                <button className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50">
                  신고된 사용자
                </button>
              </div>
            </div>

            {/* 정산 관리 */}
            <div className="space-y-4 rounded-3xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                정산 관리
              </h2>
              <p className="text-sm text-neutral-500">
                메이커 정산 관리 및 지급 처리를 할 수 있습니다.
              </p>
              <div className="space-y-2">
                <Link
                  to="/admin/settlement"
                  className="block w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  정산 콘솔
                </Link>
              </div>
            </div>

            {/* 통계 및 리포트 */}
            <div className="space-y-4 rounded-3xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                통계 및 리포트
              </h2>
              <p className="text-sm text-neutral-500">
                플랫폼 통계와 리포트를 확인할 수 있습니다.
              </p>
              <div className="space-y-2">
                <Link
                  to="/admin/statistics"
                  className="block w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  요약 대시보드
                </Link>
                <Link
                  to="/admin/statistics/daily"
                  className="block w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  일일 통계
                </Link>
                <Link
                  to="/admin/statistics/monthly"
                  className="block w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  월별 리포트
                </Link>
                <Link
                  to="/admin/statistics/revenue"
                  className="block w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  수익 리포트
                </Link>
                <Link
                  to="/admin/statistics/project-performance"
                  className="block w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  프로젝트 성과 리포트
                </Link>
                <Link
                  to="/admin/statistics/user-behavior"
                  className="block w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  유저 행동 리포트
                </Link>
              </div>
            </div>

            {/* 설정 */}
            <div className="space-y-4 rounded-3xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                시스템 설정
              </h2>
              <p className="text-sm text-neutral-500">
                플랫폼 설정과 관리를 할 수 있습니다.
              </p>
              <div className="space-y-2">
                <button className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50">
                  일반 설정
                </button>
                <button className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50">
                  결제 설정
                </button>
                <button className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50">
                  알림 설정
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
