import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculatorStore } from '@/store/calculatorStore';
import { StepIndicator } from '@/components/StepIndicator';
import { NumericInput } from '@/components/NumericInput';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { RadioGroup } from '@/components/RadioGroup';
import { ResultCard } from '@/components/ResultCard';
import { theme } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { calculateTotalBenefit } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

export default function CalculatorScreen() {
  const { colors } = useThemeStore();
  const {
    inputParams,
    currentStep,
    setAmount,
    setCashbackPercentage,
    setCashbackMaxAmount,
    setCashbackRoundingMode,
    setGracePeriodDays,
    setGracePeriodRate,
    setDiscountFinalAmount,
    nextStep,
    prevStep,
    goToStep,
    resetCalculation,
    saveCalculation,
    getCompletedParams,
  } = useCalculatorStore();
  
  // Local state for current step inputs
  const [localAmount, setLocalAmount] = useState<number | undefined>(undefined);
  const [localCashbackPercentage, setLocalCashbackPercentage] = useState<number | undefined>(undefined);
  const [localCashbackMaxAmount, setLocalCashbackMaxAmount] = useState<number | undefined>(undefined);
  const [localCashbackRoundingMode, setLocalCashbackRoundingMode] = useState<'arithmetic' | 'up' | 'down'>('arithmetic');
  const [localGracePeriodDays, setLocalGracePeriodDays] = useState<number | undefined>(undefined);
  const [localGracePeriodRate, setLocalGracePeriodRate] = useState<number | undefined>(undefined);
  const [localDiscountFinalAmount, setLocalDiscountFinalAmount] = useState<number | undefined>(undefined);
  
  const [results, setResults] = useState<ReturnType<typeof calculateTotalBenefit> | null>(null);
  
  // Initialize local state with store values when step changes or component mounts
  useEffect(() => {
    switch (currentStep) {
      case 0:
        setLocalAmount(inputParams.amount || undefined);
        break;
      case 1:
        setLocalCashbackPercentage(inputParams.cashback.percentage || undefined);
        setLocalCashbackMaxAmount(inputParams.cashback.maxAmount || undefined);
        setLocalCashbackRoundingMode(inputParams.cashback.roundingMode);
        break;
      case 2:
        setLocalGracePeriodDays(inputParams.gracePeriod.days || undefined);
        setLocalGracePeriodRate(inputParams.gracePeriod.annualRate || undefined);
        break;
      case 3:
        setLocalDiscountFinalAmount(inputParams.discount.finalAmount || undefined);
        break;
    }
  }, [currentStep, inputParams]);
  
  // Calculate results only when we reach the final step
  useEffect(() => {
    if (currentStep === 4) {
      const completedParams = getCompletedParams();
      if (completedParams) {
        setResults(calculateTotalBenefit(completedParams));
      }
    }
  }, [currentStep, getCompletedParams]);
  
  const steps = [
    'Сумма',
    'Кэшбэк',
    'Льготный период',
    'Скидка',
    'Результаты',
  ];
  
  const handleSaveCalculation = () => {
    saveCalculation();
    Alert.alert(
      'Расчёт сохранён',
      'Ваш расчёт был сохранён в истории.',
      [{ text: 'OK' }]
    );
  };
  
  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return localAmount !== undefined && localAmount > 0;
      case 1:
      case 2:
      case 3:
        return true; // These steps are optional
      default:
        return true;
    }
  };
  
  const handleNextStep = () => {
    // Save current step data to store before proceeding
    switch (currentStep) {
      case 0:
        if (localAmount !== undefined) {
          setAmount(localAmount);
        }
        break;
      case 1:
        if (localCashbackPercentage !== undefined) {
          setCashbackPercentage(localCashbackPercentage);
        }
        if (localCashbackMaxAmount !== undefined) {
          setCashbackMaxAmount(localCashbackMaxAmount);
        }
        setCashbackRoundingMode(localCashbackRoundingMode);
        break;
      case 2:
        if (localGracePeriodDays !== undefined) {
          setGracePeriodDays(localGracePeriodDays);
        }
        if (localGracePeriodRate !== undefined) {
          setGracePeriodRate(localGracePeriodRate);
        }
        break;
      case 3:
        // Only set discount if user actually entered a value
        // If field is empty (undefined), keep it as undefined to indicate skipped step
        setDiscountFinalAmount(localDiscountFinalAmount);
        break;
    }
    nextStep();
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card title="Сумма покупки">
            <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
              Введите общую сумму вашей покупки.
            </Text>
            <NumericInput
              value={localAmount}
              onChangeValue={setLocalAmount}
              label="Сумма"
              prefix="₽"
              placeholder="Введите сумму"
              min={0}
              allowDecimals={true}
              decimalPlaces={2}
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Далее"
                onPress={handleNextStep}
                disabled={!canProceedFromStep(0)}
                style={styles.fullWidthButton}
              />
            </View>
          </Card>
        );
      
      case 1:
        return (
          <Card title="Кэшбэк">
            <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
              Введите процент кэшбэка, максимальную сумму и выберите режим округления.
            </Text>
            <NumericInput
              value={localCashbackPercentage}
              onChangeValue={setLocalCashbackPercentage}
              label="Процент кэшбэка"
              suffix="%"
              placeholder="Введите процент"
              min={0}
              max={100}
              allowDecimals={true}
              decimalPlaces={2}
            />
            <NumericInput
              value={localCashbackMaxAmount}
              onChangeValue={setLocalCashbackMaxAmount}
              label="Максимальная сумма кэшбэка"
              prefix="₽"
              placeholder="Введите максимальную сумму"
              min={0}
              allowDecimals={true}
              decimalPlaces={2}
            />
            <RadioGroup
              label="Режим округления"
              options={[
                {
                  label: 'Арифметическое',
                  value: 'arithmetic',
                  description: 'Стандартное округление (0.5 и выше округляется вверх)',
                },
                {
                  label: 'Округление вверх',
                  value: 'up',
                  description: 'Всегда округляется до следующего целого числа',
                },
                {
                  label: 'Округление вниз',
                  value: 'down',
                  description: 'Всегда округляется до предыдущего целого числа',
                },
              ]}
              value={localCashbackRoundingMode}
              onChange={setLocalCashbackRoundingMode}
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Назад"
                onPress={prevStep}
                variant="outline"
                style={styles.buttonHalf}
              />
              <Button
                title="Далее / Пропустить"
                onPress={handleNextStep}
                style={styles.buttonHalf}
              />
            </View>
          </Card>
        );
      
      case 2:
        return (
          <Card title="Льготный период">
            <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
              Введите детали льготного периода для расчёта экономии на процентах.
            </Text>
            <NumericInput
              value={localGracePeriodDays}
              onChangeValue={setLocalGracePeriodDays}
              label="Льготный период (дни)"
              placeholder="Введите количество дней"
              min={0}
              allowDecimals={false}
            />
            <NumericInput
              value={localGracePeriodRate}
              onChangeValue={setLocalGracePeriodRate}
              label="Годовая процентная ставка"
              suffix="%"
              placeholder="Введите процентную ставку"
              min={0}
              allowDecimals={true}
              decimalPlaces={2}
            />
            {localGracePeriodRate !== undefined && localGracePeriodRate > 100 && (
              <Text style={[styles.warningText, { color: colors.warning }]}>
                Внимание: Процентная ставка необычно высокая (выше 100%).
              </Text>
            )}
            <View style={styles.buttonContainer}>
              <Button
                title="Назад"
                onPress={prevStep}
                variant="outline"
                style={styles.buttonHalf}
              />
              <Button
                title="Далее / Пропустить"
                onPress={handleNextStep}
                style={styles.buttonHalf}
              />
            </View>
          </Card>
        );
      
      case 3:
        return (
          <Card title="Скидка">
            <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
              Введите итоговую сумму после скидки для расчёта экономии.
            </Text>
            <NumericInput
              value={localDiscountFinalAmount}
              onChangeValue={setLocalDiscountFinalAmount}
              label="Сумма после скидки"
              prefix="₽"
              placeholder="Введите сумму после скидки"
              min={0}
              max={inputParams.amount}
              allowDecimals={true}
              decimalPlaces={2}
            />
            {localDiscountFinalAmount !== undefined && 
             inputParams.amount !== undefined && 
             localDiscountFinalAmount > inputParams.amount && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                Итоговая сумма не может быть больше исходной суммы.
              </Text>
            )}
            <View style={styles.buttonContainer}>
              <Button
                title="Назад"
                onPress={prevStep}
                variant="outline"
                style={styles.buttonHalf}
              />
              <Button
                title="Рассчитать"
                onPress={handleNextStep}
                style={styles.buttonHalf}
              />
            </View>
          </Card>
        );
      
      case 4:
        if (!results) {
          return (
            <Card title="Ошибка">
              <Text style={[styles.errorText, { color: colors.error }]}>
                Не удалось выполнить расчёт. Проверьте введённые данные.
              </Text>
              <Button
                title="Назад"
                onPress={prevStep}
                variant="outline"
                style={styles.fullWidthButton}
              />
            </Card>
          );
        }
        
        return (
          <View>
            <Card title="Результаты расчёта">
              <Text style={[styles.resultSummary, { color: colors.text }]}>
                На основе ваших данных, вот анализ выгоды для каждого варианта:
              </Text>
              
              <View style={styles.resultsContainer}>
                {results.cashbackBenefit > 0 && (
                  <ResultCard
                    title="Выгода от кэшбэка"
                    amount={results.cashbackBenefit}
                    description={`${inputParams.cashback.percentage || 0}% кэшбэка на ₽${inputParams.amount || 0}`}
                    isHighlighted={results.bestOption === 'cashback'}
                  />
                )}
                
                {results.gracePeriodBenefit > 0 && (
                  <ResultCard
                    title="Выгода от льготного периода"
                    amount={results.gracePeriodBenefit}
                    description={`${inputParams.gracePeriod.days || 0} дней при ${inputParams.gracePeriod.annualRate || 0}% годовых`}
                    isHighlighted={results.bestOption === 'gracePeriod'}
                  />
                )}
                
                {/* Only show discount result card if discount was actually calculated */}
                {results.hasDiscount && results.discountBenefit > 0 && (
                  <ResultCard
                    title="Выгода от скидки"
                    amount={results.discountBenefit}
                    description={`Исходная: ₽${inputParams.amount || 0}, После скидки: ₽${inputParams.discount.finalAmount || 0}`}
                    isHighlighted={results.bestOption === 'discount'}
                  />
                )}
              </View>
              
              <Text style={[styles.recommendation, { 
                color: colors.primary,
                backgroundColor: `${colors.primary}20`,
                borderLeftColor: colors.primary,
              }]}>
                {getRecommendation(results)}
              </Text>
              
              <View style={styles.buttonContainer}>
                <Button
                  title="Назад"
                  onPress={prevStep}
                  variant="outline"
                  style={styles.buttonHalf}
                />
                <Button
                  title="Сохранить"
                  onPress={handleSaveCalculation}
                  style={styles.buttonHalf}
                />
              </View>
              
              <Button
                title="Начать новый расчёт"
                onPress={resetCalculation}
                variant="text"
                style={styles.resetButton}
              />
            </Card>
          </View>
        );
      
      default:
        return null;
    }
  };
  
  const getRecommendation = (results: ReturnType<typeof calculateTotalBenefit>) => {
    const { cashbackBenefit, gracePeriodBenefit, discountBenefit, bestOption, hasDiscount } = results;
    
    if (bestOption === 'cashback') {
      return `🏆 Лучший выбор: Кэшбэк! Вы получите максимальную выгоду в размере ${formatCurrency(cashbackBenefit)}. Это самый выгодный вариант для данной покупки.`;
    }
    
    if (bestOption === 'gracePeriod') {
      return `🏆 Лучший выбор: Льготный период! Использование льготного периода принесёт вам максимальную выгоду в размере ${formatCurrency(gracePeriodBenefit)}. Это самый выгодный вариант для данной покупки.`;
    }
    
    if (bestOption === 'discount' && hasDiscount) {
      return `🏆 Лучший выбор: Скидка! Использование скидки обеспечит максимальную выгоду в размере ${formatCurrency(discountBenefit)}. Это самый выгодный вариант для данной покупки.`;
    }
    
    if (bestOption === 'combined') {
      const benefits = [];
      if (cashbackBenefit > 0) benefits.push(`кэшбэк ${formatCurrency(cashbackBenefit)}`);
      if (gracePeriodBenefit > 0) benefits.push(`льготный период ${formatCurrency(gracePeriodBenefit)}`);
      if (hasDiscount && discountBenefit > 0) benefits.push(`скидка ${formatCurrency(discountBenefit)}`);
      
      return `💡 Рекомендация: Все варианты приносят примерно одинаковую выгоду. Вы можете выбрать любой из них: ${benefits.join(', ')}.`;
    }
    
    return 'Для указанных параметров не найдено значительной выгоды.';
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          onStepPress={goToStep}
        />
        
        {renderStepContent()}
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
  stepDescription: {
    fontSize: theme.typography.fontSizes.md,
    marginBottom: theme.spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  buttonHalf: {
    flex: 1,
  },
  fullWidthButton: {
    flex: 1,
  },
  resetButton: {
    marginTop: theme.spacing.md,
  },
  warningText: {
    fontSize: theme.typography.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },
  resultSummary: {
    fontSize: theme.typography.fontSizes.md,
    marginBottom: theme.spacing.md,
  },
  resultsContainer: {
    marginBottom: theme.spacing.md,
  },
  recommendation: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    lineHeight: 22,
  },
});