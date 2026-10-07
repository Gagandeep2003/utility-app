/**
 * Centralized affiliate registry.
 * Each entry defines a product/service with tracking URL, disclosure requirements, and placement.
 * Affiliate links are NOT automatically placed on every page — only where topically relevant.
 */

export interface AffiliateItem {
  id: string;
  merchant: string;
  name: string;
  category: string;
  description: string;
  url: string;
  trackingUrl: string;
  disclosureRequired: boolean;
  regions: string[];
  active: boolean;
  placement: string;
  priority: number;
}

export const affiliates: AffiliateItem[] = [
  // Entries are empty by default. Add real affiliate partnerships here.
  // Only include genuine partnerships. Do not create fake affiliate links.
];

/** Get active affiliates by category */
export function getAffiliatesByCategory(category: string): AffiliateItem[] {
  return affiliates
    .filter((a) => a.active && a.category === category)
    .sort((a, b) => b.priority - a.priority);
}

/** Get all active affiliates for a region */
export function getActiveAffiliates(region = 'GLOBAL'): AffiliateItem[] {
  return affiliates
    .filter((a) => a.active && (a.regions.includes(region) || a.regions.includes('GLOBAL')))
    .sort((a, b) => b.priority - a.priority);
}

/** Check if any affiliates require disclosure */
export function hasDisclosureRequired(): boolean {
  return affiliates.some((a) => a.active && a.disclosureRequired);
}
