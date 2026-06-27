import {
  Button,
  Modal,
  NetworkError,
  Spinner,
  TMTable,
  Typography,
} from "@/components";
import { PAGE_SIZE } from "@/constants/data";
import { useGetGroupsQuery, type IGroup } from "@/redux/api/groups";
import type { IPaginationMetadataResponse } from "@/redux/api/interface";
import { Search } from "lucide-react";
import { useState } from "react";
import { groupColumns } from "./tableRow";
import { AddOrEditMenu } from "./AddOrEditMenu";

const MenusMangements = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, isError, isLoading, error, refetch, isFetching } =
    useGetGroupsQuery({
      pageNumber,
      searchTerm,
      pageSize: PAGE_SIZE.md,
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
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="px-1">
          <Typography variant="h-m" fontWeight="bold">
            Manage Menu
          </Typography>
        </div>
        <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
          <div className="flex items-center gap-2">
            <span className="text-xs ">Add Menu</span>
          </div>
        </Button>
      </div>

      <section>
        <TMTable<IGroup>
          columns={groupColumns(PAGE_SIZE.md, pageNumber)}
          data={data?.data.data as IGroup[]}
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

              <div className="flex items-center gap-3"></div>
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
          title="Add or Edit Menu"
          mobileLayoutType="full"
        >
          <AddOrEditMenu closeModal={() => setIsAddModalOpen(false)} />
        </Modal>
      </section>
    </div>
  );
};

export default MenusMangements;
