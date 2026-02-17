import React, { type FunctionComponent, type SVGProps } from "react";
import ImageWrapper from "../imageLoader/ImageLoader";
import { Typography } from "../typography";
import { AppLogo } from "../logo/logo";
import { Link } from "react-router-dom";
import { AuthRouteConfig } from "@/constants/routes";

export interface MenuItem {
  name: string;
  icon: FunctionComponent<
    SVGProps<SVGSVGElement> & {
      title?: string;
      titleId?: string;
      desc?: string;
      descId?: string;
    }
  >;
  badge?: number | null;
  path: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  activeItem: string;
  onItemClick: (itemName: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userProfile: {
    name: string;
    role: string;
    avatar: string;
  };
  onUserMenuClick?: () => void;
  isUserMenuOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  activeItem,
  onItemClick,
  isCollapsed,
  onToggleCollapse,
  userProfile,
  onUserMenuClick,
  isUserMenuOpen = false,
}) => {
  return (
    <aside
      className={`h-screen bg-N0 border-r border-N30 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-[80px]" : "w-[230px]"
      }`}
      role="complementary"
      aria-label="Main navigation sidebar"
    >
      <header className="flex items-center justify-between p-6 border-b border-N30">
        {!isCollapsed && (
          <Link to={AuthRouteConfig.LOGIN} className="flex items-center gap-2">
            <AppLogo variant={"textHorizontalBlack"} />
          </Link>
        )}
        {isCollapsed && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto"
            aria-hidden="true"
          >
            <AppLogo variant={"iconMiniBlack"} />
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-N20 transition-colors"
            aria-label="Collapse sidebar"
            aria-expanded={!isCollapsed}
          >
            <svg
              className="w-5 h-5 text-N500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
      </header>

      <nav
        className="flex-1 py-6 overflow-y-auto"
        aria-label="Primary navigation"
      >
        <ul className="space-y-1" role="list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;

            return (
              <li key={item.name} role="none">
                <button
                  onClick={() => onItemClick(item.name)}
                  className={`w-full flex items-center gap-3 px-5 py-3 transition-all relative ${
                    isActive
                      ? "bg-[#DED6D4] text-BR500"
                      : "text-N600 hover:bg-N20"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  aria-label={item.name}
                  aria-current={isActive ? "page" : undefined}
                  title={isCollapsed ? item.name : undefined}
                  role="menuitem"
                >
                  <div
                    className="rounded-lg flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="font-inter text-p-m text-inherit font-medium flex-1 text-left">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span
                          className="bg-R400 text-N0 text-c-s px-2 py-1 rounded-full min-w-[24px] text-center"
                          aria-label={`${item.badge} notifications`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isCollapsed && item.badge && (
                    <span
                      className="absolute top-1 right-3 bg-R400 text-N0 text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                      aria-label={`${item.badge} notifications`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="p-4 border-t border-N30">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center"
              aria-label={`Expand sidebar - Current user: ${userProfile.name}`}
            >
              <ImageWrapper
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-9 h-9 rounded-lg object-cover"
              />
            </button>

            <button
              onClick={onToggleCollapse}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-N20 transition-colors"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <svg
                className="w-5 h-5 text-N500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={onUserMenuClick}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-N20 transition-colors"
            aria-label="User menu"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
          >
            <ImageWrapper
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-9 h-9 rounded-lg object-cover"
            />
            <div className="flex-1 text-left">
              <Typography
                className="font-clashDisplay"
                color={"text-default"}
                variant="p-m"
              >
                {userProfile.name}
              </Typography>
              <Typography color={"text-light"} variant="p-s">
                {userProfile.role}
              </Typography>
            </div>
          </button>
        )}
      </footer>
    </aside>
  );
};

export default Sidebar;
