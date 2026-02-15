import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  Mail,
  Shield,
} from "lucide-react";
import {
  Typography,
  TMTable,
  ButtonDropdown,
  Badge,
  Button,
  Avatar,
} from "@/components";
import type { ColumnDef } from "@tanstack/react-table";

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  staffId: string;
  role: "Super Admin" | "Admin" | "Employee";
  status: "active" | "inactive";
};

const MOCK_USERS: UserRow[] = [
  {
    id: "1",
    fullName: "John Chukwunonso",
    email: "j.chukwunonso@genesystechhub.com",
    staffId: "GC130",
    role: "Super Admin",
    status: "active",
  },
  {
    id: "2",
    fullName: "Sophia Muo",
    email: "s.muo@genesystechhub.com",
    staffId: "TC130105",
    role: "Admin",
    status: "active",
  },
  {
    id: "3",
    fullName: "Chukwudi Umunakwe",
    email: "c.umunakwe@genesystechhub.com",
    staffId: "TC130106",
    role: "Employee",
    status: "inactive",
  },
  {
    id: "4",
    fullName: "Udochi Kaduru",
    email: "u.kaduru@genesystechhub.com",
    staffId: "TC130107",
    role: "Employee",
    status: "active",
  },
];

export const userColumns: ColumnDef<UserRow>[] = [
  {
    header: "Full Name",
    accessorKey: "fullName",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar size={"md"} fullname={row.original.fullName} />
        <div className="flex flex-col">
          <Typography variant="p-s" fontWeight="bold">
            {row.original.fullName}
          </Typography>
          <Typography
            variant="c-s"
            color="N500"
            className="flex items-center gap-1 lowercase"
          >
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
    cell: () => (
      <button className="p-2 hover:bg-N10 rounded-lg text-N500 transition-colors">
        <MoreVertical size={18} />
      </button>
    ),
  },
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRole, setActiveRole] = useState("All Roles");

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.staffId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        activeRole === "All Roles" || user.role === activeRole;

      return matchesSearch && matchesRole;
    });
  }, [searchTerm, activeRole]);

  const roleFilters = [
    { name: "All Roles", onClick: () => setActiveRole("All Roles") },
    { name: "Super Admin", onClick: () => setActiveRole("Super Admin") },
    { name: "Admin", onClick: () => setActiveRole("Admin") },
    { name: "Employee", onClick: () => setActiveRole("Employee") },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="px-1">
          <Typography variant="h-m" fontWeight="bold">
            Users List
          </Typography>
          <Typography variant="p-s" color="N500">
            Manage access and track your team members.
          </Typography>
        </div>
        <Button size="sm">
          <div className="flex items-center gap-2">
            <UserPlus size={18} />
            <span>Add User</span>
          </div>
        </Button>
      </div>

      <section className="bg-white border border-N30  ">
        <TMTable<UserRow>
          columns={userColumns}
          data={filteredUsers}
          loading={false}
          headerData={
            <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-N400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search name, email, or staff ID..."
                  className="w-full pl-10 pr-4 py-2.5 border border-N40 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-B100 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <ButtonDropdown
                  buttonGroup={roleFilters}
                  triggerIcon={<Filter size={18} />}
                />
              </div>
            </div>
          }
          className="border-none"
          headerClassName="bg-N10 text-N700 uppercase tracking-wider text-[11px] font-bold"
          pageSize={10}
          totalCount={filteredUsers.length}
        />
      </section>
    </div>
  );
};

export default Users;
