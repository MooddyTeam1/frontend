// 한글 설명: Q&A API 함수 모음
import api from "../../../services/api";
import type {
  ProjectQnaResponse,
  ProjectQnaCreateRequest,
  ProjectQnaAnswerRequest,
} from "../types";

/**
 * 한글 설명: 서포터가 프로젝트에 질문을 작성하는 API
 * Method: POST
 * URL: /api/supporter/projects/{projectId}/qna
 */
export const createQuestion = async (
  projectId: number,
  payload: ProjectQnaCreateRequest
): Promise<ProjectQnaResponse> => {
  const { data } = await api.post<ProjectQnaResponse>(
    `/api/supporter/projects/${projectId}/qna`,
    payload
  );
  return data;
};

/**
 * 한글 설명: 서포터가 자신이 남긴 Q&A 목록을 조회하는 API
 * Method: GET
 * URL: /api/supporter/projects/{projectId}/qna
 */
export const getMyQnaList = async (
  projectId: number
): Promise<ProjectQnaResponse[]> => {
  const { data } = await api.get<ProjectQnaResponse[]>(
    `/api/supporter/projects/${projectId}/qna`
  );
  return data;
};

/**
 * 한글 설명: 서포터가 자신이 남긴 특정 Q&A를 조회하는 API
 * Method: GET
 * URL: /api/supporter/projects/{projectId}/qna/{qnaId}
 */
export const getMyQna = async (
  projectId: number,
  qnaId: number
): Promise<ProjectQnaResponse> => {
  const { data } = await api.get<ProjectQnaResponse>(
    `/api/supporter/projects/${projectId}/qna/${qnaId}`
  );
  return data;
};

/**
 * 한글 설명: 메이커가 프로젝트의 Q&A 목록을 조회하는 API
 * Method: GET
 * URL: /api/maker/projects/{projectId}/qna
 * Query: unansweredOnly (boolean, optional, default=false)
 */
type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

export const getQnaListForMaker = async (
  projectId: number,
  params?: { unansweredOnly?: boolean; page?: number; size?: number }
): Promise<ProjectQnaResponse[]> => {
  const { data } = await api.get<PageResponse<ProjectQnaResponse>>(
    `/api/maker/projects/${projectId}/qna`,
    {
      params: {
        unansweredOnly: params?.unansweredOnly ?? false,
        page: params?.page ?? 0,
        size: params?.size ?? 50,
      },
    }
  );
  return Array.isArray(data?.content) ? data.content : [];
};

/**
 * 한글 설명: 메이커가 Q&A에 답변을 등록하거나 수정하는 API
 * Method: PUT
 * URL: /api/maker/projects/{projectId}/qna/{qnaId}/answer
 */
export const answerQuestion = async (
  projectId: number,
  qnaId: number,
  payload: ProjectQnaAnswerRequest
): Promise<ProjectQnaResponse> => {
  const { data } = await api.put<ProjectQnaResponse>(
    `/api/maker/projects/${projectId}/qna/${qnaId}/answer`,
    payload
  );
  return data;
};

/**
 * 한글 설명: 공개 Q&A 목록 조회 (비로그인 사용자도 조회 가능)
 * Method: GET
 * URL: /public/projects/{projectId}/qna
 */
export const getPublicQnaList = async (
  projectId: number
): Promise<ProjectQnaResponse[]> => {
  const { data } = await api.get<ProjectQnaResponse[]>(
    `/public/projects/${projectId}/qna`
  );
  return data;
};

