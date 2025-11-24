// 한글 설명: 프로젝트 상세 관리 페이지
import React from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Container } from "../../../../shared/components/Container";
import { getMakerProjectDetail } from "../../../../features/maker/projectManagement/api/projectManagementService";
import type { MakerProjectDetailDTO } from "../../../../features/maker/projectManagement/types";
import { getMockProjectDetail } from "../../../../features/maker/projectManagement/mockData";

// 한글 설명: Mock API 사용 여부 (개발 중 확인용)
const USE_MOCK_DATA = true;
import { ProjectHeader } from "./components/ProjectHeader";
import { StatsSection } from "./components/StatsSection";
import { RewardsSection } from "./components/RewardsSection";
import { OrdersSection } from "./components/OrdersSection";
import { CommunicationSection } from "./components/CommunicationSection";
import { SettlementSection } from "./components/SettlementSection";
import { SettingsSection } from "./components/SettingsSection";
import { MarketingSection } from "./components/MarketingSection";
import { ShipmentConsole } from "./components/ShipmentConsole";

export const MakerProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [project, setProject] = React.useState<MakerProjectDetailDTO | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);

  // 한글 설명: URL 파라미터에서 탭 정보 읽기 (기본값: overview)
  const tabFromUrl = searchParams.get("tab") as
    | "overview"
    | "rewards"
    | "settlement"
    | "shipment"
    | null;
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "rewards" | "settlement" | "shipment"
  >(tabFromUrl || "overview");

  // 한글 설명: 탭 변경 시 URL 파라미터 업데이트
  const handleTabChange = (
    tab: "overview" | "rewards" | "settlement" | "shipment"
  ) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // 한글 설명: 프로젝트 로드 후 URL 파라미터의 탭이 유효한지 확인하고 적용
  React.useEffect(() => {
    if (!project) return;

    const tabFromUrl = searchParams.get("tab") as
      | "overview"
      | "rewards"
      | "settlement"
      | "shipment"
      | null;

    if (tabFromUrl) {
      // 한글 설명: 배송 관리 탭은 달성 종료된 프로젝트에만 유효
      if (
        tabFromUrl === "shipment" &&
        project.status !== "ENDED_SUCCESS" &&
        project.status !== "ENDED_FAILED"
      ) {
        // 한글 설명: 배송 관리 탭이 유효하지 않으면 개요 탭으로 리다이렉트
        setActiveTab("overview");
        setSearchParams({});
      } else {
        setActiveTab(tabFromUrl);
      }
    }
  }, [project, searchParams, setSearchParams]);

  const fetchProject = React.useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      if (USE_MOCK_DATA) {
        // 한글 설명: Mock 데이터 사용 (프로젝트 ID에 따라 다른 상태 반환)
        await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const mockData = getMockProjectDetail(projectId);
        console.log("[MakerProjectDetailPage] Mock 프로젝트 데이터:", mockData);
        setProject(mockData);
      } else {
        // 한글 설명: 실제 API 호출
        const data = await getMakerProjectDetail(Number(projectId));
        setProject(data);
      }
    } catch (error) {
      console.error("프로젝트 상세 조회 실패:", error);
      console.error("에러 상세:", error);
      alert(
        `프로젝트 정보를 불러오는데 실패했습니다: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  React.useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) {
    return (
      <div className="bg-neutral-50 pb-16 pt-10">
        <Container>
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-neutral-500">로딩 중...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-neutral-50 pb-16 pt-10">
        <Container>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-20">
            <p className="text-sm text-neutral-500">
              프로젝트를 찾을 수 없습니다.
            </p>
            <Link
              to="/maker/projects"
              className="mt-4 rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 pb-16 pt-10">
      <Container>
        <div className="space-y-8">
          {/* 한글 설명: 뒤로가기 */}
          <Link
            to="/maker/projects"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            프로젝트 목록으로
          </Link>

          {/* 한글 설명: 헤더 */}
          <ProjectHeader project={project} />

          {/* 한글 설명: 탭 네비게이션 */}
          <div className="flex gap-2 border-b border-neutral-200">
            <button
              onClick={() => handleTabChange("overview")}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              개요
            </button>
            <button
              onClick={() => handleTabChange("rewards")}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "rewards"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              리워드
            </button>
            <button
              onClick={() => handleTabChange("settlement")}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "settlement"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              정산
            </button>
            {/* 한글 설명: 달성 종료된 프로젝트에만 배송 관리 탭 표시 */}
            {(project.status === "ENDED_SUCCESS" ||
              project.status === "ENDED_FAILED") && (
              <button
                onClick={() => handleTabChange("shipment")}
                className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "shipment"
                    ? "border-neutral-900 text-neutral-900"
                    : "border-transparent text-neutral-500 hover:text-neutral-900"
                }`}
              >
                배송 관리
              </button>
            )}
          </div>

          {/* 한글 설명: 탭 컨텐츠 */}
          {activeTab === "overview" && (
            <>
              {/* 한글 설명: 통계 & 분석 */}
              <StatsSection project={project} />

              {/* 한글 설명: 주문/서포터 관리 */}
              <OrdersSection projectId={project.id} />

              {/* 한글 설명: 커뮤니케이션 */}
              <CommunicationSection
                projectId={project.id}
                notices={project.notices}
                qnas={project.qnas}
                onRefresh={fetchProject}
              />

              {/* 한글 설명: 프로젝트 정보 & 설정 */}
              <SettingsSection project={project} onRefresh={fetchProject} />

              {/* 한글 설명: 마케팅/홍보 도구 */}
              <MarketingSection project={project} />
            </>
          )}

          {activeTab === "rewards" && (
            <>
              {/* 한글 설명: 리워드 관리 */}
              <RewardsSection project={project} />
            </>
          )}

          {activeTab === "settlement" && (
            <>
              {/* 한글 설명: 정산 정보 */}
              <SettlementSection settlement={project.settlement} />
            </>
          )}

          {activeTab === "shipment" &&
            (project.status === "ENDED_SUCCESS" ||
              project.status === "ENDED_FAILED") && (
              <>
                {/* 한글 설명: 배송 관리 콘솔 */}
                <ShipmentConsole
                  projectId={project.id}
                  rewards={project.rewards.map((r) => ({
                    id: r.id,
                    title: r.title,
                  }))}
                />
              </>
            )}
        </div>
      </Container>
    </div>
  );
};
