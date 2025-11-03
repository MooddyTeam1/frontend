import React from "react";
import { AppRoutes } from "./router";
import { Header } from "./components/primitives/Header";
import { Footer } from "./components/primitives/Footer";

export const App: React.FC = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">
      <AppRoutes />
    </main>
    <Footer />
  </div>
);
