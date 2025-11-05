import React from "react";
import { StoryEditor } from "../StoryEditor";

type StoryStepProps = {
  story: string;
  onChange: (value: string) => void;
};

export const StoryStep: React.FC<StoryStepProps> = ({ story, onChange }) => (
  <section className="space-y-6 rounded-3xl border border-neutral-200 p-6">
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <p className="text-sm font-medium text-neutral-900">스토리 작성</p>
        <StoryEditor value={story} onChange={onChange} maxChars={20000} />
        <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-xs text-neutral-500">
          <p className="font-semibold text-neutral-900">Tip</p>
          <ul className="mt-2 space-y-1 list-disc pl-5">
            <li>Markdown을 지원하니 제목(#), 목록(-), 강조(**)를 활용해 구조를 잡아보세요.</li>
            <li>이미지는 드래그하거나 붙여넣어도 업로드됩니다. 5MB 이하 파일을 권장합니다.</li>
            <li>스토리는 신뢰를 좌우하는 영역입니다. 제작 배경과 위험 요소를 구체적으로 소개해 주세요.</li>
          </ul>
        </div>
      </div>
      <aside className="space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
        <p className="text-sm font-semibold text-neutral-900">스토리 구성 가이드</p>
        <ul className="space-y-3 text-xs text-neutral-600">
          <li>
            <span className="font-medium text-neutral-900">1. 왜 이 프로젝트인가요?</span>
            <br />
            문제의식과 아이디어가 탄생한 배경을 설명해주세요.
          </li>
          <li>
            <span className="font-medium text-neutral-900">2. 무엇을 제공하나요?</span>
            <br />
            리워드 구성과 핵심 스펙, 차별점을 구체적으로 적어주세요.
          </li>
          <li>
            <span className="font-medium text-neutral-900">3. 어떻게 만들고 전달하나요?</span>
            <br />
            제작 일정, 검수 절차, 배송 계획을 단계별로 안내하면 신뢰도가 높아집니다.
          </li>
          <li>
            <span className="font-medium text-neutral-900">4. 위험 요소와 대응</span>
            <br />
            예상 가능한 리스크와 대응 방안을 함께 안내하세요.
          </li>
        </ul>
      </aside>
    </div>
  </section>
);
