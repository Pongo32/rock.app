import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';

interface NumericInputProps {
  value?: number;
  onChangeValue: (value?: number) => void;
  label?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  allowDecimals?: boolean;
  decimalPlaces?: number;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChangeValue,
  label,
  placeholder = '',
  prefix,
  suffix,
  min,
  max,
  step = 1,
  error,
  allowDecimals = true,
  decimalPlaces = 2,
}) => {
  const { colors } = useThemeStore();
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Update input value when external value changes
    if (value !== undefined && value > 0) {
      setInputValue(value.toString());
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleChangeText = (text: string) => {
    // Автоматическая замена запятой на точку
    let sanitized = text.replace(/,/g, '.');
    
    // Remove all non-numeric characters except decimal point
    sanitized = sanitized.replace(/[^\d.]/g, '');
    
    // Handle decimal places
    if (!allowDecimals) {
      sanitized = sanitized.replace(/\./g, '');
    } else if (sanitized.includes('.')) {
      const parts = sanitized.split('.');
      if (parts[1] && parts[1].length > decimalPlaces) {
        sanitized = `${parts[0]}.${parts[1].substring(0, decimalPlaces)}`;
      }
    }
    
    setInputValue(sanitized);
    
    if (sanitized === '') {
      onChangeValue(undefined);
    } else {
      const numValue = parseFloat(sanitized);
      if (!isNaN(numValue)) {
        onChangeValue(numValue);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const increment = () => {
    const currentValue = value || 0;
    const newValue = currentValue + step;
    
    if (max !== undefined && newValue > max) return;
    
    setInputValue(newValue.toString());
    onChangeValue(newValue);
  };

  const decrement = () => {
    const currentValue = value || 0;
    const newValue = currentValue - step;
    
    if (min !== undefined && newValue < min) return;
    
    setInputValue(newValue.toString());
    onChangeValue(newValue);
  };

  const currentNumValue = value || 0;
  const canDecrement = min === undefined || currentNumValue > min;
  const canIncrement = max === undefined || currentNumValue < max;

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          { 
            borderColor: isFocused ? colors.primary : colors.border,
            backgroundColor: colors.card,
          },
          error && { borderColor: colors.error },
        ]}
      >
        {prefix && <Text style={[styles.prefix, { color: colors.textSecondary }]}>{prefix}</Text>}
        
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={inputValue}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {suffix && <Text style={[styles.suffix, { color: colors.textSecondary }]}>{suffix}</Text>}
        
        <View style={[styles.buttonsContainer, { borderLeftColor: colors.border }]}>
          <Pressable
            style={[
              styles.button,
              !canDecrement && styles.buttonDisabled
            ]}
            onPress={decrement}
            disabled={!canDecrement}
          >
            <Text style={[
              styles.buttonText,
              { color: colors.text },
              !canDecrement && { color: colors.textSecondary }
            ]}>−</Text>
          </Pressable>
          
          <View style={[styles.buttonDivider, { backgroundColor: colors.border }]} />
          
          <Pressable
            style={[
              styles.button,
              !canIncrement && styles.buttonDisabled
            ]}
            onPress={increment}
            disabled={!canIncrement}
          >
            <Text style={[
              styles.buttonText,
              { color: colors.text },
              !canIncrement && { color: colors.textSecondary }
            ]}>+</Text>
          </Pressable>
        </View>
      </View>
      
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    minWidth: 60,
  },
  prefix: {
    paddingLeft: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
  },
  suffix: {
    paddingRight: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.md,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 1,
  },
  button: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonDivider: {
    width: 1,
    height: '70%',
  },
  buttonText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.medium,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: theme.spacing.xs,
  },
});