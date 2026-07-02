import type {
  BrandComparison,
  BrandProfile,
  CompareModule,
  CompareRow,
  CompareSide,
} from '@/types/brand';

const WITHDRAWAL_BY_TIER: Record<number, { label: string; detail: string }> = {
  1: { label: 'Fast', detail: 'Within 1 hour' },
  2: { label: 'Medium', detail: 'Within 4 hours' },
  3: { label: 'Slow', detail: 'Over 4 hours' },
};

export function brandToSlug(brand: string): string {
  return brand.toLowerCase().replace(/\s+/g, '');
}

export function formatVolume(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '0';
  return n.toLocaleString('en-US');
}

function pickWinner(
  a: number,
  b: number,
  higherIsBetter = true,
): CompareSide {
  if (a === b) return 'tie';
  if (higherIsBetter) return a > b ? 'a' : 'b';
  return a < b ? 'a' : 'b';
}

function winnerName(winner: CompareSide, brandA: BrandProfile, brandB: BrandProfile): string | undefined {
  if (winner === 'a') return brandA.brand;
  if (winner === 'b') return brandB.brand;
  return undefined;
}

function buildWithdrawalModule(brandA: BrandProfile, brandB: BrandProfile): CompareModule {
  const wA = WITHDRAWAL_BY_TIER[brandA.tier];
  const wB = WITHDRAWAL_BY_TIER[brandB.tier];
  const winner = pickWinner(brandA.tier, brandB.tier, false);

  const rows: CompareRow[] = [
    { label: 'Platform Tier', valueA: `Tier ${brandA.tier}`, valueB: `Tier ${brandB.tier}`, winner: 'tie' },
    { label: 'Withdrawal Speed', valueA: wA.label, valueB: wB.label, winner },
    { label: 'Estimated Arrival', valueA: wA.detail, valueB: wB.detail, winner },
  ];

  return { id: 'withdrawal', title: 'Withdrawal Speed', rows, summary: '', winner, winnerName: winnerName(winner, brandA, brandB) };
}

function buildCustomerServiceModule(brandA: BrandProfile, brandB: BrandProfile): CompareModule {
  const csA = brandA.customer_service;
  const csB = brandB.customer_service;
  const winner = pickWinner(csA.overall_score, csB.overall_score);

  const rows: CompareRow[] = [
    { label: 'Customer Satisfaction', valueA: `${csA.satisfaction_score} / 5`, valueB: `${csB.satisfaction_score} / 5`, winner: pickWinner(csA.satisfaction_score, csB.satisfaction_score) },
    { label: 'Response Speed', valueA: csA.response_speed, valueB: csB.response_speed, winner: pickWinner(csA.response_speed_score, csB.response_speed_score) },
    { label: 'Overall CS Score', valueA: `${csA.overall_score} / 8`, valueB: `${csB.overall_score} / 8`, winner },
  ];

  return { id: 'customer-service', title: 'Customer Support', rows, summary: '', winner, winnerName: winnerName(winner, brandA, brandB) };
}

function buildPopularityModule(brandA: BrandProfile, brandB: BrandProfile): CompareModule {
  const volA = brandA.avg_search_volume_last_2_months ?? 0;
  const volB = brandB.avg_search_volume_last_2_months ?? 0;
  const searchA = brandA.search_volume ?? 0;
  const searchB = brandB.search_volume ?? 0;

  const winner = pickWinner(volA, volB);

  const rows: CompareRow[] = [
    { label: 'Heat Index', valueA: formatVolume(volA), valueB: formatVolume(volB), winner },
    { label: 'Recent Activity Index', valueA: formatVolume(searchA), valueB: formatVolume(searchB), winner: pickWinner(searchA, searchB) },
  ];

  return { id: 'popularity', title: 'Brand Popularity', rows, summary: '', winner, winnerName: winnerName(winner, brandA, brandB) };
}

function buildPerformanceModule(brandA: BrandProfile, brandB: BrandProfile): CompareModule {
  const pA = brandA.performance;
  const pB = brandB.performance;

  const fcpWinner = pickWinner(pA.fcp_seconds, pB.fcp_seconds, false);
  const dnsWinner = pickWinner(pA.dns_anti_hijacking_percent, pB.dns_anti_hijacking_percent);
  const fpsWinner = pickWinner(pA.ui_fps, pB.ui_fps);

  const rows: CompareRow[] = [
    { label: 'First Contentful Paint (FCP)', valueA: `${pA.fcp_seconds}s`, valueB: `${pB.fcp_seconds}s`, winner: fcpWinner },
    { label: 'DNS Anti-Hijacking Rate', valueA: `${pA.dns_anti_hijacking_percent}%`, valueB: `${pB.dns_anti_hijacking_percent}%`, winner: dnsWinner },
    { label: 'UI Frame Rate', valueA: `${pA.ui_fps} FPS`, valueB: `${pB.ui_fps} FPS`, winner: fpsWinner },
  ];

  const scoreA = (fcpWinner === 'a' ? 1 : 0) + (dnsWinner === 'a' ? 1 : 0) + (fpsWinner === 'a' ? 1 : 0);
  const scoreB = (fcpWinner === 'b' ? 1 : 0) + (dnsWinner === 'b' ? 1 : 0) + (fpsWinner === 'b' ? 1 : 0);
  const winner = scoreA === scoreB ? 'tie' : scoreA > scoreB ? 'a' : 'b';

  return { id: 'performance', title: 'Website Performance', rows, summary: '', winner, winnerName: winnerName(winner, brandA, brandB) };
}

function gameTypeSummary(games: BrandProfile['hot_games']): string {
  const types = [...new Set(games.map((g) => g.game_type))];
  return types.join(', ');
}

function buildGamesModule(brandA: BrandProfile, brandB: BrandProfile): CompareModule {
  const richnessWinner: CompareSide =
    brandA.game_richness === brandB.game_richness
      ? 'tie'
      : brandA.game_richness === 'High'
        ? 'a'
        : brandB.game_richness === 'High'
          ? 'b'
          : brandA.game_richness === 'Medium' && brandB.game_richness === 'Low'
            ? 'a'
            : 'b';

  const typesA = gameTypeSummary(brandA.hot_games);
  const typesB = gameTypeSummary(brandB.hot_games);

  const rows: CompareRow[] = [
    { label: 'Game Variety', valueA: brandA.game_richness, valueB: brandB.game_richness, winner: richnessWinner },
    { label: 'Hot Game Categories', valueA: typesA, valueB: typesB },
    ...brandA.hot_games.map((g, i) => ({
      label: `Hot #${i + 1}`,
      valueA: `[${g.game_type}] ${g.game_name} (${g.vendor})`,
      valueB: `[${brandB.hot_games[i]?.game_type ?? '-'}] ${brandB.hot_games[i]?.game_name ?? '-'} (${brandB.hot_games[i]?.vendor ?? '-'})`,
    })),
  ];

  return {
    id: 'games',
    title: 'Game Variety & Hot Titles',
    rows,
    summary: '',
    winner: richnessWinner,
    winnerName: winnerName(richnessWinner, brandA, brandB),
  };
}

export function buildBrandComparison(brandA: BrandProfile, brandB: BrandProfile): BrandComparison {
  const slug = `${brandToSlug(brandA.brand)}-vs-${brandToSlug(brandB.brand)}`;
  const modules = [
    buildWithdrawalModule(brandA, brandB),
    buildCustomerServiceModule(brandA, brandB),
    buildPopularityModule(brandA, brandB),
    buildPerformanceModule(brandA, brandB),
    buildGamesModule(brandA, brandB),
  ];

  let winsA = 0;
  let winsB = 0;
  let ties = 0;
  for (const m of modules) {
    if (m.winner === 'a') winsA++;
    else if (m.winner === 'b') winsB++;
    else ties++;
  }

  let overallWinner: CompareSide | undefined;
  if (winsA > winsB) overallWinner = 'a';
  else if (winsB > winsA) overallWinner = 'b';
  else overallWinner = 'tie';

  return {
    slug,
    title: `${brandA.brand} vs ${brandB.brand}`,
    brandA,
    brandB,
    overallSummary: '',
    overallWinner,
    overallWinnerName: winnerName(overallWinner, brandA, brandB),
    moduleWins: { a: winsA, b: winsB, tie: ties },
    modules,
  };
}
