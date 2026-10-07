/**
 * Centralized monetization configuration.
 * All monetization features are disabled by default and enabled via environment variables.
 * The site works fully with all monetization disabled.
 */

export interface MonetizationConfig {
  ads: {
    enabled: boolean;
    adsense: {
      enabled: boolean;
      client: string | null;
    };
    directAds: {
      enabled: boolean;
    };
  };
  affiliates: {
    enabled: boolean;
  };
  analytics: {
    enabled: boolean;
    provider: 'plausible' | 'ga4' | 'none';
    domain: string | null;
    measurementId: string | null;
  };
  sponsors: {
    enabled: boolean;
  };
}

function bool(val: string | undefined): boolean {
  if (!val) return false;
  return val === 'true' || val === '1' || val === 'yes';
}

export function getMonetizationConfig(): MonetizationConfig {
  return {
    ads: {
      enabled: bool(process.env.ADS_ENABLED),
      adsense: {
        enabled: bool(process.env.ADSENSE_ENABLED) && !!process.env.ADSENSE_CLIENT,
        client: process.env.ADSENSE_CLIENT || null,
      },
      directAds: {
        enabled: bool(process.env.DIRECT_ADS_ENABLED),
      },
    },
    affiliates: {
      enabled: bool(process.env.AFFILIATES_ENABLED),
    },
    analytics: {
      enabled: bool(process.env.ANALYTICS_ENABLED) && !!process.env.ANALYTICS_PROVIDER,
      provider: (process.env.ANALYTICS_PROVIDER as 'plausible' | 'ga4' | 'none') || 'none',
      domain: process.env.ANALYTICS_DOMAIN || null,
      measurementId: process.env.ANALYTICS_MEASUREMENT_ID || null,
    },
    sponsors: {
      enabled: bool(process.env.DIRECT_ADS_ENABLED),
    },
  };
}

/** Check if ads are enabled for a specific placement */
export function isAdPlacementEnabled(_placement: string): boolean {
  const config = getMonetizationConfig();
  return config.ads.enabled && (config.ads.adsense.enabled || config.ads.directAds.enabled);
}

/** Whether to show dev placeholders */
export function isDevPlaceholderMode(): boolean {
  return process.env.NODE_ENV === 'development' && process.env.SHOW_AD_PLACEHOLDERS === 'true';
}
