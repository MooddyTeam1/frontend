// src/hooks/useSignUpForm.ts
import { useState, useEffect } from "react";
import { z } from "zod";
import { authService } from "../features/auth/api/authService";
import { extractErrorMessage } from "../services/api";

// 한글 설명: 회원가입 폼 입력 검증 스키마
const signupSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해 주세요")
    .max(50, "이름은 50자 이하여야 합니다"),
  email: z.string().email("올바른 이메일 형식이 아닙니다"),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "비밀번호는 영문 대소문자와 숫자를 포함해야 합니다"
    ),
  verificationCode: z
    .string()
    .min(6, "인증번호는 6자리여야 합니다")
    .max(6, "인증번호는 6자리여야 합니다")
    .regex(/^\d+$/, "인증번호는 숫자만 입력 가능합니다"),
});

// 한글 설명: 이메일 입력 검증 스키마 (인증번호 발송용)
const emailSchema = z.string().email("올바른 이메일 형식이 아닙니다");

// 한글 설명: 회원가입 폼 상태 타입
export interface SignUpFormState {
  name: string;
  email: string;
  password: string;
  verificationCode: string;
}

// 한글 설명: 회원가입 폼 에러 타입
export interface SignUpFormErrors {
  name?: string;
  email?: string;
  password?: string;
  verificationCode?: string;
}

// 한글 설명: 회원가입 폼 상태와 유효성 검증을 관리하는 커스텀 훅
export const useSignUpForm = () => {
  // 한글 설명: 폼 입력 상태
  const [form, setForm] = useState<SignUpFormState>({
    name: "",
    email: "",
    password: "",
    verificationCode: "",
  });

  // 한글 설명: 필드별 에러 메시지
  const [fieldErrors, setFieldErrors] = useState<SignUpFormErrors>({});

  // 한글 설명: 서버 응답 에러 메시지
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 한글 설명: 인증번호 발송 관련 상태
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // 한글 설명: 회원가입 요청 로딩 상태
  const [signingUp, setSigningUp] = useState(false);

  // 한글 설명: 쿨다운 타이머 관리 (60초)
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // 한글 설명: 폼 필드 업데이트 함수
  const updateField = (field: keyof SignUpFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // 한글 설명: 이메일 변경 시 인증번호 발송 상태 초기화
    if (field === "email" && codeSent) {
      setCodeSent(false);
      setCooldown(0);
      setForm((prev) => ({ ...prev, verificationCode: "" }));
    }

    // 한글 설명: 필드 변경 시 해당 필드의 에러 메시지 제거
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 한글 설명: 인증번호 발송 요청
  const sendVerificationCode = async () => {
    setGeneralError(null);
    setSuccessMessage(null);
    setFieldErrors({});

    // 한글 설명: 이메일 유효성 검사
    const emailResult = emailSchema.safeParse(form.email);
    if (!emailResult.success) {
      setFieldErrors({
        email: emailResult.error.issues[0]?.message || "이메일을 확인해 주세요",
      });
      return;
    }

    setSendingCode(true);
    try {
      await authService.sendEmailVerification(emailResult.data);
      setCodeSent(true);
      setSuccessMessage("인증번호를 전송했습니다.");
      setCooldown(60); // 한글 설명: 60초 쿨다운
      setFieldErrors({});
    } catch (error) {
      setGeneralError(extractErrorMessage(error));
    } finally {
      setSendingCode(false);
    }
  };

  // 한글 설명: 회원가입 요청
  const signUp = async (): Promise<{ id: number; email: string; name: string } | null> => {
    setGeneralError(null);
    setSuccessMessage(null);
    setFieldErrors({});

    // 한글 설명: 폼 전체 유효성 검사
    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setFieldErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        verificationCode: fieldErrors.verificationCode?.[0],
      });
      return null;
    }

    // 한글 설명: 인증번호가 발송되지 않았으면 에러 표시
    if (!codeSent) {
      setFieldErrors({
        verificationCode: "먼저 인증번호를 받아주세요",
      });
      return null;
    }

    setSigningUp(true);
    try {
      // 한글 설명: 회원가입 API 호출 (인증번호 검증은 백엔드에서 처리)
      const response = await authService.signUp({
        email: result.data.email,
        password: result.data.password,
        name: result.data.name,
        verificationCode: result.data.verificationCode,
      });

      setSuccessMessage("회원가입이 완료되었습니다.");
      return response;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setGeneralError(errorMessage);

      // 한글 설명: 인증번호 관련 에러인 경우 인증번호 필드에 표시
      if (
        errorMessage.includes("인증번호") ||
        errorMessage.includes("인증") ||
        errorMessage.includes("코드")
      ) {
        setFieldErrors({
          verificationCode: errorMessage,
        });
      }

      return null;
    } finally {
      setSigningUp(false);
    }
  };

  // 한글 설명: 폼 초기화 함수
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      verificationCode: "",
    });
    setFieldErrors({});
    setGeneralError(null);
    setSuccessMessage(null);
    setCodeSent(false);
    setCooldown(0);
  };

  return {
    // 한글 설명: 폼 상태
    form,
    fieldErrors,
    generalError,
    successMessage,
    codeSent,
    sendingCode,
    cooldown,
    signingUp,

    // 한글 설명: 액션 함수
    updateField,
    sendVerificationCode,
    signUp,
    resetForm,
  };
};

