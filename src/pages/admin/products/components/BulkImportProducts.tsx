import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileJson,
  UploadCloud,
  X,
} from "lucide-react";

import { Button, Typography, notify } from "@/components";
import {
  useBulkCreateProductsMutation,
  type IBulkProductInput,
  type IBulkProductsResult,
} from "@/redux/api/products";
import { getErrorMessage } from "@/utils/getErrorMessges";

import {
  CSV_TEMPLATE,
  JSON_TEMPLATE,
  csvToProducts,
  jsonToProducts,
  parseCsv,
  validateProducts,
} from "./bulkImport";

type Format = "csv" | "json";

type Props = { onClose: () => void };

const download = (content: string, filename: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const BulkImportProducts = ({ onClose }: Props) => {
  const [format, setFormat] = useState<Format>("csv");
  const [fileName, setFileName] = useState("");
  const [products, setProducts] = useState<IBulkProductInput[] | null>(null);
  const [variantCount, setVariantCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<IBulkProductsResult | null>(null);

  const [bulkCreate, { isLoading }] = useBulkCreateProductsMutation();

  const reset = () => {
    setFileName("");
    setProducts(null);
    setVariantCount(0);
    setErrors([]);
    setResult(null);
  };

  const switchFormat = (f: Format) => {
    setFormat(f);
    reset();
  };

  const ingest = (text: string) => {
    setResult(null);
    try {
      const parsed =
        format === "csv" ? csvToProducts(parseCsv(text)) : jsonToProducts(text);

      const validation = [...parsed.errors, ...validateProducts(parsed.products)];
      if (validation.length) {
        setErrors(validation.slice(0, 12));
        setProducts(null);
        return;
      }
      setErrors([]);
      setProducts(parsed.products);
      setVariantCount(parsed.variantCount);
    } catch (err) {
      setProducts(null);
      setErrors([
        `Could not parse ${format.toUpperCase()}: ${
          err instanceof Error ? err.message : "invalid file"
        }`,
      ]);
    }
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    ingest(await file.text());
  };

  const downloadTemplate = () => {
    if (format === "csv") {
      download(CSV_TEMPLATE, "products-template.csv", "text/csv");
    } else {
      download(JSON_TEMPLATE, "products-template.json", "application/json");
    }
  };

  const handleImport = async () => {
    if (!products) return;
    try {
      const res = await bulkCreate({ products }).unwrap();
      setResult(res.data);
      if (res.data.failed.length === 0) {
        notify.success({
          message: "Import complete",
          subtitle: `${res.data.createdCount} products created`,
        });
        onClose();
      } else {
        notify.info({
          message: "Import finished with skips",
          subtitle: `${res.data.createdCount} created, ${res.data.failed.length} skipped`,
        });
      }
    } catch (err) {
      notify.error({ message: "Import failed", subtitle: getErrorMessage(err) });
    }
  };

  const accept = format === "csv" ? ".csv,text/csv" : "application/json,.json";

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex-1 overflow-y-auto flex flex-col gap-5 p-6">
        {/* Format switch */}
        <div className="flex items-center gap-2 bg-N10 border border-N30 rounded-lg p-1 w-fit">
          {(
            [
              { id: "csv", label: "CSV", icon: <FileSpreadsheet size={14} /> },
              { id: "json", label: "JSON", icon: <FileJson size={14} /> },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => switchFormat(f.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                format === f.id
                  ? "bg-white text-N800 shadow-sm"
                  : "text-N500 hover:text-N700"
              }`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-start justify-between gap-4">
          <Typography variant="p-s" color="N500">
            {format === "csv" ? (
              <>
                Upload a CSV. Group variant rows under one product by repeating
                the same <code className="text-N700">handle</code>. Category is
                matched by <b>slug</b> or id.
              </>
            ) : (
              <>
                Upload a JSON array of products (or{" "}
                <code className="text-N700">{`{ "products": [...] }`}</code>).
                Category is matched by <b>slug</b> or id.
              </>
            )}
          </Typography>
          <button
            type="button"
            onClick={downloadTemplate}
            className="flex items-center gap-1 text-BR500 text-xs font-medium whitespace-nowrap hover:underline"
          >
            <Download size={14} /> {format.toUpperCase()} template
          </button>
        </div>

        {/* Dropzone */}
        <label className="border-2 border-dashed border-N40 rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:border-BR300 hover:bg-N10 transition-colors cursor-pointer">
          <UploadCloud size={28} className="text-N400" />
          <Typography variant="p-s" color="N600" fontWeight="medium">
            Click to choose a {format.toUpperCase()} file
          </Typography>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>

        {fileName && (
          <div className="flex items-center justify-between border border-N30 rounded-md px-4 py-3 bg-N0">
            <div className="flex items-center gap-2 min-w-0">
              {format === "csv" ? (
                <FileSpreadsheet size={18} className="text-G500 shrink-0" />
              ) : (
                <FileJson size={18} className="text-BR500 shrink-0" />
              )}
              <Typography variant="p-s" color="N700" className="truncate">
                {fileName}
              </Typography>
            </div>
            <button
              type="button"
              onClick={reset}
              className="p-1 text-N400 hover:text-R400"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {errors.length > 0 && (
          <div className="border border-R200 bg-R50 rounded-md p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-R400" />
              <Typography variant="p-s" fontWeight="bold" color="R400">
                File has problems
              </Typography>
            </div>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              {errors.map((e, i) => (
                <li key={i}>
                  <Typography variant="c-s" color="R400">
                    {e}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
        )}

        {products && errors.length === 0 && !result && (
          <div className="border border-G100 bg-G50 rounded-md p-4 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-G500" />
            <Typography variant="p-s" color="G500">
              Ready to import <b>{products.length}</b> product
              {products.length === 1 ? "" : "s"}
              {variantCount > 0 && (
                <>
                  {" "}
                  with <b>{variantCount}</b> variant
                  {variantCount === 1 ? "" : "s"}
                </>
              )}
              .
            </Typography>
          </div>
        )}

        {result && (
          <div className="border border-N30 rounded-md p-4 flex flex-col gap-2">
            <Typography variant="p-s" fontWeight="bold" color="N700">
              {result.createdCount} created · {result.failed.length} skipped
            </Typography>
            {result.failed.length > 0 && (
              <ul className="list-disc pl-5 flex flex-col gap-1">
                {result.failed.map((f, i) => (
                  <li key={i}>
                    <Typography variant="c-s" color="N600">
                      <b>{f.name}</b> — {f.reason}
                    </Typography>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-N30 flex justify-end gap-3 bg-white">
        <Button variant="secondary" onClick={onClose} size="sm" type="button">
          {result ? "Close" : "Cancel"}
        </Button>
        {!result && (
          <Button
            size="sm"
            type="button"
            onClick={handleImport}
            loading={isLoading}
            disabled={!products || errors.length > 0}
          >
            Import products
          </Button>
        )}
      </div>
    </div>
  );
};

export default BulkImportProducts;
