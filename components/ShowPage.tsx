"use client";

import { client } from "@/app/appwrite";
import { trackLinkCLick } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Theme } from "@/types/themeType";
import { User } from "@/types/UserType";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ShowPage = ({ user }: { user: User }) => {
  const [data, setData] = useState<User>(user);

  useEffect(() => {
    if (!user) return;

    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
    const userCollectionId =
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!;
    const linkCollectionId =
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_LINK_ID!;

    // Listen to user profile updates (theme, profilePic, etc.)
    const userSub = client.subscribe(
      `databases.${databaseId}.collections.${userCollectionId}.documents.${user.$id}`,
      (response: any) => {
        const payload = response.payload as User;
        const parsedTheme: Theme = payload.theme
          ? JSON.parse(response.payload.theme)
          : undefined;

        setData((prev) => ({
          ...prev!,
          ...payload,
          theme: parsedTheme,
        }));
      }
    );

    // Listen to all link updates for create, update, delete
    const linkSub = client.subscribe(
      `databases.${databaseId}.collections.${linkCollectionId}.documents`,
      (response: any) => {
        const event = response.events[0];
        const payload = response.payload;

        // Ignore links not for this user
        if (payload.userId !== user.$id) return;

        setData((prev) => {
          if (!prev || !prev.links) return prev;
          let updatedLinks = [...prev.links];

          if (event.includes("create")) {
            const exists = updatedLinks.some((l) => l.$id === payload.$id);
            if (!exists) {
              updatedLinks.push(payload);
            }
          }

          if (event.includes("update")) {
            updatedLinks = updatedLinks.map((l) =>
              l.$id === payload.$id ? payload : l
            );
          }

          if (event.includes("delete")) {
            updatedLinks = updatedLinks.filter((l) => l.$id !== payload.$id);
          }

          updatedLinks.sort((a, b) => a.position - b.position);

          return {
            ...prev,
            links: updatedLinks,
          };
        });
      }
    );

    return () => {
      userSub(); // unsubscribe
      linkSub(); // unsubscribe
    };
  }, [user]);

  const handleLinks = async (
    linkId: string,
    linkUrl: string,
    linkTitle: string
  ) => {
    try {
      if (!data?.username || !linkId || !linkUrl || !linkTitle) return;

      await trackLinkCLick({
        profileUsername: data.username,
        linkId,
        linkUrl,
        linkTitle,
      });

      window.location.href = linkUrl;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={cn(
        "lg:min-h-[500px] min-h-screen lg:mx-48 m-3 bg-[#FFFAFA] rounded-3xl pt-11 p-7 text-[#716B6B] shadow-lg border border-[#B4AAAA] flex flex-col  items-center",
        data.theme?.bg,
        data.theme?.text
      )}
    >
      <Image
        src={data.profileUrl || "/man.png"}
        alt="#"
        width={100}
        height={100}
        className="rounded-full bg-contain p-1 h-28 w-28 bg-white"
      />
      <p className="text-xl font-bold mt-3">{data.username}</p>
      <p className="text-xs font-light text-center">{data.description}</p>

      <div className="w-full my-3 grid place-items-center">
        {data.links.length > 0 ? (
          data.links?.map((link) => (
            <div
              onClick={() => handleLinks(link.$id, link.href, link.title)}
              key={link.$id}
              className={cn(
                "w-full lg:w-108 h-14 cursor-pointer grid place-items-center active:scale-[.98] hover:opacity-90 rounded-lg shadow-md border my-2 border-[#62BEF8] bg-[#c0d3df]",
                data.theme?.linkBg
              )}
            >
              <p className="text-sm w-full text-center font-semibold">
                {link.title}
              </p>
            </div>
          ))
        ) : (
          <p className="text-3xl font-bold text-[#1db118]">
            Customise and Add some links
          </p>
        )}
      </div>
    </div>
  );
};

export default ShowPage;
