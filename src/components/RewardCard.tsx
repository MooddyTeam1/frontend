import React from "react";
import type { Reward } from "../utils/mock";
import { currencyKRW } from "../utils/format";

export const RewardCard: React.FC<{
  r: Reward;
  onSelect?: (rId: string) => void;
}> = ({ r, onSelect }) => (
  <div
    className={`flex flex-col gap-4 rounded-2xl border border-neutral-200 p-5 ${
      r.available ? "" : "opacity-60"
    }`}
  >
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold text-neutral-900">{r.title}</h4>
      {!r.available && <span className="text-xs text-neutral-500">소진</span>}
    </div>
    <div className="text-lg font-semibold text-neutral-900">
      {currencyKRW(r.price)}
    </div>
    {r.description ? (
      <p className="text-sm text-neutral-500">{r.description}</p>
    ) : null}
    <div className="flex items-center justify-between text-xs text-neutral-500">
      <span>예정보송 {r.estShippingMonth ?? "-"}</span>
      {r.limitQty ? (
        <span>
          {r.soldQty}/{r.limitQty}
        </span>
      ) : null}
    </div>
    <button
      disabled={!r.available}
      onClick={() => onSelect?.(r.id)}
      className={`rounded-full border px-4 py-2 text-sm font-medium ${
        r.available
          ? "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
          : "border-neutral-200 text-neutral-400"
      }`}
    >
      선택
    </button>
  </div>
);
