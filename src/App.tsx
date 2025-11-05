import React from "react";
import { AppRoutes } from "./router";
import { Header } from "./shared/components/layout/Header";
import { Footer } from "./shared/components/layout/Footer";

export const App: React.FC = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">
      <AppRoutes />
    </main>
    <Footer />
  </div>
);
