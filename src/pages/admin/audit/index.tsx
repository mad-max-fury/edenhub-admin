import { useMemo, useState } from "react";
import { Search, Filter, Download } from "lucide-react";
import { Typography, TMTable, ButtonDropdown, Modal } from "@/components";
import { auditColumns, type AuditRow } from "./components/auditColumns";
import AuditDetail from "./components/auditDetail";

const MOCK_AUDITS: AuditRow[] = [
  {
    id: "LOG-8821",
    timestamp: "15 Feb, 2026 • 14:20",
    actor: { name: "Admin (You)", role: "Owner" },
    action: "Price Updated",
    category: "Inventory",
    details: "Eden Chrono Elite price changed from $750.00 to $778.35",
    ipAddress: "192.168.1.45",
    severity: "low",
  },
  {
    id: "LOG-8822",
    timestamp: "15 Feb, 2026 • 13:45",
    actor: { name: "System", role: "Automation" },
    action: "Order Fulfilled",
    category: "Orders",
    details: "Order #ORD-5529 status changed to 'Shipped' via Logistics API",
    ipAddress: "Internal Server",
    severity: "low",
  },
  {
    id: "LOG-8823",
    timestamp: "15 Feb, 2026 • 11:10",
    actor: { name: "Admin (You)", role: "Owner" },
    action: "Two-Factor Disabled",
    category: "Security",
    details: "User successfully disabled 2FA from a recognized device",
    ipAddress: "192.168.1.45",
    severity: "high",
  },
  {
    id: "LOG-8824",
    timestamp: "14 Feb, 2026 • 22:30",
    actor: { name: "Admin (You)", role: "Owner" },
    action: "Product Deleted",
    category: "Inventory",
    details:
      "Removed 'Vintage Gold Strap' (ID: PRD-004) from permanent listings",
    ipAddress: "102.89.34.112",
    severity: "high",
  },
  {
    id: "LOG-8825",
    timestamp: "14 Feb, 2026 • 16:15",
    actor: { name: "System", role: "Payment Provider" },
    action: "Refund Processed",
    category: "Billing",
    details:
      "Refund of $1,250.00 confirmed for Order #ORD-9920 (Customer: Bessie Cooper)",
    ipAddress: "Webhook-Stripe",
    severity: "medium",
  },
  {
    id: "LOG-8826",
    timestamp: "14 Feb, 2026 • 09:00",
    actor: { name: "Admin (You)", role: "Owner" },
    action: "Bulk Discount Applied",
    category: "Inventory",
    details: "Applied 15% discount to all items in 'Luxury Collection'",
    ipAddress: "192.168.1.45",
    severity: "medium",
  },
  {
    id: "LOG-8827",
    timestamp: "13 Feb, 2026 • 19:45",
    actor: { name: "Admin (You)", role: "Owner" },
    action: "Login Successful",
    category: "Security",
    details: "New session started on Chrome / Windows 11",
    ipAddress: "105.112.181.22",
    severity: "low",
  },
  {
    id: "LOG-8828",
    timestamp: "13 Feb, 2026 • 12:20",
    actor: { name: "System", role: "Automation" },
    action: "Low Stock Alert",
    category: "Inventory",
    details: "Aero Stealth Black reached threshold (2 units remaining)",
    ipAddress: "Internal Server",
    severity: "medium",
  },
  {
    id: "LOG-8829",
    timestamp: "12 Feb, 2026 • 14:05",
    actor: { name: "Admin (You)", role: "Owner" },
    action: "API Key Generated",
    category: "System",
    details: "New secret key created for 'Mobile App Integration'",
    ipAddress: "192.168.1.45",
    severity: "high",
  },
  {
    id: "LOG-8830",
    timestamp: "12 Feb, 2026 • 10:30",
    actor: { name: "Admin (You)", role: "Owner" },
    action: "Tax Rules Modified",
    category: "Billing",
    details: "Standard VAT changed from 7.5% to 8.0% for Lagos region",
    ipAddress: "102.89.45.67",
    severity: "medium",
  },
];

const AuditTrail = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<string>("All Categories");
  const [selectedAudit, setSelectedAudit] = useState<AuditRow | null>(null);

  const filteredAudits = useMemo(() => {
    return MOCK_AUDITS.filter((log) => {
      const matchesCategory =
        activeCategory === "All Categories" || log.category === activeCategory;

      const searchStr = searchTerm.toLowerCase();
      const matchesSearch =
        log.action.toLowerCase().includes(searchStr) ||
        log.details.toLowerCase().includes(searchStr) ||
        log.actor.name.toLowerCase().includes(searchStr) ||
        log.ipAddress.toLowerCase().includes(searchStr);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const filterOptions = [
    {
      name: "All Categories",
      onClick: () => setActiveCategory("All Categories"),
    },
    { name: "Orders", onClick: () => setActiveCategory("Orders") },
    { name: "Inventory", onClick: () => setActiveCategory("Inventory") },
    { name: "Security", onClick: () => setActiveCategory("Security") },
    { name: "Billing", onClick: () => setActiveCategory("Billing") },
    { name: "System", onClick: () => setActiveCategory("System") },
  ];

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
          data={filteredAudits}
          loading={false}
          headerData={
            <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-N400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by action, user, or IP..."
                  className="w-full pl-10 pr-4 py-2 border border-N40 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-N100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  buttonGroup={filterOptions}
                  triggerIcon={<Filter size={18} />}
                />

                <button
                  className="flex items-center gap-2 px-4 py-2 border border-N40 rounded-xl text-sm font-medium hover:bg-N10 transition-colors"
                  onClick={() => console.log("Exporting...", filteredAudits)}
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
          }
          className="border-none"
          headerClassName="bg-N10 text-N700 uppercase tracking-wider text-[11px] font-bold"
          pageSize={10}
          totalCount={filteredAudits.length}
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
