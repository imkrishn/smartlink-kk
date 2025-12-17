import Logo from "@/components/Logo";
import ShowPage from "@/components/ShowPage";
import { User } from "@/types/UserType";
import React from "react";

type Props = {
  params: any;
};

const Page = async ({ params }: Props) => {
  const { username } = await params;

  async function getDetails(username: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/getInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
        cache: "no-store",
      });

      const result = await res.json();
      return result.data;
    } catch (err) {
      console.error("Error fetching user info:", err);
      return undefined;
    }
  }

  const userData: User | undefined = await getDetails(username);

  // Fallback for user or missing username
  if (!userData || !userData.username) {
    return (
      <div className="min-h-screen grid place-items-center text-center text-gray-500 text-xl">
        <p>🔗 Link not found or user does not exist.</p>
      </div>
    );
  }
  return (
    <div>
      <Logo />
      <ShowPage user={userData} />
    </div>
  );
};

export default Page;
