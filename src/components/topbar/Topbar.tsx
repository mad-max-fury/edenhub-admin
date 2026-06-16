import React from "react";
import { Menu } from "lucide-react";
import { Breadcrumbs, type Crumb } from "../breadCrumbs/breadCrumbs";
import { NotificationBell } from "../notificationBell/NotificationBell";
import { GlobalSearch } from "../globalSearch/globalSearch";

interface TopBarProps {
  breadcrumbs: Crumb[];
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
  openDrawer: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ breadcrumbs, openDrawer }) => {
  return (
    <header className="w-full bg-N0 border-b border-N30 px-4 md:px-8 py-3 md:py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={openDrawer}
            className="p-2 -ml-2 lg:hidden hover:bg-N10 rounded-lg transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-6 h-6 text-N600" />
          </button>

          <nav aria-label="Breadcrumb" className="hidden sm:block">
            <Breadcrumbs crumbs={breadcrumbs} />
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
          <GlobalSearch />

          <NotificationBell />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
