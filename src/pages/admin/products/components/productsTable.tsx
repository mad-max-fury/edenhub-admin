import React from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { Typography, TMTable, ButtonDropdown, Button } from "@/components";
import { productColumns, type ProductRow } from "./productTableColums";
import { Link } from "react-router-dom";
import { AuthRouteConfig } from "@/constants/routes";

interface ProductsTableProps {
  data: ProductRow[];
}

const ProductsTable = ({ data }: ProductsTableProps) => {
  const filterOptions = [
    { name: "All Status", onClick: () => {} },
    { name: "In Stock", onClick: () => {} },
    { name: "Out of Stock", onClick: () => {} },
  ];

  const moreActions = [
    { name: "Export CSV", icon: <Download size={14} />, onClick: () => {} },
    {
      name: "Export Excel",
      icon: <FileSpreadsheet size={14} />,
      onClick: () => {},
    },
  ];

  return (
    <section className="bg-white border border-N30">
      <TMTable<ProductRow>
        columns={productColumns}
        data={data}
        loading={false}
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
                  placeholder="Search products, SKU, or status..."
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
              <Link to={AuthRouteConfig.PRODUCTS + "/create"}>
                <Button size={"sm"} className="py-[7px] ">
                  Create product
                </Button>
              </Link>
            </div>
          </div>
        }
        className="border-none"
        headerClassName="bg-N10 text-N700 uppercase tracking-wider text-[11px] font-bold"
        pageSize={7}
        totalCount={data.length}
      />
    </section>
  );
};

export default ProductsTable;
