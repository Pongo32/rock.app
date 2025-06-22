import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';

interface RadioOption<T> {
  label: string;
  value: T;
  description?: string;
}

interface RadioGroupProps<T> {
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  error?: string;
}

export function RadioGroup<T>({
  options,
  value,
  onChange,
  label,
  error,
}: RadioGroupProps<T>) {
  const { colors } = useThemeStore();

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      
      <View style={[styles.optionsContainer, { borderColor: colors.border }]}>
        {options.map((option, index) => {
          const isSelected = option.value === value;
          
          return (
            <Pressable
              key={index}
              style={[
                styles.option,
                { backgroundColor: colors.card },
                isSelected && { backgroundColor: `${colors.primary}10` },
                index < options.length - 1 && [styles.optionWithBorder, { borderBottomColor: colors.border }],
              ]}
              onPress={() => onChange(option.value)}
            >
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioOuter,
                    { borderColor: colors.border },
                    isSelected && { borderColor: colors.primary },
                  ]}
                >
                  {isSelected && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                </View>
              </View>
              
              <View style={styles.labelContainer}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
                {option.description && (
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    {option.description}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
      
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.xs,
  },
  optionsContainer: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  optionWithBorder: {
    borderBottomWidth: 1,
  },
  radioContainer: {
    marginRight: theme.spacing.md,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  labelContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
  optionDescription: {
    fontSize: theme.typography.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: theme.spacing.xs,
  },
});