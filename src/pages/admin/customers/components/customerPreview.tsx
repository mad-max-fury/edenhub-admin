import React from "react";
import { Typography, Badge } from "@/components";
import Card from "@/components/Cards/Card";
import { TMTable } from "@/components/table/table";
import type { ColumnDef } from "@tanstack/react-table";
import ImageWrapper from "@/components/imageLoader/ImageLoader";

interface Order {
  id: string;
  date: string;
  payment: "Success" | "Pending";
  total: string;
  items: string;
  fulfillment: "Fulfilled" | "Unfulfilled";
}

interface CustomerPreviewProps {
  customer: {
    name: string;
    avatar?: string;
    status: string;
    amountSpent: string;
    totalOrders: string;
    registeredOn: string;
    firstOrderDate: string;
    address: string;
    email: string;
    phone: string;
    recentOrders: Order[];
  };
}

const orderColumns: ColumnDef<Order>[] = [
  { header: "Order", accessorKey: "id" },
  { header: "Date", accessorKey: "date" },
  {
    header: "Payment",
    accessorKey: "payment",
    cell: ({ row }) => <Badge status={row.original.payment} />,
  },
  { header: "Total", accessorKey: "total" },
  { header: "Items", accessorKey: "items" },
  {
    header: "Fulfillment",
    accessorKey: "fulfillment",
    cell: ({ row }) => <Badge status={row.original.fulfillment} />,
  },
];

export const CustomerPreview: React.FC<CustomerPreviewProps> = ({
  customer,
}) => {
  const stats = [
    {
      title: "AMOUNT SPENT",
      value: customer.amountSpent,
      trend: "+ 36%",
      isUp: true,
    },
    {
      title: "TOTAL ORDERS",
      value: customer.totalOrders,
      trend: "+ 36%",
      isUp: true,
    },
    { title: "REGISTERED ON", value: customer.registeredOn },
  ];

  return (
    <div className="flex flex-col gap-8 h-[98vh]">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-100">
          <ImageWrapper
            src={customer.avatar as string}
            alt={customer.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Typography variant="h-m" fontWeight="bold">
              {customer.name}
            </Typography>
            <Badge status={customer.status} />
          </div>
          <Typography color="gray-normal">Customer</Typography>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            title={stat.title}
            price={stat.value}
            rate={36}
            isUp={true}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <Typography variant="h-s" fontWeight="bold">
          Customer Details
        </Typography>
        <div className="grid grid-cols-2 gap-y-6 border-b border-t border-gray-100 py-6">
          <div className="flex flex-col gap-1">
            <Typography variant="c-s" fontWeight="bold" color="gray-normal">
              First order
            </Typography>
            <Typography variant="p-m">{customer.firstOrderDate}</Typography>
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="c-s" fontWeight="bold" color="gray-normal">
              Customer Address
            </Typography>
            <Typography variant="p-m" className="max-w-[200px]">
              {customer.address}
            </Typography>
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="c-s" fontWeight="bold" color="gray-normal">
              Customer email address
            </Typography>
            <Typography variant="p-m">{customer.email}</Typography>
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="c-s" fontWeight="bold" color="gray-normal">
              Customer phone number
            </Typography>
            <Typography variant="p-m">{customer.phone}</Typography>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Typography variant="h-s" fontWeight="bold">
          Customer Orders
        </Typography>
        <TMTable
          columns={orderColumns}
          data={customer.recentOrders}
          loading={false}
          className="border-none shadow-none"
          headerClassName="bg-gray-50 text-[10px] uppercase font-bold text-gray-400"
        />
      </div>
    </div>
  );
};
