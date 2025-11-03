import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/primitives/Container";
import { ProgressBar } from "../components/ProgressBar";
import { RewardCard } from "../components/RewardCard";
import { currencyKRW, daysLeft, progressPct } from "../utils/format";
import { mockProjects } from "../utils/mock";

type TabKey = "story" | "updates" | "comments" | "faq";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "story", label: "스토리" },
  { key: "updates", label: "업데이트" },
  { key: "comments", label: "댓글" },
  { key: "faq", label: "FAQ" },
];

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({
  active,
  onClick,
  label,
}) => (
  <button
    onClick={onClick}
    className={`border-b-2 px-0 pb-2 text-sm font-medium transition-colors ${
      active
        ? "border-neutral-900 text-neutral-900"
        : "border-transparent text-neutral-500 hover:text-neutral-900"
    }`}
  >
    {label}
  </button>
);

const Markdown: React.FC<{ text: string }> = ({ text }) => (
  <div className="prose max-w-none text-neutral-700">
    {text.split("\n\n").map((block, index) => (
      <p key={index} className="leading-relaxed">
        {block.replace(/^##\s/, "")}
      </p>
    ))}
  </div>
);

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = mockProjects.find((candidate) => candidate.slug === slug);
  const [activeTab, setActiveTab] = useState<TabKey>("story");

  if (!project) {
    return (
      <Container>
        <div className="py-24 text-center text-sm text-neutral-500">
          프로젝트를 찾을 수 없습니다.
        </div>
      </Container>
    );
  }

  const percentage = progressPct(project.raised, project.goalAmount);

  return (
    <Container>
      <div className="space-y-12 py-16">
        <div className="space-y-8">
          {project.coverImageUrl ? (
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="aspect-[16/9] w-full rounded-3xl object-cover"
            />
          ) : null}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              {project.category}
            </span>
            <h1 className="text-4xl font-semibold text-neutral-900">{project.title}</h1>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="space-y-10">
            <div className="space-y-3 rounded-3xl border border-neutral-200 p-8">
              <ProgressBar value={percentage} />
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                <span>
                  {currencyKRW(project.raised)} / {currencyKRW(project.goalAmount)}
                </span>
                <span>{project.backerCount}명 후원</span>
                <span>D-{daysLeft(project.endDate)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 border-b border-neutral-200 pb-2">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.key}
                  active={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  label={tab.label}
                />
              ))}
            </div>

            <div className="space-y-6">
              {activeTab === "story" && <Markdown text={project.storyMarkdown} />}
              {activeTab === "updates" && (
                <div className="rounded-2xl border border-neutral-200 p-6 text-sm text-neutral-500">
                  아직 업데이트가 없습니다.
                </div>
              )}
              {activeTab === "comments" && (
                <div className="rounded-2xl border border-neutral-200 p-6 text-sm text-neutral-500">
                  댓글 기능은 프로토타입에서는 제공되지 않습니다.
                </div>
              )}
              {activeTab === "faq" && (
                <div className="rounded-2xl border border-neutral-200 p-6 text-sm text-neutral-500">
                  FAQ가 준비중입니다.
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 p-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-neutral-900">후원하기</h2>
                <p className="text-sm text-neutral-500">
                  리워드를 선택하고 결제 단계까지 단 몇 단계면 충분합니다.
                </p>
              </div>
              <button
                disabled={project.state !== "LIVE"}
                onClick={() => navigate(`/projects/${project.slug}/pledge`)}
                className={`mt-6 w-full rounded-full border px-4 py-3 text-sm font-medium ${
                  project.state === "LIVE"
                    ? "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
                    : "border-neutral-200 text-neutral-400"
                }`}
              >
                바로 후원하기
              </button>
              {project.state !== "LIVE" && (
                <p className="mt-3 text-center text-xs text-neutral-400">
                  LIVE 상태에서만 후원할 수 있습니다.
                </p>
              )}
            </div>

            {project.rewards.length > 0 ? (
              <div className="space-y-4">
                {project.rewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    r={reward}
                    onSelect={(rewardId) =>
                      navigate(`/projects/${project.slug}/pledge?reward=${rewardId}`)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-neutral-200 p-10 text-center text-sm text-neutral-500">
                선택 가능한 리워드가 없습니다.
              </div>
            )}
          </aside>
        </div>
      </div>
    </Container>
  );
};
