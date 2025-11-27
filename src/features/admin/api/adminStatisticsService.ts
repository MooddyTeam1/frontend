import api from "../../../services/api";
import type {
  DashboardSummaryDto,
  DailyStatisticsDto,
  RevenueReportDto,
  MonthlyReportDto,
  ProjectPerformanceDto,
  FunnelReportDto,
} from "../types";

// 한글 설명: 관리자 통계 대시보드 요약 조회 API
// GET /api/admin/statistics/dashboard
export const fetchAdminDashboardSummary = async (): Promise<DashboardSummaryDto> => {
  console.log("[adminStatisticsService] GET /api/admin/statistics/dashboard 요청");
  try {
    const { data } = await api.get<DashboardSummaryDto>(
      "/api/admin/statistics/dashboard"
    );
    console.log("[adminStatisticsService] GET /api/admin/statistics/dashboard 응답", data);
    return data;
  } catch (error) {
    console.error("[adminStatisticsService] 대시보드 요약 조회 실패:", error);
    throw error;
  }
};

// 한글 설명: 관리자 일일 통계 조회 API
// GET /api/admin/statistics/daily
export const fetchAdminDailyStatistics = async (params: {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  filterType?: "CATEGORY" | "MAKER" | "PROJECT"; // 선택 (백엔드: CATEGORY/MAKER/PROJECT)
  filterValue?: string; // 선택 (카테고리 Enum, 메이커 ID, 또는 프로젝트 ID)
}): Promise<DailyStatisticsDto> => {
  console.log("[adminStatisticsService] GET /api/admin/statistics/daily 요청", params);
  try {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
    });

    // 한글 설명: 필터 파라미터 추가 (있을 때만)
    if (params.filterType && params.filterValue) {
      queryParams.append("filterType", params.filterType);
      queryParams.append("filterValue", params.filterValue);
    }

    const { data } = await api.get<DailyStatisticsDto>(
      `/api/admin/statistics/daily?${queryParams.toString()}`
    );
    console.log("[adminStatisticsService] GET /api/admin/statistics/daily 응답", data);
    return data;
  } catch (error) {
    console.error("[adminStatisticsService] 일일 통계 조회 실패:", error);
    throw error;
  }
};

// 한글 설명: 관리자 수익 리포트 조회 API
// GET /api/admin/statistics/revenue
export const fetchAdminRevenueReport = async (params: {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  makerId?: number; // 선택 (Long)
  projectId?: number; // 선택 (Long)
}): Promise<RevenueReportDto> => {
  console.log("[adminStatisticsService] GET /api/admin/statistics/revenue 요청", params);
  try {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
    });

    // 한글 설명: 필터 파라미터 추가 (있을 때만)
    if (params.makerId !== undefined) {
      queryParams.append("makerId", params.makerId.toString());
    }
    if (params.projectId !== undefined) {
      queryParams.append("projectId", params.projectId.toString());
    }

    const { data } = await api.get<RevenueReportDto>(
      `/api/admin/statistics/revenue?${queryParams.toString()}`
    );
    console.log("[adminStatisticsService] GET /api/admin/statistics/revenue 응답", data);
    return data;
  } catch (error) {
    console.error("[adminStatisticsService] 수익 리포트 조회 실패:", error);
    throw error;
  }
};

// 한글 설명: 관리자 월별 리포트 조회 API
// GET /api/admin/statistics/monthly
export const fetchAdminMonthlyReport = async (params: {
  targetMonth: string; // YYYY-MM 형식
  compareMonth?: string; // 선택 (YYYY-MM 형식, 생략 시 전월 자동)
}): Promise<MonthlyReportDto> => {
  console.log("[adminStatisticsService] GET /api/admin/statistics/monthly 요청", params);
  try {
    const queryParams = new URLSearchParams({
      targetMonth: params.targetMonth,
    });

    // 한글 설명: 비교 월 파라미터 추가 (있을 때만)
    if (params.compareMonth) {
      queryParams.append("compareMonth", params.compareMonth);
    }

    const { data } = await api.get<MonthlyReportDto>(
      `/api/admin/statistics/monthly?${queryParams.toString()}`
    );
    console.log("[adminStatisticsService] GET /api/admin/statistics/monthly 응답", data);
    return data;
  } catch (error) {
    console.error("[adminStatisticsService] 월별 리포트 조회 실패:", error);
    throw error;
  }
};

// 한글 설명: 관리자 프로젝트 성과 리포트 조회 API
// GET /api/admin/statistics/project-performance
export const fetchAdminProjectPerformance = async (params?: {
  category?: string; // 선택 (카테고리 Enum 값, 영문, 예: "TECH")
  makerId?: number; // 선택 (메이커 ID, Long)
}): Promise<ProjectPerformanceDto> => {
  console.log(
    "[adminStatisticsService] GET /api/admin/statistics/project-performance 요청",
    params
  );
  try {
    const queryParams = new URLSearchParams();

    // 한글 설명: 필터 파라미터 추가 (있을 때만)
    if (params?.category) {
      queryParams.append("category", params.category);
    }
    if (params?.makerId !== undefined) {
      queryParams.append("makerId", params.makerId.toString());
    }

    const queryString = queryParams.toString();
    const url = `/api/admin/statistics/project-performance${
      queryString ? `?${queryString}` : ""
    }`;

    const { data } = await api.get<ProjectPerformanceDto>(url);
    console.log(
      "[adminStatisticsService] GET /api/admin/statistics/project-performance 응답",
      data
    );
    return data;
  } catch (error) {
    console.error("[adminStatisticsService] 프로젝트 성과 리포트 조회 실패:", error);
    throw error;
  }
};

// 한글 설명: 관리자 퍼널 리포트 조회 API
// GET /api/admin/statistics/funnel
export const fetchAdminFunnelReport = async (params: {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  projectId?: number; // 선택 (특정 프로젝트만 조회)
}): Promise<FunnelReportDto> => {
  console.log("[adminStatisticsService] GET /api/admin/statistics/funnel 요청", params);
  try {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
    });

    // 한글 설명: 프로젝트 ID 필터 추가 (있을 때만)
    if (params.projectId !== undefined) {
      queryParams.append("projectId", params.projectId.toString());
    }

    const { data } = await api.get<FunnelReportDto>(
      `/api/admin/statistics/funnel?${queryParams.toString()}`
    );
    console.log("[adminStatisticsService] GET /api/admin/statistics/funnel 응답", data);
    return data;
  } catch (error) {
    console.error("[adminStatisticsService] 퍼널 리포트 조회 실패:", error);
    throw error;
  }
};

