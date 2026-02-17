import { useState } from "react";
import {
  Badge,
  ButtonDropdown,
  ConfirmationModal,
  Typography,
} from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Archive,
  ArrowUpRight,
} from "lucide-react";

export type ProductRow = {
  name: string;
  image: string;
  creationDate: string;
  sku: string;
  variants: string;
  price: number;
  quantity: number;
  status: "active" | "archived" | "drafted";
};

const ActionCell = ({ product }: { product: ProductRow }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const rowActions = [
    {
      name: "View Product",
      icon: <Eye size={14} />,
      onClick: () => window.open(`/admin/products/view`, "_blank"),
    },
    {
      name: "Edit Details",
      icon: <Edit size={14} />,
      onClick: () => {},
    },
    {
      name: "Archive Product",
      icon: <Archive size={14} />,
      onClick: () => {},
    },
    {
      name: "Delete Product",
      icon: <Trash2 size={14} />,
      textColor: "R500" as any,
      onClick: () => setIsDeleteModalOpen(true),
      className: "hover:bg-R50",
    },
  ];

  return (
    <div className="flex justify-center">
      <ButtonDropdown
        buttonGroup={rowActions}
        triggerIcon={<MoreVertical size={18} />}
        className="h-8 px-1 border-none"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        formTitle="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action will permanently remove the product and its history from the store.`}
        buttonLabel="Delete Product"
        handleClick={() => {
          setIsProcessing(true);
          setTimeout(() => {
            setIsProcessing(false);
            setIsDeleteModalOpen(false);
          }, 1000);
        }}
        type="delete"
        isLoading={isProcessing}
      />
    </div>
  );
};

export const productColumns: ColumnDef<ProductRow>[] = [
  {
    header: "NAME",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-N20 shrink-0 border border-N30">
          <img
            src={row.original.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <Typography variant="p-m" fontWeight="medium">
          {row.original.name}
        </Typography>
      </div>
    ),
  },
  {
    header: "CREATION DATE",
    accessorKey: "creationDate",
    cell: ({ row }) => (
      <Typography variant="p-s" color="N600">
        {row.original.creationDate}
      </Typography>
    ),
  },
  {
    header: "PRODUCT SKU",
    accessorKey: "sku",
    cell: ({ row }) => (
      <Typography variant="p-s" color="N600" className="font-mono">
        {row.original.sku}
      </Typography>
    ),
  },
  {
    header: "VARIANTS",
    accessorKey: "variants",
    cell: ({ row }) => (
      <Typography variant="p-s" color="N600">
        {row.original.variants}
      </Typography>
    ),
  },
  {
    header: "PRICE",
    accessorKey: "price",
    cell: ({ row }) => (
      <Typography variant="p-s" fontWeight="bold">
        ${row.original.price.toLocaleString()}
      </Typography>
    ),
  },
  {
    header: "QUANTITY",
    accessorKey: "quantity",
    cell: ({ row }) => (
      <Typography
        variant="p-s"
        color={row.original.quantity < 5 ? "R500" : "N600"}
      >
        {row.original.quantity} items
      </Typography>
    ),
  },
  {
    header: "STATUS",
    accessorKey: "status",
    cell: ({ row }) => <Badge status={row.original.status} />,
  },
  {
    header: () => (
      <div className="flex items-center justify-center">
        <Typography variant="c-m">ACTION</Typography>
      </div>
    ),
    id: "action",
    cell: ({ row }) => <ActionCell product={row.original} />,
  },
];
