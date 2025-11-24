import React from "react";
import {
  useParams,
  useNavigate,
  Link,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { useAuthStore } from "../../features/auth/stores/authStore";
import { makerService } from "../../features/maker/api/makerService";
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
  const { makerId: makerIdParam } = useParams<{ makerId: string }>();
  const navigate = useNavigate();

  // 한글 설명: 디버깅을 위한 로그
  React.useEffect(() => {
    console.log("[MakerPublicPage] makerIdParam:", makerIdParam);
  }, [makerIdParam]);

  // 한글 설명: makerId가 없으면 404 페이지로 리다이렉트
  React.useEffect(() => {
    if (!makerIdParam) {
      console.warn(
        "[MakerPublicPage] makerId가 없습니다. 404로 리다이렉트합니다."
      );
      navigate("/404", { replace: true });
      return;
    }
  }, [makerIdParam, navigate]);

  // 한글 설명: makerId가 없으면 빈 화면 반환 (리다이렉트 중)
  if (!makerIdParam) {
    return null;
  }

  // 한글 설명: URL에서 받은 makerId는 숫자만 (예: "1003")
  const makerId = makerIdParam;
  // 한글 설명: 백엔드 API 호출 시에도 동일하게 숫자만 사용
  const makerIdForApi = makerId;
  const { user } = useAuthStore();
  const location = useLocation();

  // 한글 설명: 팔로우 여부 상태. true이면 이미 팔로우 중, false이면 아직 팔로우 안 한 상태.
  const [isFollowing, setIsFollowing] = React.useState<boolean>(false);

  // 한글 설명: 팔로우/언팔로우 토글 핸들러. 실제로는 여기서 API 호출 후 성공 시 상태를 업데이트한다.
  const [followLoading, setFollowLoading] = React.useState(false);
  const handleToggleFollow = async () => {
    if (!user) {
      // 한글 설명: 비로그인 상태에서는 팔로우 불가. 향후 로그인 페이지로 이동하는 로직으로 교체할 수 있다.
      alert("팔로우 기능은 로그인 후 이용할 수 있습니다.");
      return;
    }

    if (followLoading) return; // 한글 설명: 이미 요청 중이면 중복 요청 방지

    try {
      setFollowLoading(true);
      if (isFollowing) {
        // 한글 설명: 언팔로우
        await makerService.unfollowMaker(makerIdForApi);
        setIsFollowing(false);
      } else {
        // 한글 설명: 팔로우
        await makerService.followMaker(makerIdForApi);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("팔로우/언팔로우 실패", err);
      alert(
        err instanceof Error ? err.message : "팔로우/언팔로우에 실패했습니다."
      );
    } finally {
      setFollowLoading(false);
    }
  };

  // 현재 탭 상태 확인 (URL 기반)
  // 한글 설명: /makers/1003 -> "projects" (기본), /makers/1003/news -> "news", /makers/1003/info -> "info"
  const pathParts = location.pathname.split("/");
  const lastPart = pathParts[pathParts.length - 1];
  const currentTab =
    lastPart === makerId || !lastPart || lastPart === ""
      ? "projects"
      : lastPart;

  // 한글 설명: 메이커 프로필 데이터 상태
  const [maker, setMaker] = React.useState<PublicMaker | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [allKeywords] = React.useState<MakerKeywordDTO[]>([
    { id: 1, name: "친환경" },
    { id: 2, name: "소셜임팩트" },
    { id: 3, name: "B2B" },
    { id: 4, name: "테크" },
  ]);

  // 한글 설명: 메이커 프로필 조회
  React.useEffect(() => {
    const loadMakerProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await makerService.getPublicProfile(makerIdForApi);

        // 한글 설명: API 응답을 PublicMaker 타입으로 변환
        setMaker({
          makerId: data.makerId || makerId,
          ownerUserId: data.ownerUserId || "",
          name: data.name || "메이커",
          imageUrl: data.imageUrl || null,
          productIntro: data.productIntro || null,
          coreCompetencies: data.coreCompetencies || null,
          keywords: data.keywordIds || data.keywords || [],
          totalRaised: data.totalRaised || 0,
          totalSupporters: data.totalSupporters || 0,
          satisfactionRate: data.satisfactionRate || undefined,
        });

        // 한글 설명: 팔로우 상태 업데이트
        if (data.isFollowing !== undefined) {
          setIsFollowing(data.isFollowing);
        }
      } catch (err) {
        console.error("메이커 프로필 조회 실패", err);
        setError(
          err instanceof Error
            ? err.message
            : "메이커 프로필을 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    if (makerIdForApi) {
      loadMakerProfile();
    }
  }, [makerIdForApi]);

  // 한글 설명: 로딩 중이거나 에러 발생 시 처리
  if (loading) {
    return (
      <Container>
        <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center py-16">
          <p className="text-sm text-neutral-500">
            메이커 프로필을 불러오는 중입니다...
          </p>
        </div>
      </Container>
    );
  }

  if (error || !maker) {
    return (
      <Container>
        <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center py-16">
          <div className="text-center">
            <p className="text-sm text-neutral-500">
              {error || "메이커 프로필을 찾을 수 없습니다."}
            </p>
            <Link
              to="/projects"
              className="mt-4 inline-block rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              프로젝트 둘러보기
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  const isOwner = !!user && maker && user.id === maker.ownerUserId;
  const selectedKeywords = maker
    ? allKeywords.filter((kw) => maker.keywords.includes(kw.id))
    : [];

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
                  to="/maker/projects"
                  className="block w-full rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white text-center hover:bg-neutral-800"
                >
                  내 프로젝트 관리
                </Link>
                <Link
                  to={`/makers/${makerId}/news/create`}
                  className="block w-full rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900 text-center hover:bg-neutral-50"
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
                disabled={followLoading}
                // 한글 설명: 팔로우 상태에 따라 스타일과 라벨을 다르게 보여준다.
                className={`rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isFollowing
                    ? "border border-neutral-300 bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                    : "border border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
              >
                {followLoading
                  ? "처리 중..."
                  : isFollowing
                    ? "언팔로우"
                    : "팔로우"}
              </button>
            )}
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-neutral-200">
          <NavLink
            to={`/makers/${makerId}`}
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
          <p>업태: 제조업</p>
          <p>사업자번호: 123-45-67890</p>
          <p>통신판매업 신고번호: 제 2020-서울강남-0001호</p>
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
