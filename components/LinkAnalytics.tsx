import { cn } from "@/lib/utils";
import { LinkAnalyticsData } from "@/types/analyticsTypes";
import { ArrowLeft, ExternalLink, TrendingUp } from "lucide-react";
import Image from "next/image";
import React from "react";
import AnalyticsBar from "./AnalyticsBar";
import Protect from "./Protect";

const LinkAnalytics = ({
  analytics,
  currentPlan,
}: {
  analytics: LinkAnalyticsData;
  currentPlan?: string;
}) => {
  const analyticsAssests = [
    {
      iconUrl: "/audience.png",
      heading: "Unique Visitors",
      value: analytics?.uniqueUsers,
      color: "text-[#1284BD] bg-[#87e0f92f]",
    },
    {
      iconUrl: "/cursor.png",
      heading: "Total Clicked",
      value: analytics?.totalClicks,
      color: "text-[#F56207] bg-[#ffd4a931]",
    },
    {
      iconUrl: "/globe.png",
      heading: "Countries",
      value: analytics?.countriesReached,
      color: "text-[#B80B36] bg-[#ffb7cb3f]",
    },
    ,
  ];

  return (
    <div className="lg:px-48 p-4 w-full ">
      <div className="bg-white shadow-lg p-9 my-3 rounded-lg select-none  ">
        <a
          href={`${process.env.NEXT_PUBLIC_URL}/dashboard`}
          className="text-[#6e6c6c] flex gap-2 items-center font-bold text-xs cursor-pointer  active:text-slate-700"
        >
          <ArrowLeft />
          <p>Back to dashboard</p>
        </a>
        <h1 className="text-[#000000d0] text-2xl  mt-4 mx-7 font-extrabold">
          {analytics.linkTitle}
        </h1>
        <span className="text-[#646161] font-extralight mx-7 text-xs flex items-center gap-2">
          <ExternalLink size={16} />
          {analytics.linkUrl}
        </span>
        <div className="w-full flex items-center gap-3 lg:flex-nowrap flex-wrap p-8">
          {analyticsAssests.map((assest, index) => (
            <span
              key={index}
              className={cn(
                " lg:w-72 w-full rounded-lg shadow-lg p-5",
                assest?.color
              )}
            >
              <div className=" flex justify-between ">
                <Image
                  src={assest?.iconUrl || "#"}
                  alt={assest?.iconUrl || ""}
                  width={30}
                  height={30}
                  className=" bg-cover"
                />
                <TrendingUp size={20} />
              </div>
              <span className=" flex justify-between items-center text-sm pr-3 pt-3">
                <p>{assest?.heading}</p>
                <p className="text-[#616060] text-xl font-extrabold">
                  {assest?.value}
                </p>
              </span>
            </span>
          ))}
        </div>

        {currentPlan && (
          <Protect currentPlan={currentPlan}>
            <div className="lg:px-7">
              <span className="flex items-center gap-2">
                <Image
                  src={"/analytics.png"}
                  alt="#analytics_icon"
                  height={35}
                  width={35}
                />
                <span>
                  <h1 className=" text-[#474646fa] font-extrabold">
                    Daily Performance
                  </h1>
                  <p className="text-xs text-[#5e5c5cd0] font-bold">
                    Last 30 days activity
                  </p>
                </span>
              </span>

              <AnalyticsBar
                data={currentPlan === "pro" ? analytics.dailyData : []}
              />
            </div>
            <div className="lg:px-7 my-5">
              <span className="flex items-center gap-2">
                <Image
                  src={"/globe.png"}
                  alt="#globe_icon"
                  height={35}
                  width={35}
                />
                <span>
                  <h1 className=" text-[#474646fa] font-extrabold">
                    Countries
                  </h1>
                  <p className="text-xs text-[#5e5c5cd0] font-bold">
                    Click disturbution by country
                  </p>
                </span>
              </span>

              {currentPlan === "pro" &&
                analytics.countryData.map((item, index) => (
                  <div key={index} className="flex items-center my-2 gap-3">
                    {/* Country Code */}
                    <div className="min-w-14 text-sm font-semibold text-gray-500">
                      {item.country}
                    </div>

                    {/* Progress Bar */}
                    <div className="relative flex-1 h-4 bg-gray-300  rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full py-1 text-white text-xs flex items-center justify-center"
                        style={{ width: `${item.percentage}%` }}
                      >
                        {item.clicks} {item.clicks === 1 ? "click" : "clicks"}
                      </div>
                    </div>

                    {/* Percentage */}
                    <div className="w-12 text-sm text-gray-600 text-right">
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                ))}
            </div>
          </Protect>
        )}
      </div>
    </div>
  );
};

export default LinkAnalytics;
