import React from "react";
import { Container } from "../../shared/components/Container";

export const AccountSettingsPage: React.FC = () => (
  <Container>
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col gap-6 py-16">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">계정 설정</h1>
        <p className="text-sm text-neutral-500">
          로그인 정보와 연락처를 최신 상태로 유지해 주세요. 변경 사항은 저장 후 바로 반영됩니다.
        </p>
      </header>

      <section className="space-y-4 rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500" htmlFor="email">
            이메일
          </label>
          <input
            id="email"
            type="email"
            defaultValue="name@example.com"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2"
            disabled
          />
          <p className="text-xs text-neutral-400">이메일은 로그인 ID로 사용되며 변경할 수 없습니다.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500" htmlFor="password">
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
            <label className="text-xs font-medium text-neutral-500" htmlFor="passwordConfirm">
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

        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500" htmlFor="phone">
            연락처
          </label>
          <input
            id="phone"
            type="tel"
            className="w-full rounded-xl border border-neutral-200 px-4 py-2"
            placeholder="010-0000-0000"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="rounded-full border border-neutral-900 px-4 py-2 font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white">
            변경 사항 저장
          </button>
          <button className="rounded-full border border-neutral-200 px-4 py-2 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900">
            취소
          </button>
        </div>
      </section>
    </div>
  </Container>
);
