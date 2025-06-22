export interface CalculationStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isSkipped: boolean;
}

export interface CalculationParams {
  amount: number;
  cashback: {
    percentage: number;
    maxAmount: number;
    roundingMode: 'arithmetic' | 'up' | 'down';
  };
  gracePeriod: {
    days: number;
    annualRate: number;
  };
  discount: {
    finalAmount: number | undefined; // Allow undefined to indicate skipped discount
  };
}

// Input params allow undefined values during input
export interface InputParams {
  amount?: number;
  cashback: {
    percentage?: number;
    maxAmount?: number;
    roundingMode: 'arithmetic' | 'up' | 'down';
  };
  gracePeriod: {
    days?: number;
    annualRate?: number;
  };
  discount: {
    finalAmount?: number;
  };
}

export interface CalculationResult {
  id: string;
  date: string;
  params: CalculationParams;
  results: {
    cashbackBenefit: number;
    gracePeriodBenefit: number;
    discountBenefit: number;
    totalBenefit: number;
    bestOption: 'cashback' | 'gracePeriod' | 'discount' | 'combined';
  };
}

export type CalculationHistory = CalculationResult[];