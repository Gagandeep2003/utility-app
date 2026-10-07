/**
 * Developer tool calculations: JSON, Base64, URL, UUID, JWT, regex, colors.
 * All processed locally — no external calls.
 */

/** Format/pretty-print JSON */
export function formatJSON(input: string, indent = 2): { result: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed, null, indent) };
  } catch (e) {
    return { result: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

/** Minify JSON */
export function minifyJSON(input: string): { result: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed) };
  } catch (e) {
    return { result: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

/** Validate JSON */
export function validateJSON(input: string): { valid: boolean; error?: string; position?: { line: number; column: number } } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid JSON';
    // Try to extract position from error message
    const posMatch = message.match(/position (\d+)/);
    let position;
    if (posMatch) {
      const pos = parseInt(posMatch[1]);
      const before = input.substring(0, pos);
      const lines = before.split('\n');
      position = { line: lines.length, column: lines[lines.length - 1].length + 1 };
    }
    return { valid: false, error: message, position };
  }
}

/** Base64 encode (handles Unicode) */
export function base64Encode(input: string): string {
  try {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    return btoa(binary);
  } catch {
    return '';
  }
}

/** Base64 decode (handles Unicode) */
export function base64Decode(input: string): { result: string; error?: string } {
  try {
    const binary = atob(input.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return { result: new TextDecoder().decode(bytes) };
  } catch {
    return { result: '', error: 'Invalid Base64 string' };
  }
}

/** URL encode */
export function urlEncode(input: string): string {
  try {
    return encodeURIComponent(input);
  } catch {
    return '';
  }
}

/** URL decode */
export function urlDecode(input: string): { result: string; error?: string } {
  try {
    return { result: decodeURIComponent(input) };
  } catch {
    return { result: '', error: 'Invalid URL-encoded string' };
  }
}

/** Generate a UUID v4 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Generate multiple UUIDs */
export function generateUUIDs(count: number, uppercase = false): string[] {
  const uuids: string[] = [];
  for (let i = 0; i < Math.min(count, 1000); i++) {
    const uuid = generateUUID();
    uuids.push(uppercase ? uuid.toUpperCase() : uuid);
  }
  return uuids;
}

/** Decode a JWT (header + payload only, no signature verification) */
export function decodeJWT(token: string): { header: string; payload: string; error?: string } {
  try {
    const parts = token.trim().split('.');
    if (parts.length < 2 || parts.length > 3) {
      return { header: '', payload: '', error: 'Invalid JWT format. Expected 3 parts separated by dots.' };
    }
    const decode = (part: string): string => {
      // Restore padding
      let padded = part.replace(/-/g, '+').replace(/_/g, '/');
      while (padded.length % 4) { padded += '='; }
      const binary = atob(padded);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    };
    const header = JSON.stringify(JSON.parse(decode(parts[0])), null, 2);
    const payload = JSON.stringify(JSON.parse(decode(parts[1])), null, 2);
    return { header, payload };
  } catch (e) {
    return { header: '', payload: '', error: 'Could not decode JWT: ' + (e instanceof Error ? e.message : 'unknown error') };
  }
}

/** Test a regex against input text */
export function testRegex(pattern: string, flags: string, testString: string): {
  matches: { match: string; index: number; groups: string[] }[];
  error?: string;
} {
  try {
    const re = new RegExp(pattern, flags);
    const matches: { match: string; index: number; groups: string[] }[] = [];
    if (flags.includes('g')) {
      let m: RegExpExecArray | null;
      while ((m = re.exec(testString)) !== null) {
        matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    } else {
      const m = re.exec(testString);
      if (m) {
        matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
    }
    return { matches };
  } catch (e) {
    return { matches: [], error: e instanceof Error ? e.message : 'Invalid regex' };
  }
}

/** Convert HEX to RGB */
export function hexToRgb(hex: string): { r: number; g: number; b: number; error?: string } {
  const cleaned = hex.replace(/^#/, '').trim();
  const match = cleaned.match(/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!match) return { r: 0, g: 0, b: 0, error: 'Invalid HEX color. Use #FFF or #FFFFFF format.' };
  let full = cleaned;
  if (cleaned.length === 3) {
    full = cleaned.split('').map((c) => c + c).join('');
  }
  return {
    r: parseInt(full.substring(0, 2), 16),
    g: parseInt(full.substring(2, 4), 16),
    b: parseInt(full.substring(4, 6), 16),
  };
}

/** Convert RGB to HEX */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/** RGB to HSL */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** HSL to RGB */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

/** Unix timestamp to date and vice versa */
export function unixToDate(timestamp: number): Date {
  // Check if seconds or milliseconds
  if (timestamp < 1e12) {
    return new Date(timestamp * 1000);
  }
  return new Date(timestamp);
}

export function dateToUnix(date: Date, unit: 'seconds' | 'milliseconds' = 'seconds'): number {
  const ms = date.getTime();
  return unit === 'seconds' ? Math.floor(ms / 1000) : ms;
}

/** HTML formatter — simple indentation */
export function formatHTML(input: string): { result: string; error?: string } {
  try {
    let formatted = '';
    let indent = 0;
    const tokens = input.replace(/>\s*</g, '><').replace(/></g, '>\n<').split('\n');
    for (const token of tokens) {
      const trimmed = token.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('</')) {
        indent = Math.max(0, indent - 1);
      }
      formatted += '  '.repeat(indent) + trimmed + '\n';
      if (
        trimmed.startsWith('<') &&
        !trimmed.startsWith('</') &&
        !trimmed.startsWith('<!') &&
        !trimmed.endsWith('/>') &&
        !trimmed.includes('</') &&
        !trimmed.match(/<(img|br|hr|input|meta|link|source|area|base|col|embed|param|track|wbr)[\s>]/i)
      ) {
        indent++;
      }
    }
    return { result: formatted.trim() };
  } catch (e) {
    return { result: '', error: e instanceof Error ? e.message : 'Could not format HTML' };
  }
}

/** CSS formatter — simple indentation */
export function formatCSS(input: string): { result: string; error?: string } {
  try {
    let formatted = '';
    let indent = 0;
    const cleaned = input.replace(/\s*{\s*/g, ' {\n').replace(/;\s*/g, ';\n').replace(/\s*}\s*/g, '\n}\n').replace(/,\s*/g, ', ');
    const lines = cleaned.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed === '}') {
        indent = Math.max(0, indent - 1);
        formatted += '  '.repeat(indent) + '}\n';
      } else if (trimmed.endsWith('{')) {
        formatted += '  '.repeat(indent) + trimmed + '\n';
        indent++;
      } else {
        formatted += '  '.repeat(indent) + trimmed + '\n';
      }
    }
    return { result: formatted.trim() };
  } catch (e) {
    return { result: '', error: e instanceof Error ? e.message : 'Could not format CSS' };
  }
}

/** Text utilities */
export function textStats(input: string): {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
} {
  const characters = input.length;
  const charactersNoSpaces = input.replace(/\s/g, '').length;
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  const sentences = input.trim() ? (input.match(/[.!?]+/g) || []).length || (words > 0 ? 1 : 0) : 0;
  const paragraphs = input.trim() ? input.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const lines = input.split('\n').length;
  return { characters, charactersNoSpaces, words, sentences, paragraphs, lines };
}

export function caseTransform(input: string, mode: string): string {
  switch (mode) {
    case 'upper': return input.toUpperCase();
    case 'lower': return input.toLowerCase();
    case 'title': return input.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());
    case 'sentence': return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    case 'camel': return input.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toLowerCase());
    case 'pascal': return input.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase());
    case 'snake': return input.trim().replace(/\s+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    case 'kebab': return input.trim().replace(/\s+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    default: return input;
  }
}

/** QR code generation using built-in approach — generates a data URL via simple QR encoding */
export function generateQRDataURL(text: string, size = 200): string {
  // Use Google Charts API as fallback — but we said no external service
  // Instead, return the text for a client-side QR library to render
  // This is a placeholder — actual QR rendering happens client-side via canvas
  return text;
}
