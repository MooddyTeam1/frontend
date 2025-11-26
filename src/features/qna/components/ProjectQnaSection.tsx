// 한글 설명: 서포터용 프로젝트 Q&A 섹션 컴포넌트
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../auth/stores/authStore";
import {
  createQuestion,
  getMyQnaList,
  getQnaListForMaker,
} from "../api/qnaApi";
import type {
  ProjectQnaResponse,
  ProjectQnaCreateRequest,
} from "../types";

type ProjectQnaSectionProps = {
  projectId: number;
  // 한글 설명: 프로젝트 소유자인지 여부 (소유자면 문의 작성 불가, 목록만 조회)
  isOwner?: boolean;
};

/**
 * 한글 설명: 프로젝트 상세 페이지 하단에 붙는 Q&A 섹션
 * 서포터가 질문을 작성하고, 자신이 남긴 Q&A 목록을 볼 수 있음
 */
export const ProjectQnaSection: React.FC<ProjectQnaSectionProps> = ({
  projectId,
  isOwner = false,
}) => {
  // 한글 설명: 로그인 상태 확인
  const { user } = useAuthStore();
  
  // 한글 설명: Q&A 목록 상태
  const [qnaList, setQnaList] = useState<ProjectQnaResponse[]>([]);
  
  // 한글 설명: 로딩 상태
  const [loading, setLoading] = useState(false);
  
  // 한글 설명: 에러 상태
  const [error, setError] = useState<string | null>(null);
  
  // 한글 설명: 질문 작성 폼 상태
  const [questionForm, setQuestionForm] = useState({
    question: "",
    isPrivate: true, // 한글 설명: 기본값은 비공개
  });
  
  // 한글 설명: 질문 작성 중 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 한글 설명: Q&A 목록 불러오기
   * 소유자인 경우 모든 서포터의 문의를, 서포터인 경우 자신의 문의만 조회
   */
  const fetchMyQnaList = async () => {
    if (!user) {
      setQnaList([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // 한글 설명: 소유자인 경우 메이커용 API 사용, 그 외에는 서포터용 API 사용
      const data = isOwner
        ? await getQnaListForMaker(projectId)
        : await getMyQnaList(projectId);
      setQnaList(data);
    } catch (err) {
      console.error("Q&A 목록 조회 실패:", err);
      setError("Q&A 목록을 불러오는 도중 문제가 발생했습니다.");
      setQnaList([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 한글 설명: 컴포넌트 마운트 시 및 로그인 상태 변경 시 Q&A 목록 불러오기
   */
  useEffect(() => {
    fetchMyQnaList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, user, isOwner]);

  /**
   * 한글 설명: 질문 작성 핸들러
   */
  const handleSubmitQuestion = async () => {
    if (!user) {
      alert("로그인 후 문의를 남길 수 있습니다.");
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
      
      // 한글 설명: 성공 시 폼 초기화 및 목록 새로고침
      setQuestionForm({
        question: "",
        isPrivate: true,
      });
      await fetchMyQnaList();
      alert("질문이 등록되었습니다.");
    } catch (err) {
      console.error("질문 작성 실패:", err);
      alert("질문 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 한글 설명: 날짜 포맷팅 유틸 함수 (간단한 형식)
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
      {/* 한글 설명: Q&A 작성 폼 - 소유자가 아닐 때만 표시 */}
      {!isOwner && (
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            문의하기
          </h2>
          
          {!user ? (
            // 한글 설명: 비로그인 상태 안내
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
              로그인 후 문의를 남길 수 있습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {/* 한글 설명: 질문 입력 영역 */}
              <textarea
                placeholder="프로젝트에 대해 궁금한 점을 남겨주세요."
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
              
              {/* 한글 설명: 비공개 체크박스 */}
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
                <span>비공개 질문으로 남기기 (나와 메이커만 볼 수 있습니다)</span>
              </label>
              
              {/* 한글 설명: 질문 등록 버튼 */}
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

      {/* 한글 설명: Q&A 목록 - 소유자는 서포터가 남긴 문의, 서포터는 내가 남긴 문의 */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          {isOwner ? "서포터가 남긴 문의" : "내가 남긴 문의"}
        </h2>
        
        {!user ? (
          // 한글 설명: 비로그인 상태 안내
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
            {isOwner
              ? "로그인 후 서포터가 남긴 문의를 확인할 수 있습니다."
              : "로그인 후 내가 남긴 문의를 확인할 수 있습니다."}
          </div>
        ) : loading ? (
          // 한글 설명: 로딩 상태
          <div className="py-8 text-center text-sm text-neutral-500">
            로딩 중...
          </div>
        ) : error ? (
          // 한글 설명: 에러 상태
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
            {error}
          </div>
        ) : qnaList.length === 0 ? (
          // 한글 설명: Q&A가 없을 때
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
            {isOwner
              ? "아직 서포터가 남긴 문의가 없습니다."
              : "아직 남긴 문의가 없습니다."}
          </div>
        ) : (
          // 한글 설명: Q&A 목록 표시
          <div className="space-y-4">
            {qnaList.map((qna) => (
              <div
                key={qna.id}
                className="rounded-xl border border-neutral-200 bg-white p-4"
              >
                {/* 한글 설명: Q&A 헤더 (상태 뱃지 + 날짜) */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* 한글 설명: 상태 뱃지 */}
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
                  {/* 한글 설명: 질문 등록 일시 */}
                  <span className="text-xs text-neutral-500">
                    {formatDate(qna.createdAt)}
                  </span>
                </div>
                
                {/* 한글 설명: 질문 내용 */}
                <div className="mb-3 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">
                  <p className="font-medium text-neutral-900">질문:</p>
                  <p className="mt-1 whitespace-pre-wrap">{qna.question}</p>
                </div>
                
                {/* 한글 설명: 답변 내용 (있을 때만 표시) */}
                {qna.answer && (
                  <div className="rounded-lg bg-blue-50 p-3 text-sm text-neutral-700">
                    <p className="mb-1 font-medium text-blue-700">메이커 답변:</p>
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

