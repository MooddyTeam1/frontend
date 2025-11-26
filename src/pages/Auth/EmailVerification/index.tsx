import React from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Container } from "../../../shared/components/Container";
import { authService } from "../../../features/auth/api/authService";
import { extractErrorMessage } from "../../../services/api";

// 한글 설명: 이메일 입력 검증 스키마
const emailSchema = z.object({
  email: z.string().email("이메일을 확인해 주세요"),
});

// 한글 설명: 인증번호 검증 스키마
const verifySchema = z.object({
  email: z.string().email("이메일을 확인해 주세요"),
  code: z.string().min(1, "인증번호를 입력해 주세요"),
});

export const EmailVerificationPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [emailSent, setEmailSent] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [verifyLoading, setVerifyLoading] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);

  // 한글 설명: 인증번호 전송 후 쿨다운 타이머 설정
  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // 한글 설명: 인증번호 전송 요청
  const handleSendCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError(
        result.error.flatten().fieldErrors.email?.[0] ||
          "이메일을 확인해 주세요"
      );
      return;
    }

    setLoading(true);
    try {
      await authService.sendEmailVerification(result.data.email);
      setEmailSent(true);
      setCooldown(180); // 한글 설명: 3분(180초) 쿨다운
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // 한글 설명: 인증번호 검증 요청
  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const result = verifySchema.safeParse({ email, code });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setError(
        fieldErrors.email?.[0] ||
          fieldErrors.code?.[0] ||
          "입력 정보를 확인해 주세요"
      );
      return;
    }

    setVerifyLoading(true);
    try {
      await authService.verifyEmail(result.data);
      setVerified(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setVerifyLoading(false);
    }
  };

  // 한글 설명: 인증번호 재전송
  const handleResend = () => {
    setEmailSent(false);
    setCode("");
    setError(null);
    setCooldown(0);
  };

  if (verified) {
    return (
      <Container>
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center py-16">
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-neutral-900">
                이메일 인증이 완료되었습니다
              </h1>
              <p className="text-sm text-neutral-500">
                이메일 인증이 성공적으로 완료되었습니다.
              </p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-600">
              이메일 인증이 완료되었습니다.
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center py-16">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-neutral-900">
              이메일 인증
            </h1>
            <p className="text-sm text-neutral-500">
              {emailSent
                ? "이메일로 인증번호를 전송했습니다"
                : "이메일 주소를 입력하고 인증번호를 받아주세요"}
            </p>
          </div>

          {!emailSent ? (
            <form
              onSubmit={handleSendCode}
              className="space-y-4 rounded-3xl border border-neutral-200 p-6"
            >
              <div className="space-y-2">
                <label
                  className="text-xs font-medium text-neutral-500"
                  htmlFor="email"
                >
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
                  autoComplete="email"
                  placeholder="name@example.com"
                  disabled={loading}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white disabled:opacity-50"
              >
                {loading ? "전송 중..." : "인증번호 보내기"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleVerify}
              className="space-y-4 rounded-3xl border border-neutral-200 p-6"
            >
              <div className="space-y-2">
                <label
                  className="text-xs font-medium text-neutral-500"
                  htmlFor="email-display"
                >
                  이메일
                </label>
                <input
                  id="email-display"
                  type="email"
                  value={email}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-500"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-xs font-medium text-neutral-500"
                  htmlFor="code"
                >
                  인증번호
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
                  placeholder="인증번호를 입력하세요"
                  disabled={verifyLoading}
                  maxLength={6}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={verifyLoading}
                className="w-full rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white disabled:opacity-50"
              >
                {verifyLoading ? "인증 중..." : "인증하기"}
              </button>

              <div className="flex items-center justify-between text-xs text-neutral-500">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  className="underline disabled:opacity-50 disabled:no-underline"
                >
                  {cooldown > 0
                    ? `${Math.floor(cooldown / 60)}분 ${cooldown % 60}초 후 재전송`
                    : "인증번호 다시 받기"}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-xs text-neutral-500">
            <Link to="/login" className="text-neutral-900 underline">
              로그인으로 돌아가기
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
};

