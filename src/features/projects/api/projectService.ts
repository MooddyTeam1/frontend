import api from "../../../services/api";
import type { ProjectListResponse, ProjectCategory, ProjectListResponseDTO, ProjectCardResponseDTO } from "../types";

// 한글 설명: 카테고리 + 정렬 기준으로 프로젝트 목록을 조회하는 API 호출 함수
export interface FetchProjectsByCategoryParams {
  category: ProjectCategory; // 한글 설명: ⭐ 필수 - 백엔드 enum과 동일한 문자열
  page?: number;
  size?: number;
  sort?: "popular" | "progress" | "latest" | "closing"; // 한글 설명: 정렬 기준
  search?: string; // 한글 설명: 검색어 (선택)
}

// 한글 설명: 카테고리 기반 프로젝트 목록 조회 API
// 한글 설명: 백엔드 API: GET /project/category?category={category}
// 한글 설명: 백엔드는 List<ProjectListResponse>를 반환 (배열)
// 한글 설명: category는 필수이며, 백엔드 Category enum과 정확히 일치해야 함
export async function fetchProjectsByCategory(
  params: FetchProjectsByCategoryParams
): Promise<ProjectListResponse> {
  console.log(
    "[projectService] GET /project/category 요청",
    { category: params.category }
  );

  // 한글 설명: 백엔드 API는 category 파라미터만 받음
  // 한글 설명: 백엔드 응답: List<ProjectListResponse> (배열)
  const response = await api.get<ProjectListResponseDTO[]>(
    `/project/category`,
    {
      params: {
        category: params.category, // 한글 설명: ⭐ 백엔드 enum과 동일한 문자열로 전송
      },
    }
  );

  console.log(
    "[projectService] GET /project/category 응답",
    response.data
  );

  // 한글 설명: 백엔드가 배열을 반환하므로, ProjectListResponse 형태로 변환
  // 한글 설명: ProjectListResponse.items는 ProjectCardResponseDTO[] 타입이지만,
  // 실제로는 ProjectListResponseDTO[]를 반환하므로 타입 변환 필요
  const items = response.data || [];
  return {
    items: items as unknown as ProjectCardResponseDTO[], // 한글 설명: ProjectCardResponseDTO[] 타입으로 변환
    total: items.length,
    page: 0,
    pageSize: items.length,
    hasNext: false,
  };
}

// 한글 설명: 프로젝트 제목으로 검색하는 API
// 한글 설명: GET /project/search?keyword=... 엔드포인트 호출
export async function searchProjects(
  keyword: string
): Promise<ProjectListResponseDTO[]> {
  // 한글 설명: 검색어가 비어있으면 빈 배열 반환
  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) {
    return [];
  }

  console.log("[projectService] GET /project/search 요청", { keyword: trimmedKeyword });

  // 한글 설명: 백엔드 API 호출 - List<ProjectListResponse> 반환
  const response = await api.get<ProjectListResponseDTO[]>(
    `/project/search`,
    {
      params: { keyword: trimmedKeyword },
    }
  );

  console.log("[projectService] GET /project/search 응답", response.data);

  return response.data;
}


