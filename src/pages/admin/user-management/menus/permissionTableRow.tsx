import { ConfirmationModal, notify, ActionButton } from "@/components";
import type { ColumnDef } from "@tanstack/react-table";

import { getErrorMessage } from "@/utils/getErrorMessges";
import { useState } from "react";

import { useRemovePermissionFromGroupMutation } from "@/redux/api/groups";
import type { IPermission } from "@/redux/api/permissions";

export const permissionsColumns = (
  pageSize: number,
  pageNumber: number,
  groupId: string,
) => {
  const cols: ColumnDef<IPermission>[] = [
    {
      header: "S/N",
      accessorKey: "id",
      cell: ({ cell: { row } }) => (
        <div>
          <span>{pageSize * (pageNumber - 1) + (row.index + 1)}</span>
        </div>
      ),
    },
    {
      header: "Permission Name",
      accessorKey: "name",
    },
    {
      header: "Action",
      id: "action",
      cell: ({ row }) => {
        const permission = row.original;
        const [openDelete, setOpenDelete] = useState(false);

        const [deleteGroup, { isLoading }] =
          useRemovePermissionFromGroupMutation();

        const handleDeleteGroup = async (id: string) => {
          try {
            await deleteGroup({ id: groupId, permissionId: id }).unwrap();
            notify.success({
              message: `Deleted Successfully`,
              subtitle: `You have successfully deleted ${permission.name} `,
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
            <div className="flex gap-4">
              <ActionButton
                variant="danger"
                onClick={() => {
                  setOpenDelete(true);
                }}
              />
            </div>
            <ConfirmationModal
              isOpen={openDelete}
              closeModal={() => setOpenDelete(false)}
              formTitle="Delete Group"
              message={`Are you sure you want to delete ${row.original.name} `}
              buttonLabel="Yes, Delete"
              handleClick={() => handleDeleteGroup(permission._id)}
              type="delete"
              isLoading={isLoading}
            />
          </div>
        );
      },
    },
  ];

  return cols;
};
