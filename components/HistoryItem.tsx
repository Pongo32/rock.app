import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { CalculationResult } from '@/types/calculator';
import { formatCurrency } from '@/utils/formatters';

interface HistoryItemProps {
  item: CalculationResult;
  onPress?: (item: CalculationResult) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onPress }) => {
  const { colors } = useThemeStore();
  const date = new Date(item.date);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const getBestOptionLabel = () => {
    switch (item.results.bestOption) {
      case 'cashback':
        return 'Кэшбэк';
      case 'gracePeriod':
        return 'Льготный период';
      case 'discount':
        return 'Скидка';
      case 'combined':
        return 'Комбинированный';
      default:
        return 'Неизвестно';
    }
  };
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
      onPress={() => onPress && onPress(item)}
    >
      <View style={styles.header}>
        <Text style={[styles.date, { color: colors.textSecondary }]}>{formattedDate} • {formattedTime}</Text>
        <Text style={[styles.amount, { color: colors.text }]}>{formatCurrency(item.params.amount)}</Text>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Общая выгода:</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {formatCurrency(item.results.totalBenefit)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Лучший вариант:</Text>
          <Text style={[
            styles.detailValue,
            styles.bestOption,
            { color: colors.primary }
          ]}>
            {getBestOptionLabel()}
          </Text>
        </View>
      </View>
      
      <View style={styles.benefitsContainer}>
        {item.results.cashbackBenefit > 0 && (
          <View style={[styles.benefitItem, { backgroundColor: `${colors.primary}20` }]}>
            <Text style={[styles.benefitLabel, { color: colors.textSecondary }]}>Кэшбэк</Text>
            <Text style={[styles.benefitValue, { color: colors.primary }]}>
              {formatCurrency(item.results.cashbackBenefit)}
            </Text>
          </View>
        )}
        
        {item.results.gracePeriodBenefit > 0 && (
          <View style={[styles.benefitItem, { backgroundColor: `${colors.primary}20` }]}>
            <Text style={[styles.benefitLabel, { color: colors.textSecondary }]}>Льготный период</Text>
            <Text style={[styles.benefitValue, { color: colors.primary }]}>
              {formatCurrency(item.results.gracePeriodBenefit)}
            </Text>
          </View>
        )}
        
        {item.results.discountBenefit > 0 && (
          <View style={[styles.benefitItem, { backgroundColor: `${colors.primary}20` }]}>
            <Text style={[styles.benefitLabel, { color: colors.textSecondary }]}>Скидка</Text>
            <Text style={[styles.benefitValue, { color: colors.primary }]}>
              {formatCurrency(item.results.discountBenefit)}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  date: {
    fontSize: theme.typography.fontSizes.sm,
  },
  amount: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  details: {
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  detailLabel: {
    fontSize: theme.typography.fontSizes.sm,
  },
  detailValue: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  bestOption: {
    fontWeight: theme.typography.fontWeights.semibold,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  benefitItem: {
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  benefitLabel: {
    fontSize: theme.typography.fontSizes.xs,
  },
  benefitValue: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
});