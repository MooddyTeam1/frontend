// 한글 설명: 서포터 온보딩 API 함수 모음
import api from "../../../services/api";
import type {
  SupporterOnboardingStatusResponse,
  SupporterOnboardingDataResponse,
  SupporterOnboardingStep1Request,
  SupporterOnboardingStep2Request,
} from "../types/supporterOnboarding";

// 한글 설명: 서포터 온보딩 상태 조회
// GET /api/supporter/onboarding/status
export const getSupporterOnboardingStatus =
  async (): Promise<SupporterOnboardingStatusResponse> => {
    console.log(
      "[supporterOnboardingApi] GET /api/supporter/onboarding/status 요청"
    );
    const { data } = await api.get<SupporterOnboardingStatusResponse>(
      "/api/supporter/onboarding/status"
    );
    console.log(
      "[supporterOnboardingApi] GET /api/supporter/onboarding/status 응답",
      data
    );
    return data;
  };

// 한글 설명: Step1 저장 (관심 카테고리 + 선호 스타일)
// POST /api/supporter/onboarding/step1
export const saveSupporterOnboardingStep1 = async (
  payload: SupporterOnboardingStep1Request
): Promise<void> => {
  console.log(
    "[supporterOnboardingApi] POST /api/supporter/onboarding/step1 요청",
    payload
  );
  await api.post("/api/supporter/onboarding/step1", payload);
  console.log(
    "[supporterOnboardingApi] POST /api/supporter/onboarding/step1 성공"
  );
};

// 한글 설명: Step2 저장 (추가 정보 + 알림 설정, 온보딩 완료)
// POST /api/supporter/onboarding/step2
export const saveSupporterOnboardingStep2 = async (
  payload: SupporterOnboardingStep2Request
): Promise<void> => {
  console.log(
    "[supporterOnboardingApi] POST /api/supporter/onboarding/step2 요청",
    payload
  );
  await api.post("/api/supporter/onboarding/step2", payload);
  console.log(
    "[supporterOnboardingApi] POST /api/supporter/onboarding/step2 성공"
  );
};

// 한글 설명: 온보딩 스킵 ("나중에 하기")
// POST /api/supporter/onboarding/skip
export const skipSupporterOnboarding = async (): Promise<void> => {
  console.log(
    "[supporterOnboardingApi] POST /api/supporter/onboarding/skip 요청"
  );
  await api.post("/api/supporter/onboarding/skip");
  console.log("[supporterOnboardingApi] POST /api/supporter/onboarding/skip 성공");
};

// 한글 설명: 서포터 온보딩 데이터 조회
// GET /api/supporter/onboarding
export const getSupporterOnboardingData =
  async (): Promise<SupporterOnboardingDataResponse> => {
    console.log(
      "[supporterOnboardingApi] GET /api/supporter/onboarding 요청"
    );
    const { data } = await api.get<SupporterOnboardingDataResponse>(
      "/api/supporter/onboarding"
    );
    console.log(
      "[supporterOnboardingApi] GET /api/supporter/onboarding 응답",
      data
    );
    return data;
  };

