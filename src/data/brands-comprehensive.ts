import type { BrandProfile } from '@/types/brand';
import { brandToSlug } from '@/utils/comparison';
import comprehensive from '../../docs/phi_brands_comprehensive.json';

export function getBrandByName(name: string): BrandProfile | undefined {
  return (comprehensive.brands as BrandProfile[]).find((b) => b.brand === name);
}

export function getAllBrands(): BrandProfile[] {
  return comprehensive.brands as BrandProfile[];
}

export interface BrandOption {
  name: string;
  slug: string;
  /** Index in the source array, used to build a route-matching slug (lower index first). */
  index: number;
}

export function getBrandOptions(): BrandOption[] {
  return (comprehensive.brands as BrandProfile[]).map((b, index) => ({
    name: b.brand,
    slug: brandToSlug(b.brand),
    index,
  }));
}

export const comprehensiveMeta = {
  generatedAt: comprehensive.generated_at,
  description: comprehensive.description,
};
