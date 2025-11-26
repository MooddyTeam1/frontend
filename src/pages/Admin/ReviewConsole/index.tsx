// 한글 설명: Admin용 심사 콘솔 페이지. 프로젝트 심사 대기 목록과 상세 심사를 한 화면에서 처리
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAdminReviewProjects,
  fetchAdminProjectDetail,
  approveAdminProject,
  rejectAdminProject,
  fetchAdminRejectReasonPresets,
} from "../../../features/admin/api/adminProjectsService";
import type {
  AdminProjectReviewDTO,
  AdminProjectDetailDTO,
} from "../../../features/admin/types";
import { ReviewList } from "./components/ReviewList";
import { ReviewDetail } from "./components/ReviewDetail";
import { ConfirmDialog } from "./components/ConfirmDialog";

// 한글 설명: 반려 사유 프리셋 기본값 (API 호출 실패 시 사용)
const DEFAULT_REJECT_PRESETS = [
  "근거 자료 부족(증빙/계약서/허가서)",
  "리워드/배송/환불 정책 미흡",
  "금지 콘텐츠/정책 위반 가능성",
  "상표권/저작권/초상권 우려",
  "메이커 신원/연락처 불명확",
  "위험물/규제 품목 포함 우려",
  "광고성/과장 표현 과다",
] as const;

// 한글 설명: 체크리스트 항목 (UI와 저장 구조의 단일 소스)
const CHECK_ITEMS = [
  "사업자/연락처 확인",
  "스토리 가이드 준수",
  "리워드 배송/교환/환불 고지",
  "금지 콘텐츠/정책 위반 여부",
] as const;

// 한글 설명: 프로젝트 ID 추출 헬퍼
const getProjectId = (project: AdminProjectReviewDTO): string => {
  return project.id ?? project.projectId ?? project.project ?? "";
};

// 한글 설명: 심사 콘솔 메인 컴포넌트
export const ReviewConsolePage: React.FC = () => {
  const navigate = useNavigate();

  // 한글 설명: 프로젝트 목록 상태
  const [projects, setProjects] = useState<AdminProjectReviewDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 필터 및 검색 상태
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<
    "REVIEW" | "APPROVED" | "REJECTED" | "ALL"
  >("REVIEW");

  // 한글 설명: 선택된 프로젝트 및 상세 정보
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] =
    useState<AdminProjectReviewDTO | null>(null);
  const [detail, setDetail] = useState<AdminProjectDetailDTO | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 한글 설명: 반려 사유/프리셋/체크리스트 저장 토글 상태
  const [reasonPreset, setReasonPreset] = useState<string>("");
  const [reasonText, setReasonText] = useState<string>("");
  const [saveChecklist, setSaveChecklist] = useState<boolean>(true);
  const [checks, setChecks] = useState<boolean[]>(
    Array.from({ length: CHECK_ITEMS.length }, () => false)
  );
  const [isProcessing, setIsProcessing] = useState(false);
  // 한글 설명: 반려 사유 프리셋 목록 (API에서 조회)
  const [rejectPresets, setRejectPresets] = useState<string[]>(
    Array.from(DEFAULT_REJECT_PRESETS)
  );

  // 한글 설명: 확인 다이얼로그 상태
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "approve" | "reject" | null;
  }>({ open: false, type: null });

  // 한글 설명: 프로젝트 목록 조회
  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminReviewProjects();
      setProjects(data);
      // 한글 설명: 첫 번째 프로젝트를 기본 선택
      if (data.length > 0 && !selectedId) {
        const firstProject = data[0];
        const firstId = getProjectId(firstProject);
        setSelectedId(firstId);
        setSelectedProject(firstProject);
      }
    } catch (fetchError) {
      console.error("프로젝트 목록 조회 실패:", fetchError);
      setError("프로젝트 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 한글 설명: 프로젝트 상세 조회
  const loadDetail = async (projectId: string) => {
    setDetailLoading(true);
    try {
      const data = await fetchAdminProjectDetail(projectId);
      setDetail(data);
    } catch (fetchError) {
      console.error("프로젝트 상세 조회 실패:", fetchError);
      setError("프로젝트 상세 정보를 불러오지 못했습니다.");
    } finally {
      setDetailLoading(false);
    }
  };

  // 한글 설명: 프로젝트 선택 핸들러
  const handleSelectProject = (project: AdminProjectReviewDTO) => {
    const projectId = getProjectId(project);
    setSelectedId(projectId);
    setSelectedProject(project);
    loadDetail(projectId);
    // 한글 설명: 선택 시 상태 초기화
    setReasonText("");
    setChecks(Array.from({ length: CHECK_ITEMS.length }, () => false));
  };

  // 한글 설명: 필터링된 프로젝트 목록
  const filteredList = useMemo(() => {
    const pool =
      filter === "ALL"
        ? projects
        : projects.filter((p) => {
            const reviewStatus =
              p.reviewStatus ?? (p as any).projectReviewStatus ?? "REVIEW";
            return reviewStatus === filter;
          });

    return pool.filter((p) =>
      q
        ? (
            p.title +
            (p.makerName ?? p.maker) +
            getProjectId(p)
          ).toLowerCase().includes(q.toLowerCase())
        : true
    );
  }, [q, filter, projects]);

  // 한글 설명: 승인 처리
  const handleApprove = async () => {
    if (!selectedId) return;

    setIsProcessing(true);
    try {
      await approveAdminProject(selectedId);
      // 한글 설명: 목록 새로고침
      await loadProjects();
      // 한글 설명: 승인된 프로젝트는 목록에서 제거되므로 다른 항목 선택
      const remaining = projects.filter(
        (p) => getProjectId(p) !== selectedId
      );
      if (remaining.length > 0) {
        handleSelectProject(remaining[0]);
      } else {
        setSelectedId(null);
        setSelectedProject(null);
        setDetail(null);
      }
      setReasonText("");
      setChecks(Array.from({ length: CHECK_ITEMS.length }, () => false));
    } catch (approveError) {
      alert("승인 처리 중 오류가 발생했습니다.");
      console.error(approveError);
    } finally {
      setIsProcessing(false);
    }
  };

  // 한글 설명: 반려 처리
  const handleReject = async () => {
    if (!selectedId) return;
    if (!reasonText.trim()) {
      alert("반려 사유를 입력해주세요.");
      return;
    }

    setIsProcessing(true);
    try {
      await rejectAdminProject(selectedId, reasonText.trim());
      // 한글 설명: 목록 새로고침
      await loadProjects();
      // 한글 설명: 반려된 프로젝트는 목록에서 제거되므로 다른 항목 선택
      const remaining = projects.filter(
        (p) => getProjectId(p) !== selectedId
      );
      if (remaining.length > 0) {
        handleSelectProject(remaining[0]);
      } else {
        setSelectedId(null);
        setSelectedProject(null);
        setDetail(null);
      }
      setReasonText("");
      setChecks(Array.from({ length: CHECK_ITEMS.length }, () => false));
    } catch (rejectError) {
      alert("반려 처리 중 오류가 발생했습니다.");
      console.error(rejectError);
    } finally {
      setIsProcessing(false);
    }
  };

  // 한글 설명: 반려 사유 프리셋 조회
  const loadRejectPresets = async () => {
    try {
      const response = await fetchAdminRejectReasonPresets();
      setRejectPresets(response.presets);
    } catch (error) {
      console.error("반려 사유 프리셋 조회 실패:", error);
      // 한글 설명: API 호출 실패 시 기본값 사용
      setRejectPresets(Array.from(DEFAULT_REJECT_PRESETS));
    }
  };

  // 한글 설명: 초기 로드
  useEffect(() => {
    loadProjects();
    loadRejectPresets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 한글 설명: 선택된 프로젝트가 목록에서 제거되면 첫 번째 항목 선택
  useEffect(() => {
    if (selectedId && !filteredList.find((p) => getProjectId(p) === selectedId)) {
      if (filteredList.length > 0) {
        handleSelectProject(filteredList[0]);
      } else {
        setSelectedId(null);
        setSelectedProject(null);
        setDetail(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredList, selectedId]);

  // 한글 설명: 프리셋 선택 핸들러
  const handlePresetChange = (preset: string) => {
    setReasonPreset(preset);
    setReasonText(preset);
  };

  // 한글 설명: 체크리스트 토글 핸들러
  const handleToggleCheck = (idx: number) => {
    setChecks((prev) => prev.map((b, i) => (i === idx ? !b : b)));
  };

  // 한글 설명: 확인 다이얼로그 핸들러
  const handleConfirmAction = () => {
    if (confirmDialog.type === "approve") {
      handleApprove();
    } else if (confirmDialog.type === "reject") {
      handleReject();
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto min-h-[80vh] max-w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* 상단 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              MOA Admin 심사 콘솔
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              프로젝트 심사 대기 목록과 상세 심사를 한 화면에서 처리합니다
            </p>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
          >
            대시보드로
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-12 gap-4">
          {/* 좌측: 목록 */}
          <ReviewList
            projects={filteredList}
            selectedId={selectedId}
            onSelect={handleSelectProject}
            searchQuery={q}
            onSearchChange={setQ}
            filter={filter}
            onFilterChange={setFilter}
            onRefresh={loadProjects}
            loading={loading}
          />

          {/* 우측: 상세 */}
          <ReviewDetail
            detail={detail}
            selectedProject={
              selectedProject
                ? {
                    id: getProjectId(selectedProject),
                    title: selectedProject.title,
                    makerName:
                      selectedProject.makerName ?? selectedProject.maker,
                    requestAt:
                      selectedProject.submittedAt ?? selectedProject.requestAt,
                  }
                : null
            }
            checks={checks}
            onToggleCheck={handleToggleCheck}
            saveChecklist={saveChecklist}
            onSaveChecklistChange={setSaveChecklist}
            reasonPreset={reasonPreset}
            onPresetChange={handlePresetChange}
            reasonText={reasonText}
            onReasonTextChange={setReasonText}
            onScrollToAction={() => {}}
            onRejectClick={() =>
              setConfirmDialog({ open: true, type: "reject" })
            }
            onApproveClick={() =>
              setConfirmDialog({ open: true, type: "approve" })
            }
            isProcessing={isProcessing}
            rejectPresets={rejectPresets}
          />
        </div>

        {/* 확인 다이얼로그 */}
        <ConfirmDialog
          open={confirmDialog.open}
          type={confirmDialog.type}
          onOpenChange={(open) =>
            setConfirmDialog((prev) => ({ ...prev, open }))
          }
          onConfirm={handleConfirmAction}
        />
      </div>
    </div>
  );
};
