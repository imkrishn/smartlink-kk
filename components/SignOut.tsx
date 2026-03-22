"use client";

import { account } from "@/app/appwrite";
import React from "react";

const SignOut = () => {
  async function logout() {
    try {
      // Delete Appwrite session
      await account.deleteSession("current");

      // expiring cookie from server
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <button
      onClick={logout}
      className="rounded-md lg:mr-52 mr-4 whitespace-nowrap text-xs px-5 py-2 transition-all duration-150 ease-in-out active:scale-95 
                 text-white bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 
                 border border-blue-700 shadow-sm lg:text-sm font-semibold"
    >
      🔒 Logout
    </button>
  );
};

export default SignOut;
