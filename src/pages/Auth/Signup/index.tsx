// src/pages/Auth/Signup/index.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "../../../shared/components/Container";
import { useSignUpForm } from "../../../hooks/useSignUpForm";

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  // 한글 설명: 회원가입 폼 로직을 관리하는 커스텀 훅 사용
  const {
    form,
    fieldErrors,
    generalError,
    successMessage,
    codeSent,
    sendingCode,
    cooldown,
    signingUp,
    updateField,
    sendVerificationCode,
    signUp,
  } = useSignUpForm();

  // 한글 설명: 회원가입 폼 제출 핸들러
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await signUp();

    // 한글 설명: 회원가입 성공 시 로그인 페이지로 이동
    if (response) {
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    }
  };

  // 한글 설명: 인증번호 발송 버튼 클릭 핸들러
  const handleSendCode = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    sendVerificationCode();
  };

  return (
    <Container>
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center py-16">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-neutral-900">
              MOA에 합류하세요
            </h1>
            <p className="text-sm text-neutral-500">
              이메일 인증을 통해 안전하게 계정을 만들 수 있어요
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-3xl border border-neutral-200 p-6"
          >
            {/* 한글 설명: 이름 입력 필드 */}
            <div className="space-y-2">
              <label
                className="text-xs font-medium text-neutral-500"
                htmlFor="name"
              >
                이름
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                autoComplete="name"
                placeholder="홍길동"
                disabled={signingUp}
              />
              {fieldErrors.name && (
                <p className="text-xs text-red-500">{fieldErrors.name}</p>
              )}
            </div>

            {/* 한글 설명: 이메일 입력 필드 및 인증번호 발송 버튼 */}
            <div className="space-y-2">
              <label
                className="text-xs font-medium text-neutral-500"
                htmlFor="email"
              >
                이메일
              </label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="flex-1 rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  autoComplete="email"
                  placeholder="name@example.com"
                  disabled={signingUp || sendingCode}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={
                    sendingCode ||
                    signingUp ||
                    cooldown > 0 ||
                    !form.email.trim()
                  }
                  className="whitespace-nowrap rounded-xl border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white disabled:opacity-50"
                >
                  {sendingCode
                    ? "전송 중..."
                    : cooldown > 0
                    ? `${cooldown}초`
                    : "인증번호 받기"}
                </button>
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            {/* 한글 설명: 인증번호 입력 필드 */}
            <div className="space-y-2">
              <label
                className="text-xs font-medium text-neutral-500"
                htmlFor="verificationCode"
              >
                이메일 인증번호
              </label>
              <input
                id="verificationCode"
                type="text"
                value={form.verificationCode}
                onChange={(event) => {
                  // 한글 설명: 숫자만 입력 가능, 최대 6자리
                  const value = event.target.value.replace(/\D/g, "").slice(0, 6);
                  updateField("verificationCode", value);
                }}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="6자리 인증번호"
                disabled={signingUp || !codeSent}
                maxLength={6}
              />
              {fieldErrors.verificationCode && (
                <p className="text-xs text-red-500">
                  {fieldErrors.verificationCode}
                </p>
              )}
              {codeSent && !fieldErrors.verificationCode && (
                <p className="text-xs text-green-600">
                  인증번호가 전송되었습니다. 이메일을 확인해주세요.
                </p>
              )}
            </div>

            {/* 한글 설명: 비밀번호 입력 필드 */}
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
                onChange={(event) => updateField("password", event.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                autoComplete="new-password"
                placeholder="8자 이상, 영문 대소문자와 숫자 포함"
                disabled={signingUp}
              />
              {fieldErrors.password && (
                <p className="text-xs text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            {/* 한글 설명: 성공/에러 메시지 표시 */}
            {successMessage && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-600">
                {successMessage}
              </div>
            )}

            {generalError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {generalError}
              </div>
            )}

            {/* 한글 설명: 회원가입 버튼 */}
            <button
              type="submit"
              disabled={signingUp}
              className="w-full rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white disabled:opacity-50"
            >
              {signingUp ? "가입 중..." : "회원가입"}
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
