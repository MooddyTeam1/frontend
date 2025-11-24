import type {
  ProjectDetailResponseDTO,
  ProjectReviewStatus,
  ProjectId,
} from "../projects/types";

// 한글 설명: 관리자 프로젝트 심사 목록 항목 DTO (백엔드 CreateProjectResponse 대응)
export interface AdminProjectReviewDTO {
  projectId: ProjectId;
  maker: string; // 한글 설명: 메이커 이름
  title: string;
  requestAt: string; // 한글 설명: 심사 요청 시각
  reviewStatus: ProjectReviewStatus;
  rewardNames: string[];
  // 한글 설명: 하위 호환성을 위해 project 필드도 지원
  project?: ProjectId;
  projectReviewStatus?: ProjectReviewStatus;
  // 한글 설명: 심사 콘솔에서 사용하는 추가 필드
  id?: ProjectId; // 한글 설명: projectId와 동일 (하위 호환성)
  makerName?: string; // 한글 설명: maker와 동일 (하위 호환성)
  submittedAt?: string; // 한글 설명: requestAt과 동일 (하위 호환성)
  status?: string; // 한글 설명: 프로젝트 라이프사이클 상태 (DRAFT, SCHEDULED, LIVE, ENDED 등)
  startDate?: string; // 한글 설명: 프로젝트 시작일
  endDate?: string; // 한글 설명: 프로젝트 종료일
}

// 한글 설명: 관리자 프로젝트 상태 응답 DTO (백엔드 ProjectStatusResponse 대응)
export interface AdminProjectStatusResponseDTO {
  projectId: ProjectId;
  projectReviewStatus: ProjectReviewStatus;
}

// 한글 설명: 관리자 프로젝트 상세 응답 DTO (백엔드 ProjectDetailResponse 대응)
export type AdminProjectDetailDTO = ProjectDetailResponseDTO;

// 한글 설명: 관리자용 메이커 프로필 DTO (심사 시 필요한 모든 정보 포함)
export interface AdminMakerProfileDTO {
  id: string;
  ownerUserId: string;
  makerType: "INDIVIDUAL" | "BUSINESS";
  name: string;
  businessNumber?: string | null;
  businessName?: string | null;
  businessType?: string | null;
  onlineSalesReportNumber?: string | null;
  establishedAt?: string | null;
  industryType?: string | null;
  representative?: string | null;
  location?: string | null;
  productIntro?: string | null;
  coreCompetencies?: string | null;
  imageUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  techStack?: string[] | null;
  keywords?: number[] | null;
  createdAt?: string;
  updatedAt?: string;
}
