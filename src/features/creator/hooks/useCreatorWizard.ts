import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createDefaultRewardOptionConfig,
  type RewardOptionConfig,
} from "../utils/rewardOptions";
import {
  useProjectStore,
  type ProjectDraft,
  type ProjectStatus,
  type RewardSummary,
} from "../stores/projectStore";
import { useMyProjectsStore } from "../../projects/stores/myProjectsStore";
import { deleteProjectApi } from "../../projects/api/myProjectsService";
import type {
  CreateProjectRequestDTO,
  RewardOptionConfigDTO,
  TempProjectRequestDTO,
  RewardResponseDTO,
  ProjectDetailResponseDTO,
} from "../../projects/types";
import {
  CATEGORY_OPTIONS as SHARED_CATEGORY_OPTIONS,
  toCategoryEnum,
  toCategoryLabel,
  type CategoryLabel,
  type CategoryEnum,
} from "../../../shared/utils/categoryMapper";
import { resolveImageUrl } from "../../../shared/utils/image";
import {
  uploadImage,
  uploadImages,
} from "../../uploads/api/imageUploadService";
import {
  generateAIListing,
  type AIGeneratedListingResponseDTO,
} from "../../../services/api";

export const CATEGORY_OPTIONS = SHARED_CATEGORY_OPTIONS;

export type WizardStep = 1 | 2 | 3 | 4;

export type WizardStepMeta = {
  value: WizardStep;
  title: string;
  description: string;
};

export type BasicInfoState = {
  title: string;
  summary: string;
  category: CategoryLabel | "";
  coverImageUrl: string;
  coverGallery: string[];
  tags: string[];
};

export type GoalState = {
  goalAmount: number;
  startDate: string;
  endDate: string;
};

import type { RewardDisclosure } from "../types/rewardDisclosure";

export type DraftReward = {
  id: string;
  title: string;
  description: string;
  price: number;
  limitQty?: number;
  estShippingMonth?: string;
  available: boolean;
  optionConfig: RewardOptionConfig;
  disclosure?: RewardDisclosure; // 한글 설명: 리워드 정보 고시 항목
};

export type GuideSection = {
  title: string;
  body: string;
};

export const STEPS: WizardStepMeta[] = [
  { value: 1, title: "기본 정보", description: "프로젝트 개요와 태그" },
  { value: 2, title: "스토리", description: "스토리 가이드와 미리보기" },
  { value: 3, title: "목표 & 일정", description: "모금 목표와 진행 기간" },
  { value: 4, title: "리워드 & 옵션", description: "리워드 구성과 옵션 설계" },
];

export const TAG_SUGGESTIONS = [
  "친환경",
  "프리미엄",
  "공정무역",
  "로컬메이커",
  "사전예약",
  "홈카페",
  "AI",
  "굿즈",
] as const;

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    title: "A. 옵션이 없을 때",
    body: "옵션 선택 없이 단일 구성으로 제공하는 리워드를 설계할 때 사용하세요. 고가의 단품이나 고정 세트 리워드에 적합해요.",
  },
  {
    title: "B. 옵션이 1개 있을 때",
    body: "색상, 용량 등 한 가지 옵션만 선택하면 되는 경우 선택 옵션을 활용하면 재고 관리가 쉬워져요.",
  },
  {
    title: "C. 여러 개의 옵션 설계가 필요할 때",
    body: "색상 + 사이즈처럼 복수의 옵션이 필요한 경우 최대 3단계까지 옵션을 추가할 수 있어요. 옵션별 수량 관리도 가능해요.",
  },
  {
    title: "D. 세트 구성 리워드일 때",
    body: "세트에 포함된 상품마다 옵션을 받아야 한다면 세트 구성을 선택하세요. 구성은 최대 10개까지 추가할 수 있어요.",
  },
  {
    title: "E. 서포터에게 직접 받아야 하는 정보가 있을 때",
    body: "이니셜 각인처럼 서포터가 직접 텍스트를 입력해야 한다면 직접 입력 옵션을 활용하고 안내 문구를 함께 작성해 주세요.",
  },
];

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80";

export const MAX_COVER_IMAGES = 6;
export const MAX_TAGS = 6;
export const MAX_TAG_LENGTH = 14;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const generateId = (prefix: string) =>
  `${prefix}-${
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10)
  }`;

const createReward = (): DraftReward => ({
  id: generateId("reward"),
  title: "",
  description: "",
  price: 0,
  limitQty: undefined,
  estShippingMonth: "",
  available: true,
  optionConfig: createDefaultRewardOptionConfig(),
  disclosure: {
    category: "OTHER",
    common: {},
    categorySpecific: {},
  },
});

const collectRewardAverage = (rewards: DraftReward[]) => {
  if (!rewards.length) return 0;
  const sum = rewards.reduce(
    (accumulator, reward) => accumulator + Math.max(0, reward.price),
    0
  );
  return sum > 0 ? Math.round(sum / rewards.length) : 0;
};

type CreatorWizardOptions = {
  initialDraftId?: string;
  initialRemoteProjectId?: string;
};

const mapRewardResponseToDraftReward = (
  reward: RewardResponseDTO
): DraftReward => ({
  id: reward.id ?? generateId("reward"),
  title: reward.title,
  description: reward.description ?? "",
  price: reward.price,
  limitQty: reward.limitQty ?? undefined,
  estShippingMonth: reward.estShippingMonth ?? undefined,
  available: reward.available,
  optionConfig: createDefaultRewardOptionConfig(),
});

const mapRewardResponseToSummary = (
  reward: RewardResponseDTO
): RewardSummary => ({
  id: reward.id ?? generateId("reward"),
  title: reward.title,
  price: reward.price,
  description: reward.description ?? undefined,
  limitQty: reward.limitQty ?? undefined,
  estShippingMonth: reward.estShippingMonth ?? undefined,
  available: reward.available,
  optionConfig: undefined,
});

export const useCreatorWizard = (options?: CreatorWizardOptions) => {
  const navigate = useNavigate();
  const { drafts, addDraft, updateDraft, setDraftStatus, removeDraft } =
    useProjectStore();
  const saveTempProjectApi = useMyProjectsStore((state) => state.saveTempProject);
  const updateTempProjectApi = useMyProjectsStore(
    (state) => state.updateTempProject
  );
  const requestProjectCreationApi = useMyProjectsStore(
    (state) => state.createProjectRequest
  );
  const fetchProjectDetailApi = useMyProjectsStore((state) => state.fetchDetail);

  const [step, setStep] = useState<WizardStep>(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [draftId] = useState(
    () =>
      options?.initialDraftId ??
      generateId("draft")
  );
  const existingDraft = drafts.find((draft) => draft.id === draftId);
  const [remoteProjectId, setRemoteProjectId] = useState<string | undefined>(
    options?.initialRemoteProjectId ?? existingDraft?.remoteId
  );
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isRequestingReview, setIsRequestingReview] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [coverPreviewMap, setCoverPreviewMap] = useState<Record<string, string>>(
    {}
  );
  const previewObjectUrlsRef = useRef<Set<string>>(new Set());

  const previewCleanup = useCallback(() => {
    previewObjectUrlsRef.current.forEach((previewUrl) =>
      URL.revokeObjectURL(previewUrl)
    );
    previewObjectUrlsRef.current.clear();
  }, []);

  const lastHydratedProjectIdRef = useRef<string | undefined>(undefined);

  const initialGallery: string[] = existingDraft?.coverGallery?.length
    ? existingDraft.coverGallery
    : existingDraft?.coverImageUrl &&
      existingDraft.coverImageUrl !== DEFAULT_COVER
    ? [existingDraft.coverImageUrl]
    : [];

  const initialCover =
    existingDraft?.coverImageUrl ?? initialGallery[0] ?? DEFAULT_COVER;

  const [basic, setBasic] = useState<BasicInfoState>({
    title: existingDraft?.title ?? "",
    summary: existingDraft?.summary ?? "",
    category: existingDraft?.category ?? "",
    coverImageUrl: initialCover,
    coverGallery: initialGallery,
    tags: existingDraft?.tags ?? [],
  });

  const [story, setStory] = useState(existingDraft?.story ?? "");
  const [goal, setGoal] = useState<GoalState>({
    goalAmount: existingDraft?.goalAmount ?? 0,
    startDate: existingDraft?.startDate ?? "",
    endDate: existingDraft?.endDate ?? "",
  });

  const [rewards, setRewards] = useState<DraftReward[]>(
    existingDraft?.rewards?.length
      ? existingDraft.rewards.map((reward) => ({
          id: reward.id,
          title: reward.title,
          description: reward.description ?? "",
          price: reward.price,
          limitQty: reward.limitQty,
          estShippingMonth: reward.estShippingMonth,
          available: reward.available ?? true,
          optionConfig:
            reward.optionConfig ?? createDefaultRewardOptionConfig(),
        }))
      : [createReward()]
  );

  const [tagInput, setTagInput] = useState("");

  const averageRewardPrice = useMemo(
    () => collectRewardAverage(rewards),
    [rewards]
  );

  const estimatedBackersNeeded = useMemo(() => {
    if (goal.goalAmount <= 0 || averageRewardPrice <= 0) return 0;
    return Math.ceil(goal.goalAmount / averageRewardPrice);
  }, [goal.goalAmount, averageRewardPrice]);

  const fundingDuration = useMemo(() => {
    if (!goal.startDate || !goal.endDate) return null;
    const start = new Date(goal.startDate);
    const end = new Date(goal.endDate);
    const diff = end.getTime() - start.getTime();
    if (!Number.isFinite(diff) || diff <= 0) return null;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [goal.startDate, goal.endDate]);

  const updateBasicField = useCallback(
    (field: keyof BasicInfoState, value: string) => {
      setBasic((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const addTag = useCallback(
    (tag: string) => {
      const value = tag.trim();
      if (!value) return;
      if (value.length > MAX_TAG_LENGTH) {
        alert(`태그는 ${MAX_TAG_LENGTH}자 이하로 입력해 주세요.`);
        return;
      }
      if (basic.tags.includes(value)) {
        alert("이미 추가된 태그예요.");
        return;
      }
      if (basic.tags.length >= MAX_TAGS) {
        alert(`태그는 최대 ${MAX_TAGS}개까지 추가할 수 있어요.`);
        return;
      }
      setBasic((prev) => ({ ...prev, tags: [...prev.tags, value] }));
      setTagInput("");
    },
    [basic.tags]
  );

  const removeTag = useCallback((target: string) => {
    setBasic((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== target),
    }));
  }, []);

  const handleCoverUpload = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList?.length) return;

      const files = Array.from(fileList).filter((file) =>
        file.type.startsWith("image/")
      );
      if (!files.length) {
        alert("이미지 파일만 업로드할 수 있어요.");
        return;
      }

      const oversize = files.filter((file) => file.size > MAX_IMAGE_SIZE);
      const validFiles = files.filter((file) => file.size <= MAX_IMAGE_SIZE);

      if (!validFiles.length) {
        alert("5MB 이하의 이미지만 업로드할 수 있어요.");
        return;
      }

      const remainingSlots = Math.max(
        0,
        MAX_COVER_IMAGES - basic.coverGallery.length
      );

      if (remainingSlots <= 0) {
        alert(`이미지는 최대 ${MAX_COVER_IMAGES}장까지 보관할 수 있어요.`);
        return;
      }

      const filesToUpload = validFiles.slice(0, remainingSlots);
      const previewUrls = filesToUpload.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        previewObjectUrlsRef.current.add(previewUrl);
        return previewUrl;
      });

      try {
        let responses: Awaited<ReturnType<typeof uploadImages>> = [];
        if (filesToUpload.length === 1) {
          const single = await uploadImage(filesToUpload[0]);
          responses = [single];
        } else {
          responses = await uploadImages(filesToUpload);
        }

        let nextGallerySnapshot: string[] = [];
        setBasic((prev) => {
          const nextGallery = [...prev.coverGallery];
          const existing = new Set(nextGallery);

          responses.forEach((item) => {
            if (!item?.url) return;
            if (existing.has(item.url)) return;
            if (nextGallery.length >= MAX_COVER_IMAGES) return;
            nextGallery.push(item.url);
            existing.add(item.url);
          });

          nextGallerySnapshot = nextGallery;

          const shouldReplaceCover =
            prev.coverImageUrl === DEFAULT_COVER ||
            !nextGallery.includes(prev.coverImageUrl);

          return {
            ...prev,
            coverGallery: nextGallery,
            coverImageUrl: shouldReplaceCover
              ? nextGallery[0] ?? DEFAULT_COVER
              : prev.coverImageUrl,
          };
        });

        setCoverPreviewMap((prevMap) => {
          const nextMap = { ...prevMap };

          Object.entries(nextMap).forEach(([remoteUrl, previewUrl]) => {
            if (!nextGallerySnapshot.includes(remoteUrl)) {
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                previewObjectUrlsRef.current.delete(previewUrl);
              }
              delete nextMap[remoteUrl];
            }
          });

          responses.forEach((item, index) => {
            const remoteUrl = item?.url;
            const previewUrl = previewUrls[index];
            if (!remoteUrl || !previewUrl) return;
            const previousPreview = nextMap[remoteUrl];
            if (previousPreview && previousPreview !== previewUrl) {
              URL.revokeObjectURL(previousPreview);
              previewObjectUrlsRef.current.delete(previousPreview);
            }
            nextMap[remoteUrl] = previewUrl;
          });

          return nextMap;
        });

        if (oversize.length) {
          alert("5MB를 초과한 이미지는 제외했어요.");
        }
        if (validFiles.length > filesToUpload.length) {
          alert(`이미지는 최대 ${MAX_COVER_IMAGES}장까지 보관할 수 있어요.`);
        }
      } catch (error) {
        previewUrls.forEach((previewUrl) => {
          URL.revokeObjectURL(previewUrl);
          previewObjectUrlsRef.current.delete(previewUrl);
        });
        console.error("이미지 업로드 실패", error);
        alert("이미지 업로드 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    },
    [basic.coverGallery.length]
  );

  const handleSelectCover = useCallback((image: string) => {
    setBasic((prev) => {
      if (prev.coverImageUrl === image) {
        return prev;
      }
      const rest = prev.coverGallery.filter((item) => item !== image);
      return {
        ...prev,
        coverImageUrl: image,
        coverGallery: [image, ...rest],
      };
    });
  }, []);

  const handleRemoveCoverImage = useCallback((image: string) => {
    setBasic((prev) => {
      const gallery = prev.coverGallery.filter((item) => item !== image);
      if (gallery.length === prev.coverGallery.length) {
        return prev;
      }
      const nextCover =
        prev.coverImageUrl === image
          ? gallery[0] ?? DEFAULT_COVER
          : prev.coverImageUrl;
      return {
        ...prev,
        coverGallery: gallery,
        coverImageUrl: nextCover,
      };
    });
    setCoverPreviewMap((prev) => {
      if (!(image in prev)) return prev;
      const next = { ...prev };
      const previewUrl = next[image];
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewObjectUrlsRef.current.delete(previewUrl);
      }
      delete next[image];
      return next;
    });
  }, []);

  const resolveCoverImageUrl = useCallback(
    (url: string | null | undefined) => {
      if (!url) return undefined;
      const preview = coverPreviewMap[url];
      if (preview) return preview;
      return resolveImageUrl(url) ?? url;
    },
    [coverPreviewMap]
  );

  useEffect(() => {
    return () => {
      previewCleanup();
    };
  }, [previewCleanup]);

  const updateGoalField = useCallback(
    (field: keyof GoalState, value: string | number) => {
      setGoal((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const addReward = useCallback(() => {
    setRewards((prev) => [...prev, createReward()]);
  }, []);

  const updateReward = useCallback(
    (id: string, patch: Partial<DraftReward>) => {
      setRewards((prev) =>
        prev.map((reward) =>
          reward.id === id ? { ...reward, ...patch } : reward
        )
      );
    },
    []
  );

  const removeReward = useCallback((id: string) => {
    setRewards((prev) => prev.filter((reward) => reward.id !== id));
  }, []);

  const collectErrorsForStep = useCallback(
    (target: WizardStep): string[] => {
      const issues: string[] = [];

      if (target === 1) {
        if (!basic.title.trim()) {
          issues.push("프로젝트 제목을 입력해 주세요.");
        }
        if (basic.summary.trim().length < 10) {
          issues.push("프로젝트 요약을 10자 이상 작성해 주세요.");
        }
        if (!basic.category) {
          issues.push("카테고리를 선택해 주세요.");
        }
      }

      if (target === 2) {
        if (story.trim().length < 50) {
          issues.push("스토리를 최소 50자 이상 작성해 주세요.");
        }
      }

      if (target === 3) {
        if (goal.goalAmount <= 0) {
          issues.push("목표 금액을 0보다 큰 값으로 입력해 주세요.");
        }
        if (!goal.startDate) {
          issues.push("진행 시작일을 선택해 주세요.");
        }
        if (!goal.endDate) {
          issues.push("진행 종료일을 선택해 주세요.");
        }
        if (goal.startDate && goal.endDate) {
          const start = new Date(goal.startDate);
          const end = new Date(goal.endDate);
          if (end <= start) {
            issues.push("종료일은 시작일 이후여야 해요.");
          }
        }
      }

      if (target === 4) {
        if (!rewards.length) {
          issues.push("리워드를 최소 1개 이상 추가해 주세요.");
        }
        rewards.forEach((reward, index) => {
          if (!reward.title.trim()) {
            issues.push(`리워드 ${index + 1}의 이름을 입력해 주세요.`);
          }
          if (reward.price <= 0) {
            issues.push(
              `리워드 ${index + 1}의 금액을 0보다 크게 입력해 주세요.`
            );
          }
        });
      }

      return issues;
    },
    [basic, story, goal, rewards]
  );

  const goNext = useCallback(() => {
    const stepIssues = collectErrorsForStep(step);
    if (stepIssues.length) {
      setErrors(stepIssues);
      return;
    }
    setErrors([]);
    setStep((prev) => (prev < 4 ? ((prev + 1) as WizardStep) : prev));
  }, [collectErrorsForStep, step]);

  const goPrev = useCallback(() => {
    setErrors([]);
    setStep((prev) => (prev > 1 ? ((prev - 1) as WizardStep) : prev));
  }, []);

  const selectStep = useCallback(
    (target: WizardStep) => {
      if (target === step) return;

      if (target > step) {
        for (const meta of STEPS) {
          if (meta.value > step && meta.value <= target) {
            const stepIssues = collectErrorsForStep(meta.value);
            if (stepIssues.length) {
              setErrors(stepIssues);
              setStep(meta.value);
              return;
            }
          }
        }
      }

      setErrors([]);
      setStep(target);
    },
    [step, collectErrorsForStep]
  );

  const buildDraftPayload = useCallback(
    () => ({
      title: basic.title.trim(),
      summary: basic.summary.trim(),
      category: basic.category as CategoryLabel,
      story,
      goalAmount: goal.goalAmount,
      startDate: goal.startDate,
      endDate: goal.endDate,
      tags: basic.tags,
      coverImageUrl: basic.coverImageUrl || DEFAULT_COVER,
      coverGallery: basic.coverGallery,
      rewards: rewards.map((reward) => ({
        id: reward.id,
        title: reward.title.trim(),
        description: reward.description.trim() || undefined,
        price: reward.price,
        limitQty: reward.limitQty,
        estShippingMonth: reward.estShippingMonth,
        available: reward.available,
        optionConfig: reward.optionConfig,
      })),
    }),
    [basic, story, goal, rewards]
  );

  const persistDraft = useCallback(
    (nextStatus: ProjectStatus, remoteId?: string) => {
      const payload = buildDraftPayload();
      const current = drafts.find((draft) => draft.id === draftId);

      if (current) {
        updateDraft(draftId, { ...payload, remoteId });
        if (current.status !== nextStatus) {
          setDraftStatus(draftId, nextStatus);
        }
      } else {
        addDraft({ id: draftId, remoteId, status: nextStatus, ...payload });
      }
    },
    [addDraft, buildDraftPayload, draftId, drafts, setDraftStatus, updateDraft]
  );

  const toRewardOptionConfigDTO = useCallback(
    (config: RewardOptionConfig): RewardOptionConfigDTO | undefined => {
      if (!config || config.mode === "none") {
        return { hasOptions: false };
      }
      const options = config.optionGroups.map((group) => ({
        name: group.name,
        type: group.inputType,
        required: group.required,
        choices:
          group.inputType === "select"
            ? group.values?.map((value) => value.label) ?? []
            : undefined,
      }));
      return { hasOptions: options.length > 0, options };
    },
    []
  );

  const hydrateFromProjectDetail = useCallback(
    (detail: ProjectDetailResponseDTO) => {
      // 한글 설명: 서버에서 받은 이미지 URL을 절대 경로로 변환하여 저장
      const rawGallery = Array.isArray(detail.coverGallery)
        ? detail.coverGallery
        : [];
      // 한글 설명: coverGallery가 비어있고 coverImageUrl이 있으면 coverImageUrl을 갤러리에 포함
      const galleryWithCover =
        rawGallery.length === 0 && detail.coverImageUrl
          ? [detail.coverImageUrl]
          : rawGallery;
      const resolvedGallery = galleryWithCover.map((url) => {
        // 한글 설명: 상대 경로인 경우 resolveImageUrl로 변환, 이미 절대 경로면 그대로 사용
        const resolved = resolveImageUrl(url);
        return resolved ?? url;
      });
      const rawCover = detail.coverImageUrl ?? resolvedGallery[0] ?? DEFAULT_COVER;
      const resolvedCover = resolveImageUrl(rawCover) ?? rawCover;

      const nextDraftRewards = detail.rewards?.length
        ? detail.rewards.map(mapRewardResponseToDraftReward)
        : [createReward()];

      setBasic({
        title: detail.title ?? "",
        summary: detail.summary ?? "",
        category: detail.category ?? "",
        coverImageUrl: resolvedCover,
        coverGallery: resolvedGallery,
        tags: detail.tags ?? [],
      });
      setStory(detail.storyMarkdown ?? "");
      setGoal({
        goalAmount: detail.goalAmount ?? 0,
        startDate: detail.startDate ?? "",
        endDate: detail.endDate ?? "",
      });
      setRewards(nextDraftRewards);
      setRemoteProjectId(detail.id);
      setCoverPreviewMap({});
      previewCleanup();

      const summaryRewards =
        detail.rewards?.map(mapRewardResponseToSummary) ?? [];
      const draftPayload: ProjectDraft = {
        id: draftId,
        remoteId: detail.id,
        status: "DRAFT",
        title: detail.title ?? "",
        summary: detail.summary ?? "",
        category: detail.category ?? "",
        story: detail.storyMarkdown ?? "",
        goalAmount: detail.goalAmount ?? 0,
        startDate: detail.startDate ?? undefined,
        endDate: detail.endDate ?? undefined,
        tags: detail.tags ?? [],
        coverImageUrl: resolvedCover !== DEFAULT_COVER ? resolvedCover : undefined,
        coverGallery: resolvedGallery,
        rewards: summaryRewards,
      };

      if (drafts.some((draft) => draft.id === draftId)) {
        updateDraft(draftId, draftPayload);
        setDraftStatus(draftId, "DRAFT");
      } else {
        addDraft(draftPayload);
      }
    },
    [
      addDraft,
      draftId,
      drafts,
      previewCleanup,
      setDraftStatus,
      updateDraft,
    ]
  );

  useEffect(() => {
    if (!remoteProjectId) {
      lastHydratedProjectIdRef.current = undefined;
      return;
    }
    if (lastHydratedProjectIdRef.current === remoteProjectId) {
      return;
    }
    fetchProjectDetailApi(remoteProjectId)
      .then((detail) => {
        hydrateFromProjectDetail(detail);
        lastHydratedProjectIdRef.current = remoteProjectId;
      })
      .catch((error) => {
        console.error("임시 저장된 프로젝트 불러오기 실패", error);
        lastHydratedProjectIdRef.current = undefined;
      });
  }, [fetchProjectDetailApi, hydrateFromProjectDetail, remoteProjectId]);

  const buildCreateRequestPayload = useCallback(
    (): CreateProjectRequestDTO => {
      // 한글 설명: 리워드 정보를 API DTO 형식으로 변환
      const mappedRewards = rewards.map((reward) => {
        const optionConfig = toRewardOptionConfigDTO(reward.optionConfig);
        return {
          title: reward.title.trim(),
          description: reward.description.trim() || undefined,
          price: reward.price,
          limitQty: reward.limitQty,
          estShippingMonth: reward.estShippingMonth,
          available: reward.available,
          optionConfig,
        };
      });

      // 한글 설명: 디버깅을 위한 리워드 정보 로그
      console.log("[CreatorWizard] 리워드 변환 결과:", {
        원본_리워드_개수: rewards.length,
        변환된_리워드_개수: mappedRewards.length,
        리워드_상세: mappedRewards.map((r, idx) => ({
          인덱스: idx,
          제목: r.title,
          가격: r.price,
          옵션_있음: r.optionConfig?.hasOptions ?? false,
        })),
      });

      return {
        title: basic.title.trim(),
        summary: basic.summary.trim(),
        category: toCategoryEnum(basic.category as CategoryLabel),
        storyMarkdown: story,
        coverImageUrl: basic.coverImageUrl || DEFAULT_COVER,
        coverGallery: basic.coverGallery,
        goalAmount: goal.goalAmount,
        startDate: goal.startDate || undefined,
        endDate: goal.endDate,
        tags: basic.tags,
        rewards: mappedRewards,
      };
    },
    [basic, story, goal, rewards, toRewardOptionConfigDTO]
  );

  const buildUpdateRequestPayload = useCallback(
    (): TempProjectRequestDTO => buildCreateRequestPayload(),
    [buildCreateRequestPayload]
  );

  const saveDraft = useCallback(async () => {
    const baseIssues = collectErrorsForStep(1);
    if (baseIssues.length) {
      setErrors(baseIssues);
      setStep(1);
      return;
    }

    setErrors([]);
    setIsSavingDraft(true);
    try {
      if (!remoteProjectId) {
        const requestPayload = buildCreateRequestPayload();
        console.log(
          "[CreatorWizard] 임시 저장 신규 요청 페이로드",
          requestPayload
        );
        console.log(
          "[CreatorWizard] 리워드 정보 확인:",
          JSON.stringify(requestPayload.rewards, null, 2)
        );
        const response = await saveTempProjectApi(requestPayload);
        setRemoteProjectId(response.projectId);
        persistDraft("DRAFT", response.projectId);
        alert(
          "초안이 서버에 저장됐어요. 마이페이지 > 내 프로젝트에서 확인할 수 있어요."
        );
      } else {
        const updatePayload = buildUpdateRequestPayload();
        console.log(
          "[CreatorWizard] 임시 저장 수정 요청 페이로드",
          updatePayload
        );
        console.log(
          "[CreatorWizard] 리워드 정보 확인:",
          JSON.stringify(updatePayload.rewards, null, 2)
        );
        await updateTempProjectApi(remoteProjectId, updatePayload);
        persistDraft("DRAFT", remoteProjectId);
        alert(
          "초안이 최신 상태로 업데이트됐어요. 마이페이지 > 내 프로젝트에서 확인할 수 있어요."
        );
      }
    } catch (error) {
      console.error("임시 저장 실패", error);
      alert("임시 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSavingDraft(false);
    }
  }, [
    buildCreateRequestPayload,
    buildUpdateRequestPayload,
    collectErrorsForStep,
    persistDraft,
    remoteProjectId,
    saveTempProjectApi,
    updateTempProjectApi,
  ]);

  const requestReview = useCallback(async () => {
    for (const meta of STEPS) {
      const issues = collectErrorsForStep(meta.value);
      if (issues.length) {
        setErrors(issues);
        setStep(meta.value);
        return;
      }
    }

    setErrors([]);
    setIsRequestingReview(true);
    try {
      if (remoteProjectId) {
        const updatePayload = buildUpdateRequestPayload();
        console.log(
          "[CreatorWizard] 검토 요청 전 최신 초안 동기화",
          updatePayload
        );
        await updateTempProjectApi(remoteProjectId, updatePayload);
        persistDraft("DRAFT", remoteProjectId);
      }

      const requestPayload = buildCreateRequestPayload();
      console.log(
        "[CreatorWizard] 검토 요청 API 페이로드",
        requestPayload
      );
      const response = await requestProjectCreationApi(
        requestPayload,
        remoteProjectId
      );
      setRemoteProjectId(response.project);
      persistDraft("REVIEW", response.project);
      alert(
        "검토 요청이 접수됐어요. 심사 중에는 주요 정보를 수정할 수 없어요."
      );
    } catch (error) {
      console.error("검토 요청 실패", error);
      alert(
        "검토 요청 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setIsRequestingReview(false);
    }
  }, [
    STEPS,
    collectErrorsForStep,
    buildUpdateRequestPayload,
    updateTempProjectApi,
    remoteProjectId,
    persistDraft,
    buildCreateRequestPayload,
    requestProjectCreationApi,
  ]);

  // 한글 설명: AI 설명 생성 핸들러
  const generateAIDescription = useCallback(
    async (imageFile: File, hint?: string, tone?: string) => {
      setIsGeneratingAI(true);
      try {
        const response: AIGeneratedListingResponseDTO =
          await generateAIListing(imageFile, hint, tone);

        // 한글 설명: AI 응답을 폼에 자동으로 채우기
        if (response.title) {
          updateBasicField("title", response.title);
        }
        // 한글 설명: shortDescription 필드명 사용 (백엔드 스펙에 맞춤)
        if (response.shortDescription) {
          updateBasicField("summary", response.shortDescription);
        }
        // 한글 설명: categoryName(한글 이름)을 우선 사용, 없으면 category enum을 한글 라벨로 변환
        if (response.categoryName) {
          // 한글 설명: categoryName이 유효한 옵션인지 확인
          const isValidCategory = CATEGORY_OPTIONS.includes(
            response.categoryName as CategoryLabel
          );
          if (isValidCategory) {
            updateBasicField("category", response.categoryName);
          }
        } else if (response.category) {
          // 한글 설명: category enum을 한글 라벨로 변환
          try {
            const categoryLabel = toCategoryLabel(
              response.category as CategoryEnum
            );
            if (CATEGORY_OPTIONS.includes(categoryLabel)) {
              updateBasicField("category", categoryLabel);
            }
          } catch (error) {
            console.warn("카테고리 enum 변환 실패:", response.category);
          }
        }
        if (response.tags && response.tags.length > 0) {
          // 한글 설명: 태그 추가 (중복 제거 및 최대 개수 제한)
          const newTags = response.tags
            .filter((tag) => tag.trim().length > 0)
            .filter((tag) => !basic.tags.includes(tag.trim()))
            .slice(0, MAX_TAGS - basic.tags.length);
          newTags.forEach((tag) => {
            const trimmedTag = tag.trim();
            if (
              trimmedTag.length <= MAX_TAG_LENGTH &&
              basic.tags.length < MAX_TAGS
            ) {
              setBasic((prev) => ({
                ...prev,
                tags: [...prev.tags, trimmedTag],
              }));
            }
          });
        }
        if (response.story) {
          setStory(response.story);
        }

        alert("AI가 프로젝트 설명을 생성했습니다. 필요에 따라 수정해 주세요.");
      } catch (error) {
        console.error("AI 설명 생성 실패", error);
        alert(
          "AI 설명 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
      } finally {
        setIsGeneratingAI(false);
      }
    },
    [basic.tags, updateBasicField]
  );

  // 한글 설명: 프로젝트 삭제 핸들러
  const handleDeleteProject = useCallback(async () => {
    if (!remoteProjectId) {
      alert("삭제할 프로젝트가 없습니다.");
      return;
    }

    if (
      !window.confirm(
        "이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    try {
      await deleteProjectApi(remoteProjectId);
      // 한글 설명: 로컬 draft도 삭제
      if (draftId) {
        removeDraft(draftId);
      }
      alert("프로젝트가 삭제되었습니다.");
      // 한글 설명: 삭제 후 프로필 페이지로 이동
      navigate("/profile/maker");
    } catch (error) {
      console.error("프로젝트 삭제 실패", error);
      alert("프로젝트 삭제 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }, [remoteProjectId, draftId, removeDraft, navigate]);

  const progress = (step / STEPS.length) * 100;

  return {
    step,
    steps: STEPS,
    progress,
    errors,
    basic,
    story,
    goal,
    rewards,
    tagInput,
    averageRewardPrice,
    estimatedBackersNeeded,
    fundingDuration,
    setStory,
    setTagInput,
    updateBasicField,
    addTag,
    removeTag,
    uploadCover: handleCoverUpload,
    selectCoverImage: handleSelectCover,
    removeCoverImage: handleRemoveCoverImage,
    updateGoalField,
    addReward,
    updateReward,
    removeReward,
    goNext,
    goPrev,
    selectStep,
    isSavingDraft,
    isRequestingReview,
    resolveCoverImageUrl,
    saveDraft,
    requestReview,
    remoteProjectId,
    updateTempProjectApi,
    deleteProject: handleDeleteProject,
    generateAIDescription,
    isGeneratingAI,
  };
};
