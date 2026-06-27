import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Image as ImageIcon,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
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
  useCreateAdMutation,
  useDeleteAdMutation,
  useGetAdsQuery,
  useUpdateAdMutation,
  type IAd,
  type IAdProduct,
} from "@/redux/api/ads";
import { useGetProductsQuery } from "@/redux/api/products";
import { useUploadMutation } from "@/redux/api/resources";

const EMPTY = {
  title: "",
  eyebrow: "",
  subtitle: "",
  description: "",
  image: "",
  ctaText: "",
  ctaLink: "",
  products: [] as string[],
  isActive: true,
  order: 0,
};

const productIds = (ad: IAd): string[] =>
  (ad.products ?? []).map((p) => (typeof p === "string" ? p : p._id));

const adProductMeta = (ad: IAd): Record<string, IAdProduct> => {
  const map: Record<string, IAdProduct> = {};
  (ad.products ?? []).forEach((p) => {
    if (typeof p !== "string") map[p._id] = p;
  });
  return map;
};

const AdsSettings = () => {
  const { data, isLoading } = useGetAdsQuery({ pageNumber: 1, pageSize: 50 });
  const ads = data?.data?.data ?? [];

  const [createAd, { isLoading: creating }] = useCreateAdMutation();
  const [updateAd, { isLoading: updating }] = useUpdateAdMutation();
  const [deleteAd] = useDeleteAdMutation();
  const [uploadFile, { isLoading: uploadingImage }] = useUploadMutation();

  const [form, setForm] = useState<typeof EMPTY & { _id?: string }>(EMPTY);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<IAd | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Searchable promoted-products picker.
  const [productSearch, setProductSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [knownProducts, setKnownProducts] = useState<
    Record<string, IAdProduct>
  >({});

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(productSearch.trim()), 300);
    return () => clearTimeout(t);
  }, [productSearch]);

  const { data: productsRes, isFetching: searchingProducts } =
    useGetProductsQuery({
      pageNumber: 1,
      pageSize: 30,
      searchTerm: debouncedSearch,
    });
  const searchResults = productsRes?.data?.data ?? [];

  // Keep a name/image lookup for any product the admin has ever seen/selected.
  useEffect(() => {
    if (searchResults.length === 0) return;
    setKnownProducts((prev) => {
      const next = { ...prev };
      searchResults.forEach((p) => {
        next[p._id] = { _id: p._id, name: p.name, coverImage: p.coverImage };
      });
      return next;
    });
  }, [searchResults]);

  const selectedProducts = useMemo(
    () =>
      form.products.map(
        (id) => knownProducts[id] ?? { _id: id, name: "Selected product" },
      ),
    [form.products, knownProducts],
  );

  const openCreate = () => {
    setForm(EMPTY);
    setProductSearch("");
    setOpen(true);
  };
  const openEdit = (ad: IAd) => {
    setKnownProducts((prev) => ({ ...prev, ...adProductMeta(ad) }));
    setForm({
      _id: ad._id,
      title: ad.title,
      eyebrow: ad.eyebrow ?? "",
      subtitle: ad.subtitle ?? "",
      description: ad.description ?? "",
      image: ad.image ?? "",
      ctaText: ad.ctaText ?? "",
      ctaLink: ad.ctaLink ?? "",
      products: productIds(ad),
      isActive: ad.isActive,
      order: ad.order,
    });
    setProductSearch("");
    setOpen(true);
  };

  const toggleProduct = (p: IAdProduct) => {
    setKnownProducts((prev) => ({ ...prev, [p._id]: p }));
    setForm((f) => ({
      ...f,
      products: f.products.includes(p._id)
        ? f.products.filter((id) => id !== p._id)
        : [...f.products, p._id],
    }));
  };

  const set = (patch: Partial<typeof EMPTY>) =>
    setForm((f) => ({ ...f, ...patch }));

  const onPickImage = async (file: File) => {
    try {
      const res = await uploadFile({
        file,
        params: { type: "brands" },
      }).unwrap();
      set({ image: res.data.url });
    } catch (e) {
      notify.error({ message: "Upload failed", subtitle: getErrorMessage(e) });
    }
  };

  const save = async () => {
    if (!form.title.trim()) {
      notify.error({ message: "Title is required" });
      return;
    }
    const { _id, ...rest } = form;
    // Placement is no longer configured per-ad — ads run across hero + shop.
    const payload = { ...rest, placement: "both", order: Number(form.order) || 0 };
    try {
      if (_id) await updateAd({ id: _id, data: payload }).unwrap();
      else await createAd(payload).unwrap();
      notify.success({ message: _id ? "Ad updated" : "Ad created" });
      setOpen(false);
    } catch (e) {
      notify.error({ message: "Save failed", subtitle: getErrorMessage(e) });
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteAd(toDelete._id).unwrap();
      notify.success({ message: "Ad deleted" });
      setToDelete(null);
    } catch (e) {
      notify.error({ message: "Delete failed", subtitle: getErrorMessage(e) });
    } finally {
      setDeleting(false);
    }
  };

  const field = (label: string, key: keyof typeof EMPTY, type = "text") => (
    <label className="flex flex-col gap-1.5">
      <Typography variant="p-s" fontWeight="medium" color="N600">
        {label}
      </Typography>
      <input
        type={type}
        value={form[key] as string | number}
        onChange={(e) =>
          set({
            [key]: type === "number" ? Number(e.target.value) : e.target.value,
          } as Partial<typeof EMPTY>)
        }
        className="border border-N40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-BR400"
      />
    </label>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Typography variant="h-m" fontWeight="bold">
            Ads & Campaigns
          </Typography>
          <Typography variant="p-s" color="N500">
            Hero banners and shop campaigns shown on the storefront.
          </Typography>
        </div>
        <Button variant="brown-light" onClick={openCreate}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> New ad
          </span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : ads.length === 0 ? (
        <div className="border border-dashed border-N40 rounded-2xl py-16 text-center">
          <Typography color="N500">
            No ads yet. Create your first one.
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ads.map((ad) => (
            <div
              key={ad._id}
              className="border border-N30 rounded-2xl bg-white overflow-hidden flex flex-col"
            >
              <div className="h-32 bg-N10 relative">
                {ad.image ? (
                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-N300">
                    <ImageIcon size={28} />
                  </div>
                )}
                {!ad.isActive && (
                  <span className="absolute top-2 right-2 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-R50 text-R500">
                    Inactive
                  </span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col gap-1">
                <Typography variant="p-m" fontWeight="bold">
                  {ad.title}
                </Typography>
                {ad.subtitle && (
                  <Typography
                    variant="p-s"
                    color="N500"
                    className="line-clamp-1"
                  >
                    {ad.subtitle}
                  </Typography>
                )}
                <Typography variant="c-s" color="N400" className="mt-1">
                  {productIds(ad).length} product
                  {productIds(ad).length === 1 ? "" : "s"}
                </Typography>
              </div>
              <div className="flex items-center gap-1 px-3 py-2 border-t border-N20">
                <button
                  onClick={() => openEdit(ad)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-N500 hover:text-BR400 transition-colors"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => setToDelete(ad)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-N500 hover:text-R500 transition-colors ml-auto"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={form._id ? "Edit ad" : "New ad"}
        mobileLayoutType="normal"
        className="max-w-2xl"
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
              {form._id ? "Save changes" : "Create ad"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4 p-6">
          {field("Title", "title")}
          <div className="grid grid-cols-2 gap-3">
            {field("Eyebrow", "eyebrow")}
            {field("Subtitle", "subtitle")}
          </div>

          <label className="flex flex-col gap-1.5">
            <Typography variant="p-s" fontWeight="medium" color="N600">
              Description
            </Typography>
            <textarea
              value={form.description}
              rows={2}
              onChange={(e) => set({ description: e.target.value })}
              className="border border-N40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-BR400 resize-none"
            />
          </label>

          {/* Image upload (resource upload pattern) */}
          <div className="flex flex-col gap-1.5">
            <Typography variant="p-s" fontWeight="medium" color="N600">
              Banner image
            </Typography>
            <div className="relative w-full rounded-xl overflow-hidden h-44 border border-N30">
              {form.image ? (
                <>
                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                  <img
                    src={form.image}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => set({ image: "" })}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white"
                  >
                    <X size={14} className="text-N700" />
                  </button>
                  <label className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 text-xs font-semibold text-N700 shadow hover:bg-white cursor-pointer">
                    <Camera size={12} /> Change
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
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-N40 bg-N10 hover:border-BR200 cursor-pointer">
                  {uploadingImage ? (
                    <Loader2 size={22} className="text-BR400 animate-spin" />
                  ) : (
                    <ImagePlus size={22} className="text-N300" />
                  )}
                  <span className="text-xs text-N500">
                    {uploadingImage ? "Uploading…" : "Upload banner image"}
                  </span>
                  <span className="text-[10px] text-N300">
                    PNG, JPG, WEBP · Max 10MB
                  </span>
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

          <div className="grid grid-cols-2 gap-3">
            {field("CTA text", "ctaText")}
            {field("CTA link", "ctaLink")}
          </div>

          {field("Order", "order", "number")}

          {/* Searchable promoted products */}
          <div className="flex flex-col gap-2">
            <Typography variant="p-s" fontWeight="medium" color="N600">
              Promoted products ({form.products.length})
            </Typography>

            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedProducts.map((p) => (
                  <span
                    key={p._id}
                    className="flex items-center gap-1.5 bg-BR50 text-BR600 text-xs px-2 py-1 rounded-full"
                  >
                    <span className="truncate max-w-[140px]">{p.name}</span>
                    <button
                      onClick={() => toggleProduct(p)}
                      aria-label={`Remove ${p.name}`}
                      className="hover:text-R500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-N400"
              />
              <input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products to promote…"
                className="w-full border border-N40 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-BR400"
              />
            </div>

            <div className="border border-N30 rounded-lg max-h-44 overflow-auto divide-y divide-N20">
              {searchingProducts ? (
                <div className="flex justify-center py-6">
                  <Loader2 size={18} className="text-BR400 animate-spin" />
                </div>
              ) : searchResults.length === 0 ? (
                <Typography variant="p-s" color="N400" className="p-3">
                  No products match your search.
                </Typography>
              ) : (
                searchResults.map((p) => (
                  <label
                    key={p._id}
                    className="flex items-center gap-3 p-2.5 cursor-pointer hover:bg-N10"
                  >
                    <input
                      type="checkbox"
                      checked={form.products.includes(p._id)}
                      onChange={() =>
                        toggleProduct({
                          _id: p._id,
                          name: p.name,
                          coverImage: p.coverImage,
                        })
                      }
                    />
                    <div className="w-8 h-8 rounded bg-N10 overflow-hidden shrink-0">
                      {p.coverImage && (
                        // eslint-disable-next-line jsx-a11y/img-redundant-alt
                        <img
                          src={p.coverImage}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <Typography variant="p-s" className="truncate">
                      {p.name}
                    </Typography>
                  </label>
                ))
              )}
            </div>
          </div>

          <Toggle
            label="Active"
            checked={form.isActive}
            onChange={(c) => set({ isActive: c })}
          />
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={!!toDelete}
        closeModal={() => setToDelete(null)}
        formTitle="Delete ad"
        message={`Delete "${toDelete?.title}"? This cannot be undone.`}
        buttonLabel="Delete"
        handleClick={confirmDelete}
        type="warning"
        isLoading={deleting}
      />
    </div>
  );
};

export default AdsSettings;
