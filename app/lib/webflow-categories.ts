/**
 * Haalt de categorieën-collectie op uit Webflow, zodat producten via hun
 * categorie-id's aan de winkelboom gekoppeld kunnen worden (zelfde CMS-data
 * als de website).
 */

const COLLECTION_ID = '6a7260ea77f40c20eaaa7ef7';
const API_TOKEN = process.env.EXPO_PUBLIC_WEBFLOW_API_TOKEN;

type WebflowCategorieItem = {
  id: string;
  fieldData: { name?: string; slug?: string };
};

let cache: Record<string, string> | null = null;

/** Geeft een map van categorieslug naar Webflow-item-id (met cache). */
export async function fetchCategorieIds(): Promise<Record<string, string>> {
  if (cache) return cache;

  const res = await fetch(
    `https://api.webflow.com/v2/collections/${COLLECTION_ID}/items?limit=100`,
    { headers: { Authorization: `Bearer ${API_TOKEN}`, accept: 'application/json' } }
  );
  if (!res.ok) {
    throw new Error(`Webflow API fout (${res.status})`);
  }

  const data = await res.json();
  const items: WebflowCategorieItem[] = data.items || [];
  const map: Record<string, string> = {};
  items.forEach((item) => {
    if (item.fieldData?.slug) map[item.fieldData.slug] = item.id;
  });
  cache = map;
  return map;
}
