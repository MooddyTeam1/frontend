import React from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import {
  makerService,
  makerDTOToFormValues,
  type MakerProfileFormValues,
  type MakerCommonFormValues,
  type MakerBusinessFormValues,
} from "../../features/maker/api/makerService";

export const MakerSettingsPage: React.FC = () => {
  const navigate = useNavigate();

  // 한글 설명: 폼 상태를 중첩 구조로 관리 (makerCommon + makerBusiness)
  const [formValues, setFormValues] = React.useState<MakerProfileFormValues>({
    makerType: "INDIVIDUAL",
    makerCommon: {
      name: "",
      establishedAt: null,
      industryType: null,
      representative: null,
      location: null,
      productIntro: null,
      coreCompetencies: null,
      imageUrl: null,
      contactEmail: null,
      contactPhone: null,
      techStackJson: null,
      keywords: null,
    },
    makerBusiness: null,
  });

  // 한글 설명: techStack 배열을 관리하기 위한 로컬 상태 (techStackJson과 동기화)
  const [techStack, setTechStack] = React.useState<string[]>([]);
  const [techInput, setTechInput] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({});

  // 한글 설명: 컴포넌트 마운트 시 메이커 프로필 조회
  React.useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await makerService.getMyProfile();
        // 한글 설명: MakerDTO를 MakerProfileFormValues로 변환
        const formData = makerDTOToFormValues(profile);
        setFormValues(formData);

        // 한글 설명: techStackJson을 파싱하여 techStack 배열로 변환
        if (formData.makerCommon.techStackJson) {
          try {
            const parsed = JSON.parse(formData.makerCommon.techStackJson);
            if (Array.isArray(parsed)) {
              setTechStack(parsed);
            }
          } catch (e) {
            console.warn("techStackJson 파싱 실패:", e);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "프로필을 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // 한글 설명: techStack 배열이 변경되면 techStackJson도 업데이트
  React.useEffect(() => {
    const techStackJson =
      techStack.length > 0 ? JSON.stringify(techStack) : null;
    setFormValues((prev) => ({
      ...prev,
      makerCommon: {
        ...prev.makerCommon,
        techStackJson,
      },
    }));
  }, [techStack]);

  // 한글 설명: 기술 스택 추가
  const addTech = () => {
    const v = techInput.trim();
    if (!v) return;
    if (techStack.includes(v)) return;
    setTechStack((prev) => [...prev, v]);
    setTechInput("");
  };

  // 한글 설명: 기술 스택 제거
  const removeTech = (v: string) => {
    setTechStack((prev) => prev.filter((x) => x !== v));
  };

  // 한글 설명: makerType 변경 핸들러
  const handleMakerTypeChange = (newType: "INDIVIDUAL" | "BUSINESS") => {
    setFormValues((prev) => {
      if (newType === "INDIVIDUAL") {
        // 한글 설명: 개인으로 변경 시 사업자 필드 초기화
        return {
          ...prev,
          makerType: "INDIVIDUAL",
          makerBusiness: null,
        };
      } else {
        // 한글 설명: 사업자로 변경 시 사업자 필드 초기화 (기존 값이 있으면 유지)
        return {
          ...prev,
          makerType: "BUSINESS",
          makerBusiness: prev.makerBusiness || {
            businessName: "",
            businessNumber: "",
            businessItem: null,
            onlineSalesRegistrationNo: null,
          },
        };
      }
    });
    // 한글 설명: 유효성 검사 에러 초기화
    setValidationErrors({});
  };

  // 한글 설명: 공통 필드 업데이트 핸들러
  const updateMakerCommon = (
    field: keyof MakerCommonFormValues,
    value: string | null
  ) => {
    setFormValues((prev) => ({
      ...prev,
      makerCommon: {
        ...prev.makerCommon,
        [field]: value,
      },
    }));
    // 한글 설명: 유효성 검사 에러 초기화
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // 한글 설명: 사업자 필드 업데이트 핸들러
  const updateMakerBusiness = (
    field: keyof MakerBusinessFormValues,
    value: string | null
  ) => {
    setFormValues((prev) => {
      if (!prev.makerBusiness) {
        return prev;
      }
      return {
        ...prev,
        makerBusiness: {
          ...prev.makerBusiness,
          [field]: value ?? "",
        },
      };
    });
    // 한글 설명: 유효성 검사 에러 초기화
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // 한글 설명: 유효성 검사
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 한글 설명: 공통 필수 필드 검증
    if (!formValues.makerCommon.name.trim()) {
      errors["makerCommon.name"] = "메이커 이름을 입력해 주세요.";
    }
    if (!formValues.makerCommon.contactEmail?.trim()) {
      errors["makerCommon.contactEmail"] = "이메일을 입력해 주세요.";
    }

    // 한글 설명: 사업자 필수 필드 검증
    if (formValues.makerType === "BUSINESS") {
      if (!formValues.makerBusiness?.businessName.trim()) {
        errors["makerBusiness.businessName"] = "사업자 상호명을 입력해 주세요.";
      }
      if (!formValues.makerBusiness?.businessNumber.trim()) {
        errors["makerBusiness.businessNumber"] =
          "사업자등록번호를 입력해 주세요.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 한글 설명: 변경 사항 저장 핸들러
  const handleSave = async () => {
    // 한글 설명: 유효성 검사
    if (!validateForm()) {
      setError("입력한 정보를 확인해 주세요.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      // 한글 설명: formValues를 직접 사용하여 업데이트
      const updated = await makerService.updateMyProfileFromForm(formValues);
      // 한글 설명: 업데이트된 프로필을 formValues로 변환하여 상태 업데이트
      const updatedFormValues = makerDTOToFormValues(updated);
      setFormValues(updatedFormValues);

      // 한글 설명: techStack도 업데이트
      if (updatedFormValues.makerCommon.techStackJson) {
        try {
          const parsed = JSON.parse(
            updatedFormValues.makerCommon.techStackJson
          );
          if (Array.isArray(parsed)) {
            setTechStack(parsed);
          }
        } catch (e) {
          console.warn("techStackJson 파싱 실패:", e);
        }
      }

      // 한글 설명: 저장 성공 후 프로필 페이지로 이동
      setTimeout(() => {
        navigate("/profile/maker");
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "프로필 저장에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  // 한글 설명: 취소 핸들러
  const handleCancel = () => {
    navigate("/profile/maker");
  };

  return (
    <Container>
      {/* 한글 설명: 메이커 프로필 설정 페이지. 기본정보, 연락처, 소개/브랜딩, 기술스택, 키워드 구성 */}
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col gap-6 py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900">
            메이커 프로필
          </h1>
          <p className="text-sm text-neutral-500">
            프로젝트 공개 시 노출되는 메이커 정보와 브랜딩을 관리합니다.
          </p>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-neutral-200 p-12 text-center text-sm text-neutral-500">
            프로필을 불러오는 중입니다...
          </div>
        ) : (
          <section className="space-y-4 rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
            {/* 메이커 유형 선택 */}
            <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <label className="text-xs font-semibold text-neutral-900">
                메이커 유형 *
              </label>
              <div className="flex gap-6">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="makerType"
                    value="INDIVIDUAL"
                    checked={formValues.makerType === "INDIVIDUAL"}
                    onChange={() => handleMakerTypeChange("INDIVIDUAL")}
                    className="h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span className="text-sm text-neutral-700">개인</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="makerType"
                    value="BUSINESS"
                    checked={formValues.makerType === "BUSINESS"}
                    onChange={() => handleMakerTypeChange("BUSINESS")}
                    className="h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span className="text-sm text-neutral-700">사업자</span>
                </label>
              </div>
              <p className="text-xs text-neutral-500">
                {formValues.makerType === "INDIVIDUAL"
                  ? "개인 메이커로 등록됩니다. 사업자등록번호가 필요하지 않습니다."
                  : "사업자 메이커로 등록됩니다. 사업자등록번호와 사업자 상호명이 필요합니다."}
              </p>
            </div>

            {/* 기본 정보 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500">
                  메이커 이름 *
                </label>
                <input
                  className={`w-full rounded-xl border px-4 py-2 ${
                    validationErrors["makerCommon.name"]
                      ? "border-red-300"
                      : "border-neutral-200"
                  }`}
                  placeholder="메이커 이름"
                  value={formValues.makerCommon.name}
                  onChange={(e) =>
                    updateMakerCommon("name", e.target.value || null)
                  }
                />
                {validationErrors["makerCommon.name"] && (
                  <p className="text-xs text-red-600">
                    {validationErrors["makerCommon.name"]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500">
                  설립일
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  value={formValues.makerCommon.establishedAt ?? ""}
                  onChange={(e) =>
                    updateMakerCommon("establishedAt", e.target.value || null)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500">
                  업종
                </label>
                <input
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  placeholder="예: 스마트 하드웨어"
                  value={formValues.makerCommon.industryType ?? ""}
                  onChange={(e) =>
                    updateMakerCommon("industryType", e.target.value || null)
                  }
                />
              </div>
              {/* 한글 설명: 사업자일 때만 표시되는 필드 */}
              {formValues.makerType === "BUSINESS" &&
                formValues.makerBusiness && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500">
                        사업자 상호명 *
                      </label>
                      <input
                        className={`w-full rounded-xl border px-4 py-2 ${
                          validationErrors["makerBusiness.businessName"]
                            ? "border-red-300"
                            : "border-neutral-200"
                        }`}
                        placeholder="사업자 상호명"
                        value={formValues.makerBusiness.businessName}
                        onChange={(e) =>
                          updateMakerBusiness("businessName", e.target.value)
                        }
                      />
                      {validationErrors["makerBusiness.businessName"] && (
                        <p className="text-xs text-red-600">
                          {validationErrors["makerBusiness.businessName"]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500">
                        사업자번호 *
                      </label>
                      <input
                        className={`w-full rounded-xl border px-4 py-2 ${
                          validationErrors["makerBusiness.businessNumber"]
                            ? "border-red-300"
                            : "border-neutral-200"
                        }`}
                        placeholder="000-00-00000"
                        value={formValues.makerBusiness.businessNumber}
                        onChange={(e) =>
                          updateMakerBusiness("businessNumber", e.target.value)
                        }
                      />
                      {validationErrors["makerBusiness.businessNumber"] && (
                        <p className="text-xs text-red-600">
                          {validationErrors["makerBusiness.businessNumber"]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500">
                        업태
                      </label>
                      <input
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                        placeholder="예: 제조업, 도매 및 소매업"
                        value={formValues.makerBusiness.businessItem ?? ""}
                        onChange={(e) =>
                          updateMakerBusiness("businessItem", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500">
                        통신판매업 신고번호
                      </label>
                      <input
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                        placeholder="제 0000-서울강남-0000호"
                        value={
                          formValues.makerBusiness.onlineSalesRegistrationNo ??
                          ""
                        }
                        onChange={(e) =>
                          updateMakerBusiness(
                            "onlineSalesRegistrationNo",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </>
                )}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500">
                  대표자명
                </label>
                <input
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  placeholder="홍길동"
                  value={formValues.makerCommon.representative ?? ""}
                  onChange={(e) =>
                    updateMakerCommon("representative", e.target.value || null)
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-medium text-neutral-500">
                  소재지
                </label>
                <input
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  placeholder="시/군/구 단위까지 입력"
                  value={formValues.makerCommon.location ?? ""}
                  onChange={(e) =>
                    updateMakerCommon("location", e.target.value || null)
                  }
                />
              </div>
            </div>

            {/* 소개/브랜딩 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-medium text-neutral-500">
                  제품/서비스 소개
                </label>
                <textarea
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  rows={3}
                  placeholder="우리의 제품/서비스를 소개하세요"
                  value={formValues.makerCommon.productIntro ?? ""}
                  onChange={(e) =>
                    updateMakerCommon("productIntro", e.target.value || null)
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-medium text-neutral-500">
                  핵심 역량
                </label>
                <textarea
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  rows={3}
                  placeholder="핵심 기술/역량을 입력하세요"
                  value={formValues.makerCommon.coreCompetencies ?? ""}
                  onChange={(e) =>
                    updateMakerCommon(
                      "coreCompetencies",
                      e.target.value || null
                    )
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-medium text-neutral-500">
                  브랜드 이미지 URL
                </label>
                <input
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  placeholder="https://..."
                  value={formValues.makerCommon.imageUrl ?? ""}
                  onChange={(e) =>
                    updateMakerCommon("imageUrl", e.target.value || null)
                  }
                />
              </div>
            </div>

            {/* 연락처 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500">
                  이메일 *
                </label>
                <input
                  className={`w-full rounded-xl border px-4 py-2 ${
                    validationErrors["makerCommon.contactEmail"]
                      ? "border-red-300"
                      : "border-neutral-200"
                  }`}
                  placeholder="contact@example.com"
                  value={formValues.makerCommon.contactEmail ?? ""}
                  onChange={(e) =>
                    updateMakerCommon("contactEmail", e.target.value || null)
                  }
                />
                {validationErrors["makerCommon.contactEmail"] && (
                  <p className="text-xs text-red-600">
                    {validationErrors["makerCommon.contactEmail"]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500">
                  연락처
                </label>
                <input
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                  placeholder="010-0000-0000"
                  value={formValues.makerCommon.contactPhone ?? ""}
                  onChange={(e) =>
                    updateMakerCommon("contactPhone", e.target.value || null)
                  }
                />
              </div>
            </div>

            {/* 기술 스택 (태그 입력) */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">
                활용 기술
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-neutral-200 px-4 py-2"
                  placeholder="React, Node.js, AWS ..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTech(t)}
                      className="text-neutral-400 hover:text-neutral-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 키워드 입력 (문자열) */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">
                키워드
              </label>
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-2"
                placeholder="친환경,소셜임팩트,B2B (쉼표로 구분)"
                value={formValues.makerCommon.keywords ?? ""}
                onChange={(e) =>
                  updateMakerCommon("keywords", e.target.value || null)
                }
              />
              <p className="text-xs text-neutral-400">
                키워드를 쉼표로 구분하여 입력하세요.
              </p>
            </div>

            {/* 액션 */}
            <div className="flex flex-wrap gap-2">
              {error && (
                <div className="w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                  {error}
                </div>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-full border border-neutral-900 px-4 py-2 font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white disabled:opacity-50"
              >
                {saving ? "저장 중..." : "변경 사항 저장"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-full border border-neutral-200 px-4 py-2 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-50"
              >
                취소
              </button>
            </div>
          </section>
        )}
      </div>
    </Container>
  );
};
