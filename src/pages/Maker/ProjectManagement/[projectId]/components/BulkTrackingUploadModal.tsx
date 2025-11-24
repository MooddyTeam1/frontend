// 한글 설명: 송장 일괄 업로드 모달 컴포넌트
import React, { useState, useRef } from "react";
import { bulkUploadTracking, exportShipments } from "../../../../../features/maker/projectManagement/api/shipmentService";
import type { BulkTrackingUploadRequestDTO } from "../../../../../features/maker/projectManagement/types/shipment";

type BulkTrackingUploadModalProps = {
  projectId: number;
  onClose: () => void;
  onSuccess: () => void;
};

export const BulkTrackingUploadModal: React.FC<BulkTrackingUploadModalProps> = ({
  projectId,
  onClose,
  onSuccess,
}) => {
  const [uploading, setUploading] = useState(false);
  const [manualEntries, setManualEntries] = useState<
    Array<{ orderCode: string; courierName: string; trackingNumber: string }>
  >([{ orderCode: "", courierName: "", trackingNumber: "" }]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 한글 설명: 템플릿 다운로드
  const handleDownloadTemplate = async () => {
    try {
      const blob = await exportShipments(projectId, {}, "xlsx");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `송장업로드_템플릿_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("템플릿 다운로드 실패", error);
      alert("템플릿 다운로드에 실패했습니다.");
    }
  };

  // 한글 설명: 엑셀 파일 업로드
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 한글 설명: 엑셀 파일 파싱 (실제로는 xlsx 라이브러리 사용 필요)
    // 여기서는 간단한 CSV 파싱 예시만 제공
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const shipments: BulkTrackingUploadRequestDTO["shipments"] = [];

        // 한글 설명: 첫 줄은 헤더로 간주
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const [orderCode, courierName, trackingNumber] = line.split(",");
          if (orderCode && courierName && trackingNumber) {
            shipments.push({
              orderCode: orderCode.trim(),
              courierName: courierName.trim(),
              trackingNumber: trackingNumber.trim(),
            });
          }
        }

        if (shipments.length === 0) {
          alert("유효한 송장 정보가 없습니다.");
          return;
        }

        setUploading(true);
        const result = await bulkUploadTracking(projectId, { shipments });
        alert(
          `송장 업로드 완료:\n성공: ${result.successCount}건\n실패: ${result.failureCount}건${
            result.failures.length > 0
              ? `\n\n실패 내역:\n${result.failures
                  .map((f) => `- ${f.orderCode}: ${f.reason}`)
                  .join("\n")}`
              : ""
          }`
        );
        onSuccess();
      } catch (error) {
        console.error("송장 업로드 실패", error);
        alert("송장 업로드에 실패했습니다.");
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  // 한글 설명: 수동 입력 추가
  const addManualEntry = () => {
    setManualEntries([
      ...manualEntries,
      { orderCode: "", courierName: "", trackingNumber: "" },
    ]);
  };

  // 한글 설명: 수동 입력 삭제
  const removeManualEntry = (index: number) => {
    setManualEntries(manualEntries.filter((_, i) => i !== index));
  };

  // 한글 설명: 수동 입력 업로드
  const handleManualUpload = async () => {
    const shipments = manualEntries.filter(
      (entry) => entry.orderCode && entry.courierName && entry.trackingNumber
    );

    if (shipments.length === 0) {
      alert("송장 정보를 입력해주세요.");
      return;
    }

    try {
      setUploading(true);
      const result = await bulkUploadTracking(projectId, { shipments });
      alert(
        `송장 업로드 완료:\n성공: ${result.successCount}건\n실패: ${result.failureCount}건${
          result.failures.length > 0
            ? `\n\n실패 내역:\n${result.failures
                .map((f) => `- ${f.orderCode}: ${f.reason}`)
                .join("\n")}`
            : ""
        }`
      );
      onSuccess();
    } catch (error) {
      console.error("송장 업로드 실패", error);
      alert("송장 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* 한글 설명: 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              송장 일괄 업로드
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* 한글 설명: 엑셀 업로드 */}
            <section className="rounded-2xl border border-neutral-200 p-4">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                엑셀 파일 업로드
              </h3>
              <p className="text-xs text-neutral-500 mb-3">
                엑셀 파일 형식: orderCode, courierName, trackingNumber (CSV 또는
                XLSX)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-400"
                >
                  템플릿 다운로드
                </button>
                <label className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-400 cursor-pointer">
                  파일 선택
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </section>

            {/* 한글 설명: 수동 입력 */}
            <section className="rounded-2xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-900">
                  수동 입력
                </h3>
                <button
                  type="button"
                  onClick={addManualEntry}
                  className="rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-neutral-400"
                >
                  + 추가
                </button>
              </div>
              <div className="space-y-3">
                {manualEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={entry.orderCode}
                      onChange={(e) => {
                        const newEntries = [...manualEntries];
                        newEntries[index].orderCode = e.target.value;
                        setManualEntries(newEntries);
                      }}
                      placeholder="주문번호"
                      className="col-span-4 rounded-xl border border-neutral-200 px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      value={entry.courierName}
                      onChange={(e) => {
                        const newEntries = [...manualEntries];
                        newEntries[index].courierName = e.target.value;
                        setManualEntries(newEntries);
                      }}
                      placeholder="택배사"
                      className="col-span-3 rounded-xl border border-neutral-200 px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      value={entry.trackingNumber}
                      onChange={(e) => {
                        const newEntries = [...manualEntries];
                        newEntries[index].trackingNumber = e.target.value;
                        setManualEntries(newEntries);
                      }}
                      placeholder="송장번호"
                      className="col-span-4 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-mono"
                    />
                    {manualEntries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeManualEntry(index)}
                        className="col-span-1 rounded-xl border border-red-200 px-2 py-2 text-xs text-red-600 hover:bg-red-50"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleManualUpload}
                disabled={uploading}
                className="mt-4 w-full rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                {uploading ? "업로드 중..." : "송장 업로드"}
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

