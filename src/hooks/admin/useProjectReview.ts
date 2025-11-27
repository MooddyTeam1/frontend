// 한글 설명: 관리자 프로젝트 심사 관련 React Query 훅 (선택사항)
// 
// React Query 사용을 위해서는 @tanstack/react-query 패키지 설치가 필요합니다.
// 설치 방법: npm install @tanstack/react-query
//
// 설치 후 아래 주석을 해제하고 사용하세요.
// 현재는 컴포넌트에서 직접 API 서비스를 호출하는 방식으로 구현되어 있습니다.

/*
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getReviewProjects,
  getProjectDetail,
  approveProject,
  rejectProject,
  getRejectReasonPresets,
} from "@/services/admin/projectReviewService";
import type {
  RejectProjectRequest,
} from "@/types/admin/projectReview";

// 한글 설명: 심사 대기 프로젝트 목록 조회 훅
export const useReviewProjects = () => {
  return useQuery({
    queryKey: ["admin", "project", "review"],
    queryFn: getReviewProjects,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 한글 설명: 프로젝트 심사 상세 조회 훅
export const useProjectDetail = (projectId: number | null) => {
  return useQuery({
    queryKey: ["admin", "project", "detail", projectId],
    queryFn: () => getProjectDetail(projectId!),
    enabled: projectId !== null,
  });
};

// 한글 설명: 반려 사유 프리셋 조회 훅
export const useRejectReasonPresets = () => {
  return useQuery({
    queryKey: ["admin", "project", "reject-reason-presets"],
    queryFn: getRejectReasonPresets,
    staleTime: 1000 * 60 * 60, // 1시간 (프리셋은 자주 변경되지 않음)
  });
};

// 한글 설명: 프로젝트 승인 뮤테이션 훅
export const useApproveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveProject,
    onSuccess: () => {
      // 한글 설명: 목록과 상세 모두 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ["admin", "project"] });
    },
  });
};

// 한글 설명: 프로젝트 반려 뮤테이션 훅
export const useRejectProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, request }: { projectId: number; request: RejectProjectRequest }) =>
      rejectProject(projectId, request),
    onSuccess: () => {
      // 한글 설명: 목록과 상세 모두 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ["admin", "project"] });
    },
  });
};
*/

// 한글 설명: 현재는 React Query 없이 컴포넌트에서 직접 API를 호출하는 방식으로 구현됩니다.
// React Query를 설치하고 사용하려면 위의 주석을 해제하세요.

