import React from "react";
import type { RewardResponseDTO } from "../types";
import { currencyKRW } from "../../../shared/utils/format";

type RewardCardProps = {
  reward: RewardResponseDTO;
  onSelect?: (rewardId: string) => void;
};

export const RewardCard: React.FC<RewardCardProps> = ({ reward, onSelect }) => (
  <div
    className={`flex flex-col gap-4 rounded-2xl border border-neutral-200 p-5 ${
      reward.available ? "" : "opacity-60"
    }`}
  >
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold text-neutral-900">{reward.title}</h4>
      {!reward.available && <span className="text-xs text-neutral-500">소진</span>}
    </div>
    <div className="text-lg font-semibold text-neutral-900">
      {currencyKRW(reward.price)}
    </div>
    {reward.description ? (
      <p className="text-sm text-neutral-500">{reward.description}</p>
    ) : null}
    <div className="flex items-center justify-between text-xs text-neutral-500">
      <span>예상 배송 {reward.estShippingMonth ?? "-"}</span>
      {reward.limitQty ? (
        <span>
          남은 수량 {reward.remainingQty ?? reward.limitQty}
        </span>
      ) : null}
    </div>
    <button
      disabled={!reward.available}
      onClick={() => onSelect?.(reward.id)}
      className={`rounded-full border px-4 py-2 text-sm font-medium ${
        reward.available
          ? "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
          : "border-neutral-200 text-neutral-400"
      }`}
    >
      선택
    </button>
  </div>
);
