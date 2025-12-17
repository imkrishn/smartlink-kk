"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import bcryptjs from "bcryptjs";
import { Query } from "appwrite";
import { account, database } from "@/app/appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!;

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleReset() {
    setError("");

    if (!userId || !secret || !email) {
      setError("Invalid or expired reset link.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const user = await database.listDocuments(DB_ID, COLLECTION_ID, [
        Query.equal("email", email),
      ]);

      await account.updateRecovery(userId, secret, password);

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      await database.updateDocument(
        DB_ID,
        COLLECTION_ID,
        user.documents[0].$id,
        {
          password: hashedPassword,
        }
      );

      toast.success("Password reset successful!");
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg p-6 w-full max-w-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Reset Your Password
        </h2>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
        />

        <button
          disabled={loading}
          onClick={handleReset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </main>
  );
}
