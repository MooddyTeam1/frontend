import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { PublicProjectCard } from "../../features/projects/components/PublicProjectCard";
import { useQuery } from "../../shared/hooks/useQuery";
import type { ProjectListResponseDTO } from "../../features/projects/types";
import {
  CategoryGridPicker,
  CATEGORY_OPTIONS,
  type CategoryKey,
} from "../../shared/components/CategoryGridPicker";
import {
  fetchProjectsByCategory,
  searchProjects,
} from "../../features/projects/api/projectService";
import { ProjectSearchBar } from "../../shared/components/search/ProjectSearchBar";
import type { ProjectCategory } from "../../features/projects/types";
import {
  toCategoryEnum,
  type CategoryLabel,
} from "../../shared/utils/categoryMapper";

type SortKey =
  | "popular"
  | "new"
  | "ending_soon"
  | "amount"
  | "progress"
  | "backers";

const sortOptions: Array<{ key: SortKey; label: string }> = [
  { key: "popular", label: "인기순" },
  { key: "new", label: "최신순" },
  { key: "ending_soon", label: "마감임박순" },
  { key: "amount", label: "모금액순" },
  { key: "progress", label: "달성률순" },
  { key: "backers", label: "후원자순" },
];

export const ProjectsPage: React.FC = () => {
  const location = useLocation();
  const q = useQuery();
  const navigate = useNavigate();
  const searchQuery = (q.get("search") || "").toLowerCase();
  const sort = (q.get("sort") as SortKey) || "popular";
  const categoryQuery = (q.get("category") || "all") as CategoryKey;

  const [categoryPickerOpen, setCategoryPickerOpen] = React.useState(false);
  const [categoryProjects, setCategoryProjects] = React.useState<
    ProjectListResponseDTO[]
  >([]);
  const [searchResults, setSearchResults] = React.useState<
    ProjectListResponseDTO[]
  >([]);
  const [isSearchMode, setIsSearchMode] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // 한글 설명: 카테고리 / 검색 / 정렬 변경 시 프로젝트 목록을 백엔드에서 조회
  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // 한글 설명: 검색어가 있으면 검색 API 사용, 없으면 카테고리 기반 조회
        if (searchQuery && searchQuery.trim().length > 0) {
          // 한글 설명: GET /project/search?keyword=... API 호출
          console.log("[ProjectsPage] 검색 모드: 검색어로 프로젝트 조회", {
            searchQuery,
          });
          const results = await searchProjects(searchQuery);
          setSearchResults(results);
          setCategoryProjects([]);
          setIsSearchMode(true);
          setTotalCount(results.length);
        } else {
          // 한글 설명: 카테고리 기반 조회 모드
          setIsSearchMode(false);
          setSearchResults([]);
          // 한글 설명: URL에서 받은 한글 카테고리를 백엔드 enum 문자열로 변환
          // 한글 설명: categoryMapper.ts의 toCategoryEnum 함수를 사용하여 변환
          let category: ProjectCategory;
          if (categoryQuery === "all") {
            // 한글 설명: "all"일 때는 기본 카테고리(TECH) 사용
            // 한글 설명: ⚠️ 임시 - 전체 카테고리 조회 API가 필요할 수 있음
            category = "TECH";
          } else {
            // 한글 설명: 한글 카테고리 라벨을 백엔드 enum 문자열로 변환
            // 한글 설명: 예) "테크" -> "TECH", "디자인" -> "DESIGN"
            const categoryLabel = categoryQuery as CategoryLabel;
            category = toCategoryEnum(categoryLabel) as ProjectCategory;
          }

          console.log(
            "[ProjectsPage] 카테고리 모드: 카테고리로 프로젝트 조회",
            {
              categoryQuery,
              category,
              sort,
            }
          );

        const listResponse = await fetchProjectsByCategory({
            category, // 한글 설명: ⭐ 필수 - 백엔드 enum과 동일한 문자열
            // 한글 설명: 백엔드 API는 category만 받고 sort, page, size는 지원하지 않음
          });
          // 한글 설명: 백엔드는 List<ProjectListResponse>를 반환하므로 items 배열 사용
          if (
            listResponse &&
            listResponse.items &&
            Array.isArray(listResponse.items)
          ) {
            setCategoryProjects(listResponse.items as unknown as ProjectListResponseDTO[]);
          } else {
            setCategoryProjects([]);
          }
          // 한글 설명: total이 존재하는지 확인 후 설정 (없으면 0)
          setTotalCount(listResponse?.total ?? 0);
        }
      } catch (fetchError) {
        console.error("프로젝트 목록 조회 실패", fetchError);
        setError("프로젝트 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    // 한글 설명: 아직 백엔드가 준비되지 않은 경우를 위해 try-catch로 래핑
    load().catch(() => undefined);
  }, [location.search, categoryQuery, searchQuery, sort]); // 한글 설명: location.search를 dependency에 추가하여 URL 변경 감지

  return (
    <Container>
      <div className="space-y-12 py-16">
        <header className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Explore
            </p>
            <h1 className="text-3xl font-semibold text-neutral-900">
              전체 프로젝트
            </h1>
            <p className="max-w-2xl text-sm text-neutral-500">
              마음에 드는 프로젝트를 찾아보세요. 검색어와 정렬, 카테고리 필터를
              조합해 새로운 아이디어를 탐색할 수 있어요.
            </p>
          </div>

          {/* 한글 설명: 검색 입력 UI - 상단에서 바로 검색어를 변경할 수 있도록 구현 */}
          <ProjectSearchBar
            initialValue={q.get("search") || ""}
            sort={sort}
            category={categoryQuery}
          />
        </header>

        {/* 한글 설명: 정렬 드롭다운 + 카테고리 필터 바 */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">정렬</span>
            <select
              value={sort}
              onChange={(event) => {
                const nextSort = event.target.value;
                const params = new URLSearchParams();
                if (q.get("search")) {
                  params.set("search", q.get("search") as string);
                }
                params.set("sort", nextSort);
                if (categoryQuery !== "all") {
                  params.set("category", categoryQuery);
                }
                navigate(`/projects?${params.toString()}`);
              }}
              className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-700 hover:border-neutral-900"
            >
              {sortOptions.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* 한글 설명: 카테고리 필터 버튼 - 클릭 시 CategoryGridPicker 모달 오픈 */}
          <button
            type="button"
            onClick={() => setCategoryPickerOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900"
          >
            <span className="text-xs uppercase tracking-[0.18em] text-neutral-400">
              Category
            </span>
            <span className="font-medium text-neutral-800">
              {CATEGORY_OPTIONS.find((option) => option.key === categoryQuery)
                ?.label ?? "전체"}
            </span>
          </button>
        </div>

        {/* 한글 설명: 현재 검색/카테고리 상태와 결과 수 요약 */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span>
            총{" "}
            <span className="font-semibold text-neutral-900">
              {(totalCount ?? 0).toLocaleString()}개
            </span>
            의 프로젝트
          </span>
          {searchQuery && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
              검색어: <span className="font-medium">{searchQuery}</span>
            </span>
          )}
          {categoryQuery !== "all" && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
              카테고리:{" "}
              <span className="font-medium">
                {
                  CATEGORY_OPTIONS.find(
                    (option) => option.key === categoryQuery
                  )?.label
                }
              </span>
            </span>
          )}
        </div>

        {/* 한글 설명: 카테고리 선택 모달 */}
        <CategoryGridPicker
          open={categoryPickerOpen}
          selectedKey={categoryQuery}
          onClose={() => setCategoryPickerOpen(false)}
          onSelect={(category) => {
            const params = new URLSearchParams();
            // 한글 설명: 카테고리 선택 시 검색어는 제거하고 카테고리만 적용
            params.set("sort", sort);
            if (category.key !== "all") {
              params.set("category", category.key);
            }
            navigate(`/projects?${params.toString()}`, { replace: true });
          }}
        />

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-neutral-200 p-16 text-center text-sm text-neutral-500">
            프로젝트를 불러오는 중입니다...
          </div>
        ) : isSearchMode ? (
          // 한글 설명: 검색 모드일 때는 PublicProjectCard 사용 (ProjectListResponseDTO)
          searchResults.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-200 p-16 text-center text-sm text-neutral-500">
              &quot;{searchQuery}&quot;에 대한 검색 결과가 없습니다. 다른
              검색어를 시도해보세요.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {searchResults.map((project) => (
                <PublicProjectCard key={project.id} project={project} />
              ))}
            </div>
          )
        ) : categoryProjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-200 p-16 text-center text-sm text-neutral-500">
            조건에 맞는 프로젝트가 없습니다. 검색어 또는 카테고리를 변경해
            보세요.
          </div>
        ) : (
          // 한글 설명: 카테고리 조회 모드일 때는 PublicProjectCard 사용 (ProjectListResponseDTO)
          <div className="grid gap-6 md:grid-cols-3">
            {categoryProjects.map((project) => (
              <PublicProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};
