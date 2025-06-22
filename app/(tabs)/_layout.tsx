import React from 'react';
import { Tabs } from 'expo-router';
import { Calculator, History, Lightbulb } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function TabLayout() {
  const { colors } = useThemeStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: colors.text,
        },
        headerTintColor: colors.primary,
        headerRight: () => <ThemeToggle />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Калькулятор выгоды',
          tabBarLabel: 'Калькулятор',
          tabBarIcon: ({ color, size }) => (
            <Calculator size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="effective-amount"
        options={{
          title: 'Эффективная сумма',
          tabBarLabel: 'Эффективная',
          tabBarIcon: ({ color, size }) => (
            <Lightbulb size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'История расчётов',
          tabBarLabel: 'История',
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}