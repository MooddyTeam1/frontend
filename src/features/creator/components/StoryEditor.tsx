import React from "react";

type StoryEditorProps = {
  value: string;
  onChange: (next: string) => void;
  maxChars?: number;
};

type Tab = "edit" | "preview";

const useDebounced = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay = 300
) => {
  const timerRef = React.useRef<ReturnType<typeof window.setTimeout> | null>(
    null
  );

  return React.useCallback(
    (...args: Args) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );
};

type ListBuffer = {
  type: "ul";
  items: string[];
};

const headingClassName = (level: number) => {
  switch (level) {
    case 1:
      return "text-2xl font-semibold text-neutral-900";
    case 2:
      return "text-xl font-semibold text-neutral-900";
    case 3:
      return "text-lg font-semibold text-neutral-900";
    default:
      return "text-base font-semibold text-neutral-900";
  }
};

const renderInline = (input: string): React.ReactNode[] => {
  if (!input) return [""];
  const segments: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let inlineIndex = 0;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push(input.slice(lastIndex, match.index));
    }

    const [token] = match;
    const bold = match[1];
    const italic = match[2];
    const code = match[3];
    const linkText = match[4];
    const linkUrl = match[5];

    if (bold) {
      segments.push(
        <strong key={`strong-${inlineIndex++}`} className="font-semibold">
          {renderInline(bold)}
        </strong>
      );
    } else if (italic) {
      segments.push(
        <em key={`em-${inlineIndex++}`} className="italic">
          {renderInline(italic)}
        </em>
      );
    } else if (code) {
      segments.push(
        <code
          key={`code-${inlineIndex++}`}
          className="rounded bg-neutral-200 px-1 py-[1px] text-[12px] text-neutral-700"
        >
          {code}
        </code>
      );
    } else if (linkText && linkUrl) {
      segments.push(
        <a
          key={`link-${inlineIndex++}`}
          href={linkUrl}
          className="text-indigo-600 underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          {linkText}
        </a>
      );
    } else {
      segments.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    segments.push(input.slice(lastIndex));
  }

  return segments.length > 0 ? segments : [input];
};

const renderMarkdown = (markdown: string): React.ReactNode[] => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: ListBuffer | null = null;
  let key = 0;

  const flushList = () => {
    if (!listBuffer || listBuffer.items.length === 0) return;
    const items = listBuffer.items.map((item, index) => (
      <li
        key={`li-${key}-${index}`}
        className="leading-relaxed text-neutral-700"
      >
        {renderInline(item)}
      </li>
    ));
    elements.push(
      <ul key={`ul-${key++}`} className="ml-5 list-disc space-y-1">
        {items}
      </ul>
    );
    listBuffer = null;
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();
    if (line.trim() === "") {
      flushList();
      return;
    }

    const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      flushList();
      const [, alt = "image", src] = imageMatch;
      elements.push(
        <figure
          key={`img-${key++}`}
          className="overflow-hidden rounded-2xl border border-neutral-200"
        >
          <img src={src} alt={alt || "story image"} className="w-full" />
        </figure>
      );
      return;
    }

    // 한 줄이 heading(예: "# 제목", "## 소제목") 패턴인지 검사
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);

    if (headingMatch) {
      // 이전에 진행 중이던 리스트(<ul>/<ol>)가 있다면 먼저 elements에 플러시해주는 역할
      // (기존 코드에 이미 있는 함수일 거라 그대로 사용)
      flushList();

      // "#", "##", "###" 의 # 개수에 따라 heading 레벨 계산
      // 레벨은 최대 4단계까지만 사용하도록 제한 (h1 ~ h4)
      const level = Math.min(headingMatch[1].length, 4) as 1 | 2 | 3 | 4;

      // 실제 텍스트 내용 (예: "# 제목" 에서 "제목" 부분)
      const content = headingMatch[2];

      // level 숫자를 태그 문자열로 변환 ("h1" | "h2" | "h3" | "h4")
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";

      // JSX에서 <Tag>...</Tag> 식으로 쓰면 타입 문제가 생기므로
      // React.createElement 로 직접 Element를 생성
      elements.push(
        React.createElement(
          Tag,
          {
            // key는 고유하게 만들어 주기 위해 증가하는 숫자를 사용
            key: `heading-${key++}`,
            // 레벨별로 다른 스타일을 적용하는 함수 (기존 코드 재사용)
            className: headingClassName(level),
          },
          // 텍스트 안에 강조/링크 등 인라인 처리가 필요할 경우 기존 함수 호출
          renderInline(content)
        )
      );

      // 이 줄은 heading으로 처리 끝났으니, 나머지 조건(if 문들)로 내려가지 않고 다음 줄로 넘어가게 함
      return;
    }

    if (line === "---") {
      flushList();
      elements.push(<hr key={`hr-${key++}`} className="border-neutral-200" />);
      return;
    }

    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      if (!listBuffer) {
        listBuffer = { type: "ul", items: [] };
      }
      listBuffer.items.push(listMatch[1]);
      return;
    }

    flushList();
    elements.push(
      <p key={`p-${key++}`} className="leading-relaxed text-neutral-700">
        {renderInline(line)}
      </p>
    );
  });

  flushList();
  return elements;
};

const MarkdownPreview: React.FC<{ text: string }> = ({ text }) => {
  if (text.trim() === "") {
    return <p className="text-neutral-400">(작성된 내용이 없습니다)</p>;
  }

  return <div className="space-y-4">{renderMarkdown(text)}</div>;
};

export const StoryEditor: React.FC<StoryEditorProps> = ({
  value,
  onChange,
  maxChars = 20000,
}) => {
  const [text, setText] = React.useState<string>(value || "");
  const [tab, setTab] = React.useState<Tab>("edit");
  const debouncedPropagate = useDebounced(onChange, 300);

  React.useEffect(() => {
    setText(value || "");
  }, [value]);

  React.useEffect(() => {
    debouncedPropagate(text);
  }, [text, debouncedPropagate]);

  const insertSnippet = (snippet: string) => {
    setText((prev) => (prev ? `${prev}\n\n${snippet}` : snippet));
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    Array.from(items).forEach((item) => {
      if (item.kind !== "file") {
        return;
      }

      const file = item.getAsFile();
      if (!file) {
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("이미지는 5MB 이하 파일만 업로드할 수 있습니다.");
        return;
      }

      const url = URL.createObjectURL(file);
      insertSnippet(`![image](${url})`);
      event.preventDefault();
    });
  };

  const chars = text.length;
  const over = chars > maxChars;

  return (
    <div className="rounded-xl border border-neutral-200">
      <div className="flex items-center justify-between gap-2 border-b border-neutral-200 px-3 py-2">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() =>
              insertSnippet(
                "## 소개\n프로젝트 혹은 제품의 핵심 가치를 한 문단으로 정리해 주세요."
              )
            }
            className="rounded border border-neutral-200 px-2 py-1 hover:border-neutral-900 hover:text-neutral-900"
          >
            소개
          </button>
          <button
            type="button"
            onClick={() =>
              insertSnippet(
                "## 특징\n- 주요 장점 1\n- 주요 장점 2\n- 주요 장점 3"
              )
            }
            className="rounded border border-neutral-200 px-2 py-1 hover:border-neutral-900 hover:text-neutral-900"
          >
            특징
          </button>
          <button
            type="button"
            onClick={() =>
              insertSnippet(
                "## 제작·배송 계획\n제작 일정, 검수 절차, 배송 계획을 단계별로 작성해 주세요."
              )
            }
            className="rounded border border-neutral-200 px-2 py-1 hover:border-neutral-900 hover:text-neutral-900"
          >
            제작·배송
          </button>
          <button
            type="button"
            onClick={() =>
              insertSnippet(
                "## 위험 요소와 대응\n발생 가능한 리스크와 대응 방안을 안내해 주세요."
              )
            }
            className="rounded border border-neutral-200 px-2 py-1 hover:border-neutral-900 hover:text-neutral-900"
          >
            위험 요소
          </button>

          <label className="cursor-pointer rounded border border-neutral-200 px-2 py-1 text-xs hover:border-neutral-900 hover:text-neutral-900">
            이미지 추가
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;

                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                  alert("이미지는 5MB 이하 파일만 업로드할 수 있습니다.");
                  event.target.value = "";
                  return;
                }

                const url = URL.createObjectURL(file);
                insertSnippet(`![image](${url})`);
                event.target.value = "";
              }}
            />
          </label>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className={over ? "text-red-600" : undefined}>
            {chars.toLocaleString()} / {maxChars.toLocaleString()}
          </span>
          <div className="ml-2 inline-flex overflow-hidden rounded-full border border-neutral-200">
            <button
              type="button"
              onClick={() => setTab("edit")}
              className={`px-2 py-1 text-xs ${
                tab === "edit"
                  ? "bg-neutral-900 text-white"
                  : "hover:text-neutral-900"
              }`}
            >
              작성
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`px-2 py-1 text-xs ${
                tab === "preview"
                  ? "bg-neutral-900 text-white"
                  : "hover:text-neutral-900"
              }`}
            >
              미리보기
            </button>
          </div>
        </div>
      </div>

      {tab === "edit" ? (
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onPaste={handlePaste}
          rows={12}
          placeholder={
            "# 프로젝트 스토리를 작성해주세요 (Markdown 지원)\n\n" +
            "## 소개\n...\n\n" +
            "## 특징\n- ...\n\n" +
            "## 제작·배송 계획\n...\n\n" +
            "## 위험 요소와 대응\n..."
          }
          className="h-64 w-full resize-y rounded-b-xl p-3 text-sm text-neutral-800 outline-none"
        />
      ) : (
        <div className="max-h-[28rem] overflow-auto rounded-b-xl bg-neutral-50 p-4 text-sm">
          <MarkdownPreview text={text} />
        </div>
      )}
    </div>
  );
};
