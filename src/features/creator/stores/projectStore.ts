import { create } from "zustand";
import {
  createDefaultRewardOptionConfig,
  type RewardOptionConfig,
} from "../utils/rewardOptions";
import type { CategoryLabel } from "../../../shared/utils/categorymapper";

export type ProjectStatus =
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "LIVE"
  | "ENDED"
  | "REJECTED";

export type RewardSummary = {
  id: string;
  title: string;
  price: number;
  description?: string;
  limitQty?: number;
  estShippingMonth?: string;
  available?: boolean;
  optionConfig?: RewardOptionConfig;
};

export type ProjectDraft = {
  id: string;
  remoteId?: string;
  title: string;
  summary: string;
  category: CategoryLabel;
  story: string;
  goalAmount: number;
  startDate?: string;
  endDate?: string;
  status: ProjectStatus;
  tags?: string[];
  coverImageUrl?: string;
  coverGallery?: string[];
  rewards: RewardSummary[];
};

type ProjectStore = {
  drafts: ProjectDraft[];
  addDraft: (draft: ProjectDraft) => void;
  updateDraft: (id: string, patch: Partial<ProjectDraft>) => void;
  removeDraft: (id: string) => void;
  setDraftStatus: (id: string, status: ProjectStatus) => void;
};

const STORAGE_KEY = "fundit:project:drafts";

const loadDrafts = (): ProjectDraft[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as ProjectDraft[]).map((draft) => ({
      ...draft,
      remoteId: draft.remoteId,
      coverGallery: Array.isArray(draft.coverGallery) ? draft.coverGallery : [],
      rewards: (draft.rewards ?? []).map((reward) => ({
        ...reward,
        available: reward.available ?? true,
        optionConfig:
          reward.optionConfig ?? createDefaultRewardOptionConfig(),
      })),
    }));
  } catch (error) {
    console.warn("Failed to load drafts", error);
    return [];
  }
};

const saveDrafts = (drafts: ProjectDraft[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.warn("Failed to persist drafts", error);
  }
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  drafts: loadDrafts(),
  addDraft: (draft) => {
    set((state) => {
      const next = [...state.drafts.filter((item) => item.id !== draft.id), draft];
      saveDrafts(next);
      return { drafts: next };
    });
  },
  updateDraft: (id, patch) => {
    set((state) => {
      const next = state.drafts.map((draft) =>
        draft.id === id ? { ...draft, ...patch } : draft
      );
      saveDrafts(next);
      return { drafts: next };
    });
  },
  removeDraft: (id) => {
    set((state) => {
      const next = state.drafts.filter((draft) => draft.id !== id);
      saveDrafts(next);
      return { drafts: next };
    });
  },
  setDraftStatus: (id, status) => {
    const target = get().drafts.find((draft) => draft.id === id);
    if (!target) return;
    get().updateDraft(id, { status });
  },
}));
