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
import { getMakerNewsList } from "../../features/maker/api/makerNewsService";
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
  const { user } = useAuthStore();
  const location = useLocation();

  // 한글 설명: 팔로우 여부 상태. true이면 이미 팔로우 중, false이면 아직 팔로우 안 한 상태.
  const [isFollowing, setIsFollowing] = React.useState<boolean>(false);

  // 한글 설명: 팔로우/언팔로우 토글 핸들러. 실제로는 여기서 API 호출 후 성공 시 상태를 업데이트한다.
  const [followLoading, setFollowLoading] = React.useState(false);

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

  // 한글 설명: URL에서 받은 makerId는 숫자만 (예: "1003")
  const makerId = makerIdParam || "";
  // 한글 설명: 백엔드 API 호출 시에도 동일하게 숫자만 사용
  const makerIdForApi = makerId;

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

  // 한글 설명: 메이커 프로필 조회
  React.useEffect(() => {
    const loadMakerProfile = async () => {
      if (!makerIdForApi) return;

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

    loadMakerProfile();
  }, [makerIdForApi, makerId]);

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
                  className="block w-full rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-center text-sm font-medium !text-white transition hover:bg-neutral-800"
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
        <div className="flex items-center justify-center gap-1 overflow-x-auto border-b border-neutral-200">
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
  // 한글 설명: URL에서 makerId 가져오기
  const { makerId } = useParams<{ makerId: string }>();
  const [projects, setProjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 한글 설명: 메이커 프로젝트 목록 불러오기
  React.useEffect(() => {
    const loadProjects = async () => {
      if (!makerId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await makerService.getPublicProjects(makerId, {
          page: 1,
          size: 12,
          sort: "createdAt",
          order: "desc",
        });
        // 한글 설명: 페이지네이션 응답에서 content 배열 추출
        setProjects(data.content || []);
      } catch (err) {
        console.error("메이커 프로젝트 목록 조회 실패:", err);
        setError("프로젝트 목록을 불러오는 도중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [makerId]);

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-neutral-500">
        프로젝트 목록을 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-sm text-red-600">{error}</div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-neutral-500">
        아직 등록된 프로젝트가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4 py-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="rounded-2xl border border-neutral-200 p-4 transition hover:border-neutral-400 hover:shadow-md"
          >
            {project.coverImageUrl ? (
              <img
                src={project.coverImageUrl}
                alt={project.title}
                className="aspect-video w-full rounded-xl object-cover"
              />
            ) : (
              <div className="aspect-video w-full rounded-xl bg-neutral-100" />
            )}
            <p className="mt-3 line-clamp-2 text-sm font-medium text-neutral-900">
              {project.title}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {project.raisedAmount?.toLocaleString() || 0}원 모금 · 진행률{" "}
              {project.progressPercentage?.toFixed(0) || 0}%
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

// 한글 설명: 마크다운에서 이미지 URL 추출 유틸 함수 (현재 미사용)
// const extractImageFromMarkdown = (markdown: string): string | null => {
//   // 한글 설명: ![alt](url) 형식의 이미지 마크다운에서 첫 번째 URL 추출
//   const imageRegex = /!\[.*?\]\((.*?)\)/;
//   const match = markdown.match(imageRegex);
//   return match ? match[1] : null;
// };

// 한글 설명: 마크다운에서 모든 이미지 URL 추출
const extractAllImagesFromMarkdown = (markdown: string): string[] => {
  // 한글 설명: ![alt](url) 형식의 모든 이미지 마크다운에서 URL 추출
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  const matches = Array.from(markdown.matchAll(imageRegex));
  return matches.map((match) => match[1]);
};

// 한글 설명: 마크다운에서 이미지 제거하고 텍스트만 추출
const removeImagesFromMarkdown = (markdown: string): string => {
  // 한글 설명: 이미지 마크다운 제거
  return markdown.replace(/!\[.*?\]\(.*?\)/g, "").trim();
};

// 한글 설명: 날짜 포맷팅 함수
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 한글 설명: 소식 유형 한글 라벨
const getNewsTypeLabel = (type: string): string => {
  switch (type) {
    case "EVENT":
      return "이벤트";
    case "NOTICE":
      return "공지";
    case "NEW_PRODUCT":
      return "신제품 출시";
    default:
      return "소식";
  }
};

// 한글 설명: 소식 유형 색상
const getNewsTypeColor = (type: string): string => {
  switch (type) {
    case "EVENT":
      return "bg-blue-100 text-blue-700";
    case "NOTICE":
      return "bg-yellow-100 text-yellow-700";
    case "NEW_PRODUCT":
      return "bg-green-100 text-green-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
};

// 한글 설명: 메이커 소식 카드 컴포넌트
type MakerNewsCardProps = {
  news: any;
  makerName: string;
};

const MakerNewsCard: React.FC<MakerNewsCardProps> = ({ news, makerName }) => {
  const imageUrls = extractAllImagesFromMarkdown(news.contentMarkdown);
  const textContent = removeImagesFromMarkdown(news.contentMarkdown);
  // 한글 설명: 텍스트 내용이 40자 이상인지 확인
  const isLongText = textContent.length > 40;
  const [isExpanded, setIsExpanded] = React.useState(false);
  // 한글 설명: 이미지 슬라이드 현재 인덱스
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  // 한글 설명: 40자로 제한 (미리보기용)
  const previewText =
    textContent.length > 40
      ? textContent.substring(0, 40) + "..."
      : textContent;
  const fullText = textContent;

  // 한글 설명: 이전 이미지로 이동
  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  // 한글 설명: 다음 이미지로 이동
  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  // 한글 설명: 특정 인덱스로 이동
  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <article className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {/* 한글 설명: 카드 헤더 - 유형 뱃지(왼쪽), 메이커 정보, 날짜 */}
      <div className="border-b border-neutral-100 px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getNewsTypeColor(
              news.newsType || "NOTICE"
            )}`}
          >
            {getNewsTypeLabel(news.newsType || "NOTICE")}
          </span>
          <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-200" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-neutral-900">
              {makerName}
            </p>
            <p className="text-xs text-neutral-500">
              {formatDate(news.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* 한글 설명: 제목과 본문 (위로) */}
      <div className="px-3 py-3">
        <h3 className="mb-2 text-base font-semibold text-neutral-900">
          {news.title}
        </h3>
        {fullText && (
          <div>
            <p className="text-sm leading-relaxed text-neutral-700">
              {isExpanded ? fullText : previewText}
            </p>
          </div>
        )}
      </div>

      {/* 한글 설명: 더보기/접기 버튼 (전체 너비) */}
      {isLongText && (
        <div className="border-t border-neutral-100 px-3 py-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50 active:bg-neutral-100"
          >
            {isExpanded ? "접기" : "더보기"}
          </button>
        </div>
      )}

      {/* 한글 설명: 이미지 슬라이드 (밑으로) */}
      {imageUrls.length > 0 && (
        <div className="border-t border-neutral-100">
          <div className="relative overflow-hidden bg-neutral-100">
            <img
              src={imageUrls[currentImageIndex]}
              alt={`${news.title} - 이미지 ${currentImageIndex + 1}`}
              className="h-auto w-full max-h-64 object-contain"
            />
            {imageUrls.length > 1 && (
              <>
                {/* 한글 설명: 이전 버튼 */}
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
                  aria-label="이전 이미지"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {/* 한글 설명: 다음 버튼 */}
                <button
                  type="button"
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
                  aria-label="다음 이미지"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
          {/* 한글 설명: 이미지 인디케이터 (점) */}
          {imageUrls.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 border-t border-neutral-100 bg-neutral-50 px-3 py-2">
              {imageUrls.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "w-6 bg-neutral-900"
                      : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-label={`이미지 ${index + 1}로 이동`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

// 한글 설명: 메이커 소식 탭 콘텐츠
export const MakerNewsRoute: React.FC = () => {
  // 한글 설명: URL에서 makerId 가져오기
  const { makerId } = useParams<{ makerId: string }>();
  const [newsList, setNewsList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [makerName, setMakerName] = React.useState<string>("메이커");

  // 한글 설명: 메이커 정보 불러오기
  React.useEffect(() => {
    const loadMakerInfo = async () => {
      if (!makerId) return;
      try {
        const data = await makerService.getPublicProfile(makerId);
        setMakerName(data.name || "메이커");
      } catch (err) {
        console.error("메이커 정보 조회 실패:", err);
      }
    };
    loadMakerInfo();
  }, [makerId]);

  // 한글 설명: 메이커 소식 목록 불러오기
  React.useEffect(() => {
    const loadNews = async () => {
      if (!makerId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getMakerNewsList(makerId);
        setNewsList(data);
      } catch (err) {
        console.error("메이커 소식 조회 실패:", err);
        setError("소식을 불러오는 도중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [makerId]);

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-neutral-500">
        소식을 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-sm text-red-600">{error}</div>
    );
  }

  if (newsList.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-neutral-500">
        아직 등록된 소식이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3 py-4">
      {newsList.map((news) => (
        <MakerNewsCard key={news.id} news={news} makerName={makerName} />
      ))}
    </div>
  );
};

// 한글 설명: 메이커 정보 탭 콘텐츠
export const MakerInfoRoute: React.FC = () => {
  // 한글 설명: URL에서 makerId 가져오기
  const { makerId } = useParams<{ makerId: string }>();
  const [makerInfo, setMakerInfo] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 한글 설명: 메이커 정보 불러오기
  React.useEffect(() => {
    const loadMakerInfo = async () => {
      if (!makerId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await makerService.getPublicProfile(makerId);
        setMakerInfo(data);
      } catch (err) {
        console.error("메이커 정보 조회 실패:", err);
        setError("메이커 정보를 불러오는 도중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadMakerInfo();
  }, [makerId]);

  // 한글 설명: 날짜 포맷팅 함수
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${year}년 ${month}월`;
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-neutral-500">
        메이커 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (error || !makerInfo) {
    return (
      <div className="py-12 text-center text-sm text-red-600">
        {error || "메이커 정보를 불러올 수 없습니다."}
      </div>
    );
  }

  return (
    <div className="space-y-4 py-6">
      {/* 한글 설명: 핵심 역량 */}
      {makerInfo.coreCompetencies && (
        <section className="rounded-2xl border border-neutral-200 p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-neutral-900">핵심 역량</h2>
          <p className="mt-2 text-sm text-neutral-600 whitespace-pre-line">
            {makerInfo.coreCompetencies}
          </p>
        </section>
      )}

      {/* 한글 설명: 설립 정보 */}
      <section className="rounded-2xl border border-neutral-200 p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-neutral-900">설립 정보</h2>
        <div className="mt-2 space-y-2 text-sm text-neutral-600">
          {makerInfo.establishedAt && (
            <p>설립일: {formatDate(makerInfo.establishedAt)}</p>
          )}
          {makerInfo.industryType && <p>업종: {makerInfo.industryType}</p>}
          {makerInfo.businessItem && <p>업태: {makerInfo.businessItem}</p>}
          {makerInfo.businessNumber && (
            <p>사업자번호: {makerInfo.businessNumber}</p>
          )}
          {makerInfo.onlineSalesRegistrationNo && (
            <p>통신판매업 신고번호: {makerInfo.onlineSalesRegistrationNo}</p>
          )}
          {makerInfo.representative && (
            <p>대표자: {makerInfo.representative}</p>
          )}
          {makerInfo.location && <p>소재지: {makerInfo.location}</p>}
          {!makerInfo.establishedAt &&
            !makerInfo.industryType &&
            !makerInfo.businessItem &&
            !makerInfo.businessNumber &&
            !makerInfo.onlineSalesRegistrationNo &&
            !makerInfo.representative &&
            !makerInfo.location && (
              <p className="text-neutral-400">등록된 설립 정보가 없습니다.</p>
            )}
        </div>
      </section>

      {/* 한글 설명: 연락처 */}
      <section className="rounded-2xl border border-neutral-200 p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-neutral-900">연락처</h2>
        <div className="mt-2 space-y-2 text-sm text-neutral-600">
          {makerInfo.contactEmail && <p>이메일: {makerInfo.contactEmail}</p>}
          {makerInfo.contactPhone && <p>연락처: {makerInfo.contactPhone}</p>}
          {!makerInfo.contactEmail && !makerInfo.contactPhone && (
            <p className="text-neutral-400">등록된 연락처가 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
};
