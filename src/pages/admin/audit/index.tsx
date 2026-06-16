import { useMemo, useState } from "react";
import { Search, Filter, Download, ShieldAlert } from "lucide-react";
import {
  Typography,
  TMTable,
  ButtonDropdown,
  Modal,
  NetworkError,
} from "@/components";
import { auditColumns, type AuditRow } from "./components/auditColumns";
import AuditDetail from "./components/auditDetail";
import { useGetAuditsQuery, type IAuditLog } from "@/redux/api/audit";
import { PAGE_SIZE } from "@/constants/data";
import type { IPaginationMetadataResponse } from "@/redux/api/interface";

const CATEGORIES = [
  "All Categories",
  "Inventory",
  "Catalog",
  "User Management",
  "Access Control",
  "Security",
  "System",
];

const SEVERITIES = ["All Severities", "low", "medium", "high"];

const toRow = (log: IAuditLog): AuditRow => ({
  id: log._id,
  timestamp: log.createdAt
    ? new Date(log.createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—",
  actor: {
    name: log.actor
      ? `${log.actor.firstName} ${log.actor.lastName}`
      : log.actorEmail || "System",
    role: log.actor?.role?.name || (log.actorEmail ? "Guest" : "System"),
  },
  action: log.action,
  category: log.category,
  details: log.details || `${log.method} ${log.endpoint}`,
  ipAddress: log.ipAddress || "—",
  severity: log.severity,
});

const AuditTrail = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeSeverity, setActiveSeverity] = useState("All Severities");
  const [selectedAudit, setSelectedAudit] = useState<AuditRow | null>(null);

  const pageSize = PAGE_SIZE.md;

  const { data, isError, isFetching, error, refetch } = useGetAuditsQuery({
    pageNumber,
    pageSize,
    searchTerm,
    category: activeCategory === "All Categories" ? undefined : activeCategory,
    severity: activeSeverity === "All Severities" ? undefined : activeSeverity,
  });

  const rows = useMemo(() => (data?.data.data ?? []).map(toRow), [data]);

  const categoryFilters = CATEGORIES.map((name) => ({
    name,
    onClick: () => {
      setActiveCategory(name);
      setPageNumber(1);
    },
  }));

  const severityFilters = SEVERITIES.map((name) => ({
    name: name === "All Severities" ? name : name.toUpperCase(),
    onClick: () => {
      setActiveSeverity(name);
      setPageNumber(1);
    },
  }));

  const exportCsv = () => {
    const header = [
      "Timestamp",
      "User",
      "Role",
      "Category",
      "Action",
      "Details",
      "Severity",
      "IP Address",
    ];
    const body = rows.map((r) => [
      r.timestamp,
      r.actor.name,
      r.actor.role,
      r.category,
      r.action,
      r.details,
      r.severity,
      r.ipAddress,
    ]);
    const csv = [header, ...body]
      .map((line) =>
        line.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isError) {
    return (
      <div className="h-[70vh] w-full">
        <NetworkError isFetching={isFetching} error={error} refetch={refetch} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-1 px-1">
        <Typography variant="h-m" fontWeight="bold">
          Audit Trail
        </Typography>
        <Typography variant="p-s" color="N500">
          A chronological record of system activities and administrative
          changes.
        </Typography>
      </div>

      <section className="bg-white border border-N30">
        <TMTable<AuditRow>
          columns={auditColumns(setSelectedAudit)}
          data={rows}
          loading={isFetching}
          headerData={
            <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-N400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by action, user, or IP..."
                  className="w-full pl-10 pr-4 py-2 border border-N40 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-N100"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPageNumber(1);
                  }}
                />
              </div>

              <div className="flex items-center gap-3">
                {activeCategory !== "All Categories" && (
                  <Typography
                    variant="c-s"
                    className="hidden lg:block bg-B50 text-B400 px-2 py-1 rounded-md"
                  >
                    {activeCategory}
                  </Typography>
                )}

                <ButtonDropdown
                  buttonGroup={categoryFilters}
                  triggerIcon={<Filter size={18} />}
                />
                <ButtonDropdown
                  buttonGroup={severityFilters}
                  triggerIcon={<ShieldAlert size={18} />}
                />

                <button
                  className="flex items-center gap-2 px-4 py-2 border border-N40 rounded-xl text-sm font-medium hover:bg-N10 transition-colors"
                  onClick={exportCsv}
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
          }
          className="border-none"
          headerClassName="bg-N10 text-N700 uppercase tracking-wider text-[11px] font-bold"
          metadata={data?.data.metadata as IPaginationMetadataResponse}
          onPageChange={(p) => setPageNumber(p)}
          hasPerformedQuery={searchTerm.length > 0}
        />
      </section>

      {selectedAudit !== null && (
        <Modal
          isOpen={!!selectedAudit}
          onClose={() => setSelectedAudit(null)}
          title="Audit Log Details"
          mobileLayoutType={"full"}
        >
          <AuditDetail selectedAudit={selectedAudit as AuditRow} />
        </Modal>
      )}
    </div>
  );
};

export default AuditTrail;
