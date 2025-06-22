// Format currency with proper separators and currency symbol
export const formatCurrency = (
  value: number,
  currency: string = '₽',
  locale: string = 'ru-RU'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency === '₽' ? 'RUB' : currency === '$' ? 'USD' : currency === '€' ? 'EUR' : 'CNY',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace('RUB', '₽')
    .replace('CNY', '¥');
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// Format number with proper separators
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('ru-RU').format(value);
};

// Parse currency input (handle both comma and dot as decimal separator)
export const parseCurrencyInput = (value: string): number => {
  // Remove all non-numeric characters except for comma and dot
  const sanitized = value.replace(/[^\d.,]/g, '');
  
  // Replace comma with dot for calculation
  const normalized = sanitized.replace(',', '.');
  
  return parseFloat(normalized) || 0;
};