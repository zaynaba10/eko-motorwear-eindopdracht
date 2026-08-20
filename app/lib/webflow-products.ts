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

/** Eén SKU-eigenschap uit Webflow, bv. "Maat" met de waarden S, M, L, XL. */
type WebflowSkuProperty = {
  id: string;
  name: string;
  enum: { id: string; name: string; slug: string }[];
};

type WebflowProductItem = {
  product: {
    id: string;
    fieldData: {
      name: string;
      slug: string;
      description?: string;
      specificaties?: string;
      'more-info'?: string;
      'feature-on-home'?: boolean;
      'sku-properties'?: WebflowSkuProperty[];
      galerij?: string | null;
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

    /* Alle productfoto's: het veld Galerij van de website, aangevuld met de
       hoofdfoto en de extra foto's van de sku. */
    const imageUrls: string[] = [];
    if (image?.url) imageUrls.push(image.url);
    (velden.galerij || '')
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean)
      .forEach((url) => {
        if (!imageUrls.includes(url)) imageUrls.push(url);
      });
    (firstSku?.fieldData['more-images'] || []).forEach((foto) => {
      if (foto?.url && !imageUrls.includes(foto.url)) imageUrls.push(foto.url);
    });

    /* Maten komen uit de SKU-eigenschap "Maat" van het product zelf. */
    const maatEigenschap = (velden['sku-properties'] || []).find((eig) =>
      /maat|size/i.test(eig.name)
    );
    const maten = maatEigenschap?.enum.map((waarde) => waarde.name);

    return {
      raw: item,
      card: {
        id: item.product.id,
        name: velden.name,
        slug: velden.slug,
        imageUrl: image?.url,
        imageUrls,
        description: velden.description,
        specificaties: velden.specificaties,
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
        maten: maten && maten.length > 0 ? maten : undefined,
        meerInfo: velden['more-info'],
        uitgelicht: velden['feature-on-home'] === true,
      },
    };
  });
  return cache;
}
