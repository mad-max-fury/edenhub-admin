import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { Typography, TMTable, Button, NetworkError } from "@/components";
import Card from "@/components/Cards/Card";
import { customerColumns, type CustomerRow } from "./components/tableRow";
import {
  useGetCustomersQuery,
  useGetCustomerStatsQuery,
} from "@/redux/api/users";
import type { IUser } from "@/redux/api/auth";
import { PAGE_SIZE } from "@/constants/data";
import type { IPaginationMetadataResponse } from "@/redux/api/interface";

const pct = (part: number, total: number) =>
  total ? Math.round((part / total) * 100) : 0;

const toRow = (u: IUser): CustomerRow => ({
  _id: u._id,
  name: `${u.firstName} ${u.lastName}`.trim(),
  firstName: u.firstName,
  lastName: u.lastName,
  avatar: u.profilePicture,
  joinedOn: u.createdAt
    ? new Date(u.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—",
  email: u.email,
  phone: u.phoneNumber || "—",
  address: [u.city, u.country].filter(Boolean).join(", ") || "—",
  city: u.city,
  country: u.country,
  status: u.isActive ? "Active" : "Inactive",
});

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const pageSize = PAGE_SIZE.sm;

  const { data, isError, isFetching, error, refetch } = useGetCustomersQuery({
    pageNumber,
    pageSize,
    searchTerm,
  });
  const { data: statsRes } = useGetCustomerStatsQuery();
  const stats = statsRes?.data;

  const rows = useMemo(() => (data?.data.data ?? []).map(toRow), [data]);

  const exportCsv = () => {
    const header = ["Name", "Email", "Phone", "Location", "Joined", "Status"];
    const body = rows.map((r) => [
      r.name,
      r.email,
      r.phone,
      r.address,
      r.joinedOn,
      r.status,
    ]);
    const csv = [header, ...body]
      .map((line) =>
        line.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isError) {
    return (
      <div className="h-[70vh] w-full">
        <NetworkError isFetching={isFetching} error={error} refetch={refetch} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="TOTAL CUSTOMERS"
          price={(stats?.total ?? 0).toLocaleString()}
          rate={pct(stats?.newThisMonth ?? 0, stats?.total ?? 0)}
          isUp
        />
        <Card
          title="ACTIVE"
          price={(stats?.active ?? 0).toLocaleString()}
          rate={pct(stats?.active ?? 0, stats?.total ?? 0)}
          isUp
        />
        <Card
          title="VERIFIED"
          price={(stats?.verified ?? 0).toLocaleString()}
          rate={pct(stats?.verified ?? 0, stats?.total ?? 0)}
          isUp
        />
        <Card
          title="NEW THIS MONTH"
          price={(stats?.newThisMonth ?? 0).toLocaleString()}
          rate={pct(stats?.newThisMonth ?? 0, stats?.total ?? 0)}
          isUp
        />
      </section>

      <section className="bg-white border border-N30 overflow-hidden">
        <TMTable<CustomerRow>
          columns={customerColumns()}
          data={rows}
          loading={isFetching}
          headerData={
            <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4">
              <Typography variant="h-s" fontWeight="bold">
                Customers
              </Typography>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search name or email..."
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
                  onClick={exportCsv}
                >
                  <div className="flex items-center gap-1.5">
                    <Download size={14} />
                    Export
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
      </section>
    </div>
  );
};

export default Customers;
