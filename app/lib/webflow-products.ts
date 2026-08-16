import { ProductCardData } from '@/components/product-card';

const SITE_ID = '6a7260e877f40c20eaaa7def';
const CATEGORIES_COLLECTION_ID = '6a7260ea77f40c20eaaa7ef7';
const API_TOKEN = process.env.EXPO_PUBLIC_WEBFLOW_API_TOKEN;

type WebflowImage = { url: string; alt?: string | null };

type WebflowSku = {
  id: string;
  fieldData: {
    name?: string;
    price?: { value: number; unit: string };
    'main-image'?: WebflowImage;
  };
};

type WebflowProductItem = {
  product: {
    id: string;
    fieldData: {
      name: string;
      slug: string;
      description?: string;
      category?: string[];
      'sku-properties'?: { name: string; enum: { id: string; name: string }[] }[];
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

export type ProductCategory = { id: string; name: string };

export type ProductDetails = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  priceEuro?: number;
  categoryIds: string[];
  /** Maten uit de SKU-eigenschappen, bv. ["S", "M", "L", "XL"]. */
  maten: string[];
};

function mapItem(item: WebflowProductItem): FetchedProduct {
  const firstSku = item.skus?.[0];
  const image =
    item.product.fieldData['main-image'] ||
    item.product.fieldData['product-image'] ||
    item.product.fieldData.image ||
    firstSku?.fieldData['main-image'];

  const priceValue = firstSku?.fieldData.price?.value;

  return {
    raw: item,
    card: {
      id: item.product.id,
      name: item.product.fieldData.name,
      imageUrl: image?.url,
      priceEuro: typeof priceValue === 'number' ? priceValue / 100 : undefined,
      categoryIds: item.product.fieldData.category || [],
    },
  };
}

/** Haalt alle producten op uit de Webflow-shop en zet ze om naar ProductCardData. */
export async function fetchWebflowProducts(): Promise<FetchedProduct[]> {
  const res = await fetch(`https://api.webflow.com/v2/sites/${SITE_ID}/products`, {
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

  return items.map(mapItem);
}

/**
 * Haalt één product op via zijn ID — het "endpoint per product (via ID)"
 * uit de opdracht. Wordt gebruikt door het ProductDetailsScreen.
 */
export async function fetchWebflowProduct(productId: string): Promise<ProductDetails> {
  const res = await fetch(
    `https://api.webflow.com/v2/sites/${SITE_ID}/products/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        accept: 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Webflow API fout (${res.status})`);
  }

  const item: WebflowProductItem = await res.json();
  const mapped = mapItem(item);
  const skuProps = item.product.fieldData['sku-properties'] || [];
  const maten = skuProps[0]?.enum?.map((optie) => optie.name) || [];

  return {
    id: mapped.card.id,
    name: mapped.card.name,
    description: item.product.fieldData.description,
    imageUrl: mapped.card.imageUrl,
    priceEuro: mapped.card.priceEuro,
    categoryIds: mapped.card.categoryIds || [],
    maten,
  };
}

/**
 * Haalt de productcategorieën op (Nieuw, Laarzen, Handschoenen,
 * Beschermingssets, Helmen, Sale) — zelfde categorieën als de chiprij
 * op de website, zodat app en site hetzelfde filteren.
 */
export async function fetchProductCategories(): Promise<ProductCategory[]> {
  const res = await fetch(
    `https://api.webflow.com/v2/collections/${CATEGORIES_COLLECTION_ID}/items`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        accept: 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Webflow API fout (${res.status})`);
  }

  const data = await res.json();
  return (data.items || []).map((item: { id: string; fieldData: { name: string } }) => ({
    id: item.id,
    name: item.fieldData.name,
  }));
}
