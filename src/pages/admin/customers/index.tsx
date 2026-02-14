import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  MoreHorizontal,
  Download,
  UserPlus,
  Trash2,
  FileText,
} from "lucide-react";
import {
  Typography,
  TMTable,
  ButtonDropdown,
  ConfirmationModal,
} from "@/components";
import { customerColumns, type CustomerRow } from "./components/tableRow";
import Card from "@/components/Cards/Card";

const MOCK_CUSTOMERS: CustomerRow[] = Array(14)
  .fill(null)
  .map((_, index) => ({
    name: index % 2 === 0 ? "Prince Chijioke" : "Bessie Cooper",
    avatar: `https://i.pravatar.cc/150?u=${index}`,
    joinedOn: "12 Nov, 2024",
    email:
      index % 2 === 0
        ? "princeugbuta17@gmail.com"
        : "bessie.cooper@example.com",
    phone: "+234 903 828 3447",
    address: "4517 Washington Ave. Manchester, Kentucky 39495, United Kingdom",
    orders: 21 + index,
    price: "10,944.00",
    quantity: 23,
    subscription: index % 2 === 0 ? "Subscribed" : "Not Subscribed",
    recentOrders: [
      {
        id: "#21837893729",
        date: "12 Nov, 2024",
        payment: "Pending",
        total: "$2,029.18",
        items: "2 Items",
        fulfillment: "Unfulfilled",
      },
      {
        id: "#21837893730",
        date: "11 Nov, 2024",
        payment: "Success",
        total: "$778.35",
        items: "1 Item",
        fulfillment: "Fulfilled",
      },
      {
        id: "#21837893731",
        date: "10 Nov, 2024",
        payment: "Success",
        total: "$576.28",
        items: "3 Items",
        fulfillment: "Fulfilled",
      },
    ],
  }));

const Customers = () => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const filterOptions = [
    { name: "All Customers", onClick: () => {} },
    { name: "Subscribed", onClick: () => {} },
    { name: "Unsubscribed", onClick: () => {} },
  ];

  const moreActions = [
    { name: "Export CSV", icon: <Download size={14} />, onClick: () => {} },
    { name: "Import Users", icon: <UserPlus size={14} />, onClick: () => {} },
    {
      name: "Generate Report",
      icon: <FileText size={14} />,
      onClick: () => {},
    },
    {
      name: "Delete Selection",
      icon: <Trash2 size={14} />,
      textColor: "R500" as any,
      onClick: () => setIsDeleteModalOpen(true),
      className: "hover:bg-R50",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-N10 min-h-screen">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="TOTAL USERS" price="84,382" rate={36} isUp={true} />
        <Card
          title="SUBSCRIBED USERS"
          price="2,308,485"
          rate={14}
          isUp={false}
          isCurrency={true}
        />
        <Card title="NOT SUBSCRIBED" price="84,382" rate={34} isUp={true} />
      </section>

      <section className="bg-white border border-N30 overflow-hidden ">
        <TMTable<CustomerRow>
          columns={customerColumns(navigate)}
          data={MOCK_CUSTOMERS}
          loading={false}
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
                    placeholder="Search for anything here"
                    className="w-full pl-10 pr-4 py-2 border border-N40 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <ButtonDropdown
                  buttonGroup={filterOptions}
                  triggerIcon={<Filter size={18} />}
                />
                <ButtonDropdown
                  buttonGroup={moreActions}
                  triggerIcon={<MoreHorizontal size={18} />}
                />
              </div>
            </div>
          }
          className="border-none"
          headerClassName="bg-N10 text-N700 uppercase tracking-wider text-[11px] font-bold"
          pageSize={7}
          totalCount={MOCK_CUSTOMERS.length}
        />
      </section>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        formTitle="Delete Selection"
        message="Are you sure you want to delete the selected items?"
        buttonLabel="Delete"
        handleClick={() => {
          setIsProcessing(true);
          setTimeout(() => {
            setIsProcessing(false);
            setIsDeleteModalOpen(false);
          }, 1000);
        }}
        type="delete"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default Customers;
