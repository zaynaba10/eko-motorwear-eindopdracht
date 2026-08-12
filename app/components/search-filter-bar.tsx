import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { EkoColors, EkoFonts, EkoRadius } from '@/constants/eko-theme';

export type FilterOption = { id: string; label: string };
export type SortOption = { value: string; label: string };

type SearchFilterBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  categories?: FilterOption[];
  selectedCategoryId?: string | null;
  onSelectCategory?: (id: string | null) => void;
  sortOptions: SortOption[];
  selectedSort: string;
  onSelectSort: (value: string) => void;
};

/**
 * Herbruikbare search + filter (categorie) + sort balk.
 * Wordt gebruikt op zowel het Shop-scherm (producten) als het Blog-scherm,
 * zoals vereist door de opdracht.
 */
export function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Zoeken...',
  categories,
  selectedCategoryId,
  onSelectCategory,
  sortOptions,
  selectedSort,
  onSelectSort,
}: SearchFilterBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={EkoColors.darkGray} style={styles.searchIcon} />
        <TextInput
          value={searchValue}
          onChangeText={onSearchChange}
          placeholder={searchPlaceholder}
          placeholderTextColor={EkoColors.darkGray}
          style={styles.searchInput}
        />
        {searchValue.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={18} color={EkoColors.darkGray} />
          </TouchableOpacity>
        )}
      </View>

      {categories && categories.length > 0 && onSelectCategory && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}>
          <Chip
            label="Alles"
            active={!selectedCategoryId}
            onPress={() => onSelectCategory(null)}
          />
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.label}
              active={selectedCategoryId === cat.id}
              onPress={() => onSelectCategory(cat.id)}
            />
          ))}
        </ScrollView>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        <Text style={styles.sortLabel}>Sorteren:</Text>
        {sortOptions.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            active={selectedSort === opt.value}
            onPress={() => onSelectSort(opt.value)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EkoColors.lightGray,
    borderRadius: EkoRadius.pill,
    paddingHorizontal: 16,
    height: 44,
    gap: 8,
  },
  searchIcon: {
    marginTop: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: EkoFonts.bodyRegular,
    fontSize: 14,
    color: EkoColors.primaryDark,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 8,
  },
  sortLabel: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 12,
    color: EkoColors.darkGray,
    marginRight: 2,
  },
  chip: {
    borderRadius: EkoRadius.tag,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: EkoColors.lightGray,
  },
  chipActive: {
    backgroundColor: EkoColors.primary,
  },
  chipText: {
    fontFamily: EkoFonts.bodyMedium,
    fontSize: 12,
    color: EkoColors.paragraphGray,
  },
  chipTextActive: {
    color: EkoColors.white,
  },
});
