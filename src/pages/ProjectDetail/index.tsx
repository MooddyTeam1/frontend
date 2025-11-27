import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { ProgressBar } from "../../features/projects/components/ProgressBar";
import { RewardCard } from "../../features/projects/components/RewardCard";
import { currencyKRW, daysLeft, progressPct } from "../../shared/utils/format";
import {
  fetchProjectDetail,
  bookmarkProjectApi,
  unbookmarkProjectApi,
} from "../../features/projects/api/myProjectsService";
import { makerService } from "../../features/maker/api/makerService";
import { useAuthStore } from "../../features/auth/stores/authStore";
import type { ProjectDetailResponseDTO } from "../../features/projects/types";
import { resolveImageUrl } from "../../shared/utils/image";
import { StoryViewer } from "../../shared/components/StoryViewer";
import { ProjectQnaSection as ProjectQnaSectionFixed } from "../../features/qna/components/ProjectQnaSectionFixed";
import { ProjectNewsSection } from "../../features/maker/projectManagement/components/ProjectNewsSection";
import { useTracking } from "../../features/tracking/hooks/useTracking";
import { ProjectRewardsTab } from "../../features/projects/components/ProjectRewardsTab";

type ImageCarouselProps = {
  images: string[];
  title: string;
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, title }) => {
  // 한글 설명: 캐러셀에서 현재 보여주는 이미지 인덱스를 관리하는 상태.
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative space-y-4">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-100">
        <img
          src={images[currentIndex]}
          alt={`${title} 이미지 ${currentIndex + 1}`}
          className="aspect-video w-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              aria-label="이전 이미지"
            >
              ◀
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              aria-label="다음 이미지"
            >
              ▶
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-neutral-900"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>
      )}
      {images.length > 1 && (
        <div className="text-center text-xs text-neutral-500">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

type TabKey =
  | "story"
  | "updates"
  | "community"
  | "supporters"
  | "refund"
  | "rewards"
  | "qna";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "story", label: "스토리" },
  { key: "updates", label: "새소식" },
  { key: "community", label: "커뮤니티" },
  { key: "supporters", label: "서포터" },
  { key: "refund", label: "환불 정책" },
  { key: "rewards", label: "리워드 정보" },
  { key: "qna", label: "Q&A" },
];

type MakerSummary = {
  id: string;
  name: string;
  avatarUrl?: string;
  followerCount: number;
  isFollowing?: boolean;
  contactEmail?: string;
};

// 한글 설명: 상세 응답 DTO에서 화면에 필요한 메이커 요약 정보를 추출한다.
const buildMakerSummary = (
  project: ProjectDetailResponseDTO
): MakerSummary => ({
  id: project.makerId,
  name: project.makerName ?? "메이커",
  avatarUrl: project.makerImageUrl ?? undefined,
  followerCount: 0,
  isFollowing: false,
  contactEmail: undefined,
});

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
}> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`border-b-2 px-0 pb-2 text-sm font-medium transition-colors ${
      active
        ? "border-neutral-900 text-neutral-900"
        : "border-transparent text-neutral-500 hover:text-neutral-900"
    }`}
  >
    {label}
  </button>
);

export const ProjectDetailPage: React.FC = () => {
  // 한글 설명: URL에서 프로젝트 id를 가져온다.
  const { id } = useParams();
  // 한글 설명: 다른 페이지로 이동하기 위한 네비게이터 훅.
  const navigate = useNavigate();
  // 한글 설명: 로그인 상태 확인
  const { user } = useAuthStore();
  // 한글 설명: 트래킹 훅 사용
  const { track } = useTracking();

  // 한글 설명: 현재 활성화된 탭 상태.
  const [activeTab, setActiveTab] = useState<TabKey>("story");
  // 한글 설명: 서버에서 받아온 프로젝트 상세 데이터를 보관하는 상태.
  const [project, setProject] = useState<ProjectDetailResponseDTO | null>(null);
  // 한글 설명: 로딩 중 여부 상태.
  const [loading, setLoading] = useState(false);
  // 한글 설명: 에러 메시지 상태.
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 프로젝트 상세 정보를 id 기준으로 호출한다.
  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setProject(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const projectId = id;
        if (!projectId) {
          setError("유효하지 않은 프로젝트 ID입니다.");
          return;
        }
        const detail = await fetchProjectDetail(projectId);
        // 한글 설명: 디버깅을 위해 프로젝트 상세 응답 데이터 로그 출력
        console.log("[ProjectDetailPage] 프로젝트 상세 응답:", detail);
        console.log("[ProjectDetailPage] makerId:", detail.makerId);
        console.log("[ProjectDetailPage] makerName:", detail.makerName);
        console.log("[ProjectDetailPage] isOwner:", detail.isOwner);
        setProject(detail);

        // 한글 설명: 프로젝트 상세 페이지 조회 이벤트 전송 (백엔드에서 자동으로 처리하지만, 프론트에서도 명시적으로 전송)
        const projectIdNum = parseInt(String(detail.id), 10);
        if (!isNaN(projectIdNum)) {
          track("PROJECT_VIEW", projectIdNum, {
            category: detail.category,
            status: detail.status,
          });
        }
      } catch (fetchError) {
        console.error("프로젝트 상세 조회 실패", fetchError);
        setError("프로젝트 정보를 불러오지 못했습니다.");
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    void loadProject();
  }, [id, track]);

  // 한글 설명: project가 변경될 때마다 캐러셀에 사용할 전체 이미지를 계산한다.
  const allImages = useMemo(() => {
    if (!project) return [];
    const images: string[] = [];
    if (project.coverImageUrl) {
      images.push(project.coverImageUrl);
    }
    if (project.coverGallery && Array.isArray(project.coverGallery)) {
      project.coverGallery.forEach((img: string) => {
        if (img && !images.includes(img)) {
          images.push(img);
        }
      });
    }
    return images;
  }, [project]);

  // 🔥 중요: 아래 Hook들도 무조건 호출되도록, early return보다 위에 둔다.

  // 한글 설명: project가 없을 때도 항상 기본 메이커 정보를 반환하여 훅 순서가 변하지 않게 한다.
  const makerSummary = useMemo<MakerSummary>(() => {
    if (!project) {
      return {
        id: "",
        name: "메이커",
        avatarUrl: undefined,
        followerCount: 0,
        isFollowing: false,
        contactEmail: undefined,
      };
    }
    return buildMakerSummary(project);
  }, [project]);

  // 한글 설명: 팔로우 여부와 팔로워 수 상태.
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  // 한글 설명: project / makerSummary가 바뀔 때마다 팔로우 상태와 팔로워 수를 동기화한다.
  useEffect(() => {
    if (!project) {
      // 프로젝트 없을 때는 기본값으로 초기화
      setIsFollowing(false);
      setFollowerCount(0);
      return;
    }
    setIsFollowing(makerSummary.isFollowing ?? false);
    setFollowerCount(makerSummary.followerCount);
  }, [project, makerSummary]);

  // 한글 설명: 메이커 아바타 이미지 URL을 계산한다.
  const makerAvatarSrc = makerSummary.avatarUrl
    ? (resolveImageUrl(makerSummary.avatarUrl) ?? makerSummary.avatarUrl)
    : undefined;

  // 한글 설명: 현재 사용자가 이 프로젝트의 소유자인지 확인
  // 백엔드에서 isOwner를 제공하지만, 프론트엔드에서도 추가로 검증
  // 한글 설명: userId, makerId, supporterId가 모두 동일하므로 user.id와 project.makerId를 직접 비교
  const isProjectOwner = useMemo(() => {
    if (!project || !user) return false;
    // 한글 설명: 백엔드에서 제공하는 isOwner 값 우선 사용
    if (project.isOwner !== undefined) {
      return project.isOwner;
    }
    // 한글 설명: 백엔드 값이 없으면 프론트엔드에서 user.id와 project.makerId 직접 비교
    if (!project.makerId) return false;
    // 한글 설명: userId와 makerId가 동일하므로 문자열로 변환하여 비교
    return String(user.id) === String(project.makerId);
  }, [project, user]);

  // 한글 설명: 팔로우 버튼 클릭 시, 메이커 팔로우/언팔로우 API 호출
  const handleToggleFollow = async () => {
    // 한글 설명: 자신의 프로젝트인 경우 팔로우 불가
    if (isProjectOwner) {
      return;
    }

    if (!user) {
      alert("팔로우 기능은 로그인 후 이용할 수 있습니다.");
      navigate("/login");
      return;
    }

    // 한글 설명: makerSummary.id가 없거나 빈 문자열인지 확인
    // project.makerId도 함께 확인하여 더 정확한 검증
    // 한글 설명: makerId가 숫자나 다른 타입일 수 있으므로 문자열로 변환
    const makerIdRaw = makerSummary.id || project?.makerId;
    const makerId = makerIdRaw ? String(makerIdRaw).trim() : "";
    if (!makerId) {
      console.error("메이커 ID가 없습니다:", {
        makerSummaryId: makerSummary.id,
        projectMakerId: project?.makerId,
      });
      alert("메이커 정보가 없습니다.");
      return;
    }

    // 한글 설명: 에러 발생 시 원복을 위해 이전 상태 저장
    const prevIsFollowing = isFollowing;
    const prevFollowerCount = followerCount;

    try {
      // 한글 설명: 낙관적 업데이트를 위해 먼저 로컬 상태를 변경
      setIsFollowing(!prevIsFollowing);
      setFollowerCount((prev) =>
        prevIsFollowing ? Math.max(prev - 1, 0) : prev + 1
      );

      // 한글 설명: API 호출 (백엔드는 ResponseEntity<Void>를 반환하므로 응답 본문 없음)
      // 한글 설명: makerId 변수 사용 (위에서 검증된 값)
      if (prevIsFollowing) {
        await makerService.unfollowMaker(makerId);
      } else {
        await makerService.followMaker(makerId);
      }
    } catch (error) {
      console.error("메이커 팔로우 상태 변경 실패", error);
      // 한글 설명: 에러 발생 시 상태를 원복
      setIsFollowing(prevIsFollowing);
      setFollowerCount(prevFollowerCount);
      alert(
        error instanceof Error
          ? error.message
          : "팔로우 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  // 한글 설명: 모금 진행률을 계산한다. project가 없으면 0으로 처리.
  const percentage = project
    ? progressPct(project.raised ?? 0, project.goalAmount ?? 0)
    : 0;

  // 한글 설명: 현재 로그인 유저 기준, 프로젝트 찜 여부 상태
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  // 한글 설명: 이 프로젝트를 찜한 전체 사용자 수
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);

  // 한글 설명: project 데이터가 로딩된 이후 북마크 상태를 초기화
  useEffect(() => {
    if (!project) return;
    // 한글 설명: 서버에서 내려준 값을 로컬 상태에 반영
    setIsBookmarked(project.bookmarked ?? false);
    setBookmarkCount(project.bookmarkCount ?? 0);
  }, [project]);

  // 한글 설명: 찜하기/찜해제 버튼 클릭 시 호출되는 핸들러
  const handleToggleBookmark = async () => {
    if (!project) return;

    const projectId = parseInt(String(project.id), 10);
    if (isNaN(projectId)) return;

    try {
      // 한글 설명: 낙관적 업데이트를 위해 먼저 로컬 상태를 바꾼다.
      if (isBookmarked) {
        setIsBookmarked(false);
        setBookmarkCount((prev) => Math.max(prev - 1, 0));
        // 한글 설명: 찜 해제 이벤트 전송
        track("PROJECT_UNBOOKMARK", projectId, {
          category: project.category,
        });
        const res = await unbookmarkProjectApi(projectId);
        // 한글 설명: 서버 응답 기준으로 다시 동기화
        setIsBookmarked(res.bookmarked);
        setBookmarkCount(res.bookmarkCount);
      } else {
        setIsBookmarked(true);
        setBookmarkCount((prev) => prev + 1);
        // 한글 설명: 찜하기 이벤트 전송
        track("PROJECT_BOOKMARK", projectId, {
          category: project.category,
        });
        const res = await bookmarkProjectApi(projectId);
        setIsBookmarked(res.bookmarked);
        setBookmarkCount(res.bookmarkCount);
      }
    } catch (error) {
      console.error("프로젝트 찜 상태 변경 실패", error);
      // 한글 설명: 에러 발생 시 상태를 원복한다.
      if (isBookmarked) {
        setIsBookmarked(true);
        setBookmarkCount((prev) => prev + 1);
      } else {
        setIsBookmarked(false);
        setBookmarkCount((prev) => Math.max(prev - 1, 0));
      }
      alert("찜하기 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  // ✅ 이 아래부터는 early return이지만,
  //    위에서 모든 훅이 이미 호출되었기 때문에 Hooks 규칙을 깨지 않는다.

  if (loading) {
    return (
      <Container>
        <div className="py-24 text-center text-sm text-neutral-500">
          프로젝트 정보를 불러오는 중입니다...
        </div>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <div className="py-24 text-center text-sm text-neutral-500">
          {error ?? "프로젝트를 찾을 수 없습니다."}
        </div>
      </Container>
    );
  }

  // 한글 설명: 현재 활성 탭에 따라 다른 콘텐츠를 렌더링하는 함수.
  const renderTabContent = () => {
    switch (activeTab) {
      case "story":
        return (
          <>
            {allImages.length > 0 && (
              <ImageCarousel images={allImages} title={project.title} />
            )}
            <div className="rounded-3xl border border-neutral-200 p-6">
              {/* 한글 설명: Toast UI Viewer를 사용하여 스토리 마크다운 표시 */}
              <StoryViewer
                markdown={project.storyMarkdown || ""}
                className="min-h-[200px]"
              />
            </div>
          </>
        );
      case "updates":
        return (
          <ProjectNewsSection
            projectId={parseInt(String(project.id), 10) || 0}
            isOwner={isProjectOwner}
          />
        );
      case "community":
        return (
          <div className="rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-500">
            커뮤니티 기능은 프로토타입 단계에서 비활성화되어 있습니다.
          </div>
        );
      case "supporters":
        return (
          <div className="rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-500">
            서포터 명단은 서비스 정식 오픈 시 공개됩니다.
          </div>
        );
      case "refund":
        return (
          <div className="rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-500">
            환불 및 교환 정책은 프로젝트 오너가 직접 등록한 정보를 기준으로
            적용됩니다. 세부 정책은 프로젝트 상세 하단에서 확인하실 수 있습니다.
          </div>
        );
      case "rewards":
        return (
          <ProjectRewardsTab
            projectId={parseInt(String(project.id), 10) || 0}
          />
        );
      case "qna":
        return (
          <div className="space-y-6">
            {/* 한글 설명: Q&A 섹션 컴포넌트 */}
            {/* 한글 설명: project.id는 string 타입이므로 number로 변환 */}
            {/* 한글 설명: 소유자인 경우 isOwner prop 전달하여 문의 작성 폼 숨김 */}
            <ProjectQnaSectionFixed
              projectId={parseInt(String(project.id), 10) || 0}
              isOwner={isProjectOwner}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <div className="space-y-12 py-16">
        <div className="space-y-6" id="project-tabs">
          <div className="flex flex-wrap justify-center gap-6 border-b border-neutral-200 pb-2 text-center">
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                label={tab.label}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="space-y-6">{renderTabContent()}</div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-neutral-200 p-6 text-left">
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                {project.category}
              </span>
              <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
                {project.title}
              </h1>
              <p className="mt-3 text-sm text-neutral-600">
                {project.summary || "프로젝트 요약 정보가 준비 중입니다."}
              </p>
              {/* 한글 설명: 태그 목록 표시 */}
              {project.tags && project.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              {/* 한글 설명: 프로젝트 기간 정보 표시 */}
              {(project.startDate || project.endDate) && (
                <div className="mt-4 text-xs text-neutral-500">
                  {project.startDate && (
                    <span>시작일: {project.startDate}</span>
                  )}
                  {project.startDate && project.endDate && " · "}
                  {project.endDate && <span>종료일: {project.endDate}</span>}
                </div>
              )}
              <div className="mt-6 space-y-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-neutral-600">
                    {currencyKRW(project.raised ?? 0)}
                  </span>
                  <span className="text-xs text-neutral-500">
                    목표 {currencyKRW(project.goalAmount ?? 0)}
                  </span>
                </div>
                <ProgressBar value={percentage} />
                <ul className="grid gap-2 text-xs text-neutral-500">
                  <li className="flex justify-between text-sm text-neutral-900">
                    <span>모인 금액</span>
                    <span>{currencyKRW(project.raised ?? 0)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>후원자 수</span>
                    <span>{(project.backerCount ?? 0).toLocaleString()}명</span>
                  </li>
                  <li className="flex justify-between">
                    <span>마감까지</span>
                    <span>D-{daysLeft(project.endDate)}</span>
                  </li>
                </ul>
              </div>

              {/* 한글 설명: 찜하기, 공유하기 버튼 */}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                    isBookmarked
                      ? "border-red-500 text-red-500 bg-red-50 hover:bg-red-100"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  }`}
                >
                  <svg
                    className="h-4 w-4"
                    fill={isBookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {/* 한글 설명: 찜 여부에 따라 텍스트를 다르게 표시 */}
                  {isBookmarked
                    ? `찜 취소하기 (${bookmarkCount}명)`
                    : `프로젝트 찜하기 (${bookmarkCount}명)`}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // 한글 설명: 공유하기 이벤트 전송
                    const projectId = parseInt(String(project.id), 10);
                    if (!isNaN(projectId)) {
                      track("PROJECT_SHARE", projectId, {
                        category: project.category,
                        shareMethod: "clipboard", // 클립보드 복사 방식
                      });
                    }

                    // 한글 설명: 현재 페이지 URL을 클립보드에 복사
                    const url = window.location.href;
                    navigator.clipboard
                      .writeText(url)
                      .then(() => {
                        alert("링크가 클립보드에 복사되었습니다.");
                      })
                      .catch(() => {
                        // 한글 설명: 클립보드 API가 실패하면 fallback으로 수동 복사
                        const textArea = document.createElement("textarea");
                        textArea.value = url;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textArea);
                        alert("링크가 클립보드에 복사되었습니다.");
                      });
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  공유하기
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-neutral-200 p-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-neutral-900">
                  후원하기
                </h2>
                <p className="text-sm text-neutral-500">
                  마음에 드는 리워드를 선택하고 응원 메시지를 남겨보세요.
                </p>
              </div>
              <button
                disabled={project.status !== "LIVE"}
                onClick={() => {
                  // 한글 설명: 후원하기 버튼 클릭 이벤트 전송
                  const projectId = parseInt(String(project.id), 10);
                  if (!isNaN(projectId)) {
                    track("PROJECT_PLEDGE_BUTTON_CLICK", projectId, {
                      category: project.category,
                      status: project.status,
                    });
                  }
                  navigate(`/projects/${project.id}/pledge`);
                }}
                className={`mt-6 w-full rounded-full border px-4 py-3 text-sm font-medium ${
                  project.status === "LIVE"
                    ? "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
                    : "border-neutral-200 text-neutral-400"
                }`}
              >
                바로 후원하기
              </button>
              {project.status !== "LIVE" && (
                <p className="mt-3 text-center text-xs text-neutral-400">
                  LIVE 상태에서만 후원할 수 있습니다.
                </p>
              )}
            </section>

            {project.rewards.length > 0 ? (
              <div className="space-y-4">
                {project.rewards.map((reward, index) => (
                  <RewardCard
                    key={reward.id ?? `${reward.title}-${index}`}
                    reward={reward}
                    onSelect={(rewardId) =>
                      navigate(
                        `/projects/${project.id}/pledge?reward=${rewardId}`
                      )
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-neutral-200 p-10 text-center text-sm text-neutral-500">
                준비된 리워드가 없습니다.
              </div>
            )}

            {/* ↓ 여기 Maker 섹션은 위와 거의 동일한데, 의도한 거면 두고,
                아니면 하나로 합쳐서 컴포넌트로 빼도 됨 */}
            <section className="rounded-3xl border border-neutral-200 p-6">
              <header className="relative flex items-center gap-4">
                {/* 한글 설명: 메이커 썸네일 클릭 시 메이커 페이지로 이동 */}
                <Link
                  to={`/makers/${makerSummary.id || project?.makerId || ""}`}
                  className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 transition hover:opacity-80"
                >
                  {makerAvatarSrc ? (
                    <img
                      src={makerAvatarSrc}
                      alt={`${makerSummary.name} 프로필 이미지`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                      이미지 없음
                    </div>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                    Maker
                  </p>
                  {/* 한글 설명: 메이커 이름 클릭 시 메이커 페이지로 이동 */}
                  <Link
                    to={`/makers/${makerSummary.id || project?.makerId || ""}`}
                    className="block truncate text-sm font-semibold text-neutral-900 transition hover:text-neutral-600"
                  >
                    {makerSummary.name}
                  </Link>
                  <p className="text-xs text-neutral-500">
                    팔로워 {followerCount.toLocaleString()}명
                  </p>
                </div>
                {/* 한글 설명: 자신의 프로젝트인 경우 팔로우 버튼 비활성화 */}
                {isProjectOwner ? (
                  <div className="absolute right-0 top-0 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium text-neutral-400">
                    내 프로젝트
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleToggleFollow}
                    className={`absolute right-0 top-0 rounded-full border px-3 py-1 text-[11px] font-medium transition ${
                      isFollowing
                        ? "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                    }`}
                  >
                    {isFollowing ? "팔로잉" : "팔로우"}
                  </button>
                )}
              </header>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    // 한글 설명: 문의하기 버튼 클릭 시 Q&A 탭으로 이동
                    setActiveTab("qna");
                    // 한글 설명: 탭 섹션으로 스크롤 (탭 높이에 맞춰 상단으로 이동)
                    setTimeout(() => {
                      const tabsSection =
                        document.getElementById("project-tabs");
                      if (tabsSection) {
                        // 한글 설명: 탭 섹션의 위치를 계산하여 스크롤
                        const tabsRect = tabsSection.getBoundingClientRect();
                        const scrollY = window.scrollY + tabsRect.top;
                        window.scrollTo({
                          top: scrollY,
                          behavior: "smooth",
                        });
                      }
                    }, 100);
                  }}
                  className="mt-3 w-full rounded-full border border-neutral-200 px-4 py-3 text-center text-sm font-medium text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900"
                >
                  문의하기
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </Container>
  );
};
