import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AccountSettingsPage } from "../pages/AccountSettings";
import { AdminPage } from "../pages/Admin";
import { AdminProjectListPage } from "../pages/Admin/ProjectList";
import { AdminProjectReviewDetailPage } from "../pages/Admin/ProjectReviewDetail";
import { RequireAdmin } from "./RequireAdmin";
import { CreatorDashboardPage } from "../pages/CreatorDashboard";
import { HomePage } from "../pages/Home";
import { LoginPage } from "../pages/Auth/Login";
import { ForgotPasswordPage } from "../pages/Auth/ForgotPassword";
import { EmailVerificationPage } from "../pages/Auth/EmailVerification";
import { NotificationsPage } from "../pages/Notifications";
import { NotFound } from "../pages/NotFound";
import { PledgePage } from "../pages/Pledge";
import {
  ProfilePage,
  ProfileSupporterRoute,
  ProfileMakerRoute,
} from "../pages/Profile";
import { ProjectStatusPage } from "../pages/Profile/ProjectStatusPage";
import { ProjectDetailPage } from "../pages/ProjectDetail";
import { ProjectsPage } from "../pages/Projects";
import { RewardManagementPage } from "../pages/RewardManagement";
import { SignupPage } from "../pages/Auth/Signup";
import { VerifyEmailPage } from "../pages/Auth/VerifyEmail";
import { CreatorWizardPage } from "../pages/CreatorWizard";
import { SupporterSettingsPage } from "../pages/SupporterSettings";
import { MakerSettingsPage } from "../pages/MakerSettings";
import { SupporterPublicPage } from "../pages/SupporterProfile";
import {
  MakerPublicPage,
  MakerProjectsRoute,
  MakerNewsRoute,
  MakerInfoRoute,
} from "../pages/MakerProfile";
import { MakerNewsCreatePage } from "../pages/MakerProfile/CreateNews";
import { RequireAuth } from "./RequireAuth";
import { PaymentPage } from "../pages/Payment/PaymentPage";
import { PaymentSuccessPage } from "../pages/Payment/SuccessPage";
import { PaymentFailPage } from "../pages/Payment/FailPage";
import { OAuthCallbackPage } from "../features/auth/pages/OAuthCallbackPage";
import { ReviewConsolePage } from "../pages/Admin/ReviewConsole";
import { SettlementConsolePage } from "../pages/Admin/SettlementConsole";
import { SummaryDashboardPage } from "../pages/Admin/Statistics/SummaryDashboard";
import { ProjectReviewList } from "../components/admin/projectReview/ProjectReviewList";
import { ProjectReviewDetail } from "../components/admin/projectReview/ProjectReviewDetail";
import { DailyStatisticsPage } from "../pages/Admin/Statistics/DailyStatistics";
import { MonthlyReportPage } from "../pages/Admin/Statistics/MonthlyReport";
import { RevenueReportPage } from "../pages/Admin/Statistics/RevenueReport";
import { ProjectPerformancePage } from "../pages/Admin/Statistics/ProjectPerformance";
import { UserBehaviorPage } from "../pages/Admin/Statistics/UserBehavior";
import { MakerProjectManagementPage } from "../pages/Maker/ProjectManagement";
import { MakerProjectDetailPage } from "../pages/Maker/ProjectManagement/[projectId]";
import { SupporterOnboardingPage } from "../pages/SupporterOnboarding";
import { OrderListPage } from "../pages/OrderList";
import { OrderDetailPage } from "../pages/OrderDetail";
import { SupporterOrderDetailPage } from "../pages/SupporterOrderDetail";

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/auth/email" element={<EmailVerificationPage />} />
    <Route path="/password/forgot" element={<ForgotPasswordPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
    <Route path="/projects" element={<ProjectsPage />} />
    <Route path="/projects/:id" element={<ProjectDetailPage />} />
    <Route path="/projects/:id/pledge" element={<PledgePage />} />
    <Route
      path="/payment"
      element={
        <RequireAuth>
          <PaymentPage />
        </RequireAuth>
      }
    />
    <Route path="/payment/success" element={<PaymentSuccessPage />} />
    <Route path="/payment/fail" element={<PaymentFailPage />} />
    <Route
      path="/profile"
      element={
        <RequireAuth>
          <ProfilePage />
        </RequireAuth>
      }
    >
      <Route index element={<Navigate to="supporter" replace />} />
      <Route path="supporter" element={<ProfileSupporterRoute />} />
      <Route
        path="supporter/orders"
        element={
          <RequireAuth>
            <OrderListPage />
          </RequireAuth>
        }
      />
      <Route path="maker" element={<ProfileMakerRoute />} />
      <Route path="maker/projects/:status" element={<ProjectStatusPage />} />
    </Route>
    <Route
      path="/orders/:orderId"
      element={
        <RequireAuth>
          <OrderDetailPage />
        </RequireAuth>
      }
    />
    <Route
      path="/supporter/orders/:orderId"
      element={
        <RequireAuth>
          <SupporterOrderDetailPage />
        </RequireAuth>
      }
    />
    <Route path="/supporters/:userId" element={<SupporterPublicPage />} />
    <Route path="/makers/:makerId" element={<MakerPublicPage />}>
      <Route index element={<MakerProjectsRoute />} />
      <Route path="news" element={<MakerNewsRoute />} />
      <Route path="info" element={<MakerInfoRoute />} />
    </Route>
    <Route
      path="/makers/:makerId/news/create"
      element={
        <RequireAuth>
          <MakerNewsCreatePage />
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
      path="/settings/supporter"
      element={
        <RequireAuth>
          <SupporterSettingsPage />
        </RequireAuth>
      }
    />
    <Route
      path="/supporter/onboarding"
      element={
        <RequireAuth>
          <SupporterOnboardingPage />
        </RequireAuth>
      }
    />
    <Route
      path="/settings/maker"
      element={
        <RequireAuth>
          <MakerSettingsPage />
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
      path="/creator/projects/new/:projectId"
      element={
        <RequireAuth>
          <CreatorWizardPage />
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
      path="/maker/projects/:projectId"
      element={
        <RequireAuth>
          <MakerProjectDetailPage />
        </RequireAuth>
      }
    />
    <Route
      path="/maker/projects"
      element={
        <RequireAuth>
          <MakerProjectManagementPage />
        </RequireAuth>
      }
    />
    <Route
      path="/notifications"
      element={
        <RequireAuth>
          <NotificationsPage />
        </RequireAuth>
      }
    />
    {/* 한글 설명: Admin 통계 및 리포트 경로는 더 구체적인 경로이므로 먼저 정의 */}
    <Route
      path="/admin/statistics/daily"
      element={
        <RequireAdmin>
          <DailyStatisticsPage />
        </RequireAdmin>
      }
    />
    <Route
      path="/admin/statistics/monthly"
      element={
        <RequireAdmin>
          <MonthlyReportPage />
        </RequireAdmin>
      }
    />
    <Route
      path="/admin/statistics/revenue"
      element={
        <RequireAdmin>
          <RevenueReportPage />
        </RequireAdmin>
      }
    />
    <Route
      path="/admin/statistics/project-performance"
      element={
        <RequireAdmin>
          <ProjectPerformancePage />
        </RequireAdmin>
      }
    />
    <Route
      path="/admin/statistics/user-behavior"
      element={
        <RequireAdmin>
          <UserBehaviorPage />
        </RequireAdmin>
      }
    />
    <Route
      path="/admin/statistics"
      element={
        <RequireAdmin>
          <SummaryDashboardPage />
        </RequireAdmin>
      }
    />
    <Route
      path="/admin/project/review/:projectId"
      element={
        <RequireAdmin>
          <ProjectReviewDetail />
        </RequireAdmin>
      }
    />
    <Route
      path="/admin/project/review"
      element={
        <RequireAdmin>
          <ProjectReviewList />
        </RequireAdmin>
      }
    />
    <Route
      path="/admin/projects/:projectId"
      element={
        <RequireAdmin>
          <AdminProjectReviewDetailPage />
        </RequireAdmin>
      }
    />
    <Route
      path="/admin/projects"
      element={
        <RequireAdmin>
          <AdminProjectListPage />
        </RequireAdmin>
      }
    />
    <Route
      path="/admin/review"
      element={
        <RequireAdmin>
          <ReviewConsolePage />
        </RequireAdmin>
      }
    />
    <Route
      path="/admin/settlement"
      element={
        <RequireAdmin>
          <SettlementConsolePage />
        </RequireAdmin>
      }
    />
    <Route
      path="/admin"
      element={
        <RequireAdmin>
          <AdminPage />
        </RequireAdmin>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
