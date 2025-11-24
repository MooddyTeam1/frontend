import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { useQuery } from "../../shared/hooks/useQuery";
import { currencyKRW } from "../../shared/utils/format";
import { createOrder } from "../../services/api";
import { useAuthStore } from "../../features/auth/stores/authStore";
import { fetchProjectDetail } from "../../features/projects/api/myProjectsService";
import type { ProjectDetailResponseDTO } from "../../features/projects/types";
import { useSupporterStore } from "../../features/supporter/stores/supporterStore";

type Step = "reward" | "shipping" | "payment";

const steps: Array<{ key: Step; label: string }> = [
  { key: "reward", label: "리워드" },
  { key: "shipping", label: "배송" },
  { key: "payment", label: "결제" },
];

export const PledgePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useQuery();
  const { user } = useAuthStore();
  const getProfile = useSupporterStore((state) => state.getProfile);
  const fetchMyProfile = useSupporterStore((state) => state.fetchMyProfile);

  // 한글 설명: 프로젝트 상세 정보를 보관하는 상태
  const [project, setProject] = useState<ProjectDetailResponseDTO | null>(null);
  // 한글 설명: 프로젝트 로딩 중 여부 상태
  const [loadingProject, setLoadingProject] = useState(false);
  // 한글 설명: 프로젝트 로드 에러 상태
  const [projectError, setProjectError] = useState<string | null>(null);

  const [activeStep, setActiveStep] = useState<Step>("reward");
  const [rewardId, setRewardId] = useState<string | null>(query.get("reward"));
  const [quantity, setQuantity] = useState(1);
  // 한글 설명: 배송 정보 상태 (가이드 스펙에 맞춤)
  const [address, setAddress] = useState({
    receiverName: "", // 한글 설명: 수령인 이름
    receiverPhone: "", // 한글 설명: 수령인 전화번호
    addressLine1: "", // 한글 설명: 기본 주소
    addressLine2: "", // 한글 설명: 상세 주소 (선택)
    zipCode: "", // 한글 설명: 우편번호 (선택)
  });
  // 한글 설명: 배송 정보 입력 모드 (profile: 프로필 사용, new: 신규 입력)
  const [shippingMode, setShippingMode] = useState<"profile" | "new">(
    "profile"
  );
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [gateway, setGateway] = useState("toss");
  // 한글 설명: 공개여부 설정 (기본값: 모두 공개)
  const [isNamePublic, setIsNamePublic] = useState(true);
  const [isAmountPublic, setIsAmountPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 프로젝트 상세 정보를 id 기준으로 호출
  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setProject(null);
        return;
      }
      setLoadingProject(true);
      setProjectError(null);
      try {
        const projectId = parseInt(id, 10);
        if (isNaN(projectId)) {
          setProjectError("유효하지 않은 프로젝트 ID입니다.");
          return;
        }
        const detail = await fetchProjectDetail(projectId);
        setProject(detail);
      } catch (fetchError) {
        console.error("프로젝트 상세 조회 실패", fetchError);
        setProjectError("프로젝트 정보를 불러오지 못했습니다.");
        setProject(null);
      } finally {
        setLoadingProject(false);
      }
    };

    void loadProject();
  }, [id]);

  // 한글 설명: 서포터 프로필 정보 로드 및 배송 정보 자동 적용
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      try {
        setLoadingProfile(true);
        // 한글 설명: 먼저 캐시에서 프로필 확인
        let profile = getProfile(user.id);

        // 한글 설명: 캐시에 없으면 API에서 가져오기
        if (!profile) {
          profile = await fetchMyProfile();
        }

        // 한글 설명: 프로필에 주소 정보가 있으면 자동으로 적용
        if (profile && (profile.address1 || profile.phone)) {
          setShippingMode("profile");
          setAddress({
            receiverName: profile.displayName ?? "",
            receiverPhone: profile.phone ?? "",
            addressLine1: profile.address1 ?? "",
            addressLine2: profile.address2 ?? "",
            zipCode: profile.postalCode ?? "",
          });
        } else {
          // 한글 설명: 프로필 정보가 없으면 신규 입력 모드
          setShippingMode("new");
        }
      } catch (err) {
        console.error("서포터 프로필 조회 실패", err);
        // 한글 설명: 프로필 조회 실패 시 신규 입력 모드로 전환
        setShippingMode("new");
      } finally {
        setLoadingProfile(false);
      }
    };

    void loadProfile();
  }, [user?.id, getProfile, fetchMyProfile]);

  const reward = useMemo(
    () =>
      project?.rewards.find((item) => item.id === rewardId) ||
      project?.rewards[0],
    [project, rewardId]
  );

  const amount = reward ? reward.price * quantity : 0;

  // 한글 설명: 프로젝트 로딩 중일 때 표시
  if (loadingProject) {
    return (
      <Container>
        <div className="py-24 text-center text-sm text-neutral-500">
          프로젝트 정보를 불러오는 중입니다...
        </div>
      </Container>
    );
  }

  // 한글 설명: 프로젝트가 없거나 에러가 있을 때 표시
  if (!project || projectError) {
    return (
      <Container>
        <div className="py-24 text-center text-sm text-neutral-500">
          {projectError ?? "프로젝트를 찾을 수 없습니다."}
        </div>
      </Container>
    );
  }

  // 한글 설명: LIVE 상태가 아닌 프로젝트는 후원할 수 없음
  if (project.status !== "LIVE") {
    return (
      <Container>
        <div className="py-24 text-center text-sm text-neutral-500">
          <p className="mb-4">현재 이 프로젝트는 후원할 수 없습니다.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mx-auto max-w-4xl space-y-10 py-16">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Checkout
          </p>
          <h1 className="text-3xl font-semibold text-neutral-900">
            {project.title}
          </h1>
        </header>

        <div className="flex flex-wrap gap-3 text-sm">
          {steps.map((step) => (
            <button
              key={step.key}
              onClick={() => setActiveStep(step.key)}
              className={`rounded-full px-4 py-1 ${
                activeStep === step.key
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(240px,1fr)]">
          <div className="space-y-6">
            {activeStep === "reward" && (
              <section className="space-y-5 rounded-3xl border border-neutral-200 p-6">
                <h2 className="text-sm font-medium text-neutral-900">
                  리워드 선택
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {project.rewards.map((item) => (
                    <label
                      key={item.id}
                      className={`flex flex-col gap-2 rounded-2xl border p-4 text-sm transition ${
                        reward?.id === item.id
                          ? "border-neutral-900 bg-neutral-100"
                          : "border-neutral-200 hover:border-neutral-900"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reward"
                        className="hidden"
                        checked={reward?.id === item.id}
                        onChange={() => setRewardId(item.id)}
                      />
                      <div className="font-semibold text-neutral-900">
                        {item.title}
                      </div>
                      <div className="text-neutral-700">
                        {currencyKRW(item.price)}
                      </div>
                      {item.description ? (
                        <p className="text-xs text-neutral-500">
                          {item.description}
                        </p>
                      ) : null}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-500">수량</span>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(
                        Math.max(
                          1,
                          Number.parseInt(event.target.value || "1", 10)
                        )
                      )
                    }
                    className="w-20 rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-700"
                  />
                </div>

                {/* 한글 설명: 공개여부 선택 섹션 */}
                <div className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-neutral-900">
                      공개여부{" "}
                      <span className="text-xs text-neutral-500">(선택)</span>
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      서포터 목록에 서포터 이름과 결제 금액이 공개됩니다. 조용히
                      참여하고 싶으시다면, 비공개로 선택해 주세요.
                    </p>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      커뮤니티, 새소식 댓글 작성 시에는 비공개 여부와 상관없이
                      이름이 노출됩니다. 단 참여 라벨은 노출되지 않습니다.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm text-neutral-700">
                      <input
                        type="checkbox"
                        checked={isNamePublic}
                        onChange={(e) => setIsNamePublic(e.target.checked)}
                        className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                      />
                      <span>이름 공개</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-neutral-700">
                      <input
                        type="checkbox"
                        checked={isAmountPublic}
                        onChange={(e) => setIsAmountPublic(e.target.checked)}
                        className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                      />
                      <span>금액 공개</span>
                    </label>
                  </div>

                  {/* 한글 설명: 공개여부 예시 표시 */}
                  <div className="space-y-2 rounded-xl border border-neutral-200 bg-white p-3">
                    <p className="text-xs font-medium text-neutral-700">
                      {isNamePublic && isAmountPublic
                        ? "이름/금액 공개 예시"
                        : "이름/금액 비공개 예시"}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {isNamePublic && isAmountPublic ? (
                        <>
                          <span className="font-medium text-neutral-900">
                            홍길동
                          </span>
                          님이{" "}
                          <span className="font-medium text-neutral-900">
                            {currencyKRW(amount)}
                          </span>
                          원 참여하셨습니다.
                        </>
                      ) : isNamePublic && !isAmountPublic ? (
                        <>
                          <span className="font-medium text-neutral-900">
                            홍길동
                          </span>
                          님이 참여하셨습니다.
                        </>
                      ) : !isNamePublic && isAmountPublic ? (
                        <>
                          익명의 서포터님이{" "}
                          <span className="font-medium text-neutral-900">
                            {currencyKRW(amount)}
                          </span>
                          원 참여하셨습니다.
                        </>
                      ) : (
                        <>익명의 서포터님이 참여하셨습니다.</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setActiveStep("shipping")}
                    className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
                  >
                    다음: 배송 정보
                  </button>
                </div>
              </section>
            )}

            {activeStep === "shipping" && (
              <section className="space-y-4 rounded-3xl border border-neutral-200 p-6">
                <h2 className="text-sm font-medium text-neutral-900">
                  배송 정보
                </h2>

                {/* 한글 설명: 서포터 프로필 요약 정보 표시 */}
                {user?.id &&
                  (() => {
                    const profile = getProfile(user.id);
                    if (profile && shippingMode === "profile") {
                      return (
                        <div className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-medium text-neutral-700">
                              서포터 프로필 정보
                            </h3>
                            <button
                              type="button"
                              onClick={() => setShippingMode("new")}
                              className="text-xs text-neutral-500 hover:text-neutral-900"
                            >
                              신규 입력
                            </button>
                          </div>
                          <div className="space-y-2 text-xs text-neutral-600">
                            {profile.phone && (
                              <div className="flex items-center gap-2">
                                <span className="text-neutral-500">
                                  전화번호:
                                </span>
                                <span className="font-medium text-neutral-900">
                                  {profile.phone}
                                </span>
                              </div>
                            )}
                            {profile.address1 && (
                              <div className="flex items-start gap-2">
                                <span className="text-neutral-500">주소:</span>
                                <span className="font-medium text-neutral-900">
                                  {profile.address1}
                                  {profile.address2
                                    ? ` ${profile.address2}`
                                    : ""}
                                </span>
                              </div>
                            )}
                            {profile.postalCode && (
                              <div className="flex items-center gap-2">
                                <span className="text-neutral-500">
                                  우편번호:
                                </span>
                                <span className="font-medium text-neutral-900">
                                  {profile.postalCode}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                {/* 한글 설명: 신규 입력 모드일 때 프로필 불러오기 옵션 표시 */}
                {shippingMode === "new" &&
                  user?.id &&
                  (() => {
                    const profile = getProfile(user.id);
                    if (profile && (profile.address1 || profile.phone)) {
                      return (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              setLoadingProfile(true);
                              const updatedProfile = await fetchMyProfile();
                              if (updatedProfile) {
                                setShippingMode("profile");
                                setAddress({
                                  receiverName:
                                    updatedProfile.displayName ?? "",
                                  receiverPhone: updatedProfile.phone ?? "",
                                  addressLine1: updatedProfile.address1 ?? "",
                                  addressLine2: updatedProfile.address2 ?? "",
                                  zipCode: updatedProfile.postalCode ?? "",
                                });
                              }
                            } catch (err) {
                              console.error("프로필 불러오기 실패", err);
                              alert("프로필 정보를 불러오지 못했습니다.");
                            } finally {
                              setLoadingProfile(false);
                            }
                          }}
                          disabled={loadingProfile}
                          className="w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-50"
                        >
                          {loadingProfile
                            ? "불러오는 중..."
                            : "서포터 프로필 정보 불러오기"}
                        </button>
                      );
                    }
                    return null;
                  })()}

                {/* 한글 설명: 배송 정보 입력 폼 (가이드 스펙에 맞춤) */}
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-neutral-600">
                      수령인
                    </label>
                    <input
                      placeholder="수령인 이름"
                      value={address.receiverName}
                      onChange={(event) =>
                        setAddress((prev) => ({
                          ...prev,
                          receiverName: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-neutral-600">
                      연락처
                    </label>
                    <input
                      placeholder="전화번호"
                      value={address.receiverPhone}
                      onChange={(event) =>
                        setAddress((prev) => ({
                          ...prev,
                          receiverPhone: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-neutral-600">
                      기본 주소
                    </label>
                    <input
                      placeholder="배송 주소"
                      value={address.addressLine1}
                      onChange={(event) =>
                        setAddress((prev) => ({
                          ...prev,
                          addressLine1: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-neutral-600">
                      상세 주소 <span className="text-neutral-400">(선택)</span>
                    </label>
                    <input
                      placeholder="상세 주소 (동/호수 등)"
                      value={address.addressLine2}
                      onChange={(event) =>
                        setAddress((prev) => ({
                          ...prev,
                          addressLine2: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-neutral-600">
                      우편번호 <span className="text-neutral-400">(선택)</span>
                    </label>
                    <input
                      placeholder="우편번호"
                      value={address.zipCode}
                      onChange={(event) =>
                        setAddress((prev) => ({
                          ...prev,
                          zipCode: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* 한글 설명: 프로필 모드일 때 수정 가능 안내 */}
                {shippingMode === "profile" && (
                  <p className="text-xs text-neutral-500">
                    위 정보는 서포터 프로필에서 가져왔습니다. 필요시 직접
                    수정하거나 "신규 입력"을 선택하세요.
                  </p>
                )}

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep("reward")}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep("payment")}
                    disabled={
                      !address.receiverName.trim() ||
                      !address.receiverPhone.trim() ||
                      !address.addressLine1.trim()
                    }
                    className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white disabled:border-neutral-200 disabled:text-neutral-400"
                  >
                    다음: 결제
                  </button>
                </div>
              </section>
            )}

            {activeStep === "payment" && (
              <section className="space-y-4 rounded-3xl border border-neutral-200 p-6">
                <h2 className="text-sm font-medium text-neutral-900">
                  결제 수단
                </h2>
                <div className="flex flex-wrap gap-2">
                  {["toss"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setGateway(option)}
                      className={`rounded-full px-3 py-1 text-sm capitalize ${
                        gateway === option
                          ? "bg-neutral-900 text-white"
                          : "border border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                      }`}
                    >
                      {option === "toss" ? "토스페이먼츠" : option}
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500">
                  토스페이먼츠를 통해 안전하게 결제하세요. 샌드박스 모드로 실제
                  결제는 진행되지 않습니다.
                </div>
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                    {error}
                  </div>
                )}
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep("shipping")}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!user) {
                        alert("로그인이 필요합니다.");
                        navigate("/login");
                        return;
                      }

                      if (!reward) {
                        alert("리워드를 선택해주세요.");
                        return;
                      }

                      setLoading(true);
                      setError(null);

                      // 한글 설명: 배송 정보 검증
                      if (
                        !address.receiverName.trim() ||
                        !address.receiverPhone.trim() ||
                        !address.addressLine1.trim()
                      ) {
                        alert("배송 정보를 모두 입력해주세요.");
                        return;
                      }

                      try {
                        // 한글 설명: 1. 백엔드에 주문 생성 요청 (API 스펙에 맞춤)
                        // 주의: userId는 JWT 토큰에서 추출하므로 프론트엔드에서는 전달하지 않음
                        // API 스펙: POST /api/orders
                        // Authorization: Bearer {JWT 토큰}
                        const orderData = {
                          // 한글 설명: 프로젝트 ID (API 스펙: number 또는 string)
                          projectId: project.id,
                          // 한글 설명: 주문 항목 배열 (API 스펙에 맞춤)
                          items: [
                            {
                              rewardId: reward.id, // 한글 설명: 리워드 ID (API 스펙: number 또는 string)
                              quantity: quantity, // 한글 설명: 수량
                              note: null, // 한글 설명: 리워드별 메모 (예: "빨간색으로 부탁드립니다", null 가능)
                            },
                          ],
                          // 한글 설명: 배송 정보 (API 스펙에 맞춤)
                          receiverName: address.receiverName.trim(), // 한글 설명: 수령인 이름 (예: "김철수")
                          receiverPhone: address.receiverPhone.trim(), // 한글 설명: 수령인 전화번호 (예: "010-1234-5678")
                          addressLine1: address.addressLine1.trim(), // 한글 설명: 기본 주소 (예: "서울시 강남구 테헤란로 123")
                          addressLine2: address.addressLine2.trim() || null, // 한글 설명: 상세 주소 (예: "456호", null 가능)
                          zipCode: address.zipCode.trim() || null, // 한글 설명: 우편번호 (예: "12345", null 가능)
                          // 한글 설명: 공개여부 설정 (API 스펙에 포함되지 않을 수 있음)
                          isNamePublic,
                          isAmountPublic,
                        };

                        console.log("주문 생성 요청:", orderData);

                        // 한글 설명: 주문 생성 API 호출
                        // API 엔드포인트: POST /api/orders
                        // 요청 본문: orderData (CreateOrderRequestDTO)
                        const order = await createOrder(orderData);

                        console.log("✅ 주문 생성 완료:", order);
                        console.log("  - 주문 ID:", order.summary.orderId);
                        console.log("  - 주문 코드:", order.summary.orderCode);
                        console.log("  - 총 금액:", order.summary.totalAmount);
                        console.log("  - 주문 상태:", order.summary.status);

                        // 한글 설명: 2. 결제 페이지로 이동 (주문 정보 전달)
                        // 주의: 주문 정보를 location.state로 전달하여 PaymentPage에서 사용
                        // 옵션 1: 전체 주문 정보 전달 (주문 상세 조회 API 호출 불필요)
                        // 옵션 2: orderId만 전달 (주문 상세 조회 API 호출)
                        // 현재는 옵션 1을 사용하되, PaymentPage에서도 orderId로 재조회 가능하도록 지원
                        navigate("/payment", {
                          state: {
                            order, // 한글 설명: 전체 주문 정보 (바로 사용 가능)
                            orderId: order.summary.orderId, // 한글 설명: 주문 ID (재조회용)
                          },
                        });
                      } catch (err: any) {
                        console.error("❌ 주문 생성 실패:", err);

                        // 한글 설명: 에러 응답 처리
                        const errorMessage =
                          err.response?.data?.message ||
                          err.message ||
                          "주문 생성에 실패했습니다.";

                        setError(errorMessage);

                        // 한글 설명: 인증 에러인 경우 로그인 페이지로 이동
                        if (err.response?.status === 401) {
                          alert("로그인이 필요합니다.");
                          navigate("/login");
                          return;
                        }

                        // 한글 설명: 에러 알림
                        alert(errorMessage);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:text-neutral-500"
                  >
                    {loading ? "주문 생성 중..." : "결제하기"}
                  </button>
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4 rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-sm font-medium text-neutral-900">주문 요약</h2>
            <div className="space-y-2 text-sm text-neutral-600">
              <div className="flex items-center justify-between">
                <span>리워드</span>
                <span>{reward ? reward.title : "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>수량</span>
                <span>{quantity}</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-neutral-900">
                <span>결제 금액</span>
                <span>{currencyKRW(amount)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Container>
  );
};
