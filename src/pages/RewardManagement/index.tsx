// 한글 설명: 리워드 관리 페이지 컴포넌트
import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { RewardOptionEditor } from "../../features/creator/components/RewardOptionEditor";
import {
  getMakerProjectDetail,
} from "../../features/maker/projectManagement/api/projectManagementService";
import type {
  RewardResponseDTO,
  RewardOptionConfigDTO,
} from "../../features/projects/types";
import {
  createDefaultRewardOptionConfig,
  type RewardFormState,
} from "../../features/creator/utils/rewardOptions";
import { currencyKRW } from "../../shared/utils/format";

export const RewardManagementPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [project, setProject] = React.useState<{
    id: number;
    title: string;
    rewards: RewardResponseDTO[];
  } | null>(null);
  const [rewards, setRewards] = React.useState<RewardResponseDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedRewardId, setSelectedRewardId] = React.useState<string | null>(
    null
  );
  const [editingReward, setEditingReward] =
    React.useState<RewardFormState | null>(null);

  // 한글 설명: 프로젝트 ID가 있으면 프로젝트 상세 정보 조회
  React.useEffect(() => {
    async function fetchProject() {
      if (!projectId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(
          "[RewardManagementPage] 프로젝트 상세 정보 조회 시작",
          { projectId }
        );
        const projectDetail = await getMakerProjectDetail(Number(projectId));
        console.log(
          "[RewardManagementPage] 프로젝트 상세 정보 조회 완료",
          projectDetail
        );
        console.log(
          "[RewardManagementPage] 리워드 개수:",
          projectDetail.rewards.length
        );

        setProject({
          id: projectDetail.id,
          title: projectDetail.title,
          rewards: [],
        });
        // 한글 설명: MakerProjectDetailDTO의 rewards는 간단한 구조이므로 RewardResponseDTO로 변환
        setRewards(
          projectDetail.rewards.map((r) => ({
            id: String(r.id), // 한글 설명: RewardId는 string 타입이므로 변환
            projectId: String(projectDetail.id), // 한글 설명: ProjectId는 string 타입이므로 변환
            title: r.title,
            description: null,
            price: r.price,
            limitQty: r.limitQty,
            remainingQty: null,
            estShippingMonth: null,
            available: r.available,
            optionConfig: null,
            displayOrder: 0,
          }))
        );
      } catch (error) {
        console.error("프로젝트 상세 조회 실패:", error);
        alert("프로젝트 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId]);

  // 한글 설명: 리워드 선택 시 편집 모드로 전환
  const handleSelectReward = (reward: RewardResponseDTO) => {
    setSelectedRewardId(reward.id);
    // 한글 설명: RewardOptionConfigDTO를 RewardOptionConfig로 변환
    const optionConfig = reward.optionConfig
      ? convertOptionConfigDTOToConfig(reward.optionConfig)
      : createDefaultRewardOptionConfig();
    setEditingReward({
      title: reward.title,
      price: reward.price,
      limitQty: reward.limitQty ?? undefined,
      estShippingMonth: reward.estShippingMonth ?? undefined,
      optionConfig,
    });
  };

  // 한글 설명: RewardOptionConfigDTO를 RewardOptionConfig로 변환하는 헬퍼 함수
  const convertOptionConfigDTOToConfig = (
    dto: RewardOptionConfigDTO | null
  ): ReturnType<typeof createDefaultRewardOptionConfig> => {
    if (!dto) {
      return createDefaultRewardOptionConfig();
    }
    // 한글 설명: DTO 구조가 Config 구조와 다를 수 있으므로 기본값 반환
    // 실제 변환 로직은 DTO 구조에 따라 구현 필요
    return createDefaultRewardOptionConfig();
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-neutral-500">로딩 중...</p>
        </div>
      </Container>
    );
  }

  if (!projectId) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-neutral-500">
            프로젝트 ID가 없습니다.
          </p>
          <Link
            to="/maker/projects"
            className="mt-4 rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
          >
            프로젝트 목록으로 돌아가기
          </Link>
        </div>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-neutral-500">
            프로젝트를 찾을 수 없습니다.
          </p>
          <Link
            to="/maker/projects"
            className="mt-4 rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
          >
            프로젝트 목록으로 돌아가기
          </Link>
        </div>
      </Container>
    );
  }

  const selectedReward = rewards.find((r) => r.id === selectedRewardId);

  return (
    <Container>
      <div className="space-y-8 py-16">
        {/* 한글 설명: 헤더 */}
        <header className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">
                리워드 관리
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                {project.title}
              </p>
            </div>
            <Link
              to={`/maker/projects/${project.id}`}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              프로젝트로 돌아가기
            </Link>
          </div>
          <p className="text-sm text-neutral-500">
            리워드 금액, 재고, 옵션 구성을 정리해 서포터에게 명확한 선택지를
            제공하세요.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 한글 설명: 리워드 목록 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                리워드 목록
              </h2>
              <button
                type="button"
                onClick={() => {
                  setSelectedRewardId(null);
                  setEditingReward({
                    title: "",
                    price: 0,
                    limitQty: undefined,
                    estShippingMonth: undefined,
                    optionConfig: createDefaultRewardOptionConfig(),
                  });
                }}
                className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
              >
                새 리워드 추가
              </button>
            </div>

            {rewards.length === 0 ? (
              <div className="py-10 text-center text-sm text-neutral-500">
                등록된 리워드가 없습니다.
              </div>
            ) : (
              <div className="space-y-2">
                {rewards.map((reward) => (
                  <button
                    key={reward.id}
                    type="button"
                    onClick={() => handleSelectReward(reward)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selectedRewardId === String(reward.id)
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-neutral-900">
                          {reward.title}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {currencyKRW(reward.price)}
                          {reward.limitQty && ` · ${reward.limitQty}개 한정`}
                          {!reward.available && " · 판매 중지"}
                        </p>
                      </div>
                      {selectedRewardId === String(reward.id) && (
                        <span className="ml-2 text-xs font-medium text-neutral-900">
                          편집 중
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* 한글 설명: 리워드 편집 폼 */}
          <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              {selectedReward ? "리워드 수정" : "새 리워드 추가"}
            </h2>

            {editingReward ? (
              <>
                <div className="space-y-4 text-sm text-neutral-700">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        className="text-xs font-medium text-neutral-500"
                        htmlFor="title"
                      >
                        리워드 이름
                      </label>
                      <input
                        id="title"
                        value={editingReward.title}
                        onChange={(event) =>
                          setEditingReward({
                            ...editingReward,
                            title: event.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                        placeholder="예: 얼리버드 패키지"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-xs font-medium text-neutral-500"
                        htmlFor="price"
                      >
                        금액 (원)
                      </label>
                      <input
                        id="price"
                        type="number"
                        value={editingReward.price || ""}
                        onChange={(event) =>
                          setEditingReward({
                            ...editingReward,
                            price: Number(event.target.value) || 0,
                          })
                        }
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                        placeholder="예: 49000"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        className="text-xs font-medium text-neutral-500"
                        htmlFor="limit"
                      >
                        제한 수량 (선택)
                      </label>
                      <input
                        id="limit"
                        type="number"
                        value={editingReward.limitQty ?? ""}
                        onChange={(event) =>
                          setEditingReward({
                            ...editingReward,
                            limitQty:
                              event.target.value === ""
                                ? undefined
                                : Number(event.target.value),
                          })
                        }
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                        placeholder="비워두면 무제한"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-xs font-medium text-neutral-500"
                        htmlFor="estShipping"
                      >
                        예상 배송 월
                      </label>
                      <input
                        id="estShipping"
                        type="month"
                        value={editingReward.estShippingMonth ?? ""}
                        onChange={(event) =>
                          setEditingReward({
                            ...editingReward,
                            estShippingMonth: event.target.value || undefined,
                          })
                        }
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                      />
                    </div>
                  </div>
                </div>

                <RewardOptionEditor
                  value={editingReward.optionConfig}
                  onChange={(optionConfig) =>
                    setEditingReward({ ...editingReward, optionConfig })
                  }
                />

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    className="flex-1 rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                  >
                    {selectedReward ? "저장" : "추가"}
                  </button>
                  {selectedReward && (
                    <button
                      type="button"
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="py-10 text-center text-sm text-neutral-500">
                {rewards.length === 0
                  ? "새 리워드를 추가하려면 '새 리워드 추가' 버튼을 클릭하세요."
                  : "수정할 리워드를 선택하세요."}
              </div>
            )}
          </section>
        </div>
      </div>
    </Container>
  );
};
