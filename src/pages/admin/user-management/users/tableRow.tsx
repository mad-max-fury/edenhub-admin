import {
  Edit3,
  MoreVertical,
  ShieldCheck,
  Trash2,
  UserCog,
} from "lucide-react";
import {
  Typography,
  ButtonDropdown,
  Badge,
  Avatar,
  type ButtonDropdownItem,
  Modal,
  ConfirmationModal,
} from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import AddUserForm from "./UserForm";
import { useState } from "react";
import { AssignClaim } from "./AssignClaim";
import { AssignRole } from "./AssignRole";

export type UserRow = {
  id: string;
  fullName: string;
  email: string;
  staffId: string;
  role: "Super Admin" | "Admin" | "Employee";
  status: "active" | "inactive";
  claims: number;
};

export const userColumns: ColumnDef<UserRow>[] = [
  {
    header: "Full Name",
    accessorKey: "fullName",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar size={"sm"} fullname={row.original.fullName} />
        <div className="flex flex-col">
          <Typography variant={"p-s"} color="N500" fontWeight="bold">
            {row.original.fullName}
          </Typography>
          <Typography color={"text-light"} variant={"c-s"}>
            {row.original.email}
          </Typography>
        </div>
      </div>
    ),
  },
  {
    header: "Staff ID",
    accessorKey: "staffId",
    cell: ({ row }) => (
      <Typography variant="p-s" className="font-mono text-N600">
        {row.original.staffId}
      </Typography>
    ),
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: ({ row }) => {
      const role = row.original.role;

      return <div className="flex items-center gap-2">{role}</div>;
    },
  },

  {
    header: "Claims",
    accessorKey: "claims",
    cell: ({ row }) => {
      const claims = row.original.claims;

      return <div className="flex items-center gap-2">{claims}</div>;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge status={row.original.status === "active" ? "active" : "archived"}>
        {row.original.status === "active" ? "Active" : "Disabled"}
      </Badge>
    ),
  },
  {
    header: "Action",
    id: "action",
    cell: ({ row }) => {
      const user = row.original;
      const [editDetail, setEditDetail] = useState(false);
      const [openDelete, setOpenDelete] = useState(false);
      const [openAssignClaim, setOpenAssignClaim] = useState(false);
      const [openAssignRole, setOpenAssignRole] = useState(false);

      const actions: ButtonDropdownItem[] = [
        {
          name: "Assign Claim",
          icon: <ShieldCheck size={14} />,
          onClick: () => setOpenAssignClaim(true),
        },
        {
          name: "Assign Role",
          icon: <UserCog size={14} />,
          onClick: () => setOpenAssignRole(true),
        },
        {
          name: "Edit Detail",
          icon: <Edit3 size={14} />,
          onClick: () => setEditDetail(true),
        },
        {
          name: "Delete User",
          icon: <Trash2 size={14} className="text-R400" />,
          onClick: () => setOpenDelete(true),
          textColor: "R400",
        },
      ];

      return (
        <div className="flex justify-start w-fit">
          <ButtonDropdown
            buttonGroup={actions}
            triggerIcon={<MoreVertical size={18} className="text-N500" />}
          />
          {editDetail && (
            <Modal
              isOpen={editDetail}
              onClose={() => {
                setEditDetail(false);
              }}
              title={"Edit User Details"}
              mobileLayoutType="full"
            >
              <AddUserForm
                onClose={() => setEditDetail(false)}
                initialData={{
                  fullName: user.fullName,
                  email: user.email,
                  staffId: user.staffId,
                  role: {
                    label: user.role,
                    value: user.role,
                  },
                }}
              />
            </Modal>
          )}
          <ConfirmationModal
            isOpen={openDelete}
            closeModal={() => setOpenDelete(false)}
            formTitle="Delete User"
            message={`Are you sure you want to delete ${row.original.fullName}`}
            buttonLabel="Yes, Delete"
            handleClick={() => {
              setOpenDelete(false);
            }}
            type="delete"
            isLoading={false}
          />
          <Modal
            isOpen={openAssignClaim}
            onClose={() => setOpenAssignClaim(false)}
            title="Assign Claim"
            mobileLayoutType="full"
          >
            <AssignClaim
              closeModal={() => setOpenAssignClaim(false)}
              editData={row.original ?? null}
            />
          </Modal>
          <Modal
            isOpen={openAssignRole}
            onClose={() => setOpenAssignRole(false)}
            title="Assign Role"
            mobileLayoutType="full"
          >
            <AssignRole
              closeModal={() => setOpenAssignRole(false)}
              editData={row.original ?? null}
              allRoles={[
                {
                  label: "Super Admin",
                  value: "",
                },
                { label: "Admin", value: "" },
                { label: "Employee", value: "" },
              ]}
            />
          </Modal>
        </div>
      );
    },
  },
];
