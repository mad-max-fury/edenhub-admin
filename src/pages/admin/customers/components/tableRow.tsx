import { useState } from "react";
import {
  Badge,
  ButtonDropdown,
  ConfirmationModal,
  Drawer,
  Modal,
  Typography,
} from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Square,
  Eye,
  Edit,
  Trash2,
  Mail,
  MoreVertical,
  Slash,
  X,
} from "lucide-react";
import { CustomerPreview } from "./customerPreview";
import { EditCustomerForm } from "./editCustomer";
import { SendEmailForm } from "./sendMail";

export type CustomerRow = {
  name: string;
  avatar?: string;
  joinedOn: string;
  email: string;
  phone: string;
  address: string;
  orders: number;
  price: string;
  quantity: number;
  subscription: "Subscribed" | "Not Subscribed";
  recentOrders?: Array<{
    id: string;
    date: string;
    payment: "Success" | "Pending";
    total: string;
    items: string;
    fulfillment: "Fulfilled" | "Unfulfilled";
  }>;
};

const ActionCell = ({
  customer,
  navigate,
}: {
  customer: CustomerRow;
  navigate: (path: string) => void;
}) => {
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "delete" | "confirm" | "warning";
    title: string;
    message: string;
    actionLabel: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
    actionLabel: "",
    onConfirm: () => {},
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendMailOpen, setIsSendMailOpen] = useState(false);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);

  const closeModal = () =>
    setModalConfig((prev) => ({ ...prev, isOpen: false }));

  const rowActions = [
    {
      name: "View Profile",
      icon: <Eye size={14} />,
      onClick: () => setIsPreviewOpen(true),
    },
    {
      name: "Send Email",
      icon: <Mail size={14} />,
      onClick: () => setIsSendMailOpen(true),
    },
    {
      name: "Edit Details",
      icon: <Edit size={14} />,
      onClick: () => setIsEditDetailsOpen(true),
    },
    {
      name: "Suspend Account",
      icon: <Slash size={14} />,
      onClick: () =>
        setModalConfig({
          isOpen: true,
          type: "warning",
          title: "Suspend Account",
          message: `Are you sure you want to suspend ${customer.name}'s account? They will lose access to all services immediately.`,
          actionLabel: "Suspend User",
          onConfirm: () => {
            console.log("Suspending:", customer.name);
            closeModal();
          },
        }),
      className: "hover:bg-Y50 text-Y600",
    },
    {
      name: "Delete Customer",
      icon: <Trash2 size={14} />,
      textColor: "R500" as any,
      onClick: () =>
        setModalConfig({
          isOpen: true,
          type: "delete",
          title: "Delete Customer",
          message: `This action cannot be undone. This will permanently delete ${customer.name}'s account and all associated data.`,
          actionLabel: "Delete Customer",
          onConfirm: () => {
            console.log("Deleting:", customer.name);
            closeModal();
          },
        }),
      className: "hover:bg-R50",
    },
  ];

  return (
    <div className="flex justify-center">
      <ButtonDropdown
        buttonGroup={rowActions}
        triggerIcon={<MoreVertical size={18} />}
        className="h-8 px-1 text-[10px] border-none"
      />

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        closeModal={closeModal}
        formTitle={modalConfig.title}
        message={
          <Typography variant="p-m" color="N700">
            {modalConfig.message}
          </Typography>
        }
        buttonLabel={modalConfig.actionLabel}
        handleClick={modalConfig.onConfirm}
        type={modalConfig.type === "warning" ? "confirm" : modalConfig.type}
        isLoading={false}
      />

      <Modal
        mobileLayoutType="drawer"
        isOpen={isSendMailOpen}
        onClose={() => setIsSendMailOpen(false)}
        title="Send Email"
      >
        <SendEmailForm
          customer={customer}
          onClose={() => setIsSendMailOpen(false)}
        />
      </Modal>
      <Modal
        mobileLayoutType="drawer"
        isOpen={isEditDetailsOpen}
        onClose={() => setIsEditDetailsOpen(false)}
        title="Edit Customer Information"
      >
        <EditCustomerForm
          customer={customer}
          onClose={() => setIsEditDetailsOpen(false)}
        />
      </Modal>

      <Drawer
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        selector="portal"
        width="885px"
        className="bg-transparent"
      >
        <div className=" h-[95vh] my-auto w-full bg-white p-8 border overflow-auto">
          <div className="flex items-center justify-between gap-2 w-full mb-6">
            <Typography variant="h-l" fontWeight="medium">
              Customer Preview
            </Typography>
            <X
              size={25}
              className="cursor-pointer"
              onClick={() => setIsPreviewOpen(false)}
            />
          </div>
          <CustomerPreview
            customer={{
              ...customer,
              status: customer.subscription,
              amountSpent: `$${customer.price}`,
              totalOrders: customer.orders.toString().padStart(3, "0"),
              registeredOn: customer.joinedOn,
              firstOrderDate: customer.joinedOn,
              recentOrders: customer.recentOrders || [],
            }}
          />
        </div>
      </Drawer>
    </div>
  );
};

export const customerColumns = (
  navigate: (path: string) => void,
): ColumnDef<CustomerRow>[] => [
  {
    header: () => (
      <div className="flex items-center gap-2">
        <Square className="text-N40 w-4 h-4" />
        <Typography variant="c-m">NAME</Typography>
      </div>
    ),
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Square className="text-N40 w-4 h-4" />
        <Typography variant="p-m" fontWeight="medium">
          {row.original.name}
        </Typography>
      </div>
    ),
  },
  {
    header: "JOINED ON",
    accessorKey: "joinedOn",
    cell: ({ row }) => (
      <Typography variant="p-s" color="N600">
        {row.original.joinedOn}
      </Typography>
    ),
  },
  {
    header: "EMAIL ADDRESS",
    accessorKey: "email",
    cell: ({ row }) => (
      <Typography variant="p-s" color="N600">
        {row.original.email}
      </Typography>
    ),
  },
  {
    header: "ORDERS",
    accessorKey: "orders",
    cell: ({ row }) => (
      <Typography variant="p-s" color="N600">
        {row.original.orders} Orders
      </Typography>
    ),
  },
  {
    header: "PRICE",
    accessorKey: "price",
    cell: ({ row }) => (
      <Typography variant="p-s" fontWeight="medium">
        ${row.original.price}
      </Typography>
    ),
  },
  {
    header: "QUANTITY",
    accessorKey: "quantity",
    cell: ({ row }) => (
      <Typography variant="p-s" color="N600">
        {row.original.quantity} Items
      </Typography>
    ),
  },
  {
    header: "SUBSCRIPTION",
    accessorKey: "subscription",
    cell: ({ row }) => <Badge status={row.original.subscription} />,
  },
  {
    header: () => (
      <div className="flex items-center justify-center">
        <Typography variant="c-m">ACTION</Typography>
      </div>
    ),
    id: "action",
    cell: ({ row }) => (
      <ActionCell customer={row.original} navigate={navigate} />
    ),
  },
];
