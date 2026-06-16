import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileJson,
  UploadCloud,
  X,
} from "lucide-react";

import { Button, Typography, notify } from "@/components";
import {
  useBulkCreateCategoriesMutation,
  type IBulkCategoryNode,
  type IBulkImportResult,
} from "@/redux/api/categories";
import { getErrorMessage } from "@/utils/getErrorMessges";

const MAX_DEPTH = 3;
const VALID_INPUT_TYPES = ["text", "select", "radio", "checkbox"];

type Props = {
  onClose: () => void;
};

const SAMPLE: IBulkCategoryNode[] = [
  {
    name: "Electronics",
    description: "Phones, laptops and gadgets",
    isActive: true,
    attributes: [
      {
        name: "Brand",
        inputType: "text",
        isRequired: true,
        order: 0,
        options: [],
      },
    ],
    subcategories: [
      {
        name: "Phones",
        attributes: [
          {
            name: "Condition",
            inputType: "radio",
            isRequired: true,
            order: 0,
            options: [
              { label: "New", value: "new" },
              { label: "Used", value: "used" },
            ],
          },
        ],
        subcategories: [{ name: "Accessories" }],
      },
    ],
  },
  {
    name: "Fashion",
    subcategories: [{ name: "Men" }, { name: "Women" }],
  },
];

interface TreeStats {
  total: number;
  maxDepth: number;
}

// Validate the parsed JSON against the bulk-import contract and gather stats.
const validateTree = (
  nodes: unknown,
): { errors: string[]; stats: TreeStats } => {
  const errors: string[] = [];
  let total = 0;
  let maxDepth = 0;

  const walk = (value: unknown, depth: number, path: string) => {
    if (!Array.isArray(value)) {
      errors.push(`${path} must be an array of categories`);
      return;
    }
    value.forEach((node: any, i) => {
      const here = `${path}[${i}]`;
      total += 1;
      maxDepth = Math.max(maxDepth, depth);

      if (!node || typeof node !== "object") {
        errors.push(`${here} must be an object`);
        return;
      }
      if (!node.name || typeof node.name !== "string") {
        errors.push(`${here} is missing a "name"`);
      }
      if (depth > MAX_DEPTH) {
        errors.push(
          `${here} ("${node.name ?? "?"}") is nested deeper than ${MAX_DEPTH} levels`,
        );
      }
      if (node.attributes !== undefined) {
        if (!Array.isArray(node.attributes)) {
          errors.push(`${here}.attributes must be an array`);
        } else {
          node.attributes.forEach((attr: any, ai: number) => {
            if (!attr?.name) {
              errors.push(`${here}.attributes[${ai}] is missing a "name"`);
            }
            if (
              attr?.inputType &&
              !VALID_INPUT_TYPES.includes(attr.inputType)
            ) {
              errors.push(
                `${here}.attributes[${ai}] has invalid inputType "${attr.inputType}"`,
              );
            }
          });
        }
      }
      if (node.subcategories !== undefined) {
        walk(node.subcategories, depth + 1, `${here}.subcategories`);
      }
    });
  };

  walk(nodes, 1, "root");
  // Cap the number of surfaced errors so the UI stays readable.
  return { errors: errors.slice(0, 12), stats: { total, maxDepth } };
};

const BulkImportCategories = ({ onClose }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<IBulkCategoryNode[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<IBulkImportResult | null>(null);

  const [bulkCreate, { isLoading }] = useBulkCreateCategoriesMutation();

  const stats = useMemo(
    () => (parsed ? validateTree(parsed).stats : null),
    [parsed],
  );

  const reset = () => {
    setFileName("");
    setParsed(null);
    setErrors([]);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setResult(null);
    setErrors([]);
    setParsed(null);
    setFileName(file.name);

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      // Accept either a bare array or a { categories: [...] } wrapper.
      const nodes = Array.isArray(json) ? json : json?.categories;

      const { errors: validationErrors } = validateTree(nodes);
      if (validationErrors.length) {
        setErrors(validationErrors);
        return;
      }
      setParsed(nodes as IBulkCategoryNode[]);
    } catch (err) {
      setErrors([
        `Could not parse JSON: ${
          err instanceof Error ? err.message : "invalid file"
        }`,
      ]);
    }
  };

  const downloadSample = () => {
    const blob = new Blob([JSON.stringify(SAMPLE, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "categories-sample.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!parsed) return;
    try {
      const res = await bulkCreate({ categories: parsed }).unwrap();
      setResult(res.data);

      if (res.data.failed.length === 0) {
        notify.success({
          message: "Import complete",
          subtitle: `${res.data.createdCount} categories created`,
        });
        onClose();
      } else {
        notify.info({
          message: "Import finished with skips",
          subtitle: `${res.data.createdCount} created, ${res.data.failed.length} skipped`,
        });
      }
    } catch (err) {
      notify.error({
        message: "Import failed",
        subtitle: getErrorMessage(err),
      });
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex-1 overflow-y-auto flex flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <Typography variant="p-s" color="N500">
            Upload a JSON file to create many categories at once. Use{" "}
            <code className="text-N700">subcategories</code> to nest (up to{" "}
            {MAX_DEPTH} levels).
          </Typography>
          <button
            type="button"
            onClick={downloadSample}
            className="flex items-center gap-1 text-BR500 text-xs font-medium whitespace-nowrap hover:underline"
          >
            <Download size={14} /> Sample file
          </button>
        </div>

        {/* Dropzone / picker */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-N40 rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:border-BR300 hover:bg-N10 transition-colors"
        >
          <UploadCloud size={28} className="text-N400" />
          <Typography variant="p-s" color="N600" fontWeight="medium">
            Click to choose a .json file
          </Typography>
          <Typography variant="c-s" color="N400">
            Array of categories, or {`{ "categories": [...] }`}
          </Typography>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {/* Selected file */}
        {fileName && (
          <div className="flex items-center justify-between border border-N30 rounded-md px-4 py-3 bg-N0">
            <div className="flex items-center gap-2 min-w-0">
              <FileJson size={18} className="text-BR500 shrink-0" />
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

        {/* Validation errors */}
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

        {/* Valid preview */}
        {parsed && stats && errors.length === 0 && !result && (
          <div className="border border-G100 bg-G50 rounded-md p-4 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-G500" />
            <Typography variant="p-s" color="G500">
              Ready to import <b>{stats.total}</b> categor
              {stats.total === 1 ? "y" : "ies"} across{" "}
              <b>{stats.maxDepth}</b> level{stats.maxDepth === 1 ? "" : "s"}.
            </Typography>
          </div>
        )}

        {/* Result summary */}
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
            disabled={!parsed || errors.length > 0}
          >
            Import categories
          </Button>
        )}
      </div>
    </div>
  );
};

export default BulkImportCategories;
