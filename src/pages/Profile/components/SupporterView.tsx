import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/stores/authStore";
import {
  useSupporterStore,
  type SupporterStoreState,
} from "../../../features/supporter/stores/supporterStore";
import { resolveImageUrl } from "../../../shared/utils/image";
import { toInterestName } from "../../../shared/utils/interestMapper";
import { daysLeft } from "../../../shared/utils/format";
import { SupporterOnboardingBanner } from "../../../features/onboarding/components/SupporterOnboardingBanner";
import { MyAllQnaList } from "../../../features/qna/components/MyAllQnaList";
import { getOrders } from "../../../services/api";

// 한글 설명: 서포터 탭 뷰. 서포터 프로필 정보, 최근 후원 내역, 관심 프로젝트 등을 보여준다.
export const SupporterView: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const mySupporterUrl = user?.id ? `/supporters/${user.id}` : undefined;
  const userId = user?.id;

  const profileSelector = React.useMemo(
    () => (state: SupporterStoreState) =>
      userId ? state.getProfile(userId) : null,
    [userId]
  );

  const profile = useSupporterStore(profileSelector);
  const loading = useSupporterStore((state) => state.loading);
  const error = useSupporterStore((state) => state.error);
  const fetchMyProfile = useSupporterStore((state) => state.fetchMyProfile);
  const lastRequestedUserRef = React.useRef<string | null>(null);

  // 한글 설명: 후원한 프로젝트 ID 목록 (Q&A 조회용)
  const [supportedProjectIds, setSupportedProjectIds] = React.useState<number[]>([]);
  const [loadingOrders, setLoadingOrders] = React.useState(false);

  React.useEffect(() => {
    if (!userId) {
      lastRequestedUserRef.current = null;
      return;
    }
    if (loading) return;
    if (lastRequestedUserRef.current === userId) return;

    lastRequestedUserRef.current = userId;
    fetchMyProfile().catch(() => {
      lastRequestedUserRef.current = null;
    });
  }, [userId, loading, fetchMyProfile]);

  // 한글 설명: 후원한 프로젝트 ID 목록 조회 (주문 목록에서 추출)
  React.useEffect(() => {
    const loadSupportedProjects = async () => {
      try {
        setLoadingOrders(true);
        // 한글 설명: 주문 목록 조회 (최대 100개)
        const orderData = await getOrders(0, 100);
        const orders = orderData?.content ?? [];
        
        // 한글 설명: 주문 목록에서 프로젝트 ID 추출 (중복 제거)
        const projectIds = orders
          .map((order) => order.projectId)
          .filter((id): id is number => id !== null && id !== undefined)
          .filter((id, index, self) => self.indexOf(id) === index); // 한글 설명: 중복 제거
        
        setSupportedProjectIds(projectIds);
      } catch (err) {
        console.error("후원한 프로젝트 목록 조회 실패:", err);
        setSupportedProjectIds([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadSupportedProjects();
  }, []);

  const profileImageSrc = profile?.imageUrl
    ? (resolveImageUrl(profile.imageUrl) ?? profile.imageUrl)
    : null;

  // 한글 설명: 주소 정보가 모두 있는지 확인
  const hasAddress = profile?.address1 && profile.address1.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* 한글 설명: 온보딩 배너 (상단에 표시) */}
      <SupporterOnboardingBanner />

      {/* 한글 설명: 프로필 정보 카드 */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-6">
        <div className="flex items-start gap-6">
          {/* 한글 설명: 프로필 이미지 */}
          <div className="shrink-0">
            {profileImageSrc ? (
              <img
                src={profileImageSrc}
                alt={profile?.displayName ?? "서포터 프로필 이미지"}
                className="h-20 w-20 rounded-full border-2 border-neutral-200 object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-neutral-100 border-2 border-neutral-200" />
            )}
          </div>

          {/* 한글 설명: 프로필 기본 정보 */}
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                {profile?.displayName ?? user?.name ?? "서포터"}
              </h2>
              {profile?.bio && (
                <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* 한글 설명: 관심사 */}
            {profile?.interests && profile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700"
                  >
                    {toInterestName(interest)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400">
                관심사가 설정되지 않았습니다.
              </p>
            )}

            {/* 한글 설명: 액션 버튼 */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {mySupporterUrl && (
                <Link
                  to={mySupporterUrl}
                  className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                >
                  프로필 보기
                </Link>
              )}
              <Link
                to="/settings/supporter"
                className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                프로필 수정
              </Link>
              <Link
                to="/settings/account"
                className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                계정 설정
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 한글 설명: 에러 메시지 */}
      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-red-900">
                서포터 정보를 불러오지 못했습니다
              </p>
              <p className="mt-1 text-xs text-red-700">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (userId) {
                  lastRequestedUserRef.current = userId;
                }
                fetchMyProfile().catch(() => {
                  lastRequestedUserRef.current = null;
                });
              }}
              className="rounded-full border border-red-300 bg-white px-4 py-2 text-xs font-medium text-red-700 transition hover:border-red-500 hover:bg-red-100"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 한글 설명: 배송지 정보 카드 */}
      {profile && hasAddress && (
        <section className="rounded-3xl border border-neutral-200 bg-white p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-neutral-900">
                기본 배송지
              </h3>
              <Link
                to="/settings/supporter"
                className="text-xs font-medium text-neutral-600 transition hover:text-neutral-900"
              >
                수정
              </Link>
            </div>

            <div className="space-y-2 rounded-xl bg-neutral-50 p-4">
              {profile.phone && (
                <div className="flex items-start gap-2">
                  <span className="text-xs font-medium text-neutral-500 shrink-0">
                    연락처
                  </span>
                  <span className="text-sm text-neutral-700">
                    {profile.phone}
                  </span>
                </div>
              )}
              {profile.postalCode && (
                <div className="flex items-start gap-2">
                  <span className="text-xs font-medium text-neutral-500 shrink-0">
                    우편번호
                  </span>
                  <span className="text-sm text-neutral-700">
                    {profile.postalCode}
                  </span>
                </div>
              )}
              {profile.address1 && (
                <div className="flex items-start gap-2">
                  <span className="text-xs font-medium text-neutral-500 shrink-0">
                    주소
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm text-neutral-700">
                      {profile.address1}
                    </p>
                    {profile.address2 && (
                      <p className="text-sm text-neutral-600">
                        {profile.address2}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 한글 설명: 최근 후원 내역 */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-neutral-900">
                최근 후원
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                후원한 프로젝트 내역을 확인할 수 있습니다.
              </p>
            </div>
            <Link
              to="/profile/supporter/orders"
              className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              더보기
            </Link>
          </div>

          {loading ? (
            <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
              <p className="text-sm text-neutral-500">
                서포터 정보를 불러오는 중입니다...
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
              <p className="text-sm text-neutral-500">
                아직 후원한 프로젝트가 없습니다.
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                프로젝트를 후원하면 여기에 표시됩니다.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 한글 설명: 내가 찜한 프로젝트 리스트 섹션 */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-neutral-900">
              내가 찜한 프로젝트
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              찜한 프로젝트가 여기에 표시됩니다.
            </p>
          </div>

          {profile?.bookmarkedProjects &&
          profile.bookmarkedProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {profile.bookmarkedProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {project.coverImageUrl && (
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-xs text-neutral-500">
                      {project.makerName}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-neutral-900">
                      {project.title}
                    </h3>
                    {project.summary && (
                      <p className="mt-2 line-clamp-2 text-xs text-neutral-500">
                        {project.summary}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
                      <span>{project.category}</span>
                      <span>D-{daysLeft(project.endDate)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
              <p className="text-sm text-neutral-500">
                아직 찜한 프로젝트가 없습니다. 마음에 드는 프로젝트를 찾아
                찜해보세요.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 한글 설명: 내가 작성한 모든 프로젝트의 문의사항 */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-neutral-900">
              내가 작성한 문의사항
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              후원한 모든 프로젝트에 남긴 문의사항을 한눈에 확인할 수 있습니다.
            </p>
          </div>

          {/* 한글 설명: 모든 프로젝트의 Q&A 목록 컴포넌트 */}
          {loadingOrders ? (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center">
              <p className="text-sm text-neutral-500">
                후원한 프로젝트를 불러오는 중...
              </p>
            </div>
          ) : (
            <MyAllQnaList projectIds={supportedProjectIds} />
          )}
        </div>
      </section>
    </div>
  );
};
