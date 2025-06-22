import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NumericInput } from '@/components/NumericInput';
import { Card } from '@/components/Card';
import { theme } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { calculateEffectiveAmount } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';

export default function EffectiveAmountScreen() {
  const { colors } = useThemeStore();
  const [cashbackPercentage, setCashbackPercentage] = useState<number | undefined>(undefined);
  const [maxCashbackAmount, setMaxCashbackAmount] = useState<number | undefined>(undefined);
  const [effectiveAmount, setEffectiveAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!cashbackPercentage || cashbackPercentage <= 0) {
      setError('Процент кэшбэка должен быть больше 0');
      setEffectiveAmount(null);
      return;
    }
    
    if (!maxCashbackAmount || maxCashbackAmount <= 0) {
      setError('Максимальная сумма кэшбэка должна быть больше 0');
      setEffectiveAmount(null);
      return;
    }
    
    setError(null);
    const amount = calculateEffectiveAmount(maxCashbackAmount, cashbackPercentage);
    setEffectiveAmount(amount);
  }, [cashbackPercentage, maxCashbackAmount]);

  const handleCashbackPercentageChange = (value?: number) => {
    setCashbackPercentage(value);
  };

  const handleMaxCashbackAmountChange = (value?: number) => {
    setMaxCashbackAmount(value);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        <Card title="Калькулятор эффективной суммы">
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Рассчитайте минимальную сумму покупки, необходимую для получения максимального кэшбэка.
          </Text>
          
          <NumericInput
            value={cashbackPercentage}
            onChangeValue={handleCashbackPercentageChange}
            label="Процент кэшбэка"
            suffix="%"
            min={0}
            max={100}
            allowDecimals={true}
            decimalPlaces={2}
          />
          
          <NumericInput
            value={maxCashbackAmount}
            onChangeValue={handleMaxCashbackAmountChange}
            label="Максимальная сумма кэшбэка"
            prefix="₽"
            min={0}
            allowDecimals={true}
            decimalPlaces={2}
          />
          
          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: `${colors.error}10`, borderLeftColor: colors.error }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          ) : effectiveAmount ? (
            <View style={[styles.resultContainer, { backgroundColor: `${colors.primary}10`, borderLeftColor: colors.primary }]}>
              <Text style={[styles.resultLabel, { color: colors.text }]}>
                Минимальная сумма покупки для получения максимального кэшбэка:
              </Text>
              <Text style={[styles.resultValue, { color: colors.primary }]}>
                {formatCurrency(effectiveAmount)}
              </Text>
              <Text style={[styles.resultExplanation, { color: colors.textSecondary }]}>
                При ставке кэшбэка {cashbackPercentage}%, вам необходимо потратить как минимум {formatCurrency(effectiveAmount)}, чтобы получить максимальный кэшбэк в размере {formatCurrency(maxCashbackAmount || 0)}.
              </Text>
            </View>
          ) : null}
        </Card>
        
        <Card title="Как это работает" style={styles.infoCard}>
          <Text style={[styles.infoText, { color: colors.text }]}>
            Многие программы кэшбэка имеют максимальный лимит на сумму кэшбэка, которую вы можете получить. Этот калькулятор помогает определить точную сумму покупки, необходимую для максимизации вашего кэшбэка.
          </Text>
          
          <Text style={[styles.formulaLabel, { color: colors.text }]}>Формула:</Text>
          <View style={[styles.formulaContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.formula, { color: colors.text }]}>
              Эффективная сумма = Максимальный кэшбэк ÷ (Процент кэшбэка ÷ 100)
            </Text>
          </View>
          
          <Text style={[styles.exampleLabel, { color: colors.text }]}>Пример:</Text>
          <Text style={[styles.exampleText, { color: colors.text }]}>
            Если ваша карта предлагает 5% кэшбэка с максимумом ₽2 000 в месяц, вам нужно потратить ₽40 000, чтобы достичь этого максимума (₽2 000 ÷ 0,05 = ₽40 000).
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.fontSizes.md,
    marginBottom: theme.spacing.md,
  },
  errorContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.md,
  },
  resultContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
  },
  resultLabel: {
    fontSize: theme.typography.fontSizes.md,
    marginBottom: theme.spacing.sm,
  },
  resultValue: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.sm,
  },
  resultExplanation: {
    fontSize: theme.typography.fontSizes.sm,
  },
  infoCard: {
    marginTop: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.typography.fontSizes.md,
    marginBottom: theme.spacing.md,
  },
  formulaLabel: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.xs,
  },
  formulaContainer: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
  },
  formula: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: 'monospace',
  },
  exampleLabel: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.xs,
  },
  exampleText: {
    fontSize: theme.typography.fontSizes.md,
  },
});