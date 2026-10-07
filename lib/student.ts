/**
 * Student and career tool calculations.
 */
import { round } from '@/lib/calc';

export function percentageFromMarks(obtained: number, total: number): number {
  if (total <= 0) return NaN;
  return round((obtained / total) * 100, 2);
}

export function marksFromPercentage(percentage: number, total: number): number {
  return round((percentage / 100) * total, 2);
}

/** Required marks to reach a target percentage */
export function requiredMarks(currentObtained: number, currentTotal: number, remainingTotal: number, targetPercentage: number): number {
  const totalMarks = currentTotal + remainingTotal;
  if (totalMarks <= 0) return NaN;
  const targetTotal = (targetPercentage / 100) * totalMarks;
  return round(targetTotal - currentObtained, 2);
}

/** CGPA from grades — CGPA = sum(gradePoints * credits) / sum(credits) */
export function cgpaCalculator(gradePoints: number[], credits: number[]): number {
  if (gradePoints.length === 0 || gradePoints.length !== credits.length) return NaN;
  const totalCredits = credits.reduce((a, b) => a + b, 0);
  if (totalCredits === 0) return NaN;
  return round(gradePoints.reduce((sum, gp, i) => sum + gp * credits[i], 0) / totalCredits, 2);
}

/** CGPA to percentage — standard formula: percentage = CGPA * 9.5 (used by many Indian universities) */
export function cgpaToPercentage(cgpa: number, multiplier = 9.5): number {
  return round(cgpa * multiplier, 2);
}

/** Percentage to CGPA */
export function percentageToCGPA(percentage: number, multiplier = 9.5): number {
  if (multiplier === 0) return NaN;
  return round(percentage / multiplier, 2);
}

/** GPA from course grades — supports 4.0 scale */
export function gpaCalculator(gradePoints: number[], credits: number[]): number {
  return cgpaCalculator(gradePoints, credits); // same formula, different context
}

/** SGPA — semester GPA (same formula as GPA) */
export function sgpaCalculator(gradePoints: number[], credits: number[]): number {
  return cgpaCalculator(gradePoints, credits);
}

/** Attendance percentage */
export function attendancePercentage(attended: number, total: number): number {
  if (total <= 0) return NaN;
  return round((attended / total) * 100, 2);
}

/** Required attendance to reach a target */
export function requiredAttendance(attended: number, total: number, targetPercentage: number): { classesToAttend: number; bunkable: number } {
  // classes_to_attend = ceil((target% * total - attended) / (100 - target%))
  if (targetPercentage >= 100) {
    return { classesToAttend: total - attended, bunkable: 0 };
  }
  const needed = Math.ceil((targetPercentage * total - 100 * attended) / (100 - targetPercentage));
  if (needed < 0) {
    // Can bunk some classes
    const bunkable = Math.floor((100 * attended - targetPercentage * total) / targetPercentage);
    return { classesToAttend: 0, bunkable: Math.max(0, bunkable) };
  }
  return { classesToAttend: needed, bunkable: 0 };
}

/** Grade from percentage (standard 10-point scale) */
export function gradeFromPercentage(percentage: number): { grade: string; gradePoint: number } {
  if (percentage >= 90) return { grade: 'A+', gradePoint: 10 };
  if (percentage >= 80) return { grade: 'A', gradePoint: 9 };
  if (percentage >= 70) return { grade: 'B+', gradePoint: 8 };
  if (percentage >= 60) return { grade: 'B', gradePoint: 7 };
  if (percentage >= 50) return { grade: 'C', gradePoint: 6 };
  if (percentage >= 40) return { grade: 'D', gradePoint: 5 };
  return { grade: 'F', gradePoint: 0 };
}

/** Salary increment */
export function salaryIncrement(currentSalary: number, incrementPercent: number): { newSalary: number; incrementAmount: number } {
  const incrementAmount = round((currentSalary * incrementPercent) / 100, 2);
  return { newSalary: round(currentSalary + incrementAmount, 2), incrementAmount };
}

/** Salary hike percentage */
export function salaryHikePercentage(oldSalary: number, newSalary: number): number {
  if (oldSalary <= 0) return NaN;
  return round(((newSalary - oldSalary) / oldSalary) * 100, 2);
}

/** Salary comparison */
export function salaryComparison(salaryA: number, salaryB: number): { difference: number; percentDifference: number; higher: string } {
  const difference = round(Math.abs(salaryA - salaryB), 2);
  const avg = (salaryA + salaryB) / 2;
  const percentDifference = avg > 0 ? round((difference / avg) * 100, 2) : NaN;
  return {
    difference,
    percentDifference,
    higher: salaryA > salaryB ? 'Salary A' : salaryB > salaryA ? 'Salary B' : 'Equal',
  };
}

/** Experience calculator — years and months between two dates */
export function experienceCalculator(startDate: Date, endDate: Date): { years: number; months: number; totalMonths: number; totalDays: number } {
  let years = endDate.getUTCFullYear() - startDate.getUTCFullYear();
  let months = endDate.getUTCMonth() - startDate.getUTCMonth();
  let days = endDate.getUTCDate() - startDate.getUTCDate();
  if (days < 0) {
    months--;
    const prevMonth = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 0));
    days += prevMonth.getUTCDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return { years, months, totalMonths: years * 12 + months, totalDays };
}

/** CTC to estimated take-home — simplified, clearly labeled as estimate */
export function ctcToTakeHome(ctc: number, annualDeductions = 0): { monthlyTakeHome: number; totalDeductions: number; monthlyGross: number } {
  const totalDeductions = round(annualDeductions, 2);
  const annualTakeHome = round(ctc - totalDeductions, 2);
  return {
    monthlyTakeHome: round(annualTakeHome / 12, 2),
    totalDeductions,
    monthlyGross: round(ctc / 12, 2),
  };
}

export function noticePeriodEnd(startDate: Date, noticeDays: number): Date {
  return new Date(Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate() + noticeDays
  ));
}

/** Leave calculator — leave balance from total, taken, and planned */
export function leaveBalance(totalLeave: number, takenLeave: number, plannedLeave: number): { remaining: number; available: number } {
  return {
    remaining: round(totalLeave - takenLeave - plannedLeave, 2),
    available: round(totalLeave - takenLeave, 2),
  };
}
