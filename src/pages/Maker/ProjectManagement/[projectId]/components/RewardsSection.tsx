// 한글 설명: 리워드 관리 섹션
import React from "react";
import { Link } from "react-router-dom";
import type { MakerProjectDetailDTO } from "../../../../../features/maker/projectManagement/types";
import { currencyKRW } from "../../../../../shared/utils/format";

type RewardsSectionProps = {
  project: MakerProjectDetailDTO;
};

export const RewardsSection: React.FC<RewardsSectionProps> = ({ project }) => {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">리워드 관리</h2>
        <Link
          to={`/creator/rewards?projectId=${project.id}`}
          className="rounded border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
        >
          리워드 수정
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="px-3 py-2 text-left text-neutral-500">리워드</th>
              <th className="px-3 py-2 text-right text-neutral-500">가격</th>
              <th className="px-3 py-2 text-right text-neutral-500">판매 수량</th>
              <th className="px-3 py-2 text-right text-neutral-500">재고/한정</th>
              <th className="px-3 py-2 text-center text-neutral-500">상태</th>
              <th className="px-3 py-2 text-center text-neutral-500">액션</th>
            </tr>
          </thead>
          <tbody>
            {project.rewards.map((reward) => (
              <tr key={reward.id} className="border-b border-neutral-100">
                <td className="px-3 py-3">
                  <div className="font-medium text-neutral-900">
                    {reward.title}
                  </div>
                </td>
                <td className="px-3 py-3 text-right text-neutral-700">
                  {currencyKRW(reward.price)}
                </td>
                <td className="px-3 py-3 text-right text-neutral-700">
                  {reward.salesCount.toLocaleString()}개
                </td>
                <td className="px-3 py-3 text-right text-neutral-500">
                  {reward.limitQty
                    ? `${reward.limitQty.toLocaleString()}개 한정`
                    : "무제한"}
                </td>
                <td className="px-3 py-3 text-center">
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                      reward.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {reward.available ? "판매중" : "판매중지"}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

