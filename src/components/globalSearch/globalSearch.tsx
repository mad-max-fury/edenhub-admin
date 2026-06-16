import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  Loader2,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Zap,
} from "lucide-react";
import { useGlobalSearchQuery } from "@/redux/api/search";
import type { ISearchHit, SearchHitType } from "@/redux/api/search";
import { AuthRouteConfig } from "@/constants/routes";
import {
  requiredPermissionsForPath,
  usePermissions,
} from "@/utils/permissions";
import { matchActions } from "./actions";

const entityMeta: Record<
  SearchHitType,
  { label: string; icon: LucideIcon; to: (id: string) => string }
> = {
  product: {
    label: "Products",
    icon: Package,
    to: (id) => `${AuthRouteConfig.PRODUCTS}/${id}`,
  },
  order: {
    label: "Orders",
    icon: ShoppingCart,
    to: (id) => `${AuthRouteConfig.ORDERS}/${id}`,
  },
  customer: {
    label: "Customers",
    icon: Users,
    to: () => AuthRouteConfig.CUSTOMERS,
  },
  category: {
    label: "Categories",
    icon: FolderTree,
    to: () => AuthRouteConfig.CATEGORIES,
  },
};

// Unified result row used for both local actions and API entities.
interface ResultItem {
  key: string;
  title: string;
  subtitle?: string;
  image?: string;
  icon: LucideIcon;
  path: string;
}

interface ResultGroup {
  key: string;
  label: string;
  items: ResultItem[];
}

export const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const { canAny } = usePermissions();
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce keystrokes before hitting the API (actions match instantly).
  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 300);
    return () => clearTimeout(t);
  }, [term]);

  const { data, isFetching } = useGlobalSearchQuery(debounced, {
    skip: debounced.length < 2,
  });

  const groups = useMemo<ResultGroup[]>(() => {
    const result: ResultGroup[] = [];

    // 1) Local quick actions / pages — only those the user can access.
    const actions = matchActions(debounced).filter((a) =>
      canAny(requiredPermissionsForPath(a.to)),
    );
    if (actions.length) {
      result.push({
        key: "action",
        label: "Actions",
        items: actions.map((a) => ({
          key: `action-${a.id}`,
          title: a.label,
          subtitle: "Go to page",
          icon: a.icon,
          path: a.to,
        })),
      });
    }

    // 2) API-backed entities.
    const d = data?.data;
    if (d) {
      (
        [
          { type: "product", hits: d.products },
          { type: "order", hits: d.orders },
          { type: "customer", hits: d.customers },
          { type: "category", hits: d.categories },
        ] as { type: SearchHitType; hits: ISearchHit[] }[]
      ).forEach(({ type, hits }) => {
        if (!hits.length) return;
        result.push({
          key: type,
          label: entityMeta[type].label,
          items: hits.map((h) => ({
            key: `${type}-${h.id}`,
            title: h.title,
            subtitle: h.subtitle,
            image: h.image,
            icon: entityMeta[type].icon,
            path: entityMeta[type].to(h.id),
          })),
        });
      });
    }

    return result;
  }, [debounced, data, canAny]);

  // Flattened list backs the keyboard navigation.
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => setActiveIndex(0), [debounced, data]);

  // Close on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (item: ResultItem) => {
    navigate(item.path);
    setOpen(false);
    setTerm("");
    setDebounced("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || flat.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[activeIndex];
      if (item) go(item);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showDropdown = open && debounced.length >= 2;
  let runningIndex = -1;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 max-w-[400px]"
      role="search"
    >
      <label htmlFor="global-search" className="sr-only">
        Search
      </label>
      <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2">
        {isFetching ? (
          <Loader2 className="w-4 h-4 md:w-5 text-N400 animate-spin" />
        ) : (
          <Search className="w-4 h-4 md:w-5 text-N400" aria-hidden="true" />
        )}
      </div>
      <input
        id="global-search"
        type="search"
        autoComplete="off"
        placeholder="Search products, orders, actions…"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="w-full h-10 md:h-12 pl-10 md:pl-12 pr-4 bg-N10 rounded-lg border border-N30 font-inter text-sm md:text-p-l text-N600 placeholder:text-N400 focus:outline-none focus:border-N300 transition-all"
        aria-label="Global search"
        aria-expanded={showDropdown}
      />

      {showDropdown && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-N0 border border-N30 rounded-xl shadow-lg overflow-hidden z-30 max-h-[440px] overflow-y-auto custom-scrollbar">
          {isFetching && flat.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-N500">
              Searching…
            </div>
          ) : flat.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-N500">
              No results for “{debounced}”
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.key}>
                <div className="flex items-center gap-1.5 px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-N400">
                  {group.key === "action" && <Zap className="w-3 h-3" />}
                  {group.label}
                </div>
                {group.items.map((item) => {
                  runningIndex += 1;
                  const isActive = runningIndex === activeIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onMouseEnter={() =>
                        setActiveIndex(flat.findIndex((f) => f.key === item.key))
                      }
                      onClick={() => go(item)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isActive ? "bg-N10" : "hover:bg-N10"
                      }`}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="w-8 h-8 rounded-md object-cover shrink-0"
                        />
                      ) : (
                        <span className="w-8 h-8 rounded-md bg-N20 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-N500" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-N700 truncate">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="block text-xs text-N500 truncate">
                            {item.subtitle}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
