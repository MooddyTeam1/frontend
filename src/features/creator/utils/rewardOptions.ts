export type RewardOptionInputType = "select" | "text";

export type RewardOptionMode = "none" | "single" | "set";

export type RewardOptionValue = {
  id: string;
  label: string;
  extraPrice?: number;
  limitQty?: number;
};

export type RewardOptionGroup = {
  id: string;
  name: string;
  inputType: RewardOptionInputType;
  required: boolean;
  values?: RewardOptionValue[];
  placeholder?: string;
  maxLength?: number;
};

export type RewardSetItem = {
  id: string;
  name: string;
  baseQty: number;
  optionGroups: RewardOptionGroup[];
};

export type RewardOptionConfig = {
  mode: RewardOptionMode;
  optionGroups: RewardOptionGroup[];
  setItems: RewardSetItem[];
};

export const createDefaultRewardOptionConfig = (): RewardOptionConfig => ({
  mode: "none",
  optionGroups: [],
  setItems: [],
});

export const defaultRewardOptionConfig: RewardOptionConfig =
  createDefaultRewardOptionConfig();

const uid = () => Math.random().toString(36).slice(2, 9);

export const createSelectOptionGroup = (name = ""): RewardOptionGroup => ({
  id: `opt-${uid()}`,
  name,
  inputType: "select",
  required: true,
  values: [],
});

export const createTextOptionGroup = (name = ""): RewardOptionGroup => ({
  id: `opt-${uid()}`,
  name,
  inputType: "text",
  required: true,
  placeholder: "",
  maxLength: 100,
});

export const createRewardSetItem = (name = ""): RewardSetItem => ({
  id: `set-${uid()}`,
  name,
  baseQty: 1,
  optionGroups: [],
});
