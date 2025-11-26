// 한글 설명: 서포터가 작성한 모든 프로젝트의 Q&A 목록 컴포넌트
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyQnaList } from "../api/qnaApi";
import type { ProjectQnaResponse } from "../types";

type MyAllQnaListProps = {
  projectIds: number[]; // 한글 설명: 조회할 프로젝트 ID 목록
};

/**
 * 한글 설명: 서포터가 작성한 모든 프로젝트의 Q&A 목록을 표시하는 컴포넌트
 * 각 프로젝트별로 Q&A를 조회하여 통합하여 보여줌
 */
export const MyAllQnaList: React.FC<MyAllQnaListProps> = ({ projectIds }) => {
  // 한글 설명: 모든 프로젝트의 Q&A 목록 (프로젝트 정보 포함)
  const [allQnas, setAllQnas] = useState<
    Array<ProjectQnaResponse & { projectId: number; projectTitle?: string }>
  >([]);
  
  // 한글 설명: 로딩 상태
  const [loading, setLoading] = useState(false);
  
  // 한글 설명: 에러 상태
  const [error, setError] = useState<string | null>(null);

  /**
   * 한글 설명: 모든 프로젝트의 Q&A 목록 불러오기
   */
  const fetchAllQnas = async () => {
    if (projectIds.length === 0) {
      setAllQnas([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 한글 설명: 모든 프로젝트에 대해 Q&A 목록 조회
      const qnaPromises = projectIds.map(async (projectId) => {
        try {
          const qnas = await getMyQnaList(projectId);
          // 한글 설명: 각 Q&A에 프로젝트 ID 추가
          return qnas.map((qna) => ({
            ...qna,
            projectId,
          }));
        } catch (err) {
          console.error(`프로젝트 ${projectId}의 Q&A 조회 실패:`, err);
          return [];
        }
      });

      const qnaArrays = await Promise.all(qnaPromises);
      // 한글 설명: 모든 Q&A를 하나의 배열로 합치고 최신순으로 정렬
      const allQnasFlat = qnaArrays.flat();
      allQnasFlat.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // 한글 설명: 최신순 정렬
      });

      setAllQnas(allQnasFlat);
    } catch (err) {
      console.error("Q&A 목록 조회 실패:", err);
      setError("Q&A 목록을 불러오는 도중 문제가 발생했습니다.");
      setAllQnas([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 한글 설명: 컴포넌트 마운트 시 및 프로젝트 ID 목록 변경 시 Q&A 목록 불러오기
   */
  useEffect(() => {
    fetchAllQnas();
  }, [projectIds.join(",")]); // 한글 설명: projectIds 배열이 변경되면 재조회

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
    <div className="space-y-4">
      {loading ? (
        // 한글 설명: 로딩 상태
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm text-neutral-500">문의사항을 불러오는 중...</p>
        </div>
      ) : error ? (
        // 한글 설명: 에러 상태
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      ) : allQnas.length === 0 ? (
        // 한글 설명: Q&A가 없을 때
        <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm text-neutral-500">
            아직 작성한 문의사항이 없습니다.
          </p>
        </div>
      ) : (
        // 한글 설명: Q&A 목록 표시
        <div className="space-y-4">
          {allQnas.map((qna) => (
            <div
              key={`${qna.projectId}-${qna.id}`}
              className="rounded-xl border border-neutral-200 bg-white p-4"
            >
              {/* 한글 설명: Q&A 헤더 (프로젝트 링크 + 상태 + 날짜) */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* 한글 설명: 프로젝트 링크 */}
                  <Link
                    to={`/projects/${qna.projectId}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    프로젝트 #{qna.projectId}
                  </Link>
                  
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
  );
};

