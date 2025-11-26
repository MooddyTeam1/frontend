import type {
  ProjectDetailResponseDTO,
  ProjectReviewStatus,
  ProjectId,
} from "../projects/types";

// 한글 설명: 관리자 프로젝트 심사 목록 항목 DTO (백엔드 CreateProjectResponse 대응)
export interface AdminProjectReviewDTO {
  projectId: ProjectId;
  maker: string; // 한글 설명: 메이커 이름
  title: string;
  requestAt: string; // 한글 설명: 심사 요청 시각
  reviewStatus: ProjectReviewStatus;
  rewardNames: string[];
  // 한글 설명: 하위 호환성을 위해 project 필드도 지원
  project?: ProjectId;
  projectReviewStatus?: ProjectReviewStatus;
  // 한글 설명: 심사 콘솔에서 사용하는 추가 필드
  id?: ProjectId; // 한글 설명: projectId와 동일 (하위 호환성)
  makerName?: string; // 한글 설명: maker와 동일 (하위 호환성)
  submittedAt?: string; // 한글 설명: requestAt과 동일 (하위 호환성)
  status?: string; // 한글 설명: 프로젝트 라이프사이클 상태 (DRAFT, SCHEDULED, LIVE, ENDED 등)
  startDate?: string; // 한글 설명: 프로젝트 시작일
  endDate?: string; // 한글 설명: 프로젝트 종료일
}

// 한글 설명: 관리자 프로젝트 상태 응답 DTO (백엔드 ProjectStatusResponse 대응)
export interface AdminProjectStatusResponseDTO {
  projectId: ProjectId;
  projectReviewStatus: ProjectReviewStatus;
}

// 한글 설명: 관리자 프로젝트 상세 응답 DTO (백엔드 ProjectDetailResponse 대응)
export type AdminProjectDetailDTO = ProjectDetailResponseDTO;

// 한글 설명: 관리자용 메이커 프로필 DTO (심사 시 필요한 모든 정보 포함)
// 한글 설명: makerType에 따라 다른 필드가 응답에 포함됨 (discriminated union)
export type AdminMakerProfileDTO =
  | {
      // 한글 설명: 개인 메이커 프로필
      id: string;
      ownerUserId: string;
      makerType: "INDIVIDUAL";
      name: string;
      // 한글 설명: 개인 메이커 전용 필드
      imageUrl?: string | null;
      techStack?: string[] | null;
      keywords?: number[] | null;
      // 한글 설명: 공통 필드
      productIntro?: string | null;
      coreCompetencies?: string | null;
      contactEmail?: string | null;
      contactPhone?: string | null;
      createdAt?: string;
      updatedAt?: string;
    }
  | {
      // 한글 설명: 사업자 메이커 프로필
      id: string;
      ownerUserId: string;
      makerType: "BUSINESS";
      name: string;
      // 한글 설명: 사업자 메이커 전용 필드
      businessNumber?: string | null;
      businessName?: string | null;
      businessType?: string | null;
      onlineSalesReportNumber?: string | null;
      establishedAt?: string | null;
      industryType?: string | null;
      representative?: string | null;
      location?: string | null;
      // 한글 설명: 공통 필드
      productIntro?: string | null;
      coreCompetencies?: string | null;
      contactEmail?: string | null;
      contactPhone?: string | null;
      createdAt?: string;
      updatedAt?: string;
    };

// ─────────────────────────
// Settlement API Types
// ─────────────────────────

// 한글 설명: 정산 상태 타입
export type SettlementStatus =
  | "PENDING" // 정산 대기
  | "FIRST_PAID" // 선지급 완료
  | "FINAL_READY" // 잔금 준비 완료
  | "COMPLETED"; // 정산 완료

// 한글 설명: 선지급 상태 타입
export type FirstPaymentStatus = "PENDING" | "DONE";

// 한글 설명: 잔금 지급 상태 타입
export type FinalPaymentStatus = "PENDING" | "READY" | "DONE";

// 한글 설명: 정산 요약 응답 DTO (백엔드 SettlementSummaryResponse 대응)
export interface SettlementSummaryResponse {
  // 한글 설명: 정산 대기 (PENDING)
  pendingCount: number; // 정산 대기 건수
  pendingAmount: number; // 정산 대기 금액 (Long)

  // 한글 설명: 선지급 완료 (FIRST_PAID)
  firstPaidCount: number; // 선지급 완료 건수
  firstPaidAmount: number; // 선지급 완료 금액 (Long)

  // 한글 설명: 잔금 준비 완료 (FINAL_READY)
  finalReadyCount: number; // 잔금 준비 완료 건수
  finalReadyAmount: number; // 잔금 준비 완료 금액 (Long)

  // 한글 설명: 정산 완료 (COMPLETED)
  completedCount: number; // 정산 완료 건수
  completedAmount: number; // 정산 완료 금액 (Long)
}

// 한글 설명: 정산 목록 항목 응답 DTO (Admin용, 백엔드 SettlementListItemResponse 대응)
export interface SettlementListItemResponse {
  settlementId: number; // 정산 ID
  projectId: number; // 프로젝트 ID
  projectTitle: string; // 프로젝트 제목
  makerId: number; // 메이커 ID
  makerName: string; // 메이커 이름
  status: SettlementStatus; // 정산 상태
  firstPaymentStatus: FirstPaymentStatus; // 선지급 상태
  finalPaymentStatus: FinalPaymentStatus; // 잔금 지급 상태
  totalOrderAmount: number; // 총 주문 금액 (Long)
  netAmount: number; // 정산액 (순수익, Long)
  firstPaymentAmount: number; // 선지급 금액 (Long)
  finalPaymentAmount: number; // 잔금 지급 금액 (Long)
  createdAt: string; // 생성 시각 (ISO 8601)
  updatedAt: string; // 수정 시각 (ISO 8601)
}

// 한글 설명: 정산 상세 응답 DTO (백엔드 SettlementResponse 대응)
export interface SettlementResponse {
  settlementId: number; // 정산 ID
  projectId: number; // 프로젝트 ID
  projectTitle: string; // 프로젝트 제목
  makerId: number; // 메이커 ID
  makerName: string; // 메이커 이름
  totalOrderAmount: number; // 총 주문 금액 (Long)
  tossFeeAmount: number; // 토스 수수료 (Long)
  platformFeeAmount: number; // 플랫폼 수수료 (Long)
  netAmount: number; // 정산액 (순수익, Long)
  firstPaymentAmount: number; // 선지급 금액 (Long)
  finalPaymentAmount: number; // 잔금 지급 금액 (Long)
  status: SettlementStatus; // 정산 상태
  firstPaymentStatus: FirstPaymentStatus; // 선지급 상태
  finalPaymentStatus: FinalPaymentStatus; // 잔금 지급 상태
  firstPaymentAt: string | null; // 선지급 시각 (ISO 8601, null 가능)
  finalPaymentAt: string | null; // 잔금 지급 시각 (ISO 8601, null 가능)
  retryCount: number; // 재시도 횟수
}

// 한글 설명: 페이지네이션 응답 DTO (Spring Page<T> 대응)
export interface PageResponse<T> {
  content: T[]; // 항목 목록
  number: number; // 현재 페이지 번호 (0-base)
  size: number; // 페이지 크기
  totalElements: number; // 전체 항목 수
  totalPages: number; // 전체 페이지 수
}

// ─────────────────────────
// Statistics API Types
// ─────────────────────────

// 한글 설명: KPI 항목 DTO (백엔드 KpiItemDto 대응)
export interface KpiItemDto {
  value: number; // Long
  changeRate: number; // Double (소수점 1자리)
  changeAmount: number; // Long
}

// 한글 설명: KPI 요약 DTO (백엔드 KpiSummaryDto 대응)
export interface KpiSummaryDto {
  totalFundingAmount: KpiItemDto; // 총 펀딩 금액
  totalOrderCount: KpiItemDto; // 총 결제 건수
  platformFeeRevenue: KpiItemDto; // 플랫폼 수수료 수익
  newProjectCount: KpiItemDto; // 신규 프로젝트 수
  newUserCount: KpiItemDto; // 신규 가입자 수
  activeSupporterCount: KpiItemDto; // 활성 서포터 수
}

// 한글 설명: 트렌드 데이터 DTO (백엔드 TrendDataDto 대응)
export interface TrendDataDto {
  date: string; // MM/dd 형식
  fundingAmount: number; // Long
  projectCount: number; // Integer
  orderCount: number; // Integer
}

// 한글 설명: 트렌드 차트 DTO (백엔드 TrendChartDto 대응)
export interface TrendChartDto {
  data: TrendDataDto[]; // 일별 데이터 배열
}

// 한글 설명: 카테고리 항목 DTO (백엔드 CategoryItemDto 대응)
export interface CategoryItemDto {
  categoryName: string; // Enum 값: TECH, DESIGN, FOOD, FASHION, BEAUTY, HOME_LIVING, GAME, ART, PUBLISH
  fundingAmount: number; // Long
  projectCount: number; // Integer
  orderCount: number; // Integer
  fundingRatio: number; // Double (소수점 1자리, 전체 대비 비율 %)
}

// 한글 설명: 카테고리 성과 DTO (백엔드 CategoryPerformanceDto 대응)
export interface CategoryPerformanceDto {
  categories: CategoryItemDto[]; // Top 4 카테고리
}

// 한글 설명: Top 프로젝트 DTO (백엔드 TopProjectDto 대응)
export interface TopProjectDto {
  projectId: number; // Long
  projectName: string;
  makerName: string;
  achievementRate: number; // Double (달성률 %)
  fundingAmount: number; // Long
  remainingDays: number; // Integer (음수 가능, 이미 종료된 프로젝트)
  coverImageUrl?: string | null; // 한글 설명: 프로젝트 썸네일 이미지 URL (백엔드에서 추가 예정)
}

// 한글 설명: 알림 DTO (백엔드 AlertDto 대응)
export interface AlertDto {
  type: "WARNING" | "ERROR" | "INFO";
  title: string;
  message: string;
}

// 한글 설명: 대시보드 요약 DTO (백엔드 DashboardSummaryDto 대응)
export interface DashboardSummaryDto {
  kpiSummary: KpiSummaryDto;
  trendChart: TrendChartDto;
  categoryPerformance: CategoryPerformanceDto;
  topProjects: TopProjectDto[]; // Top 5
  alerts: AlertDto[];
}

// ─────────────────────────
// Daily Statistics API Types
// ─────────────────────────

// 한글 설명: 방문자 통계 DTO (백엔드 TrafficDto 대응)
export interface TrafficDto {
  uniqueVisitors: number; // Long (추후 구현, 현재 항상 0)
  pageViews: number; // Long (추후 구현, 현재 항상 0)
  newUsers: number; // Long (신규 가입자 수)
  returningRate: number; // Double (추후 구현, 현재 항상 0.0)
}

// 한글 설명: 프로젝트 활동 통계 DTO (백엔드 ProjectActivityDto 대응)
export interface ProjectActivityDto {
  newProjectCount: number; // Long (신규 프로젝트 수)
  reviewRequestedCount: number; // Long (심사 요청된 프로젝트 수)
  approvedCount: number; // Long (승인된 프로젝트 수)
  closedTodayCount: number; // Long (종료된 프로젝트 수)
}

// 한글 설명: 결제 통계 DTO (백엔드 PaymentStatisticsDto 대응)
export interface PaymentStatisticsDto {
  attemptCount: number; // Long (결제 시도 건수)
  successCount: number; // Long (결제 성공 건수)
  successRate: number; // Double (결제 성공률 %, 소수점 1자리)
  failureCount: number; // Long (결제 실패 건수)
  refundCount: number; // Long (환불 건수)
  refundAmount: number; // Long (환불 금액 합계)
}

// 한글 설명: 시간대별 데이터 DTO (백엔드 HourlyDataDto 대응)
export interface HourlyDataDto {
  hour: number; // Integer (0~23)
  successCount: number; // Integer (성공 결제 건수)
  failureCount: number; // Integer (실패/취소 건수)
  successAmount: number; // Long (성공 결제 금액 합계)
}

// 한글 설명: 시간대별 차트 DTO (백엔드 HourlyChartDto 대응)
export interface HourlyChartDto {
  data: HourlyDataDto[]; // 항상 24개 (0~23시)
}

// 한글 설명: 프로젝트별 상세 DTO (백엔드 ProjectDetailDto 대응)
export interface ProjectDetailDto {
  projectId: number; // Long
  projectName: string;
  makerName: string;
  orderCount: number; // Integer (PAID 주문 건수)
  fundingAmount: number; // Long (펀딩 금액 합계)
  conversionRate: number; // Double (전환율 %, 추후 구현, 현재 항상 0.0)
}

// 한글 설명: 메이커별 상세 DTO (백엔드 MakerDetailDto 대응)
export interface MakerDetailDto {
  makerId: number; // Long
  makerName: string;
  projectCount: number; // Integer (프로젝트 수)
  orderCount: number; // Integer (주문 건수 합계)
  fundingAmount: number; // Long (펀딩 금액 합계)
}

// ─────────────────────────
// Revenue Report API Types
// ─────────────────────────

// 한글 설명: 플랫폼 매출 DTO (백엔드 PlatformRevenueDto 대응)
export interface PlatformRevenueDto {
  totalPaymentAmount: number; // Long (총 결제 금액)
  pgFeeAmount: number; // Long (PG 수수료, 지출)
  pgFeeRate: number; // Double (PG 수수료율, 5.0%)
  platformFeeAmount: number; // Long (플랫폼 수수료, 수익)
  platformFeeRate: number; // Double (플랫폼 수수료율, 10.0%)
  otherCosts: number; // Long (기타 비용, 현재 항상 0)
  netPlatformProfit: number; // Long (플랫폼 몫 = platformFeeAmount)
  netPayoutToMaker: number; // Long (메이커 지급액 = totalPaymentAmount - pgFeeAmount - platformFeeAmount)
}

// 한글 설명: 메이커 정산 요약 DTO (백엔드 MakerSettlementSummaryDto 대응)
export interface MakerSettlementSummaryDto {
  totalSettlementAmount: number; // Long (총 정산 금액)
  pendingAmount: number; // Long (정산 예정, PENDING)
  processingAmount: number; // Long (처리 중, FIRST_PAID + FINAL_READY)
  completedAmount: number; // Long (정산 완료, COMPLETED)
}

// 한글 설명: 수수료 정책 항목 DTO (백엔드 FeePolicyItemDto 대응)
export interface FeePolicyItemDto {
  policyName: string; // 정책 이름 (예: "일반 프로젝트 (10%)")
  projectCount: number; // Integer (프로젝트 수)
  paymentAmount: number; // Long (결제 금액 합계)
  feeAmount: number; // Long (수수료 금액 합계)
  contributionRate: number; // Double (전체 대비 기여율 %)
}

// 한글 설명: 수수료 정책 분석 DTO (백엔드 FeePolicyAnalysisDto 대응)
export interface FeePolicyAnalysisDto {
  policies: FeePolicyItemDto[]; // 수수료 정책 목록 (현재는 1개만)
}

// 한글 설명: 수익 리포트 세부 내역 DTO (백엔드 RevenueDetailDto 대응)
export interface RevenueDetailDto {
  date: string; // YYYY-MM-DD (주문 날짜)
  projectId: number; // Long
  projectName: string;
  makerName: string;
  paymentAmount: number; // Long (결제 금액)
  pgFee: number; // Long (PG 수수료)
  platformFee: number; // Long (플랫폼 수수료)
  makerSettlementAmount: number; // Long (메이커 정산 금액)
  settlementStatus: string; // 정산 상태 (PENDING, FIRST_PAID, FINAL_READY, COMPLETED)
}

// 한글 설명: 수익 리포트 DTO (백엔드 RevenueReportDto 대응)
export interface RevenueReportDto {
  platformRevenue: PlatformRevenueDto;
  makerSettlementSummary: MakerSettlementSummaryDto;
  feePolicyAnalysis: FeePolicyAnalysisDto;
  details: RevenueDetailDto[];
}

// ─────────────────────────
// Monthly Report API Types
// ─────────────────────────

// 한글 설명: KPI 항목 DTO (백엔드 KpiItemDto 대응)
export interface KpiItemDto {
  value: number; // Long (현재 월 값)
  changeRate: number; // Double (전월 대비 증감률 %)
  changeAmount: number; // Long (전월 대비 증감액)
}

// 한글 설명: 월간 KPI DTO (백엔드 MonthlyKpiDto 대응)
export interface MonthlyKpiDto {
  totalFundingAmount: KpiItemDto; // 총 펀딩 금액 (전월 대비)
  successProjectCount: number; // Integer (성공 종료 프로젝트 수)
  failedProjectCount: number; // Integer (실패 종료 프로젝트 수)
  newMakerCount: number; // Integer (신규 메이커 수)
  newSupporterCount: number; // Integer (신규 서포터 수)
}

// 한글 설명: 월간 추이 데이터 DTO (백엔드 MonthlyTrendDataDto 대응)
export interface MonthlyTrendDataDto {
  date: string; // MM/dd 형식 (예: "11/15")
  fundingAmount: number; // Long (해당일 펀딩액)
  projectCount: number; // Integer (해당일 주문이 발생한 고유 프로젝트 수)
  orderCount: number; // Integer (해당일 주문 수)
}

// 한글 설명: 월간 추이 차트 DTO (백엔드 MonthlyTrendChartDto 대응)
export interface MonthlyTrendChartDto {
  data: MonthlyTrendDataDto[]; // 일별 데이터 (가변, 주문이 없는 날은 제외)
}

// 한글 설명: 성공률 항목 DTO (백엔드 SuccessRateItemDto 대응)
export interface SuccessRateItemDto {
  successCount: number; // Integer (성공 프로젝트 수)
  totalCount: number; // Integer (전체 프로젝트 수)
  rate: number; // Double (성공률 %)
}

// 한글 설명: 성공률 DTO (백엔드 SuccessRateDto 대응)
export interface SuccessRateDto {
  startBased: SuccessRateItemDto; // 시작 기준 성공률
  endBased: SuccessRateItemDto; // 종료 기준 성공률
}

// 한글 설명: 목표금액 구간 항목 DTO (백엔드 GoalRangeItemDto 대응)
export interface GoalRangeItemDto {
  rangeName: string; // 구간 이름 (예: "소액 (100만원 미만)")
  successCount: number; // Integer (성공 프로젝트 수)
  totalCount: number; // Integer (전체 프로젝트 수)
  successRate: number; // Double (성공률 %)
}

// 한글 설명: 목표금액 구간 DTO (백엔드 GoalAmountRangeDto 대응)
export interface GoalAmountRangeDto {
  ranges: GoalRangeItemDto[]; // 3개 구간 고정
}

// 한글 설명: 카테고리별 성공률 항목 DTO (백엔드 CategorySuccessItemDto 대응)
export interface CategorySuccessItemDto {
  categoryName: string; // 카테고리 Enum 값 (영문, 예: "TECH")
  totalCount: number; // Integer (전체 프로젝트 수)
  successCount: number; // Integer (성공 프로젝트 수)
  successRate: number; // Double (성공률 %)
}

// 한글 설명: 카테고리별 성공률 DTO (백엔드 CategorySuccessRateDto 대응)
export interface CategorySuccessRateDto {
  categories: CategorySuccessItemDto[]; // 모든 카테고리 (9개)
}

// 한글 설명: 리텐션 DTO (백엔드 RetentionDto 대응)
export interface RetentionDto {
  repeatSupporterRate: number; // Double (재후원 유저 비율 %, existingRatio와 동일)
  existingSupporterCount: number; // Long (기존 서포터 수)
  newSupporterCount: number; // Long (신규 서포터 수)
  existingRatio: number; // Double (기존 서포터 비율 %, repeatSupporterRate와 동일)
  newRatio: number; // Double (신규 서포터 비율 %)
}

// 한글 설명: 월별 리포트 DTO (백엔드 MonthlyReportDto 대응)
export interface MonthlyReportDto {
  targetMonth: string; // YYYY-MM 형식
  compareMonth: string; // YYYY-MM 형식
  kpi: MonthlyKpiDto;
  trendChart: MonthlyTrendChartDto;
  successRate: SuccessRateDto;
  goalAmountRange: GoalAmountRangeDto;
  categorySuccessRate: CategorySuccessRateDto;
  retention: RetentionDto;
}

// ─────────────────────────
// Project Performance API Types
// ─────────────────────────

// 한글 설명: 프로젝트별 성과 항목 DTO (백엔드 ProjectPerformanceItemDto 대응)
export interface ProjectPerformanceItemDto {
  projectId: number; // Long
  projectName: string;
  makerName: string;
  category: string; // 카테고리 Enum 값 (영문, 예: "TECH")
  fundingAmount: number; // Long (현재 펀딩 금액)
  achievementRate: number; // Double (목표 달성률 %)
  supporterCount: number; // Integer (후원자 수)
  averageSupportAmount: number; // Long (평균 후원액)
  bookmarkCount: number; // Long (북마크 수, 현재 항상 0)
  conversionRate: number; // Double (전환율 %, 현재 항상 0.0)
  remainingDays: number; // Integer (남은 일수, 음수 가능)
}

// 한글 설명: 카테고리별 평균 성과 DTO (백엔드 CategoryAverageDto 대응)
export interface CategoryAverageDto {
  categoryName: string; // 카테고리 Enum 값 (영문)
  averageAchievementRate: number; // Double (평균 달성률 %)
  averageFundingAmount: number; // Long (평균 펀딩액)
  successRate: number; // Double (성공률 %)
}

// 한글 설명: 메이커별 평균 성과 DTO (백엔드 MakerAverageDto 대응)
export interface MakerAverageDto {
  makerId: number; // Long
  makerName: string;
  projectCount: number; // Integer (프로젝트 수)
  averageFundingAmount: number; // Long (평균 펀딩액)
  successRate: number; // Double (성공률 %)
  isFirstProject: boolean; // 첫 프로젝트 여부 (projectCount == 1)
}

// 한글 설명: 위험 프로젝트 DTO (백엔드 RiskProjectDto 대응)
export interface RiskProjectDto {
  projectId: number; // Long
  projectName: string;
  makerName: string;
  reason: string; // 위험 이유 (고정값: "마감 임박, 달성률 낮음")
  remainingDays: number; // Integer (남은 일수)
  achievementRate: number; // Double (현재 달성률 %)
}

// 한글 설명: 기회 프로젝트 DTO (백엔드 OpportunityProjectDto 대응)
export interface OpportunityProjectDto {
  projectId: number; // Long
  projectName: string;
  makerName: string;
  reason: string; // 기회 이유 (고정값: "초기 반응이 좋은 프로젝트")
  remainingDays: number; // Integer (남은 일수)
  achievementRate: number; // Double (현재 달성률 %)
}

// 한글 설명: 프로젝트 성과 리포트 DTO (백엔드 ProjectPerformanceDto 대응)
export interface ProjectPerformanceDto {
  projects: ProjectPerformanceItemDto[];
  categoryAverages: CategoryAverageDto[];
  makerAverages: MakerAverageDto[];
  riskProjects: RiskProjectDto[];
  opportunityProjects: OpportunityProjectDto[];
}

// 한글 설명: 일일 통계 DTO (백엔드 DailyStatisticsDto 대응)
export interface DailyStatisticsDto {
  traffic: TrafficDto;
  projectActivity: ProjectActivityDto;
  paymentStatistics: PaymentStatisticsDto;
  hourlyChart: HourlyChartDto;
  projectDetails: ProjectDetailDto[];
  makerDetails: MakerDetailDto[];
}
