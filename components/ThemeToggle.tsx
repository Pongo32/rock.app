import React from 'react';
import { Pressable, StyleSheet, Animated } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { theme } from '@/constants/theme';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme, colors } = useThemeStore();
  const [scaleAnim] = React.useState(new Animated.Value(1));

  const handlePress = () => {
    // Animation for button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    toggleTheme();
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {mode === 'light' ? (
          <Moon size={20} color={colors.text} />
        ) : (
          <Sun size={20} color={colors.text} />
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: theme.spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});