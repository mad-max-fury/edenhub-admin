import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Spinner,
  Typography,
  notify,
} from "@/components";
import { getErrorMessage } from "@/utils/getErrorMessges";
import {
  useGetProductByIdQuery,
  useUpdateProductByIdMutation,
  useUpdateVariantMutation,
} from "@/redux/api/products";

interface StockModalProps {
  productId: string | null;
  productName?: string;
  onClose: () => void;
}

const StockRow = ({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub?: string;
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex items-center justify-between gap-4 py-2">
    <div className="min-w-0">
      <Typography variant="p-s" fontWeight="medium" className="truncate">
        {label}
      </Typography>
      {sub && (
        <Typography variant="c-s" color="N400">
          {sub}
        </Typography>
      )}
    </div>
    <input
      type="number"
      min={0}
      value={value}
      onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
      className="w-28 border border-N40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-BR400"
    />
  </div>
);

// Quick stock editor — adjust base + variant quantities without opening the
// full product editor.
export const StockModal = ({
  productId,
  productName,
  onClose,
}: StockModalProps) => {
  const { data, isFetching } = useGetProductByIdQuery(
    { id: productId as string },
    { skip: !productId },
  );
  const product = data?.data;

  const [updateProduct] = useUpdateProductByIdMutation();
  const [updateVariant] = useUpdateVariantMutation();
  const [saving, setSaving] = useState(false);

  const [baseQty, setBaseQty] = useState(0);
  const [variantQty, setVariantQty] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!product) return;
    setBaseQty(product.quantity ?? 0);
    setVariantQty(
      Object.fromEntries(
        (product.variants ?? []).map((v) => [v._id ?? v.name, v.quantity ?? 0]),
      ),
    );
  }, [product]);

  const save = async () => {
    if (!product) return;
    setSaving(true);
    try {
      const tasks: Promise<unknown>[] = [];
      if (baseQty !== (product.quantity ?? 0)) {
        tasks.push(
          updateProduct({ id: product._id, quantity: baseQty }).unwrap(),
        );
      }
      (product.variants ?? []).forEach((v) => {
        const key = v._id ?? v.name;
        const next = variantQty[key];
        if (v._id && next !== undefined && next !== (v.quantity ?? 0)) {
          tasks.push(
            updateVariant({
              productId: product._id,
              variantId: v._id,
              variant: { quantity: next },
            }).unwrap(),
          );
        }
      });

      if (tasks.length === 0) {
        notify.info?.({ message: "No stock changes to save" });
        onClose();
        return;
      }
      await Promise.all(tasks);
      notify.success({ message: "Stock updated" });
      onClose();
    } catch (e) {
      notify.error({ message: "Update failed", subtitle: getErrorMessage(e) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={!!productId}
      onClose={onClose}
      title={productName ? `Update stock · ${productName}` : "Update stock"}
      mobileLayoutType="normal"
      className="max-w-md"
      footerData={
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="brown-light"
            onClick={save}
            loading={saving}
            disabled={isFetching}
            className="flex-1"
          >
            Save stock
          </Button>
        </div>
      }
    >
      <div className="p-6">
        {isFetching || !product ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-N20">
            <StockRow
              label="Base product stock"
              sub="Stock for the product itself"
              value={baseQty}
              onChange={setBaseQty}
            />
            {(product.variants ?? []).map((v) => {
              const key = v._id ?? v.name;
              return (
                <StockRow
                  key={key}
                  label={v.name}
                  sub={v.sku ? `SKU ${v.sku}` : "Variant"}
                  value={variantQty[key] ?? 0}
                  onChange={(val) =>
                    setVariantQty((prev) => ({ ...prev, [key]: val }))
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
