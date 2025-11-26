import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { GoogleLoginButton } from "../../../features/auth/components/GoogleLoginButton";
import { KakaoLoginButton } from "../../../features/auth/components/KakaoLoginButton";
import { Container } from "../../../shared/components/Container";
import { useAuthStore } from "../../../features/auth/stores/authStore";

const schema = z.object({
  email: z.string().email("이메일을 확인해 주세요"),
  password: z.string().min(1, "비밀번호를 입력해 주세요"),
});

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null);
    const result = schema.safeParse(form);
    if (!result.success) {
      // ZodError -> flatten() 해서 fieldErrors 꺼내기
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const loggedInUser = await login(result.data);
      // 한글 설명: admin 계정이면 /admin으로, 아니면 메인 홈페이지로 리다이렉트
      if (loggedInUser.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      setGeneralError(
        error instanceof Error ? error.message : "로그인에 실패했습니다"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center py-16">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-neutral-900">
              다시 만나 반가워요
            </h1>
            <p className="text-sm text-neutral-500">
              가입한 이메일과 비밀번호로 로그인하거나, 구글 계정으로 빠르게
              시작하세요.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
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
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
                autoComplete="email"
                placeholder="name@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-medium text-neutral-500"
                htmlFor="password"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
                autoComplete="current-password"
                placeholder="비밀번호"
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
              <div className="flex justify-end">
                <Link
                  to="/password/forgot"
                  className="text-xs text-neutral-500 underline hover:text-neutral-700"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </div>

            {generalError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {generalError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white disabled:opacity-50"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="space-y-3 rounded-3xl border border-neutral-200 p-6">
            <p className="text-xs text-neutral-500">
              또는 소셜 계정으로 계속하기
            </p>
            <GoogleLoginButton />
            <KakaoLoginButton />
          </div>

          <p className="text-center text-xs text-neutral-500">
            계정이 없으신가요?{" "}
            <Link to="/signup" className="text-neutral-900 underline">
              회원가입하기
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
};
