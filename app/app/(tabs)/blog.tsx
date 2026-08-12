import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { BlogCard } from '@/components/blog-card';
import { SearchFilterBar, SortOption } from '@/components/search-filter-bar';
import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { BlogCardData, fetchWebflowBlogs } from '@/lib/webflow-blogs';

const SORT_OPTIONS: SortOption[] = [
  { value: 'date-desc', label: 'Nieuwste' },
  { value: 'date-asc', label: 'Oudste' },
  { value: 'name-asc', label: 'Naam A-Z' },
  { value: 'name-desc', label: 'Naam Z-A' },
];

export default function BlogScreen() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sort, setSort] = useState('date-desc');

  useEffect(() => {
    fetchWebflowBlogs()
      .then((items) => {
        setBlogs(items);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    blogs.forEach((b) => {
      if (b.categoryId && b.categoryName) map.set(b.categoryId, b.categoryName);
    });
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, [blogs]);

  const visibleBlogs = useMemo(() => {
    let result = blogs;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (b) => b.name.toLowerCase().includes(q) || b.summary?.toLowerCase().includes(q)
      );
    }

    if (categoryId) {
      result = result.filter((b) => b.categoryId === categoryId);
    }

    const sorted = [...result];
    switch (sort) {
      case 'date-asc':
        sorted.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
        break;
      case 'date-desc':
        sorted.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    return sorted;
  }, [blogs, search, categoryId, sort]);

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
      <Text style={styles.title}>Verhalen &amp; nieuws</Text>
      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Zoek een blogpost..."
        categories={categories}
        selectedCategoryId={categoryId}
        onSelectCategory={setCategoryId}
        sortOptions={SORT_OPTIONS}
        selectedSort={sort}
        onSelectSort={setSort}
      />
      <FlatList
        data={visibleBlogs}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
        renderItem={({ item }) => (
          <BlogCard blog={item} onPress={() => router.push(`/blog/${item.slug}`)} />
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={<Text style={styles.body}>Geen blogposts gevonden.</Text>}
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
