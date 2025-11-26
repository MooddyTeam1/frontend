// 한글 설명: 메이커 소식 작성 페이지
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { StoryEditor } from "../../features/creator/components/StoryEditor";
import { createMakerNews } from "../../features/maker/api/makerNewsService";
import { useAuthStore } from "../../features/auth/stores/authStore";

export const MakerNewsCreatePage: React.FC = () => {
  // 한글 설명: URL에서 makerId 가져오기
  const { makerId } = useParams<{ makerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // 한글 설명: 폼 상태 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [newsType, setNewsType] = useState<"EVENT" | "NOTICE" | "NEW_PRODUCT">("NOTICE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 소식 작성 핸들러
  const handleSubmit = async () => {
    if (!makerId) {
      alert("메이커 ID가 없습니다.");
      return;
    }

    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // 한글 설명: 제목 검증
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (title.trim().length > 200) {
      alert("제목은 200자 이하로 입력해주세요.");
      return;
    }

    // 한글 설명: 내용 검증
    if (!content.trim()) {
      alert("소식 내용을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 한글 설명: API 호출
      await createMakerNews({
        title: title.trim(),
        contentMarkdown: content,
        newsType: newsType,
      });

      // 한글 설명: 성공 시 메이커 소식 목록으로 이동
      alert("소식이 등록되었습니다.");
      navigate(`/makers/${makerId}/news`);
    } catch (err) {
      console.error("소식 작성 실패:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "소식 작성에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 한글 설명: 취소 핸들러
  const handleCancel = () => {
    if (window.confirm("작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?")) {
      navigate(`/makers/${makerId}/news`);
    }
  };

  return (
    <Container>
      <div className="mx-auto max-w-4xl py-8">
        <div className="space-y-6">
          {/* 한글 설명: 헤더 */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-neutral-900">
              메이커 소식 작성
            </h1>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              취소
            </button>
          </div>

          {/* 한글 설명: 에러 메시지 */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 한글 설명: 소식 유형 선택 */}
          <div className="space-y-2">
            <label
              htmlFor="news-type"
              className="block text-sm font-medium text-neutral-900"
            >
              소식 유형 <span className="text-red-500">*</span>
            </label>
            <select
              id="news-type"
              value={newsType}
              onChange={(e) =>
                setNewsType(e.target.value as "EVENT" | "NOTICE" | "NEW_PRODUCT")
              }
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
            >
              <option value="NOTICE">공지</option>
              <option value="EVENT">이벤트</option>
              <option value="NEW_PRODUCT">신제품 출시</option>
            </select>
          </div>

          {/* 한글 설명: 제목 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="news-title"
              className="block text-sm font-medium text-neutral-900"
            >
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="news-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
            />
            <p className="text-xs text-neutral-500">
              {title.length} / 200자
            </p>
          </div>

          {/* 한글 설명: 내용 입력 (마크다운 에디터) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-900">
              내용 <span className="text-red-500">*</span>
            </label>
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <StoryEditor
                value={content}
                onChange={setContent}
                maxChars={10000}
              />
            </div>
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-xs text-neutral-500">
              <p className="font-semibold text-neutral-900">Tip</p>
              <ul className="mt-2 space-y-1 list-disc pl-5">
                <li>
                  Markdown을 지원하니 제목(#), 목록(-), 강조(**)를 활용해
                  구조를 잡아보세요.
                </li>
                <li>
                  이미지는 드래그하거나 붙여넣어도 업로드됩니다. 5MB 이하 파일을
                  권장합니다.
                </li>
              </ul>
            </div>
          </div>

          {/* 한글 설명: 작성 버튼 */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="rounded-full border border-neutral-900 bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "등록 중..." : "소식 등록"}
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

