import { database } from "@/app/appwrite";
import { Query } from "appwrite";

type Updates = {
  username?: string;
  theme?: string;
  description?: string;
  profileUrl?: string | null;
  currentPlan?: string;
  forgotVerificationCode?: string | null;
  forgotVerificationTime?: Date | string | null;
};

export async function updateDatabase(id: string, updates: Updates) {
  await database.updateDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
    id,
    updates
  );
}

export async function listDocuments(userId: string) {
  const links = await database.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_LINK_ID!,
    [
      Query.orderAsc("position"),
      Query.orderDesc("$updatedAt"),
      Query.equal("users", userId),
    ]
  );

  return links.documents;
}

export async function updateLinksDocuments(
  id: string,
  update: { position?: number; href?: string; title?: string }
) {
  await database.updateDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_LINK_ID!,
    id,
    update
  );
}

export async function createLinksDocuments(
  id: string,
  data: {
    position?: number;
    href?: string;
    title?: string;
    users: string;
    userId?: string;
  }
) {
  await database.createDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_LINK_ID!,
    id,
    data
  );
}

export async function deleteLinksDocuments(id: string) {
  await database.deleteDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_LINK_ID!,
    id
  );
}
