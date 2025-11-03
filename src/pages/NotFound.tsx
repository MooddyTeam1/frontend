import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/primitives/Container";

export const NotFound: React.FC = () => (
  <Container>
    <div className="flex flex-col items-center gap-4 py-32 text-center">
      <span className="text-xs uppercase tracking-[0.3em] text-neutral-400">404</span>
      <h1 className="text-3xl font-semibold text-neutral-900">페이지를 찾을 수 없습니다.</h1>
      <p className="text-sm text-neutral-500">
        주소가 올바른지 확인한 후 다시 시도해주세요. 홈으로 돌아가 다른 프로젝트를 확인하실 수 있습니다.
      </p>
      <Link
        to="/"
        className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
      >
        홈으로 이동
      </Link>
    </div>
  </Container>
);
