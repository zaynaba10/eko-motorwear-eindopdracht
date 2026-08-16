import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { ProductCard, ProductCardData } from '@/components/product-card';
import { SearchFilterBar, SortOption } from '@/components/search-filter-bar';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import {
  fetchProductCategories,
  fetchWebflowProducts,
  ProductCategory,
} from '@/lib/webflow-products';

const SORT_OPTIONS: SortOption[] = [
  { value: 'name-asc', label: 'Naam A-Z' },
  { value: 'name-desc', label: 'Naam Z-A' },
  { value: 'price-asc', label: 'Prijs laag-hoog' },
  { value: 'price-desc', label: 'Prijs hoog-laag' },
];

const PRICE_BUCKETS = [
  { id: 'under-50', label: '< €50', test: (p?: number) => typeof p === 'number' && p < 50 },
  { id: '50-100', label: '€50–100', test: (p?: number) => typeof p === 'number' && p >= 50 && p <= 100 },
  { id: 'over-100', label: '> €100', test: (p?: number) => typeof p === 'number' && p > 100 },
];

export default function ShopScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [priceBucket, setPriceBucket] = useState<string | null>(null);
  const [sort, setSort] = useState('name-asc');

  useEffect(() => {
    // Producten en categorieën tegelijk ophalen — de categoriechips zijn
    // dezelfde als op de website (Nieuw, Laarzen, Handschoenen, ...).
    Promise.all([fetchWebflowProducts(), fetchProductCategories()])
      .then(([items, cats]) => {
        setProducts(items.map((item) => item.card));
        setCategories(cats);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const visibleProducts = useMemo(() => {
    let result = products;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Categoriefilter: elk product draagt zijn categorie-ID's mee in
    // fieldData.category; we tonen alleen producten die de gekozen ID bevatten.
    if (categoryId) {
      result = result.filter((p) => (p.categoryIds || []).includes(categoryId));
    }

    if (priceBucket) {
      const bucket = PRICE_BUCKETS.find((b) => b.id === priceBucket);
      if (bucket) result = result.filter((p) => bucket.test(p.priceEuro));
    }

    const sorted = [...result];
    switch (sort) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => (a.priceEuro ?? 0) - (b.priceEuro ?? 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.priceEuro ?? 0) - (a.priceEuro ?? 0));
        break;
    }
    return sorted;
  }, [products, search, categoryId, priceBucket, sort]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={EkoColors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Fout: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onze collectie</Text>
      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Zoek een product..."
        categories={categories.map((c) => ({ id: c.id, label: c.name }))}
        selectedCategoryId={categoryId}
        onSelectCategory={setCategoryId}
        extraFilters={PRICE_BUCKETS.map(({ id, label }) => ({ id, label }))}
        selectedExtraId={priceBucket}
        onSelectExtra={setPriceBucket}
        sortOptions={SORT_OPTIONS}
        selectedSort={sort}
        onSelectSort={setSort}
      />
      <FlatList
        data={visibleProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} />
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={<Text style={styles.body}>Geen producten gevonden.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: EkoColors.white,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: EkoColors.white,
  },
  title: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 26,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
    marginBottom: 20,
  },
  body: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.paragraphGray,
  },
  errorText: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primary,
  },
});
