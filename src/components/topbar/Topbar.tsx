import React from "react";
import { Search, Bell } from "lucide-react";
import { Breadcrumbs, type Crumb } from "../breadCrumbs/breadCrumbs";

interface TopBarProps {
  breadcrumbs: Crumb[];
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  breadcrumbs,
  searchPlaceholder = "Search for anything here",
  onSearch,
  notificationCount = 0,
  onNotificationClick,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <header className="w-full bg-N0 border-b border-N30 px-8 py-4">
      <div className="flex items-center justify-between">
        <nav aria-label="Breadcrumb">
          <Breadcrumbs crumbs={breadcrumbs} />
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative" role="search">
            <label htmlFor="global-search" className="sr-only">
              Search
            </label>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-N400" aria-hidden="true" />
            </div>
            <input
              id="global-search"
              type="search"
              placeholder={searchPlaceholder}
              onChange={handleSearchChange}
              className="w-[400px] h-12 pl-12 pr-4 bg-N10 rounded-lg border border-N30 font-inter text-p-l text-N600 placeholder:text-N400 focus:outline-none focus:border-N300 transition-colors"
              aria-label="Global search"
            />
          </div>

          <button
            onClick={onNotificationClick}
            className="relative w-12 h-12 flex items-center justify-center rounded-lg bg-N10 border border-N30 hover:bg-N20 transition-colors"
            aria-label={
              notificationCount > 0
                ? `${notificationCount} unread notifications`
                : "Notifications"
            }
            aria-live="polite"
          >
            <Bell className="w-5 h-5 text-N600" aria-hidden="true" />

            {notificationCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 bg-R400 text-N0 text-[11px] font-bold rounded-full flex items-center justify-center"
                aria-hidden="true"
              >
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
