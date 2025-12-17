"use client";

import { account } from "@/app/appwrite";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const sendMagicLink = async () => {
    try {
      await account.createRecovery(
        email,
        `${process.env.NEXT_PUBLIC_URL}/auth/resetPassword?email=${email}`
      );
      setSent(true);
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-6 w-full max-w-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Forgot Password
        </h2>

        {sent ? (
          <p className="text-green-600 text-sm">
            ✅ Magic reset link sent to your email.
          </p>
        ) : (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Enter your registered email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={sendMagicLink}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            >
              Send Reset Link
            </button>
          </>
        )}
      </div>
    </main>
  );
}
