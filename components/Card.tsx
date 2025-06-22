import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  style,
  contentStyle,
  footer,
}) => {
  const { colors } = useThemeStore();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.card,
        borderColor: colors.border,
      },
      style
    ]}>
      {(title || subtitle) && (
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
          {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      )}
      
      <View style={[styles.content, contentStyle]}>{children}</View>
      
      {footer && <View style={[styles.footer, { borderTopColor: colors.border }]}>{footer}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: theme.spacing.md,
  },
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.sm,
  },
  content: {
    padding: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
  },
});