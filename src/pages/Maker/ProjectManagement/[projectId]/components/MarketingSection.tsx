// 한글 설명: 마케팅/홍보 도구 섹션
import React from "react";
import type { MakerProjectDetailDTO } from "../../../../../features/maker/projectManagement/types";

type MarketingSectionProps = {
  project: MakerProjectDetailDTO;
};

export const MarketingSection: React.FC<MarketingSectionProps> = ({
  project,
}) => {
  const projectUrl = `${window.location.origin}/projects/${project.id}`;
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(projectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    kakao: `https://story.kakao.com/share?url=${encodeURIComponent(projectUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(projectUrl)}&text=${encodeURIComponent(project.title)}`,
    instagram: projectUrl, // 인스타는 링크만 복사
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">
        마케팅/홍보 도구
      </h2>

      <div className="space-y-6">
        {/* 한글 설명: 공유 링크 */}
        <div>
          <p className="mb-2 text-xs font-medium text-neutral-500">
            공유 링크
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={projectUrl}
              readOnly
              className="flex-1 rounded border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
        </div>

        {/* 한글 설명: SNS 공유 버튼 */}
        <div>
          <p className="mb-2 text-xs font-medium text-neutral-500">
            SNS 공유
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={shareLinks.kakao}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded border border-yellow-300 bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
            >
              카카오톡
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded border border-blue-300 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              페이스북
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded border border-sky-300 bg-sky-50 px-3 py-2 text-xs font-medium text-sky-700 hover:bg-sky-100"
            >
              X (트위터)
            </a>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(projectUrl);
                alert("인스타그램 링크가 복사되었습니다.");
              }}
              className="flex items-center gap-2 rounded border border-pink-300 bg-pink-50 px-3 py-2 text-xs font-medium text-pink-700 hover:bg-pink-100"
            >
              인스타그램
            </button>
          </div>
        </div>

        {/* 한글 설명: UTM 링크 생성기 */}
        <div>
          <p className="mb-2 text-xs font-medium text-neutral-500">
            UTM 링크 생성기
          </p>
          <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div>
              <label className="mb-1 block text-xs text-neutral-500">
                캠페인 이름
              </label>
              <input
                type="text"
                placeholder="예: 인스타 캠페인"
                className="w-full rounded border border-neutral-200 bg-white px-3 py-2 text-xs"
                id="utm-campaign"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-500">
                소스
              </label>
              <input
                type="text"
                placeholder="예: instagram"
                className="w-full rounded border border-neutral-200 bg-white px-3 py-2 text-xs"
                id="utm-source"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-500">
                미디움
              </label>
              <input
                type="text"
                placeholder="예: social"
                className="w-full rounded border border-neutral-200 bg-white px-3 py-2 text-xs"
                id="utm-medium"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const campaign = (
                  document.getElementById("utm-campaign") as HTMLInputElement
                )?.value;
                const source = (
                  document.getElementById("utm-source") as HTMLInputElement
                )?.value;
                const medium = (
                  document.getElementById("utm-medium") as HTMLInputElement
                )?.value;

                const params = new URLSearchParams();
                if (campaign) params.append("utm_campaign", campaign);
                if (source) params.append("utm_source", source);
                if (medium) params.append("utm_medium", medium);

                const utmUrl = `${projectUrl}?${params.toString()}`;
                navigator.clipboard.writeText(utmUrl);
                alert("UTM 링크가 생성되어 복사되었습니다.");
              }}
              className="w-full rounded border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800"
            >
              UTM 링크 생성 및 복사
            </button>
          </div>
        </div>

        {/* 한글 설명: 홍보 문구 템플릿 */}
        <div>
          <p className="mb-2 text-xs font-medium text-neutral-500">
            홍보 문구 템플릿
          </p>
          <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="rounded-lg bg-white p-3 text-xs">
              <p className="mb-2 font-medium text-neutral-900">
                기본 템플릿
              </p>
              <p className="text-neutral-700">
                {project.title}
                <br />
                목표 금액의 {project.progressPercent.toFixed(1)}% 달성!
                <br />
                지금 바로 확인해보세요 👇
                <br />
                {projectUrl}
              </p>
              <button
                type="button"
                onClick={() => {
                  const text = `${project.title}\n목표 금액의 ${project.progressPercent.toFixed(1)}% 달성!\n지금 바로 확인해보세요 👇\n${projectUrl}`;
                  navigator.clipboard.writeText(text);
                  alert("홍보 문구가 복사되었습니다.");
                }}
                className="mt-2 text-xs text-blue-600 hover:text-blue-700"
              >
                복사
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

