import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense, type ComponentType } from "react";

import NotFound from "@/pages/notFound/NotFound";
import { PageLoader } from "@/components";

const AdminLayout = lazy(() => import("@/pages/admin/layout"));
const LoginPage = lazy(() => import("@/pages/auth/login/Login"));
const ForgotPasswordPage = lazy(
  () => import("@/pages/auth/forgot-password/page"),
);
const CreateNewPassword = lazy(
  () => import("@/pages/auth/create-new-password/createNewPassword"),
);
const VerifyOtpPage = lazy(() => import("@/pages/auth/verify-otp/verifyOtp"));
const Dashboard = lazy(() => import("@/pages/admin/dashboard"));
const Analytics = lazy(() => import("@/pages/admin/analytics"));
const Products = lazy(() => import("@/pages/admin/products"));
const ProductDetails = lazy(
  () => import("@/pages/admin/products/productDetails"),
);
const Orders = lazy(() => import("@/pages/admin/orders"));
const Order = lazy(() => import("@/pages/admin/orders/order"));
const Customers = lazy(() => import("@/pages/admin/customers"));
const UserManagementLayout = lazy(
  () => import("@/pages/admin/user-management"),
);
const Users = lazy(() => import("@/pages/admin/user-management/users"));
const RolesManagement = lazy(
  () => import("@/pages/admin/user-management/roles"),
);
const MenusManagement = lazy(
  () => import("@/pages/admin/user-management/menus"),
);

const AuditTrail = lazy(() => import("@/pages/admin/audit"));
const SettingsLayout = lazy(() => import("@/pages/admin/settings/layout"));
const ProfileSettings = lazy(() => import("@/pages/admin/settings/profile"));
const NotificationSettings = lazy(
  () => import("@/pages/admin/settings/notifications"),
);
const SecuritySettings = lazy(() => import("@/pages/admin/settings/security"));
const withSuspense = (Component: ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: withSuspense(LoginPage) },
      { path: "forgot-password", element: withSuspense(ForgotPasswordPage) },
      {
        path: "reset-password/:token",
        element: withSuspense(CreateNewPassword),
      },
      { path: "verify-otp", element: withSuspense(VerifyOtpPage) },
    ],
  },

  {
    path: "/admin",
    element: withSuspense(AdminLayout),
    children: [
      { index: true, element: withSuspense(Dashboard) },
      { path: "analytics", element: withSuspense(Analytics) },
      { path: "products", element: withSuspense(Products) },
      { path: "products/:id", element: withSuspense(ProductDetails) },
      { path: "orders", element: withSuspense(Orders) },
      { path: "orders/:id", element: withSuspense(Order) },
      { path: "customers", element: withSuspense(Customers) },
      {
        path: "user-management",
        element: withSuspense(UserManagementLayout),
        children: [
          { index: true, element: <Navigate to="users" replace /> },
          { path: "users", element: withSuspense(Users) },
          {
            path: "roles",
            element: withSuspense(RolesManagement),
          },
          {
            path: "menus",
            element: withSuspense(MenusManagement),
          },
        ],
      },
      { path: "audit-trail", element: withSuspense(AuditTrail) },
      {
        path: "settings",
        element: withSuspense(SettingsLayout),
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: "profile", element: withSuspense(ProfileSettings) },
          {
            path: "security",
            element: withSuspense(SecuritySettings),
          },
          {
            path: "notifications",
            element: withSuspense(NotificationSettings),
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
