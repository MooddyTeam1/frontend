import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { ProjectDetailPage } from "../pages/ProjectDetailPage";
import { PledgePage } from "../pages/PledgePage";
import { WizardPage } from "../pages/WizardPage";
import { NotFound } from "../pages/NotFound";

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/projects" element={<ProjectsPage />} />
    <Route path="/projects/:slug" element={<ProjectDetailPage />} />
    <Route path="/projects/:slug/pledge" element={<PledgePage />} />
    <Route path="/creator/projects/new" element={<WizardPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
