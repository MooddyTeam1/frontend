// 한글 설명: 어떻게 작동하나요 섹션 컴포넌트
import React from "react";

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="border-t border-neutral-200/50 bg-gradient-to-br from-neutral-100 via-white to-neutral-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold text-neutral-900">
            MOA는 이렇게 작동해요
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* 한글 설명: 메이커 관점 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-900">
              👨‍💻 메이커 관점
            </h3>
            <div className="space-y-4">
              <div className="rounded-xl border border-neutral-200/50 bg-gradient-to-br from-white via-neutral-50/50 to-white p-6 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 text-sm font-semibold text-white shadow-md">
                    1
                  </span>
                  <h4 className="font-semibold text-neutral-900">
                    프로젝트 초안 작성
                  </h4>
                </div>
                <p className="text-sm text-neutral-600">
                  아이디어, 목표 금액, 리워드 구성을 간단히 적어 제출해요.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200/50 bg-gradient-to-br from-white via-neutral-50/50 to-white p-6 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                    2
                  </span>
                  <h4 className="font-semibold text-neutral-900">
                    검토 & 피드백
                  </h4>
                </div>
                <p className="text-sm text-neutral-600">
                  심사·리뷰를 거쳐, 더 매력적으로 보이도록 가이드를 드려요.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200/50 bg-gradient-to-br from-white via-neutral-50/50 to-white p-6 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                    3
                  </span>
                  <h4 className="font-semibold text-neutral-900">
                    공개 & 데이터 리포트
                  </h4>
                </div>
                <p className="text-sm text-neutral-600">
                  펀딩 진행 상황과 서포터 데이터를 대시보드에서 실시간으로
                  확인해요.
                </p>
              </div>
            </div>
          </div>

          {/* 한글 설명: 서포터 관점 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-900">
              👥 서포터 관점
            </h3>
            <div className="space-y-4">
              <div className="rounded-xl border border-neutral-200/50 bg-gradient-to-br from-white via-neutral-50/50 to-white p-6 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 text-sm font-semibold text-white shadow-md">
                    1
                  </span>
                  <h4 className="font-semibold text-neutral-900">
                    마음에 드는 프로젝트 발견
                  </h4>
                </div>
                <p className="text-sm text-neutral-600">
                  큐레이션된 프로젝트 목록에서 관심 있는 아이디어를 찾아요.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200/50 bg-gradient-to-br from-white via-neutral-50/50 to-white p-6 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                    2
                  </span>
                  <h4 className="font-semibold text-neutral-900">
                    리워드 선택 후 안전한 결제
                  </h4>
                </div>
                <p className="text-sm text-neutral-600">
                  원하는 리워드를 선택하고 안전하게 결제해요.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200/50 bg-gradient-to-br from-white via-neutral-50/50 to-white p-6 shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                    3
                  </span>
                  <h4 className="font-semibold text-neutral-900">
                    제작 및 배송 일정, 진행 상황 알림
                  </h4>
                </div>
                <p className="text-sm text-neutral-600">
                  프로젝트 진행 상황과 배송 일정을 실시간으로 확인해요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
