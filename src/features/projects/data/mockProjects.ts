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
  coverGallery?: string[]; // 이미지 갤러리 배열
  goalAmount: number;
  raised: number;
  backerCount: number;
  state: "DRAFT" | "REVIEW" | "LIVE" | "ENDED" | "REJECTED";
  endDate: string;
  storyMarkdown: string;
  rewards: Reward[];
};

export const mockProjects: Project[] = [];

/*
export const mockProjects: Project[] = [
  // ... 이전에 사용하던 mock 프로젝트 데이터 ...
];
*/
