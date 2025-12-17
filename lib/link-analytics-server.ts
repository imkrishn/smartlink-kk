import {
  LinkAnalyticsData,
  TinybirdLinkAnalyticsRow,
} from "@/types/analyticsTypes";

interface TinybirdCountryAnalyticsRow {
  country: string;
  total_clicks: number;
  unique_users: number;
  percentage: number;
}

export async function fetchLinkAnalytics(
  userId: string,
  linkId: string,
  daysBack: number = 30
): Promise<LinkAnalyticsData | null> {
  if (!process.env.TINYBIRD_TOKEN || !process.env.TINYBIRD_HOST) {
    return {
      linkId,
      linkTitle: "Example Link",
      linkUrl: "https://example.com",
      totalClicks: 0,
      uniqueUsers: 0,
      countriesReached: 0,
      dailyData: [],
      countryData: [],
    };
  }

  try {
    let tinybirdResponse = await fetch(
      `${process.env.TINYBIRD_HOST}/v0/pipes/fast_link_analytics.json?profileUserId=${userId}&linkId=${linkId}&days_back=${daysBack}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
        },
        next: { revalidate: 0 }, //no caching for real time data
      }
    );

    if (!tinybirdResponse.ok) {
      console.log("fast link analytics failed,falling back to original");
      tinybirdResponse = await fetch(
        `${process.env.TINYBIRD_HOST}/v0/pipes/link_analytics.json?profileUserId=${userId}&linkId=${linkId}&days_back=${daysBack}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
          },
          next: { revalidate: 0 },
        }
      );
    }

    if (!tinybirdResponse.ok) {
      console.error("Tinybird request failed", await tinybirdResponse.text());
      throw new Error("failed to fetch link analytics");
    }

    const data = await tinybirdResponse.json();

    if (!data.data || data.data.length === 0) {
      return null;
    }
    const dailyData = data.data.map((row: TinybirdLinkAnalyticsRow) => ({
      date: row.date,
      clicks: row.total_clicks || 0,
      uniqueUsers: row.unique_users || 0,
      countries: row.countries_reached || 0,
    }));

    //Calculate totals

    const totalClicks = dailyData.reduce(
      (sum: number, day: { clicks: number }) => sum + day.clicks,
      0
    );
    const uniqueUsers = Math.max(
      ...dailyData.map((day: { uniqueUsers: number }) => day.uniqueUsers),
      0
    );

    const countriesReached = Math.max(
      ...dailyData.map((day: { countries: number }) => day.countries),
      0
    );

    //get link from first row
    const firstRow = data.data[0] as TinybirdLinkAnalyticsRow;

    //fetch country level data from the country_analytics endpoint pipe

    let countryData: Array<{
      country: string;
      clicks: number;
      percentage: number;
    }> = [];

    try {
      const countryResponse = await fetch(
        `${process.env.TINYBIRD_HOST}/v0/pipes/link_country_analytics.json?profileUserId=${userId}&linkId=${linkId}&days_back=${daysBack}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
          },
          next: { revalidate: 0 }, //none caching store
        }
      );

      if (countryResponse.ok) {
        const countryResult = await countryResponse.json();

        if (countryResult.data && countryResult.data.length > 0) {
          countryData = countryResult.data.map(
            (row: TinybirdCountryAnalyticsRow) => ({
              country: row.country || "Unknown",
              clicks: row.total_clicks || 0,
              percentage: row.percentage || 0,
            })
          );
        }
      }
    } catch (countryErr) {
      console.error("Country error : ", countryErr);
    }

    return {
      linkId,
      linkTitle: firstRow.linkTitle || "Unknown_Link",
      linkUrl: firstRow.linkUrl || "",
      totalClicks,
      uniqueUsers,
      countriesReached,
      dailyData: dailyData.reverse(), // recent first
      countryData,
    };
  } catch (err) {
    console.log("Tinybird error : ", err);
    return null;
  }
}
