import { ProductCardData } from '@/components/product-card';

const SITE_ID = '6a7260e877f40c20eaaa7def';
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

  return items.map((item) => {
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
      },
    };
  });
}
