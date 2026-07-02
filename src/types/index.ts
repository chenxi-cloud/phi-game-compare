export interface Site {
  id: string;
  name: string;
  slug: string;
  logo: string;
  tagline: string;
  rating: number;
  license: string;
  highlights: string[];
}

export interface ComparisonReport {
  slug: string;
  title: string;
  sites: string[];
  summary: string;
  updatedAt: string;
  sections: ReportSection[];
}

export interface ReportSection {
  title: string;
  winner?: string;
  content: string;
}

export interface ComparisonRow {
  label: string;
  values: Record<string, string | number | boolean>;
}
