import { useCallback, useMemo, useState } from "react";
import {
  createDefaultRewardOptionConfig,
  type RewardOptionConfig,
} from "../utils/rewardOptions";
import {
  useProjectStore,
  type ProjectStatus,
} from "../stores/projectStore";

export type WizardStep = 1 | 2 | 3 | 4;

export type WizardStepMeta = {
  value: WizardStep;
  title: string;
  description: string;
};

export type BasicInfoState = {
  title: string;
  summary: string;
  category: string;
  coverImageUrl: string;
  coverGallery: string[];
  tags: string[];
};

export type GoalState = {
  goalAmount: number;
  startDate: string;
  endDate: string;
};

export type DraftReward = {
  id: string;
  title: string;
  description: string;
  price: number;
  limitQty?: number;
  estShippingMonth?: string;
  available: boolean;
  optionConfig: RewardOptionConfig;
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

export const CATEGORY_OPTIONS = [
  "테크",
  "디자인",
  "푸드",
  "패션",
  "뷰티",
  "홈·리빙",
  "게임",
  "예술",
  "출판",
] as const;

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
});

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("이미지를 불러오지 못했어요."));
      }
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("파일을 읽는 중 문제가 발생했어요."));
    reader.readAsDataURL(file);
  });

const collectRewardAverage = (rewards: DraftReward[]) => {
  if (!rewards.length) return 0;
  const sum = rewards.reduce(
    (accumulator, reward) => accumulator + Math.max(0, reward.price),
    0
  );
  return sum > 0 ? Math.round(sum / rewards.length) : 0;
};

export const useCreatorWizard = () => {
  const { drafts, addDraft, updateDraft, setDraftStatus } = useProjectStore();

  const [step, setStep] = useState<WizardStep>(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [draftId] = useState(() => generateId("draft"));

  const existingDraft = drafts.find((draft) => draft.id === draftId);

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

      try {
        const dataUrls = await Promise.all(validFiles.map(readFileAsDataUrl));

        let added = 0;
        let limitReached = false;

        setBasic((prev) => {
          const nextGallery = [...prev.coverGallery];
          const existing = new Set(nextGallery);
          let slots = MAX_COVER_IMAGES - nextGallery.length;

          dataUrls.forEach((url) => {
            if (existing.has(url)) {
              return;
            }
            if (slots <= 0) {
              limitReached = true;
              return;
            }
            nextGallery.push(url);
            existing.add(url);
            slots -= 1;
            added += 1;
          });

          if (!added) {
            return prev;
          }

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

        if (oversize.length) {
          alert("5MB를 초과한 이미지는 제외했어요.");
        }
        if (limitReached) {
          alert(`이미지는 최대 ${MAX_COVER_IMAGES}장까지 보관할 수 있어요.`);
        }
      } catch (error) {
        console.error("Failed to read files", error);
        alert("이미지를 불러오는 중 문제가 발생했어요.");
      }
    },
    []
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
  }, []);

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
      category: basic.category,
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
    (nextStatus: ProjectStatus) => {
      const payload = buildDraftPayload();
      const current = drafts.find((draft) => draft.id === draftId);

      if (current) {
        updateDraft(draftId, payload);
        if (current.status !== nextStatus) {
          setDraftStatus(draftId, nextStatus);
        }
      } else {
        addDraft({ id: draftId, status: nextStatus, ...payload });
      }
    },
    [addDraft, buildDraftPayload, draftId, drafts, setDraftStatus, updateDraft]
  );

  const saveDraft = useCallback(() => {
    const baseIssues = collectErrorsForStep(1);
    if (baseIssues.length) {
      setErrors(baseIssues);
      setStep(1);
      return;
    }
    persistDraft("DRAFT");
    setErrors([]);
    alert("초안이 저장됐어요. 마이페이지 > 내 프로젝트에서 확인할 수 있어요.");
  }, [collectErrorsForStep, persistDraft]);

  const requestReview = useCallback(() => {
    for (const meta of STEPS) {
      const issues = collectErrorsForStep(meta.value);
      if (issues.length) {
        setErrors(issues);
        setStep(meta.value);
        return;
      }
    }
    persistDraft("REVIEW");
    setErrors([]);
    alert("검토 요청이 접수됐어요. 심사 중에는 주요 정보를 수정할 수 없어요.");
  }, [collectErrorsForStep, persistDraft]);

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
    saveDraft,
    requestReview,
  };
};
