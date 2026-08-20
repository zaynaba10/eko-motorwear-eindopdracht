import { ProductCardData } from '@/components/product-card';

/**
 * Maten per hoofdcategorie. Dit is de terugvaloptie: producten die in Webflow
 * een SKU-eigenschap "Maat" hebben, gebruiken die echte maten.
 */
export const MATEN: Record<string, string[]> = {
  motorkledij: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  handschoenen: ['S', 'M', 'L', 'XL'],
  helmet: ['XS', 'S', 'M', 'L', 'XL'],
  laarzen: ['40', '41', '42', '43', '44', '45', '46'],
  'protection-set': ['S', 'M', 'L', 'XL'],
};

/** Maten van een hoofdcategorie; undefined wanneer maat niet van toepassing is. */
export function matenVoorSlug(slug?: string): string[] | undefined {
  return slug ? MATEN[slug] : undefined;
}

/**
 * Maten van één product: eerst de SKU-eigenschap uit Webflow (zoals de
 * maatkeuze op de website), anders de maten van de hoofdcategorie.
 */
export function matenVoorProduct(
  product: ProductCardData,
  categorieSlug?: string
): string[] | undefined {
  if (product.maten && product.maten.length > 0) return product.maten;
  return matenVoorSlug(categorieSlug);
}
