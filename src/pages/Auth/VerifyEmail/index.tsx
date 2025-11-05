import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../../../shared/components/Container";

export const VerifyEmailPage: React.FC = () => (
  <Container>
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center gap-6 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900">이메일 인증이 필요합니다</h1>
        <p className="text-sm text-neutral-500">
          가입하신 이메일 주소로 인증 메일을 보냈습니다. 받은 편지함에서 "이메일 인증" 버튼을 눌러 주세요.
        </p>
      </div>
      <div className="rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-600">
        <ul className="list-disc space-y-2 pl-5">
          <li>메일이 보이지 않으면 스팸함을 확인해 주세요.</li>
          <li>인증 메일은 10분 동안 유효합니다. 만료되면 다시 전송해 주세요.</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <button className="rounded-full border border-neutral-900 px-4 py-2 text-neutral-900 hover:bg-neutral-900 hover:text-white">
            인증 메일 다시 보내기
          </button>
          <Link to="/" className="rounded-full border border-neutral-200 px-4 py-2 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900">
            홈으로 가기
          </Link>
        </div>
      </div>
    </div>
  </Container>
);
