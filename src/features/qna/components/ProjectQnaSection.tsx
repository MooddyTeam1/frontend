// ?œê? ?¤ëª…: ?œí¬?°ìš© ?„ë¡œ?íŠ¸ Q&A ?¹ì…˜ ì»´í¬?ŒíŠ¸
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../auth/stores/authStore";
import {
  createQuestion,
  getMyQnaList,
  getQnaListForMaker,
  getPublicQnaList,
} from "../api/qnaApi";
import type {
  ProjectQnaResponse,
  ProjectQnaCreateRequest,
} from "../types";

type ProjectQnaSectionProps = {
  projectId: number;
  // ?œê? ?¤ëª…: ?„ë¡œ?íŠ¸ ?Œìœ ?ì¸ì§€ ?¬ë? (?Œìœ ?ë©´ ë¬¸ì˜ ?‘ì„± ë¶ˆê?, ëª©ë¡ë§?ì¡°íšŒ)
  isOwner?: boolean;
};

/**
 * ?œê? ?¤ëª…: ?„ë¡œ?íŠ¸ ?ì„¸ ?˜ì´ì§€ ?˜ë‹¨??ë¶™ëŠ” Q&A ?¹ì…˜
 * ?œí¬?°ê? ì§ˆë¬¸???‘ì„±?˜ê³ , ?ì‹ ???¨ê¸´ Q&A ëª©ë¡??ë³????ˆìŒ
 */
export const ProjectQnaSection: React.FC<ProjectQnaSectionProps> = ({
  projectId,
  isOwner = false,
}) => {
  // ?œê? ?¤ëª…: ë¡œê·¸???íƒœ ?•ì¸
  const { user } = useAuthStore();
  
  // ?œê? ?¤ëª…: Q&A ëª©ë¡ ?íƒœ
  const [qnaList, setQnaList] = useState<ProjectQnaResponse[]>([]);
  
  // ?œê? ?¤ëª…: ë¡œë”© ?íƒœ
  const [loading, setLoading] = useState(false);
  
  // ?œê? ?¤ëª…: ?ëŸ¬ ?íƒœ
  const [error, setError] = useState<string | null>(null);
  
  // ?œê? ?¤ëª…: ì§ˆë¬¸ ?‘ì„± ???íƒœ
  const [questionForm, setQuestionForm] = useState({
    question: "",
    isPrivate: true, // ?œê? ?¤ëª…: ê¸°ë³¸ê°’ì? ë¹„ê³µê°?
  });
  
  // ?œê? ?¤ëª…: ì§ˆë¬¸ ?‘ì„± ì¤??íƒœ
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * ?œê? ?¤ëª…: Q&A ëª©ë¡ ë¶ˆëŸ¬?¤ê¸°
   * ?Œìœ ?ì¸ ê²½ìš° ëª¨ë“  ?œí¬?°ì˜ ë¬¸ì˜ë¥? ?œí¬?°ì¸ ê²½ìš° ?ì‹ ??ë¬¸ì˜ë§?ì¡°íšŒ
   */
  const fetchMyQnaList = async () => {
    if (!user) {\r\n      try {\r\n        setLoading(true);\r\n        setError(null);\r\n        const publicList = await getPublicQnaList(projectId);\r\n        setQnaList(Array.isArray(publicList) ? publicList : []);\r\n      } catch (err) {\r\n        console.error('°ø°³ Q&A ¸ñ·Ï Á¶È¸ ½ÇÆĞ:', err);\r\n        setError('Q&A¸¦ ºÒ·¯¿ÀÁö ¸øÇß½À´Ï´Ù.');\r\n        setQnaList([]);\r\n      } finally {\r\n        setLoading(false);\r\n      }\r\n      return;\r\n    }

    try {
      setLoading(true);
      setError(null);
      // ?œê? ?¤ëª…: ?Œìœ ?ì¸ ê²½ìš° ë©”ì´ì»¤ìš© API ?¬ìš©, ê·??¸ì—???œí¬?°ìš© API ?¬ìš©
      const response = isOwner
        ? await getQnaListForMaker(projectId)
        : await getMyQnaList(projectId);
      
      // ?œê? ?¤ëª…: API ?‘ë‹µ??ë°°ì—´?¸ì? ?•ì¸?˜ê³ , ë°°ì—´???„ë‹ˆë©?ë¹?ë°°ì—´ë¡?ì²˜ë¦¬
      setQnaList(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Q&A ëª©ë¡ ì¡°íšŒ ?¤íŒ¨:", err);
      setError("Q&A ëª©ë¡??ë¶ˆëŸ¬?¤ëŠ” ?„ì¤‘ ë¬¸ì œê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.");
      setQnaList([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ?œê? ?¤ëª…: ì»´í¬?ŒíŠ¸ ë§ˆìš´????ë°?ë¡œê·¸???íƒœ ë³€ê²???Q&A ëª©ë¡ ë¶ˆëŸ¬?¤ê¸°
   */
  useEffect(() => {
    fetchMyQnaList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, user, isOwner]);

  /**
   * ?œê? ?¤ëª…: ì§ˆë¬¸ ?‘ì„± ?¸ë“¤??
   */
  const handleSubmitQuestion = async () => {
    if (!user) {
      alert("ë¡œê·¸????ë¬¸ì˜ë¥??¨ê¸¸ ???ˆìŠµ?ˆë‹¤.");
      return;
    }

    if (!questionForm.question.trim()) {
      alert("ì§ˆë¬¸ ?´ìš©???…ë ¥?´ì£¼?¸ìš”.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: ProjectQnaCreateRequest = {
        question: questionForm.question.trim(),
        isPrivate: questionForm.isPrivate,
      };
      
      await createQuestion(projectId, payload);
      
      // ?œê? ?¤ëª…: ?±ê³µ ????ì´ˆê¸°??ë°?ëª©ë¡ ?ˆë¡œê³ ì¹¨
      setQuestionForm({
        question: "",
        isPrivate: true,
      });
      await fetchMyQnaList();
      alert("ì§ˆë¬¸???±ë¡?˜ì—ˆ?µë‹ˆ??");
    } catch (err) {
      console.error("ì§ˆë¬¸ ?‘ì„± ?¤íŒ¨:", err);
      alert("ì§ˆë¬¸ ?±ë¡???¤íŒ¨?ˆìŠµ?ˆë‹¤. ? ì‹œ ???¤ì‹œ ?œë„?´ì£¼?¸ìš”.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * ?œê? ?¤ëª…: ? ì§œ ?¬ë§·??? í‹¸ ?¨ìˆ˜ (ê°„ë‹¨???•ì‹)
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6">
      {/* ?œê? ?¤ëª…: Q&A ?‘ì„± ??- ?Œìœ ?ê? ?„ë‹ ?Œë§Œ ?œì‹œ */}
      {!isOwner && (
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            ë¬¸ì˜?˜ê¸°
          </h2>
          
          {!user ? (
            // ?œê? ?¤ëª…: ë¹„ë¡œê·¸ì¸ ?íƒœ ?ˆë‚´
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
              ë¡œê·¸????ë¬¸ì˜ë¥??¨ê¸¸ ???ˆìŠµ?ˆë‹¤.
            </div>
          ) : (
            <div className="space-y-4">
              {/* ?œê? ?¤ëª…: ì§ˆë¬¸ ?…ë ¥ ?ì—­ */}
              <textarea
                placeholder="?„ë¡œ?íŠ¸???€??ê¶ê¸ˆ???ì„ ?¨ê²¨ì£¼ì„¸??"
                value={questionForm.question}
                onChange={(e) =>
                  setQuestionForm((prev) => ({
                    ...prev,
                    question: e.target.value,
                  }))
                }
                rows={4}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
              
              {/* ?œê? ?¤ëª…: ë¹„ê³µê°?ì²´í¬ë°•ìŠ¤ */}
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={questionForm.isPrivate}
                  onChange={(e) =>
                    setQuestionForm((prev) => ({
                      ...prev,
                      isPrivate: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span>ë¹„ê³µê°?ì§ˆë¬¸?¼ë¡œ ?¨ê¸°ê¸?(?˜ì? ë©”ì´ì»¤ë§Œ ë³????ˆìŠµ?ˆë‹¤)</span>
              </label>
              
              {/* ?œê? ?¤ëª…: ì§ˆë¬¸ ?±ë¡ ë²„íŠ¼ */}
              <button
                type="button"
                onClick={handleSubmitQuestion}
                disabled={isSubmitting || !questionForm.question.trim()}
                className="w-full rounded-full border border-neutral-900 bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "?±ë¡ ì¤?.." : "ì§ˆë¬¸ ?±ë¡"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ?œê? ?¤ëª…: Q&A ëª©ë¡ - ?Œìœ ?ëŠ” ?œí¬?°ê? ?¨ê¸´ ë¬¸ì˜, ?œí¬?°ëŠ” ?´ê? ?¨ê¸´ ë¬¸ì˜ */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          {isOwner ? "?œí¬?°ê? ?¨ê¸´ ë¬¸ì˜" : "?´ê? ?¨ê¸´ ë¬¸ì˜"}
        </h2>
        
        {!user ? (
          // ?œê? ?¤ëª…: ë¹„ë¡œê·¸ì¸ ?íƒœ ?ˆë‚´
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
            {isOwner
              ? "ë¡œê·¸?????œí¬?°ê? ?¨ê¸´ ë¬¸ì˜ë¥??•ì¸?????ˆìŠµ?ˆë‹¤."
              : "ë¡œê·¸?????´ê? ?¨ê¸´ ë¬¸ì˜ë¥??•ì¸?????ˆìŠµ?ˆë‹¤."}
          </div>
        ) : loading ? (
          // ?œê? ?¤ëª…: ë¡œë”© ?íƒœ
          <div className="py-8 text-center text-sm text-neutral-500">
            ë¡œë”© ì¤?..
          </div>
        ) : error ? (
          // ?œê? ?¤ëª…: ?ëŸ¬ ?íƒœ
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
            {error}
          </div>
        ) : qnaList.length === 0 ? (
          // ?œê? ?¤ëª…: Q&Aê°€ ?†ì„ ??
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
            {isOwner
              ? "?„ì§ ?œí¬?°ê? ?¨ê¸´ ë¬¸ì˜ê°€ ?†ìŠµ?ˆë‹¤."
              : "?„ì§ ?¨ê¸´ ë¬¸ì˜ê°€ ?†ìŠµ?ˆë‹¤."}
          </div>
        ) : (
          // ?œê? ?¤ëª…: Q&A ëª©ë¡ ?œì‹œ
          <div className="space-y-4">
            {qnaList.map((qna) => (
              <div
                key={qna.id}
                className="rounded-xl border border-neutral-200 bg-white p-4"
              >
                {/* ?œê? ?¤ëª…: Q&A ?¤ë” (?íƒœ ë±ƒì? + ? ì§œ) */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* ?œê? ?¤ëª…: ?íƒœ ë±ƒì? */}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        qna.status === "ANSWERED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {qna.status === "ANSWERED" ? "?µë? ?„ë£Œ" : "?µë? ?€ê¸?}
                    </span>
                  </div>
                  {/* ?œê? ?¤ëª…: ì§ˆë¬¸ ?±ë¡ ?¼ì‹œ */}
                  <span className="text-xs text-neutral-500">
                    {formatDate(qna.createdAt)}
                  </span>
                </div>
                
                {/* ?œê? ?¤ëª…: ì§ˆë¬¸ ?´ìš© */}
                <div className="mb-3 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">
                  <p className="font-medium text-neutral-900">ì§ˆë¬¸:</p>
                  <p className="mt-1 whitespace-pre-wrap">{qna.question}</p>
                </div>
                
                {/* ?œê? ?¤ëª…: ?µë? ?´ìš© (?ˆì„ ?Œë§Œ ?œì‹œ) */}
                {qna.answer && (
                  <div className="rounded-lg bg-blue-50 p-3 text-sm text-neutral-700">
                    <p className="mb-1 font-medium text-blue-700">ë©”ì´ì»??µë?:</p>
                    <p className="whitespace-pre-wrap">{qna.answer}</p>
                    {qna.answeredAt && (
                      <p className="mt-2 text-xs text-neutral-500">
                        ?µë??¼ì‹œ: {formatDate(qna.answeredAt)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};



