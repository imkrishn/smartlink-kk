import LinkAnalytics from "@/components/LinkAnalytics";
import { getLoggedInUser } from "@/lib/getLoggedInUser";
import { fetchLinkAnalytics } from "@/lib/link-analytics-server";
import React from "react";

export default async function Page({ params }: { params: any }) {
  const user = await getLoggedInUser();

  if (!user) return null;

  const userId = user.id;
  const currentPlan = user.currentPlan;
  const id = params.id;

  const analytics = await fetchLinkAnalytics(userId, id);

  if (!analytics) {
    const emptyAnalytics = {
      linkId: id,
      linkTitle: "This link has no analytics",
      linkUrl: "Check back later",
      totalClicks: 0,
      uniqueUsers: 0,
      countriesReached: 0,
      dailyData: [],
      countryData: [],
    };
    return <LinkAnalytics analytics={emptyAnalytics} />;
  }

  return <LinkAnalytics analytics={analytics} currentPlan={currentPlan} />;
}
