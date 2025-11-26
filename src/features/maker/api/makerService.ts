// 한글 설명: 메이커 프로필 API 함수 모음
import { isAxiosError } from "axios";
import api from "../../../services/api";
import type {
  MakerDTO,
  MakerSettlementProfileDTO,
  MakerSettlementProfileUpdateRequest,
} from "../types";

// 한글 설명: 백엔드 API 응답 타입 (MakerProfileResponse)
// GET /profile/me/maker 응답은 평평한 구조로 받음
// 백엔드 스펙: MakerProfileResponse record (id: Long, establishedAt: LocalDate, createdAt/updatedAt: LocalDateTime)
type MakerProfileResponse = {
  id: number; // 한글 설명: 백엔드에서 Long 타입으로 오지만 JSON에서는 number로 변환됨
  makerType: "INDIVIDUAL" | "BUSINESS"; // 한글 설명: 개인 또는 사업자
  name: string;
  businessNumber: string | null;
  businessName: string | null;
  establishedAt: string | null; // yyyy-MM-dd (LocalDate)
  industryType: string | null;
  businessItem: string | null; // 한글 설명: 업태 (백엔드 필드명)
  onlineSalesRegistrationNo: string | null; // 한글 설명: 통신판매업 신고번호 (백엔드 필드명)
  representative: string | null;
  location: string | null;
  productIntro: string | null;
  coreCompetencies: string | null; // 한글 설명: coreCompentencies가 아니라 coreCompetencies
  imageUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  techStackJson: string | null; // 한글 설명: JSON 문자열 (예: "[\"React\",\"Node.js\",\"AWS\"]")
  keywords: string | null; // 한글 설명: 키워드 문자열 (예: "친환경,소셜임팩트,B2B")
  createdAt: string; // ISO 8601 형식 (LocalDateTime)
  updatedAt: string; // ISO 8601 형식 (LocalDateTime)
};

// 한글 설명: 공통 필드 폼 타입 (makerCommon)
export interface MakerCommonFormValues {
  name: string;
  establishedAt: string | null;
  industryType: string | null;
  representative: string | null;
  location: string | null;
  productIntro: string | null;
  coreCompetencies: string | null;
  imageUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  techStackJson: string | null; // 한글 설명: JSON 문자열로 저장
  keywords: string | null; // 한글 설명: 쉼표로 구분된 문자열
}

// 한글 설명: 사업자 전용 필드 폼 타입 (makerBusiness)
export interface MakerBusinessFormValues {
  businessName: string;
  businessNumber: string;
  businessItem: string | null; // 한글 설명: 업태
  onlineSalesRegistrationNo: string | null; // 한글 설명: 통신판매업 신고번호
}

// 한글 설명: 전체 메이커 프로필 폼 타입
export interface MakerProfileFormValues {
  makerType: "INDIVIDUAL" | "BUSINESS";
  makerCommon: MakerCommonFormValues;
  makerBusiness: MakerBusinessFormValues | null; // 한글 설명: 개인일 경우 null
}

// 한글 설명: 백엔드 API 요청 타입 (MakerProfileUpdateRequest)
// PATCH /profile/me/maker 요청은 중첩 구조로 보냄
type MakerProfileUpdateRequest = {
  makerType: "INDIVIDUAL" | "BUSINESS";
  makerCommon: {
    name: string;
    establishedAt: string | null;
    industryType: string | null;
    representative: string | null;
    location: string | null;
    productIntro: string | null;
    coreCompetencies: string | null;
    imageUrl: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    techStackJson: string | null;
    keywords: string | null;
  };
  makerBusiness: {
    businessName: string;
    businessNumber: string;
    businessItem: string | null;
    onlineSalesRegistrationNo: string | null;
  } | null;
};

const MAKER_ME_ENDPOINT = "/profile/me/maker";

// 한글 설명: 서버 응답(평평한 구조)을 프론트 도메인 모델로 변환
// 백엔드 응답은 평평하지만, 프론트에서는 MakerDTO로 유지 (하위 호환성)
const normalizeMakerProfile = (payload: MakerProfileResponse): MakerDTO => {
  // 한글 설명: techStackJson 문자열을 배열로 파싱
  let techStack: string[] = [];
  if (payload.techStackJson) {
    try {
      techStack = JSON.parse(payload.techStackJson);
    } catch (e) {
      console.warn("techStackJson 파싱 실패:", payload.techStackJson);
    }
  }

  // 한글 설명: keywords 문자열을 배열로 파싱 (쉼표로 구분)
  let keywords: number[] = [];
  if (payload.keywords) {
    // 한글 설명: 키워드는 현재 숫자 배열이지만, 백엔드에서는 문자열로 올 수 있음
    // 일단 문자열로 받고, 필요시 파싱 로직 추가
    // 현재는 keywords가 number[]로 정의되어 있으므로, 문자열이면 빈 배열로 처리
    keywords = [];
  }

  return {
    id: String(payload.id), // 한글 설명: 백엔드에서 number로 오지만 프론트에서는 string으로 사용
    ownerUserId: "", // 한글 설명: 응답에 없으면 빈 문자열 (필요시 수정)
    makerType: payload.makerType,
    name: payload.name,
    businessNumber: payload.businessNumber ?? null,
    businessName: payload.businessName ?? null,
    businessType: payload.businessItem ?? null, // 한글 설명: businessItem을 businessType으로 매핑
    onlineSalesReportNumber: payload.onlineSalesRegistrationNo ?? null, // 한글 설명: 필드명 매핑
    establishedAt: payload.establishedAt ?? null,
    industryType: payload.industryType ?? null,
    representative: payload.representative ?? null,
    location: payload.location ?? null,
    productIntro: payload.productIntro ?? null,
    coreCompetencies: payload.coreCompetencies ?? null,
    imageUrl: payload.imageUrl ?? null,
    contactEmail: payload.contactEmail ?? null,
    contactPhone: payload.contactPhone ?? null,
    techStack,
    keywords,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
  };
};

// 한글 설명: MakerDTO를 MakerProfileFormValues로 변환 (폼 초기값 생성)
export const makerDTOToFormValues = (
  maker: MakerDTO
): MakerProfileFormValues => {
  // 한글 설명: techStack 배열을 JSON 문자열로 변환
  const techStackJson =
    maker.techStack.length > 0 ? JSON.stringify(maker.techStack) : null;

  // 한글 설명: keywords 배열을 문자열로 변환 (현재는 숫자 배열이지만, 백엔드에서는 문자열)
  // 일단 null로 처리 (필요시 수정)
  const keywords = null;

  // 한글 설명: 공통 필드 구성
  const makerCommon: MakerCommonFormValues = {
    name: maker.name,
    establishedAt: maker.establishedAt,
    industryType: maker.industryType,
    representative: maker.representative,
    location: maker.location,
    productIntro: maker.productIntro,
    coreCompetencies: maker.coreCompetencies,
    imageUrl: maker.imageUrl,
    contactEmail: maker.contactEmail,
    contactPhone: maker.contactPhone,
    techStackJson,
    keywords,
  };

  // 한글 설명: 사업자 필드 구성 (사업자일 때만)
  const makerBusiness: MakerBusinessFormValues | null =
    maker.makerType === "BUSINESS"
      ? {
          businessName: maker.businessName ?? "",
          businessNumber: maker.businessNumber ?? "",
          businessItem: maker.businessType ?? null,
          onlineSalesRegistrationNo: maker.onlineSalesReportNumber ?? null,
        }
      : null;

  return {
    makerType: maker.makerType,
    makerCommon,
    makerBusiness,
  };
};

// 한글 설명: MakerProfileFormValues를 백엔드 요청 형식으로 변환
export const formValuesToUpdateRequest = (
  formValues: MakerProfileFormValues
): MakerProfileUpdateRequest => {
  return {
    makerType: formValues.makerType,
    makerCommon: {
      name: formValues.makerCommon.name,
      establishedAt: formValues.makerCommon.establishedAt,
      industryType: formValues.makerCommon.industryType,
      representative: formValues.makerCommon.representative,
      location: formValues.makerCommon.location,
      productIntro: formValues.makerCommon.productIntro,
      coreCompetencies: formValues.makerCommon.coreCompetencies,
      imageUrl: formValues.makerCommon.imageUrl,
      contactEmail: formValues.makerCommon.contactEmail,
      contactPhone: formValues.makerCommon.contactPhone,
      techStackJson: formValues.makerCommon.techStackJson,
      keywords: formValues.makerCommon.keywords,
    },
    // 한글 설명: 개인 메이커일 경우 null, 사업자일 경우 makerBusiness 객체
    makerBusiness:
      formValues.makerType === "BUSINESS" && formValues.makerBusiness
        ? {
            businessName: formValues.makerBusiness.businessName,
            businessNumber: formValues.makerBusiness.businessNumber,
            businessItem: formValues.makerBusiness.businessItem,
            onlineSalesRegistrationNo:
              formValues.makerBusiness.onlineSalesRegistrationNo,
          }
        : null,
  };
};

const toReadableError = (error: unknown): Error => {
  if (isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message;
    return new Error(message ?? "메이커 프로필을 불러오지 못했습니다.");
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error("메이커 프로필 조회 중 알 수 없는 오류가 발생했습니다.");
};

// 한글 설명: 메이커 팔로우 응답 타입 (현재 미사용)
// type MakerFollowResponse = {
//   makerId: string;
//   isFollowing: boolean;
//   followerCount: number;
// };

export const makerService = {
  // 한글 설명: 로그인한 사용자의 메이커 프로필을 조회한다.
  getMyProfile: async (): Promise<MakerDTO> => {
    try {
      const { data } = await api.get<MakerProfileResponse>(MAKER_ME_ENDPOINT);
      console.log("[makerService] GET /profile/me/maker 응답", data);
      return normalizeMakerProfile(data);
    } catch (error) {
      throw toReadableError(error);
    }
  },

  // 한글 설명: 로그인한 사용자의 메이커 프로필을 업데이트한다.
  // 한글 설명: 이전 버전 호환성을 위해 Partial<MakerDTO>도 받지만, 내부적으로는 formValues를 사용하는 것을 권장
  updateMyProfile: async (updates: Partial<MakerDTO>): Promise<MakerDTO> => {
    try {
      // 한글 설명: 기존 MakerDTO를 FormValues로 변환 후 요청 바디 생성
      // 한글 설명: TODO: 이 부분은 나중에 직접 MakerProfileFormValues를 받도록 리팩토링 권장
      const currentProfile = await makerService.getMyProfile();
      const formValues = makerDTOToFormValues({ ...currentProfile, ...updates });
      const payload = formValuesToUpdateRequest(formValues);

      console.log(
        "[makerService] PATCH /profile/me/maker 요청 본문",
        payload
      );
      const { data } = await api.patch<MakerProfileResponse>(
        MAKER_ME_ENDPOINT,
        payload
      );
      console.log("[makerService] PATCH /profile/me/maker 응답", data);
      return normalizeMakerProfile(data);
    } catch (error) {
      throw toReadableError(error);
    }
  },

  // 한글 설명: MakerProfileFormValues를 직접 받아서 업데이트 (새로운 방식)
  updateMyProfileFromForm: async (
    formValues: MakerProfileFormValues
  ): Promise<MakerDTO> => {
    try {
      const payload = formValuesToUpdateRequest(formValues);
      console.log(
        "[makerService] PATCH /profile/me/maker 요청 본문 (formValues)",
        payload
      );
      const { data } = await api.patch<MakerProfileResponse>(
        MAKER_ME_ENDPOINT,
        payload
      );
      console.log("[makerService] PATCH /profile/me/maker 응답", data);
      return normalizeMakerProfile(data);
    } catch (error) {
      throw toReadableError(error);
    }
  },

  // 한글 설명: 메이커 팔로우 API
  // 한글 설명: POST /api/supporter-follows/makers/{makerId} 엔드포인트 호출
  followMaker: async (makerId: string): Promise<void> => {
    try {
      console.log("[makerService] POST /api/supporter-follows/makers/{makerId} 요청", { makerId });
      await api.post(`/api/supporter-follows/makers/${makerId}`);
      console.log("[makerService] POST /api/supporter-follows/makers/{makerId} 응답 성공");
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string } | undefined)?.message;
        throw new Error(message ?? "메이커 팔로우에 실패했습니다.");
      }
      throw new Error("메이커 팔로우 중 알 수 없는 오류가 발생했습니다.");
    }
  },

  // 한글 설명: 메이커 언팔로우 API
  // 한글 설명: DELETE /api/supporter-follows/makers/{makerId} 엔드포인트 호출
  unfollowMaker: async (makerId: string): Promise<void> => {
    try {
      console.log("[makerService] DELETE /api/supporter-follows/makers/{makerId} 요청", { makerId });
      await api.delete(`/api/supporter-follows/makers/${makerId}`);
      console.log("[makerService] DELETE /api/supporter-follows/makers/{makerId} 응답 성공");
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string } | undefined)?.message;
        throw new Error(message ?? "메이커 언팔로우에 실패했습니다.");
      }
      throw new Error("메이커 언팔로우 중 알 수 없는 오류가 발생했습니다.");
    }
  },

  // 한글 설명: 공개 메이커 프로필 조회 API
  // 한글 설명: GET /public/makers/{makerId} 엔드포인트 호출
  getPublicProfile: async (makerId: string): Promise<any> => {
    try {
      console.log("[makerService] GET /public/makers/{makerId} 요청", { makerId });
      const { data } = await api.get(`/public/makers/${makerId}`);
      console.log("[makerService] GET /public/makers/{makerId} 응답", data);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string } | undefined)?.message;
        throw new Error(message ?? "메이커 프로필을 불러오지 못했습니다.");
      }
      throw new Error("메이커 프로필 조회 중 알 수 없는 오류가 발생했습니다.");
    }
  },

  // 한글 설명: 공개 메이커 프로젝트 목록 조회 API
  // 한글 설명: GET /public/makers/{makerId}/projects 엔드포인트 호출
  getPublicProjects: async (makerId: string, params?: {
    page?: number;
    size?: number;
    sort?: string;
    order?: "asc" | "desc";
  }): Promise<any> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", String(params.page));
      if (params?.size) queryParams.append("size", String(params.size));
      if (params?.sort) queryParams.append("sort", params.sort);
      if (params?.order) queryParams.append("order", params.order);

      const queryString = queryParams.toString();
      const url = `/public/makers/${makerId}/projects${queryString ? `?${queryString}` : ""}`;
      
      console.log("[makerService] GET /public/makers/{makerId}/projects 요청", { makerId, params });
      const { data } = await api.get(url);
      console.log("[makerService] GET /public/makers/{makerId}/projects 응답", data);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string } | undefined)?.message;
        throw new Error(message ?? "메이커 프로젝트 목록을 불러오지 못했습니다.");
      }
      throw new Error("메이커 프로젝트 목록 조회 중 알 수 없는 오류가 발생했습니다.");
    }
  },

  // 한글 설명: 로그인한 사용자의 정산 계좌 정보를 조회한다.
  // 한글 설명: GET /api/profile/me/maker/settlement 엔드포인트 호출
  getSettlementProfile: async (): Promise<MakerSettlementProfileDTO | null> => {
    try {
      console.log("[makerService] GET /api/profile/me/maker/settlement 요청");
      const { data } = await api.get<MakerSettlementProfileDTO>(
        "/api/profile/me/maker/settlement"
      );
      console.log("[makerService] GET /api/profile/me/maker/settlement 응답", data);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        // 한글 설명: 404 에러는 정산 계좌 정보가 없는 경우이므로 null 반환
        if (error.response?.status === 404) {
          console.log("[makerService] 정산 계좌 정보가 없습니다.");
          return null;
        }
        const message =
          (error.response?.data as { message?: string } | undefined)?.message;
        throw new Error(message ?? "정산 계좌 정보를 불러오지 못했습니다.");
      }
      throw new Error("정산 계좌 정보 조회 중 알 수 없는 오류가 발생했습니다.");
    }
  },

  // 한글 설명: 로그인한 사용자의 정산 계좌 정보를 생성 또는 업데이트한다.
  // 한글 설명: PUT /api/profile/me/maker/settlement 엔드포인트 호출
  updateSettlementProfile: async (
    updateRequest: MakerSettlementProfileUpdateRequest
  ): Promise<MakerSettlementProfileDTO> => {
    try {
      console.log(
        "[makerService] PUT /api/profile/me/maker/settlement 요청",
        updateRequest
      );
      const { data } = await api.put<MakerSettlementProfileDTO>(
        "/api/profile/me/maker/settlement",
        updateRequest
      );
      console.log("[makerService] PUT /api/profile/me/maker/settlement 응답", data);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string } | undefined)?.message;
        throw new Error(message ?? "정산 계좌 정보를 저장하지 못했습니다.");
      }
      throw new Error("정산 계좌 정보 저장 중 알 수 없는 오류가 발생했습니다.");
    }
  },
};

