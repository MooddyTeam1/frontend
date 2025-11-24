// 한글 설명: 프로젝트 정보 & 설정 섹션
import React from "react";
import { Link } from "react-router-dom";
import {
  requestScheduleChange,
  requestEarlyTermination,
} from "../../../../../features/maker/projectManagement/api/projectManagementService";
import type { MakerProjectDetailDTO } from "../../../../../features/maker/projectManagement/types";

type SettingsSectionProps = {
  project: MakerProjectDetailDTO;
  onRefresh: () => void;
};

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  project,
  onRefresh,
}) => {
  const [showScheduleChange, setShowScheduleChange] = React.useState(false);
  const [showEarlyTermination, setShowEarlyTermination] = React.useState(false);
  const [scheduleForm, setScheduleForm] = React.useState({
    startDate: project.startDate || "",
    endDate: project.endDate || "",
    reason: "",
  });
  const [terminationReason, setTerminationReason] = React.useState("");

  const handleScheduleChange = async () => {
    if (!scheduleForm.reason) {
      alert("변경 사유를 입력해주세요.");
      return;
    }
    try {
      await requestScheduleChange(project.id, scheduleForm);
      alert("일정 변경 요청이 접수되었습니다.");
      setShowScheduleChange(false);
      onRefresh();
    } catch (error) {
      console.error("일정 변경 요청 실패:", error);
      alert("일정 변경 요청에 실패했습니다.");
    }
  };

  const handleEarlyTermination = async () => {
    if (!terminationReason) {
      alert("중단 사유를 입력해주세요.");
      return;
    }
    if (
      !confirm(
        "프로젝트를 조기 종료하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }
    try {
      await requestEarlyTermination(project.id, terminationReason);
      alert("조기 종료 요청이 접수되었습니다.");
      setShowEarlyTermination(false);
      onRefresh();
    } catch (error) {
      console.error("조기 종료 요청 실패:", error);
      alert("조기 종료 요청에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 한글 설명: 기본 정보 */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          프로젝트 정보 & 설정
        </h2>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium text-neutral-500">
              기본 정보
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">카테고리</span>
                <span className="text-neutral-700">{project.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">생성일</span>
                <span className="text-neutral-700">
                  {new Date(project.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
              {project.approvedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">승인일</span>
                  <span className="text-neutral-700">
                    {new Date(project.approvedAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              )}
            </div>
            <Link
              to={`/creator/projects/new/${project.id}`}
              className="mt-3 inline-block rounded border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              기본 정보 수정
            </Link>
          </div>

          {/* 한글 설명: 일정 관련 */}
          <div>
            <p className="mb-2 text-xs font-medium text-neutral-500">일정</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">시작일</span>
                <span className="text-neutral-700">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString("ko-KR")
                    : "미설정"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">종료일</span>
                <span className="text-neutral-700">
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString("ko-KR")
                    : "미설정"}
                </span>
              </div>
            </div>
            {project.status === "SCHEDULED" && (
              <button
                type="button"
                onClick={() => setShowScheduleChange(true)}
                className="mt-3 rounded border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                일정 변경 요청
              </button>
            )}
          </div>

          {/* 한글 설명: 정책 관련 */}
          {project.rejectedReason && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="mb-2 text-xs font-semibold text-red-900">
                반려 사유
              </p>
              <p className="text-xs text-red-700">{project.rejectedReason}</p>
            </div>
          )}
        </div>
      </div>

      {/* 한글 설명: 일정 변경 모달 */}
      {showScheduleChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900">
              일정 변경 요청
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  시작일
                </label>
                <input
                  type="date"
                  value={scheduleForm.startDate}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full rounded border border-neutral-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  종료일
                </label>
                <input
                  type="date"
                  value={scheduleForm.endDate}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-full rounded border border-neutral-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  변경 사유
                </label>
                <textarea
                  value={scheduleForm.reason}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded border border-neutral-200 bg-white px-3 py-2 text-sm"
                  placeholder="일정 변경 사유를 입력해주세요"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={handleScheduleChange}
                className="flex-1 rounded border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800"
              >
                요청하기
              </button>
              <button
                type="button"
                onClick={() => setShowScheduleChange(false)}
                className="flex-1 rounded border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 한글 설명: 조기 종료 모달 */}
      {showEarlyTermination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900">
              조기 종료 요청
            </h3>
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              ⚠️ 프로젝트를 조기 종료하면 되돌릴 수 없습니다. 신중히 결정해주세요.
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-500">
                중단 사유
              </label>
              <textarea
                value={terminationReason}
                onChange={(e) => setTerminationReason(e.target.value)}
                rows={4}
                className="w-full rounded border border-neutral-200 bg-white px-3 py-2 text-sm"
                placeholder="프로젝트 중단 사유를 입력해주세요"
              />
            </div>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={handleEarlyTermination}
                className="flex-1 rounded border border-red-600 bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
              >
                조기 종료 요청
              </button>
              <button
                type="button"
                onClick={() => setShowEarlyTermination(false)}
                className="flex-1 rounded border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

