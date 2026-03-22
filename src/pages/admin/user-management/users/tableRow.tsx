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
  notify,
} from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import AddUserForm from "./UserForm";
import { useState } from "react";
import { AssignClaim } from "./AssignClaim";
import { AssignRole } from "./AssignRole";
import type { IUser } from "@/redux/api";
import type { ISelectItemProps } from "@/redux/api/interface";
import { useDeleteUserByIdMutation } from "@/redux/api/users";
import { getErrorMessage } from "@/utils/getErrorMessges";
import type { IApiError } from "@/redux/api/genericInterface";

export const userColumns = (roles: ISelectItemProps[]) => {
  const cols: ColumnDef<IUser>[] = [
    {
      header: "Full Name",
      accessorKey: "firstName",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={"sm"}
            fullname={`${row.original.firstName}   ${row.original.lastName}`}
            src={row.original.profilePicture}
          />
          <div className="flex flex-col">
            <Typography variant={"p-s"} color="N500" fontWeight="bold">
              {`${row.original.firstName}   ${row.original.lastName}`}
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
          --
        </Typography>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => {
        const role = row.original.role;

        return <div className="flex items-center gap-2">{role.name}</div>;
      },
    },

    {
      header: "Claims",
      accessorKey: "role.permissions",
      cell: ({ row }) => {
        const claims = row.original.role.permissions;

        return (
          <div className="flex items-center gap-2">{claims?.length ?? 0}</div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge status={row.original.isActive ? "active" : "archived"}>
          {row.original.isActive ? "Active" : "Disabled"}
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

        const [deleteUser, { isLoading }] = useDeleteUserByIdMutation();

        const actions: ButtonDropdownItem[] = [
          {
            name: "Assign Claim",
            icon: <ShieldCheck size={14} />,
            onClick: () => setOpenAssignClaim(true),
          },
          {
            name: "Change Role",
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

        const handleDeleteUser = async (id: string) => {
          try {
            await deleteUser({ id }).unwrap();
            notify.success({
              message: `Deleted Successfully`,
              subtitle: `You have successfully deleted ${user.firstName} `,
            });
            setOpenDelete(false);
          } catch (err) {
            notify.error({
              message: "Action failed",
              subtitle: getErrorMessage(err),
            });
          }
        };

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
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: {
                      label: user.role.name,
                      value: user.role._id,
                    },
                  }}
                  roles={roles}
                />
              </Modal>
            )}
            <ConfirmationModal
              isOpen={openDelete}
              closeModal={() => setOpenDelete(false)}
              formTitle="Delete User"
              message={`Are you sure you want to delete ${row.original.firstName}   ${row.original.lastName}`}
              buttonLabel="Yes, Delete"
              handleClick={() => handleDeleteUser(user._id)}
              type="delete"
              isLoading={isLoading}
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
              title="Change Role"
              mobileLayoutType="full"
            >
              <AssignRole
                closeModal={() => setOpenAssignRole(false)}
                editData={row.original ?? null}
                allRoles={roles}
              />
            </Modal>
          </div>
        );
      },
    },
  ];

  return cols;
};
