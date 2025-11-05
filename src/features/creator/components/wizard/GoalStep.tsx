import React from "react";
import type { GoalState } from "../../../hooks/useCreatorWizard";
import { currencyKRW } from "../../../../shared/utils/format";

type GoalStepProps = {
  goal: GoalState;
  averageRewardPrice: number;
  estimatedBackersNeeded: number;
  fundingDuration: number | null;
  onChange: (field: keyof GoalState, value: string | number) => void;
};

export const GoalStep: React.FC<GoalStepProps> = ({
  goal,
  averageRewardPrice,
  estimatedBackersNeeded,
  fundingDuration,
  onChange,
}) => {
  return (
    <section className="space-y-6 rounded-3xl border border-neutral-200 p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              className="text-xs font-medium text-neutral-500"
              htmlFor="wizard-goal-amount"
            >
              목표 금액
            </label>
            <div className="flex items-center gap-2">
              <input
                id="wizard-goal-amount"
                type="number"
                min={0}
                value={goal.goalAmount || ""}
                onChange={(event) =>
                  onChange("goalAmount", Number(event.target.value) || 0)
                }
                placeholder="예: 3000000"
                className="flex-1 rounded-xl border border-neutral-200 px-4 py-2 text-sm"
              />
              <span className="whitespace-nowrap text-xs text-neutral-500">
                원
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              제작 비용, 마케팅 비용, 플랫폼 수수료를 모두 고려해 현실적인 목표
              금액을 설정해 주세요.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-xs font-medium text-neutral-500"
                htmlFor="wizard-start-date"
              >
                진행 시작일
              </label>
              <input
                id="wizard-start-date"
                type="date"
                value={goal.startDate}
                onChange={(event) => onChange("startDate", event.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-xs font-medium text-neutral-500"
                htmlFor="wizard-end-date"
              >
                진행 종료일
              </label>
              <input
                id="wizard-end-date"
                type="date"
                value={goal.endDate}
                onChange={(event) => onChange("endDate", event.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-xs text-neutral-600">
          <p className="text-sm font-semibold text-neutral-900">
            목표 설정 가이드
          </p>

          <div className="rounded-xl bg-white p-3">
            <p className="text-[11px] font-medium text-neutral-500">
              현재 리워드 평균 금액
            </p>
            <p className="mt-1 text-sm font-semibold text-neutral-900">
              {averageRewardPrice > 0
                ? currencyKRW(averageRewardPrice)
                : "리워드 금액을 먼저 입력해 주세요."}
            </p>
          </div>

          <div className="rounded-xl bg-white p-3">
            <p className="text-[11px] font-medium text-neutral-500">
              목표 달성을 위한 예상 서포터 수
            </p>
            <p className="mt-1 text-sm font-semibold text-neutral-900">
              {goal.goalAmount > 0 && estimatedBackersNeeded > 0
                ? `${estimatedBackersNeeded.toLocaleString()}명 정도`
                : "목표 금액과 리워드 금액을 입력하면 자동으로 계산돼요."}
            </p>
          </div>

          <div className="rounded-xl bg-white p-3">
            <p className="text-[11px] font-medium text-neutral-500">
              펀딩 기간
            </p>
            <p className="mt-1 text-sm font-semibold text-neutral-900">
              {fundingDuration
                ? `${fundingDuration}일`
                : "시작일과 종료일을 선택해 주세요."}
            </p>
          </div>

          <ul className="mt-2 space-y-1 list-disc pl-4">
            <li>보통 14~30일 사이의 펀딩 기간을 추천해요.</li>
            <li>
              기간이 너무 길면 긴장감이 떨어지고, 너무 짧으면 노출이 부족할 수
              있어요.
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
};
