import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Container } from "../../../shared/components/Container";
import { useAuth } from "../../../features/auth/contexts/AuthContext";

const schema = z
  .object({
    name: z.string().min(2, "이름은 2자 이상 입력해 주세요"),
    email: z.string().email("이메일을 확인해 주세요"),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof typeof form, string>>
  >({});
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null);
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await signup(result.data);
      navigate("/", { replace: true });
    } catch (error) {
      setGeneralError(
        error instanceof Error ? error.message : "회원가입에 실패했습니다"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center py-16">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-neutral-900">
              FUNDIT에 합류하세요
            </h1>
            <p className="text-sm text-neutral-500">
              이름과 이메일만으로 간단히 계정을 만들 수 있어요. 가입 후 언제든
              프로젝트를 후원하거나 개설할 수 있습니다.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-3xl border border-neutral-200 p-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  className="text-xs font-medium text-neutral-500"
                  htmlFor="name"
                >
                  이름
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
                  autoComplete="name"
                  placeholder="홍길동"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
                  autoComplete="new-password"
                  placeholder="8자 이상 비밀번호"
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
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
                  placeholder="비밀번호 재입력"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
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
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <p className="text-center text-xs text-neutral-500">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-neutral-900 underline">
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
};
