import React from "react";
import { useParams, Link } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { useAuthStore } from "../../features/auth/stores/authStore";
import { supporterService } from "../../features/supporter/api/supporterService";
import { ProjectCard } from "../../features/projects/components/ProjectCard";
import type { ProjectCardResponseDTO } from "../../features/projects/types";

// 한글 설명: 공개 서포터 프로필 타입
type PublicSupporterProfile = {
  userId: string;
  displayName: string | null;
  bio: string | null;
  imageUrl: string | null;
  followers: number;
  followingUsers: number;
  followingMakers: number;
  bookmarkedProjects?: ProjectCardResponseDTO[];
  supportedProjects?: ProjectCardResponseDTO[];
  followersList?: Array<{
    userId: string;
    displayName: string | null;
    imageUrl: string | null;
    followers: number;
  }>;
  followingList?: Array<{
    userId: string;
    displayName: string | null;
    imageUrl: string | null;
    followers: number;
  }>;
  followingMakersList?: Array<{
    makerId: string;
    name: string;
    imageUrl: string | null;
  }>;
};

export const SupporterPublicPage: React.FC = () => {
  // 한글 설명: 공개 서포터 프로필 페이지. 타 유저가 볼 수 있는 커뮤니티 프로필 뷰를 제공한다.
  const { userId = "" } = useParams<{ userId: string }>();
  const { user } = useAuthStore();
  const isOwner = !!user && user.id === userId;

  const [profile, setProfile] = React.useState<PublicSupporterProfile | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 한글 설명: 서포터 프로필 조회 (일단 내 프로필 API 사용, 나중에 공개 프로필 API로 교체 예정)
  React.useEffect(() => {
    if (!userId) {
      setError("사용자 ID가 없습니다.");
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        // 한글 설명: 일단 내 프로필 API 사용 (GET /profile/me/suppoter)
        // 한글 설명: 나중에 GET /supporters/{userId} 공개 프로필 API로 교체 예정
        const data = await supporterService.getMyProfile();

        setProfile({
          userId: data.userId,
          displayName: data.displayName ?? null,
          bio: data.bio ?? null,
          imageUrl: data.imageUrl ?? null,
          followers: 0, // 한글 설명: 내 프로필 API에는 팔로워 정보가 없음 (나중에 추가 예정)
          followingUsers: 0, // 한글 설명: 내 프로필 API에는 팔로잉 정보가 없음 (나중에 추가 예정)
          followingMakers: 0, // 한글 설명: 내 프로필 API에는 팔로잉 메이커 정보가 없음 (나중에 추가 예정)
          bookmarkedProjects: data.bookmarkedProjects ?? [],
          supportedProjects: [], // 한글 설명: 내 프로필 API에는 후원한 프로젝트 정보가 없음 (나중에 추가 예정)
          followersList: [], // 한글 설명: 내 프로필 API에는 팔로워 목록이 없음 (나중에 추가 예정)
          followingList: [], // 한글 설명: 내 프로필 API에는 팔로잉 목록이 없음 (나중에 추가 예정)
          followingMakersList: [], // 한글 설명: 내 프로필 API에는 팔로잉 메이커 목록이 없음 (나중에 추가 예정)
        });
      } catch (err) {
        console.error("서포터 프로필 조회 실패", err);
        setError("프로필을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <Container>
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center py-16">
          <p className="text-sm text-neutral-500">
            프로필을 불러오는 중입니다...
          </p>
        </div>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container>
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center py-16">
          <div className="text-center">
            <p className="text-sm text-neutral-500">
              {error ?? "프로필을 찾을 수 없습니다."}
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

  return (
    <Container>
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col gap-8 py-16">
        {/* 헤더: 아바타/닉네임/바이오/팔로워 요약 */}
        <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={profile.imageUrl || "https://placehold.co/96x96"}
              alt={profile.displayName || "서포터"}
              className="h-20 w-20 rounded-full border border-neutral-200 object-cover"
            />
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">
                {profile.displayName || "이름 없음"}
              </h1>
              {profile.bio ? (
                <p className="mt-1 text-sm text-neutral-600">{profile.bio}</p>
              ) : null}
              <div className="mt-2 flex gap-3 text-xs text-neutral-500">
                <span>팔로워 {profile.followers.toLocaleString()}명</span>
                <span>
                  팔로잉 유저 {profile.followingUsers.toLocaleString()}명
                </span>
                <span>
                  팔로잉 메이커 {profile.followingMakers.toLocaleString()}팀
                </span>
              </div>
            </div>
          </div>
          {isOwner ? (
            <div className="flex gap-2">
              {/* 한글 설명: 본인 프로필을 보는 경우에만 수정 버튼을 노출한다. */}
              <Link
                to="/settings/supporter"
                className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                프로필 수정
              </Link>
            </div>
          ) : null}
        </header>

        {/* 찜한 프로젝트 그리드 */}
        {profile.bookmarkedProjects &&
          profile.bookmarkedProjects.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-neutral-900">
                  찜한 프로젝트
                </h2>
                <span className="text-xs text-neutral-500">모두 보기</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {profile.bookmarkedProjects.slice(0, 6).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}

        {/* 후원한 프로젝트 리스트 */}
        {profile.supportedProjects && profile.supportedProjects.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-neutral-900">
              후원한 프로젝트
            </h2>
            <div className="space-y-3">
              {profile.supportedProjects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4"
                >
                  {project.coverImageUrl ? (
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="h-14 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-14 w-20 rounded-lg bg-neutral-100" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {project.title}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {project.category} ·{" "}
                      {project.raised?.toLocaleString() || 0}원 모금
                    </p>
                  </div>
                  <Link
                    to={`/projects/${project.id}`}
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  >
                    프로젝트 보기
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 팔로워 / 팔로잉 섹션 */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-sm font-semibold text-neutral-900">팔로워</h2>
            {profile.followersList && profile.followersList.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {profile.followersList.slice(0, 4).map((follower) => (
                  <Link
                    key={follower.userId}
                    to={`/supporters/${follower.userId}`}
                    className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-3 transition hover:border-neutral-900"
                  >
                    <img
                      src={follower.imageUrl || "https://placehold.co/36x36"}
                      alt={follower.displayName || "사용자"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-neutral-900">
                        {follower.displayName || "이름 없음"}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        팔로워 {follower.followers.toLocaleString()}명
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">팔로워가 없습니다.</p>
            )}
          </div>

          <div className="space-y-3 rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-sm font-semibold text-neutral-900">팔로잉</h2>
            {profile.followingList && profile.followingList.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {profile.followingList.slice(0, 4).map((following) => (
                  <Link
                    key={following.userId}
                    to={`/supporters/${following.userId}`}
                    className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-3 transition hover:border-neutral-900"
                  >
                    <img
                      src={following.imageUrl || "https://placehold.co/36x36"}
                      alt={following.displayName || "사용자"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-neutral-900">
                        {following.displayName || "이름 없음"}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        팔로워 {following.followers.toLocaleString()}명
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">
                팔로잉한 사용자가 없습니다.
              </p>
            )}
          </div>
        </section>

        {/* 팔로잉 메이커 */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">
            팔로잉 메이커
          </h2>
          {profile.followingMakersList &&
          profile.followingMakersList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.followingMakersList.map((maker) => {
                // 한글 설명: makerId에서 "maker-" 접두사 제거 (숫자만 사용)
                const makerIdForUrl = maker.makerId.startsWith("maker-")
                  ? maker.makerId.replace("maker-", "")
                  : maker.makerId;
                return (
                  <Link
                    key={maker.makerId}
                    to={`/makers/${makerIdForUrl}`}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                  >
                    {maker.imageUrl ? (
                      <img
                        src={maker.imageUrl}
                        alt={maker.name}
                        className="h-4 w-4 rounded-full object-cover"
                      />
                    ) : (
                      <span className="h-4 w-4 rounded-full bg-neutral-200" />
                    )}
                    {maker.name}
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-neutral-500">
              팔로잉한 메이커가 없습니다.
            </p>
          )}
        </section>
      </div>
    </Container>
  );
};
