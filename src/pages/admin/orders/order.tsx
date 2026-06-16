import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Calendar,
  CreditCard,
  Truck,
  ExternalLink,
  RefreshCw,
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
  useVerifyOrderPaymentMutation,
  useRefundOrderMutation,
  useUpdateOrderPaymentMutation,
  useUpdateOrderFulfillmentMutation,
  useShipOrderMutation,
  useTrackOrderMutation,
  useCancelOrderMutation,
  type IOrder,
} from "@/redux/api/orders";
import { getErrorMessage } from "@/utils/getErrorMessges";

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

const Order = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, isFetching, error, refetch } =
    useGetOrderByIdQuery({ id: id as string }, { skip: !id });

  const [verifyPayment, { isLoading: verifying }] =
    useVerifyOrderPaymentMutation();
  const [refund, { isLoading: refunding }] = useRefundOrderMutation();
  const [updatePayment] = useUpdateOrderPaymentMutation();
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
  const canBook =
    order.fulfillmentStatus === "unfulfilled" &&
    !!ship.requestToken &&
    !!ship.serviceCode &&
    !!ship.courierId;

  const run = async (fn: () => Promise<any>, success: string) => {
    try {
      await fn();
      notify.success({ message: success });
    } catch (err) {
      notify.error({ message: "Action failed", subtitle: getErrorMessage(err) });
    }
  };

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
            <div className="flex flex-col gap-2">
              {order.paymentAuthorizationUrl &&
                order.paymentStatus === "pending" && (
                  <a
                    href={order.paymentAuthorizationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 text-sm font-semibold text-B400 border border-N40 rounded-lg py-2 hover:bg-N10"
                  >
                    <ExternalLink size={14} /> Open payment link
                  </a>
                )}
              <Button
                size="sm"
                variant="secondary"
                loading={verifying}
                onClick={() =>
                  run(
                    () => verifyPayment({ id: order._id }).unwrap(),
                    "Payment re-checked",
                  )
                }
              >
                Verify with Paystack
              </Button>
              {order.paymentStatus !== "paid" && (
                <Button
                  size="sm"
                  onClick={() =>
                    run(
                      () =>
                        updatePayment({
                          id: order._id,
                          paymentStatus: "paid",
                        }).unwrap(),
                      "Marked paid",
                    )
                  }
                >
                  Mark as paid
                </Button>
              )}
              {order.paymentStatus === "paid" && (
                <Button
                  size="sm"
                  variant="secondary"
                  loading={refunding}
                  onClick={() =>
                    run(
                      () => refund({ id: order._id }).unwrap(),
                      "Refund processed",
                    )
                  }
                >
                  Refund
                </Button>
              )}
            </div>
          </Section>

          {/* Fulfillment */}
          <Section
            title="Fulfillment"
            icon={<Truck size={15} className="text-B400" />}
          >
            <div className="flex items-center justify-between mb-4">
              <Typography variant="p-s" color="N500">
                Status
              </Typography>
              <Badge status={order.fulfillmentStatus} />
            </div>

            {ship.courier && (
              <Typography variant="c-s" color="N500" className="block mb-2">
                Courier: {ship.courier}
              </Typography>
            )}

            <div className="flex flex-col gap-2">
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
            {order.shippingAddress && (
              <div className="mt-3 pt-3 border-t border-N20">
                <Typography
                  variant="c-s"
                  color="N400"
                  className="uppercase font-bold"
                >
                  Shipping
                </Typography>
                <Typography variant="p-s" color="N600" className="block mt-1">
                  {order.shippingAddress.fullName}
                  <br />
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}, {order.shippingAddress.country}
                  <br />
                  {order.shippingAddress.phone}
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
      </div>
    </div>
  );
};

export default Order;
