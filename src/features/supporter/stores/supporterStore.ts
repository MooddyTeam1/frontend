import { create } from "zustand";
import type { SupporterProfileDTO } from "../types";
import { supporterService } from "../api/supporterService";

export type SupporterStoreState = {
  profiles: Record<string, SupporterProfileDTO>; // userId -> profile
  loading: boolean;
  error: string | null;
  // Actions
  getProfile: (userId: string) => SupporterProfileDTO | null;
  setProfile: (userId: string, profile: SupporterProfileDTO) => void;
  updateProfileCache: (
    userId: string,
    updates: Partial<SupporterProfileDTO>
  ) => void;
  reset: () => void;
  fetchMyProfile: () => Promise<SupporterProfileDTO>;
  saveMyProfile: (
    updates: Partial<SupporterProfileDTO>
  ) => Promise<SupporterProfileDTO>;
};

// 한글 설명: 서포터 프로필을 관리하는 Zustand store. 백엔드 API와 연동하여 데이터를 동기화한다.
export const useSupporterStore = create<SupporterStoreState>((set, get) => ({
  profiles: {},
  loading: false,
  error: null,

  // 한글 설명: 특정 사용자의 프로필 조회
  getProfile: (userId: string) => {
    return get().profiles[userId] ?? null;
  },

  // 한글 설명: 프로필 전체 설정
  setProfile: (userId: string, profile: SupporterProfileDTO) => {
    set((state) => ({
      profiles: { ...state.profiles, [userId]: profile },
    }));
  },

  // 한글 설명: 프로필 부분 업데이트 (캐시용)
  updateProfileCache: (
    userId: string,
    updates: Partial<SupporterProfileDTO>
  ) => {
    const current = get().profiles[userId];
    if (!current) {
      const newProfile: SupporterProfileDTO = {
        userId,
        displayName: updates.displayName ?? null,
        bio: updates.bio ?? null,
        imageUrl: updates.imageUrl ?? null,
        interests: updates.interests ?? [],
        phone: updates.phone ?? null,
        address1: updates.address1 ?? null,
        address2: updates.address2 ?? null,
        postalCode: updates.postalCode ?? null,
        createdAt: updates.createdAt,
        updatedAt: updates.updatedAt,
      };
      get().setProfile(userId, newProfile);
      return;
    }

    const updated: SupporterProfileDTO = {
      ...current,
      ...updates,
    };

    get().setProfile(userId, updated);
  },

  // 한글 설명: 스토어 초기화 (로그아웃 시 사용)
  reset: () => {
    set({
      profiles: {},
      loading: false,
      error: null,
    });
  },

  // 한글 설명: 내 서포터 프로필 조회 후 스토어에 반영
  fetchMyProfile: async () => {
    set({ loading: true, error: null });
    try {
      const profile = await supporterService.getMyProfile();
      get().setProfile(profile.userId, profile);
      set({ loading: false });
      return profile;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "서포터 프로필 조회 중 오류가 발생했습니다.";
      set({ loading: false, error: message });
      throw error;
    }
  },

  // 한글 설명: 내 서포터 프로필을 업데이트하고 캐시를 갱신
  saveMyProfile: async (updates: Partial<SupporterProfileDTO>) => {
    set({ loading: true, error: null });
    try {
      const profile = await supporterService.updateMyProfile(updates);
      get().setProfile(profile.userId, profile);
      set({ loading: false });
      return profile;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "서포터 프로필 저장 중 오류가 발생했습니다.";
      set({ loading: false, error: message });
      throw error;
    }
  },
}));
