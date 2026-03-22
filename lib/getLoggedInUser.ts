import { Query } from "appwrite";
import { cookies } from "next/headers";
import { decryptToken } from "./encryptDecryptToken";
import { database, users } from "../app/appwrite-server";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getLoggedInUser = async () => {
  try {
    const Cookies = await cookies();
    const session = Cookies.get("auth_session");

    if (!session?.value) {
      console.warn("❌ No auth_session cookie");
      return null;
    }

    const userId = await decryptToken(session.value);
    if (!userId) {
      console.warn("❌ Failed to decrypt token");
      return null;
    }

    // Retry users.get with backoff (prevent crash during SSR hydration)
    let user = null;
    const maxAttempts = 3;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        user = await users.get(userId);
        break;
      } catch (err: any) {
        console.warn(
          `users.get attempt ${attempt + 1} failed`,
          err.message || err
        );
        if (attempt < maxAttempts - 1) {
          await sleep(300 * (attempt + 1));
        }
      }
    }

    if (!user || !user.email) {
      console.warn("❌ Appwrite user not found or has no email");
      return null;
    }

    // Lookup internal user doc by email
    const found = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
      [Query.equal("email", user.email)]
    );

    if (found.total > 0) {
      const doc = found.documents[0];
      return {
        id: doc.$id,
        email: doc.email,
        username: doc.username,
        profileUrl: doc.profileUrl,
        description: doc.description,
        theme: doc.theme,
        currentPlan: doc.currentPlan,
      };
    }

    console.warn("⚠️ No user doc found for email:", user.email);
    return null;
  } catch (err: any) {
    console.error("❌ getLoggedInUser fatal error:", err.message || err);
    return null;
  }
};
