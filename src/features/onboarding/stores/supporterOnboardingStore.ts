// 한글 설명: 서포터 온보딩 상태 관리 Zustand 스토어
import { create } from "zustand";
import {
  getSupporterOnboardingStatus,
  saveSupporterOnboardingStep1,
  saveSupporterOnboardingStep2,
  skipSupporterOnboarding,
} from "../api/supporterOnboardingApi";
import type {
  SupporterOnboardingStatusResponse,
  SupporterOnboardingStep1Request,
  SupporterOnboardingStep2Request,
} from "../types/supporterOnboarding";

// 한글 설명: 서포터 온보딩 스토어 상태 인터페이스
interface SupporterOnboardingState {
  // 한글 설명: 온보딩 상태 정보
  status: SupporterOnboardingStatusResponse | null;
  // 한글 설명: 모달 열림 여부
  isModalOpen: boolean;
  // 한글 설명: 현재 단계 (1 또는 2)
  currentStep: 1 | 2;
  // 한글 설명: 상태 조회 중 여부
  isLoadingStatus: boolean;
  // 한글 설명: 제출 중 여부
  isSubmitting: boolean;

  // 한글 설명: 액션 함수들
  fetchStatus: () => Promise<void>;
  openIfNeeded: () => Promise<void>;
  goToStep: (step: 1 | 2) => void;
  submitStep1: (payload: SupporterOnboardingStep1Request) => Promise<void>;
  submitStep2: (payload: SupporterOnboardingStep2Request) => Promise<void>;
  skip: () => Promise<void>;
  closeModal: () => void;
}

// 한글 설명: 서포터 온보딩 스토어 생성
export const useSupporterOnboardingStore = create<SupporterOnboardingState>(
  (set, get) => ({
    // 한글 설명: 초기 상태
    status: null,
    isModalOpen: false,
    currentStep: 1,
    isLoadingStatus: false,
    isSubmitting: false,

    // 한글 설명: 온보딩 상태 조회
    fetchStatus: async () => {
      set({ isLoadingStatus: true });
      try {
        const status = await getSupporterOnboardingStatus();
        set({ status, isLoadingStatus: false });
      } catch (error) {
        console.error("온보딩 상태 조회 실패", error);
        set({ isLoadingStatus: false });
        throw error;
      }
    },

    // 한글 설명: 필요 시 모달 열기 (규칙에 따라 자동 판단)
    openIfNeeded: async () => {
      // 한글 설명: 먼저 상태 조회
      await get().fetchStatus();
      const { status } = get();

      if (!status) {
        return;
      }

      // 한글 설명: COMPLETED 또는 SKIPPED인 경우 모달을 열지 않음
      if (
        status.onboardingStatus === "COMPLETED" ||
        status.onboardingStatus === "SKIPPED"
      ) {
        return;
      }

      // 한글 설명: NOT_STARTED 또는 IN_PROGRESS인 경우
      if (
        status.onboardingStatus === "NOT_STARTED" ||
        status.onboardingStatus === "IN_PROGRESS"
      ) {
        // 한글 설명: step1Completed가 false면 Step1부터 시작
        if (!status.step1Completed) {
          set({ isModalOpen: true, currentStep: 1 });
        }
        // 한글 설명: step1Completed는 true지만 step2Completed가 false면 Step2부터 시작
        else if (!status.step2Completed) {
          set({ isModalOpen: true, currentStep: 2 });
        }
      }
    },

    // 한글 설명: 단계 이동
    goToStep: (step: 1 | 2) => {
      set({ currentStep: step });
    },

    // 한글 설명: Step1 제출
    submitStep1: async (payload: SupporterOnboardingStep1Request) => {
      set({ isSubmitting: true });
      try {
        await saveSupporterOnboardingStep1(payload);
        // 한글 설명: 성공 시 Step2로 이동하고 상태 업데이트
        const currentStatus = get().status;
        if (currentStatus) {
          set({
            status: {
              ...currentStatus,
              step1Completed: true,
              onboardingStatus: "IN_PROGRESS",
            },
            currentStep: 2,
            isSubmitting: false,
          });
        } else {
          set({ isSubmitting: false });
        }
      } catch (error) {
        console.error("Step1 제출 실패", error);
        set({ isSubmitting: false });
        throw error;
      }
    },

    // 한글 설명: Step2 제출 (온보딩 완료)
    submitStep2: async (payload: SupporterOnboardingStep2Request) => {
      set({ isSubmitting: true });
      try {
        await saveSupporterOnboardingStep2(payload);
        // 한글 설명: 성공 시 모달 닫고 상태를 COMPLETED로 업데이트
        const currentStatus = get().status;
        if (currentStatus) {
          set({
            status: {
              ...currentStatus,
              step2Completed: true,
              onboardingStatus: "COMPLETED",
            },
            isModalOpen: false,
            isSubmitting: false,
          });
        } else {
          set({ isModalOpen: false, isSubmitting: false });
        }
      } catch (error) {
        console.error("Step2 제출 실패", error);
        set({ isSubmitting: false });
        throw error;
      }
    },

    // 한글 설명: 온보딩 스킵
    skip: async () => {
      set({ isSubmitting: true });
      try {
        await skipSupporterOnboarding();
        // 한글 설명: 성공 시 모달 닫고 상태를 SKIPPED로 업데이트
        const currentStatus = get().status;
        if (currentStatus) {
          set({
            status: {
              ...currentStatus,
              onboardingStatus: "SKIPPED",
            },
            isModalOpen: false,
            isSubmitting: false,
          });
        } else {
          set({ isModalOpen: false, isSubmitting: false });
        }
      } catch (error) {
        console.error("온보딩 스킵 실패", error);
        set({ isModalOpen: false, isSubmitting: false });
        throw error;
      }
    },

    // 한글 설명: 모달 닫기 (수동)
    closeModal: () => {
      set({ isModalOpen: false });
    },
  })
);

