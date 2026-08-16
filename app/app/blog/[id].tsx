import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EkoColors, EkoFonts } from '@/constants/eko-theme';
import { BlogDetails, fetchWebflowBlog } from '@/lib/webflow-blogs';
import { parseRichText } from '@/lib/rich-text';

/**
 * BlogDetailsScreen — dynamische route (app/blog/[id].tsx), bereikt vanuit
 * het Blog-overzicht via router.push(`/blog/${id}`). De ID komt binnen via
 * de route-params en de blog wordt hier opgehaald via het "endpoint per blog
 * (via ID)" uit de opdracht — één API-call voor precies dit item.
 */
export default function BlogDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [blog, setBlog] = useState<BlogDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchWebflowBlog(id)
      .then((item) => {
        setBlog(item);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
  return (
    <>
      <Stack.Screen options={{ title: 'Blog', headerBackTitle: 'Blog' }} />
      <View style={styles.center}>
        <ActivityIndicator size="large" color={EkoColors.primary} />
      </View>
    </>
  );
}

  if (error || !blog) {
  return (
    <>
      <Stack.Screen options={{ title: 'Blog', headerBackTitle: 'Blog' }} />
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ? `Fout: ${error}` : 'Blogpost niet gevonden.'}</Text>
      </View>
    </>
  );
}

  const blocks = parseRichText(blog.bodyHtml);
  const date = blog.date
    ? new Date(blog.date).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })
    : undefined;

  return (
    <>
      <Stack.Screen options={{ title: blog.name, headerBackTitle: 'Blog' }} />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
        {blog.imageUrl && (
          <Image
            source={{ uri: blog.imageUrl }}
            style={styles.heroImage}
            contentFit="cover"
            accessibilityLabel={blog.altText}
          />
        )}
        <View style={styles.content}>
          {blog.categoryName && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{blog.categoryName}</Text>
            </View>
          )}
          <Text style={styles.title}>{blog.name}</Text>

          <View style={styles.metaRow}>
            {blog.authorImageUrl && (
              <Image source={{ uri: blog.authorImageUrl }} style={styles.authorImage} />
            )}
            <View>
              {blog.authorName && <Text style={styles.authorName}>{blog.authorName}</Text>}
              {date && <Text style={styles.date}>{date}</Text>}
            </View>
          </View>

          {blocks.map((block, i) => {
            if (block.type === 'h2') return <Text key={i} style={styles.h2}>{block.text}</Text>;
            if (block.type === 'h3') return <Text key={i} style={styles.h3}>{block.text}</Text>;
            if (block.type === 'li') return <Text key={i} style={styles.li}>{'•  '}{block.text}</Text>;
            if (block.type === 'quote') return <Text key={i} style={styles.quote}>{block.text}</Text>;
            return <Text key={i} style={styles.p}>{block.text}</Text>;
          })}

          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => router.push('/(tabs)/blog')}>
              <Text style={styles.navLink}>← Terug naar overzicht</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EkoColors.white,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: EkoColors.white,
  },
  errorText: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    color: EkoColors.primary,
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: EkoColors.lightGray,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  badgeText: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: EkoColors.primary,
  },
  title: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 26,
    letterSpacing: 0.5,
    color: EkoColors.primaryDark,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  authorImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  authorName: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 13,
    color: EkoColors.primaryDark,
  },
  date: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 12,
    color: EkoColors.darkGray,
  },
  h2: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 20,
    color: EkoColors.primaryDark,
    marginTop: 18,
    marginBottom: 8,
  },
  h3: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 17,
    color: EkoColors.primaryDark,
    marginTop: 14,
    marginBottom: 6,
  },
  p: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 23,
    color: EkoColors.paragraphGray,
    marginBottom: 12,
  },
  li: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 15,
    lineHeight: 23,
    color: EkoColors.paragraphGray,
    marginBottom: 6,
    marginLeft: 4,
  },
  quote: {
    fontFamily: EkoFonts.bodyMedium,
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 23,
    color: EkoColors.primaryDark,
    borderLeftWidth: 3,
    borderLeftColor: EkoColors.primary,
    paddingLeft: 12,
    marginBottom: 14,
  },
  navRow: {
    marginTop: 10,
  },
  navLink: {
    fontFamily: EkoFonts.bodyBold,
    fontSize: 13,
    color: EkoColors.primary,
  },
});
