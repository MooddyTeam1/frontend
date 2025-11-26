import api from "../../../services/api";
import type {
  DashboardSummaryDto,
  DailyStatisticsDto,
  RevenueReportDto,
  MonthlyReportDto,
  ProjectPerformanceDto,
} from "../types";

// 한글 설명: 관리자 통계 대시보드 요약 조회 API
// GET /api/admin/statistics/dashboard
export const fetchAdminDashboardSummary = async (): Promise<DashboardSummaryDto> => {
  console.log("[adminStatisticsService] GET /admin/statistics/dashboard 요청");
  try {
    const { data } = await api.get<DashboardSummaryDto>(
      "/admin/statistics/dashboard"
    );
    console.log("[adminStatisticsService] GET /admin/statistics/dashboard 응답", data);
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
  filterType?: "PLATFORM" | "CATEGORY" | "MAKER"; // 선택
  filterValue?: string; // 선택 (카테고리 Enum 또는 메이커 ID)
}): Promise<DailyStatisticsDto> => {
  console.log("[adminStatisticsService] GET /admin/statistics/daily 요청", params);
  try {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
    });

    // 한글 설명: 필터 파라미터 추가 (있을 때만)
    if (params.filterType && params.filterType !== "PLATFORM" && params.filterValue) {
      queryParams.append("filterType", params.filterType);
      queryParams.append("filterValue", params.filterValue);
    }

    const { data } = await api.get<DailyStatisticsDto>(
      `/admin/statistics/daily?${queryParams.toString()}`
    );
    console.log("[adminStatisticsService] GET /admin/statistics/daily 응답", data);
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
  console.log("[adminStatisticsService] GET /admin/statistics/revenue 요청", params);
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
      `/admin/statistics/revenue?${queryParams.toString()}`
    );
    console.log("[adminStatisticsService] GET /admin/statistics/revenue 응답", data);
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
  console.log("[adminStatisticsService] GET /admin/statistics/monthly 요청", params);
  try {
    const queryParams = new URLSearchParams({
      targetMonth: params.targetMonth,
    });

    // 한글 설명: 비교 월 파라미터 추가 (있을 때만)
    if (params.compareMonth) {
      queryParams.append("compareMonth", params.compareMonth);
    }

    const { data } = await api.get<MonthlyReportDto>(
      `/admin/statistics/monthly?${queryParams.toString()}`
    );
    console.log("[adminStatisticsService] GET /admin/statistics/monthly 응답", data);
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
    "[adminStatisticsService] GET /admin/statistics/project-performance 요청",
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
    const url = `/admin/statistics/project-performance${
      queryString ? `?${queryString}` : ""
    }`;

    const { data } = await api.get<ProjectPerformanceDto>(url);
    console.log(
      "[adminStatisticsService] GET /admin/statistics/project-performance 응답",
      data
    );
    return data;
  } catch (error) {
    console.error("[adminStatisticsService] 프로젝트 성과 리포트 조회 실패:", error);
    throw error;
  }
};

