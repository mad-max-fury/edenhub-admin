import { Modal, ConfirmationModal, notify, ActionButton } from "@/components";
import type { ColumnDef } from "@tanstack/react-table";

import { getErrorMessage } from "@/utils/getErrorMessges";
import { useDeleteGroupByIdMutation, type IGroup } from "@/redux/api/groups";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthRouteConfig } from "@/constants/routes";
import { AddOrEditMenu } from "./AddOrEditMenu";

export const groupColumns = (pageSize: number, pageNumber: number) => {
  const cols: ColumnDef<IGroup>[] = [
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
      header: "Group Name",
      accessorKey: "name",
    },

    {
      header: "Claims",
      accessorKey: "permissions",
      cell: ({ row }) => {
        const claims = row.original.permissions;

        return (
          <div className="flex items-center gap-2">{claims.length ?? 0}</div>
        );
      },
    },
    {
      header: "Action",
      id: "action",
      cell: ({ row }) => {
        const group = row.original;
        const [editDetail, setEditDetail] = useState(false);
        const [openDelete, setOpenDelete] = useState(false);

        const [deleteGroup, { isLoading }] = useDeleteGroupByIdMutation();

        const handleDeleteGroup = async (id: string) => {
          try {
            await deleteGroup({ id }).unwrap();
            notify.success({
              message: `Deleted Successfully`,
              subtitle: `You have successfully deleted ${group.name} `,
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
              <Link
                className="duration-600 flex h-[40px] w-fit items-center justify-center rounded-[4px] px-3 text-BR500 transition-all ease-in-out hover:bg-BR50 disabled:bg-N0 disabled:text-N50"
                to={`${AuthRouteConfig.USER_MANAGEMENT_MANAGE_MENU}/${row?.original._id}`}
                state={{
                  name: row?.original.name,
                  id: row?.original._id,
                }}
              >
                Manage Claims
              </Link>
              <ActionButton
                variant="info"
                onClick={() => {
                  setEditDetail(true);
                }}
              />
              <ActionButton
                variant="danger"
                disabled={row.original.permissions.length > 0}
                onClick={() => {
                  setOpenDelete(true);
                }}
              />
            </div>
            {editDetail && (
              <Modal
                isOpen={editDetail}
                onClose={() => {
                  setEditDetail(false);
                }}
                title={"Edit User Details"}
                mobileLayoutType="full"
              >
                <AddOrEditMenu
                  closeModal={() => setEditDetail(false)}
                  editData={group}
                />
              </Modal>
            )}
            <ConfirmationModal
              isOpen={openDelete}
              closeModal={() => setOpenDelete(false)}
              formTitle="Delete Group"
              message={`Are you sure you want to delete ${row.original.name} `}
              buttonLabel="Yes, Delete"
              handleClick={() => handleDeleteGroup(group._id)}
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
