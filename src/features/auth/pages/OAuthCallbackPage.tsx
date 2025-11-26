import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Container } from "../../../shared/components/Container";
import { useAuthStore } from "../stores/authStore";
import { getSupporterOnboardingStatus } from "../../../features/onboarding/api/supporterOnboardingApi";

export const OAuthCallbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const completeSocialLogin = useAuthStore(
    (state) => state.completeSocialLogin
  );
  const [status, setStatus] = React.useState<
    "processing" | "error"
  >("processing");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const processedRef = React.useRef(false);

  React.useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const params = new URLSearchParams(location.search);
    const errorParam = params.get("error");
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (errorParam) {
      setStatus("error");
      setErrorMessage(errorParam);
      return;
    }

    if (!accessToken) {
      setStatus("error");
      setErrorMessage("소셜 로그인 정보가 없습니다.");
      return;
    }

    completeSocialLogin({
      accessToken,
      refreshToken: refreshToken ?? undefined,
    })
      .then(async (user) => {
        // 한글 설명: admin 계정이면 /admin으로 리다이렉트
        if (user.role === "ADMIN") {
          navigate("/admin", { replace: true });
          return;
        }

        // 한글 설명: 일반 사용자는 온보딩 상태 체크
        try {
          const onboardingStatus = await getSupporterOnboardingStatus();
          // 한글 설명: 온보딩이 완료되지 않았으면 온보딩 페이지로 리다이렉트
          if (onboardingStatus.onboardingStatus !== "COMPLETED") {
            navigate("/supporter/onboarding", { replace: true });
            return;
          }
        } catch (onboardingError) {
          // 한글 설명: 온보딩 상태 조회 실패 시에도 홈으로 이동 (에러 무시)
          console.warn("온보딩 상태 조회 실패:", onboardingError);
        }

        // 한글 설명: 온보딩 완료 또는 상태 조회 실패 시 홈으로 이동
        navigate("/", { replace: true });
      })
      .catch((error) => {
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "소셜 로그인 처리에 실패했습니다."
        );
      });
  }, [completeSocialLogin, location.search, navigate]);

  if (status === "processing") {
    return (
      <Container>
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 text-sm text-neutral-600">
          소셜 로그인 처리 중입니다…
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 rounded-3xl border border-neutral-200 p-8 text-sm text-neutral-700">
        <h1 className="text-lg font-semibold text-neutral-900">
          소셜 로그인에 실패했습니다
        </h1>
        <p className="text-neutral-500">
          {errorMessage ?? "자세한 오류 메시지가 없습니다."}
        </p>
        <Link
          to="/login"
          className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
        >
          로그인 페이지로 돌아가기
        </Link>
      </div>
    </Container>
  );
};






