import React from "react";
import { useAuth } from "../contexts/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue";
              size?: "large" | "medium" | "small";
              width?: string;
              shape?: "rectangular" | "pill";
              text?: "signin_with" | "signup_with" | "continue_with" | "signup";
            }
          ) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const SCRIPT_ID = "google-oauth-script";
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export const GoogleLoginButton: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const buttonRef = React.useRef<HTMLDivElement | null>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  React.useEffect(() => {
    if (!clientId) {
      setError("VITE_GOOGLE_CLIENT_ID가 설정되지 않았습니다.");
      return;
    }

    let cancelled = false;

    const initialize = () => {
      if (!window.google || !buttonRef.current || cancelled) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (!response.credential) {
            setError("구글 로그인 정보를 확인할 수 없습니다.");
            return;
          }
          loginWithGoogle(response.credential).catch((err) => {
            setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
          });
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
        shape: "pill",
        text: "signup_with",
      });
    };

    const ensureScript = () => {
      if (document.getElementById(SCRIPT_ID)) {
        initialize();
        return;
      }
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = initialize;
      script.onerror = () => {
        setError("구글 로그인 스크립트를 불러오지 못했습니다.");
      };
      document.head.appendChild(script);
    };

    ensureScript();

    return () => {
      cancelled = true;
      window.google?.accounts.id.cancel();
      window.google?.accounts.id.disableAutoSelect();
    };
  }, [clientId, loginWithGoogle]);

  if (!clientId) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
        Google OAuth를 사용하려면 환경 변수 <code>VITE_GOOGLE_CLIENT_ID</code>를 설정하세요.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={buttonRef} className="w-full" />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
