import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense, type ComponentType } from "react";

import NotFound from "@/pages/notFound/NotFound";
import { PageLoader } from "@/components";
import order from "@/pages/admin/orders/order";

const AdminLayout = lazy(() => import("@/pages/admin/layout"));
const LoginPage = lazy(() => import("@/pages/auth/login/Login"));
const ForgotPasswordPage = lazy(
  () => import("@/pages/auth/forgot-password/page")
);
const CreateNewPassword = lazy(
  () => import("@/pages/auth/create-new-password/createNewPassword")
);
const VerifyOtpPage = lazy(() => import("@/pages/auth/verify-otp/verifyOtp"));
const Dashboard = lazy(() => import("@/pages/admin/dashboard"));
const Analytics = lazy(() => import("@/pages/admin/analytics"));
const Products = lazy(() => import("@/pages/admin/products"));
const Orders = lazy(() => import("@/pages/admin/orders"));
const Customers = lazy(() => import("@/pages/admin/customers"));
const Settings = lazy(() => import("@/pages/admin/settings"));

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
      // { path: "products/:id", element: withSuspense(ProductDetails) },
      { path: "orders", element: withSuspense(Orders) },
      { path: "customers", element: withSuspense(Customers) },
      { path: "settings", element: withSuspense(Settings) },
      { path: "order", element: withSuspense(order) },
      { path: "*", element: <NotFound /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
