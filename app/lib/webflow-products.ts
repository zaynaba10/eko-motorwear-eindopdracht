import { ProductCardData } from '@/components/product-card';

const SITE_ID = '6a7260e877f40c20eaaa7def';
const API_TOKEN = process.env.EXPO_PUBLIC_WEBFLOW_API_TOKEN;

type WebflowImage = { url: string; alt?: string | null };

type WebflowSku = {
  id: string;
  fieldData: {
    name?: string;
    price?: { value: number; unit: string };
    'compare-at-price'?: { value: number; unit: string };
    'main-image'?: WebflowImage;
    'more-images'?: WebflowImage[];
  };
};

type WebflowProductItem = {
  product: {
    id: string;
    fieldData: {
      name: string;
      slug: string;
      description?: string;
      specificaties?: string;
      category?: string[];
      merk?: string;
      geslacht?: string;
      kleur?: string;
      materiaal?: string;
      eigenschappen?: string;
      seizoen?: string;
      'main-image'?: WebflowImage;
      'product-image'?: WebflowImage;
      image?: WebflowImage;
    };
  };
  skus: WebflowSku[];
};

export type FetchedProduct = {
  raw: WebflowProductItem;
  card: ProductCardData;
};

let cache: FetchedProduct[] | null = null;

/** Haalt alle producten op uit de Webflow-shop en zet ze om naar ProductCardData. */
export async function fetchWebflowProducts(): Promise<FetchedProduct[]> {
  if (cache) return cache;

  const res = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/products?limit=100`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Webflow API fout (${res.status})`);
  }

  const data = await res.json();
  const items: WebflowProductItem[] = data.items || [];

  cache = items.map((item) => {
    const firstSku = item.skus?.[0];
    const image =
      item.product.fieldData['main-image'] ||
      item.product.fieldData['product-image'] ||
      item.product.fieldData.image ||
      firstSku?.fieldData['main-image'];

    const priceValue = firstSku?.fieldData.price?.value;
    const compareValue = firstSku?.fieldData['compare-at-price']?.value;
    const velden = item.product.fieldData;

    return {
      raw: item,
      card: {
        id: item.product.id,
        name: velden.name,
        imageUrl: image?.url,
        priceEuro: typeof priceValue === 'number' ? priceValue / 100 : undefined,
        vergelijkPrijsEuro: typeof compareValue === 'number' ? compareValue / 100 : undefined,
        merk: velden.merk,
        geslacht: velden.geslacht,
        kleur: velden.kleur,
        materiaal: velden.materiaal,
        eigenschappen: (velden.eigenschappen || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        seizoen: velden.seizoen,
        categorieIds: velden.category || [],
      },
    };
  });
  return cache;
}
