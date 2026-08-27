export type JobListing = {
  title: string;
  company: string | null;
  location: string | null;
  url: string;
};

export type JobListingsResult = {
  jobs: JobListing[];
  isLive: boolean; // true = fetched from a real external API, false = fallback sample data
  totalCount: number | null; // real total match count from the live API, when available (docs/prd.md 21-3)
};

// 学習者レベル（1-10, src/lib/learner-level.ts）に応じて求人検索キーワードを
// 段階的に変化させる（docs/prd.md 21-3）。実務での役割の広がりに合わせて
// 若いレベルほど入門的な職種、高いレベルほど基盤全体を担う職種にしている。
export const LEARNER_LEVEL_JOB_KEYWORDS: Record<number, string> = {
  1: "Data Analyst",
  2: "Data Analyst",
  3: "Reporting Analyst",
  4: "Data Engineer Intern",
  5: "Junior Data Engineer",
  6: "Analytics Engineer",
  7: "Data Engineer",
  8: "Data Engineer",
  9: "BI Engineer",
  10: "Data Platform Engineer",
};

// 市場動向・年収相場を知りたいというニーズに応える外部リンク。具体的な年収額を
// アプリ内ででっち上げると学習者に誤解を与えるため、実際のデータを持つ検索結果
// ページへ案内する（架空の数値は表示しない）。
export function getMarketTrendUrl(keyword: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`${keyword} 年収 相場 求人`)}`;
}

const ADZUNA_COUNTRY = process.env.ADZUNA_COUNTRY || "gb";

// Real job-search platforms used to build the fallback "sample display"
// shown when no live API is connected (ADZUNA_APP_ID / ADZUNA_APP_KEY not
// configured, or the live fetch fails/returns nothing). Each entry links to
// an actual keyword search results page on that platform — not a
// fabricated listing — so it stays honest even without a live API. See
// README.md "求人情報の取得について" for how to connect a real provider.
// Note: Indeed no longer offers self-serve API signup, so it is included
// here as a search-link source rather than a live-fetch provider.
const FALLBACK_JOB_SITES: { name: string; buildUrl: (keyword: string) => string }[] = [
  {
    name: "LinkedIn",
    buildUrl: (keyword) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}`,
  },
  {
    name: "Indeed",
    buildUrl: (keyword) => `https://jp.indeed.com/jobs?q=${encodeURIComponent(keyword)}`,
  },
];

export async function fetchJobListings(keywords: string[]): Promise<JobListingsResult> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  const primaryKeyword = keywords[0];

  if (!appId || !appKey || !primaryKeyword) {
    return { jobs: buildFallback(keywords), isLive: false, totalCount: null };
  }

  try {
    const url = new URL(`https://api.adzuna.com/v1/api/jobs/${ADZUNA_COUNTRY}/search/1`);
    url.searchParams.set("app_id", appId);
    url.searchParams.set("app_key", appKey);
    url.searchParams.set("results_per_page", "5");
    url.searchParams.set("what", primaryKeyword);
    url.searchParams.set("content-type", "application/json");

    const response = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!response.ok) {
      return { jobs: buildFallback(keywords), isLive: false, totalCount: null };
    }

    const data = (await response.json()) as {
      count?: number;
      results?: { title?: string; company?: { display_name?: string }; location?: { display_name?: string }; redirect_url?: string }[];
    };

    const jobs: JobListing[] = (data.results ?? [])
      .filter((result) => result.title && result.redirect_url)
      .map((result) => ({
        title: result.title as string,
        company: result.company?.display_name ?? null,
        location: result.location?.display_name ?? null,
        url: result.redirect_url as string,
      }));

    if (jobs.length === 0) {
      return { jobs: buildFallback(keywords), isLive: false, totalCount: null };
    }

    return { jobs, isLive: true, totalCount: typeof data.count === "number" ? data.count : null };
  } catch {
    return { jobs: buildFallback(keywords), isLive: false, totalCount: null };
  }
}

function buildFallback(keywords: string[]): JobListing[] {
  const primaryKeyword = keywords[0] ?? "Data Analyst";
  return FALLBACK_JOB_SITES.map((site) => ({
    title: `${primaryKeyword}の求人を探す（${site.name}）`,
    company: null,
    location: null,
    url: site.buildUrl(primaryKeyword),
  }));
}
