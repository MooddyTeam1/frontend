import React from "react";
import { Container } from "../../shared/components/Container";
import type { SupporterProfileDTO, InterestDTO } from "../../features/supporter/types";

export const SupporterSettingsPage: React.FC = () => {
  // 한글 설명: DB 스키마 기반 서포터 설정 폼 상태. 실제 API 연동 전까지는 로컬 상태를 사용.
  const [profile, setProfile] = React.useState<SupporterProfileDTO>({
    userId: "", // 로그인 연동 시 교체
    displayName: "",
    bio: "",
    imageUrl: "",
    phone: "",
    address: "",
    postalCode: "",
    interests: [],
  });
  const [allInterests] = React.useState<InterestDTO[]>([
    { id: 1, name: "테크" },
    { id: 2, name: "게임" },
    { id: 3, name: "푸드" },
    { id: 4, name: "환경" },
  ]);

  const toggleInterest = (id: number) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((x) => x !== id)
        : [...prev.interests, id],
    }));
  };

  return (
    <Container>
      {/* 한글 설명: 서포터 프로필 설정 페이지. 닉네임/소개, 아바타, 연락처/주소, 관심사 선택 */}
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col gap-6 py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900">서포터 프로필</h1>
          <p className="text-sm text-neutral-500">후원 시 표시될 프로필과 기본 정보를 관리합니다.</p>
        </header>

        <section className="space-y-4 rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
          {/* 닉네임, 소개 */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">닉네임</label>
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="닉네임"
                value={profile.displayName ?? ""}
                onChange={(e) => setProfile((p) => ({ ...p, displayName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">프로필 이미지 URL</label>
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="https://..."
                value={profile.imageUrl ?? ""}
                onChange={(e) => setProfile((p) => ({ ...p, imageUrl: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-neutral-500">소개</label>
              <textarea
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                rows={3}
                placeholder="간단한 자기소개를 입력하세요"
                value={profile.bio ?? ""}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
              />
            </div>
          </div>

          {/* 연락처, 주소 */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">연락처</label>
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="010-0000-0000"
                value={profile.phone ?? ""}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">우편번호</label>
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="00000"
                value={profile.postalCode ?? ""}
                onChange={(e) => setProfile((p) => ({ ...p, postalCode: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-neutral-500">주소</label>
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="도로명 주소를 입력하세요"
                value={profile.address ?? ""}
                onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
              />
            </div>
          </div>

          {/* 관심사 멀티 선택 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">관심사</label>
            <div className="flex flex-wrap gap-2">
              {allInterests.map((it) => {
                const active = profile.interests.includes(it.id);
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => toggleInterest(it.id)}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      active
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                    }`}
                  >
                    {it.name}
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


