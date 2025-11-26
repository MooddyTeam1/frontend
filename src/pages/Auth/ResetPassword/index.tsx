import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Container } from "../../../shared/components/Container";
import { authService } from "../../../features/auth/api/authService";
import { extractErrorMessage } from "../../../services/api";

// 한글 설명: 비밀번호 재설정 입력 검증 스키마
const resetPasswordSchema = z
  .object({
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

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [form, setForm] = React.useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  // 한글 설명: 토큰이 없으면 에러 표시
  React.useEffect(() => {
    if (!token) {
      setGeneralError("유효하지 않은 링크입니다.");
    }
  }, [token]);

  // 한글 설명: 비밀번호 재설정 요청
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null);
    setErrors({});

    if (!token) {
      setGeneralError("유효하지 않은 링크입니다.");
      return;
    }

    const result = resetPasswordSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        newPassword: fieldErrors.newPassword?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        token,
        newPassword: result.data.newPassword,
      });
      setSuccess(true);
      // 한글 설명: 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    } catch (error) {
      setGeneralError(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container>
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center py-16">
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-neutral-900">
                비밀번호가 변경되었습니다
              </h1>
              <p className="text-sm text-neutral-500">
                새 비밀번호로 로그인해 주세요.
              </p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-600">
              로그인 페이지로 이동합니다...
            </div>
            <Link
              to="/login"
              className="inline-block w-full rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
            >
              로그인하러 가기
            </Link>
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
              비밀번호 재설정
            </h1>
            <p className="text-sm text-neutral-500">
              새 비밀번호를 입력해 주세요
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-3xl border border-neutral-200 p-6"
          >
            <div className="space-y-2">
              <label
                className="text-xs font-medium text-neutral-500"
                htmlFor="newPassword"
              >
                새 비밀번호
              </label>
              <input
                id="newPassword"
                type="password"
                value={form.newPassword}
                onChange={(event) =>
                  setForm({ ...form, newPassword: event.target.value })
                }
                className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
                autoComplete="new-password"
                placeholder="8자 이상, 영문 대소문자와 숫자 포함"
                disabled={loading}
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-medium text-neutral-500"
                htmlFor="confirmPassword"
              >
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm({ ...form, confirmPassword: event.target.value })
                }
                className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
                autoComplete="new-password"
                placeholder="비밀번호를 다시 입력하세요"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {generalError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {generalError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white disabled:opacity-50"
            >
              {loading ? "변경 중..." : "비밀번호 변경"}
            </button>
          </form>

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
