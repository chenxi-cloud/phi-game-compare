import type { BrandProfile } from '@/types/brand';
import { brandToSlug } from '@/utils/comparison';
import targetSite from '../../docs/target_site.json';

export function getTargetSite(): BrandProfile {
  return targetSite as BrandProfile;
}

export const targetSlug = brandToSlug((targetSite as BrandProfile).brand);

/**
 * rel value for an outbound site link.
 * Competitor links get `nofollow sponsored` (no PageRank leak + gambling/affiliate
 * disclosure required by Google). Our own promoted target keeps `sponsored` (affiliate
 * disclosure) but drops `nofollow` so it stays the preferred money link.
 */
export function outboundRel(brand: BrandProfile): string {
  return brand.is_target
    ? 'sponsored noopener'
    : 'nofollow sponsored noopener noreferrer';
}

/**
 * Cloaked internal href for an outbound site link. Hides the affiliate tail,
 * lets us track clicks, and keeps the real URL off the rendered page. The
 * `/out/{slug}` route redirects to the real destination and is blocked in robots.txt.
 */
export function outboundHref(brand: BrandProfile): string {
  return `/out/${brandToSlug(brand.brand)}/`;
}
