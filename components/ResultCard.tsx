import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { theme } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { formatCurrency } from '@/utils/formatters';

interface ResultCardProps {
  title: string;
  amount: number;
  description?: string;
  isHighlighted?: boolean;
  currency?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  amount,
  description,
  isHighlighted = false,
  currency = '₽',
}) => {
  const { colors } = useThemeStore();

  return (
    <Card
      style={[
        styles.container,
        isHighlighted && {
          borderColor: colors.primary,
          borderWidth: 2,
          backgroundColor: `${colors.primary}20`,
        },
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
            isHighlighted && {
              color: colors.primary,
              fontWeight: theme.typography.fontWeights.bold,
            },
          ]}
        >
          {title}
        </Text>
        
        <Text
          style={[
            styles.amount,
            { color: colors.text },
            isHighlighted && {
              color: colors.primary,
              fontSize: theme.typography.fontSizes.xxxl,
            },
          ]}
        >
          {formatCurrency(amount, currency)}
        </Text>
        
        {description && (
          <Text
            style={[
              styles.description,
              { color: colors.textSecondary },
              isHighlighted && { color: colors.primary },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  content: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  amount: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    textAlign: 'center',
  },
});