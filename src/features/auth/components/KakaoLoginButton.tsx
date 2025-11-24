import React from "react";

const DEFAULT_KAKAO_ENDPOINT = "/oauth2/authorization/kakao";

const buildRedirectUrl = (baseUrl: string): string => {
  try {
    const target = new URL(baseUrl);
    const callback = `${window.location.origin}/oauth2/callback`;
    target.searchParams.set("redirect_uri", callback);
    return target.toString();
  } catch (error) {
    console.warn("카카오 로그인 URL을 생성하지 못했습니다:", error);
    return baseUrl;
  }
};

export const KakaoLoginButton: React.FC = () => {
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
  const rawUrl =
    import.meta.env.VITE_KAKAO_OAUTH_URL ??
    `${apiBase}${DEFAULT_KAKAO_ENDPOINT}`;

  if (!rawUrl || rawUrl === DEFAULT_KAKAO_ENDPOINT) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
        카카오 OAuth 리디렉션 URL이 설정되지 않았습니다. 환경 변수
        <code className="ml-1">VITE_KAKAO_OAUTH_URL</code>을 등록하거나 기본
        경로를 확인하세요.
      </div>
    );
  }

  const redirectUrl =
    typeof window !== "undefined" ? buildRedirectUrl(rawUrl) : rawUrl;

  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = redirectUrl;
      }}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FEE500] px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-[#ffd900]"
    >
      <span aria-hidden>🟡</span>
      카카오로 계속하기
    </button>
  );
};
