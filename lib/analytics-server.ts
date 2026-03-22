import { AnalyticsData } from "@/types/analyticsTypes";

export async function fetchAnalytics(
  userId: string,
  dayBack: number = 30
): Promise<AnalyticsData> {
  if (!process.env.TINYBIRD_TOKEN || !process.env.TINYBIRD_HOST) {
    return {
      totalClicks: 0,
      uniqueVisitors: 0,
      countriesReached: 0,
      totalLinksClicked: 0,
      topLinkTitle: null,
      topReferrer: null,
      firstClick: null,
      lastClick: null,
    };
  }

  try {
    //fetch from original profile_summary endpoint from tinybird cloud
    const tinybirdResponse = await fetch(
      `${process.env.TINYBIRD_HOST}/v0/pipes/analytics_summary.json?profileUserId=${userId}&days_back=${dayBack}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
        },
        next: { revalidate: 0 }, //cache for 0 seconds
      }
    );

    if (!tinybirdResponse.ok) {
      console.error("Tinybird request failed :", await tinybirdResponse.text());
      throw new Error("Failed to fetch analytics from tinybird");
    }

    const data = await tinybirdResponse.json();

    if (!data.data || data.data.length === 0) {
      return {
        totalClicks: 0,
        uniqueVisitors: 0,
        countriesReached: 0,
        totalLinksClicked: 0,
        topLinkTitle: null,
        topReferrer: null,
        firstClick: null,
        lastClick: null,
      };
    }

    const analytics = data.data[0];

    return {
      totalClicks: analytics.total_clicks || 0,
      uniqueVisitors: analytics.unique_users || 0,
      countriesReached: analytics.countries_reached || 0,
      totalLinksClicked: analytics.total_links_clicked || 0,
      topLinkTitle: analytics.top_link_title?.[0] || null,
      topReferrer: analytics.top_referrer?.[0] || null,
      firstClick: analytics.first_click || null,
      lastClick: analytics.last_click || null,
    };
  } catch (err) {
    console.log(err);

    return {
      totalClicks: 0,
      uniqueVisitors: 0,
      countriesReached: 0,
      totalLinksClicked: 0,
      topLinkTitle: null,
      topReferrer: null,
      firstClick: null,
      lastClick: null,
    };
  }
}
