import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Calendar,
  CreditCard,
  Truck,
  ExternalLink,
  RefreshCw,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  RotateCcw,
} from "lucide-react";

import {
  Badge,
  Button,
  Typography,
  Spinner,
  NetworkError,
  notify,
} from "@/components";
import {
  useGetOrderByIdQuery,
  useRefundOrderMutation,
  useUpdateOrderFulfillmentMutation,
  useShipOrderMutation,
  useTrackOrderMutation,
  useCancelOrderMutation,
  type IOrder,
} from "@/redux/api/orders";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { useGetDisputesQuery } from "@/redux/api/disputes";
import { AuthRouteConfig } from "@/constants/routes";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white border border-N30 rounded-xl overflow-hidden">
    <div className="px-5 py-4 border-b border-N20 bg-N10/50 flex items-center gap-2">
      {icon}
      <Typography variant="h-s" fontWeight="bold">
        {title}
      </Typography>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const SummaryRow = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <div className="flex items-center justify-between py-1.5">
    <Typography
      variant="p-s"
      color={bold ? "N800" : "N500"}
      fontWeight={bold ? "bold" : "regular"}
    >
      {label}
    </Typography>
    <Typography variant="p-s" fontWeight={bold ? "bold" : "medium"}>
      {value}
    </Typography>
  </div>
);

const FULFILLMENT_STEPS = [
  { key: "unfulfilled", label: "Order Placed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
] as const;

const getFulfillmentIndex = (status: string) => {
  if (status === "delivered") return 2;
  if (status === "shipped" || status === "fulfilled") return 1;
  return 0;
};

const FulfillmentTracker = ({ status }: { status: string }) => {
  const current = getFulfillmentIndex(status);
  return (
    <div className="flex items-center gap-1 mb-4">
      {FULFILLMENT_STEPS.map((step, i) => {
        const done = i <= current;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center gap-1 flex-1">
            <div
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium ${
                done ? "bg-G50 text-G600" : "bg-N10 text-N400"
              }`}
            >
              <Icon size={13} />
              {step.label}
            </div>
            {i < FULFILLMENT_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 min-w-3 ${
                  i < current ? "bg-G400" : "bg-N30"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const Order = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, isFetching, error, refetch } =
    useGetOrderByIdQuery({ id: id as string }, { skip: !id });

  const [refund, { isLoading: refunding }] = useRefundOrderMutation();
  const [updateFulfillment] = useUpdateOrderFulfillmentMutation();
  const [shipOrder, { isLoading: shipping }] = useShipOrderMutation();
  const [trackOrder, { isLoading: tracking }] = useTrackOrderMutation();
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();

  if (isLoading) {
    return (
      <div className="h-[70vh] w-full">
        <Spinner />
      </div>
    );
  }
  if (isError || !data?.data) {
    return (
      <div className="h-[70vh] w-full">
        <NetworkError isFetching={isFetching} error={error} refetch={refetch} />
      </div>
    );
  }

  const order: IOrder = data.data;
  const customer = typeof order.customer === "string" ? null : order.customer;
  const ship = order.shipment || {};
  const isCancelled = order.status === "cancelled";
  const isPaid = order.paymentStatus === "paid";
  // A shipment can only be booked on a live, paid order — never on a
  // cancelled one, and never before payment clears.
  const canBook =
    !isCancelled &&
    isPaid &&
    order.fulfillmentStatus === "unfulfilled" &&
    !!ship.requestToken &&
    !!ship.serviceCode &&
    !!ship.courierId;

  const run = async (fn: () => Promise<unknown>, success: string) => {
    try {
      await fn();
      notify.success({ message: success });
    } catch (err) {
      notify.error({ message: "Action failed", subtitle: getErrorMessage(err) });
    }
  };

  const addr = order.shippingAddress;
  const addrName =
    addr?.fullName ||
    [addr?.firstName, addr?.lastName].filter(Boolean).join(" ") ||
    "—";

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 mb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-N20 text-N500"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <Typography variant="h-m" fontWeight="bold">
                {order.orderNumber}
              </Typography>
              <Badge status={order.status} />
            </div>
            <div className="flex items-center gap-2 text-N500 mt-1">
              <Calendar size={14} />
              <Typography variant="p-s" color="N500">
                {new Date(order.createdAt).toLocaleString()}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge status={order.paymentStatus} />
          <Badge status={order.fulfillmentStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Left */}
        <div className="flex flex-col gap-6">
          <Section title={`Items (${order.items.length})`}>
            <div className="flex flex-col divide-y divide-N20">
              {order.items.map((it, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <div className="w-14 h-14 rounded-lg bg-N10 border border-N30 overflow-hidden shrink-0">
                    {it.image && (
                      <img
                        src={it.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography variant="p-s" fontWeight="medium">
                      {it.name}
                    </Typography>
                    <Typography variant="c-s" color="N400">
                      {it.sku ? `${it.sku} · ` : ""}
                      {money(it.unitPrice)} × {it.quantity}
                    </Typography>
                  </div>
                  <Typography variant="p-s" fontWeight="bold">
                    {money(it.lineTotal)}
                  </Typography>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Order Summary">
            <SummaryRow label="Subtotal" value={money(order.subtotal)} />
            <SummaryRow
              label="Discount"
              value={`- ${money(order.discountTotal)}`}
            />
            <SummaryRow label="Shipping" value={money(order.shippingFee)} />
            <SummaryRow label="Tax" value={money(order.taxAmount)} />
            <div className="border-t border-N20 mt-2 pt-2">
              <SummaryRow label="Total" value={money(order.grandTotal)} bold />
            </div>
          </Section>

          <Section title="Activity">
            <div className="flex flex-col gap-3">
              {[...order.timeline].reverse().map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-BR400 mt-1.5 shrink-0" />
                  <div>
                    <Typography variant="p-s">{t.message}</Typography>
                    <Typography variant="c-s" color="N400">
                      {new Date(t.at).toLocaleString()}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-6">
          {/* Payment */}
          <Section
            title="Payment"
            icon={<CreditCard size={15} className="text-B400" />}
          >
            <div className="flex items-center justify-between mb-4">
              <Typography variant="p-s" color="N500">
                Status
              </Typography>
              <Badge status={order.paymentStatus} />
            </div>
            {order.paidAt && (
              <Typography variant="c-s" color="N500" className="block mb-2">
                Paid {new Date(order.paidAt).toLocaleString()}
              </Typography>
            )}

            {isCancelled && isPaid && (
              <div className="flex items-start gap-2 rounded-lg bg-Y50 text-Y500 px-3 py-2.5 mb-3">
                <Clock size={15} className="mt-0.5 shrink-0" />
                <Typography variant="c-s" color="Y500">
                  This order was cancelled while paid. The customer has not been
                  refunded — issue a refund to return their money.
                </Typography>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {isPaid && (
                <Button
                  size="sm"
                  variant={isCancelled ? "primary" : "secondary"}
                  loading={refunding}
                  onClick={() =>
                    run(
                      () => refund({ id: order._id }).unwrap(),
                      "Refund processed",
                    )
                  }
                >
                  {isCancelled ? "Issue refund" : "Refund"}
                </Button>
              )}
            </div>
          </Section>

          {/* Fulfillment */}
          <Section
            title="Fulfillment"
            icon={<Truck size={15} className="text-B400" />}
          >
            {isCancelled ? (
              <div className="flex items-start gap-2 rounded-lg bg-R50 text-R500 px-3 py-2.5">
                <Clock size={15} className="mt-0.5 shrink-0" />
                <Typography variant="c-s" color="R500">
                  This order was cancelled. Fulfillment is disabled and no
                  shipment can be booked.
                </Typography>
              </div>
            ) : (
              <>
            <FulfillmentTracker status={order.fulfillmentStatus} />

            {ship.courier && (
              <Typography variant="c-s" color="N500" className="block mb-2">
                Courier: {ship.courier}
              </Typography>
            )}

            {ship.shippedAt && (
              <Typography variant="c-s" color="N500" className="block mb-1">
                Shipped: {new Date(ship.shippedAt).toLocaleString()}
              </Typography>
            )}
            {ship.deliveredAt && (
              <Typography variant="c-s" color="N500" className="block mb-1">
                Delivered: {new Date(ship.deliveredAt).toLocaleString()}
              </Typography>
            )}

            <div className="flex flex-col gap-2 mt-3">
              {canBook && (
                <Button
                  size="sm"
                  loading={shipping}
                  onClick={() =>
                    run(
                      () =>
                        shipOrder({
                          id: order._id,
                          serviceCode: ship.serviceCode!,
                          courierId: ship.courierId!,
                        }).unwrap(),
                      "Shipment booked via Shipbubble",
                    )
                  }
                >
                  Book shipment
                </Button>
              )}

              {ship.trackingUrl && (
                <a
                  href={ship.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 text-sm font-semibold text-B400 border border-N40 rounded-lg py-2 hover:bg-N10"
                >
                  <ExternalLink size={14} /> Track ({ship.trackingNumber})
                </a>
              )}
              {ship.labelUrl && (
                <a
                  href={ship.labelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 text-sm font-semibold text-N600 border border-N40 rounded-lg py-2 hover:bg-N10"
                >
                  Download label
                </a>
              )}
              {ship.shipbubbleOrderId && (
                <Button
                  size="sm"
                  variant="secondary"
                  loading={tracking}
                  onClick={() =>
                    run(
                      () => trackOrder({ id: order._id }).unwrap(),
                      "Tracking refreshed",
                    )
                  }
                >
                  <div className="flex items-center gap-1.5">
                    <RefreshCw size={13} /> Refresh tracking
                  </div>
                </Button>
              )}
              {order.fulfillmentStatus !== "delivered" &&
                order.fulfillmentStatus !== "unfulfilled" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      run(
                        () =>
                          updateFulfillment({
                            id: order._id,
                            fulfillmentStatus: "delivered",
                          }).unwrap(),
                        "Marked delivered",
                      )
                    }
                  >
                    Mark delivered
                  </Button>
                )}
            </div>
              </>
            )}
          </Section>

          {/* Customer */}
          <Section title="Customer">
            <Typography variant="p-s" fontWeight="medium">
              {customer ? `${customer.firstName} ${customer.lastName}` : "—"}
            </Typography>
            {customer?.email && (
              <Typography variant="c-s" color="N500" className="block">
                {customer.email}
              </Typography>
            )}
            {addr && (
              <div className="mt-3 pt-3 border-t border-N20">
                <Typography
                  variant="c-s"
                  color="N400"
                  className="uppercase font-bold flex items-center gap-1"
                >
                  <MapPin size={12} /> Delivery Address
                </Typography>
                <Typography variant="p-s" color="N600" className="block mt-1">
                  {addrName}
                  <br />
                  {addr.address}
                  {addr.landmark ? ` (${addr.landmark})` : ""}
                  <br />
                  {addr.city}, {addr.state}, {addr.country}
                  {addr.postalCode ? ` ${addr.postalCode}` : ""}
                  <br />
                  {addr.phone}
                  {addr.additionalPhone ? ` · ${addr.additionalPhone}` : ""}
                </Typography>
              </div>
            )}
          </Section>

          {order.status !== "cancelled" && (
            <Button
              variant="secondary"
              loading={cancelling}
              onClick={() =>
                run(
                  () => cancelOrder({ id: order._id }).unwrap(),
                  "Order cancelled",
                )
              }
            >
              Cancel order
            </Button>
          )}
        </div>

        {/* Disputes for this order */}
        <OrderDisputes orderId={order._id} />
      </div>
    </div>
  );
};

const dStatusCls: Record<string, string> = {
  open: "bg-blue-50 text-blue-600", under_review: "bg-orange-50 text-orange-600",
  resolved: "bg-green-50 text-green-600", rejected: "bg-red-50 text-red-500", refunded: "bg-green-50 text-green-600",
};
const dStatusLabel: Record<string, string> = {
  open: "Open", under_review: "Under Review", resolved: "Resolved", rejected: "Rejected", refunded: "Refunded",
};

const OrderDisputes = ({ orderId }: { orderId: string }) => {
  const navigate = useNavigate();
  const { data } = useGetDisputesQuery({ pageSize: 50 });
  const disputes = (data?.data.data ?? []).filter((d) => d.order._id === orderId);

  if (disputes.length === 0) return null;

  return (
    <Section title="Disputes" icon={<RotateCcw size={16} />}>
      <div className="flex flex-col gap-3">
        {disputes.map((d) => (
          <div key={d._id} className="flex items-start gap-3 py-2">
            <RotateCcw size={14} className="text-N400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-N800 capitalize">{d.type.replace(/_/g, " ")}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${dStatusCls[d.status] || "bg-gray-50 text-gray-500"}`}>{dStatusLabel[d.status] || d.status}</span>
              </div>
              <Typography color="N400" variant="c-s">{d.reason}</Typography>
              {d.resolution && <Typography color="G500" variant="c-s">{d.resolution}</Typography>}
              {d.refundAmount && d.refundAmount > 0 && <Typography color="G500" variant="c-s">Refunded: {money(d.refundAmount)}</Typography>}
            </div>
            <button onClick={() => navigate(AuthRouteConfig.DISPUTES)}
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-400 font-medium shrink-0">
              <MessageCircle size={11} /> Manage
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Order;
