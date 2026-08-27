export type JobListing = {
  title: string;
  company: string | null;
  location: string | null;
  url: string;
};

export type JobListingsResult = {
  jobs: JobListing[];
  isLive: boolean; // true = fetched from a real external API, false = fallback sample data
};

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
  {
    name: "Wantedly",
    buildUrl: (keyword) => `https://www.wantedly.com/search?q=${encodeURIComponent(keyword)}&type=projects`,
  },
  {
    name: "Green",
    buildUrl: (keyword) => `https://www.green-japan.com/search_lp?keyword=${encodeURIComponent(keyword)}`,
  },
  {
    name: "Google検索",
    buildUrl: (keyword) => `https://www.google.com/search?q=${encodeURIComponent(`${keyword} 求人`)}`,
  },
];

export async function fetchJobListings(keywords: string[]): Promise<JobListingsResult> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  const primaryKeyword = keywords[0];

  if (!appId || !appKey || !primaryKeyword) {
    return { jobs: buildFallback(keywords), isLive: false };
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
      return { jobs: buildFallback(keywords), isLive: false };
    }

    const data = (await response.json()) as {
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
      return { jobs: buildFallback(keywords), isLive: false };
    }

    return { jobs, isLive: true };
  } catch {
    return { jobs: buildFallback(keywords), isLive: false };
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
