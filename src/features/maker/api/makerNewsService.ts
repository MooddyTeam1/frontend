// 한글 설명: 메이커 소식 API 함수 모음
import api from "../../../services/api";
import type {
  MakerNewsCreateRequest,
  MakerNewsResponse,
} from "../types";

/**
 * 한글 설명: 메이커 소식 생성 API
 * Method: POST
 * URL: /api/maker/news
 */
export const createMakerNews = async (
  payload: MakerNewsCreateRequest
): Promise<MakerNewsResponse> => {
  const { data } = await api.post<MakerNewsResponse>(
    "/api/maker/news",
    payload
  );
  return data;
};

/**
 * 한글 설명: 특정 메이커의 소식 목록 조회 API
 * Method: GET
 * URL: /api/makers/{makerId}/news
 */
export const getMakerNewsList = async (
  makerId: string
): Promise<MakerNewsResponse[]> => {
  const { data } = await api.get<MakerNewsResponse[]>(
    `/api/makers/${makerId}/news`
  );
  return data;
};

/**
 * 한글 설명: 특정 소식 조회 API
 * Method: GET
 * URL: /api/maker/news/{newsId}
 */
export const getMakerNews = async (
  newsId: string
): Promise<MakerNewsResponse> => {
  const { data } = await api.get<MakerNewsResponse>(
    `/api/maker/news/${newsId}`
  );
  return data;
};

/**
 * 한글 설명: 메이커 소식 수정 API
 * Method: PUT
 * URL: /api/maker/news/{newsId}
 */
export const updateMakerNews = async (
  newsId: string,
  payload: MakerNewsCreateRequest
): Promise<MakerNewsResponse> => {
  const { data } = await api.put<MakerNewsResponse>(
    `/api/maker/news/${newsId}`,
    payload
  );
  return data;
};

/**
 * 한글 설명: 메이커 소식 삭제 API
 * Method: DELETE
 * URL: /api/maker/news/{newsId}
 */
export const deleteMakerNews = async (
  newsId: string
): Promise<void> => {
  await api.delete(`/api/maker/news/${newsId}`);
};

