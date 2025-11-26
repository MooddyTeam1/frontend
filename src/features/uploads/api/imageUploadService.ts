// 한글 설명: 공용 이미지 업로드 API 서비스. 단일 및 다중 이미지 업로드를 담당한다.
import api from "../../../services/api";

export interface ImageUploadResponseDTO {
  url: string;
  originalName: string;
  size: number;
}

// 한글 설명: 단일 이미지 업로드 (프로필 이미지 등)
export const uploadImage = async (
  file: File
): Promise<ImageUploadResponseDTO> => {
  const formData = new FormData();
  formData.append("file", file);

  console.log("[imageUploadService] POST /api/uploads/images 요청", {
    name: file.name,
    size: file.size,
    type: file.type,
  });

  const { data } = await api.post<ImageUploadResponseDTO>(
    "/api/uploads/images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log("[imageUploadService] POST /api/uploads/images 응답", data);
  return data;
};

// 한글 설명: 다중 이미지 업로드 (프로젝트 갤러리 등)
export const uploadImages = async (
  files: File[]
): Promise<ImageUploadResponseDTO[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  console.log("[imageUploadService] POST /api/uploads/images/batch 요청", {
    fileCount: files.length,
    files: files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    })),
  });

  const { data } = await api.post<ImageUploadResponseDTO[]>(
    "/api/uploads/images/batch",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log("[imageUploadService] POST /api/uploads/images/batch 응답", data);
  return data;
};

