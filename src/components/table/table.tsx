import React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/helpers";
import { InfiniteProgressBar } from "../infiniteProgressBar/infiniteProgressBar";
import { PaginationElement } from "../pagination/pagination";
import { Typography } from "../typography";
import { EmptyStateIcon, SearchErrorIcon } from "@/assets/svgs";
import { Button } from "@/components/buttons/button";
import { SortIcon } from "@/assets/svgs";
import type { IPaginationMetadataResponse } from "@/redux/api/interface";

interface TMTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading: boolean;

  title?: string;
  headerData?: React.ReactNode;
  additionalTitleData?: React.ReactNode;

  metadata?: IPaginationMetadataResponse;

  page?: number;
  pageSize?: number;
  totalCount?: number;

  isServerSidePagination?: boolean;
  onPageChange?: (page: number) => void;
  searchParams?: string;
  hasPerformedQuery?: boolean;
  customEmptyStateMessage?: string;
  noBottomSpace?: boolean;
  className?: string;
  headerClassName?: string;

  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
}

export function TMTable<T>({
  columns,
  data,
  loading,
  title,
  headerData,
  additionalTitleData,

  metadata,
  page,
  pageSize,
  totalCount,
  isServerSidePagination = true,
  onPageChange,
  searchParams,
  hasPerformedQuery,
  customEmptyStateMessage,
  noBottomSpace,
  className,
  headerClassName,
  selectable,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: TMTableProps<T>) {
  const activePage = metadata?.currentPage ?? page ?? 1;
  const activePageSize = metadata?.pageSize ?? pageSize ?? 10;
  const activeTotalCount = metadata?.totalCount ?? totalCount ?? 0;
  const activeTotalPages =
    metadata?.totalPages ?? Math.ceil(activeTotalCount / activePageSize);

  const table = useReactTable({
    data,
    columns,
    pageCount: activeTotalPages,
    state: {
      pagination: {
        pageIndex: activePage - 1,
        pageSize: activePageSize,
      },
    },
    manualPagination: isServerSidePagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;

  const showPagination = activeTotalCount > activePageSize;

  return (
    <div className={cn("rounded-lg border border-N40 bg-white", className)}>
      {headerData}

      {title && (
        <div className="flex items-center justify-between border-b border-N40 px-6 py-5">
          <Typography variant="h-m" fontWeight="bold">
            {title}
          </Typography>
          <div className="flex items-center gap-4">
            {additionalTitleData}
            <Button variant="secondary" shape="rounded" types="outline">
              <SortIcon className="mr-2" /> Sort
            </Button>
          </div>
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        {loading && <InfiniteProgressBar />}

        <div
          className={cn("w-full overflow-x-auto", noBottomSpace ? "" : "pb-4")}
        >
          <table className="w-full border-collapse">
            <thead className="bg-N20">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className={cn(headerClassName)}>
                  {selectable && (
                    <th className="px-3 py-4 w-10">
                      <input
                        type="checkbox"
                        checked={!!data.length && selectedIds?.size === data.length}
                        onChange={onToggleSelectAll}
                        className="accent-BR500 w-4 h-4 cursor-pointer"
                      />
                    </th>
                  )}
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-N700"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-N40">
              <AnimatePresence mode="wait">
                {rows.length > 0
                  ? rows.map((row) => {
                      const rowId = (row.original as Record<string, unknown>)?._id as string | undefined;
                      const isSelected = rowId ? selectedIds?.has(rowId) : false;
                      return (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={cn("transition-colors hover:bg-N10", isSelected && "bg-B50")}
                        >
                          {selectable && rowId && (
                            <td className="px-3 py-4 w-10">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onToggleSelect?.(rowId)}
                                className="accent-BR500 w-4 h-4 cursor-pointer"
                              />
                            </td>
                          )}
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="whitespace-nowrap px-6 py-4 text-sm text-N900"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          ))}
                        </motion.tr>
                      );
                    })
                  : null}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {!loading && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            {hasPerformedQuery ? (
              <SearchErrorIcon className="h-[250px] w-[250px]" />
            ) : (
              <EmptyStateIcon className="h-[250px] w-[250px]" />
            )}
            <Typography variant="h-m" className="mt-4 text-N500">
              {hasPerformedQuery
                ? `No results found${searchParams ? ` for "${searchParams}"` : ""}`
                : customEmptyStateMessage ||
                  "No records available at the moment."}
            </Typography>
          </div>
        )}

        {showPagination && (
          <div className="flex items-center justify-between border-t border-N40 bg-N10 px-6 py-4">
            <div>
              <Typography variant="p-s" className="text-N600">
                Showing <b>{(activePage - 1) * activePageSize + 1}</b> –{" "}
                <b>{Math.min(activePage * activePageSize, activeTotalCount)}</b>{" "}
                of <b>{activeTotalCount}</b> results
              </Typography>
            </div>

            <PaginationElement
              page={activePage}
              total={activeTotalPages}
              onChange={(p) => onPageChange?.(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
