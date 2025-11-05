import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { useQuery } from "../../shared/hooks/useQuery";
import { currencyKRW } from "../../shared/utils/format";
import { mockProjects } from "../../features/projects/data/mockProjects";

type Step = "reward" | "shipping" | "payment";

const steps: Array<{ key: Step; label: string }> = [
  { key: "reward", label: "리워드" },
  { key: "shipping", label: "배송" },
  { key: "payment", label: "결제" },
];

export const PledgePage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const query = useQuery();
  const project = mockProjects.find((candidate) => candidate.slug === slug);

  const [activeStep, setActiveStep] = useState<Step>("reward");
  const [rewardId, setRewardId] = useState<string | null>(query.get("reward"));
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState({ name: "", phone: "", address1: "" });
  const [gateway, setGateway] = useState("portone");

  const reward = useMemo(
    () => project?.rewards.find((item) => item.id === rewardId) || project?.rewards[0],
    [project, rewardId]
  );

  const amount = reward ? reward.price * quantity : 0;

  if (!project) {
    return (
      <Container>
        <div className="py-24 text-center text-sm text-neutral-500">
          프로젝트를 찾을 수 없습니다.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mx-auto max-w-4xl space-y-10 py-16">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Checkout</p>
          <h1 className="text-3xl font-semibold text-neutral-900">{project.title}</h1>
        </header>

        <div className="flex flex-wrap gap-3 text-sm">
          {steps.map((step) => (
            <button
              key={step.key}
              onClick={() => setActiveStep(step.key)}
              className={`rounded-full px-4 py-1 ${
                activeStep === step.key
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(240px,1fr)]">
          <div className="space-y-6">
            {activeStep === "reward" && (
              <section className="space-y-5 rounded-3xl border border-neutral-200 p-6">
                <h2 className="text-sm font-medium text-neutral-900">리워드 선택</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {project.rewards.map((item) => (
                    <label
                      key={item.id}
                      className={`flex flex-col gap-2 rounded-2xl border p-4 text-sm transition ${
                        reward?.id === item.id
                          ? "border-neutral-900 bg-neutral-100"
                          : "border-neutral-200 hover:border-neutral-900"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reward"
                        className="hidden"
                        checked={reward?.id === item.id}
                        onChange={() => setRewardId(item.id)}
                      />
                      <div className="font-semibold text-neutral-900">{item.title}</div>
                      <div className="text-neutral-700">{currencyKRW(item.price)}</div>
                      {item.description ? (
                        <p className="text-xs text-neutral-500">{item.description}</p>
                      ) : null}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-500">수량</span>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(Math.max(1, Number.parseInt(event.target.value || "1", 10)))
                    }
                    className="w-20 rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-700"
                  />
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setActiveStep("shipping")}
                    className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
                  >
                    다음: 배송 정보
                  </button>
                </div>
              </section>
            )}

            {activeStep === "shipping" && (
              <section className="space-y-4 rounded-3xl border border-neutral-200 p-6">
                <h2 className="text-sm font-medium text-neutral-900">배송 정보</h2>
                <input
                  placeholder="수령인"
                  value={address.name}
                  onChange={(event) =>
                    setAddress((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
                />
                <input
                  placeholder="연락처"
                  value={address.phone}
                  onChange={(event) =>
                    setAddress((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
                />
                <input
                  placeholder="주소"
                  value={address.address1}
                  onChange={(event) =>
                    setAddress((prev) => ({ ...prev, address1: event.target.value }))
                  }
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
                />
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep("reward")}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep("payment")}
                    className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
                  >
                    다음: 결제
                  </button>
                </div>
              </section>
            )}

            {activeStep === "payment" && (
              <section className="space-y-4 rounded-3xl border border-neutral-200 p-6">
                <h2 className="text-sm font-medium text-neutral-900">결제 수단</h2>
                <div className="flex flex-wrap gap-2">
                  {["portone", "toss", "stripe"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setGateway(option)}
                      className={`rounded-full px-3 py-1 text-sm capitalize ${
                        gateway === option
                          ? "bg-neutral-900 text-white"
                          : "border border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500">
                  샌드박스 모드로 실제 결제는 진행되지 않습니다. 결제 인텐트를 모의로 생성하고
                  PG 이동 시나리오를 안내합니다.
                </div>
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep("shipping")}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert("결제 인텐트 생성 → PG 리다이렉트 (모의)");
                      navigate(`/projects/${project.slug}`);
                    }}
                    className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
                  >
                    결제하기
                  </button>
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4 rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-sm font-medium text-neutral-900">주문 요약</h2>
            <div className="space-y-2 text-sm text-neutral-600">
              <div className="flex items-center justify-between">
                <span>리워드</span>
                <span>{reward ? reward.title : "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>수량</span>
                <span>{quantity}</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-neutral-900">
                <span>결제 금액</span>
                <span>{currencyKRW(amount)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Container>
  );
};
