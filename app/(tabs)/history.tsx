import React from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculatorStore } from '@/store/calculatorStore';
import { useThemeStore } from '@/store/themeStore';
import { HistoryItem } from '@/components/HistoryItem';
import { Button } from '@/components/Button';
import { theme } from '@/constants/theme';
import { CalculationResult } from '@/types/calculator';

export default function HistoryScreen() {
  const { colors } = useThemeStore();
  const { history, clearHistory } = useCalculatorStore();
  
  const handleClearHistory = () => {
    Alert.alert(
      'Очистить историю',
      'Вы уверены, что хотите очистить всю историю расчётов?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: clearHistory,
        },
      ]
    );
  };
  
  const handleItemPress = (item: CalculationResult) => {
    // В будущей версии это может перенаправить на детальный просмотр
    // или восстановить расчёт для редактирования
    Alert.alert(
      'Детали расчёта',
      `Исходная сумма: ₽${item.params.amount}
Общая выгода: ₽${item.results.totalBenefit.toFixed(2)}`,
      [{ text: 'OK' }]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Недавние расчёты</Text>
        {history.length > 0 && (
          <Button
            title="Очистить всё"
            onPress={handleClearHistory}
            variant="text"
            size="small"
          />
        )}
      </View>
      
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>История пуста</Text>
          <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
            Здесь будет отображаться история ваших расчётов.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryItem item={item} onPress={handleItemPress} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing.sm,
  },
  emptyDescription: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
  },
});