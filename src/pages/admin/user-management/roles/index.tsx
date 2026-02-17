import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import {
  Typography,
  TMTable,
  Button,
  Modal,
  ActionButton,
  ConfirmationModal,
} from "@/components";
import type { ColumnDef } from "@tanstack/react-table";
import EditOrCreateRole from "./EditOrCreateRole";

type RoleRow = {
  id: string;
  sn: number;
  name: string;
  permissions: number;
  staffCount: number;
};

const MOCK_ROLES: RoleRow[] = [
  { id: "1", sn: 1, name: "Admin", permissions: 12, staffCount: 4 },
  { id: "2", sn: 2, name: "Super Admin", permissions: 8, staffCount: 1 },
  { id: "3", sn: 3, name: "Human Resource", permissions: 0, staffCount: 0 },
];

const RolesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleRow | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  const roleColumns: ColumnDef<RoleRow>[] = [
    {
      header: "SN",
      accessorKey: "sn",
      cell: ({ row }) => (
        <Typography variant="p-s" color="N700">
          {row.original.sn}
        </Typography>
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
          {row.original.permissions}
        </Typography>
      ),
    },
    {
      header: "Staff",
      accessorKey: "staffCount",
      cell: ({ row }) => (
        <Typography
          variant="p-s"
          color="B400"
          className="underline cursor-pointer"
        >
          {row.original.staffCount}
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
            disabled={Number(row.original.staffCount) !== 0}
            onClick={() => {
              setSelectedRole(row.original);
              setOpenDelete(true);
            }}
          />
        </div>
      ),
    },
  ];

  const filteredRoles = useMemo(() => {
    return MOCK_ROLES.filter((role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

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
            setSelectedRole(null);
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
        <TMTable<RoleRow>
          columns={roleColumns}
          data={filteredRoles}
          loading={false}
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
          pageSize={10}
          totalCount={filteredRoles.length}
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
            setSelectedRole(null);
          }}
          initialData={selectedRole ? { name: "", permissions: [] } : undefined}
        />
      </Modal>

      <ConfirmationModal
        isOpen={openDelete}
        closeModal={() => setOpenDelete(false)}
        handleClick={() => setOpenDelete(false)}
        formTitle="Delete Role"
        message={
          <p>
            Are you sure you want to delete{" "}
            <span className="text-R400">{selectedRole?.name}</span>? This action
            cannot be undone.
          </p>
        }
        isLoading={false}
        type={"delete"}
        buttonLabel="Yes, Delete"
      />
    </div>
  );
};

export default RolesManagement;
