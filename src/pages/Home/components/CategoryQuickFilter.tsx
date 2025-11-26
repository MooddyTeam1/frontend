// 한글 설명: 카테고리 퀵 필터 컴포넌트
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CATEGORY_OPTIONS } from "../../../shared/components/CategoryGridPicker";

export const CategoryQuickFilter: React.FC = () => {
  const location = useLocation();
  const currentCategory =
    new URLSearchParams(location.search).get("category") || "all";

  return (
    <section className="border-b border-neutral-200 bg-white py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((category) => {
            const isActive = currentCategory === category.key;
            return (
              <Link
                key={category.key}
                to={`/projects${category.key === "all" ? "" : `?category=${category.key}`}`}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "border-neutral-900 bg-neutral-900 !text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                }`}
              >
                {category.icon} {category.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

