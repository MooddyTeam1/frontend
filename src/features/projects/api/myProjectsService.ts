// 한글 설명: 메이커 전용 프로젝트 API 함수 모음. REST 엔드포인트와 DTO 매핑을 담당한다.
import api from "../../../services/api";
import type {
  CreateProjectRequestDTO,
  CreateRewardRequestDTO,
  CreateProjectRequestResponseDTO,
  ProjectDetailResponseDTO,
  ProjectId,
  ProjectLifecycleStatus,
  ProjectReviewStatus,
  ProjectStatus,
  RewardResponseDTO,
  RewardOptionConfigDTO,
  TempProjectRequestDTO,
  TempProjectResponseDTO,
  ProjectSummaryResponseDTO,
  ProjectBookmarkResponseDTO,
} from "../types";
import {
  toCategoryLabel,
  type CategoryEnum,
} from "../../../shared/utils/categorymapper";

// 한글 설명: API 응답의 리워드 타입 (실제 API 응답 구조)
type RewardApiResponse = {
  id: number | string;
  name?: string; // API 응답에는 name이 올 수 있음
  title?: string; // 또는 title이 올 수도 있음
  description?: string | null;
  price: number;
  estimatedDeliveryDate?: string | null; // API 응답에는 estimatedDeliveryDate가 올 수 있음
  estShippingMonth?: string | null; // 또는 estShippingMonth가 올 수도 있음
  stockQuantity?: number | null; // API 응답에는 stockQuantity가 올 수 있음
  limitQty?: number | null; // 또는 limitQty가 올 수도 있음
  remainingQty?: number | null;
  active?: boolean; // API 응답에는 active가 올 수 있음
  available?: boolean; // 또는 available이 올 수도 있음
  optionGroups?: Array<any>; // API 응답에는 optionGroups가 올 수 있음
  optionConfig?: RewardOptionConfigDTO | null; // 또는 optionConfig가 올 수도 있음
  displayOrder?: number;
  projectId?: ProjectId;
  rewardSets?: Array<any>;
  [key: string]: any; // 한글 설명: 기타 필드 허용
};

type ProjectDetailApiResponse = Omit<
  ProjectDetailResponseDTO,
  "category" | "status" | "rewards"
> & {
  category: CategoryEnum;
  bookmarked?: boolean;
  bookmarkCount?: number;
  // 한글 설명: API 응답에는 lifecycleStatus 또는 projectLifecycleStatus가 올 수 있음
  lifecycleStatus?: ProjectLifecycleStatus | string;
  projectLifecycleStatus?: ProjectLifecycleStatus | string;
  status?: ProjectStatus | string;
  // 한글 설명: API 응답의 rewards 배열
  rewards?: RewardApiResponse[];
};

type TempProjectApiResponse = Omit<TempProjectResponseDTO, "category"> & {
  category: CategoryEnum;
};

const mapTempProjectResponse = (
  raw: TempProjectApiResponse
): TempProjectResponseDTO => ({
  ...raw,
  category: toCategoryLabel(raw.category),
});

// 한글 설명: API 응답의 리워드를 프론트엔드 DTO로 변환
const mapRewardResponse = (raw: RewardApiResponse): RewardResponseDTO => {
  // 한글 설명: name 또는 title 중 하나를 사용 (API 응답에는 name이 올 수 있음)
  const title = raw.title ?? raw.name ?? "";
  
  // 한글 설명: estimatedDeliveryDate를 estShippingMonth로 변환
  // estimatedDeliveryDate는 "yyyy-mm-dd" 형식이므로 "yyyy-mm"으로 변환
  let estShippingMonth: string | null = raw.estShippingMonth ?? null;
  if (!estShippingMonth && raw.estimatedDeliveryDate) {
    const dateStr = raw.estimatedDeliveryDate;
    // 한글 설명: "yyyy-mm-dd" 형식을 "yyyy-mm"으로 변환
    if (dateStr && dateStr.length >= 7) {
      estShippingMonth = dateStr.substring(0, 7); // "yyyy-mm"
    }
  }
  
  // 한글 설명: stockQuantity를 limitQty로 변환
  const limitQty = raw.limitQty ?? raw.stockQuantity ?? null;
  
  // 한글 설명: active를 available로 변환
  const available = raw.available ?? raw.active ?? true;
  
  // 한글 설명: optionGroups를 optionConfig로 변환 (간단한 매핑)
  let optionConfig: RewardOptionConfigDTO | null = raw.optionConfig ?? null;
  if (!optionConfig && raw.optionGroups && Array.isArray(raw.optionGroups) && raw.optionGroups.length > 0) {
    // 한글 설명: optionGroups가 있으면 optionConfig로 변환 (필요시 더 세밀한 매핑 추가)
    optionConfig = {
      hasOptions: true,
      options: raw.optionGroups.map((group: any) => ({
        name: group.name || group.label || "옵션",
        type: group.type || "select",
        required: group.required ?? false,
        choices: group.choices || group.options || [],
      })),
    };
  }

  return {
    id: String(raw.id),
    projectId: raw.projectId ?? "",
    title,
    description: raw.description ?? null,
    price: raw.price ?? 0,
    limitQty,
    remainingQty: raw.remainingQty ?? limitQty, // 한글 설명: remainingQty가 없으면 limitQty 사용
    estShippingMonth,
    available,
    optionConfig,
    displayOrder: raw.displayOrder ?? 0,
  };
};

const mapProjectDetailResponse = (
  raw: ProjectDetailApiResponse
): ProjectDetailResponseDTO => {
  // 한글 설명: 디버깅을 위해 API 응답 데이터 로그 출력
  console.log("[mapProjectDetailResponse] 원본 API 응답:", raw);
  console.log("[mapProjectDetailResponse] makerId:", raw.makerId);
  console.log("[mapProjectDetailResponse] makerName:", raw.makerName);
  
  // 한글 설명: lifecycleStatus 또는 projectLifecycleStatus를 status로 변환
  // API 응답에는 lifecycleStatus가 오지만, DTO에는 status가 필요함
  const lifecycleStatus =
    raw.projectLifecycleStatus ?? raw.lifecycleStatus ?? raw.status ?? "DRAFT";
  
  // 한글 설명: ProjectLifecycleStatus를 ProjectStatus로 매핑
  // LIVE -> LIVE, SCHEDULED -> SCHEDULED, ENDED -> ENDED, DRAFT -> DRAFT 등
  const mappedStatus = lifecycleStatus as ProjectStatus;

  // 한글 설명: API 응답의 rewards 배열을 프론트엔드 DTO로 변환
  const rewards = (raw.rewards ?? []).map(mapRewardResponse);

  // 한글 설명: makerId가 없거나 빈 문자열인 경우 경고 로그 출력
  if (!raw.makerId || String(raw.makerId).trim() === "") {
    console.warn("[mapProjectDetailResponse] ⚠️ makerId가 없습니다!", {
      rawMakerId: raw.makerId,
      rawData: raw,
    });
  }

  return {
    ...raw,
    category: toCategoryLabel(raw.category),
    // 한글 설명: API 응답에 raised나 backerCount가 없을 수 있으므로 기본값 설정
    raised: raw.raised ?? 0,
    backerCount: raw.backerCount ?? 0,
    goalAmount: raw.goalAmount ?? 0,
    // 한글 설명: 북마크 관련 필드 기본값 설정
    bookmarked: raw.bookmarked ?? false,
    bookmarkCount: raw.bookmarkCount ?? 0,
    // 한글 설명: lifecycleStatus를 status로 매핑
    status: mappedStatus,
    // 한글 설명: rewards 배열 매핑
    rewards,
    // 한글 설명: makerId가 없으면 빈 문자열로 설정 (타입 안정성을 위해)
    makerId: raw.makerId ?? "",
  };
};

// 한글 설명: 상태 필터 파라미터 인터페이스 (라이프사이클 + 심사 기준)
export interface StatusFilterParams {
  lifecycle?: ProjectLifecycleStatus;
  review?: ProjectReviewStatus;
}

// 한글 설명: 내 프로젝트 상태 요약 조회
export const fetchProjectSummary = async (): Promise<ProjectSummaryResponseDTO> => {
  console.log("[myProjectsService] GET /project/summary 요청");
  const { data } = await api.get<ProjectSummaryResponseDTO>("/project/summary");
  console.log("[myProjectsService] GET /project/summary 응답", data);
  return data;
};

// 한글 설명: 백엔드 API 응답 타입 (실제 응답 구조에 맞춤)
type MyProjectStatusItemApiResponse = {
  projectId: ProjectId;
  maker: string;
  title: string;
  summary?: string;
  storyMarkdown?: string;
  coverImageUrl?: string | null;
  lifecycleStatus?: ProjectLifecycleStatus | string;
  reviewStatus?: ProjectReviewStatus | string;
  projectLifecycleStatus?: ProjectLifecycleStatus | string;
  projectReviewStatus?: ProjectReviewStatus | string;
  [key: string]: any; // 한글 설명: 기타 필드 허용
};

// 한글 설명: MyProjectStatusItemDTO 타입 정의 (내부에서만 사용)
type MyProjectStatusItemDTO = {
  id: string;
  projectId: string;
  title: string;
  summary?: string | null;
  imgUrl?: string | null;
  projectLifecycleStatus?: string;
  projectReviewStatus?: string;
};

// 한글 설명: API 응답을 프론트엔드 DTO로 변환
const mapMyProjectStatusItem = (
  raw: MyProjectStatusItemApiResponse
): MyProjectStatusItemDTO => {
  const rawId = raw.projectId ?? "";
  const canonicalId = String(rawId) as ProjectId;
  
  // 한글 설명: lifecycleStatus와 projectLifecycleStatus 중 하나를 사용
  const lifecycleStatus =
    raw.projectLifecycleStatus ?? raw.lifecycleStatus ?? "DRAFT";
  // 한글 설명: reviewStatus와 projectReviewStatus 중 하나를 사용
  const reviewStatus =
    raw.projectReviewStatus ?? raw.reviewStatus ?? "NONE";

  return {
    id: canonicalId,
    projectId: raw.projectId,
    title: raw.title,
    summary: raw.summary,
    imgUrl: raw.coverImageUrl ?? null, // 한글 설명: coverImageUrl을 imgUrl로 매핑
    projectLifecycleStatus: lifecycleStatus as ProjectLifecycleStatus,
    projectReviewStatus: reviewStatus as ProjectReviewStatus,
  };
};

// 한글 설명: 상태 기준 내 프로젝트 조회 (라이프사이클/심사 상태 필터)
export const fetchMyProjectsByStatus = async (
  params: StatusFilterParams
): Promise<MyProjectStatusItemDTO[]> => {
  const { lifecycle, review } = params;
  console.log("[myProjectsService] GET /project/me/status 요청 파라미터", {
    lifecycle,
    review,
  });
  const { data } = await api.get<MyProjectStatusItemApiResponse[]>(
    "/project/me/status",
    {
      params: {
        lifecycle,
        review,
      },
    }
  );
  console.log("[myProjectsService] GET /project/me/status 응답", data);
  // 한글 설명: API 응답을 프론트엔드 DTO로 변환
  return data.map(mapMyProjectStatusItem);
};

// ─────────────────────────
// 백엔드 API 전송용 타입 정의 (백엔드 스펙에 맞춤)
// ─────────────────────────

// 한글 설명: 백엔드 RewardRequest 타입 (백엔드 스펙)
interface BackendRewardRequest {
  name: string; // 한글 설명: 리워드 이름 (프론트엔드의 title)
  description: string; // 한글 설명: 리워드 설명
  price: number; // 한글 설명: 필수, @Positive
  stockQuantity?: number; // 한글 설명: 선택, @Positive (프론트엔드의 limitQty)
  estimatedDeliveryDate?: string; // 한글 설명: 선택, YYYY-MM-DD 형식 (프론트엔드의 estShippingMonth)
  active?: boolean; // 한글 설명: 기본값: true (프론트엔드의 available)
  optionGroups?: any[]; // 한글 설명: 선택 (프론트엔드의 optionConfig)
  rewardSets?: any[]; // 한글 설명: 선택
  disclosure?: any; // 한글 설명: 선택 (프론트엔드의 disclosure)
}

// 한글 설명: 백엔드 CreateProjectRequest 타입 (백엔드 스펙)
interface BackendCreateProjectRequest {
  title: string;
  summary: string;
  storyMarkdown?: string;
  goalAmount: number;
  startDate: string; // 한글 설명: 필수, YYYY-MM-DD 형식
  endDate: string; // 한글 설명: 필수, YYYY-MM-DD 형식
  category: string;
  coverImageUrl: string;
  coverGallery?: string[]; // 한글 설명: 선택, 최대 6개
  tags?: string[]; // 한글 설명: 선택, 최대 6개
  rewardRequests: BackendRewardRequest[]; // 한글 설명: ⚠️ 필수, @NotEmpty (최소 1개 이상)
}

// ─────────────────────────
// 프론트엔드 DTO → 백엔드 DTO 변환 함수
// ─────────────────────────

// 한글 설명: 프론트엔드 리워드 DTO를 백엔드 리워드 DTO로 변환
const mapRewardToBackend = (
  reward: CreateRewardRequestDTO
): BackendRewardRequest => {
  // 한글 설명: estShippingMonth (yyyy-mm)를 estimatedDeliveryDate (yyyy-mm-dd)로 변환
  // 백엔드는 YYYY-MM-DD 형식을 기대하므로, yyyy-mm 형식이면 -01을 추가
  let estimatedDeliveryDate: string | undefined = undefined;
  if (reward.estShippingMonth) {
    const monthStr = reward.estShippingMonth.trim();
    // 한글 설명: yyyy-mm 형식이면 -01을 추가하여 yyyy-mm-dd로 변환
    if (monthStr.match(/^\d{4}-\d{2}$/)) {
      estimatedDeliveryDate = `${monthStr}-01`;
    } else if (monthStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // 한글 설명: 이미 yyyy-mm-dd 형식이면 그대로 사용
      estimatedDeliveryDate = monthStr;
    }
  }

  // 한글 설명: optionConfig를 optionGroups로 변환 (간단한 매핑)
  let optionGroups: any[] | undefined = undefined;
  if (reward.optionConfig && reward.optionConfig.hasOptions && reward.optionConfig.options) {
    optionGroups = reward.optionConfig.options.map((opt) => ({
      name: opt.name,
      type: opt.type,
      required: opt.required ?? false,
      choices: opt.choices || [],
    }));
  }

  return {
    name: reward.title.trim(), // 한글 설명: title → name
    description: reward.description?.trim() || "", // 한글 설명: description은 필수
    price: reward.price, // 한글 설명: 필수, @Positive
    stockQuantity: reward.limitQty, // 한글 설명: limitQty → stockQuantity
    estimatedDeliveryDate, // 한글 설명: estShippingMonth → estimatedDeliveryDate
    active: reward.available ?? true, // 한글 설명: available → active (기본값: true)
    optionGroups, // 한글 설명: optionConfig → optionGroups
    rewardSets: undefined, // 한글 설명: 프론트엔드에서는 사용하지 않음
    disclosure: reward.disclosure, // 한글 설명: disclosure는 그대로 전달
  };
};

// 한글 설명: 프론트엔드 프로젝트 생성 요청 DTO를 백엔드 DTO로 변환
const mapCreateProjectRequestToBackend = (
  payload: CreateProjectRequestDTO
): BackendCreateProjectRequest => {
  // 한글 설명: rewardRequests 검증 - 최소 1개 이상 필요
  if (!payload.rewards || payload.rewards.length === 0) {
    throw new Error("최소 1개 이상의 리워드가 필요합니다.");
  }

  return {
    title: payload.title.trim(),
    summary: payload.summary.trim(),
    storyMarkdown: payload.storyMarkdown || undefined,
    goalAmount: payload.goalAmount,
    startDate: payload.startDate || "", // 한글 설명: 백엔드는 필수이므로 빈 문자열 전송
    endDate: payload.endDate, // 한글 설명: 필수
    category: payload.category,
    coverImageUrl: payload.coverImageUrl || "", // 한글 설명: 백엔드는 필수이므로 빈 문자열 전송
    coverGallery: payload.coverGallery,
    tags: payload.tags,
    rewardRequests: payload.rewards.map(mapRewardToBackend), // 한글 설명: rewards → rewardRequests
  };
};

// 한글 설명: 프로젝트 생성 심사 요청 제출 (projectId가 존재하면 쿼리 파라미터로 전달)
export const requestProjectCreation = async (
  payload: CreateProjectRequestDTO,
  projectId?: ProjectId
): Promise<CreateProjectRequestResponseDTO> => {
  // 한글 설명: 클라이언트 측 검증 - 리워드가 최소 1개 이상인지 확인
  if (!payload.rewards || payload.rewards.length === 0) {
    throw new Error("최소 1개 이상의 리워드가 필요합니다.");
  }

  // 한글 설명: 프론트엔드 DTO를 백엔드 DTO로 변환
  const backendPayload = mapCreateProjectRequestToBackend(payload);

  const url = projectId
    ? `/project/request?projectId=${projectId}`
    : "/project/request";
  console.log("[myProjectsService] POST /project/request 요청 본문 (백엔드 형식)", {
    projectId,
    payload: backendPayload,
  });
  
  try {
    const { data } = await api.post<CreateProjectRequestResponseDTO>(url, backendPayload);
    console.log("[myProjectsService] POST /project/request 응답", data);
    return data;
  } catch (error: any) {
    // 한글 설명: 검증 에러 처리 (400 Bad Request)
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || "입력값이 올바르지 않습니다.";
      throw new Error(errorMessage);
    }
    // 한글 설명: 기타 에러 처리
    throw error;
  }
};

// 한글 설명: 초안 프로젝트 최초 임시 저장
export const saveProjectTemp = async (
  payload: TempProjectRequestDTO
): Promise<TempProjectResponseDTO> => {
  console.log("[myProjectsService] POST /project/temp 요청 본문", payload);
  const { data } = await api.post<TempProjectApiResponse>(
    "/project/temp",
    payload
  );
  console.log("[myProjectsService] POST /project/temp 응답", data);
  return mapTempProjectResponse(data);
};

// 한글 설명: 임시 저장 프로젝트 정보 업데이트 (부분 수정)
export const updateProjectTemp = async (
  projectId: ProjectId,
  payload: TempProjectRequestDTO
): Promise<TempProjectResponseDTO> => {
  console.log("[myProjectsService] PATCH /project/temp/{projectId} 요청", {
    projectId,
    payload,
  });
  const { data } = await api.patch<TempProjectApiResponse>(
    `/project/temp/${projectId}`,
    payload
  );
  console.log("[myProjectsService] PATCH /project/temp/{projectId} 응답", data);
  return mapTempProjectResponse(data);
};

// 한글 설명: 프로젝트 상세 조회 (공개 범위 무관)
export const fetchProjectDetail = async (
  projectId: ProjectId
): Promise<ProjectDetailResponseDTO> => {
  console.log("[myProjectsService] GET /project/id/{projectId} 요청", {
    projectId,
  });
  const { data } = await api.get<ProjectDetailApiResponse>(
    `/project/id/${projectId}`
  );
  console.log("[myProjectsService] GET /project/id/{projectId} 응답", data);
  return mapProjectDetailResponse(data);
};

// 한글 설명: 특정 프로젝트를 찜하는 API
export const bookmarkProjectApi = async (
  projectId: number
): Promise<ProjectBookmarkResponseDTO> => {
  console.log("[myProjectsService] POST /api/supporter-follows/project/{projectId}/bookmark 요청", {
    projectId,
  });
  const { data } = await api.post<ProjectBookmarkResponseDTO>(
    `/api/supporter-follows/project/${projectId}/bookmark`
  );
  console.log("[myProjectsService] POST /api/supporter-follows/project/{projectId}/bookmark 응답", data);
  return data;
};

// 한글 설명: 특정 프로젝트의 찜을 해제하는 API
export const unbookmarkProjectApi = async (
  projectId: number
): Promise<ProjectBookmarkResponseDTO> => {
  console.log("[myProjectsService] DELETE /api/supporter-follows/project/{projectId}/bookmark 요청", {
    projectId,
  });
  const { data } = await api.delete<ProjectBookmarkResponseDTO>(
    `/api/supporter-follows/project/${projectId}/bookmark`
  );
  console.log(
    "[myProjectsService] DELETE /api/supporter-follows/project/{projectId}/bookmark 응답",
    data
  );
  return data;
};

// 한글 설명: 작성중 프로젝트 삭제 API (DRAFT 상태에서만 가능)
export const deleteProjectApi = async (projectId: ProjectId): Promise<void> => {
  console.log("[myProjectsService] DELETE /project/{projectId} 요청", {
    projectId,
  });
  await api.delete(`/project/${projectId}`);
  console.log("[myProjectsService] DELETE /project/{projectId} 응답 완료");
};

// 한글 설명: 심사 요청 취소 API (REVIEW 상태에서만 가능)
export const cancelReviewRequestApi = async (
  projectId: ProjectId
): Promise<void> => {
  console.log(
    "[myProjectsService] POST /project/{projectId}/cancel-review 요청",
    { projectId }
  );
  await api.post(`/project/${projectId}/cancel-review`);
  console.log(
    "[myProjectsService] POST /project/{projectId}/cancel-review 응답 완료"
  );
};

// 한글 설명: 공개 예정 취소 API (SCHEDULED 상태에서만 가능)
export const cancelScheduledProjectApi = async (
  projectId: ProjectId
): Promise<void> => {
  console.log(
    "[myProjectsService] POST /project/{projectId}/cancel-scheduled 요청",
    { projectId }
  );
  await api.post(`/project/${projectId}/cancel-scheduled`);
  console.log(
    "[myProjectsService] POST /project/{projectId}/cancel-scheduled 응답 완료"
  );
};

