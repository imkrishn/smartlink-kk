import { cn } from "@/lib/utils";
import { Theme } from "@/types/themeType";
import Image from "next/image";
import React from "react";

const Mobiledemo = ({
  social,
  currentTheme,
}: {
  social?: boolean;
  currentTheme?: Theme;
}) => {
  return (
    <div
      className={cn(
        "lg:w-72 w-full h-full bg-[#FFFAFA] rounded-3xl pt-11 p-7 text-[#716B6B] shadow-lg border border-[#B4AAAA] grid place-items-center",
        currentTheme?.bg,
        currentTheme?.text
      )}
    >
      <Image
        src="/man.png"
        alt="#man_logo"
        width={100}
        height={100}
        className="rounded-full bg-cover p-1 bg-white "
      />
      <p className="text-xl font-bold ">@KrishnaYadav</p>
      <p className="text-xs font-light  text-center">
        Code flows in my veins as a bloody blood
      </p>
      <div className="w-full my-3 ">
        {["Portfolio", "Instagram", "Github", "Youtube"].map((link, index) => (
          <div
            key={index}
            className={cn(
              "w-full rounded-lg shadow-md border my-2 p-2 border-[#62BEF8] bg-[#c0d3df]",
              currentTheme?.linkBg
            )}
          >
            <p className="text-sm text-center font-semibold">{link}</p>
          </div>
        ))}
      </div>
      {social && (
        <div className="flex justify-center items-center">
          {["/instagram.png", "/x.png", "/linkedin.png"].map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={url}
              width={50}
              height={50}
              className="bg-cover p-2 rounded-md "
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Mobiledemo;
