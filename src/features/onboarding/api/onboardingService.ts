// 한글 설명: 온보딩 API 서비스
import api from "../../../services/api";
import type {
  OnboardingStatusResponseDTO,
  OnboardingRequestDTO,
  OnboardingStatusUpdateRequestDTO,
} from "../types";

// 한글 설명: 온보딩 상태 조회
// GET /api/onboarding/status
export const getOnboardingStatus =
  async (): Promise<OnboardingStatusResponseDTO> => {
    console.log("[onboardingService] GET /api/onboarding/status 요청");
    const { data } = await api.get<OnboardingStatusResponseDTO>(
      "/api/onboarding/status"
    );
    console.log("[onboardingService] GET /api/onboarding/status 응답", data);
    return data;
  };

// 한글 설명: 온보딩 데이터 저장
// POST /api/onboarding
export const submitOnboarding = async (
  payload: OnboardingRequestDTO
): Promise<OnboardingStatusResponseDTO> => {
  console.log("[onboardingService] POST /api/onboarding 요청", payload);
  const { data } = await api.post<OnboardingStatusResponseDTO>(
    "/api/onboarding",
    payload
  );
  console.log("[onboardingService] POST /api/onboarding 응답", data);
  return data;
};

// 한글 설명: 온보딩 상태 업데이트 (SKIPPED_ONCE, DISMISSED)
// PATCH /api/onboarding/status
export const updateOnboardingStatus = async (
  status: "SKIPPED_ONCE" | "DISMISSED"
): Promise<OnboardingStatusResponseDTO> => {
  console.log("[onboardingService] PATCH /api/onboarding/status 요청", {
    status,
  });
  const payload: OnboardingStatusUpdateRequestDTO = { status };
  const { data } = await api.patch<OnboardingStatusResponseDTO>(
    "/api/onboarding/status",
    payload
  );
  console.log("[onboardingService] PATCH /api/onboarding/status 응답", data);
  return data;
};

