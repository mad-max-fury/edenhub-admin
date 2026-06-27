import { Badge, Typography } from "@/components";
import { ButtonDropdown } from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Archive,
  ArchiveRestore,
  Boxes,
  Layers,
} from "lucide-react";

export type ProductStatus = "active" | "archived" | "drafted";

export type ProductRow = {
  _id: string;
  name: string;
  image: string;
  creationDate: string;
  sku: string;
  variants: string;
  price: number;
  quantity: number;
  status: ProductStatus;
};

export interface ProductRowActions {
  onView: (p: ProductRow) => void;
  onEdit: (p: ProductRow) => void;
  onUpdateStock: (p: ProductRow) => void;
  onManageVariants: (p: ProductRow) => void;
  onArchive: (p: ProductRow) => void;
  onRestore: (p: ProductRow) => void;
  onDelete: (p: ProductRow) => void;
}

const ActionCell = ({
  product,
  actions,
}: {
  product: ProductRow;
  actions: ProductRowActions;
}) => {
  const rowActions = [
    {
      name: "View Product",
      icon: <Eye size={14} />,
      onClick: () => actions.onView(product),
    },
    {
      name: "Edit Details",
      icon: <Edit size={14} />,
      onClick: () => actions.onEdit(product),
    },
    {
      name: "Update Stock",
      icon: <Boxes size={14} />,
      onClick: () => actions.onUpdateStock(product),
    },
    {
      name: "Manage Variants",
      icon: <Layers size={14} />,
      onClick: () => actions.onManageVariants(product),
    },
    product.status === "archived"
      ? {
          name: "Restore Product",
          icon: <ArchiveRestore size={14} />,
          onClick: () => actions.onRestore(product),
        }
      : {
          name: "Archive Product",
          icon: <Archive size={14} />,
          onClick: () => actions.onArchive(product),
        },
    {
      name: "Delete Product",
      icon: <Trash2 size={14} />,
      textColor: "R500" as any,
      onClick: () => actions.onDelete(product),
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
    </div>
  );
};

export const getProductColumns = (
  actions: ProductRowActions,
): ColumnDef<ProductRow>[] => [
  {
    header: "NAME",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-N20 shrink-0 border border-N30">
          {row.original.image ? (
            <img
              src={row.original.image}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : null}
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
    header: "SKU / VARIANTS",
    accessorKey: "sku",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <Typography variant="p-s" color="N600" className="font-mono">
          {row.original.sku}
        </Typography>
        <Typography variant="c-s" color="N400">
          {row.original.variants}
        </Typography>
      </div>
    ),
  },
  {
    header: "PRICE",
    accessorKey: "price",
    cell: ({ row }) => (
      <Typography variant="p-s" fontWeight="bold">
        ₦{row.original.price.toLocaleString()}
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
    cell: ({ row }) => <ActionCell product={row.original} actions={actions} />,
  },
];
