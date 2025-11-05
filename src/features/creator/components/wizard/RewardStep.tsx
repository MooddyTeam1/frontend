import React from "react";
import type { DraftReward } from "../../hooks/useCreatorWizard";
import { RewardOptionEditor } from "../RewardOptionEditor";
import { currencyKRW } from "../../../../shared/utils/format";

type RewardStepProps = {
  rewards: DraftReward[];
  onAddReward: () => void;
  onChangeReward: (id: string, patch: Partial<DraftReward>) => void;
  onRemoveReward: (id: string) => void;
};

export const RewardStep: React.FC<RewardStepProps> = ({
  rewards,
  onAddReward,
  onChangeReward,
  onRemoveReward,
}) => {
  return (
    <section className="space-y-6 rounded-3xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-neutral-900">리워드 구성</p>
          <p className="text-xs text-neutral-500">
            서포터가 선택할 수 있는 리워드를 설계하고, 옵션과 재고를 설정해
            주세요.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddReward}
          className="rounded-full border border-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-900 hover:text-white"
        >
          + 리워드 추가
        </button>
      </div>

      <div className="space-y-4">
        {rewards.map((reward, index) => (
          <RewardItemEditor
            key={reward.id}
            index={index}
            reward={reward}
            onChange={(patch) => onChangeReward(reward.id, patch)}
            onRemove={() => onRemoveReward(reward.id)}
          />
        ))}

        {rewards.length === 0 && (
          <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-xs text-neutral-500">
            리워드를 추가해 주세요. 최소 1개 이상의 리워드가 필요합니다.
          </div>
        )}
      </div>
    </section>
  );
};

type RewardItemEditorProps = {
  index: number;
  reward: DraftReward;
  onChange: (next: DraftReward) => void;
  onRemove: () => void;
};

const RewardItemEditor: React.FC<RewardItemEditorProps> = ({
  index,
  reward,
  onChange,
  onRemove,
}) => {
  const handleChange =
    (field: keyof DraftReward) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | number
        | boolean
    ) => {
      if (typeof event === "number" || typeof event === "boolean") {
        onChange({ ...reward, [field]: event });
        return;
      }

      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      let value: string | number | boolean = target.value;

      if (field === "price" || field === "limitQty") {
        value = target.value ? Number(target.value) || 0 : 0;
      }

      onChange({ ...reward, [field]: value });
    };

  return (
    <div className="space-y-4 rounded-3xl border border-neutral-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-neutral-500">
            리워드 {index + 1}
          </p>
          <input
            value={reward.title}
            onChange={handleChange("title")}
            placeholder="예: 얼리버드 세트 (30% 한정 할인)"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-neutral-400 hover:text-red-500"
        >
          제거
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[2fr_minmax(0,1fr)]">
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">
            리워드 설명
          </label>
          <textarea
            rows={3}
            value={reward.description}
            onChange={handleChange("description")}
            placeholder="서포터가 받게 될 상품/서비스 구성과 특징을 상세히 설명해 주세요."
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">금액</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={reward.price || ""}
                onChange={handleChange("price")}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
              />
              <span className="whitespace-nowrap text-[11px] text-neutral-500">
                원
              </span>
            </div>
            {reward.price > 0 && (
              <p className="text-[11px] text-neutral-400">
                {currencyKRW(reward.price)} 후원 시 제공되는 구성입니다.
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">
              수량 제한
            </label>
            <input
              type="number"
              min={0}
              value={reward.limitQty ?? ""}
              onChange={handleChange("limitQty")}
              placeholder="제한이 없다면 비워두세요."
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">
              예상 발송 월
            </label>
            <input
              type="month"
              value={reward.estShippingMonth ?? ""}
              onChange={handleChange("estShippingMonth")}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-xs text-neutral-500">판매 상태</span>
            <button
              type="button"
              onClick={() =>
                onChange({ ...reward, available: !reward.available })
              }
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                reward.available
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {reward.available ? "판매 중" : "일시 중단"}
            </button>
          </div>
        </div>
      </div>

      <RewardOptionEditor
        value={reward.optionConfig}
        onChange={(optionConfig) => onChange({ ...reward, optionConfig })}
      />
    </div>
  );
};
