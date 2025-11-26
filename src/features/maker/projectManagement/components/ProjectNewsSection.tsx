// 한글 설명: 프로젝트 상세 페이지의 새소식(공지) 섹션 컴포넌트
import React, { useState, useEffect } from "react";
import {
  createProjectNotice,
  updateProjectNotice,
  deleteProjectNotice,
} from "../api/projectManagementService";
import {
  getPublicProjectNews,
  type ProjectNoticeResponse,
} from "../../../projects/api/publicProjectsService";
import { StoryViewer } from "../../../../shared/components/StoryViewer";

type ProjectNewsSectionProps = {
  projectId: number;
  isOwner: boolean; // 한글 설명: 프로젝트 소유자인지 여부
};

/**
 * 한글 설명: 프로젝트 상세 페이지의 새소식 탭에서 사용하는 컴포넌트
 * - 공개된 공지 목록 표시
 * - 프로젝트 소유자인 경우 공지 작성/수정/삭제 UI 제공
 */
export const ProjectNewsSection: React.FC<ProjectNewsSectionProps> = ({
  projectId,
  isOwner,
}) => {
  // 한글 설명: 공지 목록 상태
  const [notices, setNotices] = useState<ProjectNoticeResponse[]>([]);
  // 한글 설명: 로딩 상태
  const [loading, setLoading] = useState(false);
  // 한글 설명: 에러 상태
  const [error, setError] = useState<string | null>(null);
  // 한글 설명: 공지 작성 폼 표시 여부
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  // 한글 설명: 수정 중인 공지 (null이면 새로 작성)
  const [editingNotice, setEditingNotice] = useState<ProjectNoticeResponse | null>(null);
  // 한글 설명: 공지 작성/수정 폼 상태
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    content: "",
    isPublic: true,
    notifySupporters: false,
  });
  // 한글 설명: 제출 중 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 한글 설명: 공지 목록 불러오기 (공개용 API 사용)
   */
  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      // 한글 설명: 공개용 API를 사용하여 공개된 공지만 조회
      // 한글 설명: 백엔드에서 이미 isPublic=true인 것만 반환하므로 추가 필터링 불필요
      const response = await getPublicProjectNews(projectId);
      setNotices(response);
    } catch (err) {
      console.error("공지 목록 조회 실패:", err);
      setError("공지 목록을 불러오는 도중 문제가 발생했습니다.");
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 한글 설명: 컴포넌트 마운트 시 공지 목록 불러오기
   */
  useEffect(() => {
    fetchNotices();
  }, [projectId, isOwner]);

  /**
   * 한글 설명: 공지 작성 핸들러
   */
  const handleCreateNotice = async () => {
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createProjectNotice(projectId, noticeForm);
      alert("공지가 작성되었습니다.");
      setShowNoticeForm(false);
      setNoticeForm({
        title: "",
        content: "",
        isPublic: true,
        notifySupporters: false,
      });
      await fetchNotices();
    } catch (err) {
      console.error("공지 작성 실패:", err);
      alert("공지 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 한글 설명: 공지 수정 핸들러
   */
  const handleUpdateNotice = async () => {
    if (!editingNotice) return;
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProjectNotice(projectId, editingNotice.id, noticeForm);
      alert("공지가 수정되었습니다.");
      setShowNoticeForm(false);
      setEditingNotice(null);
      setNoticeForm({
        title: "",
        content: "",
        isPublic: true,
        notifySupporters: false,
      });
      await fetchNotices();
    } catch (err) {
      console.error("공지 수정 실패:", err);
      alert("공지 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 한글 설명: 공지 삭제 핸들러
   */
  const handleDeleteNotice = async (noticeId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteProjectNotice(projectId, noticeId);
      alert("공지가 삭제되었습니다.");
      await fetchNotices();
    } catch (err) {
      console.error("공지 삭제 실패:", err);
      alert("공지 삭제에 실패했습니다.");
    }
  };

  /**
   * 한글 설명: 수정 버튼 클릭 시 폼 초기화
   */
  const handleEditClick = (notice: ProjectNoticeResponse) => {
    setEditingNotice(notice);
    setNoticeForm({
      title: notice.title,
      content: notice.content,
      isPublic: notice.isPublic,
      notifySupporters: notice.notifySupporters,
    });
    setShowNoticeForm(true);
  };

  /**
   * 한글 설명: 폼 취소 핸들러
   */
  const handleCancelForm = () => {
    setShowNoticeForm(false);
    setEditingNotice(null);
    setNoticeForm({
      title: "",
      content: "",
      isPublic: true,
      notifySupporters: false,
    });
  };

  /**
   * 한글 설명: 날짜 포맷팅 유틸 함수
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6">
      {/* 한글 설명: 프로젝트 소유자인 경우 공지 작성 버튼 */}
      {isOwner && (
        <div className="flex items-center justify-between rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-900">새소식</h2>
          <button
            type="button"
            onClick={() => setShowNoticeForm(true)}
            className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            새 공지 작성
          </button>
        </div>
      )}

      {/* 한글 설명: 공지 작성/수정 폼 */}
      {isOwner && showNoticeForm && (
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-4 text-base font-semibold text-neutral-900">
            {editingNotice ? "공지 수정" : "새 공지 작성"}
          </h3>
          <div className="space-y-4">
            {/* 한글 설명: 제목 입력 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="공지 제목을 입력하세요"
                value={noticeForm.title}
                onChange={(e) =>
                  setNoticeForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            {/* 한글 설명: 내용 입력 (Markdown) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="공지 내용을 입력하세요 (Markdown 지원)"
                value={noticeForm.content}
                onChange={(e) =>
                  setNoticeForm((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={8}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            {/* 한글 설명: 옵션 체크박스 */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={noticeForm.isPublic}
                  onChange={(e) =>
                    setNoticeForm((prev) => ({
                      ...prev,
                      isPublic: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span>공개</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={noticeForm.notifySupporters}
                  onChange={(e) =>
                    setNoticeForm((prev) => ({
                      ...prev,
                      notifySupporters: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span>서포터에게 알림 발송</span>
              </label>
            </div>

            {/* 한글 설명: 버튼 영역 */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={editingNotice ? handleUpdateNotice : handleCreateNotice}
                disabled={isSubmitting || !noticeForm.title.trim() || !noticeForm.content.trim()}
                className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "처리 중..."
                  : editingNotice
                    ? "수정 완료"
                    : "작성 완료"}
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                disabled={isSubmitting}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 한글 설명: 공지 목록 */}
      {loading ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <div className="py-8 text-center text-sm text-neutral-500">
            로딩 중...
          </div>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <div className="py-8 text-center text-sm text-red-600">{error}</div>
        </div>
      ) : notices.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <div className="py-8 text-center text-sm text-neutral-500">
            {isOwner
              ? "아직 등록된 새소식이 없습니다. 위의 '새 공지 작성' 버튼을 눌러 공지를 작성해보세요."
              : "아직 등록된 새소식이 없습니다."}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="rounded-3xl border border-neutral-200 bg-white p-6"
            >
              {/* 한글 설명: 공지 헤더 */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {notice.title}
                    </h3>
                    {!notice.isPublic && (
                      <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-500">
                        비공개
                      </span>
                    )}
                    {notice.notifySupporters && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                        알림 발송
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    {formatDate(notice.createdAt)}
                    {notice.updatedAt !== notice.createdAt && (
                      <span className="ml-2">(수정됨)</span>
                    )}
                  </p>
                </div>
                {/* 한글 설명: 소유자인 경우 수정/삭제 버튼 */}
                {isOwner && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(notice)}
                      className="rounded border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="rounded border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-600 hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              {/* 한글 설명: 공지 내용 (Markdown 렌더링) */}
              <div className="prose prose-sm max-w-none">
                <StoryViewer
                  markdown={notice.content}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

