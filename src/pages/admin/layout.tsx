import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";

import {
  DashboardIcon,
  AnalyticsIcon,
  OrdersIcon,
  ProductsIcon,
  CategoriesIcon,
  CustomersIcon,
  SettingsIcon,
  AuditTrailIcon,
  UserManagementIcon,
} from "@/assets/svgs";
import { MessageSquare, RotateCcw } from "lucide-react";
import type { MenuItem } from "@/components/sidebar/SideBar";
import Sidebar from "@/components/sidebar/SideBar";
import TopBar from "@/components/topbar/Topbar";
import type { Crumb } from "@/components/breadCrumbs/breadCrumbs";
import { AuthRouteConfig } from "@/constants/routes";
import { ConfirmationModal, Drawer } from "@/components";
import { NoAccess } from "@/components/noAccess/NoAccess";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/stores";
import { useGetOrderStatsQuery } from "@/redux/api/orders";
import useAuthAction from "@/utils/useAuthAction";
import {
  AREA_PERMISSIONS,
  requiredPermissionsForPath,
  usePermissions,
} from "@/utils/permissions";

// Menu item + the permissions that gate it (any-of).
type NavItem = MenuItem & { perms: string[] };

const AdminLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { canAny } = usePermissions();

  const canSeeOrders = canAny([...AREA_PERMISSIONS.orders]);
  const { data: orderStats } = useGetOrderStatsQuery(undefined, {
    skip: !canSeeOrders,
  });
  const newOrders = orderStats?.data?.unfulfilled ?? 0;
  const { logout } = useAuthAction();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openSideMenu, setOpenMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const location = useLocation();
  const navigate = useNavigate();

  // Scroll the content area back to the top on every route change — the main
  // element is the scroll container (overflow-auto), not the window.
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  // Full nav with its gating permissions, then filtered to what the user can see.
  const menuItems: MenuItem[] = useMemo(() => {
    const all: NavItem[] = [
      {
        name: "Dashboard",
        icon: DashboardIcon,
        path: AuthRouteConfig.DASHBOARD,
        perms: [...AREA_PERMISSIONS.dashboard],
      },
      {
        name: "Analytics",
        icon: AnalyticsIcon,
        path: AuthRouteConfig.ANALYTICS,
        perms: [...AREA_PERMISSIONS.analytics],
      },
      {
        name: "Products",
        icon: ProductsIcon,
        path: AuthRouteConfig.PRODUCTS,
        perms: [...AREA_PERMISSIONS.products],
      },
      {
        name: "Categories",
        icon: CategoriesIcon,
        path: AuthRouteConfig.CATEGORIES,
        perms: [...AREA_PERMISSIONS.categories],
      },
      {
        name: "Orders",
        icon: OrdersIcon,
        path: AuthRouteConfig.ORDERS,
        badge: newOrders || null,
        perms: [...AREA_PERMISSIONS.orders],
      },
      {
        name: "Customers",
        icon: CustomersIcon,
        path: AuthRouteConfig.CUSTOMERS,
        perms: [...AREA_PERMISSIONS.customers],
      },
      {
        name: "User Management",
        icon: UserManagementIcon,
        path: AuthRouteConfig.USER_MANAGEMENT,
        perms: [...AREA_PERMISSIONS.userManagement],
      },
      {
        name: "Audit Trail",
        icon: AuditTrailIcon,
        path: AuthRouteConfig.AUDIT_TRAIL,
        perms: [...AREA_PERMISSIONS.auditTrail],
      },
      {
        name: "Messages",
        icon: MessageSquare as unknown as typeof AuditTrailIcon,
        path: AuthRouteConfig.MESSAGES,
        perms: [...AREA_PERMISSIONS.auditTrail],
      },
      {
        name: "Disputes",
        icon: RotateCcw as unknown as typeof AuditTrailIcon,
        path: AuthRouteConfig.DISPUTES,
        perms: [...AREA_PERMISSIONS.orders],
      },
      {
        name: "Settings",
        icon: SettingsIcon,
        path: AuthRouteConfig.SETTINGS,
        perms: [...AREA_PERMISSIONS.settings],
      },
    ];
    return all
      .filter((item) => canAny(item.perms))
      .map(({ perms: _perms, ...item }) => item);
  }, [newOrders, canAny]);

  // First page the user is actually allowed to land on.
  const firstAccessiblePath = menuItems[0]?.path ?? AuthRouteConfig.SETTINGS;

  // Is the user allowed to view the page they're currently on?
  const isPathAllowed = canAny(requiredPermissionsForPath(location.pathname));

  // If they land on a page they can't see (e.g. dashboard without analytics
  // permission), bounce them to their first accessible page.
  useEffect(() => {
    if (!isPathAllowed) {
      const isLanding =
        location.pathname === AuthRouteConfig.DASHBOARD ||
        location.pathname === `${AuthRouteConfig.DASHBOARD}/`;
      if (isLanding) navigate(firstAccessiblePath, { replace: true });
    }
  }, [isPathAllowed, location.pathname, firstAccessiblePath, navigate]);

  const activeItem = useMemo(() => {
    const currentItem = menuItems.find((item) =>
      location.pathname.includes(item.path.split("/")[2]),
    );
    return currentItem ? currentItem.name : menuItems[0]?.name;
  }, [location.pathname, menuItems]);

  const generateBreadcrumbs = (): Crumb[] => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: Crumb[] = [
      { name: "Home", path: AuthRouteConfig.DASHBOARD },
    ];

    if (pathSegments.length > 1) {
      const currentPage = pathSegments[pathSegments.length - 1];
      const formattedName = currentPage
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      breadcrumbs.push({ name: formattedName });
    }
    return breadcrumbs;
  };

  const handleItemClick = (item: MenuItem) => {
    navigate(item.path);
    setOpenMenu(false);
  };

  const userProfile = {
    name: user?.firstName + " " + user?.lastName,
    role:
      user?.role?.name
        .split(" ")
        .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ") || "User",
    avatar: user?.profilePicture || "",
  };

  return (
    <div
      className="flex h-screen font-inter bg-N10 overflow-hidden"
      role="application"
    >
      <aside className="hidden lg:flex h-full border-r border-N30">
        <Sidebar
          menuItems={menuItems}
          activeItem={activeItem}
          onItemClick={(name) => {
            const item = menuItems.find((i) => i.name === name);
            if (item) handleItemClick(item);
          }}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          userProfile={userProfile}
          onUserMenuClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          isUserMenuOpen={isUserMenuOpen}
          onLogout={handleLogout}
        />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          breadcrumbs={generateBreadcrumbs()}
          searchPlaceholder="Search for anything here"
          onSearch={() => {}}
          notificationCount={2}
          onNotificationClick={() => {}}
          openDrawer={() => setOpenMenu(true)}
        />

        <main
          ref={mainRef}
          className="flex-1 p-4 md:p-8 overflow-auto bg-N10 custom-scrollbar"
        >
          {isPathAllowed ? (
            <Outlet />
          ) : (
            <NoAccess homePath={firstAccessiblePath} />
          )}
        </main>
      </div>

      <Drawer
        open={openSideMenu}
        onClose={() => setOpenMenu(false)}
        selector="portal"
        bodyClassNames="  !p-0"
        anchor="left"
        rootClassName="flex lg:hidden"
      >
        <div className="h-[90%] w-full [&>*]:w-full ">
          <Sidebar
            menuItems={menuItems}
            activeItem={activeItem}
            onItemClick={(name) => {
              const item = menuItems.find((i) => i.name === name);
              setOpenMenu(false);
              if (item) handleItemClick(item);
            }}
            isCollapsed={false}
            onToggleCollapse={() => setOpenMenu(false)}
            userProfile={userProfile}
            onUserMenuClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            isUserMenuOpen={isUserMenuOpen}
            onLogout={handleLogout}
          />
        </div>
      </Drawer>

      <ConfirmationModal
        isOpen={showLogoutModal}
        closeModal={() => setShowLogoutModal(false)}
        formTitle="Log out"
        message="Are you sure you want to log out of your account?"
        buttonLabel="Log out"
        handleClick={confirmLogout}
        type="warning"
        isLoading={false}
      />
    </div>
  );
};

export default AdminLayout;
