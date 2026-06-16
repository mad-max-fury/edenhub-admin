import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/stores";

// Required permission name(s) per admin area. A user needs ANY one of the
// listed permissions to access the area. Empty array = always allowed.
// Names mirror the backend route metadata (e.g. product.routes.ts).
export const AREA_PERMISSIONS = {
  dashboard: ["get_analytics_summary"],
  analytics: ["get_analytics_summary"],
  products: ["get_products_list"],
  categories: ["get_categories_list"],
  orders: ["get_orders_list"],
  customers: ["get_customers_list"],
  userManagement: ["get_staff_list", "get_roles_list", "get_permissions"],
  auditTrail: ["get_audit_logs"],
  settings: [] as string[], // self-service: always available
  notifications: [] as string[],
} as const;

// Resolve the permissions required for a given pathname (prefix match).
export const requiredPermissionsForPath = (pathname: string): string[] => {
  if (pathname.startsWith("/admin/products")) return [...AREA_PERMISSIONS.products];
  if (pathname.startsWith("/admin/categories")) return [...AREA_PERMISSIONS.categories];
  if (pathname.startsWith("/admin/orders")) return [...AREA_PERMISSIONS.orders];
  if (pathname.startsWith("/admin/customers")) return [...AREA_PERMISSIONS.customers];
  if (pathname.startsWith("/admin/user-management"))
    return [...AREA_PERMISSIONS.userManagement];
  if (pathname.startsWith("/admin/audit-trail")) return [...AREA_PERMISSIONS.auditTrail];
  if (pathname.startsWith("/admin/analytics")) return [...AREA_PERMISSIONS.analytics];
  if (pathname.startsWith("/admin/settings")) return [...AREA_PERMISSIONS.settings];
  if (pathname.startsWith("/admin/notifications"))
    return [...AREA_PERMISSIONS.notifications];
  // Dashboard / index.
  if (pathname === "/admin" || pathname === "/admin/")
    return [...AREA_PERMISSIONS.dashboard];
  return []; // unknown (e.g. 404) — let it render.
};

export interface PermissionApi {
  isSuperAdmin: boolean;
  permissions: Set<string>;
  /** True if the user has the given permission. */
  can: (perm: string) => boolean;
  /** True if the user has ANY of the given permissions (empty = allowed). */
  canAny: (perms: string[]) => boolean;
}

export const usePermissions = (): PermissionApi => {
  const user = useSelector((s: RootState) => s.auth.user);

  const isSuperAdmin = user?.role?.name === "super-admin";

  const permissions = useMemo(
    () =>
      new Set(
        (user?.role?.permissions ?? [])
          .map((p) => (typeof p === "string" ? p : p?.name))
          .filter(Boolean) as string[],
      ),
    [user],
  );

  const can = (perm: string) => isSuperAdmin || permissions.has(perm);
  const canAny = (perms: string[]) =>
    perms.length === 0 || isSuperAdmin || perms.some((p) => permissions.has(p));

  return { isSuperAdmin, permissions, can, canAny };
};
