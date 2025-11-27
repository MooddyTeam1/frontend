// ?��? ?�명: ?�포?�용 ?�로?�트 Q&A ?�션 컴포?�트
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../auth/stores/authStore";
import {
  createQuestion,
  getMyQnaList,
  getQnaListForMaker,
  getPublicQnaList,
} from "../api/qnaApi";
import type {
  ProjectQnaResponse,
  ProjectQnaCreateRequest,
} from "../types";

type ProjectQnaSectionProps = {
  projectId: number;
  // ?��? ?�명: ?�로?�트 ?�유?�인지 ?��? (?�유?�면 문의 ?�성 불�?, 목록�?조회)
  isOwner?: boolean;
};

/**
 * ?��? ?�명: ?�로?�트 ?�세 ?�이지 ?�단??붙는 Q&A ?�션
 * ?�포?��? 질문???�성?�고, ?�신???�긴 Q&A 목록??�????�음
 */
export const ProjectQnaSection: React.FC<ProjectQnaSectionProps> = ({
  projectId,
  isOwner = false,
}) => {
  // ?��? ?�명: 로그???�태 ?�인
  const { user } = useAuthStore();
  
  // ?��? ?�명: Q&A 목록 ?�태
  const [qnaList, setQnaList] = useState<ProjectQnaResponse[]>([]);
  
  // ?��? ?�명: 로딩 ?�태
  const [loading, setLoading] = useState(false);
  
  // ?��? ?�명: ?�러 ?�태
  const [error, setError] = useState<string | null>(null);
  
  // ?��? ?�명: 질문 ?�성 ???�태
  const [questionForm, setQuestionForm] = useState({
    question: "",
    isPrivate: true, // ?��? ?�명: 기본값�? 비공�?
  });
  
  // ?��? ?�명: 질문 ?�성 �??�태
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * ?��? ?�명: Q&A 목록 불러?�기
   * ?�유?�인 경우 모든 ?�포?�의 문의�? ?�포?�인 경우 ?�신??문의�?조회
   */
  const fetchMyQnaList = async () => {
    if (!user) {
      try {
        setLoading(true);
        setError(null);
        const publicList = await getPublicQnaList(projectId);
        setQnaList(Array.isArray(publicList) ? publicList : []);
      } catch (err) {
        console.error('���� Q&A ��� ��ȸ ����:', err);
        setError('Q&A�� �ҷ����� ���߽��ϴ�.');
        setQnaList([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // ?��? ?�명: ?�유?�인 경우 메이커용 API ?�용, �??�에???�포?�용 API ?�용
      const response = isOwner
        ? await getQnaListForMaker(projectId)
        : await getMyQnaList(projectId);
      
      // ?��? ?�명: API ?�답??배열?��? ?�인?�고, 배열???�니�?�?배열�?처리
      setQnaList(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Q&A 목록 조회 ?�패:", err);
      setError("Q&A 목록??불러?�는 ?�중 문제가 발생?�습?�다.");
      setQnaList([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ?��? ?�명: 컴포?�트 마운????�?로그???�태 변�???Q&A 목록 불러?�기
   */
  useEffect(() => {
    fetchMyQnaList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, user, isOwner]);

  /**
   * ?��? ?�명: 질문 ?�성 ?�들??
   */
  const handleSubmitQuestion = async () => {
    if (!user) {
      alert("로그????문의�??�길 ???�습?�다.");
      return;
    }

    if (!questionForm.question.trim()) {
      alert("질문 ?�용???�력?�주?�요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: ProjectQnaCreateRequest = {
        question: questionForm.question.trim(),
        isPrivate: questionForm.isPrivate,
      };
      
      await createQuestion(projectId, payload);
      
      // ?��? ?�명: ?�공 ????초기??�?목록 ?�로고침
      setQuestionForm({
        question: "",
        isPrivate: true,
      });
      await fetchMyQnaList();
      alert("질문???�록?�었?�니??");
    } catch (err) {
      console.error("질문 ?�성 ?�패:", err);
      alert("질문 ?�록???�패?�습?�다. ?�시 ???�시 ?�도?�주?�요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * ?��? ?�명: ?�짜 ?�맷???�틸 ?�수 (간단???�식)
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
      {/* ?��? ?�명: Q&A ?�성 ??- ?�유?��? ?�닐 ?�만 ?�시 */}
      {!isOwner && (
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            문의?�기
          </h2>
          
          {!user ? (
            // ?��? ?�명: 비로그인 ?�태 ?�내
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
              로그????문의�??�길 ???�습?�다.
            </div>
          ) : (
            <div className="space-y-4">
              {/* ?��? ?�명: 질문 ?�력 ?�역 */}
              <textarea
                placeholder="?�로?�트???�??궁금???�을 ?�겨주세??"
                value={questionForm.question}
                onChange={(e) =>
                  setQuestionForm((prev) => ({
                    ...prev,
                    question: e.target.value,
                  }))
                }
                rows={4}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
              
              {/* ?��? ?�명: 비공�?체크박스 */}
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={questionForm.isPrivate}
                  onChange={(e) =>
                    setQuestionForm((prev) => ({
                      ...prev,
                      isPrivate: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span>비공�?질문?�로 ?�기�?(?��? 메이커만 �????�습?�다)</span>
              </label>
              
              {/* ?��? ?�명: 질문 ?�록 버튼 */}
              <button
                type="button"
                onClick={handleSubmitQuestion}
                disabled={isSubmitting || !questionForm.question.trim()}
                className="w-full rounded-full border border-neutral-900 bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "?�록 �?.." : "질문 ?�록"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ?��? ?�명: Q&A 목록 - ?�유?�는 ?�포?��? ?�긴 문의, ?�포?�는 ?��? ?�긴 문의 */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          {isOwner ? "?�포?��? ?�긴 문의" : "?��? ?�긴 문의"}
        </h2>
        
        {!user ? (
          // ?��? ?�명: 비로그인 ?�태 ?�내
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
            {isOwner
              ? "로그?????�포?��? ?�긴 문의�??�인?????�습?�다."
              : "로그?????��? ?�긴 문의�??�인?????�습?�다."}
          </div>
        ) : loading ? (
          // ?��? ?�명: 로딩 ?�태
          <div className="py-8 text-center text-sm text-neutral-500">
            로딩 �?..
          </div>
        ) : error ? (
          // ?��? ?�명: ?�러 ?�태
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
            {error}
          </div>
        ) : qnaList.length === 0 ? (
          // ?��? ?�명: Q&A가 ?�을 ??
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
            {isOwner
              ? "?�직 ?�포?��? ?�긴 문의가 ?�습?�다."
              : "?�직 ?�긴 문의가 ?�습?�다."}
          </div>
        ) : (
          // ?��? ?�명: Q&A 목록 ?�시
          <div className="space-y-4">
            {qnaList.map((qna) => (
              <div
                key={qna.id}
                className="rounded-xl border border-neutral-200 bg-white p-4"
              >
                {/* ?��? ?�명: Q&A ?�더 (?�태 뱃�? + ?�짜) */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* ?��? ?�명: ?�태 뱃�? */}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        qna.status === "ANSWERED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {qna.status === "ANSWERED" ? "답변 완료" : "답변 대기"}
                    </span>
                  </div>
                  {/* ?��? ?�명: 질문 ?�록 ?�시 */}
                  <span className="text-xs text-neutral-500">
                    {formatDate(qna.createdAt)}
                  </span>
                </div>
                
                {/* ?��? ?�명: 질문 ?�용 */}
                <div className="mb-3 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">
                  <p className="font-medium text-neutral-900">질문:</p>
                  <p className="mt-1 whitespace-pre-wrap">{qna.question}</p>
                </div>
                
                {/* ?��? ?�명: ?��? ?�용 (?�을 ?�만 ?�시) */}
                {qna.answer && (
                  <div className="rounded-lg bg-blue-50 p-3 text-sm text-neutral-700">
                    <p className="mb-1 font-medium text-blue-700">메이�??��?:</p>
                    <p className="whitespace-pre-wrap">{qna.answer}</p>
                    {qna.answeredAt && (
                      <p className="mt-2 text-xs text-neutral-500">
                        ?��??�시: {formatDate(qna.answeredAt)}
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



