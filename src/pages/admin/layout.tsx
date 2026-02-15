import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useMemo } from "react";

import {
  DashboardIcon,
  AnalyticsIcon,
  OrdersIcon,
  ProductsIcon,
  CustomersIcon,
  SettingsIcon,
  AuditTrailIcon,
  UserManagementIcon,
} from "@/assets/svgs";
import type { MenuItem } from "@/components/sidebar/SideBar";
import Sidebar from "@/components/sidebar/SideBar";
import TopBar from "@/components/topbar/Topbar";
import type { Crumb } from "@/components/breadCrumbs/breadCrumbs";
import { AuthRouteConfig } from "@/constants/routes";
import { Drawer } from "@/components";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openSideMenu, setOpenMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        name: "Dashboard",
        icon: DashboardIcon,
        path: AuthRouteConfig.DASHBOARD,
      },
      {
        name: "Analytics",
        icon: AnalyticsIcon,
        path: AuthRouteConfig.ANALYTICS,
      },
      { name: "Products", icon: ProductsIcon, path: AuthRouteConfig.PRODUCTS },
      {
        name: "Orders",
        icon: OrdersIcon,
        path: AuthRouteConfig.ORDERS,
        badge: 2,
      },
      {
        name: "Customers",
        icon: CustomersIcon,
        path: AuthRouteConfig.CUSTOMERS,
      },
      {
        name: "User Management",
        icon: UserManagementIcon,
        path: AuthRouteConfig.USER_MANAGEMENT,
      },
      {
        name: "Audit Trail",
        icon: AuditTrailIcon,
        path: AuthRouteConfig.AUDIT_TRAIL,
      },
      { name: "Settings", icon: SettingsIcon, path: AuthRouteConfig.SETTINGS },
    ],
    [],
  );

  const activeItem = useMemo(() => {
    const currentItem = menuItems.find((item) =>
      location.pathname.includes(item.path.split("/")[2]),
    );
    return currentItem ? currentItem.name : menuItems[0].name;
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
          userProfile={{
            name: "Ndubuisi Obinna",
            role: "Super Admin",
            avatar:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          }}
          onUserMenuClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          isUserMenuOpen={isUserMenuOpen}
        />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          breadcrumbs={generateBreadcrumbs()}
          searchPlaceholder="Search for anything here"
          onSearch={(val) => console.log(val)}
          notificationCount={2}
          onNotificationClick={() => {}}
          openDrawer={() => setOpenMenu(true)}
        />

        <main className="flex-1 p-4 md:p-8 overflow-auto bg-N10 custom-scrollbar">
          <Outlet />
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
            userProfile={{
              name: "Ndubuisi Obinna",
              role: "Super Admin",
              avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
            }}
            onUserMenuClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            isUserMenuOpen={isUserMenuOpen}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default AdminLayout;
