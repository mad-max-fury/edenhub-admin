import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Upload } from "lucide-react";

import {
  Typography,
  TMTable,
  Button,
  ConfirmationModal,
  Modal,
  NetworkError,
  notify,
} from "@/components";
import BulkImportProducts from "./BulkImportProducts";
import {
  useGetProductsQuery,
  useUpdateProductStatusMutation,
  useDeleteProductByIdMutation,
  type IProduct,
} from "@/redux/api/products";
import { AuthRouteConfig } from "@/constants/routes";
import { PAGE_SIZE } from "@/constants/data";
import type { IPaginationMetadataResponse } from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";

import {
  getProductColumns,
  type ProductRow,
} from "./productTableColums";

const totalStock = (p: IProduct) =>
  (p.quantity ?? 0) +
  (p.variants ?? []).reduce((s, v) => s + (v.quantity ?? 0), 0);

const toRow = (p: IProduct): ProductRow => ({
  _id: p._id,
  name: p.name,
  image: p.coverImage || p.images?.[0] || "",
  creationDate: p.createdAt
    ? new Date(p.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—",
  sku: p.variants?.[0]?.sku || "—",
  variants: p.variants?.length
    ? `${p.variants.length} variant${p.variants.length === 1 ? "" : "s"}`
    : "No variants",
  price: p.basePrice,
  quantity: totalStock(p),
  status: p.status,
});

const ProductsTable = ({ status }: { status: string }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const pageSize = PAGE_SIZE.sm;

  const { data, isError, isFetching, error, refetch } = useGetProductsQuery({
    pageNumber,
    pageSize,
    searchTerm,
    status,
  });

  const [updateStatus] = useUpdateProductStatusMutation();
  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteProductByIdMutation();

  const rows = useMemo(
    () => (data?.data.data ?? []).map(toRow),
    [data],
  );

  const changeStatus = async (
    row: ProductRow,
    next: "active" | "archived",
  ) => {
    try {
      await updateStatus({ id: row._id, status: next }).unwrap();
      notify.success({
        message: next === "archived" ? "Archived" : "Restored",
        subtitle: `${row.name} is now ${next}`,
      });
    } catch (err) {
      notify.error({ message: "Action failed", subtitle: getErrorMessage(err) });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct({ id: deleteTarget._id }).unwrap();
      notify.success({
        message: "Product deleted",
        subtitle: `${deleteTarget.name} was removed`,
      });
      setDeleteTarget(null);
    } catch (err) {
      notify.error({ message: "Delete failed", subtitle: getErrorMessage(err) });
    }
  };

  const columns = getProductColumns({
    onView: (p) => navigate(`${AuthRouteConfig.PRODUCTS}/${p._id}`),
    onEdit: (p) => navigate(`${AuthRouteConfig.PRODUCTS}/${p._id}/edit`),
    onArchive: (p) => changeStatus(p, "archived"),
    onRestore: (p) => changeStatus(p, "active"),
    onDelete: (p) => setDeleteTarget(p),
  });

  if (isError) {
    return (
      <div className="h-[50vh] w-full">
        <NetworkError isFetching={isFetching} error={error} refetch={refetch} />
      </div>
    );
  }

  return (
    <section className="bg-white border border-N30">
      <TMTable<ProductRow>
        columns={columns}
        data={rows}
        loading={isFetching}
        headerData={
          <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4">
            <Typography variant="h-s" fontWeight="bold">
              Products
            </Typography>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search name, brand, or SKU..."
                  className="w-full pl-10 pr-4 py-2 border border-N40 rounded-lg text-sm focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPageNumber(1);
                  }}
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="py-[7px] whitespace-nowrap"
                onClick={() => setIsImportOpen(true)}
              >
                <div className="flex items-center gap-1.5">
                  <Upload size={14} />
                  Bulk import
                </div>
              </Button>
              <Button
                size="sm"
                className="py-[7px] whitespace-nowrap"
                onClick={() => navigate(`${AuthRouteConfig.PRODUCTS}/create`)}
              >
                <div className="flex items-center gap-1.5">
                  <Plus size={14} />
                  Create product
                </div>
              </Button>
            </div>
          </div>
        }
        className="border-none"
        headerClassName="bg-N10 text-N700 uppercase tracking-wider text-[11px] font-bold"
        metadata={data?.data.metadata as IPaginationMetadataResponse}
        onPageChange={(p) => setPageNumber(p)}
        hasPerformedQuery={searchTerm.length > 0}
      />

      <ConfirmationModal
        isOpen={!!deleteTarget}
        closeModal={() => setDeleteTarget(null)}
        formTitle="Delete Product"
        message={
          <p>
            Are you sure you want to delete{" "}
            <span className="text-R400">{deleteTarget?.name}</span>? This
            permanently removes the product and its variants.
          </p>
        }
        buttonLabel="Yes, Delete"
        handleClick={handleDelete}
        type="delete"
        isLoading={isDeleting}
      />

      <Modal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Bulk Import Products"
        mobileLayoutType="full"
      >
        <BulkImportProducts onClose={() => setIsImportOpen(false)} />
      </Modal>
    </section>
  );
};

export default ProductsTable;
