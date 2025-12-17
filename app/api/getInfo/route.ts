import { NextRequest, NextResponse } from "next/server";
import { database } from "../../appwrite";
import { Query } from "appwrite";
import { Link } from "@/types/UserType";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ success: false, data: null }, { status: 505 });
    }

    const user = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
      [Query.equal("username", username)]
    );

    if (user.total === 0) {
      return NextResponse.json({ success: false, data: null }, { status: 505 });
    }

    const { $id, theme, description, profileUrl, links } = user.documents[0];
    const sortedLinks = links.sort(
      (a: Link, b: Link) => a.position - b.position
    );
    const parsedTheme = JSON.parse(theme);

    return NextResponse.json(
      {
        success: true,
        data: {
          $id,
          theme: parsedTheme,
          description,
          profileUrl,
          username,
          links: sortedLinks,
        },
      },
      { status: 200 }
    );
  } catch (Err) {
    console.log(Err);
    return NextResponse.json({ success: false, data: null }, { status: 505 });
  }
}
