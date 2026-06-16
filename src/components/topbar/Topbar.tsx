import React from "react";
import { Search, Menu } from "lucide-react";
import { Breadcrumbs, type Crumb } from "../breadCrumbs/breadCrumbs";
import { NotificationBell } from "../notificationBell/NotificationBell";

interface TopBarProps {
  breadcrumbs: Crumb[];
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
  openDrawer: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  breadcrumbs,
  searchPlaceholder = "Search for anything here",
  onSearch,
  openDrawer,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

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
          <div className="relative flex-1 max-w-[400px]" role="search">
            <label htmlFor="global-search" className="sr-only">
              Search
            </label>
            <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2">
              <Search
                className="w-4 h-4 md:w-5  text-N400"
                aria-hidden="true"
              />
            </div>
            <input
              id="global-search"
              type="search"
              placeholder={searchPlaceholder}
              onChange={handleSearchChange}
              className="w-full h-10 md:h-12 pl-10 md:pl-12 pr-4 bg-N10 rounded-lg border border-N30 font-inter text-sm md:text-p-l text-N600 placeholder:text-N400 focus:outline-none focus:border-N300 transition-all"
              aria-label="Global search"
            />
          </div>

          <NotificationBell />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
