// 한글 설명: 배송 일정 관리 섹션 컴포넌트
import React, { useState } from "react";
import {
  updateShipmentSchedule,
  fetchShipmentSummary,
} from "../../../../../features/maker/projectManagement/api/shipmentService";
import type { ShipmentSummaryDTO } from "../../../../../features/maker/projectManagement/types/shipment";

type ShipmentScheduleSectionProps = {
  projectId: number;
  summary: ShipmentSummaryDTO | null;
  onUpdate: () => void;
};

export const ShipmentScheduleSection: React.FC<ShipmentScheduleSectionProps> = ({
  projectId,
  summary,
  onUpdate,
}) => {
  const [editing, setEditing] = useState(false);
  const [scheduledStartDate, setScheduledStartDate] = useState(
    summary?.scheduledStartDate || ""
  );
  const [targetEndDate, setTargetEndDate] = useState(
    summary?.targetEndDate || ""
  );
  const [saving, setSaving] = useState(false);

  // 한글 설명: 일정 저장
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateShipmentSchedule(projectId, {
        scheduledStartDate: scheduledStartDate || null,
        targetEndDate: targetEndDate || null,
      });
      setEditing(false);
      onUpdate();
      alert("배송 일정이 업데이트되었습니다.");
    } catch (error) {
      console.error("배송 일정 업데이트 실패", error);
      alert("배송 일정 업데이트에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 한글 설명: 취소
  const handleCancel = () => {
    setScheduledStartDate(summary?.scheduledStartDate || "");
    setTargetEndDate(summary?.targetEndDate || "");
    setEditing(false);
  };

  // 한글 설명: 날짜 포맷팅
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">배송 일정 관리</h3>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
          >
            일정 수정
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-700 mb-2 block">
              배송 시작 예정일
            </label>
            <input
              type="date"
              value={scheduledStartDate}
              onChange={(e) => setScheduledStartDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-neutral-500">
              배송을 시작할 예정인 날짜를 설정하세요.
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-700 mb-2 block">
              배송 마감 목표일
            </label>
            <input
              type="date"
              value={targetEndDate}
              onChange={(e) => setTargetEndDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-neutral-500">
              모든 배송을 완료할 목표 날짜를 설정하세요.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400 disabled:opacity-50"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-neutral-500">배송 시작 예정일</span>
            <span className="text-sm font-medium text-neutral-900">
              {formatDate(summary?.scheduledStartDate)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-neutral-100">
            <span className="text-sm text-neutral-500">배송 마감 목표일</span>
            <span className="text-sm font-medium text-neutral-900">
              {formatDate(summary?.targetEndDate)}
            </span>
          </div>
          {summary?.scheduledStartDate && summary?.targetEndDate && (
            <div className="mt-4 rounded-xl bg-blue-50 p-3">
              <p className="text-xs text-blue-700">
                {(() => {
                  const start = new Date(summary.scheduledStartDate);
                  const end = new Date(summary.targetEndDate);
                  const today = new Date();
                  const daysUntilStart = Math.ceil(
                    (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const daysUntilEnd = Math.ceil(
                    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                  );

                  if (daysUntilStart > 0) {
                    return `배송 시작까지 ${daysUntilStart}일 남았습니다.`;
                  } else if (daysUntilEnd > 0) {
                    return `배송 마감까지 ${daysUntilEnd}일 남았습니다.`;
                  } else {
                    return "배송 마감 목표일이 지났습니다.";
                  }
                })()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

