import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Upload, CheckSquare, X, Percent, Archive, RefreshCw } from "lucide-react";

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
import { StockModal } from "./StockModal";
import {
  useGetProductsQuery,
  useUpdateProductStatusMutation,
  useDeleteProductByIdMutation,
  useBulkUpdateStatusMutation,
  useBulkUpdateDiscountMutation,
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
  const [stockTarget, setStockTarget] = useState<ProductRow | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDiscountOpen, setBulkDiscountOpen] = useState(false);
  const [bulkDiscountPct, setBulkDiscountPct] = useState("");

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
  const [bulkStatus, { isLoading: bulkStatusLoading }] = useBulkUpdateStatusMutation();
  const [bulkDiscount, { isLoading: bulkDiscountLoading }] = useBulkUpdateDiscountMutation();

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const toggleSelectAll = () => {
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r._id)));
  };

  const handleBulkStatus = async (s: "active" | "archived") => {
    try {
      await bulkStatus({ ids: [...selected], status: s }).unwrap();
      notify.success({ message: `${selected.size} products ${s === "archived" ? "archived" : "activated"}` });
      setSelected(new Set());
    } catch (err) {
      notify.error({ message: "Bulk action failed", subtitle: getErrorMessage(err) });
    }
  };

  const handleBulkDiscount = async () => {
    const pct = parseInt(bulkDiscountPct);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      notify.error({ message: "Enter a valid percentage (0-100)" });
      return;
    }
    try {
      await bulkDiscount({ ids: [...selected], percentage: pct }).unwrap();
      notify.success({ message: `Discount applied to ${selected.size} products` });
      setSelected(new Set());
      setBulkDiscountOpen(false);
      setBulkDiscountPct("");
    } catch (err) {
      notify.error({ message: "Bulk discount failed", subtitle: getErrorMessage(err) });
    }
  };

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
    onUpdateStock: (p) => setStockTarget(p),
    onManageVariants: (p) =>
      navigate(`${AuthRouteConfig.PRODUCTS}/${p._id}/edit`),
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
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-6 py-3 bg-B50 border-b border-N30">
          <button onClick={() => setSelected(new Set())} className="text-N500 hover:text-N700">
            <X size={16} />
          </button>
          <span className="text-sm font-medium text-N700">{selected.size} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button size="sm" variant="secondary" onClick={() => handleBulkStatus("active")} disabled={bulkStatusLoading}>
              <div className="flex items-center gap-1.5"><RefreshCw size={13} /> Activate</div>
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleBulkStatus("archived")} disabled={bulkStatusLoading}>
              <div className="flex items-center gap-1.5"><Archive size={13} /> Archive</div>
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setBulkDiscountOpen(true)}>
              <div className="flex items-center gap-1.5"><Percent size={13} /> Discount</div>
            </Button>
          </div>
        </div>
      )}

      <TMTable<ProductRow>
        columns={columns}
        data={rows}
        loading={isFetching}
        selectable
        selectedIds={selected}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
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

      <StockModal
        productId={stockTarget?._id ?? null}
        productName={stockTarget?.name}
        onClose={() => setStockTarget(null)}
      />

      {/* Bulk discount modal */}
      <Modal
        isOpen={bulkDiscountOpen}
        onClose={() => { setBulkDiscountOpen(false); setBulkDiscountPct(""); }}
        title="Apply Bulk Discount"
        mobileLayoutType="normal"
      >
        <div className="p-5 flex flex-col gap-4">
          <p className="text-sm text-N500">
            Apply a percentage discount to {selected.size} selected product{selected.size === 1 ? "" : "s"}.
          </p>
          <div>
            <label className="text-xs text-N600 mb-1 block">Discount %</label>
            <input
              type="number"
              min={0}
              max={100}
              value={bulkDiscountPct}
              onChange={(e) => setBulkDiscountPct(e.target.value)}
              placeholder="e.g. 15"
              className="w-full h-10 px-3 border border-N40 rounded text-sm focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => { setBulkDiscountOpen(false); setBulkDiscountPct(""); }}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleBulkDiscount} disabled={bulkDiscountLoading}>
              {bulkDiscountLoading ? "Applying…" : "Apply"}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default ProductsTable;
