import { useState } from "react";
import { userColumns } from "./tableRow";
import {
  Button,
  ButtonDropdown,
  Modal,
  NetworkError,
  Spinner,
  TMTable,
  Typography,
} from "@/components";
import { Filter, Search, UserPlus } from "lucide-react";
import AddUserForm from "./UserForm";
import { useGetStaffsQuery } from "@/redux/api/users";
import { PAGE_SIZE } from "@/constants/data";
import type { IUser } from "@/redux/api";
import type {
  IPaginationMetadataResponse,
  ISelectItemProps,
} from "@/redux/api/interface";
import { useGetRolesUnpaginatedQuery } from "@/redux/api/roles";
import { formatSelectItems } from "@/utils/helpers";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [activeRole, setActiveRole] = useState<string | undefined>(undefined);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: roles } = useGetRolesUnpaginatedQuery();

  const { data, isError, isLoading, error, refetch, isFetching } =
    useGetStaffsQuery({
      pageNumber,
      searchTerm,
      pageSize: PAGE_SIZE.md,
      roleId: activeRole === "" ? undefined : activeRole,
    });

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
        <Spinner />;
      </div>
    );
  }

  const roleOptions = formatSelectItems(roles?.data ?? [], "name", "_id");

  const roleFilters = [
    { name: "All Staff Roles", onClick: () => setActiveRole("") },
    ...(roles?.data || []).map((el) => ({
      name: el.name,
      onClick: () => setActiveRole(el._id),
    })),
  ].filter((el) => !el.name.includes("customer"));

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
        <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
          <div className="flex items-center gap-2">
            <UserPlus size={14} />
            <span className="text-xs ">Add User</span>
          </div>
        </Button>
      </div>

      <section>
        <TMTable<IUser>
          columns={userColumns(roleOptions as ISelectItemProps[])}
          data={data?.data.data as IUser[]}
          loading={isFetching || isLoading}
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
                  buttonGroup={roleFilters || []}
                  triggerIcon={<Filter size={18} />}
                />
              </div>
            </div>
          }
          className="border-none"
          headerClassName="bg-N10 text-N700 uppercase tracking-wider text-[11px] font-bold"
          metadata={data?.data.metadata as IPaginationMetadataResponse}
          hasPerformedQuery={searchTerm.length > 0}
        />

        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Invite New User"
          mobileLayoutType="full"
        >
          <AddUserForm
            onClose={() => setIsAddModalOpen(false)}
            roles={roleOptions as ISelectItemProps[]}
          />
        </Modal>
      </section>
    </div>
  );
};

export default Users;
