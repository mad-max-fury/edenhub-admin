import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BarChart3,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingCart,
  Users,
  UserCog,
  ShieldCheck,
  ScrollText,
  Bell,
  Settings,
  UserCircle,
  SlidersHorizontal,
} from "lucide-react";
import { AuthRouteConfig } from "@/constants/routes";

export interface AdminAction {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  keywords?: string[];
}

// Quick-nav / command-palette actions surfaced in the global search.
export const adminActions: AdminAction[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    to: AuthRouteConfig.DASHBOARD,
    icon: LayoutDashboard,
    keywords: ["home", "overview"],
  },
  {
    id: "analytics",
    label: "Analytics",
    to: AuthRouteConfig.ANALYTICS,
    icon: BarChart3,
    keywords: ["reports", "sales", "revenue", "stats"],
  },
  {
    id: "products",
    label: "Products",
    to: AuthRouteConfig.PRODUCTS,
    icon: Package,
    keywords: ["catalog", "inventory", "items"],
  },
  {
    id: "product-create",
    label: "Add product",
    to: `${AuthRouteConfig.PRODUCTS}/create`,
    icon: PlusCircle,
    keywords: ["new product", "create product", "add item"],
  },
  {
    id: "categories",
    label: "Categories",
    to: AuthRouteConfig.CATEGORIES,
    icon: FolderTree,
    keywords: ["collections", "taxonomy"],
  },
  {
    id: "orders",
    label: "Orders",
    to: AuthRouteConfig.ORDERS,
    icon: ShoppingCart,
    keywords: ["sales", "purchases", "fulfilment"],
  },
  {
    id: "customers",
    label: "Customers",
    to: AuthRouteConfig.CUSTOMERS,
    icon: Users,
    keywords: ["shoppers", "buyers", "users"],
  },
  {
    id: "user-management",
    label: "User management",
    to: AuthRouteConfig.USER_MANAGEMENT,
    icon: UserCog,
    keywords: ["staff", "team", "admins", "rbac"],
  },
  {
    id: "roles",
    label: "Roles & permissions",
    to: `${AuthRouteConfig.USER_MANAGEMENT}/roles`,
    icon: ShieldCheck,
    keywords: ["permissions", "access", "rbac"],
  },
  {
    id: "audit-trail",
    label: "Audit trail",
    to: AuthRouteConfig.AUDIT_TRAIL,
    icon: ScrollText,
    keywords: ["logs", "activity", "history"],
  },
  {
    id: "notifications",
    label: "Notifications",
    to: `${AuthRouteConfig.DASHBOARD}/notifications`,
    icon: Bell,
    keywords: ["alerts", "inbox"],
  },
  {
    id: "settings",
    label: "Settings",
    to: AuthRouteConfig.SETTINGS,
    icon: Settings,
    keywords: ["preferences", "configuration"],
  },
  {
    id: "settings-profile",
    label: "Profile settings",
    to: `${AuthRouteConfig.SETTINGS}/profile`,
    icon: UserCircle,
    keywords: ["account", "my profile"],
  },
  {
    id: "settings-security",
    label: "Security",
    to: `${AuthRouteConfig.SETTINGS}/security`,
    icon: ShieldCheck,
    keywords: ["password", "2fa", "two factor", "login alerts"],
  },
  {
    id: "settings-notifications",
    label: "Notification preferences",
    to: `${AuthRouteConfig.SETTINGS}/notifications`,
    icon: SlidersHorizontal,
    keywords: ["email preferences", "alerts settings"],
  },
];

// Match an action against a search term (label or keywords substring).
export const matchActions = (term: string): AdminAction[] => {
  const q = term.trim().toLowerCase();
  if (!q) return [];
  return adminActions.filter(
    (a) =>
      a.label.toLowerCase().includes(q) ||
      a.keywords?.some((k) => k.includes(q)),
  );
};
