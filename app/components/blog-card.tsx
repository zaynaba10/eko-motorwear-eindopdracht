import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';
import { BlogCardData } from '@/lib/webflow-blogs';

type BlogCardProps = {
  blog: BlogCardData;
  onPress?: () => void;
};

function formatDate(iso?: string) {
  if (!iso) return undefined;
  return new Date(iso).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function BlogCard({ blog, onPress }: BlogCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageWrapper}>
        {blog.imageUrl ? (
          <Image source={{ uri: blog.imageUrl }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={32} color={EkoColors.darkGray} />
          </View>
        )}
        {blog.categoryName && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{blog.categoryName}</Text>
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {blog.name}
      </Text>
      {blog.summary && (
        <Text style={styles.summary} numberOfLines={2}>
          {blog.summary}
        </Text>
      )}
      <View style={styles.metaRow}>
        {blog.authorName && <Text style={styles.meta}>{blog.authorName}</Text>}
        {blog.date && <Text style={styles.meta}>{formatDate(blog.date)}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  imageWrapper: {
    borderRadius: EkoRadius.card,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 180,
  },
  imagePlaceholder: {
    backgroundColor: EkoColors.lightSteelBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: EkoColors.whiteTranslucent,
    borderRadius: EkoRadius.tag,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeText: {
    fontFamily: EkoFonts.headingMedium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: EkoColors.primary,
  },
  name: {
    fontFamily: EkoFonts.headingBold,
    fontSize: 17,
    color: EkoColors.primaryDark,
    marginBottom: 4,
  },
  summary: {
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 13,
    color: EkoColors.paragraphGray,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  meta: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 11,
    color: EkoColors.darkGray,
  },
});
