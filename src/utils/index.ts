export function buildReportUrl(siteSlugs: string[]): string {
  const slug = [...siteSlugs].sort().join('-vs-');
  return `/reports/${slug}/`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
