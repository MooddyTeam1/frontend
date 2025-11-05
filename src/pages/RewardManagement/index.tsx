import React from "react";
import { Container } from "../../shared/components/Container";
import { RewardOptionEditor } from "../../features/creator/components/RewardOptionEditor";

import {
  createDefaultRewardOptionConfig,
  type RewardFormState,
} from "../../features/creator/utils/rewardOptions";

export const RewardManagementPage: React.FC = () => {
  const [reward, setReward] = React.useState<RewardFormState>({
    title: "스탠다드 세트",
    price: 59_000,
    limitQty: 1000,
    estShippingMonth: "2026-04",
    optionConfig: createDefaultRewardOptionConfig(),
  });

  return (
    <Container>
      <div className="space-y-8 py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900">
            리워드 관리
          </h1>
          <p className="text-sm text-neutral-500">
            리워드 금액, 재고, 옵션 구성을 정리해 서포터에게 명확한 선택지를
            제공하세요.
          </p>
        </header>

        <section className="space-y-4 rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-xs font-medium text-neutral-500"
                htmlFor="title"
              >
                리워드 이름
              </label>
              <input
                id="title"
                value={reward.title}
                onChange={(event) =>
                  setReward({ ...reward, title: event.target.value })
                }
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-xs font-medium text-neutral-500"
                htmlFor="price"
              >
                금액 (원)
              </label>
              <input
                id="price"
                type="number"
                value={reward.price}
                onChange={(event) =>
                  setReward({ ...reward, price: Number(event.target.value) })
                }
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-xs font-medium text-neutral-500"
                htmlFor="limit"
              >
                제한 수량 (선택)
              </label>
              <input
                id="limit"
                type="number"
                value={reward.limitQty ?? ""}
                onChange={(event) =>
                  setReward({
                    ...reward,
                    limitQty:
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                  })
                }
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-xs font-medium text-neutral-500"
                htmlFor="estShipping"
              >
                예상 배송 월
              </label>
              <input
                id="estShipping"
                type="month"
                value={reward.estShippingMonth ?? ""}
                onChange={(event) =>
                  setReward({ ...reward, estShippingMonth: event.target.value })
                }
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
              />
            </div>
          </div>
        </section>

        <RewardOptionEditor
          value={reward.optionConfig}
          onChange={(optionConfig) => setReward({ ...reward, optionConfig })}
        />
      </div>
    </Container>
  );
};
