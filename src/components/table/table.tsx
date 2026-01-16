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
import { EmptyStateIcon, HamburgerIcon, SearchErrorIcon, SearchIcon } from "@/assets/svgs";
import { Button } from "@/components/buttons/button";

interface TMTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading: boolean;

  title?: string;
  headerData?: React.ReactNode;
  additionalTitleData?: React.ReactNode;

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
}

export function TMTable<T>({
  columns,
  data,
  loading,
  title,
  headerData,
  additionalTitleData,
  page = 1,
  pageSize = 10,
  totalCount = 0,
  isServerSidePagination = true,
  onPageChange,
  searchParams,
  hasPerformedQuery,
  customEmptyStateMessage,
  noBottomSpace,
  className,
  headerClassName,
}: TMTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pageSize),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    manualPagination: isServerSidePagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const showPagination = totalCount > pageSize;

  return (
    <div className={cn(" border border-N40", className)}>
      {headerData}

      {title && (
        <div className="flex items-center justify-between  border-N40 px-1 py-5">
          <Typography variant="h-m" fontWeight="bold">
            {title}
          </Typography>
          {additionalTitleData}
          <div className="flex items-center justify-center gap-4">
            <Button variant="secondary" shape="rounded" types="outline"><SearchIcon/></Button>
            <Button variant="secondary" shape="rounded" types="outline"><HamburgerIcon/></Button>
            <Button variant="secondary" shape="rounded" types="outline">12 Months</Button>
            <Button variant="secondary" shape="rounded" types="outline">12 Months</Button>
          </div>
        </div>
      )}

      <div className="relative w-full overflow-x-auto">
        {loading && <InfiniteProgressBar />}

        <div className={noBottomSpace ? "" : "overflow-x-auto"}>
          <table className="w-full border-collapse">
            <thead >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className={cn(headerClassName)}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm font-medium text-N700"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              <AnimatePresence>
                {rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 120 }}
                    className="border-b last:border-none"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm text-N900">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {!loading && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6">
            {hasPerformedQuery ? <SearchErrorIcon /> : <EmptyStateIcon />}
            <p className="mt-2 text-sm text-gray-500">
              {hasPerformedQuery
                ? `No result found${
                    searchParams ? ` for "${searchParams}"` : ""
                  }`
                : customEmptyStateMessage ||
                  "Your request results will appear here"}
            </p>
          </div>
        )}

        {!noBottomSpace && showPagination && (
          <div className="flex items-center justify-between border-t p-4">
            <div>
              <Typography>
                Showing {(page - 1) * pageSize + 1} –{" "}
                {Math.min(page * pageSize, totalCount)} of <b>{totalCount}</b>
              </Typography>
            </div>

            <PaginationElement
              page={page}
              total={Math.ceil(totalCount / pageSize)}
              onChange={onPageChange!}
            />
          </div>
        )}
      </div>
    </div>
  );
}
