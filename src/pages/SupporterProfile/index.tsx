import React from "react";
import { useParams, Link } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { useAuth } from "../../features/auth/contexts/AuthContext";

type PublicSupporter = {
  userId: string;
  displayName: string;
  bio?: string;
  imageUrl?: string;
  followers: number;
  followingUsers: number;
  followingMakers: number;
};

export const SupporterPublicPage: React.FC = () => {
  // 한글 설명: 공개 서포터 프로필 페이지. 타 유저가 볼 수 있는 커뮤니티 프로필 뷰를 제공한다.
  const { userId = "" } = useParams();
  const { user } = useAuth();
  const isOwner = !!user && user.id === userId;

  // TODO: 실제 API로 교체. userId 기반 데이터 조회
  const [profile] = React.useState<PublicSupporter>({
    userId,
    displayName: "서포터 닉네임",
    bio: "안녕하세요. 다양한 테크/디자인 프로젝트를 응원하고 있어요!",
    imageUrl: "https://placehold.co/96x96",
    followers: 12,
    followingUsers: 8,
    followingMakers: 4,
  });

  return (
    <Container>
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col gap-8 py-16">
        {/* 헤더: 아바타/닉네임/바이오/팔로워 요약 */}
        <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={profile.imageUrl}
              alt={profile.displayName}
              className="h-20 w-20 rounded-full border border-neutral-200 object-cover"
            />
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">{profile.displayName}</h1>
              {profile.bio ? (
                <p className="mt-1 text-sm text-neutral-600">{profile.bio}</p>
              ) : null}
              <div className="mt-2 flex gap-3 text-xs text-neutral-500">
                <span>팔로워 {profile.followers.toLocaleString()}명</span>
                <span>팔로잉 유저 {profile.followingUsers.toLocaleString()}명</span>
                <span>팔로잉 메이커 {profile.followingMakers.toLocaleString()}팀</span>
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
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">찜한 프로젝트</h2>
            <span className="text-xs text-neutral-500">모두 보기</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-neutral-200 p-4">
                <div className="aspect-video w-full rounded-xl bg-neutral-100" />
                <p className="mt-3 line-clamp-2 text-sm font-medium text-neutral-900">관심 프로젝트 타이틀 {i + 1}</p>
                <p className="mt-1 text-xs text-neutral-500">카테고리 · 12,345원 모금</p>
              </div>
            ))}
          </div>
        </section>

        {/* 후원한 프로젝트 리스트 */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">후원한 프로젝트</h2>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4">
                <div className="h-14 w-20 rounded-lg bg-neutral-100" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">후원 프로젝트 타이틀 {i + 1}</p>
                  <p className="mt-1 text-xs text-neutral-500">후원일 2025-11-05 · 리워드 수량 1</p>
                </div>
                <button className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900">프로젝트 보기</button>
              </div>
            ))}
          </div>
        </section>

        {/* 팔로워 / 팔로잉 섹션 */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-sm font-semibold text-neutral-900">팔로워</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-3">
                  <div className="h-9 w-9 rounded-full bg-neutral-100" />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-neutral-900">user_{i + 1}</p>
                    <p className="text-[11px] text-neutral-500">팔로잉 {Math.floor(Math.random() * 50)}명</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-sm font-semibold text-neutral-900">팔로잉</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-3">
                  <div className="h-9 w-9 rounded-full bg-neutral-100" />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-neutral-900">friend_{i + 1}</p>
                    <p className="text-[11px] text-neutral-500">팔로워 {Math.floor(Math.random() * 100)}명</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 팔로잉 메이커 */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">팔로잉 메이커</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700">
                <span className="h-4 w-4 rounded-full bg-neutral-200" />
                maker_{i + 1}
              </span>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
};


