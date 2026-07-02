import seedrandom from 'seedrandom';
import type { BrandComparison, BrandProfile } from '@/types/brand';
import { formatVolume } from '@/utils/comparison';
import spintaxRaw from '../../docs/spintax.json';

export type SpintaxModuleName =
  | 'overall_summary'
  | 'cashout_module'
  | 'cs_module'
  | 'brand_heat_module'
  | 'performance_module'
  | 'game_variety_module';

export interface SpintaxModuleContent {
  intro: string[];
  data_statement: string[];
  conclusion: string[];
}

export type SpintaxPlaceholderMap = Record<string, string>;

const SPINTAX_MODULES = spintaxRaw as Record<string, SpintaxModuleContent | unknown>;

const MODULE_ID_TO_SPIN: Record<string, SpintaxModuleName> = {
  withdrawal: 'cashout_module',
  'customer-service': 'cs_module',
  popularity: 'brand_heat_module',
  performance: 'performance_module',
  games: 'game_variety_module',
};

const SPEED_EN: Record<number, string> = {
  1: 'Fast',
  2: 'Medium',
  3: 'Slow',
};

const TIME_EN: Record<number, string> = {
  1: 'within 1 hour',
  2: 'within 4 hours',
  3: 'over 4 hours',
};

function isSpintaxModule(value: unknown): value is SpintaxModuleContent {
  if (!value || typeof value !== 'object') return false;
  const mod = value as SpintaxModuleContent;
  return Array.isArray(mod.intro) && Array.isArray(mod.data_statement) && Array.isArray(mod.conclusion);
}

function pickOne<T>(items: T[], rng: () => number): T {
  const index = Math.floor(rng() * items.length);
  return items[index]!;
}

function replacePlaceholders(template: string, dataObj: SpintaxPlaceholderMap): string {
  return Object.entries(dataObj).reduce(
    (text, [key, value]) => text.replaceAll(key, value),
    template,
  );
}

export function generateSummary(
  moduleName: SpintaxModuleName,
  dataObj: SpintaxPlaceholderMap,
  seedSlug: string,
): string {
  const module = SPINTAX_MODULES[moduleName];
  if (!isSpintaxModule(module)) {
    throw new Error(`Spintax module not found or invalid: ${moduleName}`);
  }

  const rng = seedrandom(`${seedSlug}:${moduleName}`);
  const intro = pickOne(module.intro, rng);
  const dataStatement = pickOne(module.data_statement, rng);
  const conclusion = pickOne(module.conclusion, rng);

  const combined = `${intro} ${dataStatement} ${conclusion}`;
  return replacePlaceholders(combined, dataObj);
}

function gameTypes(games: BrandProfile['hot_games']): string {
  return [...new Set(games.map((g) => g.game_type))].join(', ');
}

function buildOverallPlaceholders(comparison: BrandComparison): SpintaxPlaceholderMap {
  const winner =
    comparison.overallWinnerName ??
    (comparison.moduleWins.a >= comparison.moduleWins.b
      ? comparison.brandA.brand
      : comparison.brandB.brand);

  return {
    '{Brand_A}': comparison.brandA.brand,
    '{Brand_B}': comparison.brandB.brand,
    '{Winner}': winner,
    '{Score_A}': String(comparison.moduleWins.a),
    '{Score_B}': String(comparison.moduleWins.b),
  };
}

function buildCashoutPlaceholders(brandA: BrandProfile, brandB: BrandProfile): SpintaxPlaceholderMap {
  return {
    '{Brand_A}': brandA.brand,
    '{Brand_B}': brandB.brand,
    '{Speed_A}': SPEED_EN[brandA.tier] ?? 'Medium',
    '{Time_A}': TIME_EN[brandA.tier] ?? 'within 4 hours',
    '{Time_B}': TIME_EN[brandB.tier] ?? 'within 4 hours',
  };
}

function buildCsPlaceholders(brandA: BrandProfile, brandB: BrandProfile): SpintaxPlaceholderMap {
  return {
    '{Brand_A}': brandA.brand,
    '{Brand_B}': brandB.brand,
    '{Score_A}': String(brandA.customer_service.overall_score),
    '{Score_B}': String(brandB.customer_service.overall_score),
    '{Response_A}': brandA.customer_service.response_speed,
  };
}

function buildHeatPlaceholders(brandA: BrandProfile, brandB: BrandProfile): SpintaxPlaceholderMap {
  const volA = brandA.avg_search_volume_last_2_months ?? 0;
  const volB = brandB.avg_search_volume_last_2_months ?? 0;
  const aWins = volA >= volB;
  const winner = aWins ? brandA : brandB;
  const loser = aWins ? brandB : brandA;

  return {
    '{Winner}': winner.brand,
    '{Loser}': loser.brand,
    '{Heat_A}': formatVolume(winner.avg_search_volume_last_2_months ?? 0),
    '{Heat_B}': formatVolume(loser.avg_search_volume_last_2_months ?? 0),
  };
}

function buildPerformancePlaceholders(
  brandA: BrandProfile,
  brandB: BrandProfile,
  comparison: BrandComparison,
): SpintaxPlaceholderMap {
  const perfModule = comparison.modules.find((m) => m.id === 'performance');
  const winnerSide = perfModule?.winner && perfModule.winner !== 'tie' ? perfModule.winner : 'a';
  const winner = winnerSide === 'a' ? brandA : brandB;
  const loser = winnerSide === 'a' ? brandB : brandA;

  return {
    '{Winner}': winner.brand,
    '{Loser}': loser.brand,
    '{FCP_Winner}': `${winner.performance.fcp_seconds}s`,
    '{FCP_Loser}': `${loser.performance.fcp_seconds}s`,
    '{DNS_Winner}': `${winner.performance.dns_anti_hijacking_percent}%`,
    '{FPS_Winner}': `${winner.performance.ui_fps} FPS`,
  };
}

function buildGamesPlaceholders(brandA: BrandProfile, brandB: BrandProfile): SpintaxPlaceholderMap {
  return {
    '{Brand_A}': brandA.brand,
    '{Brand_B}': brandB.brand,
    '{TopGame_A}': brandA.hot_games[0]?.game_name ?? 'N/A',
    '{TopGame_B}': brandB.hot_games[0]?.game_name ?? 'N/A',
    '{Types_A}': gameTypes(brandA.hot_games),
  };
}

function placeholdersForModule(
  moduleName: SpintaxModuleName,
  comparison: BrandComparison,
): SpintaxPlaceholderMap {
  const { brandA, brandB } = comparison;

  switch (moduleName) {
    case 'overall_summary':
      return buildOverallPlaceholders(comparison);
    case 'cashout_module':
      return buildCashoutPlaceholders(brandA, brandB);
    case 'cs_module':
      return buildCsPlaceholders(brandA, brandB);
    case 'brand_heat_module':
      return buildHeatPlaceholders(brandA, brandB);
    case 'performance_module':
      return buildPerformancePlaceholders(brandA, brandB, comparison);
    case 'game_variety_module':
      return buildGamesPlaceholders(brandA, brandB);
    default:
      return {};
  }
}

export function applySpintaxSummaries(
  comparison: BrandComparison,
  seedSlug: string,
): BrandComparison {
  const overallSummary = generateSummary(
    'overall_summary',
    buildOverallPlaceholders(comparison),
    seedSlug,
  );

  const modules = comparison.modules.map((mod) => {
    const spintaxName = MODULE_ID_TO_SPIN[mod.id];
    if (!spintaxName) return mod;

    return {
      ...mod,
      summary: generateSummary(
        spintaxName,
        placeholdersForModule(spintaxName, comparison),
        seedSlug,
      ),
    };
  });

  return {
    ...comparison,
    overallSummary,
    modules,
  };
}
