export const runtime = "edge";

import {
  ClientTrackingData,
  ServerTrackingEvent,
} from "@/types/analyticsTypes";
import { geolocation } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";
import { database } from "../../appwrite";
import { Query } from "appwrite";

export async function POST(req: NextRequest) {
  try {
    const data: ClientTrackingData = await req.json();
    const username = data.profileUsername;
    const geo = await geolocation(req);

    const user = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
      [Query.equal("username", username)]
    );

    if (user.total === 0) {
      return NextResponse.json(
        { error: "Profile not found", success: false },
        { status: 400 }
      );
    }

    const userId = user.documents[0].$id;

    const trackingEvent: ServerTrackingEvent = {
      ...data,

      timestamp: new Date().toISOString(),
      profileUserId: userId,
      location: {
        ...geo,
      },
      userAgent: data.userAgent || req.headers.get("user-agent") || "unknown",
    };

    console.log(trackingEvent);

    if (process.env.TINYBIRD_TOKEN && process.env.TINYBIRD_HOST) {
      try {
        const eventForTinybird = {
          timestamp: trackingEvent.timestamp,
          profileUsername: trackingEvent.profileUsername,
          profileUserId: trackingEvent.profileUserId,
          linkId: trackingEvent.linkId,
          linkTitle: trackingEvent.linkTitle,
          linkUrl: trackingEvent.linkUrl,
          userAgent: trackingEvent.userAgent,
          referrer: trackingEvent.referrer,
          clicked_by: "",
          location_country: trackingEvent.location?.country || "",
          location_region: trackingEvent.location?.region || "",
          location_city: trackingEvent.location?.city || "",
          location_latitude: trackingEvent.location?.latitude || "",
          location_longitude: trackingEvent.location?.longitude || "",
        };

        const tinybirdHost = process.env.TINYBIRD_HOST;
        const tinybirdToken = process.env.TINYBIRD_TOKEN;

        const tinybirdResponse = await fetch(
          `${tinybirdHost}/v0/events?name=click_events`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tinybirdToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventForTinybird),
          }
        );

        if (!tinybirdResponse.ok) {
          const errorText = await tinybirdResponse.text();
          console.error("Failed to send tinybird", errorText);
        } else {
          const responseBody = await tinybirdResponse.json();
          console.log("Sucessfully sent to tinybird");

          if (responseBody.quarantined_rows > 0) {
            console.warn("Some rows were quarantined");
          }
        }
      } catch (tinybirdError) {
        console.log("Tinybird Error: ", tinybirdError);
      }
    } else {
      console.log("Tinybird not configured");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to track click", success: false },
      { status: 500 }
    );
  }
}
