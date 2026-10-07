/**
 * Analytics abstraction layer.
 * Track anonymous events without collecting sensitive calculator input values.
 * Analytics are disabled when no provider is configured.
 */

export type AnalyticsEvent =
  | 'page_view'
  | 'tool_view'
  | 'tool_calculation'
  | 'tool_result_copy'
  | 'tool_search'
  | 'category_view'
  | 'affiliate_click'
  | 'sponsor_click'
  | 'ad_impression';

export interface AnalyticsProperties {
  toolId?: string;
  category?: string;
  query?: string;
  resultCount?: number;
  affiliateId?: string;
  sponsorId?: string;
  placement?: string;
  [key: string]: string | number | undefined;
}

class Analytics {
  private enabled: boolean;
  private provider: string;

  constructor() {
    this.enabled = process.env.ANALYTICS_ENABLED === 'true' && !!process.env.ANALYTICS_PROVIDER;
    this.provider = process.env.ANALYTICS_PROVIDER || 'none';
  }

  /** Track an anonymous event. Never include calculator input values. */
  track(event: AnalyticsEvent, properties: AnalyticsProperties = {}): void {
    if (!this.enabled) return;

    // For GA4, use gtag if available
    if (this.provider === 'ga4' && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, properties);
    }

    // For Plausible, use plausible if available
    if (this.provider === 'plausible' && typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(event, { props: properties });
    }
  }

  /** Track a tool view */
  trackToolView(toolId: string, category: string): void {
    this.track('tool_view', { toolId, category });
  }

  /** Track a calculation (no input values sent) */
  trackCalculation(toolId: string): void {
    this.track('tool_calculation', { toolId });
  }

  /** Track a result copy */
  trackResultCopy(toolId: string): void {
    this.track('tool_result_copy', { toolId });
  }

  /** Track a search (no query content, just that a search happened) */
  trackSearch(resultCount: number): void {
    this.track('tool_search', { resultCount });
  }

  /** Track an affiliate click */
  trackAffiliateClick(affiliateId: string, placement: string): void {
    this.track('affiliate_click', { affiliateId, placement });
  }
}

export const analytics = new Analytics();
