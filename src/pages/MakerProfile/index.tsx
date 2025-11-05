import React from "react";
import {
  useParams,
  Link,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { useAuth } from "../../features/auth/contexts/AuthContext";
import type { MakerKeywordDTO } from "../../features/maker/types";

type PublicMaker = {
  makerId: string;
  ownerUserId: string;
  name: string;

  imageUrl?: string;
  productIntro?: string;
  coreCompetencies?: string;
  keywords: number[];
  totalRaised: number;
  totalSupporters: number;
  satisfactionRate?: number;
};

export const MakerPublicPage: React.FC = () => {
  // 한글 설명: 공개 메이커 페이지. 타 유저가 볼 수 있는 메이커 프로필 뷰를 제공한다.
  const { makerId = "" } = useParams();
  const { user } = useAuth();
  const location = useLocation();

  // 한글 설명: 팔로우 여부 상태. true이면 이미 팔로우 중, false이면 아직 팔로우 안 한 상태.
  const [isFollowing, setIsFollowing] = React.useState<boolean>(false);

  // 한글 설명: 팔로우/언팔로우 토글 핸들러. 실제로는 여기서 API 호출 후 성공 시 상태를 업데이트한다.
  const handleToggleFollow = () => {
    if (!user) {
      // 한글 설명: 비로그인 상태에서는 팔로우 불가. 향후 로그인 페이지로 이동하는 로직으로 교체할 수 있다.
      alert("팔로우 기능은 로그인 후 이용할 수 있습니다.");
      return;
    }

    // TODO: 팔로우/언팔로우 API 호출 추가 (성공 시에만 상태 변경 권장)
    setIsFollowing((prev) => !prev);
  };

  // 현재 탭 상태 확인 (URL 기반)
  const currentTab = location.pathname.split("/").pop() || "projects";

  // TODO: 실제 API로 교체. makerId 기반 데이터 조회
  const [maker] = React.useState<PublicMaker>({
    makerId,
    ownerUserId: "user123",
    name: "메이커 브랜드",
    imageUrl: "https://placehold.co/1200x600",
    productIntro: "혁신적인 제품과 서비스로 세상을 변화시키는 메이커입니다.",
    coreCompetencies: "디자인, 개발, 마케팅",
    keywords: [1, 2, 3],
    totalRaised: 12500000,
    totalSupporters: 245,
    satisfactionRate: 4.8,
  });

  const [allKeywords] = React.useState<MakerKeywordDTO[]>([
    { id: 1, name: "친환경" },
    { id: 2, name: "소셜임팩트" },
    { id: 3, name: "B2B" },
    { id: 4, name: "테크" },
  ]);

  const isOwner = !!user && user.id === maker.ownerUserId;
  const selectedKeywords = allKeywords.filter((kw) =>
    maker.keywords.includes(kw.id)
  );

  return (
    <Container>
      <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col gap-4 py-8">
        {/* 커버 이미지 */}
        <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-neutral-100 sm:h-96">
          {maker.imageUrl ? (
            <img
              src={maker.imageUrl}
              alt={maker.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400">
              커버 이미지
            </div>
          )}
        </div>

        {/* 헤더 영역: 메이커 정보 + 액션 버튼 */}
        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {/* 메이커 아바타/이름 */}
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-semibold text-neutral-900 sm:text-xl">
                  {maker.name}
                </h1>
                {maker.productIntro ? (
                  <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                    {maker.productIntro}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* 키워드 태그 */}
          {selectedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedKeywords.map((kw) => (
                <span
                  key={kw.id}
                  className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-700"
                >
                  {kw.name}
                </span>
              ))}
            </div>
          ) : null}

          {/* 간략 통계 */}
          <div className="grid grid-cols-3 gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
            <div className="text-center">
              <p className="text-xs text-neutral-500">누적 모금액</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">
                {maker.totalRaised.toLocaleString()}원
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-neutral-500">서포터 수</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">
                {maker.totalSupporters.toLocaleString()}명
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-neutral-500">만족도</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">
                {maker.satisfactionRate?.toFixed(1) ?? "N/A"}
              </p>
            </div>
          </div>
        </div>
        {/* 액션 버튼 영역 */}
        <div className="w-full">
          {/* 한글 설명: 액션 버튼을 가로 전체 폭으로 늘려서 위/아래 컨텐츠와 너비를 맞춘다. */}
          <div className="flex flex-col gap-2">
            {isOwner ? (
              <>
                <Link
                  to={`/makers/${makerId}/news/create`}
                  className="block w-full rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white text-center hover:bg-neutral-800"
                >
                  소식 작성하기
                </Link>
                <Link
                  to="/settings/maker"
                  className="block w-full rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900 text-center hover:bg-neutral-50"
                >
                  메이커 페이지 편집
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleToggleFollow}
                // 한글 설명: 팔로우 상태에 따라 스타일과 라벨을 다르게 보여준다.
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isFollowing
                    ? "border border-neutral-300 bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                    : "border border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
              >
                {isFollowing ? "언팔로우" : "팔로우"}
              </button>
            )}
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-neutral-200">
          <NavLink
            to={`/makers/${makerId}/projects`}
            end
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                isActive || currentTab === "projects"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`
            }
          >
            메이커 프로젝트
          </NavLink>
          <NavLink
            to={`/makers/${makerId}/news`}
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                isActive || currentTab === "news"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`
            }
          >
            메이커 소식
          </NavLink>
          <NavLink
            to={`/makers/${makerId}/info`}
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                isActive || currentTab === "info"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`
            }
          >
            메이커 정보
          </NavLink>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="min-h-[400px]">
          <Outlet />
        </div>
      </div>
    </Container>
  );
};

// 한글 설명: 메이커 프로젝트 탭 콘텐츠
export const MakerProjectsRoute: React.FC = () => {
  return (
    <div className="space-y-4 py-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 p-4">
            <div className="aspect-video w-full rounded-xl bg-neutral-100" />
            <p className="mt-3 line-clamp-2 text-sm font-medium text-neutral-900">
              프로젝트 타이틀 {i + 1}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              12,345원 모금 · 진행률 45%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 한글 설명: 메이커 소식 탭 콘텐츠
export const MakerNewsRoute: React.FC = () => {
  return (
    <div className="space-y-4 py-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-neutral-200 p-4">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 shrink-0 rounded-xl bg-neutral-100" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-900">
                소식 제목 {i + 1}
              </p>
              <p className="mt-1 text-xs text-neutral-500">2025-01-15</p>
              <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
                소식 내용이 여기에 표시됩니다. 최근 업데이트와 진행 상황을
                공유합니다.
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 한글 설명: 메이커 정보 탭 콘텐츠
export const MakerInfoRoute: React.FC = () => {
  return (
    <div className="space-y-4 py-6">
      <section className="rounded-2xl border border-neutral-200 p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-neutral-900">핵심 역량</h2>
        <p className="mt-2 text-sm text-neutral-600">
          디자인, 개발, 마케팅 분야에서 전문성을 갖추고 있습니다.
        </p>
      </section>

      <section className="rounded-2xl border border-neutral-200 p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-neutral-900">설립 정보</h2>
        <div className="mt-2 space-y-2 text-sm text-neutral-600">
          <p>설립일: 2020년 1월</p>
          <p>업종: 소프트웨어</p>
          <p>대표자: 홍길동</p>
          <p>소재지: 서울특별시 강남구</p>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-neutral-900">연락처</h2>
        <div className="mt-2 space-y-2 text-sm text-neutral-600">
          <p>이메일: contact@example.com</p>
          <p>연락처: 010-0000-0000</p>
        </div>
      </section>
    </div>
  );
};
