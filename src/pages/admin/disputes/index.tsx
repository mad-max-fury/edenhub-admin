import { useState } from "react";
import { AlertTriangle, DollarSign, RotateCcw } from "lucide-react";
import { Button, Typography, notify } from "@/components";
import { SMSelectDropDown } from "@/components/smSelect/smSelect";
import type { OptionType } from "@/components/smSelect/smSelect";
import { Modal } from "@/components/modal/modal";
import { getErrorMessage } from "@/utils/getErrorMessges";
import {
  useGetDisputesQuery,
  useGetDisputeQuery,
  useAdminReplyDisputeMutation,
  useUpdateDisputeStatusMutation,
  useRefundDisputeMutation,
} from "@/redux/api/disputes";
import { useUploadMutation } from "@/redux/api/resources";
import { RichChat } from "@/components/chat/RichChat";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const STATUS_OPTIONS: OptionType[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Under Review", value: "under_review" },
  { label: "Resolved", value: "resolved" },
  { label: "Rejected", value: "rejected" },
  { label: "Refunded", value: "refunded" },
];

const STATUS_ACTIONS: OptionType[] = [
  { label: "Under Review", value: "under_review" },
  { label: "Resolved", value: "resolved" },
  { label: "Rejected", value: "rejected" },
];

const statusCls: Record<string, string> = {
  open: "bg-B50 text-B600",
  under_review: "bg-O50 text-O600",
  resolved: "bg-G50 text-G600",
  rejected: "bg-R50 text-R500",
  refunded: "bg-G50 text-G600",
};

const statusLabel: Record<string, string> = {
  open: "Open",
  under_review: "Under Review",
  resolved: "Resolved",
  rejected: "Rejected",
  refunded: "Refunded",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const DisputeDetail = ({ disputeId }: { disputeId: string }) => {
  const { data, isLoading, refetch } = useGetDisputeQuery(disputeId);
  const [adminReply, { isLoading: sending }] =
    useAdminReplyDisputeMutation();
  const [updateStatus, { isLoading: updating }] =
    useUpdateDisputeStatusMutation();
  const [refundDispute, { isLoading: refunding }] =
    useRefundDisputeMutation();
  const [uploadFile] = useUploadMutation();
  const [showRefund, setShowRefund] = useState(false);
  const [refundAmt, setRefundAmt] = useState("");
  const [newStatus, setNewStatus] = useState<OptionType | null>(null);
  const [resolution, setResolution] = useState("");
  const dispute = data?.data;

  if (isLoading || !dispute)
    return (
      <div className="text-N400 py-12 text-center">Loading…</div>
    );

  const customer = dispute.customer;
  const order = dispute.order;
  const isOpen =
    dispute.status === "open" || dispute.status === "under_review";

  const sendReply = async (text: string) => {
    if (!text.trim()) return;
    try {
      await adminReply({ id: disputeId, body: text.trim() }).unwrap();
      refetch();
    } catch (err) {
      notify.error({
        message: "Failed",
        subtitle: getErrorMessage(err),
      });
    }
  };

  const changeStatus = async () => {
    if (!newStatus) return;
    try {
      await updateStatus({
        id: disputeId,
        status: String(newStatus.value),
        resolution: resolution.trim() || undefined,
      }).unwrap();
      notify.success({
        message: `Status updated to ${newStatus.label}`,
      });
      setNewStatus(null);
      setResolution("");
      refetch();
    } catch (err) {
      notify.error({
        message: "Failed",
        subtitle: getErrorMessage(err),
      });
    }
  };

  const processRefund = async () => {
    try {
      await refundDispute({
        id: disputeId,
        amount: refundAmt ? Number(refundAmt) : undefined,
      }).unwrap();
      notify.success({ message: "Refund processed" });
      setShowRefund(false);
      refetch();
    } catch (err) {
      notify.error({
        message: "Refund failed",
        subtitle: getErrorMessage(err),
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pb-4 border-b border-N40 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-N900">
              {order.orderNumber}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-medium ${statusCls[dispute.status]}`}
            >
              {statusLabel[dispute.status]}
            </span>
          </div>
          {isOpen && order.paymentStatus === "paid" && (
            <button
              onClick={() => {
                setRefundAmt(String(order.grandTotal));
                setShowRefund(true);
              }}
              className="flex items-center gap-1 text-xs text-BR500 border border-BR400 rounded px-2.5 py-1.5 hover:bg-BR50 transition-colors"
            >
              <DollarSign size={12} /> Refund
            </button>
          )}
        </div>
        <div className="text-xs text-N500">
          {customer.firstName} {customer.lastName} · {customer.email}
        </div>
        <div className="text-xs text-N400 mt-0.5">
          Type:{" "}
          <span className="capitalize">
            {dispute.type.replace(/_/g, " ")}
          </span>{" "}
          · {dispute.reason} · {money(order.grandTotal)}
        </div>
        {dispute.resolution && (
          <div className="text-xs text-G600 mt-1">
            Resolution: {dispute.resolution}
          </div>
        )}
      </div>

      {/* Chat */}
      <div className="flex-1 min-h-0 relative">
        <RichChat
          messages={dispute.messages.map((m) => ({
            ...m,
            read: true,
          }))}
          myRole="admin"
          isOpen={isOpen}
          dateLabel={formatDate(dispute.createdAt)}
          closedMessage={`Dispute ${dispute.status.replace(/_/g, " ")}.`}
          onSend={async (body) => { await sendReply(body); }}
          onUploadFile={async (file) => {
            const res = await uploadFile({ file, params: { type: "disputes" } }).unwrap();
            return res.data.url;
          }}
        />
      </div>

      {/* Status actions */}
      {isOpen && (
        <div className="border-t border-N40 pt-3 shrink-0">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <SMSelectDropDown
                placeholder="Change status"
                options={STATUS_ACTIONS}
                value={newStatus}
                onChange={(v: OptionType) => setNewStatus(v)}
              />
            </div>
            {newStatus && (
              <>
                <input
                  placeholder="Resolution note (optional)"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="flex-1 border border-N40 rounded px-3 py-2 text-sm focus:border-BR400 outline-none"
                />
                <Button
                  variant="brown-light"
                  loading={updating}
                  onClick={changeStatus}
                >
                  Update
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Refund Modal */}
      <Modal
        isOpen={showRefund}
        onClose={() => setShowRefund(false)}
        title="Process Refund"
        mobileLayoutType="normal"
        footerData={
          <div className="flex gap-3 justify-end">
            <Button variant="gold" onClick={() => setShowRefund(false)}>
              Cancel
            </Button>
            <Button
              variant="brown-light"
              loading={refunding}
              onClick={processRefund}
            >
              Process Refund
            </Button>
          </div>
        }
      >
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-N600">
            Refund for order{" "}
            <span className="font-medium">{order.orderNumber}</span> (
            {money(order.grandTotal)}).
          </p>
          <div>
            <label className="text-xs text-N500 mb-1 block">
              Refund amount (leave blank for full refund)
            </label>
            <input
              type="number"
              placeholder={String(order.grandTotal)}
              value={refundAmt}
              onChange={(e) => setRefundAmt(e.target.value)}
              className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none"
            />
          </div>
          <div className="bg-O50 border border-O200 rounded p-3 flex items-start gap-2">
            <AlertTriangle size={14} className="text-O500 shrink-0 mt-0.5" />
            <p className="text-xs text-N600">
              This will mark the order as refunded and attempt to process the
              refund via the payment provider.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const AdminDisputesPage = () => {
  const [statusFilter, setStatusFilter] = useState<OptionType>(
    STATUS_OPTIONS[0],
  );
  const { data, isLoading } = useGetDisputesQuery({
    pageSize: 50,
    status: String(statusFilter.value),
  });
  const disputes = data?.data.data ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <Typography fontWeight="bold" className="text-xl">
          Disputes
        </Typography>
        <div className="w-44">
          <SMSelectDropDown
            placeholder="Filter"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(v: OptionType) => setStatusFilter(v)}
          />
        </div>
      </div>

      <div
        className="flex border border-N40 rounded-lg overflow-hidden bg-white"
        style={{ height: "calc(100vh - 200px)" }}
      >
        {/* List */}
        <div
          className={`w-full sm:w-[320px] sm:border-r border-N40 shrink-0 overflow-y-auto ${selectedId ? "hidden sm:block" : ""}`}
        >
          <div className="px-4 py-3 border-b border-N40 bg-N10 text-sm font-semibold text-N700">
            <RotateCcw size={14} className="inline mr-2" />
            Disputes ({disputes.length})
          </div>
          {isLoading ? (
            <div className="text-center py-12 text-sm text-N400">
              Loading…
            </div>
          ) : disputes.length === 0 ? (
            <div className="text-center py-12 text-sm text-N400">
              No disputes
            </div>
          ) : (
            disputes.map((d) => (
              <button
                key={d._id}
                onClick={() => setSelectedId(d._id)}
                className={`w-full text-left px-4 py-3 border-b border-N20 hover:bg-N10 transition-colors ${selectedId === d._id ? "bg-BR50" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-N800 truncate">
                    {d.customer.firstName} {d.customer.lastName}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusCls[d.status]}`}
                  >
                    {statusLabel[d.status]}
                  </span>
                </div>
                <div className="text-xs text-N600 truncate mt-0.5">
                  {d.order.orderNumber} · {d.type.replace(/_/g, " ")}
                </div>
                <div className="text-xs text-N400 truncate">{d.reason}</div>
                <div className="text-[10px] text-N400 mt-1">
                  {formatDate(d.createdAt)}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div
          className={`flex-1 p-4 ${!selectedId ? "hidden sm:flex sm:items-center sm:justify-center" : ""}`}
        >
          {selectedId ? (
            <DisputeDetail disputeId={selectedId} />
          ) : (
            <div className="text-center flex flex-col items-center gap-2">
              <RotateCcw size={40} className="text-N200" />
              <Typography color="N400" className="text-sm">
                Select a dispute to manage
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDisputesPage;
