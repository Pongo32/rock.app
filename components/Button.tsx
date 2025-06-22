import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { theme } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const { colors } = useThemeStore();

  const getButtonStyles = () => {
    const buttonStyles: StyleProp<ViewStyle>[] = [styles.buttonContainer];
    
    // Add variant styles
    switch (variant) {
      case 'primary':
        buttonStyles.push({ backgroundColor: colors.primary });
        break;
      case 'secondary':
        buttonStyles.push({ backgroundColor: colors.secondary });
        break;
      case 'outline':
        buttonStyles.push({
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
        });
        break;
      case 'text':
        buttonStyles.push({ backgroundColor: 'transparent' });
        break;
    }
    
    // Add size styles
    switch (size) {
      case 'small':
        buttonStyles.push(styles.buttonSmall);
        break;
      case 'medium':
        buttonStyles.push(styles.buttonMedium);
        break;
      case 'large':
        buttonStyles.push(styles.buttonLarge);
        break;
    }
    
    // Add disabled styles
    if (disabled || loading) {
      buttonStyles.push(styles.buttonDisabled);
      
      if (variant === 'outline') {
        buttonStyles.push({ borderColor: colors.textSecondary });
      }
    }
    
    return buttonStyles;
  };
  
  const getTextStyles = () => {
    const textStyles: StyleProp<TextStyle>[] = [styles.buttonTextStyle];
    
    // Add variant text styles
    switch (variant) {
      case 'primary':
      case 'secondary':
        textStyles.push({ color: 'white' });
        break;
      case 'outline':
      case 'text':
        textStyles.push({ color: colors.primary });
        break;
    }
    
    // Add size text styles
    switch (size) {
      case 'small':
        textStyles.push(styles.buttonTextSmall);
        break;
      case 'medium':
        textStyles.push(styles.buttonTextMedium);
        break;
      case 'large':
        textStyles.push(styles.buttonTextLarge);
        break;
    }
    
    // Add disabled text styles
    if (disabled || loading) {
      if (variant === 'outline' || variant === 'text') {
        textStyles.push({ color: colors.textSecondary });
      }
    }
    
    return textStyles;
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'secondary' ? 'white' : colors.primary}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={[getTextStyles(), textStyle]}>{title}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  buttonSmall: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  buttonMedium: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  buttonLarge: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextStyle: {
    fontWeight: theme.typography.fontWeights.medium,
  },
  buttonTextSmall: {
    fontSize: theme.typography.fontSizes.sm,
  },
  buttonTextMedium: {
    fontSize: theme.typography.fontSizes.md,
  },
  buttonTextLarge: {
    fontSize: theme.typography.fontSizes.lg,
  },
});