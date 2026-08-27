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

// Static, clearly-labeled fallback shown when no job-search API is
// connected yet (ADZUNA_APP_ID / ADZUNA_APP_KEY not configured). See
// README.md "求人情報の取得について" for how to connect a real provider.
const FALLBACK_JOBS: Record<string, JobListing[]> = {
  "Data Analyst": [
    { title: "Data Analyst", company: null, location: null, url: "https://www.linkedin.com/jobs/data-analyst-jobs/" },
  ],
  "Data Engineer": [
    { title: "Data Engineer", company: null, location: null, url: "https://www.linkedin.com/jobs/data-engineer-jobs/" },
  ],
  "Analytics Engineer": [
    { title: "Analytics Engineer", company: null, location: null, url: "https://www.linkedin.com/jobs/analytics-engineer-jobs/" },
  ],
};

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
  for (const keyword of keywords) {
    if (FALLBACK_JOBS[keyword]) return FALLBACK_JOBS[keyword];
  }
  return FALLBACK_JOBS["Data Analyst"];
}
