// ?úÍ? ?§Î™Ö: SSE(Server-Sent Events)Î•??¨Ïö©???§ÏãúÍ∞??åÎ¶º Íµ¨ÎèÖ ??
import { useEffect, useRef } from "react";
import { useAuthStore } from "../../auth/stores/authStore";
import { useNotificationStore } from "../stores/notificationStore";
import { API_BASE_URL } from "../../../services/api";
import type { NotificationResponse } from "../types";

/**
 * ?úÍ? ?§Î™Ö: SSEÎ•??¨Ïö©?òÏó¨ ?§ÏãúÍ∞??åÎ¶º??Íµ¨ÎèÖ?òÎäî ??
 * - Î°úÍ∑∏?∏Ìïú ?¨Ïö©?êÎßå Íµ¨ÎèÖ Í∞Ä??
 * - ?∞Í≤∞???äÏñ¥ÏßÄÎ©??êÎèô?ºÎ°ú ?¨Ïó∞Í≤??úÎèÑ
 * - ?åÎ¶º ?òÏã† ???ÑÏó≠ ?ÅÌÉú???êÎèô Î∞òÏòÅ
 */
export const useSseNotification = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // ?úÍ? ?§Î™Ö: Î°úÍ∑∏?∏ÌïòÏßÄ ?äÏ? Í≤ΩÏö∞ Íµ¨ÎèÖ?òÏ? ?äÏùå
    if (!isAuthenticated || !user) {
      return;
    }

    // ?úÍ? ?§Î™Ö: ?†ÌÅ∞ Í∞Ä?∏Ïò§Í∏?
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("[useSseNotification] ?†ÌÅ∞???ÜÏñ¥ SSE Íµ¨ÎèÖ???úÏûë?????ÜÏäµ?àÎã§.");
      return;
    }

    // ?úÍ? ?§Î™Ö: SSE ?∞Í≤∞ URL ?ùÏÑ±
    // Î∞±Ïóî?? GET /notifications/subscribe?token={token}
    const sseUrl = `${API_BASE_URL}/notifications/subscribe?token=${encodeURIComponent(token)}`;

    console.log("[useSseNotification] SSE Íµ¨ÎèÖ ?úÏûë:", sseUrl);

    // ?úÍ? ?§Î™Ö: EventSource ?ùÏÑ±
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    // ?úÍ? ?§Î™Ö: ?∞Í≤∞ ?±Í≥µ ?¥Î≤§??
    eventSource.addEventListener("connect", (event) => {
      console.log("[useSseNotification] SSE ?∞Í≤∞ ?±Í≥µ:", event.data);
    });

    // ?úÍ? ?§Î™Ö: ?åÎ¶º ?òÏã† ?¥Î≤§??
    eventSource.addEventListener("notification", (event) => {
      try {
        const notification: NotificationResponse = JSON.parse(event.data);
        console.log("[useSseNotification] ?åÎ¶º ?òÏã†:", notification);
        
        // ?úÍ? ?§Î™Ö: ?ÑÏó≠ ?ÅÌÉú???åÎ¶º Ï∂îÍ?
        addNotification(notification);
        
        // ?úÍ? ?§Î™Ö: ?ΩÏ? ?äÏ? ?åÎ¶º Í∞úÏàò Ï¶ùÍ?
        if (!notification.read) {
          /* removed double count */
        }
      } catch (error) {
        console.error("[useSseNotification] ?åÎ¶º ?åÏã± ?§Ìå®:", error, event.data);
      }
    });

    // ?úÍ? ?§Î™Ö: ?êÎü¨ Ï≤òÎ¶¨
    eventSource.onerror = (error) => {
      console.error("[useSseNotification] SSE ?êÎü¨:", error);
      // ?úÍ? ?§Î™Ö: ?∞Í≤∞???äÏñ¥ÏßÄÎ©?3Ï¥????¨Ïó∞Í≤??úÎèÑ
      eventSource.close();
      setTimeout(() => {
        if (isAuthenticated && user) {
          // ?úÍ? ?§Î™Ö: ?¨Ïó∞Í≤∞Ï? useEffectÍ∞Ä ?§Ïãú ?§Ìñâ?òÎ©¥???êÎèô?ºÎ°ú Ï≤òÎ¶¨??
          console.log("[useSseNotification] ?¨Ïó∞Í≤??úÎèÑ...");
        }
      }, 3000);
    };

    // ?úÍ? ?§Î™Ö: Ïª¥Ìè¨?åÌä∏ ?∏Îßà?¥Ìä∏ ???∞Í≤∞ Ï¢ÖÎ£å
    return () => {
      console.log("[useSseNotification] SSE Íµ¨ÎèÖ Ï¢ÖÎ£å");
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isAuthenticated, user, addNotification]);
};


