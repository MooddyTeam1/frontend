import React from "react";
import { API_BASE_URL } from "../../../services/api";

const DEFAULT_GOOGLE_ENDPOINT = "/oauth2/authorization/google";

export const GoogleLoginButton: React.FC = () => {
  // 한글 설명: API 기본 URL을 중앙에서 관리하는 변수 사용
  const apiBase = API_BASE_URL;
  // 구글 OAuth 리다이렉트 URL
  const redirectUrl =
    import.meta.env.VITE_GOOGLE_OAUTH_URL ??
    `${apiBase}${DEFAULT_GOOGLE_ENDPOINT}`;

  // 디버깅용
  // console.log("[GoogleLoginButton] apiBase:", apiBase);
  // console.log("[GoogleLoginButton] redirectUrl:", redirectUrl);

  // redirectUrl 설정이 이상하면 안내 메시지
  if (!redirectUrl || redirectUrl === DEFAULT_GOOGLE_ENDPOINT) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
        Google OAuth 리디렉션 URL이 설정되지 않았습니다. 환경 변수
        <code className="ml-1"> VITE_API_BASE_URL </code> 이나{" "}
        <code className="ml-1">VITE_GOOGLE_OAUTH_URL</code> 설정을 확인하세요.
      </div>
    );
  }

  const handleRedirect = () => {
    // 백엔드의 /oauth2/authorization/google 로 이동
    window.location.href = redirectUrl;
  };

  return (
    <button
      type="button"
      onClick={handleRedirect}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
    >
      <span aria-hidden>🔵</span>
      구글로 계속하기
    </button>
  );
};

export default GoogleLoginButton;
