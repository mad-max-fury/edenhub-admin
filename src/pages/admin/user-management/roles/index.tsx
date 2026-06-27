import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import {
  Typography,
  TMTable,
  Button,
  Modal,
  ActionButton,
  ConfirmationModal,
  NetworkError,
  Spinner,
  notify,
} from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import EditOrCreateRole from "./EditOrCreateRole";
import {
  useDeleteRoleByIdMutation,
  useGetRolesQuery,
  type IRole,
} from "@/redux/api/roles";
import { PAGE_SIZE } from "@/constants/data";
import type { IPaginationMetadataResponse } from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";

const RolesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRole | undefined>(
    undefined,
  );
  const [openDelete, setOpenDelete] = useState(false);

  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleByIdMutation();

  const pageSize = PAGE_SIZE.md;

  const { data, isError, isLoading, error, refetch, isFetching } =
    useGetRolesQuery({
      pageNumber,
      searchTerm,
      pageSize,
    });

  const roleColumns: ColumnDef<IRole>[] = [
    {
      header: "SN",
      accessorKey: "id",
      cell: ({ cell: { row } }) => (
        <div>
          <span>{pageSize * (pageNumber - 1) + (row.index + 1)}</span>
        </div>
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <Typography variant="p-s" fontWeight="medium" color="N700">
          {row.original.name}
        </Typography>
      ),
    },
    {
      header: "Permissions",
      accessorKey: "permissions",
      cell: ({ row }) => (
        <Typography variant="p-s" color="N600">
          {row.original.permissions.length}
        </Typography>
      ),
    },
    {
      header: "Groups",
      accessorKey: "groups",
      cell: ({ row }) => (
        <Typography
          variant="p-s"
          color="B400"
          className="underline cursor-pointer"
        >
          {row.original.groups.length}
        </Typography>
      ),
    },
    {
      header: "Action",
      id: "action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ActionButton
            variant="info"
            onClick={() => {
              setSelectedRole(row.original);
              setIsModalOpen(true);
            }}
          />

          <ActionButton
            variant="danger"
            onClick={() => {
              setSelectedRole(row.original);
              setOpenDelete(true);
            }}
          />
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="h-[70vh] w-full">
        <NetworkError isFetching={isFetching} error={error} refetch={refetch} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[70vh] w-full">
        <Spinner />
      </div>
    );
  }

  const handleDeleteRole = async (id: string) => {
    try {
      await deleteRole({ id: id }).unwrap();
      notify.success({
        message: `Deleted Successfully`,
        subtitle: `You have successfully deleted ${selectedRole?.name} `,
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
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="px-1">
          <Typography variant="h-m" fontWeight="bold">
            Roles
          </Typography>
          <Typography variant="p-s" color="N500">
            Manage roles
          </Typography>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setSelectedRole(undefined);
            setIsModalOpen(true);
          }}
        >
          <div className="flex items-center gap-2">
            <Plus size={14} />
            <span className="text-xs">Add Roles</span>
          </div>
        </Button>
      </div>
      <section className="bg-white border border-N30  ">
        <TMTable<IRole>
          columns={roleColumns}
          data={data?.data.data ?? []}
          loading={isFetching}
          headerData={
            <div className="border-b border-N30 px-6 py-4 flex justify-between items-center">
              <div className="relative w-full max-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-N400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-N40 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-B100 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          }
          className="border-none"
          headerClassName="bg-N10 text-N500 uppercase tracking-wider text-[11px] font-bold"
          metadata={data?.data.metadata as IPaginationMetadataResponse}
          hasPerformedQuery={searchTerm.length > 0}
        />
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRole ? "Edit Role" : "Create New Role"}
        mobileLayoutType="full"
      >
        <EditOrCreateRole
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRole(undefined);
          }}
          initialData={selectedRole}
        />
      </Modal>

      <ConfirmationModal
        isOpen={openDelete}
        closeModal={() => setOpenDelete(false)}
        handleClick={() => handleDeleteRole(selectedRole?._id as string)}
        formTitle="Delete Role"
        message={
          <p>
            Are you sure you want to delete{" "}
            <span className="text-R400">{selectedRole?.name}</span>? This action
            cannot be undone.
          </p>
        }
        isLoading={isDeleting}
        type={"delete"}
        buttonLabel="Yes, Delete"
      />
    </div>
  );
};

export default RolesManagement;
