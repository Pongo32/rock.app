import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalculationParams, CalculationResult, CalculationHistory, InputParams } from '@/types/calculator';
import { calculateTotalBenefit } from '@/utils/calculations';

interface CalculatorState {
  // Current input parameters (can have undefined values)
  inputParams: InputParams;
  // Current step in the wizard
  currentStep: number;
  // History of calculations
  history: CalculationHistory;
  // Actions
  setAmount: (amount?: number) => void;
  setCashbackPercentage: (percentage?: number) => void;
  setCashbackMaxAmount: (maxAmount?: number) => void;
  setCashbackRoundingMode: (mode: 'arithmetic' | 'up' | 'down') => void;
  setGracePeriodDays: (days?: number) => void;
  setGracePeriodRate: (rate?: number) => void;
  setDiscountFinalAmount: (amount?: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  skipStep: () => void;
  resetCalculation: () => void;
  saveCalculation: () => void;
  clearHistory: () => void;
  // Get completed params for calculation
  getCompletedParams: () => CalculationParams | null;
}

const initialInputParams: InputParams = {
  amount: undefined,
  cashback: {
    percentage: undefined,
    maxAmount: undefined,
    roundingMode: 'arithmetic',
  },
  gracePeriod: {
    days: undefined,
    annualRate: undefined,
  },
  discount: {
    finalAmount: undefined,
  },
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      inputParams: { ...initialInputParams },
      currentStep: 0,
      history: [],
      
      setAmount: (amount) => set((state) => ({
        inputParams: { ...state.inputParams, amount }
      })),
      
      setCashbackPercentage: (percentage) => set((state) => ({
        inputParams: {
          ...state.inputParams,
          cashback: { ...state.inputParams.cashback, percentage }
        }
      })),
      
      setCashbackMaxAmount: (maxAmount) => set((state) => ({
        inputParams: {
          ...state.inputParams,
          cashback: { ...state.inputParams.cashback, maxAmount }
        }
      })),
      
      setCashbackRoundingMode: (roundingMode) => set((state) => ({
        inputParams: {
          ...state.inputParams,
          cashback: { ...state.inputParams.cashback, roundingMode }
        }
      })),
      
      setGracePeriodDays: (days) => set((state) => ({
        inputParams: {
          ...state.inputParams,
          gracePeriod: { ...state.inputParams.gracePeriod, days }
        }
      })),
      
      setGracePeriodRate: (annualRate) => set((state) => ({
        inputParams: {
          ...state.inputParams,
          gracePeriod: { ...state.inputParams.gracePeriod, annualRate }
        }
      })),
      
      setDiscountFinalAmount: (finalAmount) => set((state) => ({
        inputParams: {
          ...state.inputParams,
          discount: { ...state.inputParams.discount, finalAmount }
        }
      })),
      
      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 4)
      })),
      
      prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 0)
      })),
      
      goToStep: (step) => set(() => ({
        currentStep: Math.max(0, Math.min(step, 4))
      })),
      
      skipStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 4)
      })),
      
      resetCalculation: () => set(() => ({
        inputParams: { ...initialInputParams },
        currentStep: 0
      })),
      
      getCompletedParams: () => {
        const { inputParams } = get();
        
        // Check if all required fields are filled
        if (
          inputParams.amount === undefined ||
          inputParams.amount <= 0
        ) {
          return null;
        }
        
        return {
          amount: inputParams.amount,
          cashback: {
            percentage: inputParams.cashback.percentage || 0,
            maxAmount: inputParams.cashback.maxAmount || 0,
            roundingMode: inputParams.cashback.roundingMode,
          },
          gracePeriod: {
            days: inputParams.gracePeriod.days || 0,
            annualRate: inputParams.gracePeriod.annualRate || 0,
          },
          discount: {
            // Keep undefined if not set, don't default to 0
            finalAmount: inputParams.discount.finalAmount,
          },
        };
      },
      
      saveCalculation: () => set((state) => {
        const completedParams = get().getCompletedParams();
        if (!completedParams) return state;
        
        const results = calculateTotalBenefit(completedParams);
        const newCalculation: CalculationResult = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          params: completedParams,
          results,
        };
        
        // Keep only the last 5 calculations
        const updatedHistory = [newCalculation, ...state.history].slice(0, 5);
        
        return {
          history: updatedHistory
        };
      }),
      
      clearHistory: () => set(() => ({
        history: []
      })),
    }),
    {
      name: 'calculator-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);