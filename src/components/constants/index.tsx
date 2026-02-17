import { Badge, Button, Typography } from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDownIcon, Square } from "lucide-react";
import type { DashboardRow } from "@/components/constants/data";
import ImageWrapper from "../imageLoader/ImageLoader";

export const dashboadColumns = (
  navigate: (path: string) => void,
): ColumnDef<DashboardRow>[] => [
  {
    header: () => (
      <div className="flex items-center gap-2">
        <div>
          <span>
            <Square className="text-gray-200" />
          </span>
        </div>
        <p>Products</p>
      </div>
    ),
    id: "product",
    cell: ({ row }) => {
      const products = row.original.products;

      return (
        <div className="flex items-center gap-2 ml-2 ">
          <Square className="text-gray-200" />
          <div className="flex flex-col gap-2">
            {products.slice(0, 2).map((product, index) => (
              <div key={index} className="flex items-center gap-2">
                <ImageWrapper
                  src={product.image}
                  alt={product.name}
                  className="w-8 h-8 rounded object-cover"
                />

                <div className="flex flex-col">
                  <Typography variant="c-m" fontWeight={"medium"}>
                    {product.name}
                  </Typography>
                  <Typography color={"gray-normal"} variant={"p-s"}>
                    {product.packaging}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    header: "ORDER ID",
    accessorKey: "order",
    cell: ({ row }) => <span>ED-{row.original.order}</span>,
  },

  {
    header: () => (
      <div className="flex items-center gap-1">
        <p>Date</p>
        <div>
          <span>
            <ChevronsUpDownIcon size={16} />
          </span>
        </div>
      </div>
    ),
    accessorKey: "date",
  },
  { header: "Customer", accessorKey: "customer" },
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
  {
    header: "Action",
    id: "action",
    cell: ({ row }) => (
      <div>
        <Button
          variant="secondary"
          shape="rounded"
          types="outline"
          size={"sm"}
          onClick={() => navigate("/admin/order")}
        >
          View Order
        </Button>
      </div>
    ),
  },
];
