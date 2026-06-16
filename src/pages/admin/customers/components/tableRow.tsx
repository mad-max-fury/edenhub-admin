import { useState } from "react";
import {
  Badge,
  ButtonDropdown,
  ConfirmationModal,
  Drawer,
  Modal,
  Typography,
  notify,
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
import {
  useDeleteUserByIdMutation,
  useUpdateUserByIdMutation,
} from "@/redux/api/users";
import { useGetOrdersQuery } from "@/redux/api/orders";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { CustomerPreview } from "./customerPreview";
import { EditCustomerForm } from "./editCustomer";
import { SendEmailForm } from "./sendMail";

export type CustomerRow = {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  joinedOn: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  country?: string;
  status: "Active" | "Inactive";
};

const ActionCell = ({ customer }: { customer: CustomerRow }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendMailOpen, setIsSendMailOpen] = useState(false);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [confirm, setConfirm] = useState<null | "suspend" | "delete">(null);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserByIdMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserByIdMutation();

  // Only fetch the customer's orders once the preview drawer is opened.
  const { data: ordersRes } = useGetOrdersQuery(
    { pageNumber: 1, pageSize: 20, customer: customer._id },
    { skip: !isPreviewOpen },
  );
  const orders = ordersRes?.data.data ?? [];
  const amountSpent = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((s, o) => s + o.grandTotal, 0);
  const recentOrders = orders.map((o) => ({
    id: o.orderNumber,
    date: new Date(o.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    payment: o.paymentStatus,
    total: `₦${o.grandTotal.toLocaleString()}`,
    items: `${o.items.length} Item${o.items.length === 1 ? "" : "s"}`,
    fulfillment: o.fulfillmentStatus,
  }));

  const isActive = customer.status === "Active";

  const toggleSuspend = async () => {
    try {
      await updateUser({
        id: customer._id,
        user: { isActive: !isActive },
      }).unwrap();
      notify.success({
        message: isActive ? "Account suspended" : "Account reactivated",
        subtitle: `${customer.name} is now ${isActive ? "inactive" : "active"}`,
      });
      setConfirm(null);
    } catch (err) {
      notify.error({ message: "Action failed", subtitle: getErrorMessage(err) });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser({ id: customer._id }).unwrap();
      notify.success({
        message: "Customer deleted",
        subtitle: `${customer.name} was removed`,
      });
      setConfirm(null);
    } catch (err) {
      notify.error({ message: "Delete failed", subtitle: getErrorMessage(err) });
    }
  };

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
      name: isActive ? "Suspend Account" : "Reactivate Account",
      icon: <Slash size={14} />,
      onClick: () => setConfirm("suspend"),
      className: "hover:bg-Y50 text-Y600",
    },
    {
      name: "Delete Customer",
      icon: <Trash2 size={14} />,
      textColor: "R500" as any,
      onClick: () => setConfirm("delete"),
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
        isOpen={confirm === "suspend"}
        closeModal={() => setConfirm(null)}
        formTitle={isActive ? "Suspend Account" : "Reactivate Account"}
        message={
          <Typography variant="p-m" color="N700">
            {isActive
              ? `Suspend ${customer.name}'s account? They will lose access immediately.`
              : `Reactivate ${customer.name}'s account?`}
          </Typography>
        }
        buttonLabel={isActive ? "Suspend User" : "Reactivate"}
        handleClick={toggleSuspend}
        type="confirm"
        isLoading={isUpdating}
      />

      <ConfirmationModal
        isOpen={confirm === "delete"}
        closeModal={() => setConfirm(null)}
        formTitle="Delete Customer"
        message={
          <Typography variant="p-m" color="N700">
            This permanently deletes {customer.name}'s account and all associated
            data.
          </Typography>
        }
        buttonLabel="Delete Customer"
        handleClick={handleDelete}
        type="delete"
        isLoading={isDeleting}
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
        <div className="h-[95vh] my-auto w-full bg-white p-8 border overflow-auto">
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
              name: customer.name,
              avatar: customer.avatar,
              status: customer.status,
              amountSpent: `₦${amountSpent.toLocaleString()}`,
              totalOrders: String(orders.length).padStart(3, "0"),
              registeredOn: customer.joinedOn,
              firstOrderDate:
                recentOrders[recentOrders.length - 1]?.date ?? "—",
              address: customer.address,
              email: customer.email,
              phone: customer.phone,
              recentOrders,
            }}
          />
        </div>
      </Drawer>
    </div>
  );
};

export const customerColumns = (): ColumnDef<CustomerRow>[] => [
  {
    header: () => (
      <div className="flex items-center gap-2">
        <Square className="text-N40 w-4 h-4" />
        <Typography variant="c-m">NAME</Typography>
      </div>
    ),
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        {row.original.avatar ? (
          <img
            src={row.original.avatar}
            alt=""
            className="w-8 h-8 rounded-full object-cover border border-N30"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-B50 text-B400 flex items-center justify-center text-xs font-bold">
            {row.original.name.charAt(0).toUpperCase()}
          </div>
        )}
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
    header: "PHONE",
    accessorKey: "phone",
    cell: ({ row }) => (
      <Typography variant="p-s" color="N600">
        {row.original.phone}
      </Typography>
    ),
  },
  {
    header: "LOCATION",
    accessorKey: "address",
    cell: ({ row }) => (
      <Typography variant="p-s" color="N600" className="max-w-[200px] truncate">
        {row.original.address}
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
    cell: ({ row }) => <ActionCell customer={row.original} />,
  },
];
