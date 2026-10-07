/**
 * Direct sponsorship / direct ad configuration.
 * Stored locally in configuration. A future backend could replace this without changing the component API.
 */

export interface SponsorPlacement {
  sponsorId: string;
  placement: string;
  image: string | null;
  title: string;
  description: string;
  cta: string;
  destinationUrl: string;
  startDate: string;
  endDate: string;
  active: boolean;
  targetRegions: string[];
}

export const sponsors: SponsorPlacement[] = [
  // Entries are empty by default. Add real sponsor configurations here.
];

/** Get active sponsor placements for a given placement position */
export function getSponsorByPlacement(placement: string, region = 'GLOBAL'): SponsorPlacement | null {
  const now = new Date();
  return (
    sponsors.find((s) => {
      if (!s.active) return false;
      if (s.placement !== placement) return false;
      if (!s.targetRegions.includes(region) && !s.targetRegions.includes('GLOBAL')) return false;
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      return now >= start && now <= end;
    }) || null
  );
}
