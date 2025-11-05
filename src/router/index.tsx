import React from "react";
import { Route, Routes } from "react-router-dom";
import { AccountSettingsPage } from "../pages/AccountSettings";
import { AdminConsolePage } from "../pages/AdminConsole";
import { CreatorDashboardPage } from "../pages/CreatorDashboard";
import { HomePage } from "../pages/Home";
import { LoginPage } from "../pages/Auth/Login";
import { NotificationCenterPage } from "../pages/NotificationCenter";
import { NotFound } from "../pages/NotFound";
import { PledgePage } from "../pages/Pledge";
import { ProfilePage } from "../pages/Profile";
import { ProjectDetailPage } from "../pages/ProjectDetail";
import { ProjectsPage } from "../pages/Projects";
import { RewardManagementPage } from "../pages/RewardManagement";
import { SignupPage } from "../pages/Auth/Signup";
import { VerifyEmailPage } from "../pages/Auth/VerifyEmail";
import { CreatorWizardPage } from "../pages/CreatorWizard";
import { RequireAuth } from "./RequireAuth";

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/projects" element={<ProjectsPage />} />
    <Route path="/projects/:slug" element={<ProjectDetailPage />} />
    <Route path="/projects/:slug/pledge" element={<PledgePage />} />
    <Route
      path="/profile"
      element={
        <RequireAuth>
          <ProfilePage />
        </RequireAuth>
      }
    />
    <Route
      path="/settings/account"
      element={
        <RequireAuth>
          <AccountSettingsPage />
        </RequireAuth>
      }
    />
    <Route
      path="/creator/dashboard"
      element={
        <RequireAuth>
          <CreatorDashboardPage />
        </RequireAuth>
      }
    />
    <Route
      path="/creator/rewards"
      element={
        <RequireAuth>
          <RewardManagementPage />
        </RequireAuth>
      }
    />
    <Route
      path="/creator/projects/new"
      element={
        <RequireAuth>
          <CreatorWizardPage />
        </RequireAuth>
      }
    />
    <Route
      path="/notifications"
      element={
        <RequireAuth>
          <NotificationCenterPage />
        </RequireAuth>
      }
    />
    <Route
      path="/admin"
      element={
        <RequireAuth>
          <AdminConsolePage />
        </RequireAuth>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
