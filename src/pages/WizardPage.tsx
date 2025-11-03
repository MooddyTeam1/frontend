import React, { useState } from "react";
import { Container } from "../components/primitives/Container";
import { currencyKRW } from "../utils/format";

type RewardDraft = {
  id: string;
  title: string;
  price: number;
  limitQty?: number;
};

type BasicInfo = {
  title: string;
  summary: string;
  category: string;
};

type GoalInfo = {
  goalAmount: number;
  startDate: string;
  endDate: string;
};

const steps = [1, 2, 3, 4] as const;

type Step = (typeof steps)[number];

export const WizardPage: React.FC = () => {
  const [step, setStep] = useState<Step>(1);
  const [basic, setBasic] = useState<BasicInfo>({ title: "", summary: "", category: "" });
  const [story, setStory] = useState("");
  const [goal, setGoal] = useState<GoalInfo>({ goalAmount: 0, startDate: "", endDate: "" });
  const [rewards, setRewards] = useState<RewardDraft[]>([]);

  return (
    <Container>
      <div className="mx-auto max-w-4xl space-y-12 py-16">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Creator Wizard</p>
          <h1 className="text-3xl font-semibold text-neutral-900">프로젝트 만들기</h1>
          <p className="max-w-2xl text-sm text-neutral-500">
            핵심 정보를 네 단계로 정리해보세요. 최소한의 입력으로도 간결한 프로젝트 페이지를 완성할 수 있습니다.
          </p>
        </header>

        <div className="flex flex-wrap gap-3 text-sm">
          {steps.map((value) => (
            <button
              key={value}
              onClick={() => setStep(value)}
              className={`rounded-full px-4 py-1 ${
                step === value
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
              }`}
            >
              Step {value}
            </button>
          ))}
        </div>

        {step === 1 && (
          <section className="space-y-4 rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-sm font-medium text-neutral-900">기본 정보</h2>
            <input
              placeholder="프로젝트 제목"
              value={basic.title}
              onChange={(event) => setBasic({ ...basic, title: event.target.value })}
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700"
            />
            <input
              placeholder="프로젝트 요약"
              value={basic.summary}
              onChange={(event) => setBasic({ ...basic, summary: event.target.value })}
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700"
            />
            <input
              placeholder="카테고리"
              value={basic.category}
              onChange={(event) => setBasic({ ...basic, category: event.target.value })}
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                다음 단계
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4 rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-sm font-medium text-neutral-900">스토리</h2>
            <textarea
              rows={8}
              placeholder="# 프로젝트의 이야기를 들려주세요"
              value={story}
              onChange={(event) => setStory(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700"
            />
            <div className="space-y-2 rounded-2xl border border-neutral-200 p-4 text-sm text-neutral-500">
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">미리보기</span>
              <div className="prose max-w-none text-neutral-700">{story || "(내용 없음)"}</div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep(1)}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
              >
                이전
              </button>
              <button
                onClick={() => setStep(3)}
                className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                다음 단계
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4 rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-sm font-medium text-neutral-900">목표 및 일정</h2>
            <input
              type="number"
              placeholder="목표 금액 (원)"
              value={goal.goalAmount}
              onChange={(event) =>
                setGoal({ ...goal, goalAmount: Number.parseInt(event.target.value || "0", 10) })
              }
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="date"
                placeholder="시작일"
                value={goal.startDate}
                onChange={(event) => setGoal({ ...goal, startDate: event.target.value })}
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700"
              />
              <input
                type="date"
                placeholder="종료일"
                value={goal.endDate}
                onChange={(event) => setGoal({ ...goal, endDate: event.target.value })}
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep(2)}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
              >
                이전
              </button>
              <button
                onClick={() => setStep(4)}
                className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                다음 단계
              </button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-5 rounded-3xl border border-neutral-200 p-6">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-neutral-900">리워드 구성</h2>
              <p className="text-xs text-neutral-500">
                리워드는 최소한의 옵션만으로 단순하게 유지하세요. 아래에서 간단히 추가할 수 있습니다.
              </p>
            </div>
            <RewardCreator rewards={rewards} setRewards={setRewards} />
            <div className="flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
              >
                이전
              </button>
              <button
                onClick={() => alert("DRAFT 저장 → REVIEW 제출 (모의)")}
                className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                검토 요청 제출
              </button>
            </div>
          </section>
        )}
      </div>
    </Container>
  );
};

const RewardCreator: React.FC<{
  rewards: RewardDraft[];
  setRewards: (items: RewardDraft[]) => void;
}> = ({ rewards, setRewards }) => {
  const [form, setForm] = useState({ title: "", price: 0, limitQty: 0 });

  const addReward = () => {
    if (!form.title || form.price <= 0) {
      alert("제목과 가격을 확인해주세요.");
      return;
    }

    setRewards([
      ...rewards,
      {
        id: `r${rewards.length + 1}`,
        title: form.title,
        price: form.price,
        limitQty: form.limitQty || undefined,
      },
    ]);

    setForm({ title: "", price: 0, limitQty: 0 });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          placeholder="리워드 제목"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700"
        />
        <input
          type="number"
          placeholder="가격"
          value={form.price}
          onChange={(event) =>
            setForm({ ...form, price: Number.parseInt(event.target.value || "0", 10) })
          }
          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700"
        />
        <input
          type="number"
          placeholder="제한 수량"
          value={form.limitQty}
          onChange={(event) =>
            setForm({ ...form, limitQty: Number.parseInt(event.target.value || "0", 10) })
          }
          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700"
        />
      </div>
      <button
        onClick={addReward}
        className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
      >
        리워드 추가
      </button>
      {rewards.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {rewards.map((reward) => (
            <div key={reward.id} className="rounded-2xl border border-neutral-200 p-4 text-sm">
              <div className="font-medium text-neutral-900">{reward.title}</div>
              <div className="text-neutral-500">{currencyKRW(reward.price)}</div>
              {reward.limitQty ? (
                <div className="text-xs text-neutral-400">제한 수량 {reward.limitQty}개</div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
