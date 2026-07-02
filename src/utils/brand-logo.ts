import { brandToSlug } from '@/utils/comparison';

const STATIC_LOGOS: Record<string, string> = {
  playtime: '/logos/playtime.svg',
  bingoplus: '/logos/bingoplus.svg',
  bet88: '/logos/bet88.svg',
  okbet: '/logos/okbet.svg',
  nustar: '/logos/nustar.svg',
  nustaronline: '/logos/nustar.svg',
};

function hashHue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

/** 从品牌名提取 2–3 位缩写，如 PlayTime→PT、Peso88→P88 */
export function getBrandInitials(brand: string): string {
  const parts = brand.split(/(?=[A-Z])|[\s-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return parts
      .map((p) => p.replace(/[^a-zA-Z0-9]/g, '')[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 3);
  }

  const alnum = brand.replace(/[^a-zA-Z0-9]/g, '');
  if (alnum.length <= 3) return alnum.toUpperCase();
  return (alnum[0]! + alnum.slice(-2)).toUpperCase();
}

function buildPlaceholderSvg(brand: string): string {
  const initials = getBrandInitials(brand);
  const hue = hashHue(brand);
  const fontSize = initials.length >= 3 ? 11 : initials.length === 2 ? 13 : 14;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="8" fill="#1a2332"/><text x="24" y="30" text-anchor="middle" fill="hsl(${hue}, 68%, 58%)" font-size="${fontSize}" font-weight="bold" font-family="system-ui,sans-serif">${initials}</text></svg>`;
}

/** 返回品牌 Logo URL：优先静态文件，否则内联 SVG 占位（永不裂图） */
export function getBrandLogoUrl(brand: string): string {
  const slug = brandToSlug(brand);
  const staticPath = STATIC_LOGOS[slug];
  if (staticPath) return staticPath;

  return `data:image/svg+xml,${encodeURIComponent(buildPlaceholderSvg(brand))}`;
}
