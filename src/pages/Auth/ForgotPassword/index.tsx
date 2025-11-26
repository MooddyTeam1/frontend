// src/pages/Auth/ForgotPassword/index.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Container } from "../../../shared/components/Container";
import { authService } from "../../../features/auth/api/authService";
import { extractErrorMessage } from "../../../services/api";

// 한글 설명: 이메일 입력 검증 스키마
const emailSchema = z.object({
  email: z.string().email("이메일을 확인해 주세요"),
});

// 한글 설명: 비밀번호 재설정 입력 검증 스키마
const resetPasswordSchema = z
  .object({
    email: z.string().email("이메일을 확인해 주세요"),
    code: z
      .string()
      .min(6, "인증번호는 6자리여야 합니다")
      .max(6, "인증번호는 6자리여야 합니다")
      .regex(/^\d+$/, "인증번호는 숫자만 입력 가능합니다"),
    newPassword: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "비밀번호는 영문 대소문자와 숫자를 포함해야 합니다"
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해 주세요"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // 한글 설명: 1단계 상태 (이메일 입력 및 인증코드 발송)
  const [step, setStep] = React.useState<"email" | "reset">("email");
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<{
    email?: string;
    code?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = React.useState(false);
  const [resetLoading, setResetLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  // 한글 설명: 1단계 - 인증코드 발송 요청
  const handleSendCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

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
      await authService.sendPasswordResetCode(result.data.email);
      setStep("reset");
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // 한글 설명: 2단계 - 비밀번호 재설정 요청
  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    const result = resetPasswordSchema.safeParse({
      email,
      code,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setFieldErrors({
        email: fieldErrors.email?.[0],
        code: fieldErrors.code?.[0],
        newPassword: fieldErrors.newPassword?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    setResetLoading(true);
    try {
      await authService.resetPasswordByCode({
        email: result.data.email,
        code: result.data.code,
        newPassword: result.data.newPassword,
      });
      setSuccess(true);
      // 한글 설명: 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setResetLoading(false);
    }
  };

  // 한글 설명: 성공 화면
  if (success) {
    return (
      <Container>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-neutral-900">
                  비밀번호가 변경되었습니다
                </h1>
                <p className="text-sm text-gray-600">
                  새 비밀번호로 로그인해 주세요.
                </p>
              </div>
              <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-600">
                로그인 페이지로 이동합니다...
              </div>
              <Link
                to="/login"
                className="inline-block w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                로그인하러 가기
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold text-neutral-900">
                비밀번호 찾기
              </h1>
              <p className="text-sm text-gray-600">
                {step === "email"
                  ? "가입하신 이메일 주소를 입력해 주세요"
                  : "인증번호와 새 비밀번호를 입력해 주세요"}
              </p>
            </div>

            {step === "email" ? (
              // 한글 설명: 1단계 - 이메일 입력 및 인증코드 발송
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-neutral-700"
                    htmlFor="email"
                  >
                    이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    autoComplete="email"
                    placeholder="name@example.com"
                    disabled={loading}
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
                >
                  {loading ? "전송 중..." : "인증번호 보내기"}
                </button>
              </form>
            ) : (
              // 한글 설명: 2단계 - 인증코드 및 새 비밀번호 입력
              <form onSubmit={handleResetPassword} className="space-y-4">
                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-neutral-700"
                    htmlFor="email-display"
                  >
                    이메일
                  </label>
                  <input
                    id="email-display"
                    type="email"
                    value={email}
                    className="w-full rounded-md border border-neutral-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-neutral-700"
                    htmlFor="code"
                  >
                    인증번호
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(event) => {
                      // 한글 설명: 숫자만 입력 허용, 최대 6자리
                      const value = event.target.value.replace(/\D/g, "").slice(0, 6);
                      setCode(value);
                    }}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="6자리 인증번호"
                    disabled={resetLoading}
                    maxLength={6}
                  />
                  {fieldErrors.code && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldErrors.code}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-neutral-700"
                    htmlFor="newPassword"
                  >
                    새 비밀번호
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    autoComplete="new-password"
                    placeholder="8자 이상, 영문 대소문자와 숫자 포함"
                    disabled={resetLoading}
                  />
                  {fieldErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldErrors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-neutral-700"
                    htmlFor="confirmPassword"
                  >
                    비밀번호 확인
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    autoComplete="new-password"
                    placeholder="비밀번호를 다시 입력하세요"
                    disabled={resetLoading}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
                >
                  {resetLoading ? "변경 중..." : "비밀번호 변경"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError(null);
                    setFieldErrors({});
                  }}
                  className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                >
                  이메일 다시 입력
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-600">
              <Link to="/login" className="text-neutral-900 underline">
                로그인으로 돌아가기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};
