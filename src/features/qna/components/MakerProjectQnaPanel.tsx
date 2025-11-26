// 한글 설명: 메이커용 프로젝트 Q&A 관리 패널 컴포넌트
import React, { useState, useEffect } from "react";
import {
  getQnaListForMaker,
  answerQuestion,
} from "../api/qnaApi";
import type {
  ProjectQnaResponse,
  ProjectQnaAnswerRequest,
} from "../types";

type MakerProjectQnaPanelProps = {
  projectId: number;
};

/**
 * 한글 설명: 메이커가 보는 프로젝트 관리 페이지에서 Q&A를 관리하는 패널
 * Q&A 목록 조회, 답변 등록/수정 기능 제공
 */
export const MakerProjectQnaPanel: React.FC<MakerProjectQnaPanelProps> = ({
  projectId,
}) => {
  // 한글 설명: Q&A 목록 상태
  const [qnaList, setQnaList] = useState<ProjectQnaResponse[]>([]);
  
  // 한글 설명: 로딩 상태
  const [loading, setLoading] = useState(false);
  
  // 한글 설명: 에러 상태
  const [error, setError] = useState<string | null>(null);
  
  // 한글 설명: 미답변만 보기 필터 상태
  const [unansweredOnly, setUnansweredOnly] = useState(false);
  
  // 한글 설명: 각 Q&A의 답변 입력 상태 (Q&A ID -> 답변 내용)
  const [answerInputs, setAnswerInputs] = useState<Record<number, string>>({});
  
  // 한글 설명: 답변 저장 중인 Q&A ID 목록 (중복 클릭 방지)
  const [savingQnaIds, setSavingQnaIds] = useState<Set<number>>(new Set());

  /**
   * 한글 설명: Q&A 목록 불러오기 API 호출
   */
  const fetchQnaList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQnaListForMaker(projectId, {
        unansweredOnly,
      });
      setQnaList(data);
      
      // 한글 설명: 기존 답변이 있는 Q&A는 답변 입력 상태에 초기값으로 설정
      const initialAnswers: Record<number, string> = {};
      data.forEach((qna) => {
        if (qna.answer) {
          initialAnswers[qna.id] = qna.answer;
        }
      });
      setAnswerInputs(initialAnswers);
    } catch (err) {
      console.error("Q&A 목록 조회 실패:", err);
      setError("Q&A를 불러오는 도중 문제가 발생했습니다.");
      setQnaList([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 한글 설명: 컴포넌트 마운트 시 및 필터 변경 시 Q&A 목록 불러오기
   */
  useEffect(() => {
    fetchQnaList();
  }, [projectId, unansweredOnly]);

  /**
   * 한글 설명: 답변 저장 핸들러
   */
  const handleSaveAnswer = async (qnaId: number) => {
    const answer = answerInputs[qnaId]?.trim();
    
    if (!answer) {
      alert("답변을 입력해주세요.");
      return;
    }

    // 한글 설명: 이미 저장 중이면 중복 요청 방지
    if (savingQnaIds.has(qnaId)) {
      return;
    }

    try {
      setSavingQnaIds((prev) => new Set(prev).add(qnaId));
      
      const payload: ProjectQnaAnswerRequest = {
        answer,
      };
      
      await answerQuestion(projectId, qnaId, payload);
      
      // 한글 설명: 성공 시 목록 새로고침
      await fetchQnaList();
      
      alert("저장되었습니다.");
    } catch (err) {
      console.error("답변 저장 실패:", err);
      alert("답변 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSavingQnaIds((prev) => {
        const next = new Set(prev);
        next.delete(qnaId);
        return next;
      });
    }
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

  // 한글 설명: 미답변 Q&A 개수 계산
  const unansweredCount = qnaList.filter(
    (qna) => qna.status === "PENDING"
  ).length;

  return (
    <div className="space-y-6">
      {/* 한글 설명: 필터 / 헤더 영역 */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Q&A 관리</h2>
          
          {/* 한글 설명: 미답변만 보기 필터 */}
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input
              type="checkbox"
              checked={unansweredOnly}
              onChange={(e) => setUnansweredOnly(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
            />
            <span>미답변만 보기</span>
          </label>
        </div>
        
        {/* 한글 설명: Q&A 개수 표시 */}
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <span>전체 {qnaList.length}개</span>
          {unansweredCount > 0 && (
            <span className="text-yellow-600">
              미답변 {unansweredCount}개
            </span>
          )}
        </div>
      </div>

      {/* 한글 설명: Q&A 리스트 */}
      {loading ? (
        // 한글 설명: 로딩 상태
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <div className="py-8 text-center text-sm text-neutral-500">
            로딩 중...
          </div>
        </div>
      ) : error ? (
        // 한글 설명: 에러 상태
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <div className="py-8 text-center text-sm text-red-600">{error}</div>
        </div>
      ) : qnaList.length === 0 ? (
        // 한글 설명: Q&A가 없을 때
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <div className="py-8 text-center text-sm text-neutral-500">
            {unansweredOnly
              ? "미답변 Q&A가 없습니다."
              : "등록된 Q&A가 없습니다."}
          </div>
        </div>
      ) : (
        // 한글 설명: Q&A 목록 표시
        <div className="space-y-4">
          {qnaList.map((qna) => (
            <div
              key={qna.id}
              className="rounded-xl border border-neutral-200 bg-white p-6"
            >
              {/* 한글 설명: Q&A 헤더 (질문자 정보 + 상태 + 날짜) */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* 한글 설명: 질문자 닉네임 */}
                  <span className="text-sm font-medium text-neutral-900">
                    {qna.questionerName}
                  </span>
                  
                  {/* 한글 설명: 상태 뱃지 */}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      qna.status === "ANSWERED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {qna.status === "ANSWERED" ? "답변 완료" : "미답변"}
                  </span>
                </div>
                
                {/* 한글 설명: 질문일시 */}
                <span className="text-xs text-neutral-500">
                  {formatDate(qna.createdAt)}
                </span>
              </div>
              
              {/* 한글 설명: 질문 내용 */}
              <div className="mb-4 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-700">
                <p className="font-medium text-neutral-900">질문:</p>
                <p className="mt-1 whitespace-pre-wrap">{qna.question}</p>
              </div>
              
              {/* 한글 설명: 답변 입력/수정 영역 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-neutral-900">
                  답변:
                </label>
                <textarea
                  value={answerInputs[qna.id] || ""}
                  onChange={(e) =>
                    setAnswerInputs((prev) => ({
                      ...prev,
                      [qna.id]: e.target.value,
                    }))
                  }
                  placeholder="답변을 입력하세요"
                  rows={4}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                />
                
                {/* 한글 설명: 답변 저장 버튼 */}
                <div className="flex items-center justify-between">
                  {/* 한글 설명: 기존 답변이 있고 수정된 경우 표시 */}
                  {qna.answer && answerInputs[qna.id] !== qna.answer && (
                    <span className="text-xs text-blue-600">
                      답변이 수정되었습니다.
                    </span>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => handleSaveAnswer(qna.id)}
                    disabled={savingQnaIds.has(qna.id)}
                    className="ml-auto rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingQnaIds.has(qna.id)
                      ? "저장 중..."
                      : qna.answer
                        ? "수정 후 저장"
                        : "답변 등록"}
                  </button>
                </div>
                
                {/* 한글 설명: 기존 답변일시 표시 (있을 때만) */}
                {qna.answeredAt && (
                  <p className="text-xs text-neutral-500">
                    답변일시: {formatDate(qna.answeredAt)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

