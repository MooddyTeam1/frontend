// 한글 설명: 심사 대기 프로젝트 목록 컴포넌트
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getReviewProjects } from "../../../services/admin/projectReviewService";
import type { AdminProjectReviewResponse } from "../../../types/admin/projectReview";

// 한글 설명: 날짜 포맷팅 함수 (date-fns 대신 기본 Date 객체 사용)
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

/**
 * 한글 설명: 심사 대기 프로젝트 목록 컴포넌트
 * 
 * React Query를 사용하려면:
 * 1. npm install @tanstack/react-query 실행
 * 2. useReviewProjects 훅을 사용하도록 수정
 */
export const ProjectReviewList: React.FC = () => {
  const [projects, setProjects] = useState<AdminProjectReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 프로젝트 목록 조회 함수
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getReviewProjects();
      setProjects(data);
    } catch (fetchError) {
      console.error("심사 대기 목록 조회 실패", fetchError);
      setError("목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 한글 설명: 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // 한글 설명: 로딩 상태 UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // 한글 설명: 에러 상태 UI
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // 한글 설명: 빈 목록 상태 UI
  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">심사 대기 중인 프로젝트가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-6">심사 대기 프로젝트</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                프로젝트 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                메이커
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                리워드
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                심사 요청일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.projectId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {project.projectId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <Link
                    to={`/admin/project/review/${project.projectId}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {project.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.maker}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex flex-wrap gap-1">
                    {project.rewardNames.slice(0, 2).map((name, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800"
                      >
                        {name}
                      </span>
                    ))}
                    {project.rewardNames.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800">
                        +{project.rewardNames.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.requestAt ? formatDate(project.requestAt) : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    심사중
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/admin/project/review/${project.projectId}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    상세보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

