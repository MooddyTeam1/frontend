import React from "react";
import {
  createRewardSetItem,
  createSelectOptionGroup,
  createTextOptionGroup,
  createDefaultRewardOptionConfig,
  type RewardOptionConfig,
  type RewardOptionGroup,
  type RewardOptionMode,
  type RewardOptionValue,
  type RewardSetItem,
} from "../utils/rewardOptions";

type RewardOptionEditorProps = {
  value?: RewardOptionConfig;
  onChange: (next: RewardOptionConfig) => void;
};

const MODE_CARDS: Array<{
  key: RewardOptionMode;
  badge: string;
  title: string;
  description: string;
  helper: string;
}> = [
  {
    key: "none",
    badge: "Guide A",
    title: "옵션 없음",
    description: "옵션 선택이 필요 없는 단일 구성",
    helper: "고가 단품이나 고정 세트 리워드에 적합합니다.",
  },
  {
    key: "single",
    badge: "Guide B · C · E",
    title: "선택 옵션",
    description: "최대 3단계까지 옵션 설계",
    helper: "색상, 사이즈, 직접 입력 옵션을 한 화면에서 구성하세요.",
  },
  {
    key: "set",
    badge: "Guide D",
    title: "세트 구성",
    description: "구성품별 옵션 설계",
    helper: "세트를 이루는 각 구성에 옵션을 부여할 수 있습니다.",
  },
];

const MAX_GROUPS = 3;
const MAX_SET_ITEMS = 10;

const generateId = (prefix: string) =>
  `${prefix}-${
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 9)
  }`;

const createOptionValue = (): RewardOptionValue => ({
  id: generateId("value"),
  label: "",
});

export const RewardOptionEditor: React.FC<RewardOptionEditorProps> = ({
  value,
  onChange,
}) => {
  const config = value ?? createDefaultRewardOptionConfig();

  const changeMode = (mode: RewardOptionMode) => {
    if (mode === config.mode) return;

    if (mode === "none") {
      onChange({ ...createDefaultRewardOptionConfig(), mode: "none" });
      return;
    }

    if (mode === "single") {
      const nextGroups =
        config.optionGroups.length > 0
          ? config.optionGroups
          : [createSelectOptionGroup("옵션 1")];
      onChange({
        mode,
        optionGroups: nextGroups,
        setItems: [],
      });
      return;
    }

    const nextItems =
      config.setItems.length > 0
        ? config.setItems
        : [createRewardSetItem("구성 1")];
    onChange({
      mode,
      optionGroups: [],
      setItems: nextItems,
    });
  };

  const updateGroups = (groups: RewardOptionGroup[]) => {
    onChange({ ...config, optionGroups: groups });
  };

  const updateSetItems = (items: RewardSetItem[]) => {
    onChange({ ...config, setItems: items });
  };

  return (
    <section className="space-y-6 rounded-3xl border border-neutral-200 p-5">
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">리워드 옵션</h3>
          <span className="text-[11px] text-neutral-500">Wadiz Guide A–E</span>
        </div>
        <p className="text-xs text-neutral-500">
          옵션이 없다면 ‘옵션 없음’, 하나 이상의 선택지가 필요하면 ‘선택 옵션’, 구성품마다
          옵션을 받아야 한다면 ‘세트 구성’을 선택하세요.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {MODE_CARDS.map((card) => {
          const active = config.mode === card.key;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => changeMode(card.key)}
              className={`rounded-2xl border px-4 py-5 text-left transition ${
                active
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                {card.badge}
              </p>
              <p className="mt-2 text-sm font-semibold">{card.title}</p>
              <p className={`mt-1 text-xs leading-relaxed ${active ? "text-white/80" : "text-neutral-500"}`}>
                {card.description}
              </p>
              <p className={`mt-3 text-[11px] ${active ? "text-white/70" : "text-neutral-400"}`}>
                {card.helper}
              </p>
            </button>
          );
        })}
      </div>

      {config.mode === "none" && (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500">
          옵션 선택 UI 없이 바로 결제 단계로 이동합니다. 고가 단품, 구성 변경이 없는 세트 리워드에 적합합니다.
        </div>
      )}

      {config.mode === "single" && (
        <OptionGroupList groups={config.optionGroups} onChange={updateGroups} />
      )}

      {config.mode === "set" && (
        <SetConfigurator items={config.setItems} onChange={updateSetItems} />
      )}
    </section>
  );
};

type OptionGroupListProps = {
  groups: RewardOptionGroup[];
  onChange: (groups: RewardOptionGroup[]) => void;
};

const OptionGroupList: React.FC<OptionGroupListProps> = ({ groups, onChange }) => {
  const addGroup = () => {
    if (groups.length >= MAX_GROUPS) return;
    onChange([...groups, createSelectOptionGroup(`옵션 ${groups.length + 1}`)]);
  };

  const replaceGroup = (id: string, next: RewardOptionGroup) => {
    onChange(groups.map((group) => (group.id === id ? next : group)));
  };

  const removeGroup = (id: string) => {
    onChange(groups.filter((group) => group.id !== id));
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500">
        선택 옵션은 최대 3단계까지 추가할 수 있습니다. (예: 색상 → 사이즈 → 재질)
      </p>
      <div className="space-y-4">
        {groups.map((group, index) => (
          <OptionGroupCard
            key={group.id}
            index={index}
            group={group}
            onChange={(next) => replaceGroup(group.id, next)}
            onRemove={groups.length > 1 ? () => removeGroup(group.id) : undefined}
          />
        ))}
      </div>
      {groups.length < MAX_GROUPS && (
        <button
          type="button"
          onClick={addGroup}
          className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
        >
          + 옵션 단계 추가
        </button>
      )}
    </div>
  );
};

type OptionGroupCardProps = {
  index: number;
  group: RewardOptionGroup;
  onChange: (group: RewardOptionGroup) => void;
  onRemove?: () => void;
};

const OptionGroupCard: React.FC<OptionGroupCardProps> = ({
  index,
  group,
  onChange,
  onRemove,
}) => {
  const toggleInputType = (type: RewardOptionGroup["inputType"]) => {
    if (type === group.inputType) return;

    if (type === "select") {
      const next = createSelectOptionGroup(group.name || `옵션 ${index + 1}`);
      onChange({
        ...next,
        id: group.id,
        required: group.required,
        values: group.values?.length ? group.values : next.values,
      });
    } else {
      const next = createTextOptionGroup(group.name || `옵션 ${index + 1}`);
      onChange({
        ...next,
        id: group.id,
        required: group.required,
      });
    }
  };

  const updateValues = (values: RewardOptionValue[]) => {
    onChange({ ...group, values });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-neutral-400">옵션 {index + 1}</span>
          <input
            value={group.name}
            onChange={(event) => onChange({ ...group, name: event.target.value })}
            placeholder="예: 색상"
            className="rounded-xl border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-full border border-neutral-200">
            <button
              type="button"
              onClick={() => toggleInputType("select")}
              className={`px-3 py-1 text-xs ${
                group.inputType === "select"
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              선택형
            </button>
            <button
              type="button"
              onClick={() => toggleInputType("text")}
              className={`px-3 py-1 text-xs ${
                group.inputType === "text"
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              직접 입력
            </button>
          </div>
          <label className="flex items-center gap-2 text-xs text-neutral-500">
            <input
              type="checkbox"
              checked={group.required}
              onChange={(event) =>
                onChange({ ...group, required: event.target.checked })
              }
            />
            필수
          </label>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500 hover:border-red-400 hover:text-red-500"
            >
              삭제
            </button>
          )}
        </div>
      </div>

      {group.inputType === "select" ? (
        <SelectValueList values={group.values ?? []} onChange={updateValues} />
      ) : (
        <TextOptionDetails
          placeholder={group.placeholder ?? ""}
          maxLength={group.maxLength ?? 100}
          onChange={(details) =>
            onChange({ ...group, ...details, values: undefined })
          }
        />
      )}
    </div>
  );
};

type SelectValueListProps = {
  values: RewardOptionValue[];
  onChange: (values: RewardOptionValue[]) => void;
};

const SelectValueList: React.FC<SelectValueListProps> = ({ values, onChange }) => {
  const addValue = () => {
    onChange([...values, createOptionValue()]);
  };

  const updateValue = (id: string, patch: Partial<RewardOptionValue>) => {
    onChange(values.map((value) => (value.id === id ? { ...value, ...patch } : value)));
  };

  const removeValue = (id: string) => {
    onChange(values.filter((value) => value.id !== id));
  };

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-neutral-400">
        쉼표로 구분된 옵션 값을 붙여 넣어도 됩니다. 옵션별 추가 금액과 재고를 설정할 수 있어요.
      </p>
      <div className="space-y-3">
        {values.map((value, index) => (
          <div
            key={value.id}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 px-3 py-2"
          >
            <span className="text-xs text-neutral-400">{index + 1}</span>
            <input
              value={value.label}
              onChange={(event) =>
                updateValue(value.id, { label: event.target.value })
              }
              placeholder="예: 화이트"
              className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={value.extraPrice ?? ""}
              onChange={(event) =>
                updateValue(value.id, {
                  extraPrice:
                    event.target.value === ""
                      ? undefined
                      : Number(event.target.value),
                })
              }
              placeholder="추가금"
              className="w-28 rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={value.limitQty ?? ""}
              onChange={(event) =>
                updateValue(value.id, {
                  limitQty:
                    event.target.value === ""
                      ? undefined
                      : Math.max(0, Number(event.target.value)),
                })
              }
              placeholder="재고"
              className="w-24 rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => removeValue(value.id)}
              className="rounded-full border border-neutral-200 px-2 py-1 text-xs text-neutral-500 hover:border-red-400 hover:text-red-500"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addValue}
        className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
      >
        + 옵션 값 추가
      </button>
    </div>
  );
};

type TextOptionDetailsProps = {
  placeholder: string;
  maxLength: number;
  onChange: (details: { placeholder: string; maxLength: number }) => void;
};

const TextOptionDetails: React.FC<TextOptionDetailsProps> = ({
  placeholder,
  maxLength,
  onChange,
}) => (
  <div className="space-y-3 rounded-2xl bg-neutral-50 p-4">
    <p className="text-xs text-neutral-500">
      서포터가 직접 텍스트를 입력하는 옵션입니다. 각인 문구, 배송 메모 등을 받을 때 활용하세요.
    </p>
    <input
      value={placeholder}
      onChange={(event) =>
        onChange({ placeholder: event.target.value, maxLength })
      }
      placeholder="예: 영문 10자 이내 문구를 입력해 주세요."
      className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
    />
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-500">최대 글자 수</span>
      <input
        type="number"
        min={1}
        value={maxLength}
        onChange={(event) =>
          onChange({
            placeholder,
            maxLength: Math.max(1, Number(event.target.value) || 1),
          })
        }
        className="w-24 rounded-xl border border-neutral-200 px-3 py-2 text-sm"
      />
    </div>
  </div>
);

type SetConfiguratorProps = {
  items: RewardSetItem[];
  onChange: (items: RewardSetItem[]) => void;
};

const SetConfigurator: React.FC<SetConfiguratorProps> = ({ items, onChange }) => {
  const addItem = () => {
    if (items.length >= MAX_SET_ITEMS) return;
    onChange([...items, createRewardSetItem(`구성 ${items.length + 1}`)]);
  };

  const updateItem = (id: string, patch: Partial<RewardSetItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const updateGroups = (id: string, groups: RewardOptionGroup[]) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, optionGroups: groups } : item
      )
    );
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500">
        세트에 포함된 각 구성마다 옵션을 받을 수 있습니다. (예: 1번 우산 색상, 2번 우산 색상)
      </p>
      {items.map((item, index) => (
        <div key={item.id} className="space-y-4 rounded-2xl border border-neutral-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-neutral-400">구성 {index + 1}</span>
              <input
                value={item.name}
                onChange={(event) =>
                  updateItem(item.id, { name: event.target.value })
                }
                placeholder="예: 첫 번째 구성"
                className="rounded-xl border border-neutral-200 px-3 py-2 text-sm"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">기본 수량</span>
                <input
                  type="number"
                  min={1}
                  value={item.baseQty}
                  onChange={(event) =>
                    updateItem(item.id, {
                      baseQty: Math.max(1, Number(event.target.value) || 1),
                    })
                  }
                  className="w-20 rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500 hover:border-red-400 hover:text-red-500"
              >
                구성 삭제
              </button>
            )}
          </div>
          <OptionGroupList
            groups={item.optionGroups}
            onChange={(groups) => updateGroups(item.id, groups)}
          />
        </div>
      ))}
      {items.length < MAX_SET_ITEMS && (
        <button
          type="button"
          onClick={addItem}
          className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
        >
          + 구성 추가
        </button>
      )}
    </div>
  );
};
