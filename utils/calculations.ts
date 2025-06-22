import { CalculationParams } from '@/types/calculator';

// Calculate cashback benefit
export const calculateCashbackBenefit = (
  amount: number,
  percentage: number,
  maxAmount: number,
  roundingMode: 'arithmetic' | 'up' | 'down'
): number => {
  if (amount <= 0 || percentage <= 0) return 0;
  
  const rawBenefit = amount * (percentage / 100);
  const limitedBenefit = maxAmount > 0 ? Math.min(rawBenefit, maxAmount) : rawBenefit;
  
  // Apply rounding based on selected mode
  switch (roundingMode) {
    case 'up':
      return Math.ceil(limitedBenefit);
    case 'down':
      return Math.floor(limitedBenefit);
    case 'arithmetic':
    default:
      return Math.round(limitedBenefit);
  }
};

// Calculate grace period benefit
export const calculateGracePeriodBenefit = (
  amount: number,
  days: number,
  annualRate: number
): number => {
  if (amount <= 0 || days <= 0 || annualRate <= 0) return 0;
  
  return amount * (annualRate / 100) * (days / 365);
};

// Calculate discount benefit
export const calculateDiscountBenefit = (
  originalAmount: number,
  finalAmount: number | undefined
): number => {
  // If finalAmount is undefined, discount step was skipped
  if (finalAmount === undefined || originalAmount <= 0 || finalAmount < 0 || finalAmount > originalAmount) return 0;
  
  return originalAmount - finalAmount;
};

// Calculate effective amount for maximum cashback
export const calculateEffectiveAmount = (
  maxCashbackAmount: number,
  cashbackPercentage: number
): number | null => {
  if (cashbackPercentage <= 0 || maxCashbackAmount <= 0) return null;
  
  return maxCashbackAmount / (cashbackPercentage / 100);
};

// Calculate total benefit and determine best option
export const calculateTotalBenefit = (params: CalculationParams): {
  cashbackBenefit: number;
  gracePeriodBenefit: number;
  discountBenefit: number;
  totalBenefit: number;
  bestOption: 'cashback' | 'gracePeriod' | 'discount' | 'combined';
  hasDiscount: boolean; // New field to indicate if discount was calculated
} => {
  const { amount, cashback, gracePeriod, discount } = params;
  
  const cashbackBenefit = calculateCashbackBenefit(
    amount,
    cashback.percentage,
    cashback.maxAmount,
    cashback.roundingMode
  );
  
  const gracePeriodBenefit = calculateGracePeriodBenefit(
    amount,
    gracePeriod.days,
    gracePeriod.annualRate
  );
  
  const discountBenefit = calculateDiscountBenefit(
    amount,
    discount.finalAmount
  );
  
  // Check if discount was actually calculated (not skipped)
  const hasDiscount = discount.finalAmount !== undefined && discountBenefit > 0;
  
  const totalBenefit = cashbackBenefit + gracePeriodBenefit + discountBenefit;
  
  // Determine best option based on highest individual benefit
  const benefits = [
    { type: 'cashback' as const, value: cashbackBenefit },
    { type: 'gracePeriod' as const, value: gracePeriodBenefit },
    { type: 'discount' as const, value: discountBenefit },
  ].filter(benefit => benefit.value > 0);
  
  if (benefits.length === 0) {
    return {
      cashbackBenefit,
      gracePeriodBenefit,
      discountBenefit,
      totalBenefit,
      bestOption: 'combined',
      hasDiscount,
    };
  }
  
  // Sort by value descending
  benefits.sort((a, b) => b.value - a.value);
  
  // Check if top benefits are very close (within 5%)
  const topBenefit = benefits[0];
  const secondBenefit = benefits[1];
  
  let bestOption: 'cashback' | 'gracePeriod' | 'discount' | 'combined';
  
  if (benefits.length === 1) {
    bestOption = topBenefit.type;
  } else if (secondBenefit && Math.abs(topBenefit.value - secondBenefit.value) / topBenefit.value < 0.05) {
    bestOption = 'combined';
  } else {
    bestOption = topBenefit.type;
  }
  
  return {
    cashbackBenefit,
    gracePeriodBenefit,
    discountBenefit,
    totalBenefit,
    bestOption,
    hasDiscount,
  };
};