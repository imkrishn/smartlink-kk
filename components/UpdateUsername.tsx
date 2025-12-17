"use client";

import { database } from "@/app/appwrite";
import { debounce } from "@/lib/debounce";
import { Query } from "appwrite";
import { X } from "lucide-react";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";

type Props = {
  setUsername: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  id?: string;
  setIsUpdatingUsername: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateUsername = ({ setUsername, id, setIsUpdatingUsername }: Props) => {
  const [usernameAvailable, setUsernameAvailable] = useState<
    "available" | "taken" | null
  >(null);
  const [newUsername, setNewUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  {
    /*function to check username availabilty*/
  }

  async function searchUsername(query: string) {
    if (query.trim() === "" || !query) {
      setUsernameAvailable(null);
      return;
    }

    setNewUsername(query);

    const user = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
      [Query.equal("username", query)]
    );

    if (user.total > 0) {
      setUsernameAvailable("taken");
    } else {
      setUsernameAvailable("available");
    }
  }
  const debouncedSearch = useCallback(debounce(searchUsername, 300), []);

  {
    /*function to update username*/
  }

  async function updateUsername() {
    try {
      if (!newUsername || newUsername.trim() === "") return;

      setLoading(true);
      if (!id) {
        toast.error("User is not authenticated. Relogin");
        return;
      }

      if (usernameAvailable === "taken") {
        toast.warning("Username is taken .Try something different");
        return;
      }

      await database.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
        id,
        { username: newUsername }
      );

      setUsername(newUsername);
      setIsUpdatingUsername(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update.Try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen fixed top-0 left-0 flex justify-center items-center z-[9999]">
      <div className="absolute w-full h-full bg-black opacity-80" />

      <div className="z-10 bg-white p-6 rounded-lg shadow-lg flex flex-col  items-end gap-4">
        <X
          onClick={() => setIsUpdatingUsername(false)}
          className="border rounded-full p-0.5 w-5 cursor-pointer text-red-500 active:scale-95 "
        />
        <input
          onChange={(e) => debouncedSearch(e.target.value)}
          disabled={loading}
          type="text"
          placeholder="Enter new username"
          className="px-4 py-2 outline-none rounded-md border border-gray-300 w-64"
        />
        {usernameAvailable === "available" && (
          <p className="text-green-600 px-3 w-full text-xs gont-semibold">
            Username is available
          </p>
        )}
        {usernameAvailable === "taken" && (
          <p className="text-red-600 px-3 w-full text-xs gont-semibold">
            Username is taken
          </p>
        )}
        <button
          disabled={loading}
          onClick={updateUsername}
          className="bg-blue-600 w-full text-center cursor-pointer text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Updating" : "Update"}
        </button>
      </div>
    </div>
  );
};

export default UpdateUsername;
