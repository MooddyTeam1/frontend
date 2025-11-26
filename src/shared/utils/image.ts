// 한글 설명: 이미지 URL을 환경에 맞게 절대 경로로 변환하는 유틸리티
import { API_BASE_URL } from "../../services/api";

const normalizeBaseUrl = (base: string): string =>
  base.endsWith("/") ? base.slice(0, -1) : base;

/**
 * 한글 설명: 백엔드에서 전달된 이미지 경로를 브라우저에서 접근 가능한 절대 URL로 변환
 * - 이미 절대 경로(http/https)라면 그대로 반환
 * - "/uploads/..." 처럼 상대 경로면 API_BASE_URL을 붙여서 반환
 */
export const resolveImageUrl = (
  path: string | null | undefined
): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const base = normalizeBaseUrl(API_BASE_URL);

  if (path.startsWith("/")) {
    return `${base}${path}`;
  }

  return `${base}/${path}`;
};


