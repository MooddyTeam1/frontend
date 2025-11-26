// 한글 설명: 메이커 스토리 섹션 컴포넌트
import React from "react";
import { Link } from "react-router-dom";

export const MakerStorySection: React.FC = () => {
  // 한글 설명: TODO - 실제 스토리 데이터는 백엔드 API에서 가져올 예정
  const stories = [
    {
      id: 1,
      type: "interview",
      title: "[지오트레일 스마트 백팩]은 왜 만들게 되었나요?",
      summary:
        "메이커 인터뷰 3줄 요약 - 첫 도전, 목표의 230%를 달성하기까지",
      imageUrl: null, // 한글 설명: 추후 이미지 추가
    },
    {
      id: 2,
      type: "testimonial",
      title: "첫 도전, 목표의 230%를 달성하기까지",
      summary: "후원자 반응 요약 - 실제 후원자들의 생생한 후기",
      imageUrl: null, // 한글 설명: 추후 이미지 추가
    },
  ];

  return (
    <section className="border-t border-neutral-200/50 bg-gradient-to-br from-white via-neutral-50 to-neutral-100/50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-2 flex items-center gap-2 text-2xl font-semibold text-neutral-900">
            <span className="text-2xl">🎤</span>
            <span>메이커의 이야기</span>
          </h2>
          <p className="text-sm text-neutral-600">
            실제 메이커들의 도전 스토리와 후원자들의 생생한 후기를 만나보세요.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {stories.map((story) => (
            <Link
              key={story.id}
              to={`/stories/${story.id}`}
              className="group flex flex-col gap-4 rounded-2xl border border-neutral-200/50 bg-gradient-to-br from-white via-neutral-50/50 to-white p-6 shadow-md transition-all hover:border-neutral-400 hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                {story.imageUrl ? (
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-neutral-100" />
                )}
                <div className="flex-1 space-y-2">
                  <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                    {story.type === "interview" ? "메이커 인터뷰" : "후원자 후기"}
                  </span>
                  <h3 className="text-base font-semibold leading-tight text-neutral-900 group-hover:text-neutral-700">
                    {story.title}
                  </h3>
                  <p className="text-sm text-neutral-600">{story.summary}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

