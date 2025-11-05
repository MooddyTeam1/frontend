import React from "react";
import { Container } from "../../shared/components/Container";
import type { MakerDTO, MakerKeywordDTO } from "../../features/maker/types";

export const MakerSettingsPage: React.FC = () => {
  // 한글 설명: DB 스키마 기반 메이커 설정 폼 상태. tech_stack_json/keywords는 배열로 관리.
  const [maker, setMaker] = React.useState<MakerDTO>({
    id: "", // 생성/조회 시 교체
    ownerUserId: "",
    name: "",
    establishedAt: "",
    industryType: "",
    representative: "",
    location: "",
    productIntro: "",
    coreCompetencies: "",
    imageUrl: "",
    contactEmail: "",
    contactPhone: "",
    techStack: [],
    keywords: [],
  });
  const [allKeywords] = React.useState<MakerKeywordDTO[]>([
    { id: 1, name: "친환경" },
    { id: 2, name: "소셜임팩트" },
    { id: 3, name: "B2B" },
  ]);
  const [techInput, setTechInput] = React.useState("");

  const addTech = () => {
    const v = techInput.trim();
    if (!v) return;
    if (maker.techStack.includes(v)) return;
    setMaker((m) => ({ ...m, techStack: [...m.techStack, v] }));
    setTechInput("");
  };
  const removeTech = (v: string) => setMaker((m) => ({ ...m, techStack: m.techStack.filter((x) => x !== v) }));
  const toggleKeyword = (id: number) =>
    setMaker((m) => ({ ...m, keywords: m.keywords.includes(id) ? m.keywords.filter((x) => x !== id) : [...m.keywords, id] }));

  return (
    <Container>
      {/* 한글 설명: 메이커 프로필 설정 페이지. 기본정보, 연락처, 소개/브랜딩, 기술스택, 키워드 구성 */}
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col gap-6 py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900">메이커 프로필</h1>
          <p className="text-sm text-neutral-500">프로젝트 공개 시 노출되는 메이커 정보와 브랜딩을 관리합니다.</p>
        </header>

        <section className="space-y-4 rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
          {/* 기본 정보 */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">메이커 이름</label>
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="메이커 이름"
                value={maker.name}
                onChange={(e) => setMaker((m) => ({ ...m, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">설립일</label>
              <input
                type="date"
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                value={maker.establishedAt ?? ""}
                onChange={(e) => setMaker((m) => ({ ...m, establishedAt: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">업종</label>
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="예: 제조, 소프트웨어"
                value={maker.industryType ?? ""}
                onChange={(e) => setMaker((m) => ({ ...m, industryType: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">대표자명</label>
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="홍길동"
                value={maker.representative ?? ""}
                onChange={(e) => setMaker((m) => ({ ...m, representative: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-neutral-500">소재지</label>
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="시/군/구 단위까지 입력"
                value={maker.location ?? ""}
                onChange={(e) => setMaker((m) => ({ ...m, location: e.target.value }))}
              />
            </div>
          </div>

          {/* 소개/브랜딩 */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-neutral-500">제품/서비스 소개</label>
              <textarea
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                rows={3}
                placeholder="우리의 제품/서비스를 소개하세요"
                value={maker.productIntro ?? ""}
                onChange={(e) => setMaker((m) => ({ ...m, productIntro: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-neutral-500">핵심 역량</label>
              <textarea
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                rows={3}
                placeholder="핵심 기술/역량을 입력하세요"
                value={maker.coreCompetencies ?? ""}
                onChange={(e) => setMaker((m) => ({ ...m, coreCompetencies: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-neutral-500">브랜드 이미지 URL</label>
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="https://..."
                value={maker.imageUrl ?? ""}
                onChange={(e) => setMaker((m) => ({ ...m, imageUrl: e.target.value }))}
              />
            </div>
          </div>

          {/* 연락처 */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">이메일</label>
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="contact@example.com"
                value={maker.contactEmail ?? ""}
                onChange={(e) => setMaker((m) => ({ ...m, contactEmail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">연락처</label>
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="010-0000-0000"
                value={maker.contactPhone ?? ""}
                onChange={(e) => setMaker((m) => ({ ...m, contactPhone: e.target.value }))}
              />
            </div>
          </div>

          {/* 기술 스택 (태그 입력) */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">활용 기술</label>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="React, Node.js, AWS ..."
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTech();
                  }
                }}
              />
              <button type="button" onClick={addTech} className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white">
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {maker.techStack.map((t) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700">
                  {t}
                  <button type="button" onClick={() => removeTech(t)} className="text-neutral-400 hover:text-neutral-900">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* 키워드 멀티 선택 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">키워드</label>
            <div className="flex flex-wrap gap-2">
              {allKeywords.map((kw) => {
                const active = maker.keywords.includes(kw.id);
                return (
                  <button
                    key={kw.id}
                    type="button"
                    onClick={() => toggleKeyword(kw.id)}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      active
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                    }`}
                  >
                    {kw.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 액션 */}
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full border border-neutral-900 px-4 py-2 font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white">
              변경 사항 저장
            </button>
            <button className="rounded-full border border-neutral-200 px-4 py-2 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900">
              취소
            </button>
          </div>
        </section>
      </div>
    </Container>
  );
};


