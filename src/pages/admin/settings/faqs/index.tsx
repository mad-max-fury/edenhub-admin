import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Button,
  ConfirmationModal,
  Modal,
  Spinner,
  Toggle,
  Typography,
  notify,
} from "@/components";
import { getErrorMessage } from "@/utils/getErrorMessges";
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetFaqsQuery,
  useUpdateFaqMutation,
  type IFaq,
} from "@/redux/api/faqs";

const EMPTY = {
  question: "",
  answer: "",
  category: "general",
  order: 0,
  isActive: true,
};

const FaqSettings = () => {
  const { data, isLoading } = useGetFaqsQuery();
  const faqs = data?.data ?? [];

  const [createFaq, { isLoading: creating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: updating }] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  const [form, setForm] = useState<typeof EMPTY & { _id?: string }>(EMPTY);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<IFaq | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setForm(EMPTY);
    setOpen(true);
  };
  const openEdit = (f: IFaq) => {
    setForm({
      _id: f._id,
      question: f.question,
      answer: f.answer,
      category: f.category,
      order: f.order,
      isActive: f.isActive,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      notify.error({ message: "Question and answer are required" });
      return;
    }
    const payload = {
      question: form.question,
      answer: form.answer,
      category: form.category.trim() || "general",
      order: Number(form.order) || 0,
      isActive: form.isActive,
    };
    try {
      if (form._id) await updateFaq({ id: form._id, data: payload }).unwrap();
      else await createFaq(payload).unwrap();
      notify.success({ message: form._id ? "FAQ updated" : "FAQ created" });
      setOpen(false);
    } catch (e) {
      notify.error({ message: "Save failed", subtitle: getErrorMessage(e) });
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteFaq(toDelete._id).unwrap();
      notify.success({ message: "FAQ deleted" });
      setToDelete(null);
    } catch (e) {
      notify.error({ message: "Delete failed", subtitle: getErrorMessage(e) });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Typography variant="h-m" fontWeight="bold">
            FAQ Management
          </Typography>
          <Typography variant="p-s" color="N500">
            Questions and answers shown on the storefront FAQ section.
          </Typography>
        </div>
        <Button variant="brown-light" onClick={openCreate}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add FAQ
          </span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : faqs.length === 0 ? (
        <div className="border border-dashed border-N40 rounded-2xl py-16 text-center">
          <Typography color="N500">No FAQs yet. Add your first one.</Typography>
        </div>
      ) : (
        <div className="border border-N30 rounded-2xl divide-y divide-N30 bg-white overflow-hidden">
          {faqs.map((f) => (
            <div
              key={f._id}
              className="p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Typography variant="p-m" fontWeight="medium">
                    {f.question}
                  </Typography>
                  <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-N10 text-N500">
                    {f.category}
                  </span>
                  {!f.isActive && (
                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-R50 text-R500">
                      Hidden
                    </span>
                  )}
                </div>
                <Typography
                  variant="p-s"
                  color="N500"
                  className="mt-1 line-clamp-2"
                >
                  {f.answer}
                </Typography>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(f)}
                  className="p-2 text-N500 hover:text-BR400 transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setToDelete(f)}
                  className="p-2 text-N500 hover:text-R500 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={form._id ? "Edit FAQ" : "Add FAQ"}
        mobileLayoutType="normal"
        className="max-w-lg"
        footerData={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="brown-light"
              onClick={save}
              loading={creating || updating}
              className="flex-1"
            >
              {form._id ? "Save changes" : "Create FAQ"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4 p-6">
          <label className="flex flex-col gap-1.5">
            <Typography variant="p-s" fontWeight="medium" color="N600">
              Question
            </Typography>
            <input
              value={form.question}
              onChange={(e) =>
                setForm((f) => ({ ...f, question: e.target.value }))
              }
              className="border border-N40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-BR400"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <Typography variant="p-s" fontWeight="medium" color="N600">
              Answer
            </Typography>
            <textarea
              value={form.answer}
              rows={4}
              onChange={(e) =>
                setForm((f) => ({ ...f, answer: e.target.value }))
              }
              className="border border-N40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-BR400 resize-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <Typography variant="p-s" fontWeight="medium" color="N600">
                Category
              </Typography>
              <input
                value={form.category}
                placeholder="general"
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="border border-N40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-BR400"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <Typography variant="p-s" fontWeight="medium" color="N600">
                Order
              </Typography>
              <input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order: Number(e.target.value) }))
                }
                className="border border-N40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-BR400"
              />
            </label>
          </div>

          <Toggle
            label="Visible on storefront"
            checked={form.isActive}
            onChange={(c) => setForm((f) => ({ ...f, isActive: c }))}
          />
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={!!toDelete}
        closeModal={() => setToDelete(null)}
        formTitle="Delete FAQ"
        message={`Delete "${toDelete?.question}"? This cannot be undone.`}
        buttonLabel="Delete"
        handleClick={confirmDelete}
        type="warning"
        isLoading={deleting}
      />
    </div>
  );
};

export default FaqSettings;
