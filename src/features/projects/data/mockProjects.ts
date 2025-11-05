export type Reward = {
  id: string;
  title: string;
  price: number;
  description?: string;
  limitQty?: number;
  soldQty: number;
  available: boolean;
  estShippingMonth?: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  coverImageUrl?: string;
  goalAmount: number;
  raised: number;
  backerCount: number;
  state: "DRAFT" | "REVIEW" | "LIVE" | "ENDED" | "REJECTED";
  endDate: string;
  storyMarkdown: string;
  rewards: Reward[];
};

export const mockProjects: Project[] = [
  {
    id: "p1",
    slug: "smart-led-lamp",
    title: "Smart LED Lamp",
    summary: "스마트 조명, 무드와 타이머, 앱 연동",
    category: "디자인",
    coverImageUrl:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
    goalAmount: 10_000_000,
    raised: 7_800_000,
    backerCount: 412,
    state: "LIVE",
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
    storyMarkdown:
      "## 스토리\n스마트 조명으로 라이프스타일을 바꿔보세요.\n\n- 앱 연동\n- 수면 모드\n- 자동 밝기 조절",
    rewards: [
      {
        id: "r1",
        title: "얼리버드",
        price: 49_000,
        description: "본체 1개 + 무료배송",
        limitQty: 200,
        soldQty: 180,
        available: true,
        estShippingMonth: "2026-03",
      },
      {
        id: "r2",
        title: "스탠다드",
        price: 59_000,
        description: "본체 1개",
        limitQty: 1000,
        soldQty: 220,
        available: true,
        estShippingMonth: "2026-04",
      },
      {
        id: "r3",
        title: "듀오 패키지",
        price: 109_000,
        description: "본체 2개",
        limitQty: 300,
        soldQty: 300,
        available: false,
        estShippingMonth: "2026-04",
      },
    ],
  },
  {
    id: "p2",
    slug: "compact-coffee-kit",
    title: "Compact Coffee Kit",
    summary: "캠핑/여행용 초소형 커피 세트",
    category: "푸드",
    coverImageUrl:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop",
    goalAmount: 3_000_000,
    raised: 1_200_000,
    backerCount: 88,
    state: "LIVE",
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 13).toISOString(),
    storyMarkdown:
      "## 작고 가볍게\n어디서나 드립 커피를 즐기세요.\n\n- 알루미늄 바디\n- 마이크로 그라인더",
    rewards: [
      {
        id: "r1",
        title: "키트 기본",
        price: 39_000,
        description: "핸드드립 키트",
        limitQty: 500,
        soldQty: 120,
        available: true,
        estShippingMonth: "2026-02",
      },
    ],
  },
  {
    id: "p3",
    slug: "pet-ai-tracker",
    title: "Pet AI Tracker",
    summary: "반려동물 활동 AI 분석 & 분리불안 알림",
    category: "테크",
    coverImageUrl:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop",
    goalAmount: 20_000_000,
    raised: 21_000_000,
    backerCount: 1088,
    state: "ENDED",
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    storyMarkdown:
      "## AI로 우리집 댕댕이 안심\n라이브 활동 분석 & 긴급 알림",
    rewards: [],
  },
];
