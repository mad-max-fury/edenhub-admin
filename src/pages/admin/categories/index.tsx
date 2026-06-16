import { useState } from "react";
import { Plus, Search, Upload } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  ActionButton,
  Button,
  ConfirmationModal,
  Modal,
  NetworkError,
  Spinner,
  TMTable,
  Typography,
  notify,
} from "@/components";
import {
  useDeleteCategoryByIdMutation,
  useGetCategoriesQuery,
  type ICategory,
} from "@/redux/api/categories";
import { PAGE_SIZE } from "@/constants/data";
import type { IPaginationMetadataResponse } from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";

import EditOrCreateCategory from "./EditOrCreateCategory";
import BulkImportCategories from "./BulkImportCategories";

const levelLabel: Record<number, string> = {
  1: "Top level",
  2: "Subcategory",
  3: "Sub-subcategory",
};

const parentName = (parent: ICategory["parent"]) => {
  if (!parent) return "—";
  return typeof parent === "string" ? "—" : parent.name;
};

const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    ICategory | undefined
  >(undefined);
  const [openDelete, setOpenDelete] = useState(false);

  const pageSize = PAGE_SIZE.md;

  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryByIdMutation();

  const { data, isError, isLoading, error, refetch, isFetching } =
    useGetCategoriesQuery({ pageNumber, searchTerm, pageSize });

  const columns: ColumnDef<ICategory>[] = [
    {
      header: "SN",
      accessorKey: "_id",
      cell: ({ cell: { row } }) => (
        <span>{pageSize * (pageNumber - 1) + (row.index + 1)}</span>
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.image ? (
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-8 h-8 rounded object-cover border border-N30"
            />
          ) : (
            <div className="w-8 h-8 rounded bg-N20 border border-N30" />
          )}
          <Typography variant="p-s" fontWeight="medium" color="N700">
            {row.original.name}
          </Typography>
        </div>
      ),
    },
    {
      header: "Slug",
      accessorKey: "slug",
      cell: ({ row }) => (
        <Typography variant="p-s" color="N500">
          {row.original.slug}
        </Typography>
      ),
    },
    {
      header: "Level",
      accessorKey: "level",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-N10 text-N600 text-[11px] font-medium border border-N30">
          {levelLabel[row.original.level] ?? `Level ${row.original.level}`}
        </span>
      ),
    },
    {
      header: "Parent",
      accessorKey: "parent",
      cell: ({ row }) => (
        <Typography variant="p-s" color="N600">
          {parentName(row.original.parent)}
        </Typography>
      ),
    },
    {
      header: "Attributes",
      accessorKey: "attributes",
      cell: ({ row }) => (
        <Typography variant="p-s" color="N600">
          {row.original.attributes?.length ?? 0}
        </Typography>
      ),
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
            row.original.isActive
              ? "bg-G50 text-G500"
              : "bg-N20 text-N500"
          }`}
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </span>
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
              setSelectedCategory(row.original);
              setIsModalOpen(true);
            }}
          />
          <ActionButton
            variant="danger"
            onClick={() => {
              setSelectedCategory(row.original);
              setOpenDelete(true);
            }}
          />
        </div>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory({ id }).unwrap();
      notify.success({
        message: "Deleted successfully",
        subtitle: `You have deleted ${selectedCategory?.name}`,
      });
      setOpenDelete(false);
    } catch (err) {
      notify.error({
        message: "Action failed",
        subtitle: getErrorMessage(err),
      });
    }
  };

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
            Categories
          </Typography>
          <Typography variant="p-s" color="N500">
            Organise your catalog and define product attributes per category
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsImportOpen(true)}
          >
            <div className="flex items-center gap-2">
              <Upload size={14} />
              <span className="text-xs">Import JSON</span>
            </div>
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedCategory(undefined);
              setIsModalOpen(true);
            }}
          >
            <div className="flex items-center gap-2">
              <Plus size={14} />
              <span className="text-xs">Add Category</span>
            </div>
          </Button>
        </div>
      </div>

      <section className="bg-white border border-N30">
        <TMTable<ICategory>
          columns={columns}
          data={data?.data.data ?? []}
          loading={isFetching}
          headerData={
            <div className="border-b border-N30 px-6 py-4 flex justify-between items-center">
              <div className="relative w-full max-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-N400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search categories"
                  className="w-full pl-10 pr-4 py-2 border border-N40 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-B100 transition-all"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPageNumber(1);
                  }}
                />
              </div>
            </div>
          }
          className="border-none"
          headerClassName="bg-N10 text-N500 uppercase tracking-wider text-[11px] font-bold"
          metadata={data?.data.metadata as IPaginationMetadataResponse}
          onPageChange={(page) => setPageNumber(page)}
          hasPerformedQuery={searchTerm.length > 0}
        />
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? "Edit Category" : "Create New Category"}
        mobileLayoutType="full"
      >
        <EditOrCreateCategory
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(undefined);
          }}
          initialData={selectedCategory}
        />
      </Modal>

      <Modal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Categories"
        mobileLayoutType="full"
      >
        <BulkImportCategories onClose={() => setIsImportOpen(false)} />
      </Modal>

      <ConfirmationModal
        isOpen={openDelete}
        closeModal={() => setOpenDelete(false)}
        handleClick={() => handleDelete(selectedCategory?._id as string)}
        formTitle="Delete Category"
        message={
          <p>
            Are you sure you want to delete{" "}
            <span className="text-R400">{selectedCategory?.name}</span>? This
            action cannot be undone.
          </p>
        }
        isLoading={isDeleting}
        type={"delete"}
        buttonLabel="Yes, Delete"
      />
    </div>
  );
};

export default CategoryManagement;
