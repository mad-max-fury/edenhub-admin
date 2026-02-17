import { NavLink, Outlet } from "react-router-dom";
import { Typography } from "@/components";
import { cn } from "@/utils/helpers";
import { User, ShieldCheck, Bell } from "lucide-react";

const SettingsLayout = () => {
  const navItems = [
    { label: "Profile", path: "profile", icon: <User size={18} /> },
    { label: "Security", path: "security", icon: <ShieldCheck size={18} /> },
    { label: "Notifications", path: "notifications", icon: <Bell size={18} /> },
  ];

  return (
    <div className="mx-auto font-clashDisplay bg-white border border-N30 min-h-[80vh]  overflow-hidden">
      <div className="border-b border-N30 px-6 py-8 md:py-10">
        <Typography
          variant="h-l"
          fontWeight="medium"
          className=" tracking-tight"
        >
          Settings
        </Typography>
        <Typography variant="p-m" color="N500" className="mt-2">
          Manage your account settings and preferences.
        </Typography>
      </div>

      <div className="flex flex-col md:flex-row min-h-[inherit]">
        <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-N30">
          <nav className="flex flex-row md:flex-col gap-1 p-4 md:px-6 md:py-12 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                    isActive
                      ? "bg-BR75 text-white shadow-sm"
                      : "text-N500 hover:text-N900 hover:bg-N10",
                  )
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 w-full max-w-4xl px-6 py-8 md:py-12 mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-1 duration-400">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout;
