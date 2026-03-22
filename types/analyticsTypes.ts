import { Geo } from "@vercel/functions";

export interface ClientTrackingData {
  profileUsername: string;
  linkId: string;
  linkTitle: string;
  linkUrl: string;
  userAgent?: string;
  referrer?: string;
}

export interface ServerTrackingEvent extends ClientTrackingData {
  profileUserId: string;
  location: Geo;
  timestamp: string;
}

export interface AnalyticsData {
  totalClicks: number;
  uniqueVisitors: number;
  countriesReached: number;
  totalLinksClicked: number;
  topLinkTitle: string | null;
  topReferrer: string | null;
  firstClick: string | null;
  lastClick: string | null;
}

export interface LinkAnalyticsData {
  linkId: string;
  linkTitle: string;
  linkUrl: string;
  totalClicks: number;
  uniqueUsers: number;
  countriesReached: number;
  dailyData: Array<{
    date: string;
    clicks: number;
    uniqueUsers: number;
    countries: number;
  }>;
  countryData: Array<{
    country: string;
    clicks: number;
    percentage: number;
  }>;
}

export interface TinybirdLinkAnalyticsRow {
  date: string;
  linkTitle: string;
  linkUrl: string;
  total_clicks: number;
  unique_users: number;
  countries_reached: number;
}
