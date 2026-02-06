import { Button } from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import {  ChevronsUpDownIcon, Square } from "lucide-react";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import type { DashboardRow } from "@/components/constants/data";




  export const dashboadColumns = (navigate: (path: string) => void): ColumnDef<DashboardRow>[] => [
  {
    header: () => (
      <div className="flex items-center gap-1">
        <div><span><Square className="text-gray-200" /></span></div>
        <p>Order</p>
      </div>
    ),
    accessorKey: "order",
    cell: ({row}) => (
      <div className="flex items-center gap-2 ml-2 ">
        <Square  className="text-gray-200" />
        <span>{row.original.order}</span>
      </div>
    )
  },
  {
    header: () => (
      <div className="flex items-center gap-1">
        <p>Date</p>
        <div><span><ChevronsUpDownIcon size={16} /></span></div>
      </div>
    ),
    accessorKey: "date",
  },
  { header: "Customer", accessorKey: "customer" },
  {
  header: "Payment",
  accessorKey: "payment",
  cell: ({ getValue }) => <StatusBadge value={getValue<string>()} successValue="Success" />,
},

  { header: "Total", accessorKey: "total" },
  { header: "Items", accessorKey: "items" },
    {
  header: "Fulfillment",
  accessorKey: "fulfillment",
  cell: ({ getValue }) => <StatusBadge value={getValue<string>()} successValue="Success" />,
},
  {
    header: "Action",
    id: "action",
    cell: ({ row }) => (
      <div>
        <Button variant="secondary" shape="rounded" types="outline" 
        onClick={() => navigate("/admin/order", { state: row.original })}
        >View Order</Button>
        
      </div>
    )
  },
];