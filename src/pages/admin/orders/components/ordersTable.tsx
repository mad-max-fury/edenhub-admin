import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  Badge,
  Button,
  TMTable,
  Typography,
  NetworkError,
} from "@/components";
import { useGetOrdersQuery, type IOrder } from "@/redux/api/orders";
import { AuthRouteConfig } from "@/constants/routes";
import { PAGE_SIZE } from "@/constants/data";
import type { IPaginationMetadataResponse } from "@/redux/api/interface";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const customerName = (c: IOrder["customer"]) =>
  typeof c === "string" ? "—" : `${c.firstName} ${c.lastName}`;

const OrdersTable = ({ status }: { status: string }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = PAGE_SIZE.sm;

  const { data, isError, isFetching, error, refetch } = useGetOrdersQuery({
    pageNumber,
    pageSize,
    searchTerm,
    fulfillmentStatus:
      status === "fulfilled"
        ? "shipped,delivered"
        : status === "unfulfilled"
          ? "unfulfilled"
          : undefined,
  });

  const rows = useMemo(() => data?.data.data ?? [], [data]);

  const columns: ColumnDef<IOrder>[] = [
    {
      header: "ORDER",
      accessorKey: "orderNumber",
      cell: ({ row }) => (
        <Typography variant="p-s" fontWeight="bold" className="font-mono">
          {row.original.orderNumber}
        </Typography>
      ),
    },
    {
      header: "CUSTOMER",
      accessorKey: "customer",
      cell: ({ row }) => (
        <Typography variant="p-s" color="N600">
          {customerName(row.original.customer)}
        </Typography>
      ),
    },
    {
      header: "STATUS",
      accessorKey: "status",
      cell: ({ row }) => <Badge status={row.original.status} />,
    },
    {
      header: "DATE",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <Typography variant="p-s" color="N600">
          {new Date(row.original.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Typography>
      ),
    },
    {
      header: "ITEMS",
      accessorKey: "items",
      cell: ({ row }) => (
        <Typography variant="p-s" color="N600">
          {row.original.items.length}
        </Typography>
      ),
    },
    {
      header: "TOTAL",
      accessorKey: "grandTotal",
      cell: ({ row }) => (
        <Typography variant="p-s" fontWeight="bold">
          {money(row.original.grandTotal)}
        </Typography>
      ),
    },
    {
      header: "PAYMENT",
      accessorKey: "paymentStatus",
      cell: ({ row }) => <Badge status={row.original.paymentStatus} />,
    },
    {
      header: "FULFILLMENT",
      accessorKey: "fulfillmentStatus",
      cell: ({ row }) => <Badge status={row.original.fulfillmentStatus} />,
    },
    {
      header: "",
      id: "action",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            navigate(`${AuthRouteConfig.ORDERS}/${row.original._id}`)
          }
        >
          View
        </Button>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="h-[50vh] w-full">
        <NetworkError isFetching={isFetching} error={error} refetch={refetch} />
      </div>
    );
  }

  return (
    <section className="bg-white border border-N30 mt-6">
      <TMTable<IOrder>
        columns={columns}
        data={rows}
        loading={isFetching}
        headerData={
          <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4">
            <Typography variant="h-s" fontWeight="bold">
              Orders
            </Typography>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-N400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search order # or customer..."
                className="w-full pl-10 pr-4 py-2 border border-N40 rounded-lg text-sm focus:outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPageNumber(1);
                }}
              />
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
  );
};

export default OrdersTable;
