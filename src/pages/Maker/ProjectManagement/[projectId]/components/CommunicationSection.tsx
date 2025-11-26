// 한글 설명: 커뮤니케이션(소통) 섹션
import React from "react";
import {
  createProjectNotice,
  // updateProjectNotice, // 한글 설명: 현재 미사용
  deleteProjectNotice,
  // answerProjectQnA, // 한글 설명: 현재 미사용
} from "../../../../../features/maker/projectManagement/api/projectManagementService";
import type {
  ProjectNoticeDTO,
  ProjectQnADTO,
} from "../../../../../features/maker/projectManagement/types";
import { MakerProjectQnaPanel } from "../../../../../features/qna/components/MakerProjectQnaPanel";

type CommunicationSectionProps = {
  projectId: number;
  notices: ProjectNoticeDTO[];
  qnas: ProjectQnADTO[];
  onRefresh: () => void;
};

export const CommunicationSection: React.FC<CommunicationSectionProps> = ({
  projectId,
  notices: initialNotices,
  qnas: initialQnas, // 한글 설명: 현재 미사용 (파라미터는 유지하되 사용하지 않음)
  onRefresh,
}) => {
  // 한글 설명: initialQnas는 사용하지 않지만 props로 받아야 하므로 void로 처리
  void initialQnas;
  // 한글 설명: qnas는 현재 미사용
  const [notices] = React.useState(initialNotices); // 한글 설명: setNotices는 현재 미사용
  // const [qnas, setQnas] = React.useState(initialQnas);
  const [showNoticeForm, setShowNoticeForm] = React.useState(false);
  const [, setEditingNotice] = React.useState<ProjectNoticeDTO | null>(null); // 한글 설명: editingNotice는 현재 미사용
  const [noticeForm, setNoticeForm] = React.useState({
    title: "",
    content: "",
    isPublic: true,
    notifySupporters: false,
  });

  const handleCreateNotice = async () => {
    try {
      await createProjectNotice(projectId, noticeForm);
      alert("공지가 작성되었습니다.");
      setShowNoticeForm(false);
      setNoticeForm({
        title: "",
        content: "",
        isPublic: true,
        notifySupporters: false,
      });
      onRefresh();
    } catch (error) {
      console.error("공지 작성 실패:", error);
      alert("공지 작성에 실패했습니다.");
    }
  };

  const handleDeleteNotice = async (noticeId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteProjectNotice(projectId, noticeId);
      alert("공지가 삭제되었습니다.");
      onRefresh();
    } catch (error) {
      console.error("공지 삭제 실패:", error);
      alert("공지 삭제에 실패했습니다.");
    }
  };

  // 한글 설명: handleAnswerQnA는 현재 미사용
  // const handleAnswerQnA = async (qnaId: number, answer: string) => {
  //   try {
  //     await answerProjectQnA(projectId, qnaId, answer);
  //     alert("답변이 작성되었습니다.");
  //     onRefresh();
  //   } catch (error) {
  //     console.error("답변 작성 실패:", error);
  //     alert("답변 작성에 실패했습니다.");
  //   }
  // };

  return (
    <div className="space-y-6">
      {/* 한글 설명: 공지/업데이트 관리 */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            공지/업데이트 관리
          </h2>
          <button
            type="button"
            onClick={() => setShowNoticeForm(true)}
            className="rounded border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            새 공지 작성
          </button>
        </div>

        {showNoticeForm && (
          <div className="mb-6 space-y-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <input
              type="text"
              placeholder="공지 제목"
              value={noticeForm.title}
              onChange={(e) =>
                setNoticeForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded border border-neutral-200 bg-white px-3 py-2 text-sm"
            />
            <textarea
              placeholder="공지 내용 (Markdown 지원)"
              value={noticeForm.content}
              onChange={(e) =>
                setNoticeForm((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={6}
              className="w-full rounded border border-neutral-200 bg-white px-3 py-2 text-sm"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={noticeForm.isPublic}
                  onChange={(e) =>
                    setNoticeForm((prev) => ({
                      ...prev,
                      isPublic: e.target.checked,
                    }))
                  }
                />
                공개
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={noticeForm.notifySupporters}
                  onChange={(e) =>
                    setNoticeForm((prev) => ({
                      ...prev,
                      notifySupporters: e.target.checked,
                    }))
                  }
                />
                서포터에게 알림 발송
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCreateNotice}
                className="rounded border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800"
              >
                작성
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNoticeForm(false);
                  setNoticeForm({
                    title: "",
                    content: "",
                    isPublic: true,
                    notifySupporters: false,
                  });
                }}
                className="rounded border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                취소
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {notices.map((notice: ProjectNoticeDTO) => (
            <div
              key={notice.id}
              className="rounded-xl border border-neutral-200 bg-white p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-neutral-900">
                      {notice.title}
                    </h3>
                    {!notice.isPublic && (
                      <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] text-neutral-500">
                        비공개
                      </span>
                    )}
                    {notice.notifySupporters && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] text-blue-700">
                        알림 발송
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingNotice(notice)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteNotice(notice.id)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 한글 설명: Q&A 관리 - 새로운 API 스펙에 맞춘 컴포넌트 사용 */}
      <MakerProjectQnaPanel projectId={projectId} />
    </div>
  );
};

