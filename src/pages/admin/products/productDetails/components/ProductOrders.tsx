import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Badge, Spinner, Typography } from "@/components";
import { useGetOrdersQuery, type IOrder } from "@/redux/api/orders";
import { AuthRouteConfig } from "@/constants/routes";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const customerName = (c: IOrder["customer"]) =>
  typeof c === "string" || !c ? "—" : `${c.firstName} ${c.lastName}`;

// Orders that contain this product, shown on the product detail page.
export const ProductOrders = ({ productId }: { productId: string }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isFetching } = useGetOrdersQuery({
    pageNumber: page,
    pageSize: 8,
    product: productId,
  });

  const orders = data?.data?.data ?? [];
  const metadata = data?.data?.metadata;

  return (
    <div className="bg-white border border-N30 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-N20 bg-N10/50 flex items-center gap-2">
        <ShoppingBag size={15} className="text-BR400" />
        <Typography variant="h-s" fontWeight="bold">
          Orders with this product
          {metadata?.totalCount ? ` (${metadata.totalCount})` : ""}
        </Typography>
      </div>

      {isFetching ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center">
          <Typography variant="p-s" color="N400">
            No orders have included this product yet.
          </Typography>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-N10 text-N700 uppercase tracking-wider text-[11px]">
                <th className="text-left font-bold px-5 py-3">Order</th>
                <th className="text-left font-bold px-5 py-3">Customer</th>
                <th className="text-left font-bold px-5 py-3">Status</th>
                <th className="text-left font-bold px-5 py-3">Date</th>
                <th className="text-left font-bold px-5 py-3">Total</th>
                <th className="text-left font-bold px-5 py-3">Payment</th>
                <th className="text-left font-bold px-5 py-3">Fulfillment</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o._id}
                  onClick={() =>
                    navigate(`${AuthRouteConfig.ORDERS}/${o._id}`)
                  }
                  className="border-t border-N20 hover:bg-N10/60 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3 font-mono font-bold text-N700">
                    {o.orderNumber}
                  </td>
                  <td className="px-5 py-3 text-N600">
                    {customerName(o.customer)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge status={o.status} />
                  </td>
                  <td className="px-5 py-3 text-N600">
                    {new Date(o.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3 font-bold text-N700">
                    {money(o.grandTotal)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge status={o.paymentStatus} />
                  </td>
                  <td className="px-5 py-3">
                    <Badge status={o.fulfillmentStatus} />
                  </td>
                  <td className="px-5 py-3 text-right text-BR400 text-xs font-semibold">
                    View
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {metadata && metadata.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-4 border-t border-N20">
          <button
            disabled={!metadata.hasPrevious}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="text-sm text-N600 disabled:text-N300"
          >
            Previous
          </button>
          <Typography variant="p-s" color="N500">
            {metadata.currentPage} / {metadata.totalPages}
          </Typography>
          <button
            disabled={!metadata.hasNext}
            onClick={() => setPage((p) => p + 1)}
            className="text-sm text-N600 disabled:text-N300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
