// 한글 설명: Toast UI Viewer를 사용한 스토리 뷰어 컴포넌트
import React, { useEffect, useRef } from "react";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";

type StoryViewerProps = {
  markdown: string;
  className?: string;
};

/**
 * 한글 설명: 마크다운 형식의 스토리를 Toast UI Viewer로 표시하는 컴포넌트
 * 프로젝트 만들기 스토리 에디터와 동일한 라이브러리를 사용하여 일관된 렌더링 제공
 */
export const StoryViewer: React.FC<StoryViewerProps> = ({
  markdown,
  className = "",
}) => {
  // 한글 설명: Toast UI Viewer 인스턴스 참조
  const viewerRef = useRef<Viewer>(null);

  // 한글 설명: markdown이 변경되면 Viewer 내용 업데이트
  useEffect(() => {
    if (viewerRef.current && markdown) {
      viewerRef.current.getInstance().setMarkdown(markdown);
    }
  }, [markdown]);

  return (
    <div className={className}>
      {/* 한글 설명: Toast UI Viewer - 읽기 전용 마크다운 뷰어 */}
      <Viewer
        ref={viewerRef}
        initialValue={markdown || ""}
      />
    </div>
  );
};

