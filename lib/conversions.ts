/**
 * Centralized unit conversion registry.
 * Each category has a base unit and all conversions go through the base unit.
 * Never duplicate conversion factors across pages.
 */

export interface UnitDef {
  id: string;
  label: string;
  /** Factor to convert from this unit to the base unit: baseValue = value * toBase */
  toBase: number;
}

export interface ConversionCategory {
  id: string;
  label: string;
  baseUnit: string;
  units: UnitDef[];
}

export const conversionRegistry: Record<string, ConversionCategory> = {
  length: {
    id: 'length',
    label: 'Length',
    baseUnit: 'm',
    units: [
      { id: 'mm', label: 'Millimeter (mm)', toBase: 0.001 },
      { id: 'cm', label: 'Centimeter (cm)', toBase: 0.01 },
      { id: 'm', label: 'Meter (m)', toBase: 1 },
      { id: 'km', label: 'Kilometer (km)', toBase: 1000 },
      { id: 'in', label: 'Inch (in)', toBase: 0.0254 },
      { id: 'ft', label: 'Foot (ft)', toBase: 0.3048 },
      { id: 'yd', label: 'Yard (yd)', toBase: 0.9144 },
      { id: 'mi', label: 'Mile (mi)', toBase: 1609.344 },
      { id: 'nmi', label: 'Nautical Mile (nmi)', toBase: 1852 },
    ],
  },
  weight: {
    id: 'weight',
    label: 'Weight',
    baseUnit: 'kg',
    units: [
      { id: 'mg', label: 'Milligram (mg)', toBase: 0.000001 },
      { id: 'g', label: 'Gram (g)', toBase: 0.001 },
      { id: 'kg', label: 'Kilogram (kg)', toBase: 1 },
      { id: 't', label: 'Tonne (t)', toBase: 1000 },
      { id: 'oz', label: 'Ounce (oz)', toBase: 0.028349523125 },
      { id: 'lb', label: 'Pound (lb)', toBase: 0.45359237 },
      { id: 'st', label: 'Stone (st)', toBase: 6.35029318 },
    ],
  },
  temperature: {
    id: 'temperature',
    label: 'Temperature',
    baseUnit: 'C',
    // Special handling: temperature is not a simple multiplication
    units: [
      { id: 'C', label: 'Celsius (°C)', toBase: 1 },
      { id: 'F', label: 'Fahrenheit (°F)', toBase: 1 },
      { id: 'K', label: 'Kelvin (K)', toBase: 1 },
    ],
  },
  area: {
    id: 'area',
    label: 'Area',
    baseUnit: 'm2',
    units: [
      { id: 'mm2', label: 'Square Millimeter (mm²)', toBase: 0.000001 },
      { id: 'cm2', label: 'Square Centimeter (cm²)', toBase: 0.0001 },
      { id: 'm2', label: 'Square Meter (m²)', toBase: 1 },
      { id: 'km2', label: 'Square Kilometer (km²)', toBase: 1000000 },
      { id: 'ha', label: 'Hectare (ha)', toBase: 10000 },
      { id: 'ac', label: 'Acre (ac)', toBase: 4046.8564224 },
      { id: 'ft2', label: 'Square Foot (ft²)', toBase: 0.09290304 },
      { id: 'in2', label: 'Square Inch (in²)', toBase: 0.00064516 },
      { id: 'yd2', label: 'Square Yard (yd²)', toBase: 0.83612736 },
      { id: 'mi2', label: 'Square Mile (mi²)', toBase: 2589988.110336 },
    ],
  },
  volume: {
    id: 'volume',
    label: 'Volume',
    baseUnit: 'L',
    units: [
      { id: 'ml', label: 'Milliliter (ml)', toBase: 0.001 },
      { id: 'L', label: 'Liter (L)', toBase: 1 },
      { id: 'm3', label: 'Cubic Meter (m³)', toBase: 1000 },
      { id: 'cm3', label: 'Cubic Centimeter (cm³)', toBase: 0.001 },
      { id: 'in3', label: 'Cubic Inch (in³)', toBase: 0.016387064 },
      { id: 'ft3', label: 'Cubic Foot (ft³)', toBase: 28.316846592 },
      { id: 'gal_us', label: 'US Gallon', toBase: 3.785411784 },
      { id: 'gal_uk', label: 'UK Gallon', toBase: 4.54609 },
      { id: 'qt_us', label: 'US Quart', toBase: 0.946352946 },
      { id: 'pt_us', label: 'US Pint', toBase: 0.473176473 },
      { id: 'cup_us', label: 'US Cup', toBase: 0.2365882365 },
      { id: 'floz_us', label: 'US Fluid Ounce', toBase: 0.0295735295625 },
    ],
  },
  speed: {
    id: 'speed',
    label: 'Speed',
    baseUnit: 'mps',
    units: [
      { id: 'mps', label: 'Meter/second (m/s)', toBase: 1 },
      { id: 'kmh', label: 'Kilometer/hour (km/h)', toBase: 0.277777778 },
      { id: 'mph', label: 'Mile/hour (mph)', toBase: 0.44704 },
      { id: 'fps', label: 'Foot/second (ft/s)', toBase: 0.3048 },
      { id: 'knot', label: 'Knot', toBase: 0.514444444 },
    ],
  },
  fuel: {
    id: 'fuel',
    label: 'Fuel Economy',
    baseUnit: 'km/L',
    units: [
      { id: 'km/L', label: 'Kilometers/Liter (km/L)', toBase: 1 },
      { id: 'mpg_us', label: 'Miles/Gallon US (mpg)', toBase: 0.425143707 },
      { id: 'mpg_uk', label: 'Miles/Gallon UK (mpg)', toBase: 0.35400604 },
      { id: 'L/100km', label: 'Liters/100km', toBase: 1 },
    ],
  },
  time: {
    id: 'time',
    label: 'Time',
    baseUnit: 's',
    units: [
      { id: 'ms', label: 'Millisecond (ms)', toBase: 0.001 },
      { id: 's', label: 'Second (s)', toBase: 1 },
      { id: 'min', label: 'Minute (min)', toBase: 60 },
      { id: 'h', label: 'Hour (h)', toBase: 3600 },
      { id: 'day', label: 'Day (d)', toBase: 86400 },
      { id: 'week', label: 'Week (wk)', toBase: 604800 },
      { id: 'month', label: 'Month (avg)', toBase: 2629800 },
      { id: 'year', label: 'Year (yr)', toBase: 31557600 },
    ],
  },
  data: {
    id: 'data',
    label: 'Data Size',
    baseUnit: 'B',
    units: [
      { id: 'b', label: 'Bit (b)', toBase: 0.125 },
      { id: 'B', label: 'Byte (B)', toBase: 1 },
      { id: 'KB', label: 'Kilobyte (KB)', toBase: 1024 },
      { id: 'MB', label: 'Megabyte (MB)', toBase: 1048576 },
      { id: 'GB', label: 'Gigabyte (GB)', toBase: 1073741824 },
      { id: 'TB', label: 'Terabyte (TB)', toBase: 1099511627776 },
    ],
  },
};

/** Convert a value from one unit to another within a category */
export function convert(value: number, categoryId: string, fromUnit: string, toUnit: string): number {
  const cat = conversionRegistry[categoryId];
  if (!cat) return NaN;

  if (categoryId === 'temperature') {
    return convertTemperature(value, fromUnit, toUnit);
  }

  if (categoryId === 'fuel') {
    return convertFuel(value, fromUnit, toUnit);
  }

  const fromDef = cat.units.find((u) => u.id === fromUnit);
  const toDef = cat.units.find((u) => u.id === toUnit);
  if (!fromDef || !toDef) return NaN;

  const baseValue = value * fromDef.toBase;
  return baseValue / toDef.toBase;
}

function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  switch (from) {
    case 'C': celsius = value; break;
    case 'F': celsius = (value - 32) * 5 / 9; break;
    case 'K': celsius = value - 273.15; break;
    default: return NaN;
  }
  switch (to) {
    case 'C': return celsius;
    case 'F': return celsius * 9 / 5 + 32;
    case 'K': return celsius + 273.15;
    default: return NaN;
  }
}

/** Fuel economy has inverse units (L/100km vs km/L) */
function convertFuel(value: number, from: string, to: string): number {
  if (from === to) return value;
  // First convert to km/L
  let kmPerL: number;
  switch (from) {
    case 'km/L': kmPerL = value; break;
    case 'mpg_us': kmPerL = value * 0.425143707; break;
    case 'mpg_uk': kmPerL = value * 0.35400604; break;
    case 'L/100km': kmPerL = value > 0 ? 100 / value : 0; break;
    default: return NaN;
  }
  switch (to) {
    case 'km/L': return kmPerL;
    case 'mpg_us': return kmPerL / 0.425143707;
    case 'mpg_uk': return kmPerL / 0.35400604;
    case 'L/100km': return kmPerL > 0 ? 100 / kmPerL : 0;
    default: return NaN;
  }
}

/** Get all categories */
export function getCategories(): ConversionCategory[] {
  return Object.values(conversionRegistry);
}

/** Get units for a category */
export function getUnits(categoryId: string): UnitDef[] {
  return conversionRegistry[categoryId]?.units ?? [];
}
