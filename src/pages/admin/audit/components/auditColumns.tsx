import { Badge, Button, Typography } from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import {
  History,
  User,
  Users,
  Package,
  ShieldCheck,
  Lock,
  Tag,
  CreditCard,
  Activity,
} from "lucide-react";

export type AuditRow = {
  id: string;
  timestamp: string;
  actor: { name: string; role: string; avatar?: string };
  action: string;
  category: string;
  details: string;
  ipAddress: string;
  severity: "low" | "medium" | "high";
};

export const auditColumns = (
  onView: (row: AuditRow) => void,
): ColumnDef<AuditRow>[] => [
  {
    header: "User",
    accessorKey: "actor",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-N10 rounded-full border border-N30">
          <User size={12} className="text-N500" />
        </div>
        <div>
          <Typography variant="p-s" fontWeight="medium">
            {row.original.actor.name}
          </Typography>
          <Typography variant="c-s" color="N500">
            {row.original.actor.role}
          </Typography>
        </div>
      </div>
    ),
  },
  {
    header: "CATEGORY",
    accessorKey: "category",
    cell: ({ row }) => {
      const category = row.original.category;

      const categoryStyles: Record<string, string> = {
        Orders: "bg-B50 text-B500 border-B100",
        Inventory: "bg-O50 text-O500 border-O100",
        Catalog: "bg-B50 text-B500 border-B100",
        "User Management": "bg-G50 text-G500 border-G100",
        "Access Control": "bg-R50 text-R500 border-R100",
        Security: "bg-R50 text-R500 border-R100",
        Billing: "bg-G50 text-G500 border-G100",
        System: "bg-N10 text-N600 border-N30",
      };

      const icons: Record<string, ReactNode> = {
        Orders: <Package size={12} />,
        Inventory: <History size={12} />,
        Catalog: <Tag size={12} />,
        "User Management": <Users size={12} />,
        "Access Control": <Lock size={12} />,
        Security: <ShieldCheck size={12} />,
        Billing: <CreditCard size={12} />,
        System: <Activity size={12} />,
      };

      return (
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border w-fit font-medium ${
            categoryStyles[category] || categoryStyles.System
          }`}
        >
          {icons[category] || <Activity size={12} />}
          <span className="text-[10px] uppercase tracking-wider">
            {category}
          </span>
        </div>
      );
    },
  },
  {
    header: "ACTION & DETAILS",
    accessorKey: "details",
    cell: ({ row }) => (
      <div className="max-w-xs md:max-w-md">
        <Typography variant="p-s" fontWeight="bold">
          {row.original.action}
        </Typography>
        <Typography variant="p-s" color="N500" className="truncate block">
          {row.original.details}
        </Typography>
      </div>
    ),
  },
  {
    header: "SEVERITY",
    accessorKey: "severity",
    cell: ({ row }) => <Badge status={row.original.severity} />,
  },
  {
    header: "IP ADDRESS",
    accessorKey: "ipAddress",
    cell: ({ row }) => (
      <Typography variant="p-s" color="N500" className="font-mono text-[11px]">
        {row.original.ipAddress}
      </Typography>
    ),
  },
  {
    header: "TIMESTAMP",
    accessorKey: "timestamp",
    cell: ({ row }) => (
      <Typography variant="p-s" color="N600" className="whitespace-nowrap">
        {row.original.timestamp}
      </Typography>
    ),
  },
  {
    header: "Action",
    id: "action",
    cell: ({ row }) => (
      <Button
        size={"sm"}
        onClick={() => onView(row.original)}
        variant={"secondary"}
      >
        View
      </Button>
    ),
  },
];
