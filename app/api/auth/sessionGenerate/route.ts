import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encryptToken } from "@/lib/encryptDecryptToken";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    const sessionToken = authHeader.split("Bearer ")[1];

    const encryptedToken = await encryptToken(sessionToken);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_session", encryptedToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 108 * 24 * 60 * 60, //108 days
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Session generate failed:", err);
    return NextResponse.json(
      { success: false, error: "Failed to verify session" },
      { status: 500 }
    );
  }
}
