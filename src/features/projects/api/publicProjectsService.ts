// 한글 설명: 공개 프로젝트 조회 API 함수 모음. 홈페이지에서 사용하는 /public/projects/** 엔드포인트
import api from "../../../services/api";
import type {
  TrendingProjectResponseDTO,
  TrendingProjectScoreResponseDTO,
  MostViewedProjectResponseDTO,
  ProjectListResponseDTO,
} from "../types";

// 한글 설명: 지금 뜨는 프로젝트 조회 (찜 많은 순) - 기존 API
export const fetchTrendingProjects = async (
  size: number = 10
): Promise<TrendingProjectResponseDTO[]> => {
  console.log(
    "[publicProjectsService] GET /public/projects/trending 요청",
    { size }
  );
  const { data } = await api.get<TrendingProjectResponseDTO[]>(
    `/public/projects/trending`,
    {
      params: { size },
    }
  );
  console.log("[publicProjectsService] GET /public/projects/trending 응답", data);
  return data;
};

// 한글 설명: 지금 뜨는 프로젝트 조회 (점수 기반) - 새로운 API
export const fetchTrendingScoredProjects = async (
  size: number = 10
): Promise<TrendingProjectScoreResponseDTO[]> => {
  console.log(
    "[publicProjectsService] GET /public/projects/trending-scored 요청",
    { size }
  );
  const { data } = await api.get<TrendingProjectScoreResponseDTO[]>(
    `/public/projects/trending-scored`,
    {
      params: { size },
    }
  );
  console.log(
    "[publicProjectsService] GET /public/projects/trending-scored 응답",
    data
  );
  return data;
};

// 한글 설명: 지금 많이 보고 있는 프로젝트 조회
export const fetchMostViewedProjects = async (
  minutes: number = 60,
  size: number = 6
): Promise<MostViewedProjectResponseDTO[]> => {
  console.log(
    "[publicProjectsService] GET /public/projects/most-viewed 요청",
    { minutes, size }
  );
  const { data } = await api.get<MostViewedProjectResponseDTO[]>(
    `/public/projects/most-viewed`,
    {
      params: { minutes, size },
    }
  );
  console.log(
    "[publicProjectsService] GET /public/projects/most-viewed 응답",
    data
  );
  return data;
};

// 한글 설명: 곧 마감되는 프로젝트 조회
export const fetchClosingSoonProjects = async (): Promise<
  ProjectListResponseDTO[]
> => {
  console.log("[publicProjectsService] GET /public/projects/closing-soon 요청");
  const { data } = await api.get<ProjectListResponseDTO[]>(
    `/public/projects/closing-soon`
  );
  console.log(
    "[publicProjectsService] GET /public/projects/closing-soon 응답",
    data
  );
  return data;
};

// 한글 설명: 방금 업로드된 신규 프로젝트 조회
export const fetchNewlyUploadedProjects = async (
  size: number = 10
): Promise<ProjectListResponseDTO[]> => {
  console.log(
    "[publicProjectsService] GET /public/projects/newly-uploaded 요청",
    { size }
  );
  const { data } = await api.get<ProjectListResponseDTO[]>(
    `/public/projects/newly-uploaded`,
    {
      params: { size },
    }
  );
  console.log(
    "[publicProjectsService] GET /public/projects/newly-uploaded 응답",
    data
  );
  return data;
};

// 한글 설명: 성공 메이커의 새 프로젝트 조회
export const fetchSuccessMakerNewProjects = async (
  size: number = 10
): Promise<ProjectListResponseDTO[]> => {
  console.log(
    "[publicProjectsService] GET /public/projects/success-maker-new 요청",
    { size }
  );
  const { data } = await api.get<ProjectListResponseDTO[]>(
    `/public/projects/success-maker-new`,
    {
      params: { size },
    }
  );
  console.log(
    "[publicProjectsService] GET /public/projects/success-maker-new 응답",
    data
  );
  return data;
};

// 한글 설명: 첫 도전 메이커 응원하기 프로젝트 조회
export const fetchFirstChallengeProjects = async (
  size: number = 10
): Promise<ProjectListResponseDTO[]> => {
  console.log(
    "[publicProjectsService] GET /public/projects/first-challenge 요청",
    { size }
  );
  const { data } = await api.get<ProjectListResponseDTO[]>(
    `/public/projects/first-challenge`,
    {
      params: { size },
    }
  );
  console.log(
    "[publicProjectsService] GET /public/projects/first-challenge 응답",
    data
  );
  return data;
};

// 한글 설명: 목표 달성에 가까운 프로젝트 조회 (달성률 70~95%)
export const fetchNearGoalProjects = async (
  size: number = 6
): Promise<ProjectListResponseDTO[]> => {
  console.log(
    "[publicProjectsService] GET /public/projects/near-goal 요청",
    { size }
  );
  const { data } = await api.get<ProjectListResponseDTO[]>(
    `/public/projects/near-goal`,
    {
      params: { size },
    }
  );
  console.log(
    "[publicProjectsService] GET /public/projects/near-goal 응답",
    data
  );
  return data;
};

// 한글 설명: 예정되어 있는 펀딩 조회 (SCHEDULED 상태의 프로젝트)
export const fetchScheduledProjects = async (
  size: number = 6
): Promise<ProjectListResponseDTO[]> => {
  console.log(
    "[publicProjectsService] GET /public/projects/scheduled 요청",
    { size }
  );
  const { data } = await api.get<ProjectListResponseDTO[]>(
    `/public/projects/scheduled`,
    {
      params: { size },
    }
  );
  console.log(
    "[publicProjectsService] GET /public/projects/scheduled 응답",
    data
  );
  return data;
};

// 한글 설명: 프로젝트 공지 목록 조회 (공개)
// GET /public/projects/{projectId}/news
export interface ProjectNoticeResponse {
  id: number;
  title: string;
  content: string; // Markdown
  isPublic: boolean;
  notifySupporters: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getPublicProjectNews = async (
  projectId: number
): Promise<ProjectNoticeResponse[]> => {
  console.log(
    "[publicProjectsService] GET /public/projects/{projectId}/news 요청",
    { projectId }
  );
  const { data } = await api.get<ProjectNoticeResponse[]>(
    `/public/projects/${projectId}/news`
  );
  console.log(
    "[publicProjectsService] GET /public/projects/{projectId}/news 응답",
    data
  );
  return data;
};

// 한글 설명: 프로젝트 공지 단건 조회 (공개)
// GET /public/projects/{projectId}/news/{newsId}
export const getPublicProjectNewsDetail = async (
  projectId: number,
  newsId: number
): Promise<ProjectNoticeResponse> => {
  console.log(
    "[publicProjectsService] GET /public/projects/{projectId}/news/{newsId} 요청",
    { projectId, newsId }
  );
  const { data } = await api.get<ProjectNoticeResponse>(
    `/public/projects/${projectId}/news/${newsId}`
  );
  console.log(
    "[publicProjectsService] GET /public/projects/{projectId}/news/{newsId} 응답",
    data
  );
  return data;
};

// 한글 설명: 공개 프로젝트 리워드 목록 조회
// GET /public/projects/{projectId}/rewards
import type { PublicRewardResponseDTO } from "../types";

export const fetchPublicProjectRewards = async (
  projectId: number
): Promise<PublicRewardResponseDTO[]> => {
  console.log(
    "[publicProjectsService] GET /public/projects/{projectId}/rewards 요청",
    { projectId }
  );
  const { data } = await api.get<PublicRewardResponseDTO[]>(
    `/public/projects/${projectId}/rewards`
  );
  console.log(
    "[publicProjectsService] GET /public/projects/{projectId}/rewards 응답",
    data
  );
  return data;
};

