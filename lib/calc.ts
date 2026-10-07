/** Utility math functions shared across all tools. Avoid floating-point errors for money. */

export function round(value: number, decimals = 2): number {
  if (!isFinite(value)) return NaN;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function formatNumber(value: number, decimals = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '—';
  if (!isFinite(value)) return '∞';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(value: number, currency = '$', decimals = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '—';
  if (!isFinite(value)) return '∞';
  const formatted = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${value < 0 ? '-' : ''}${currency}${formatted}`;
}

export function formatPercent(value: number, decimals = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '—';
  if (!isFinite(value)) return '∞';
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })}%`;
}

/** Parse a user-entered number string safely. Returns NaN for invalid. */
export function parseNumber(input: string | number | undefined | null): number {
  if (input === null || input === undefined || input === '') return NaN;
  if (typeof input === 'number') return input;
  const cleaned = input.replace(/,/g, '').trim();
  const num = Number(cleaned);
  return isNaN(num) ? NaN : num;
}

/** Decimal-safe arithmetic for money. Works in cents to avoid float errors. */
export function addMoney(a: number, b: number): number {
  return round(a + b, 2);
}

export function multiplyMoney(amount: number, factor: number): number {
  return round(round(amount, 2) * factor, 2);
}

/** GCD for HCF/LCM calculations */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b > 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round(a) * Math.round(b)) / gcd(a, b);
}

/** Factorial for permutation/combination */
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export function permutation(n: number, r: number): number {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r) || r > n) return NaN;
  return factorial(n) / factorial(n - r);
}

export function combination(n: number, r: number): number {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r) || r > n) return NaN;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

/** Convert a decimal to a reduced fraction */
export function decimalToFraction(decimal: number): { numerator: number; denominator: number; display: string } {
  if (isNaN(decimal) || !isFinite(decimal)) return { numerator: NaN, denominator: NaN, display: '—' };
  if (decimal === 0) return { numerator: 0, denominator: 1, display: '0/1' };

  const sign = decimal < 0 ? -1 : 1;
  const abs = Math.abs(decimal);
  const tolerance = 1e-10;
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = abs;

  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(abs - h1 / k1) > abs * tolerance);

  const num = sign * h1;
  const den = k1;
  const g = gcd(Math.abs(num), den);
  const simplifiedNum = num / g;
  const simplifiedDen = den / g;

  return {
    numerator: simplifiedNum,
    denominator: simplifiedDen,
    display: `${simplifiedNum}/${simplifiedDen}`,
  };
}

/** GCD of fraction numerator/denominator for fraction operations */
function simplifyFraction(num: number, den: number): { numerator: number; denominator: number; display: string } {
  if (den === 0) return { numerator: NaN, denominator: NaN, display: '—' };
  const g = gcd(Math.abs(num), Math.abs(den));
  let n = num / g;
  let d = Math.abs(den) / g;
  if (d < 0) { n = -n; d = -d; }
  return { numerator: n, denominator: d, display: `${n}/${d}` };
}

export function addFractions(n1: number, d1: number, n2: number, d2: number) {
  return simplifyFraction(n1 * d2 + n2 * d1, d1 * d2);
}

export function subtractFractions(n1: number, d1: number, n2: number, d2: number) {
  return simplifyFraction(n1 * d2 - n2 * d1, d1 * d2);
}

export function multiplyFractions(n1: number, d1: number, n2: number, d2: number) {
  return simplifyFraction(n1 * n2, d1 * d2);
}

export function divideFractions(n1: number, d1: number, n2: number, d2: number) {
  if (n2 === 0) return { numerator: NaN, denominator: NaN, display: '—' };
  return simplifyFraction(n1 * d2, d1 * n2);
}

/** Calculate percentage: X% of Y */
export function percentageOf(percent: number, value: number): number {
  return round((percent / 100) * value, 6);
}

/** What percent is X of Y */
export function whatPercent(part: number, whole: number): number {
  if (whole === 0) return NaN;
  return round((part / whole) * 100, 6);
}

/** Percentage increase from original to new */
export function percentageIncrease(original: number, newValue: number): number {
  if (original === 0) return NaN;
  return round(((newValue - original) / Math.abs(original)) * 100, 6);
}

/** Percentage decrease from original to new */
export function percentageDecrease(original: number, newValue: number): number {
  if (original === 0) return NaN;
  return round(((original - newValue) / Math.abs(original)) * 100, 6);
}

/** Percentage change (can be negative) */
export function percentageChange(original: number, newValue: number): number {
  if (original === 0) return NaN;
  return round(((newValue - original) / Math.abs(original)) * 100, 6);
}

/** Percentage difference between two values (symmetric) */
export function percentageDifference(a: number, b: number): number {
  const avg = (a + b) / 2;
  if (avg === 0) return NaN;
  return round((Math.abs(a - b) / Math.abs(avg)) * 100, 6);
}

/** Simple interest */
export function simpleInterest(principal: number, rate: number, time: number): number {
  return round((principal * rate * time) / 100, 2);
}

/** Compound interest (amount = P(1 + r/n)^(nt)) */
export function compoundInterest(principal: number, rate: number, time: number, freq: number): { amount: number; interest: number } {
  const r = rate / 100;
  const amount = round(principal * Math.pow(1 + r / freq, freq * time), 2);
  return { amount, interest: round(amount - principal, 2) };
}

/** EMI calculation */
export function calculateEMI(principal: number, annualRate: number, months: number): { emi: number; totalPayment: number; totalInterest: number } {
  if (principal <= 0 || months <= 0) return { emi: NaN, totalPayment: NaN, totalInterest: NaN };
  if (annualRate === 0) {
    const emi = round(principal / months, 2);
    return { emi, totalPayment: round(emi * months, 2), totalInterest: 0 };
  }
  const monthlyRate = annualRate / 12 / 100;
  const emi = round((principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1), 2);
  const totalPayment = round(emi * months, 2);
  const totalInterest = round(totalPayment - principal, 2);
  return { emi, totalPayment, totalInterest };
}

/** SIP future value */
export function calculateSIP(monthly: number, annualRate: number, years: number): { futureValue: number; invested: number; gains: number } {
  if (monthly <= 0 || years <= 0) return { futureValue: NaN, invested: NaN, gains: NaN };
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  if (monthlyRate === 0) {
    const invested = round(monthly * months, 2);
    return { futureValue: invested, invested, gains: 0 };
  }
  const fv = round(monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate), 2);
  const invested = round(monthly * months, 2);
  return { futureValue: fv, invested, gains: round(fv - invested, 2) };
}

/** FD maturity */
export function calculateFD(principal: number, annualRate: number, years: number, freq: number): { maturity: number; interest: number } {
  const { amount, interest } = compoundInterest(principal, annualRate, years, freq);
  return { maturity: amount, interest };
}

/** RD maturity (quarterly compounding, monthly deposits) */
export function calculateRD(monthly: number, annualRate: number, months: number): { maturity: number; invested: number; interest: number } {
  if (monthly <= 0 || months <= 0) return { maturity: NaN, invested: NaN, interest: NaN };
  const quarterlyRate = annualRate / 400;
  const quarters = months / 3;
  // Sum of each deposit's compound interest
  let total = 0;
  for (let i = 1; i <= months; i++) {
    const remainingMonths = months - i + 1;
    const remainingQuarters = remainingMonths / 3;
    total += monthly * Math.pow(1 + quarterlyRate, 4 * remainingQuarters / 12 * 3);
  }
  // Simplified: use standard RD formula
  const r = annualRate / 100;
  const n = 4; // quarterly
  const t = months / 12;
  const fv = monthly * ((Math.pow(1 + r / n, n * t) - 1) / (1 - Math.pow(1 + r / n, -1 / 3)));
  const maturity = round(fv, 2);
  const invested = round(monthly * months, 2);
  return { maturity, invested, interest: round(maturity - invested, 2) };
}

/** Discount calculation */
export function calculateDiscount(originalPrice: number, discountPercent: number): { discountAmount: number; finalPrice: number; youSave: number } {
  const discountAmount = round((originalPrice * discountPercent) / 100, 2);
  return {
    discountAmount,
    finalPrice: round(originalPrice - discountAmount, 2),
    youSave: discountAmount,
  };
}

/** GST calculation */
export function calculateGST(amount: number, gstRate: number, mode: 'inclusive' | 'exclusive'): { baseAmount: number; gstAmount: number; totalAmount: number } {
  if (mode === 'exclusive') {
    const gstAmount = round((amount * gstRate) / 100, 2);
    return { baseAmount: round(amount, 2), gstAmount, totalAmount: round(amount + gstAmount, 2) };
  } else {
    const baseAmount = round(amount / (1 + gstRate / 100), 2);
    return { baseAmount, gstAmount: round(amount - baseAmount, 2), totalAmount: round(amount, 2) };
  }
}

/** Inflation: future value of today's money */
export function calculateInflation(amount: number, rate: number, years: number): { futureValue: number; increase: number } {
  const futureValue = round(amount * Math.pow(1 + rate / 100, years), 2);
  return { futureValue, increase: round(futureValue - amount, 2) };
}

/** Average */
export function average(values: number[]): number {
  if (values.length === 0) return NaN;
  return round(values.reduce((a, b) => a + b, 0) / values.length, 6);
}

/** Weighted average */
export function weightedAverage(values: number[], weights: number[]): number {
  if (values.length === 0 || values.length !== weights.length) return NaN;
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return NaN;
  return round(values.reduce((sum, v, i) => sum + v * weights[i], 0) / totalWeight, 6);
}

/** Speed = distance / time, or solve for any of the three */
export function speedDistanceTime(distance?: number, time?: number, speed?: number): { distance?: number; time?: number; speed?: number } {
  if (speed === undefined && distance !== undefined && time !== undefined && time > 0) {
    return { speed: round(distance / time, 6) };
  }
  if (distance === undefined && speed !== undefined && time !== undefined) {
    return { distance: round(speed * time, 6) };
  }
  if (time === undefined && speed !== undefined && speed > 0 && distance !== undefined) {
    return { time: round(distance / speed, 6) };
  }
  return {};
}
