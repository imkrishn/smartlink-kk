"use client";

import { cn } from "@/lib/utils";
import { Copy, Link, Logs } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import Mobiledemo from "./Mobiledemo";
import UpdateUsername from "./UpdateUsername";
import { toast } from "sonner";
import { debounce } from "@/lib/debounce";
import ProfilePicture from "./ProfilePicture";
import { Theme } from "@/types/themeType";
import { themesData } from "@/lib/themesData";
import { updateDatabase } from "@/services/crudService";
import Protect from "./Protect";

const themes = [
  "bg-[#FFFBFB] border border-[#737070]",
  "bg-[#171717]",
  "bg-[#F83737]",
  "bg-[#FF0DCB]",
  "bg-[#1924EF]",
  "bg-[#41C01A]",
  "bg-[#EE8309]",
  "bg-[#0AF9F9]",
  "bg-[#5E0BC4]",
  "bg-[#E6E60A]",
  "bg-[#02f8c770]",
];

type Props = {
  currentPlan: string;
  userId: string;
  theUsername: string;
  profileUrl: string;
  theme: string;
  description: string;
};

const Personalize = ({
  currentPlan,
  userId,
  theUsername,
  profileUrl,
  theme,
  description,
}: Props) => {
  const [username, setUsername] = useState<string | null | undefined>(null);
  const [isUpdatingUsername, setIsUpdatingUsername] = useState<boolean>(
    userId && !theUsername ? true : false
  );
  const [currentTheme, setCurrentTheme] = useState<Theme | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setUsername(theUsername);
    const parsedTheme: Theme = theme ? JSON.parse(theme) : undefined;
    setCurrentTheme(parsedTheme);
  }, [userId]);

  async function updatingDescription(newDescription: string) {
    try {
      if (!userId) {
        toast.error("You are unauthorized to perform the task");
        return;
      }

      if (newDescription?.trim() === "") return;

      await updateDatabase(userId, { description: newDescription });
    } catch (err) {
      console.log(err);
      toast.error("Failed to Update Description.Try again");
    }
  }

  const debounceUpdateDescription = useCallback(
    debounce(updatingDescription, 600),
    []
  );

  {
    /*handle copy functionality*/
  }

  async function handleCopy() {
    try {
      const text = "https://smartlink-sage.vercel.app/public/" + username;
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch (err) {
      console.log(err);
    }
  }

  function handleTheme(index: number) {
    const result = themesData[index];
    setCurrentTheme(result);
  }

  async function updateTheme() {
    if (!userId) {
      toast.error("User is not authorized");
      return;
    }

    if (!currentTheme && currentPlan !== "pro") return;

    setLoading(true);

    try {
      await updateDatabase(userId, { theme: JSON.stringify(currentTheme) });

      toast.success("Theme Updated");
    } catch (err) {
      console.log(err);
      toast.error("Failed to upadte theme .Try again");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-white  shadow-lg p-9 my-3 rounded-lg">
      <h1 className="text-2xl font-extralight text-[#575555]">
        Personalize Your Page
      </h1>
      <h1 className="text-[#B3ACAC]  font-semibold text-xs">
        Choose a custom username,profile picture & bio-description
      </h1>

      {/*MANAGE PROFILE PICTURE */}

      <ProfilePicture id={userId} url={profileUrl} />

      {/*MANAGE LINK*/}

      <div className="bg-white border p-4 border-blue-200 rounded-lg shadow-lg">
        <div className="flex justify-center gap-2 items-center px-4 relative">
          <p className="text-[#3F3C3C] w-full font-medium">
            👤 Current Username
          </p>
          <p className="text-[#727272] text-xs">{username}</p>
          {isUpdatingUsername && (
            <UpdateUsername
              setUsername={setUsername}
              id={userId}
              setIsUpdatingUsername={setIsUpdatingUsername}
            />
          )}
          <Image
            onClick={() => setIsUpdatingUsername(true)}
            src="/edit.png"
            alt="#edit_icon"
            width={20}
            height={20}
            className="cursor-pointer"
          />
        </div>
        <div className="flex justify-center text-[#3F3C3C] items-center px-4  gap-2 lg:whitespace-nowrap  rounded-md bg-[#E7EFF2] border border-[#C4BBBB] my-3">
          <Link className="text-blue-500" />
          <p className="lg:block hidden"> Link Preview</p>
          <p className="text-sm w-full font-extralight text-[#7B7676] px-2 truncate  bg-[#ebf0f1bd] my-2">
            https://smartlink-sage.vercel.app/public/{username}
          </p>
          <Copy onClick={handleCopy} className="cursor-pointer " />
        </div>
        <div className="flex gap-2 justify-center px-4 my-4 mt-8">
          <Logs />
          <span className="w-full text-[#3F3C3C] ">
            Description{" "}
            <p className="text-[#727272] text-xs font-extralight">
              Click &apos;icon&apos; to change the description{" "}
            </p>
          </span>
        </div>
        <div className="w-full rounded-md bg-[#E7EFF2] border border-[#C4BBBB] text-[#474444] text-sm p-4 min-h-24">
          <textarea
            onChange={(e) => debounceUpdateDescription(e.target.value)}
            className="resize-none w-full outline-none truncate"
            placeholder="Put your Bio-Description here .It will show to your's page."
            defaultValue={description}
          ></textarea>
        </div>
      </div>

      {/*MANAGE PAGE THEME*/}

      <Protect currentPlan={currentPlan}>
        <div className="bg-white  lg:pr-11  border p-4 my-3 border-blue-200 rounded-lg shadow-lg">
          <div className="flex gap-3 px-4">
            <Image
              src="/pencil.png"
              alt="#pencil_icon"
              width={20}
              height={20}
              className="cursor-pointer h-5 m-1"
            />
            <span className="w-full text-[#3F3C3C] ">
              Choose Your Theme
              <p className="text-[#727272] text-xs font-extralight">
                Get your Best design look for your page
              </p>
            </span>
          </div>
          <div className="my-3 flex lg:flex-wrap justify-between flex-wrap-reverse w-full lg:px-11 lg:py-7 p-4">
            <div className="grid place-items-center  lg:w-1/2 my-5 w-full">
              <div className="my-3">
                <h1 className="text-3xl text-center font-extralight text-[#7B7777]">
                  Select a theme that defines you
                </h1>
                <h1 className="font-bold text-center text-[#4e4646]">
                  then tap <p className="inline text-[#23cf32]"> Update </p>
                  to lock it in
                </h1>
              </div>
              <div className="flex  justify-evenly gap-4 items-center flex-wrap ">
                {themes.map((theme, index) => (
                  <div
                    onClick={() => handleTheme(index)}
                    key={index}
                    className={cn(
                      "w-14 h-14 rounded-full cursor-pointer active:scale-[.97] ",
                      theme,
                      currentTheme?.name === themesData[index].name &&
                        "border-4 border-[#3b3b3bc2]"
                    )}
                  ></div>
                ))}
              </div>

              <button
                onClick={updateTheme}
                className="text-[#625D5D] my-3 rounded-md border border-[#A8AEB2] text-sm font-semibold shadow-lg px-7 py-2 cursor-pointer active:scale-[.98]"
              >
                {loading ? "Updating..." : "Update Your Theme"}
              </button>
            </div>
            <Mobiledemo currentTheme={currentTheme} />
          </div>
        </div>
      </Protect>
    </div>
  );
};

export default Personalize;
