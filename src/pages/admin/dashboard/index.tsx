import Card from "@/components/Cards/Card";
import SellerCard from "@/pages/admin/dashboard/components/SellerCard";
import { ChevronDownIcon, ChevronsUpDownIcon, FileIcon, Square } from "lucide-react";
import watch6 from "../../../assets/images/watch6.jpg";
import { Button } from "../../../components/buttons/button";
import type { ColumnDef } from "@tanstack/react-table";
import { TMTable } from "@/components/table/table";

const cardData = [
  { title: "Today's Sales", price: "12,426", rate: 36, isCurrency: true, isUp: true },
  { title: "Total Sales", price: '2,308,485', rate: 14, isCurrency: true, isUp: false },
  { title: "Total Orders", price: "84,382", rate: 36, isCurrency: false, isUp: true },
  { title: "Total Customers", price: "33,493", rate: 36, isCurrency: false, isUp: true },
];

const sellerData = [
  { 
    name: "Eden Chrono Elite", 
    product: "Watches", 
    rate: 36, 
    image: watch6, 
    isUp: true 
  },
];

const dashboadColumns: ColumnDef<DashboardRow>[] = [
  {
    header: () => (
      <div className="flex items-center gap-1">
        <div><span><Square className="text-gray-200" /></span></div>
        <p>Order</p>
      </div>
    ),
    accessorKey: "order",
    cell: ({row}) => (
      <div className="flex items-center gap-2 ml-2 ">
        <Square  className="text-gray-200" />
        <span>{row.original.order}</span>
      </div>
    )
  },
  {
    header: () => (
      <div className="flex items-center gap-1">
        <p>Date</p>
        <div><span><ChevronsUpDownIcon size={16} /></span></div>
      </div>
    ),
    accessorKey: "date",
  },
  { header: "Customer", accessorKey: "customer" },
  {
  header: "Payment",
  accessorKey: "payment",
  cell: ({ getValue }) => {
    const value = getValue<string>();

    const isSuccess = value === "Success";

    return (
      <span
        className={`px-7 py-4 border-4 ml-4 font-bold border-orange-300 rounded-2xl text-h-xs  ${
          isSuccess
            ? "bg-green-100 text-green-700"
            : "bg-gray-50 text-orange-700"
        }`}
      >
        <span
        className={`w-2 h-2 rounded-full ${
          isSuccess ? "bg-green-500" : "bg-orange-300"
        }`}
        />
        {value}
      </span>
    );
  },
},

  { header: "Total", accessorKey: "total" },
  { header: "Items", accessorKey: "items" },
  { header: "Fulfillment", accessorKey: "fulfillment" },
  {
    header: "Action",
    id: "action",
    cell: ({ row }) => (
      <div>
        <Button variant="secondary" shape="rounded" types="outline" onClick={() => alert(`Viewing order ${row.original.order}`)}>View Order</Button>
      </div>
    )
  },
];

type DashboardRow = {
  order: string;
  date: string;
  customer: string;
  payment: string;
  total: string;
  items: number;
  fulfillment: string;
};

const dashboardData: DashboardRow[] = [
  {
    order: "ORD-001",
    date: "2026-01-14",
    customer: "John Doe",
    payment: "pending",
    total: "$150.00",
    items: 3,
    fulfillment: "Delivered",
  },
  {
    order: "ORD-002",
    date: "2026-01-13",
    customer: "Jane Smith",
    payment: "success",
    total: "$250.00",
    items: 5,
    fulfillment: "Pending",
  },
]

const Dashboard = () => {
  const repeatCount = 5;
  const repeatedSellers = Array.from({ length: repeatCount }, () => sellerData[0]);

  return (
    <div className="p-1 space-y-0">
        {/* Carditems */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cardData.map((card, idx) => (
          <Card
            key={idx}
            title={card.title}
            price={card.price}
            rate={card.rate}
            isCurrency={card.isCurrency}
            isUp={card.isUp}
          />
        ))}
      </div>
         {/* Chart-menue */}
      <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
        <div className="flex-[2] bg-white p-4 flex flex-col gap-4 w-full">
          <div className="flex w-auto flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="">
              <h1 className="font-bold text-lg">Sales Report</h1>
            </div>
            <div className="flex flex-wrap gap-2 ">
              <Button variant="secondary" shape="rounded" types="outline">12 Months</Button>
              <Button variant="plain" shape="rounded" types="filled" className="text-black">6 Months</Button>
              <Button variant="plain" shape="rounded" types="filled" className="text-black">30 Days</Button>
              <Button variant="plain" shape="rounded" types="filled" className="text-black">7 Days</Button>
            </div>
            <div className="">
              <Button
                asChild
                variant="secondary"
                shape="rounded"
                types="outline"
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  <FileIcon className="w-5 h-5 text-gray-600" />
                  Export PDF
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-[1] border border-[#E4E4E7] flex flex-col">
          <div className="px-4 py-2 font-bold text-lg bg-white flex items-center justify-between">
            <h1 className="font-clash font-semibold text-[14px] leading-[20.49px] tracking-[0px]">Top Seller</h1>
            <div className="flex items-center justify-center gap-2">
              <span className="font-clash font-medium text-[10.25px] leading-[17.08px] tracking-[0px] text-right">Last 7 Days</span>
              <ChevronDownIcon className="w-4 h-4 font-bold text-gray-600" />
            </div>
          </div>
          {/* Top-sellers */}
          <div className="flex flex-col relative">
            {repeatedSellers.map((seller, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white px-4 py-2">
                  <SellerCard {...seller} />
                </div>
                {idx !== repeatedSellers.length - 1 && (
                  <div className="border-b border-[#E4E4E7] absolute left-4 right-4 bottom-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Table content */}
      <div className="">
        <TMTable<DashboardRow>
          title="Recent Order"
          columns={dashboadColumns}
          data={dashboardData}
          loading={false}
          className="bg-white mt-6 shadow-md px-6 "
          headerClassName="bg-gray-50  text-white uppercase tracking-wide text-xs"
        />
      </div>
    </div>
  );
};

export default Dashboard;
