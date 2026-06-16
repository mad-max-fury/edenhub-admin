import type { IBulkProductInput, IVariant } from "@/redux/api/products";

// ─── CSV parsing ──────────────────────────────────────────────────────────────

// RFC-4180-ish tokenizer: handles quoted fields, escaped quotes (""), commas
// and newlines inside quotes.
export const parseCsv = (text: string): Record<string, string>[] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    pushField();
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      pushField();
    } else if (c === "\n") {
      pushRow();
    } else if (c === "\r") {
      // ignore; handled by \n
    } else {
      field += c;
    }
  }
  // trailing field/row
  if (field.length > 0 || row.length > 0) pushRow();

  // Drop fully empty rows.
  const nonEmpty = rows.filter((r) => r.some((cell) => cell.trim() !== ""));
  if (nonEmpty.length === 0) return [];

  const headers = nonEmpty[0].map((h) => h.trim());
  return nonEmpty.slice(1).map((cells) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = (cells[idx] ?? "").trim();
    });
    return obj;
  });
};

// ─── Normalisation helpers ────────────────────────────────────────────────────

const norm = (key: string) => key.toLowerCase().replace(/[\s_]/g, "");

// Build a normalized-key lookup for a row, while keeping original keys for attr:.
const lookup = (row: Record<string, string>) => {
  const map: Record<string, string> = {};
  Object.entries(row).forEach(([k, v]) => {
    map[norm(k)] = v;
  });
  return map;
};

const toNum = (v?: string): number | undefined => {
  if (v === undefined || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};

const toBool = (v?: string): boolean =>
  ["true", "yes", "1", "y"].includes((v ?? "").trim().toLowerCase());

const toList = (v?: string): string[] =>
  (v ?? "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

// Extract attr:* columns from the raw row into an attributes object.
const extractAttributes = (row: Record<string, string>) => {
  const attrs: Record<string, string> = {};
  Object.entries(row).forEach(([k, v]) => {
    const m = k.match(/^attr[:.]\s*(.+)$/i);
    if (m && v.trim() !== "") attrs[m[1].trim()] = v.trim();
  });
  return attrs;
};

const buildDiscount = (price?: number, pct?: number, promo?: string) =>
  price && price > 0
    ? { price, percentage: pct || 0, promotionName: promo || undefined }
    : undefined;

// ─── CSV → products (variant rows grouped by `handle`) ─────────────────────────

export interface ParseResult {
  products: IBulkProductInput[];
  errors: string[];
  variantCount: number;
}

export const csvToProducts = (rows: Record<string, string>[]): ParseResult => {
  const errors: string[] = [];
  const order: string[] = [];
  const groups = new Map<string, Record<string, string>[]>();

  rows.forEach((row, i) => {
    const m = lookup(row);
    const key = (m["handle"] || m["name"] || `row-${i}`).trim();
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(row);
  });

  const products: IBulkProductInput[] = [];
  let variantCount = 0;

  order.forEach((key) => {
    const groupRows = groups.get(key)!;
    const base = lookup(groupRows[0]);

    const name = base["name"];
    if (!name) {
      errors.push(`Group "${key}" has no product name`);
      return;
    }

    const variants: IVariant[] = [];
    groupRows.forEach((r) => {
      const v = lookup(r);
      if (v["variantname"]) {
        variantCount++;
        variants.push({
          name: v["variantname"],
          sku: v["variantsku"] || undefined,
          basePrice: toNum(v["variantprice"]) ?? 0,
          quantity: toNum(v["variantquantity"]) ?? 0,
          tags: toList(v["varianttags"]),
          images: toList(v["variantimages"]),
        });
      }
    });

    products.push({
      name,
      description: base["description"] || name,
      brand: base["brand"] || undefined,
      category: base["category"] || "",
      basePrice: toNum(base["baseprice"]) ?? 0,
      discount: buildDiscount(
        toNum(base["discountprice"]),
        toNum(base["discountpercentage"]),
        base["promotionname"],
      ),
      quantity: toNum(base["quantity"]) ?? 0,
      attributes: extractAttributes(groupRows[0]),
      tags: toList(base["tags"]),
      coverImage: base["coverimage"] || undefined,
      images: toList(base["images"]),
      weight: base["weight"] || undefined,
      isReturnable: toBool(base["isreturnable"]),
      returnableDays: toNum(base["returnabledays"]),
      hasWarranty: toBool(base["haswarranty"]),
      warrantyYears: toNum(base["warrantyyears"]),
      variants,
      status:
        (base["status"]?.toLowerCase() as IBulkProductInput["status"]) ||
        "active",
    });
  });

  return { products, errors, variantCount };
};

// ─── JSON → products ──────────────────────────────────────────────────────────

export const jsonToProducts = (text: string): ParseResult => {
  const json = JSON.parse(text);
  const arr = Array.isArray(json) ? json : json?.products;
  if (!Array.isArray(arr)) {
    return {
      products: [],
      errors: ['JSON must be an array, or an object with a "products" array'],
      variantCount: 0,
    };
  }
  const variantCount = arr.reduce(
    (s: number, p: any) => s + (p?.variants?.length ?? 0),
    0,
  );
  return { products: arr as IBulkProductInput[], errors: [], variantCount };
};

// ─── Shared validation ────────────────────────────────────────────────────────

export const validateProducts = (products: IBulkProductInput[]): string[] => {
  const errors: string[] = [];
  products.forEach((p, i) => {
    const label = p?.name ? `"${p.name}"` : `Product ${i + 1}`;
    if (!p?.name) errors.push(`${label} is missing a name`);
    if (!p?.category) errors.push(`${label} is missing a category (id or slug)`);
    if (p?.basePrice === undefined || Number.isNaN(Number(p.basePrice)))
      errors.push(`${label} has an invalid base price`);
  });
  return errors.slice(0, 12);
};

// ─── Templates ────────────────────────────────────────────────────────────────

export const CSV_TEMPLATE = [
  "handle,name,description,brand,category,basePrice,quantity,tags,coverImage,images,isReturnable,returnableDays,hasWarranty,warrantyYears,weight,status,variantName,variantPrice,variantQuantity,variantSku,variantTags,variantImages",
  'eden-chrono,Eden Chrono Elite,Premium automatic chronograph,Eden,analog-watches,250000,10,best-seller|featured,https://example.com/chrono.jpg,https://example.com/chrono-2.jpg,true,14,true,2,180g,active,Black / 42mm,250000,6,,new-arrival,',
  'eden-chrono,,,,,,,,,,,,,,,,Silver / 42mm,265000,4,,,',
  'aero-shades,Aero Polarized,UV400 polarized sunglasses,Aero,polarized-sunglasses,85000,20,on-sale,https://example.com/aero.jpg,,false,,false,,30g,active,,,,,,',
].join("\n");

export const JSON_TEMPLATE = JSON.stringify(
  [
    {
      name: "Eden Chrono Elite",
      description: "Premium automatic chronograph",
      brand: "Eden",
      category: "analog-watches",
      basePrice: 250000,
      quantity: 10,
      tags: ["best-seller", "featured"],
      coverImage: "https://example.com/chrono.jpg",
      images: ["https://example.com/chrono-2.jpg"],
      isReturnable: true,
      returnableDays: 14,
      hasWarranty: true,
      warrantyYears: 2,
      status: "active",
      variants: [
        { name: "Black / 42mm", basePrice: 250000, quantity: 6, tags: ["new-arrival"] },
        { name: "Silver / 42mm", basePrice: 265000, quantity: 4 },
      ],
    },
    {
      name: "Aero Polarized",
      description: "UV400 polarized sunglasses",
      brand: "Aero",
      category: "polarized-sunglasses",
      basePrice: 85000,
      quantity: 20,
      tags: ["on-sale"],
    },
  ],
  null,
  2,
);
