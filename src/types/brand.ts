export interface HotGame {
  game_type: string;
  vendor: string;
  game_name: string;
}

export interface PerformanceData {
  profile: string;
  fcp_seconds: number;
  dns_anti_hijacking_percent: number;
  ui_fps: number;
}

export interface CustomerServiceData {
  response_speed: string;
  satisfaction_score: number;
  response_speed_score: number;
  overall_score: number;
}

export interface BrandProfile {
  rank: number;
  tier: number;
  brand: string;
  status: string;
  avg_search_volume_last_2_months: number;
  search_volume: number | null;
  top_ranking_url: string | null;
  game_richness: string;
  hot_games: HotGame[];
  performance: PerformanceData;
  customer_service: CustomerServiceData;
  /** True only for our own promoted site (outbound link is dofollow). */
  is_target?: boolean;
}

export type CompareSide = 'a' | 'b' | 'tie';

export interface CompareRow {
  label: string;
  valueA: string;
  valueB: string;
  winner?: CompareSide;
}

export interface CompareModule {
  id: string;
  title: string;
  rows: CompareRow[];
  summary: string;
  winner?: CompareSide;
  winnerName?: string;
}

export interface BrandComparison {
  slug: string;
  title: string;
  brandA: BrandProfile;
  brandB: BrandProfile;
  overallSummary: string;
  overallWinner?: CompareSide;
  overallWinnerName?: string;
  moduleWins: { a: number; b: number; tie: number };
  modules: CompareModule[];
}
