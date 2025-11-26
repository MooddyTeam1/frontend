import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { useAuthStore } from "./features/auth/stores/authStore";
import { useSupporterStore } from "./features/supporter/stores/supporterStore";
import { useMakerStore } from "./features/maker/stores/makerStore";
import "./styles/global.css";

// 한글 설명: 앱 시작 시 모든 store 초기화
useAuthStore.getState().initialize();
useSupporterStore.getState().reset();
useMakerStore.getState().loadMakers();

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
