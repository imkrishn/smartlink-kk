import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // cookie expire
  cookieStore.set("auth_session", "", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(0),
  });

  return NextResponse.json({ success: true });
}
