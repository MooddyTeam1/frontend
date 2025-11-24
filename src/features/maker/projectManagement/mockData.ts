// 한글 설명: 메이커 프로젝트 관리 Mock 데이터
import type {
  MakerProjectListItemDTO,
  ProjectSummaryStatsDTO,
  MakerProjectDetailDTO,
  OrderItemDTO,
  ProjectNoticeDTO,
  ProjectQnADTO,
  DailyStatsDTO,
  ChannelStatsDTO,
  RewardSalesStatsDTO,
} from "./types";

// 한글 설명: Mock 프로젝트 목록 데이터
export const mockProjectList: MakerProjectListItemDTO[] = [
  {
    id: 1,
    thumbnailUrl: "https://placehold.co/400x300",
    title: "스마트 LED 램프 프로젝트",
    category: "테크",
    status: "LIVE",
    progressPercent: 75.5,
    currentAmount: 15100000,
    goalAmount: 20000000,
    daysLeft: 12,
    supporterCount: 245,
    lastModifiedAt: "2025-11-20T10:30:00Z",
    createdAt: "2025-10-15T09:00:00Z",
  },
  {
    id: 2,
    thumbnailUrl: "https://placehold.co/400x300",
    title: "친환경 텀블러 세트",
    category: "라이프스타일",
    status: "ENDED_SUCCESS",
    progressPercent: 120.0,
    currentAmount: 24000000,
    goalAmount: 20000000,
    daysLeft: null,
    supporterCount: 380,
    lastModifiedAt: "2025-11-10T14:20:00Z",
    createdAt: "2025-09-01T08:00:00Z",
  },
  {
    id: 3,
    thumbnailUrl: "https://placehold.co/400x300",
    title: "AI 반려동물 트래커",
    category: "테크",
    status: "REVIEW",
    progressPercent: 0,
    currentAmount: 0,
    goalAmount: 50000000,
    daysLeft: null,
    supporterCount: 0,
    lastModifiedAt: "2025-11-19T16:45:00Z",
    createdAt: "2025-11-15T10:00:00Z",
  },
  {
    id: 4,
    thumbnailUrl: "https://placehold.co/400x300",
    title: "수제 핸드크림 세트",
    category: "뷰티",
    status: "DRAFT",
    progressPercent: 0,
    currentAmount: 0,
    goalAmount: 10000000,
    daysLeft: null,
    supporterCount: 0,
    lastModifiedAt: "2025-11-21T09:15:00Z",
    createdAt: "2025-11-18T11:00:00Z",
  },
  {
    id: 5,
    thumbnailUrl: "https://placehold.co/400x300",
    title: "미니멀 워치 컬렉션",
    category: "패션",
    status: "SCHEDULED",
    progressPercent: 0,
    currentAmount: 0,
    goalAmount: 30000000,
    daysLeft: 5,
    supporterCount: 0,
    lastModifiedAt: "2025-11-20T13:30:00Z",
    createdAt: "2025-11-10T09:00:00Z",
  },
  {
    id: 6,
    thumbnailUrl: "https://placehold.co/400x300",
    title: "건강한 간식 박스",
    category: "푸드",
    status: "REJECTED",
    progressPercent: 0,
    currentAmount: 0,
    goalAmount: 15000000,
    daysLeft: null,
    supporterCount: 0,
    lastModifiedAt: "2025-11-15T10:20:00Z",
    createdAt: "2025-11-05T08:00:00Z",
  },
  {
    id: 7,
    thumbnailUrl: "https://placehold.co/400x300",
    title: "실패한 프로젝트 예시",
    category: "테크",
    status: "ENDED_FAILED",
    progressPercent: 45.2,
    currentAmount: 4520000,
    goalAmount: 10000000,
    daysLeft: null,
    supporterCount: 68,
    lastModifiedAt: "2025-11-05T16:30:00Z",
    createdAt: "2025-10-01T09:00:00Z",
  },
];

// 한글 설명: Mock 통계 요약 데이터
export const mockSummaryStats: ProjectSummaryStatsDTO = {
  totalProjects: 12,
  liveProjects: 3,
  totalRaised: 125000000,
  newProjectsThisMonth: 4,
  newProjectsThisWeek: 2,
  averageSupportAmount: 125000,
  averageSupporterCount: 180,
};

// 한글 설명: Mock 일별 통계 데이터
export const mockDailyStats: DailyStatsDTO[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split("T")[0],
    views: Math.floor(Math.random() * 500) + 100,
    supporters: Math.floor(Math.random() * 20) + 5,
    amount: Math.floor(Math.random() * 2000000) + 500000,
  };
});

// 한글 설명: Mock 채널별 유입 통계
export const mockChannelStats: ChannelStatsDTO[] = [
  { channel: "직접 방문", count: 1250, percentage: 35.2 },
  { channel: "검색", count: 890, percentage: 25.1 },
  { channel: "인스타그램", count: 720, percentage: 20.3 },
  { channel: "블로그", count: 450, percentage: 12.7 },
  { channel: "카카오톡", count: 240, percentage: 6.7 },
];

// 한글 설명: Mock 리워드별 판매 통계
export const mockRewardSalesStats: RewardSalesStatsDTO[] = [
  {
    rewardId: 1,
    rewardTitle: "얼리버드 패키지",
    salesCount: 180,
    totalAmount: 8820000,
    percentage: 45.2,
  },
  {
    rewardId: 2,
    rewardTitle: "스탠다드 패키지",
    salesCount: 120,
    totalAmount: 7080000,
    percentage: 36.3,
  },
  {
    rewardId: 3,
    rewardTitle: "프리미엄 패키지",
    salesCount: 35,
    totalAmount: 3500000,
    percentage: 18.5,
  },
];

// 한글 설명: Mock 주문 데이터
export const mockOrders: OrderItemDTO[] = [
  {
    orderId: 1,
    orderCode: "ORD-20251121-001",
    supporterName: "김서포터",
    supporterId: 1001,
    rewardTitle: "얼리버드 패키지",
    rewardId: 1,
    amount: 49000,
    paymentStatus: "SUCCESS",
    deliveryStatus: "PREPARING",
    orderedAt: "2025-11-21T10:30:00Z",
    paidAt: "2025-11-21T10:31:00Z",
  },
  {
    orderId: 2,
    orderCode: "ORD-20251121-002",
    supporterName: "이후원자",
    supporterId: 1002,
    rewardTitle: "스탠다드 패키지",
    rewardId: 2,
    amount: 59000,
    paymentStatus: "SUCCESS",
    deliveryStatus: "SHIPPED",
    orderedAt: "2025-11-20T14:20:00Z",
    paidAt: "2025-11-20T14:21:00Z",
  },
  {
    orderId: 3,
    orderCode: "ORD-20251121-003",
    supporterName: "박참여자",
    supporterId: 1003,
    rewardTitle: "프리미엄 패키지",
    rewardId: 3,
    amount: 100000,
    paymentStatus: "SUCCESS",
    deliveryStatus: "DELIVERED",
    orderedAt: "2025-11-19T09:15:00Z",
    paidAt: "2025-11-19T09:16:00Z",
  },
  {
    orderId: 4,
    orderCode: "ORD-20251121-004",
    supporterName: "최지원자",
    supporterId: 1004,
    rewardTitle: "얼리버드 패키지",
    rewardId: 1,
    amount: 49000,
    paymentStatus: "CANCELLED",
    deliveryStatus: "NONE",
    orderedAt: "2025-11-18T16:45:00Z",
    paidAt: null,
  },
];

// 한글 설명: Mock 공지 데이터
export const mockNotices: ProjectNoticeDTO[] = [
  {
    id: 1,
    title: "프로젝트 진행 상황 업데이트",
    content: "안녕하세요! 프로젝트가 목표의 75%를 달성했습니다. 감사합니다.",
    isPublic: true,
    notifySupporters: true,
    createdAt: "2025-11-20T10:00:00Z",
    updatedAt: "2025-11-20T10:00:00Z",
  },
  {
    id: 2,
    title: "배송 일정 안내",
    content: "12월 중순부터 순차적으로 배송을 시작할 예정입니다.",
    isPublic: true,
    notifySupporters: false,
    createdAt: "2025-11-15T14:30:00Z",
    updatedAt: "2025-11-15T14:30:00Z",
  },
];

// 한글 설명: Mock Q&A 데이터
export const mockQnAs: ProjectQnADTO[] = [
  {
    id: 1,
    questionerName: "김질문자",
    questionerId: 2001,
    question: "배송은 언제 시작되나요?",
    answer: "12월 중순부터 순차적으로 배송을 시작할 예정입니다.",
    status: "ANSWERED",
    createdAt: "2025-11-18T11:20:00Z",
    answeredAt: "2025-11-18T15:30:00Z",
  },
  {
    id: 2,
    questionerName: "이궁금",
    questionerId: 2002,
    question: "리워드 색상 선택이 가능한가요?",
    answer: null,
    status: "PENDING",
    createdAt: "2025-11-21T09:15:00Z",
    answeredAt: null,
  },
];

// 한글 설명: Mock 프로젝트 상세 데이터
// 한글 설명: 프로젝트 ID에 따라 다른 상태의 mock 데이터 반환
export const getMockProjectDetail = (projectId?: string): MakerProjectDetailDTO => {
  // 한글 설명: 프로젝트 ID가 2이면 ENDED_SUCCESS, 7이면 ENDED_FAILED, 나머지는 LIVE
  const status = 
    projectId === "2" ? "ENDED_SUCCESS" as const :
    projectId === "7" ? "ENDED_FAILED" as const :
    "LIVE" as const;

  return {
    id: Number(projectId) || 1,
    thumbnailUrl: "https://placehold.co/800x600",
    title: status === "ENDED_SUCCESS" ? "친환경 텀블러 세트" :
           status === "ENDED_FAILED" ? "실패한 프로젝트 예시" :
           "스마트 LED 램프 프로젝트",
    summary: status === "ENDED_SUCCESS" ? "친환경 소재로 제작된 텀블러 세트" :
             status === "ENDED_FAILED" ? "목표 달성에 실패한 프로젝트" :
             "AI 기반 조명 제어가 가능한 스마트 LED 램프",
    category: status === "ENDED_SUCCESS" ? "라이프스타일" :
              status === "ENDED_FAILED" ? "테크" :
              "테크",
    status,
  goalAmount: status === "ENDED_SUCCESS" ? 20000000 : status === "ENDED_FAILED" ? 10000000 : 20000000,
  currentAmount: status === "ENDED_SUCCESS" ? 24000000 : status === "ENDED_FAILED" ? 4520000 : 15100000,
  progressPercent: status === "ENDED_SUCCESS" ? 120.0 : status === "ENDED_FAILED" ? 45.2 : 75.5,
  supporterCount: status === "ENDED_SUCCESS" ? 380 : status === "ENDED_FAILED" ? 68 : 245,
  daysLeft: status === "ENDED_SUCCESS" || status === "ENDED_FAILED" ? null : 12,
  startDate: status === "ENDED_SUCCESS" ? "2025-09-01" : status === "ENDED_FAILED" ? "2025-10-01" : "2025-11-01",
  endDate: status === "ENDED_SUCCESS" ? "2025-10-31" : status === "ENDED_FAILED" ? "2025-10-31" : "2025-12-03",
  stats: {
    todayViews: status === "ENDED_SUCCESS" ? 0 : status === "ENDED_FAILED" ? 0 : 125,
    totalViews: status === "ENDED_SUCCESS" ? 5200 : status === "ENDED_FAILED" ? 1800 : 3450,
    totalRaised: status === "ENDED_SUCCESS" ? 24000000 : status === "ENDED_FAILED" ? 4520000 : 15100000,
    goalAmount: status === "ENDED_SUCCESS" ? 20000000 : status === "ENDED_FAILED" ? 10000000 : 20000000,
    progressPercent: status === "ENDED_SUCCESS" ? 120.0 : status === "ENDED_FAILED" ? 45.2 : 75.5,
    supporterCount: status === "ENDED_SUCCESS" ? 380 : status === "ENDED_FAILED" ? 68 : 245,
    repeatSupporterRate: status === "ENDED_SUCCESS" ? 15.2 : status === "ENDED_FAILED" ? 8.5 : 12.5,
    averageSupportAmount: status === "ENDED_SUCCESS" ? 63158 : status === "ENDED_FAILED" ? 66471 : 61632,
    topReward: {
      id: 1,
      title: "얼리버드 패키지",
      count: status === "ENDED_SUCCESS" ? 250 : status === "ENDED_FAILED" ? 45 : 180,
    },
  },
  dailyStats: mockDailyStats,
  channelStats: mockChannelStats,
  rewardSalesStats: mockRewardSalesStats,
  rewards: [
    {
      id: 1,
      title: "얼리버드 패키지",
      price: 49000,
      salesCount: 180,
      limitQty: 200,
      available: true,
    },
    {
      id: 2,
      title: "스탠다드 패키지",
      price: 59000,
      salesCount: 120,
      limitQty: 300,
      available: true,
    },
    {
      id: 3,
      title: "프리미엄 패키지",
      price: 100000,
      salesCount: 35,
      limitQty: null,
      available: true,
    },
  ],
  recentOrders: mockOrders,
  notices: mockNotices,
  qnas: mockQnAs,
  settlement: {
    totalRaised: 15100000,
    platformFee: 755000,
    pgFee: 302000,
    otherFees: 0,
    finalAmount: 14043000,
    paymentConfirmedAt: "2025-12-05T00:00:00Z",
    settlementScheduledAt: "2025-12-10T00:00:00Z",
    bankName: "카카오뱅크",
    accountNumber: "3333-04-1234567",
    accountHolder: "홍길동",
  },
  createdAt: "2025-10-15T09:00:00Z",
  updatedAt: "2025-11-20T10:30:00Z",
  approvedAt: "2025-10-25T14:20:00Z",
  rejectedReason: null,
  };
};

// 한글 설명: 기존 mockProjectDetail 호환성을 위한 export (deprecated)
export const mockProjectDetail = getMockProjectDetail("1");

