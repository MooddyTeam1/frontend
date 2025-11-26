import type { ProjectDraft } from "../../features/creator/stores/projectStore";

// 한글 설명: 메이커 프로젝트 상태별 메타 정보 정의 (카드 제목/설명/링크)
export const stageMeta: Array<{
  status: ProjectDraft["status"];
  title: string;
  description: string;
  link: string;
}> = [
  {
    status: "DRAFT",
    title: "작성 중",
    description: "아직 제출하지 않은 초안 프로젝트",
    link: "/profile/maker/projects/draft",
  },
  {
    status: "REVIEW",
    title: "심사 중",
    description: "승인 대기 중인 프로젝트",
    link: "/profile/maker/projects/review",
  },
  {
    status: "APPROVED",
    title: "승인됨",
    description: "검토를 통과해 공개를 준비 중입니다.",
    link: "/profile/maker/projects/approved",
  },
  {
    status: "SCHEDULED",
    title: "공개 예정",
    description: "LIVE 예정일을 기다리고 있는 프로젝트",
    link: "/profile/maker/projects/scheduled",
  },
  {
    status: "LIVE",
    title: "진행 중",
    description: "현재 후원받고 있는 프로젝트",
    link: "/profile/maker/projects/live",
  },
  {
    status: "ENDED",
    title: "종료",
    description: "마감된 프로젝트 및 정산을 확인하세요.",
    link: "/profile/maker/projects/ended",
  },
  {
    status: "REJECTED",
    title: "반려됨",
    description: "수정 후 다시 제출이 필요한 프로젝트",
    link: "/profile/maker/projects/rejected",
  },
];

// 한글 설명: 프로젝트 상태 코드와 한글 라벨 매핑
export const statusLabel: Record<ProjectDraft["status"], string> = {
  DRAFT: "작성 중",
  REVIEW: "심사 중",
  APPROVED: "승인됨",
  SCHEDULED: "공개 예정",
  LIVE: "진행 중",
  ENDED: "종료",
  REJECTED: "반려됨",
};

