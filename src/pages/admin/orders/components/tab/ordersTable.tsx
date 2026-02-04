"use client";

import { TMTable } from "@/components/table/table";
import type { DashboardRow } from "@/components/constants/data";
import { dashboadColumns } from "@/components/constants";
import { useNavigate } from "react-router-dom";

type OrdersTableProps = {
  data: DashboardRow[];
};

const OrdersTable = ({ data }: OrdersTableProps) => {
  const navigate = useNavigate();
  return (
    <TMTable<DashboardRow>
      title="Recent Orders"
      columns={dashboadColumns(navigate)}
      data={data}
      loading={false}
      className="bg-white mt-6 px-6"
      headerClassName="bg-gray-50 text-white uppercase tracking-wide text-xs"
    />
  );
};

export default OrdersTable;
