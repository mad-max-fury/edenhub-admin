import { useState } from "react";
import { Camera, Check, ImagePlus, Loader2, Plus, Star, Trash2, X } from "lucide-react";
import {
  Button,
  ConfirmationModal,
  Modal,
  Spinner,
  Typography,
  notify,
} from "@/components";
import { getErrorMessage } from "@/utils/getErrorMessges";
import {
  useCreateShopReviewMutation,
  useDeleteShopReviewMutation,
  useGetAllShopReviewsQuery,
  useGetShopReviewStatsQuery,
  useUpdateShopReviewStatusMutation,
  type IShopReview,
} from "@/redux/api/shopReviews";
import { useUploadMutation } from "@/redux/api/resources";

const EMPTY_REVIEW = {
  name: "",
  title: "",
  comment: "",
  rating: 5,
  image: "",
};

const STATUS_TABS = ["pending", "approved", "rejected", "all"];

const statusBadge: Record<string, string> = {
  pending: "bg-Y50 text-Y500",
  approved: "bg-G50 text-G500",
  rejected: "bg-R50 text-R500",
};

const Stars = ({ value }: { value: number }) => (
  <span className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={13}
        className={i < Math.round(value) ? "fill-Y400 text-Y400" : "text-N40"}
      />
    ))}
  </span>
);

const ReviewSettings = () => {
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);

  const { data: statsRes } = useGetShopReviewStatsQuery();
  const stats = statsRes?.data;

  const { data, isFetching } = useGetAllShopReviewsQuery({
    pageNumber: page,
    pageSize: 20,
    status,
  });
  const reviews = data?.data?.data ?? [];
  const metadata = data?.data?.metadata;

  const [updateStatus] = useUpdateShopReviewStatusMutation();
  const [deleteReview] = useDeleteShopReviewMutation();
  const [createReview, { isLoading: creating }] = useCreateShopReviewMutation();
  const [uploadFile, { isLoading: uploadingImage }] = useUploadMutation();
  const [toDelete, setToDelete] = useState<IShopReview | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [rForm, setRForm] = useState(EMPTY_REVIEW);

  const onPickImage = async (file: File) => {
    try {
      const res = await uploadFile({
        file,
        params: { type: "profiles" },
      }).unwrap();
      setRForm((f) => ({ ...f, image: res.data.url }));
    } catch (e) {
      notify.error({ message: "Upload failed", subtitle: getErrorMessage(e) });
    }
  };

  const submitCreate = async () => {
    if (!rForm.name.trim() || rForm.comment.trim().length < 3) {
      notify.error({ message: "Name and a short comment are required" });
      return;
    }
    try {
      await createReview({
        name: rForm.name.trim(),
        title: rForm.title.trim() || undefined,
        comment: rForm.comment.trim(),
        rating: rForm.rating,
        image: rForm.image || undefined,
      }).unwrap();
      notify.success({ message: "Review published" });
      setRForm(EMPTY_REVIEW);
      setCreateOpen(false);
    } catch (e) {
      notify.error({ message: "Could not create review", subtitle: getErrorMessage(e) });
    }
  };

  const moderate = async (id: string, next: string) => {
    try {
      await updateStatus({ id, status: next }).unwrap();
      notify.success({ message: `Review ${next}` });
    } catch (e) {
      notify.error({ message: "Action failed", subtitle: getErrorMessage(e) });
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteReview(toDelete._id).unwrap();
      notify.success({ message: "Review deleted" });
      setToDelete(null);
    } catch (e) {
      notify.error({ message: "Delete failed", subtitle: getErrorMessage(e) });
    } finally {
      setDeleting(false);
    }
  };

  const statCards = [
    { label: "Total", value: stats?.total ?? 0 },
    { label: "Pending", value: stats?.pending ?? 0 },
    { label: "Approved", value: stats?.approved ?? 0 },
    { label: "Avg rating", value: stats?.avgRating ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Typography variant="h-m" fontWeight="bold">
            Shop Reviews
          </Typography>
          <Typography variant="p-s" color="N500">
            Moderate customer reviews shown in the storefront testimonials.
          </Typography>
        </div>
        <Button variant="brown-light" onClick={() => setCreateOpen(true)}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> New review
          </span>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((c) => (
          <div key={c.label} className="bg-N10 rounded-xl p-4">
            <Typography variant="c-s" color="N500" className="uppercase">
              {c.label}
            </Typography>
            <Typography variant="h-l" fontWeight="bold" className="mt-1">
              {c.value}
            </Typography>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
            className={`text-xs capitalize px-4 py-2 rounded-full border transition-colors ${
              status === s
                ? "bg-BR400 text-white border-BR400"
                : "bg-white text-N600 border-N40 hover:border-BR400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isFetching ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : reviews.length === 0 ? (
        <div className="border border-dashed border-N40 rounded-2xl py-16 text-center">
          <Typography color="N500">No {status} reviews.</Typography>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="border border-N30 rounded-2xl bg-white p-4 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-BR50 text-BR500 grid place-items-center text-sm font-bold uppercase">
                    {r.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <Typography variant="p-m" fontWeight="medium">
                      {r.name}
                    </Typography>
                    <Stars value={r.rating} />
                  </div>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-full ${
                    statusBadge[r.status] ?? "bg-N10 text-N500"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              {r.title && (
                <Typography variant="p-s" fontWeight="medium">
                  {r.title}
                </Typography>
              )}
              <Typography variant="p-s" color="N600">
                {r.comment}
              </Typography>

              <div className="flex items-center gap-2 pt-1">
                {r.status !== "approved" && (
                  <button
                    onClick={() => moderate(r._id, "approved")}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-G50 text-G500 hover:bg-G75 transition-colors"
                  >
                    <Check size={14} /> Approve
                  </button>
                )}
                {r.status !== "rejected" && (
                  <button
                    onClick={() => moderate(r._id, "rejected")}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-R50 text-R500 hover:bg-R75 transition-colors"
                  >
                    <X size={14} /> Reject
                  </button>
                )}
                <button
                  onClick={() => setToDelete(r)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-N500 hover:text-R500 transition-colors ml-auto"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}

          {metadata && metadata.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!metadata.hasPrevious}
              >
                Previous
              </Button>
              <Typography variant="p-s" color="N500">
                {metadata.currentPage} / {metadata.totalPages}
              </Typography>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => p + 1)}
                disabled={!metadata.hasNext}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New review"
        mobileLayoutType="normal"
        className="max-w-lg"
        footerData={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setCreateOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="brown-light"
              onClick={submitCreate}
              loading={creating}
              className="flex-1"
            >
              Publish review
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRForm((f) => ({ ...f, rating: i + 1 }))}
                aria-label={`${i + 1} star`}
              >
                <Star
                  size={26}
                  className={
                    i < rForm.rating ? "fill-Y400 text-Y400" : "text-N40"
                  }
                />
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-1.5">
            <Typography variant="p-s" fontWeight="medium" color="N600">
              Reviewer name
            </Typography>
            <input
              value={rForm.name}
              onChange={(e) => setRForm((f) => ({ ...f, name: e.target.value }))}
              className="border border-N40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-BR400"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <Typography variant="p-s" fontWeight="medium" color="N600">
              Title (optional)
            </Typography>
            <input
              value={rForm.title}
              onChange={(e) =>
                setRForm((f) => ({ ...f, title: e.target.value }))
              }
              className="border border-N40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-BR400"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <Typography variant="p-s" fontWeight="medium" color="N600">
              Comment
            </Typography>
            <textarea
              value={rForm.comment}
              rows={3}
              onChange={(e) =>
                setRForm((f) => ({ ...f, comment: e.target.value }))
              }
              className="border border-N40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-BR400 resize-none"
            />
          </label>

          {/* Optional reviewer picture */}
          <div className="flex flex-col gap-1.5">
            <Typography variant="p-s" fontWeight="medium" color="N600">
              Reviewer picture (optional)
            </Typography>
            {rForm.image ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-N30">
                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                <img
                  src={rForm.image}
                  alt="Reviewer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setRForm((f) => ({ ...f, image: "" }))}
                  className="absolute top-0 right-0 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow"
                >
                  <X size={12} className="text-N700" />
                </button>
              </div>
            ) : (
              <label className="w-20 h-20 rounded-full border-2 border-dashed border-N40 hover:border-BR200 flex flex-col items-center justify-center gap-1 cursor-pointer">
                {uploadingImage ? (
                  <Loader2 size={18} className="text-BR400 animate-spin" />
                ) : (
                  <ImagePlus size={18} className="text-N300" />
                )}
                <Camera size={12} className="text-N300" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onPickImage(f);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={!!toDelete}
        closeModal={() => setToDelete(null)}
        formTitle="Delete review"
        message={`Delete the review from ${toDelete?.name}? This cannot be undone.`}
        buttonLabel="Delete"
        handleClick={confirmDelete}
        type="warning"
        isLoading={deleting}
      />
    </div>
  );
};

export default ReviewSettings;
