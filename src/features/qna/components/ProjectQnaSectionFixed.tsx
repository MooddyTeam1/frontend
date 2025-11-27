import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../auth/stores/authStore";
import {
  createQuestion,
  getMyQnaList,
  getQnaListForMaker,
  getPublicQnaList,
} from "../api/qnaApi";
import type { ProjectQnaResponse, ProjectQnaCreateRequest } from "../types";

type ProjectQnaSectionProps = {
  projectId: number;
  isOwner?: boolean; // 프로젝트 소유자 여부
};

// 프로젝트 상세 Q&A 섹션 (깨진 주석 없는 클린 버전)
export const ProjectQnaSection: React.FC<ProjectQnaSectionProps> = ({
  projectId,
  isOwner = false,
}) => {
  const { user } = useAuthStore();

  const [qnaList, setQnaList] = useState<ProjectQnaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionForm, setQuestionForm] = useState({
    question: "",
    isPrivate: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Q&A 목록 불러오기
  const fetchQnaList = async () => {
    // 비로그인: 공개 Q&A만 노출
    if (!user) {
      try {
        setLoading(true);
        setError(null);
        const publicList = await getPublicQnaList(projectId);
        setQnaList(Array.isArray(publicList) ? publicList : []);
      } catch (err) {
        console.error("공개 Q&A 목록 조회 실패:", err);
        setError("Q&A를 불러오지 못했습니다.");
        setQnaList([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = isOwner
        ? await getQnaListForMaker(projectId)
        : await getMyQnaList(projectId);
      setQnaList(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Q&A 목록 조회 실패:", err);
      setError("Q&A 목록을 불러오는 중 문제가 발생했습니다.");
      setQnaList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQnaList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, user, isOwner]);

  // 질문 등록
  const handleSubmitQuestion = async () => {
    if (!user) {
      alert("로그인 후 문의를 등록할 수 있습니다.");
      return;
    }
    if (!questionForm.question.trim()) {
      alert("질문 내용을 입력해주세요.");
      return;
    }
    try {
      setIsSubmitting(true);
      const payload: ProjectQnaCreateRequest = {
        question: questionForm.question.trim(),
        isPrivate: questionForm.isPrivate,
      };
      await createQuestion(projectId, payload);
      setQuestionForm({ question: "", isPrivate: true });
      await fetchQnaList();
      alert("질문이 등록되었습니다.");
    } catch (err) {
      console.error("질문 등록 실패:", err);
      alert("질문 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${hh}:${mm}`;
  };

  return (
    <div className="space-y-6">
      {/* 문의 작성 (소유자는 작성 불가) */}
      {!isOwner && (
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">문의하기</h2>
          {!user ? (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
              비로그인 상태에서는 공개 Q&A만 볼 수 있습니다.
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                placeholder="프로젝트에 대해 궁금한 점을 남겨주세요."
                value={questionForm.question}
                onChange={(e) =>
                  setQuestionForm((prev) => ({ ...prev, question: e.target.value }))
                }
                rows={4}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={questionForm.isPrivate}
                  onChange={(e) =>
                    setQuestionForm((prev) => ({ ...prev, isPrivate: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span>비공개 질문으로 등록(메이커만 열람)</span>
              </label>
              <button
                type="button"
                onClick={handleSubmitQuestion}
                disabled={isSubmitting || !questionForm.question.trim()}
                className="w-full rounded-full border border-neutral-900 bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "등록 중..." : "질문 등록"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Q&A 목록 */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          {isOwner ? "서포터 문의" : "문의 내역"}
        </h2>

        {loading ? (
          <div className="py-8 text-center text-sm text-neutral-500">로딩 중...</div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
            {error}
          </div>
        ) : qnaList.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
            아직 문의가 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {qnaList.map((qna) => (
              <div key={qna.id} className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      qna.status === "ANSWERED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {qna.status === "ANSWERED" ? "답변 완료" : "답변 대기"}
                  </span>
                  <span className="text-xs text-neutral-500">{formatDate(qna.createdAt)}</span>
                </div>

                <div className="mb-3 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">
                  <p className="font-medium text-neutral-900">질문</p>
                  <p className="mt-1 whitespace-pre-wrap">{qna.question}</p>
                </div>

                {qna.answer && (
                  <div className="rounded-lg bg-blue-50 p-3 text-sm text-neutral-700">
                    <p className="mb-1 font-medium text-blue-700">메이커 답변</p>
                    <p className="whitespace-pre-wrap">{qna.answer}</p>
                    {qna.answeredAt && (
                      <p className="mt-2 text-xs text-neutral-500">
                        답변일시: {formatDate(qna.answeredAt)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

