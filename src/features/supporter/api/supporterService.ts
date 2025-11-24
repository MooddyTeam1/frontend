import { isAxiosError } from "axios";
import api from "../../../services/api";
import type { SupporterProfileDTO } from "../types";
import type { ProjectCardResponseDTO } from "../../projects/types";

type SupporterProfileResponse = {
  userId: string;
  displayName?: string | null;
  imageUrl?: string | null;
  bio?: string | null;
  interests?: unknown;
  phone?: string | null;
  address1?: string | null;
  address2?: string | null;
  postalCode?: string | null;
  defaultPhone?: string | null;
  defaultAddress1?: string | null;
  defaultAddress2?: string | null;
  defaultPostalCode?: string | null;
  createdAt?: string;
  updatedAt?: string;
  followingSupporterCount?: number;
  followingMakerCount?: number;
  followingSupporters?: unknown[];
  followingMakers?: unknown[];
  // 한글 설명: 내가 찜한 프로젝트 목록 (카드형 리스트에 사용할 데이터)
  bookmarkedProjects?: ProjectCardResponseDTO[];
};

type SupporterProfileUpdateRequest = Partial<{
  displayName: string | null;
  imageUrl: string | null;
  bio: string | null;
  interests: string[];
  phone: string | null;
  address1: string | null;
  address2: string | null;
  postalCode: string | null;
}>;

const SUPPORTER_ME_ENDPOINT = "/profile/me/suppoter";

// 한글 설명: 서버 응답을 프론트 도메인 모델로 변환
const normalizeSupporterProfile = (
  payload: SupporterProfileResponse
): SupporterProfileDTO => {
  const interestsRaw = Array.isArray(payload.interests)
    ? (payload.interests as Array<string | number | null | undefined>)
    : [];

  return {
    userId: payload.userId,
    displayName: payload.displayName ?? null,
    imageUrl: payload.imageUrl ?? null,
    bio: payload.bio ?? null,
    interests: interestsRaw
      .filter((item): item is string | number => item !== null && item !== undefined)
      .map((item) => String(item)),
    phone: payload.phone ?? payload.defaultPhone ?? null,
    address1: payload.address1 ?? payload.defaultAddress1 ?? null,
    address2: payload.address2 ?? payload.defaultAddress2 ?? null,
    postalCode:
      payload.postalCode ?? payload.defaultPostalCode ?? null,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
    // 한글 설명: 북마크된 프로젝트 목록 (서포터 프로필 DTO에 추가 필요)
    bookmarkedProjects: payload.bookmarkedProjects ?? [],
  };
};

const toReadableError = (error: unknown): Error => {
  if (isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message;
    return new Error(message ?? "서포터 프로필을 불러오지 못했습니다.");
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error("서포터 프로필 조회 중 알 수 없는 오류가 발생했습니다.");
};

const buildUpdatePayload = (
  updates: Partial<SupporterProfileDTO>
): SupporterProfileUpdateRequest => {
  const payload: SupporterProfileUpdateRequest = {};

  if ("displayName" in updates) {
    payload.displayName = updates.displayName ?? null;
  }
  if ("imageUrl" in updates) {
    payload.imageUrl = updates.imageUrl ?? null;
  }
  if ("bio" in updates) {
    payload.bio = updates.bio ?? null;
  }
  if ("interests" in updates && Array.isArray(updates.interests)) {
    payload.interests = updates.interests;
  }
  if ("phone" in updates) {
    payload.phone = updates.phone ?? null;
  }
  if ("address1" in updates) {
    payload.address1 = updates.address1 ?? null;
  }
  if ("address2" in updates) {
    payload.address2 = updates.address2 ?? null;
  }
  if ("postalCode" in updates) {
    payload.postalCode = updates.postalCode ?? null;
  }

  return payload;
};

// 한글 설명: 공개 서포터 프로필 응답 타입 (팔로워/팔로잉 정보 포함)
type PublicSupporterProfileResponse = SupporterProfileResponse & {
  followers?: number;
  followingUsers?: number;
  followingMakers?: number;
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

export const supporterService = {
  // 한글 설명: 로그인한 사용자의 서포터 프로필을 조회한다.
  getMyProfile: async (): Promise<SupporterProfileDTO> => {
    try {
      const { data } = await api.get<SupporterProfileResponse>(
        SUPPORTER_ME_ENDPOINT
      );
      console.log("[supporterService] GET /profile/me/suppoter 응답", data);
      return normalizeSupporterProfile(data);
    } catch (error) {
      throw toReadableError(error);
    }
  },

  // 한글 설명: 특정 사용자의 공개 서포터 프로필을 조회한다.
  // 한글 설명: GET /supporters/{userId} 엔드포인트 호출
  getPublicProfile: async (userId: string): Promise<PublicSupporterProfileResponse> => {
    try {
      console.log("[supporterService] GET /supporters/{userId} 요청", { userId });
      const { data } = await api.get<PublicSupporterProfileResponse>(
        `/supporters/${userId}`
      );
      console.log("[supporterService] GET /supporters/{userId} 응답", data);
      return data;
    } catch (error) {
      throw toReadableError(error);
    }
  },

  // 한글 설명: 로그인한 사용자의 서포터 프로필을 업데이트한다.
  updateMyProfile: async (
    updates: Partial<SupporterProfileDTO>
  ): Promise<SupporterProfileDTO> => {
    try {
      const payload = buildUpdatePayload(updates);
      console.log(
        "[supporterService] PATCH /profile/me/suppoter 요청 본문",
        payload
      );
      const { data } = await api.patch<SupporterProfileResponse>(
        SUPPORTER_ME_ENDPOINT,
        payload
      );
      console.log("[supporterService] PATCH /profile/me/suppoter 응답", data);
      return normalizeSupporterProfile(data);
    } catch (error) {
      throw toReadableError(error);
    }
  },
};

