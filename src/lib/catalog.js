import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import sampleItems from "../../courseData.json";

const TIMEOUT_MS = 5000;

/** Collapse stray whitespace and capitalise the first letter of a title. */
export function cleanTitle(title = "") {
  const t = title.replace(/\s+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function normalise(item, id) {
  return {
    id,
    title: cleanTitle(item.title),
    description: (item.description ?? "").trim(),
    imageUrl: item.imageUrl,
    price: Number(item.price),
  };
}

/**
 * Loads the catalog from Convex. If Convex is not configured or cannot be
 * reached, falls back to the bundled courseData.json so the pages still
 * render. `source` tells the UI which one it got ("convex" or "sample").
 */
export async function getCatalog() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (url) {
    try {
      const convex = new ConvexHttpClient(url);
      const rows = await Promise.race([
        convex.query(api.courses.getCourses),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Convex timeout")), TIMEOUT_MS)
        ),
      ]);
      return { source: "convex", items: rows.map((r) => normalise(r, r._id)) };
    } catch (err) {
      console.error("Could not load catalog from Convex:", err.message);
    }
  }
  return {
    source: "sample",
    items: sampleItems.map((r) => normalise(r, r.id)),
  };
}

export function sortItems(items, sort) {
  const list = [...items];
  if (sort === "price-asc") return list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return list.sort((a, b) => b.price - a.price);
  return list;
}
