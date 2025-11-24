import React from "react";
import { StoryEditor } from "../StoryEditor";

type StoryStepProps = {
  story: string;
  onChange: (value: string) => void;
};

export const StoryStep: React.FC<StoryStepProps> = ({ story, onChange }) => (
  <section className="space-y-6 rounded-3xl border border-neutral-200 p-6">
    <div className="space-y-4">
      <p className="text-sm font-medium text-neutral-900">스토리 작성</p>
      <StoryEditor value={story} onChange={onChange} maxChars={20000} />
      <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-xs text-neutral-500">
        <p className="font-semibold text-neutral-900">Tip</p>
        <ul className="mt-2 space-y-1 list-disc pl-5">
          <li>
            Markdown을 지원하니 제목(#), 목록(-), 강조(**)를 활용해 구조를
            잡아보세요.
          </li>
          <li>
            이미지는 드래그하거나 붙여넣어도 업로드됩니다. 5MB 이하 파일을
            권장합니다.
          </li>
          <li>
            스토리는 신뢰를 좌우하는 영역입니다. 제작 배경과 위험 요소를
            구체적으로 소개해 주세요.
          </li>
        </ul>
      </div>
    </div>
  </section>
);
