import { create } from "zustand";
import type { MakerDTO } from "../types";

const STORAGE_KEY = "fundit:maker:makers";

type MakerStore = {
  makers: Record<string, MakerDTO>; // makerId -> maker
  makersByOwner: Record<string, string>; // ownerUserId -> makerId
  // Actions
  getMaker: (makerId: string) => MakerDTO | null;
  getMakerByOwner: (ownerUserId: string) => MakerDTO | null;
  setMaker: (maker: MakerDTO) => void;
  updateMaker: (makerId: string, updates: Partial<MakerDTO>) => void;
  loadMakers: () => void;
};

// 한글 설명: 메이커 정보를 관리하는 Zustand store. localStorage 기반으로 동작하며 백엔드 없이 사용 가능.
export const useMakerStore = create<MakerStore>((set, get) => {
  // 한글 설명: localStorage에서 메이커 데이터 로드
  const loadFromStorage = (): {
    makers: Record<string, MakerDTO>;
    makersByOwner: Record<string, string>;
  } => {
    if (typeof window === "undefined")
      return { makers: {}, makersByOwner: {} };
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return { makers: {}, makersByOwner: {} };
      const parsed = JSON.parse(raw);
      const makers = parsed?.makers || {};
      const makersByOwner: Record<string, string> = {};
      // ownerUserId -> makerId 매핑 생성
      Object.values(makers as Record<string, MakerDTO>).forEach(
        (maker: MakerDTO) => {
          makersByOwner[maker.ownerUserId] = maker.id;
        }
      );
      return { makers, makersByOwner };
    } catch (error) {
      console.warn("Failed to load makers", error);
      return { makers: {}, makersByOwner: {} };
    }
  };

  // 한글 설명: localStorage에 메이커 데이터 저장
  const saveToStorage = (makers: Record<string, MakerDTO>) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ makers })
      );
    } catch (error) {
      console.warn("Failed to save makers", error);
    }
  };

  const data = loadFromStorage();

  return {
    makers: data.makers,
    makersByOwner: data.makersByOwner,

    // 한글 설명: 메이커 데이터 로드 (앱 시작 시 호출)
    loadMakers: () => {
      const data = loadFromStorage();
      set(data);
    },

    // 한글 설명: 메이커 ID로 메이커 조회
    getMaker: (makerId: string) => {
      return get().makers[makerId] || null;
    },

    // 한글 설명: 사용자 ID로 소유 메이커 조회
    getMakerByOwner: (ownerUserId: string) => {
      const makerId = get().makersByOwner[ownerUserId];
      if (!makerId) return null;
      return get().makers[makerId] || null;
    },

    // 한글 설명: 메이커 전체 설정
    setMaker: (maker: MakerDTO) => {
      const makers = { ...get().makers, [maker.id]: maker };
      const makersByOwner = {
        ...get().makersByOwner,
        [maker.ownerUserId]: maker.id,
      };
      set({ makers, makersByOwner });
      saveToStorage(makers);
    },

    // 한글 설명: 메이커 부분 업데이트
    updateMaker: (makerId: string, updates: Partial<MakerDTO>) => {
      const current = get().makers[makerId];
      if (!current) {
        throw new Error(`Maker with id ${makerId} not found`);
      }
      const updated = {
        ...current,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      get().setMaker(updated);
    },
  };
});





