/**
 * Date utility functions that avoid timezone bugs.
 * All date-only calculations work in UTC midnight to avoid DST issues.
 */

/** Create a UTC date at midnight for a YYYY-MM-DD string */
export function parseDate(input: string): Date | null {
  if (!input || typeof input !== 'string') return null;
  const parts = input.split('-');
  if (parts.length !== 3) return null;
  const [year, month, day] = parts.map(Number);
  if (!year || !month || !day) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  const d = new Date(Date.UTC(year, month - 1, day));
  // Check for overflow (e.g., Feb 30 → Mar 2)
  if (d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) return null;
  return d;
}

/** Format a Date as YYYY-MM-DD */
export function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Format a date in human-readable form */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Calculate age from birth date to a reference date */
export function calculateAge(birthDate: Date, refDate: Date): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
} {
  let years = refDate.getUTCFullYear() - birthDate.getUTCFullYear();
  let months = refDate.getUTCMonth() - birthDate.getUTCMonth();
  let days = refDate.getUTCDate() - birthDate.getUTCDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(Date.UTC(refDate.getUTCFullYear(), refDate.getUTCMonth(), 0));
    days += prevMonth.getUTCDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMs = refDate.getTime() - birthDate.getTime();
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  return { years, months, days, totalDays, totalWeeks, totalMonths };
}

/** Days between two dates (inclusive/exclusive based on flag) */
export function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/** Add days to a date */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

/** Add or subtract months from a date, clamping the day to month end */
export function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const targetMonth = d.getUTCMonth() + months;
  d.setUTCMonth(targetMonth);
  // If the day overflowed (e.g., Jan 31 + 1 month = Feb 31 → Mar 3), clamp
  if (d.getUTCDate() !== date.getUTCDate()) {
    d.setUTCDate(0); // Go to last day of previous month
  }
  return d;
}

/** Add or subtract years from a date */
export function addYears(date: Date, years: number): Date {
  const d = new Date(date.getTime());
  d.setUTCFullYear(d.getUTCFullYear() + years);
  // Handle Feb 29 → Feb 28 on non-leap years
  if (d.getUTCMonth() !== date.getUTCMonth()) {
    d.setUTCDate(0);
  }
  return d;
}

/** Check if a year is a leap year */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Count working days (Mon-Fri) between two dates, excluding holidays */
export function workingDays(start: Date, end: Date, holidays: Date[] = []): number {
  if (start > end) {
    [start, end] = [end, start];
  }
  let count = 0;
  const holidaySet = new Set(holidays.map(formatDate));
  const current = new Date(start.getTime());
  while (current <= end) {
    const dow = current.getUTCDay();
    if (dow !== 0 && dow !== 6 && !holidaySet.has(formatDate(current))) {
      count++;
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return count;
}

/** Get day of week name */
export function dayOfWeek(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
}

/** Next occurrence of a target date (month/day) from the reference date */
export function nextOccurrence(targetMonth: number, targetDay: number, refDate: Date): Date {
  let year = refDate.getUTCFullYear();
  let candidate = new Date(Date.UTC(year, targetMonth - 1, targetDay));
  if (candidate < refDate) {
    candidate = new Date(Date.UTC(year + 1, targetMonth - 1, targetDay));
  }
  return candidate;
}
