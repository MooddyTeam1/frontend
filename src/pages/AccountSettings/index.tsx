import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import {
  getSupporterOnboardingData,
  saveSupporterOnboardingStep2,
} from "../../features/onboarding/api/supporterOnboardingApi";
import type { NotificationPreference } from "../../features/onboarding/types/supporterOnboarding";
import { NOTIFICATION_PREFERENCE_OPTIONS } from "../../features/onboarding/types/supporterOnboarding";

export const AccountSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  // 한글 설명: 알림 설정 상태
  const [notificationPreference, setNotificationPreference] = useState<
    NotificationPreference | undefined
  >(undefined);
  const [loadingNotification, setLoadingNotification] = useState(false);
  const [savingNotification, setSavingNotification] = useState(false);

  // 한글 설명: 저장 버튼 클릭 핸들러
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      // TODO: 실제 비밀번호 변경 API 호출
      // const password = (event.currentTarget.querySelector('#password') as HTMLInputElement)?.value;
      // const passwordConfirm = (event.currentTarget.querySelector('#passwordConfirm') as HTMLInputElement)?.value;
      // await changePassword({ password, passwordConfirm });

      // 한글 설명: 저장 성공 시 프로필 페이지로 이동 (0.5초 후)
      setTimeout(() => {
        navigate("/profile/supporter");
      }, 500);
    } catch (error) {
      console.error("비밀번호 변경 실패", error);
      alert("비밀번호 변경 중 문제가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // 한글 설명: 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    navigate("/profile/supporter");
  };

  // 한글 설명: 알림 설정 조회
  React.useEffect(() => {
    const loadNotificationPreference = async () => {
      try {
        setLoadingNotification(true);
        const data = await getSupporterOnboardingData();
        setNotificationPreference(data.notificationPreference);
      } catch (error) {
        console.error("알림 설정 조회 실패", error);
        // 한글 설명: 에러 발생 시 기본값 유지
      } finally {
        setLoadingNotification(false);
      }
    };

    loadNotificationPreference();
  }, []);

  // 한글 설명: 알림 설정 저장 핸들러
  const handleSaveNotification = async () => {
    try {
      setSavingNotification(true);
      // 한글 설명: Step2 API를 사용하되 알림설정만 업데이트
      await saveSupporterOnboardingStep2({
        notificationPreference,
      });
      alert("알림 설정이 저장되었습니다.");
    } catch (error) {
      console.error("알림 설정 저장 실패", error);
      alert(
        error instanceof Error
          ? error.message
          : "알림 설정 저장 중 문제가 발생했습니다."
      );
    } finally {
      setSavingNotification(false);
    }
  };

  return (
    <Container>
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col gap-6 py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900">계정 설정</h1>
          <p className="text-sm text-neutral-500">
            로그인 정보와 연락처를 최신 상태로 유지해 주세요. 변경 사항은 저장
            후 바로 반영됩니다.
          </p>
        </header>

        <section className="space-y-4 rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                defaultValue="name@example.com"
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                disabled
              />
              <p className="text-xs text-neutral-400">
                이메일은 로그인 ID로 사용되며 변경할 수 없습니다.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  className="text-xs font-medium text-neutral-500"
                  htmlFor="password"
                >
                  새 비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  placeholder="8자 이상 입력"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-xs font-medium text-neutral-500"
                  htmlFor="passwordConfirm"
                >
                  비밀번호 확인
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  placeholder="한 번 더 입력"
                />
              </div>
            </div>

            <div className="space-y-2"></div>

            {/* 한글 설명: 알림 설정 섹션 */}
            <div className="space-y-4 border-t border-neutral-200 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500">
                  알림 설정
                </label>
                <p className="text-xs text-neutral-400">
                  받고 싶은 알림 유형을 선택해 주세요.
                </p>
                <div className="flex flex-wrap gap-2">
                  {NOTIFICATION_PREFERENCE_OPTIONS.map((option) => {
                    const isSelected = notificationPreference === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setNotificationPreference(option.value)}
                        disabled={loadingNotification}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          isSelected
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveNotification}
                disabled={savingNotification || loadingNotification}
                className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingNotification ? "저장 중..." : "알림 설정 저장"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full border border-neutral-900 px-4 py-2 font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white disabled:opacity-60"
              >
                {submitting ? "저장 중..." : "변경 사항 저장"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-full border border-neutral-200 px-4 py-2 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
              >
                취소
              </button>
            </div>
          </form>
        </section>
      </div>
    </Container>
  );
};
