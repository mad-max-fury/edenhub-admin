import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  DashboardIcon,
  AnalyticsIcon,
  OrdersIcon,
  ProductsIcon,
  CustomersIcon,
  SettingsIcon,
} from "@/assets/svgs";
import type { MenuItem } from "@/components/sidebar/SideBar";
import Sidebar from "@/components/sidebar/SideBar";
import TopBar from "@/components/topbar/Topbar";
import type { Crumb } from "@/components/breadCrumbs/breadCrumbs";
import { AuthRouteConfig } from "@/constants/routes";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      path: AuthRouteConfig.DASHBOARD,
      badge: null,
    },
    {
      name: "Analytics",
      icon: AnalyticsIcon,
      path: AuthRouteConfig.ANALYTICS,
      badge: null,
    },
    {
      name: "Products",
      icon: ProductsIcon,
      path: AuthRouteConfig.PRODUCTS,
      badge: null,
    },
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
      badge: null,
    },
    {
      name: "Settings",
      icon: SettingsIcon,
      path: AuthRouteConfig.SETTINGS,
      badge: null,
    },
  ];

  const generateBreadcrumbs = (): Crumb[] => {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment);

    const breadcrumbs: Crumb[] = [
      { name: "Home", path: AuthRouteConfig.DASHBOARD },
    ];

    if (pathSegments.length > 1) {
      const currentPage = pathSegments[pathSegments.length - 1];
      breadcrumbs.push({
        name: currentPage,
      });
    }

    return breadcrumbs;
  };

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
    const item = menuItems.find((i) => i.name === itemName);
    if (item) {
      navigate(item.path);
    }
  };

  const handleSearch = (value: string) => {
    console.log("Search:", value);
  };

  const handleNotificationClick = () => {
    console.log("Notifications clicked");
  };

  const handleUserMenuClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen font-inter bg-N10" role="application">
      <Sidebar
        menuItems={menuItems}
        activeItem={activeItem}
        onItemClick={handleItemClick}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        userProfile={{
          name: "Ndubuisi Obinna",
          role: "Super Admin",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        }}
        onUserMenuClick={handleUserMenuClick}
        isUserMenuOpen={isUserMenuOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          breadcrumbs={generateBreadcrumbs()}
          searchPlaceholder="Search for anything here"
          onSearch={handleSearch}
          notificationCount={2}
          onNotificationClick={handleNotificationClick}
        />
        <main
          className="flex-1 p-6 overflow-auto bg-N10"
          role="main"
          aria-label="Main content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
