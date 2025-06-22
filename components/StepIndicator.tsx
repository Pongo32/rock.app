import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { theme } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepPress?: (step: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepPress,
}) => {
  const { colors } = useThemeStore();

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <View
                style={[
                  styles.connector,
                  { backgroundColor: isCompleted ? colors.primary : colors.border },
                ]}
              />
            )}
            <Pressable
              onPress={() => onStepPress && onStepPress(index)}
              style={({ pressed }) => [
                styles.stepContainer,
                pressed ? styles.stepPressed : null,
              ]}
              disabled={!onStepPress}
            >
              <View
                style={[
                  styles.step,
                  {
                    backgroundColor: isActive || isCompleted ? colors.primary : colors.card,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.stepText,
                    {
                      color: isActive || isCompleted ? colors.background : colors.textSecondary,
                      fontWeight: isActive || isCompleted ? theme.typography.fontWeights.bold : theme.typography.fontWeights.medium,
                    },
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color: isActive ? colors.text : colors.textSecondary,
                    fontWeight: isActive ? theme.typography.fontWeights.medium : theme.typography.fontWeights.normal,
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {step}
              </Text>
            </Pressable>
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    minHeight: 70,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 2,
    minWidth: 0,
  },
  stepPressed: {
    opacity: 0.8,
  },
  step: {
    width: isSmallScreen ? 36 : 44,
    height: isSmallScreen ? 36 : 44,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  stepText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: isSmallScreen ? 11 : 13,
    textAlign: 'center',
    lineHeight: isSmallScreen ? 14 : 16,
  },
  connector: {
    height: 2,
    flex: 1,
    marginHorizontal: -theme.spacing.xs,
    marginTop: isSmallScreen ? 18 : 22,
  },
});