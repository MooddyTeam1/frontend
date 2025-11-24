// 한글 설명: Toast UI Editor를 사용한 스토리 에디터 컴포넌트
import React, { useEffect, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { uploadImage } from "../../uploads/api/imageUploadService";
import imageCompression from "browser-image-compression";

type StoryEditorProps = {
  value: string;
  onChange: (next: string) => void;
  maxChars?: number;
};

export const StoryEditor: React.FC<StoryEditorProps> = ({
  value,
  onChange,
  maxChars = 20000,
}) => {
  // 한글 설명: Toast UI Editor 인스턴스 참조
  const editorRef = useRef<Editor>(null);

  // 한글 설명: 외부에서 value가 변경되면 에디터 내용 업데이트
  useEffect(() => {
    if (
      editorRef.current &&
      value !== editorRef.current.getInstance().getMarkdown()
    ) {
      editorRef.current.getInstance().setMarkdown(value || "");
    }
  }, [value]);

  // 한글 설명: 에디터 내용 변경 핸들러
  const handleChange = () => {
    if (editorRef.current) {
      const markdown = editorRef.current.getInstance().getMarkdown();
      onChange(markdown);
    }
  };

  // 한글 설명: 템플릿 삽입 헬퍼 함수
  const insertTemplate = (template: string) => {
    if (editorRef.current) {
      const editor = editorRef.current.getInstance();
      const currentMarkdown = editor.getMarkdown();
      const newMarkdown = currentMarkdown
        ? `${currentMarkdown}\n\n${template}`
        : template;
      editor.setMarkdown(newMarkdown);
      onChange(newMarkdown);
    }
  };

  // 한글 설명: 이미지 압축 유틸 함수
  const compressImage = async (file: File): Promise<File> => {
    const maxSizeMB = 8; // 한글 설명: 최대 파일 크기 8MB
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    // 한글 설명: 8MB 이하면 압축하지 않고 그대로 반환
    if (file.size <= maxSizeBytes) {
      return file;
    }

    // 한글 설명: 8MB 초과 시 압축
    const options = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: 1920, // 한글 설명: 최대 너비/높이 1920px
      useWebWorker: true, // 한글 설명: 웹 워커 사용으로 메인 스레드 블로킹 방지
      fileType: file.type, // 한글 설명: 원본 파일 타입 유지
    };

    try {
      console.log(
        `[이미지 압축] 시작: ${(file.size / 1024 / 1024).toFixed(2)}MB`
      );
      const compressedFile = await imageCompression(file, options);
      console.log(
        `[이미지 압축] 완료: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB (${((1 - compressedFile.size / file.size) * 100).toFixed(1)}% 감소)`
      );
      return compressedFile;
    } catch (error) {
      console.error("이미지 압축 실패:", error);
      // 한글 설명: 압축 실패 시 원본 파일 반환 (업로드는 시도)
      return file;
    }
  };

  // 한글 설명: 이미지 업로드 핸들러 (Toast UI Editor의 addImageBlobHook 사용)
  const handleImageBlobHook = async (
    blob: Blob | File,
    callback: (url: string, altText?: string) => void
  ) => {
    const file = blob as File;
    const maxSizeMB = 8; // 한글 설명: 최대 파일 크기 8MB
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    // 한글 설명: 8MB 초과 시 압축 시도
    let fileToUpload = file;
    if (file.size > maxSizeBytes) {
      try {
        fileToUpload = await compressImage(file);
      } catch (error) {
        console.error("이미지 압축 중 오류:", error);
        alert("이미지 압축에 실패했습니다. 더 작은 이미지를 사용해주세요.");
        return;
      }
    }

    try {
      // 한글 설명: 서버에 이미지 업로드 (압축된 파일 또는 원본)
      const response = await uploadImage(fileToUpload);
      callback(response.url, file.name);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      const axiosError = error as {
        response?: {
          data?: {
            message?: string;
            code?: string;
            status?: number;
          };
          status?: number;
        };
        message?: string;
      };
      // 한글 설명: 백엔드 에러 응답에서 메시지 추출
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "이미지 업로드에 실패했습니다.";
      const statusCode =
        axiosError.response?.status || axiosError.response?.data?.status;
      console.error("  - HTTP 상태 코드:", statusCode);
      console.error("  - 에러 메시지:", errorMessage);
      alert(
        `이미지 업로드 실패: ${errorMessage}${statusCode ? ` (${statusCode})` : ""}`
      );
    }
  };

  // 한글 설명: 현재 마크다운 길이 계산
  const currentLength = value?.length || 0;
  const isOverLimit = currentLength > maxChars;

  return (
    <div className="space-y-3">
      {/* 한글 설명: 템플릿 버튼 및 이미지 업로드 */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
        <button
          type="button"
          onClick={() =>
            insertTemplate(
              "## 소개\n프로젝트 혹은 제품의 핵심 가치를 한 문단으로 정리해 주세요."
            )
          }
          className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs hover:border-neutral-900 hover:text-neutral-900"
        >
          소개
        </button>
        <button
          type="button"
          onClick={() =>
            insertTemplate(
              "## 특징\n- 주요 장점 1\n- 주요 장점 2\n- 주요 장점 3"
            )
          }
          className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs hover:border-neutral-900 hover:text-neutral-900"
        >
          특징
        </button>
        <button
          type="button"
          onClick={() =>
            insertTemplate(
              "## 제작·배송 계획\n제작 일정, 검수 절차, 배송 계획을 단계별로 작성해 주세요."
            )
          }
          className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs hover:border-neutral-900 hover:text-neutral-900"
        >
          제작·배송
        </button>
        <button
          type="button"
          onClick={() =>
            insertTemplate(
              "## 위험 요소와 대응\n발생 가능한 리스크와 대응 방안을 안내해 주세요."
            )
          }
          className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs hover:border-neutral-900 hover:text-neutral-900"
        >
          위험 요소
        </button>
        <label className="cursor-pointer rounded border border-neutral-200 bg-white px-2 py-1 text-xs hover:border-neutral-900 hover:text-neutral-900">
          이미지 추가
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (file && editorRef.current) {
                const maxSizeMB = 8; // 한글 설명: 최대 파일 크기 8MB
                const maxSizeBytes = maxSizeMB * 1024 * 1024;

                // 한글 설명: 8MB 초과 시 압축 시도
                let fileToUpload = file;
                if (file.size > maxSizeBytes) {
                  try {
                    fileToUpload = await compressImage(file);
                  } catch (error) {
                    console.error("이미지 압축 중 오류:", error);
                    alert(
                      "이미지 압축에 실패했습니다. 더 작은 이미지를 사용해주세요."
                    );
                    event.target.value = "";
                    return;
                  }
                }

                try {
                  // 한글 설명: 서버에 이미지 업로드 (압축된 파일 또는 원본)
                  const response = await uploadImage(fileToUpload);
                  const editor = editorRef.current.getInstance();
                  // 한글 설명: 마크다운 모드에서는 insertText를 사용하여 이미지 마크다운 삽입
                  const imageMarkdown = `![${file.name}](${response.url})`;
                  editor.insertText(imageMarkdown);
                  // 한글 설명: onChange 트리거를 위해 마크다운 가져오기
                  const markdown = editor.getMarkdown();
                  onChange(markdown);
                } catch (error) {
                  console.error("이미지 업로드 실패:", error);
                  const axiosError = error as {
                    response?: {
                      data?: {
                        message?: string;
                        code?: string;
                        status?: number;
                      };
                      status?: number;
                    };
                    message?: string;
                  };
                  // 한글 설명: 백엔드 에러 응답에서 메시지 추출
                  const errorMessage =
                    axiosError.response?.data?.message ||
                    axiosError.message ||
                    "이미지 업로드에 실패했습니다.";
                  const statusCode =
                    axiosError.response?.status ||
                    axiosError.response?.data?.status;
                  console.error("  - HTTP 상태 코드:", statusCode);
                  console.error("  - 에러 메시지:", errorMessage);
                  alert(
                    `이미지 업로드 실패: ${errorMessage}${statusCode ? ` (${statusCode})` : ""}`
                  );
                } finally {
                  event.target.value = "";
                }
              }
            }}
          />
        </label>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className={isOverLimit ? "text-red-600" : "text-neutral-500"}>
            {currentLength.toLocaleString()} / {maxChars.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 한글 설명: Toast UI Editor */}
      <div className="rounded-xl border border-neutral-200 overflow-hidden">
        <Editor
          ref={editorRef}
          initialValue={value || ""}
          previewStyle="tab" // 한글 설명: 위아래 분할 미리보기 (tab: 탭 전환, vertical: 동시 표시)
          height="600px" // 한글 설명: 에디터 높이
          initialEditType="markdown" // 한글 설명: 마크다운 모드로 시작
          useCommandShortcut={true} // 한글 설명: 단축키 사용
          onChange={handleChange}
          hooks={{
            // 한글 설명: 이미지 붙여넣기/드래그앤드롭 시 자동으로 호출되는 훅
            addImageBlobHook: handleImageBlobHook,
          }}
          placeholder="# 프로젝트 스토리를 작성해주세요 (Markdown 지원)

## 소개
...

## 특징
- ...

## 제작·배송 계획
...

## 위험 요소와 대응
..."
        />
      </div>
    </div>
  );
};
