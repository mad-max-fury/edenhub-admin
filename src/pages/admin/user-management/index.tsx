import { Tab, type ITab } from "@/components";
import { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";

const UserManagementLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = useMemo(
    () => [
      {
        label: "USERS",
        query: "users",
        path: `${AuthRouteConfig.USER_MANAGEMENT}/users`,
        content: (
          <section className="mt-2">
            <Outlet />
          </section>
        ),
      },
      {
        label: "ROLES & PERMISSIONS",
        query: "roles",
        path: `${AuthRouteConfig.USER_MANAGEMENT}/roles`,
        content: (
          <section className="mt-2">
            <Outlet />
          </section>
        ),
      },
      {
        label: "MENU ACCESS",
        query: "menus",
        path: `${AuthRouteConfig.USER_MANAGEMENT}/menus`,
        content: (
          <section className="mt-2">
            <Outlet />
          </section>
        ),
      },
    ],
    [],
  );

  const activeTab = useMemo(() => {
    const currentTab = tabs.find((tab) => location.pathname.includes(tab.path));
    return currentTab ? currentTab.query : "users";
  }, [location.pathname, tabs]);

  const handleTabChange = (query: string) => {
    const targetTab = tabs.find((tab) => tab.query === query);
    if (targetTab) {
      navigate(targetTab.path);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-1 px-1">
        <Typography variant="h-m" fontWeight="bold">
          User Management
        </Typography>
        <Typography variant="p-s" color="N500">
          Manage your team members, define access levels, and configure sidebar
          visibility.
        </Typography>
      </div>

      <div className="relative border-b border-N30">
        <Tab tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
      </div>
    </div>
  );
};

export default UserManagementLayout;
