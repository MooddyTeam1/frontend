// 한글 설명: 메이커의 프로젝트 관리 상태를 담당하는 Zustand 스토어
import { create } from "zustand";
import {
  fetchProjectSummary,
  fetchMyProjectsByStatus,
  fetchProjectDetail,
  requestProjectCreation,
  saveProjectTemp,
  updateProjectTemp,
  type StatusFilterParams,
} from "../api/myProjectsService";
import type {
  CreateProjectRequestDTO,
  CreateProjectRequestResponseDTO,
  ProjectDetailResponseDTO,
  ProjectId,
  ProjectLifecycleStatus,
  ProjectReviewStatus,
  ProjectStatus,
  TempProjectRequestDTO,
  TempProjectResponseDTO,
  MyProjectStatusItemDTO,
} from "../types";
import { resolveImageUrl } from "../../../shared/utils/image";

// 한글 설명: 스토어 내부에서 사용하는 프로젝트 상태 맵 표현
type ProjectStatusMap = Record<ProjectStatus, MyProjectStatusItemDTO[]>;
type ProjectCountMap = Record<ProjectStatus, number>;

// 한글 설명: API에서 내려주는 상태 문자열을 내부 enum으로 변환
const normalizeReviewStatus = (
  status?: string | null
): ProjectReviewStatus => {
  const normalized = status?.toUpperCase() ?? "DRAFT";
  switch (normalized) {
    case "NONE":
      return "NONE";
    case "REVIEW":
      return "REVIEW";
    case "REJECTED":
      return "REJECTED";
    case "APPROVED":
    case "APPOOVED":
      return "APPROVED";
    case "DRAFT":
    default:
      return "DRAFT";
  }
};

// 한글 설명: 라이프사이클 상태 변환 헬퍼
const normalizeLifecycleStatus = (
  status?: string | null
): ProjectLifecycleStatus => {
  const normalized = status?.toUpperCase() ?? "DRAFT";
  switch (normalized) {
    case "NONE":
      return "NONE";
    case "SCHEDULED":
      return "SCHEDULED";
    case "LIVE":
      return "LIVE";
    case "ENDED":
      return "ENDED";
    case "DRAFT":
    default:
      return "DRAFT";
  }
};

// 한글 설명: API 상태 조합을 크리에이터 UI에서 사용하는 ProjectStatus로 변환
const resolveProjectStatus = (
  lifecycle: ProjectLifecycleStatus,
  review: ProjectReviewStatus
): ProjectStatus => {
  if (review === "REJECTED") return "REJECTED";
  if (review === "DRAFT") return "DRAFT";
  if (review === "REVIEW") return "REVIEW";
  if (review === "APPROVED") {
    if (lifecycle === "SCHEDULED") return "SCHEDULED";
    if (lifecycle === "LIVE") return "LIVE";
    if (lifecycle === "ENDED") return "ENDED";
    return "APPROVED";
  }
  // review === "NONE"
  if (lifecycle === "LIVE") return "LIVE";
  if (lifecycle === "SCHEDULED") return "SCHEDULED";
  if (lifecycle === "ENDED") return "ENDED";
  return "APPROVED";
};

// 한글 설명: 상태별 초기값 생성 유틸리티
const createEmptyStatusMap = (): ProjectStatusMap => ({
  DRAFT: [],
  REVIEW: [],
  APPROVED: [],
  SCHEDULED: [],
  LIVE: [],
  ENDED: [],
  REJECTED: [],
});

const createEmptyCountMap = (): ProjectCountMap => ({
  DRAFT: 0,
  REVIEW: 0,
  APPROVED: 0,
  SCHEDULED: 0,
  LIVE: 0,
  ENDED: 0,
  REJECTED: 0,
});

// 한글 설명: Zustand 스토어 상태 정의
interface MyProjectsStoreState {
  loading: boolean;
  error?: string;
  projectsByStatus: ProjectStatusMap;
  countsByStatus: ProjectCountMap;
  detailMap: Record<ProjectId, ProjectDetailResponseDTO>;
  tempProject?: TempProjectResponseDTO;
  hasFetchedOverview: boolean;
  pendingStatusFetches: Set<ProjectStatus>;
  fetchOverview: (options?: { force?: boolean }) => Promise<void>;
  fetchByStatus: (
    status: ProjectStatus,
    options?: { force?: boolean }
  ) => Promise<void>;
  getProjectsByStatus: (status: ProjectStatus) => MyProjectStatusItemDTO[];
  getCountByStatus: (status: ProjectStatus) => number;
  createProjectRequest: (
    payload: CreateProjectRequestDTO,
    projectId?: ProjectId
  ) => Promise<CreateProjectRequestResponseDTO>;
  saveTempProject: (
    payload: TempProjectRequestDTO
  ) => Promise<TempProjectResponseDTO>;
  updateTempProject: (
    projectId: ProjectId,
    payload: TempProjectRequestDTO
  ) => Promise<TempProjectResponseDTO>;
  fetchDetail: (projectId: ProjectId) => Promise<ProjectDetailResponseDTO>;
  resetError: () => void;
}

export const useMyProjectsStore = create<MyProjectsStoreState>((set, get) => ({
  loading: false,
  error: undefined,
  projectsByStatus: createEmptyStatusMap(),
  countsByStatus: createEmptyCountMap(),
  detailMap: {},
  tempProject: undefined,
  hasFetchedOverview: false,
  pendingStatusFetches: new Set<ProjectStatus>(),

  // 한글 설명: API 에러 상태 초기화
  resetError: () => set({ error: undefined }),

  // 한글 설명: 내 프로젝트 전체 개요 조회
  fetchOverview: async (options?: { force?: boolean }) => {
    const force = options?.force ?? false;
    if (!force && get().hasFetchedOverview) return;
    set({ loading: true, error: undefined });
    try {
      const summary = await fetchProjectSummary();
      const counts = createEmptyCountMap();
      counts.DRAFT = summary.draftCount ?? 0;
      counts.REVIEW = summary.reviewCount ?? 0;
      counts.APPROVED = summary.approvedCount ?? 0;
      counts.SCHEDULED = summary.scheduledCount ?? 0;
      counts.LIVE = summary.liveCount ?? 0;
      counts.ENDED = summary.endCount ?? 0;
      counts.REJECTED = summary.rejectedCount ?? 0;

      set({
        countsByStatus: counts,
        hasFetchedOverview: true,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message ?? "내 프로젝트를 불러오지 못했습니다.",
        loading: false,
      });
    }
  },

  // 한글 설명: 상태별 프로젝트 목록 조회 (캐싱 포함)
  fetchByStatus: async (status: ProjectStatus, options) => {
    const force = options?.force ?? false;
    const { pendingStatusFetches, projectsByStatus } = get();
    if (!force && projectsByStatus[status]?.length > 0) {
      return;
    }
    if (pendingStatusFetches.has(status)) {
      return;
    }

    const nextSet = new Set(pendingStatusFetches);
    nextSet.add(status);
    set({ pendingStatusFetches: nextSet, error: undefined, loading: true });
    try {
      const params: StatusFilterParams = {};
      switch (status) {
        case "DRAFT":
          params.lifecycle = "DRAFT";
          params.review = "NONE";
          break;
        case "REVIEW":
          params.lifecycle = "DRAFT";
          params.review = "REVIEW";
          break;
        case "APPROVED":
          params.lifecycle = "DRAFT";
          params.review = "APPROVED";
          break;
        case "SCHEDULED":
          params.lifecycle = "SCHEDULED";
          params.review = "APPROVED";
          break;
        case "LIVE":
          params.lifecycle = "LIVE";
          params.review = "APPROVED";
          break;
        case "ENDED":
          params.lifecycle = "ENDED";
          params.review = "APPROVED";
          break;
        case "REJECTED":
          params.lifecycle = "DRAFT";
          params.review = "REJECTED";
          break;
        default:
          break;
      }

      const response = await fetchMyProjectsByStatus(params);
      const normalized = response.map((item) => {
        // 한글 설명: API 서비스에서 이미 매핑된 데이터를 받으므로, 상태 정규화와 이미지 URL 변환만 수행
        const lifecycle = normalizeLifecycleStatus(
          item.projectLifecycleStatus
        );
        const review = normalizeReviewStatus(item.projectReviewStatus);
        // 한글 설명: imgUrl이 상대 경로인 경우 절대 경로로 변환 (이미 절대 경로면 그대로 사용)
        const rawImgUrl = item.imgUrl;
        const resolvedImgUrl = rawImgUrl
          ? resolveImageUrl(rawImgUrl) ?? rawImgUrl
          : null;
        return {
          ...item,
          imgUrl: resolvedImgUrl,
          projectLifecycleStatus: lifecycle,
          projectReviewStatus: review,
        };
      });

      set((state) => ({
        projectsByStatus: {
          ...state.projectsByStatus,
          [status]: normalized,
        },
        loading: false,
        pendingStatusFetches: new Set(
          [...state.pendingStatusFetches].filter((item) => item !== status)
        ),
      }));
    } catch (error: any) {
      set((state) => ({
        error: error?.response?.data?.message ?? "프로젝트 목록을 불러오지 못했습니다.",
        loading: false,
        pendingStatusFetches: new Set(
          [...state.pendingStatusFetches].filter((item) => item !== status)
        ),
      }));
    }
  },

  // 한글 설명: 상태별 프로젝트 목록 직접 접근 (캐시 활용)
  getProjectsByStatus: (status: ProjectStatus) =>
    get().projectsByStatus[status] ?? [],

  // 한글 설명: 상태별 프로젝트 개수 조회 (overview 데이터 기반)
  getCountByStatus: (status: ProjectStatus) =>
    get().countsByStatus[status] ?? 0,

  // 한글 설명: 프로젝트 생성 심사 요청
  createProjectRequest: async (
    payload: CreateProjectRequestDTO,
    projectId?: ProjectId
  ) => {
    const response = await requestProjectCreation(payload, projectId);
    // overview 초기화하여 재요청 시 최신 데이터 확보
    set({
      hasFetchedOverview: false,
      projectsByStatus: createEmptyStatusMap(),
      countsByStatus: createEmptyCountMap(),
    });
    return response;
  },

  // 한글 설명: 프로젝트 초안 임시 저장
  saveTempProject: async (payload: TempProjectRequestDTO) => {
    const response = await saveProjectTemp(payload);
    set({ tempProject: response });
    return response;
  },

  // 한글 설명: 임시 저장 프로젝트 정보 업데이트
  updateTempProject: async (
    projectId: ProjectId,
    payload: TempProjectRequestDTO
  ) => {
    const response = await updateProjectTemp(projectId, payload);
    set({ tempProject: response });
    return response;
  },

  // 한글 설명: 프로젝트 상세 조회 (캐시 + API)
  fetchDetail: async (projectId: ProjectId) => {
    const cached = get().detailMap[projectId];
    if (cached) return cached;
    const detail = await fetchProjectDetail(projectId);
    set((state) => ({
      detailMap: { ...state.detailMap, [projectId]: detail },
    }));
    return detail;
  },
}));

