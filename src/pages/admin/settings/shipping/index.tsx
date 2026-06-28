import { useState } from "react";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Button, Typography, TextField, notify } from "@/components";
import { Modal } from "@/components/modal/modal";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { AddressAutocomplete } from "@/components/addressAutocomplete/AddressAutocomplete";
import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/redux/api/genericInterface";

interface IStoreAddress {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  addressCode?: string;
  isDefault: boolean;
}

const storeAddressApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getStoreAddresses: b.query<IResponse<IStoreAddress[]>, void>({
      query: () => ({ url: "/store-addresses", method: "GET" }),
      providesTags: ["STORE_ADDRESSES" as any],
    }),
    createStoreAddress: b.mutation<IResponse<IStoreAddress>, Partial<IStoreAddress>>({
      query: (data) => ({ url: "/store-addresses", method: "POST", data }),
      invalidatesTags: ["STORE_ADDRESSES" as any],
    }),
    updateStoreAddress: b.mutation<IResponse<IStoreAddress>, { id: string; data: Partial<IStoreAddress> }>({
      query: ({ id, data }) => ({ url: `/store-addresses/${id}`, method: "PATCH", data }),
      invalidatesTags: ["STORE_ADDRESSES" as any],
    }),
    deleteStoreAddress: b.mutation<IResponse, string>({
      query: (id) => ({ url: `/store-addresses/${id}`, method: "DELETE" }),
      invalidatesTags: ["STORE_ADDRESSES" as any],
    }),
    setDefaultStoreAddress: b.mutation<IResponse<IStoreAddress>, string>({
      query: (id) => ({ url: `/store-addresses/${id}/default`, method: "PATCH" }),
      invalidatesTags: ["STORE_ADDRESSES" as any],
    }),
  }),
});

const {
  useGetStoreAddressesQuery,
  useCreateStoreAddressMutation,
  useUpdateStoreAddressMutation,
  useDeleteStoreAddressMutation,
  useSetDefaultStoreAddressMutation,
} = storeAddressApi;

const blank = { name: "", email: "", phone: "", address: "", city: "", state: "", country: "Nigeria", postalCode: "", isDefault: false };

const ShippingSettings = () => {
  const { data, isLoading } = useGetStoreAddressesQuery();
  const [createAddr, { isLoading: creating }] = useCreateStoreAddressMutation();
  const [updateAddr, { isLoading: updating }] = useUpdateStoreAddressMutation();
  const [deleteAddr] = useDeleteStoreAddressMutation();
  const [setDefault] = useSetDefaultStoreAddressMutation();

  const addresses = data?.data ?? [];
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(blank);

  const openNew = () => { setForm(blank); setEditingId(null); setShowForm(true); };
  const openEdit = (a: IStoreAddress) => {
    setForm({ name: a.name, email: a.email, phone: a.phone, address: a.address, city: a.city, state: a.state, country: a.country, postalCode: a.postalCode || "", isDefault: a.isDefault });
    setEditingId(a._id);
    setShowForm(true);
  };

  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));

  const save = async () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state) {
      notify.error({ message: "Fill all required fields" }); return;
    }
    try {
      if (editingId) {
        await updateAddr({ id: editingId, data: form }).unwrap();
        notify.success({ message: "Address updated & validated" });
      } else {
        await createAddr(form).unwrap();
        notify.success({ message: "Address added & validated with Shipbubble" });
      }
      setShowForm(false);
    } catch (err) {
      notify.error({ message: "Failed — address may be invalid for shipping", subtitle: getErrorMessage(err) });
    }
  };

  const handleDelete = async (id: string) => {
    try { await deleteAddr(id).unwrap(); notify.success({ message: "Address removed" }); }
    catch (err) { notify.error({ message: "Delete failed", subtitle: getErrorMessage(err) }); }
  };

  const handleSetDefault = async (id: string) => {
    try { await setDefault(id).unwrap(); notify.success({ message: "Default shipping address updated" }); }
    catch (err) { notify.error({ message: "Failed", subtitle: getErrorMessage(err) }); }
  };

  if (isLoading) return <div className="text-N400 py-12 text-center">Loading…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Typography variant="h-s" fontWeight="bold">Shipping Addresses</Typography>
          <Typography variant="p-s" color="N500" className="mt-1">
            Manage your store's ship-from addresses. The default address is used as the sender for all orders.
          </Typography>
        </div>
        <Button size="sm" onClick={openNew}>
          <span className="flex items-center gap-1.5"><Plus size={14} /> Add Address</span>
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-N30 rounded-xl">
          <MapPin size={32} className="mx-auto text-N300 mb-3" />
          <p className="text-sm text-N500 mb-4">No shipping addresses yet</p>
          <Button size="sm" variant="brown-light" onClick={openNew}>Add your first address</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((a) => (
            <div key={a._id} className={`border rounded-xl p-5 ${a.isDefault ? "border-BR400 bg-BR50/20" : "border-N30"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-N900">{a.name}</span>
                    {a.isDefault && (
                      <span className="text-[10px] bg-BR500 text-white px-2 py-0.5 rounded-full font-medium">Default</span>
                    )}
                    {a.addressCode && (
                      <span className="text-[10px] bg-G50 text-G600 px-2 py-0.5 rounded-full font-medium">Verified</span>
                    )}
                  </div>
                  <p className="text-sm text-N600">{a.phone} · {a.email}</p>
                  <p className="text-sm text-N500 mt-1">{a.address}, {a.city}, {a.state}, {a.country}</p>
                  {a.addressCode && (
                    <p className="text-[11px] text-N400 mt-1">Shipbubble code: {a.addressCode}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!a.isDefault && (
                    <button onClick={() => handleSetDefault(a._id)} title="Set as default"
                      className="w-8 h-8 rounded-lg grid place-items-center text-N400 hover:text-BR500 hover:bg-BR50 transition-colors">
                      <Star size={14} />
                    </button>
                  )}
                  <button onClick={() => openEdit(a)} title="Edit"
                    className="w-8 h-8 rounded-lg grid place-items-center text-N400 hover:text-N700 hover:bg-N10 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(a._id)} title="Delete"
                    className="w-8 h-8 rounded-lg grid place-items-center text-N400 hover:text-R500 hover:bg-R50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? "Edit Shipping Address" : "Add Shipping Address"} mobileLayoutType="normal"
        footerData={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button loading={creating || updating} onClick={save}>
              {creating || updating ? "Validating…" : editingId ? "Update" : "Add"}
            </Button>
          </div>
        }>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          <TextField name="name" label="Business/Store Name" required value={form.name} onChange={(e: any) => set("name", e.target.value)} />
          <TextField name="email" label="Email" required value={form.email} onChange={(e: any) => set("email", e.target.value)} />
          <TextField name="phone" label="Phone" required value={form.phone} onChange={(e: any) => set("phone", e.target.value)} />
          <div className="sm:col-span-2">
            <label className="text-xs text-N600 font-medium block mb-1">Street Address <span className="text-R400">*</span></label>
            <AddressAutocomplete
              value={form.address}
              onChange={(v) => set("address", v)}
              onSelect={(result) => {
                setForm((f) => ({
                  ...f,
                  address: result.address,
                  city: result.city || f.city,
                  state: result.state || f.state,
                  country: result.country || f.country || "Nigeria",
                  postalCode: result.postalCode || f.postalCode,
                }));
              }}
            />
          </div>
          <TextField name="city" label="City" required value={form.city} onChange={(e: any) => set("city", e.target.value)} />
          <TextField name="state" label="State" required value={form.state} onChange={(e: any) => set("state", e.target.value)} />
          <TextField name="country" label="Country" value={form.country} onChange={(e: any) => set("country", e.target.value)} />
          <TextField name="postalCode" label="Postal Code" value={form.postalCode} onChange={(e: any) => set("postalCode", e.target.value)} />
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => set("isDefault", e.target.checked)} className="w-4 h-4 accent-BR500" />
              <span className="text-sm text-N600">Set as default shipping address</span>
            </label>
          </div>
          <div className="sm:col-span-2 bg-B50 border border-B200 rounded-lg p-3">
            <p className="text-xs text-N600">
              Addresses are validated with Shipbubble when saved. Only verified addresses can be used for shipping.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShippingSettings;
