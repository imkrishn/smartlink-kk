export const dynamic = "force-dynamic";

import Billing from "@/components/Billing";
import Logo from "@/components/Logo";
import { getLoggedInUser } from "@/lib/getLoggedInUser";
import { ArrowLeft } from "lucide-react";
import React from "react";

const Page = async () => {
  const user = await getLoggedInUser();

  if (!user) return;
  const userId = user.id;
  const currentPlan = user.currentPlan;
  return (
    <div className="py-4">
      <Logo />
      <div className="bg-white shadow-lg p-9 my-3 rounded-lg lg:mx-48 m-4">
        <h1 className="text-3xl font-extrabold text-[#3d3d3d]">Upgrade Plan</h1>
        <p className="text-sm text-[#838282] mx-1">
          Choose the plan that is right for you
        </p>
        <a
          href={`${process.env.NEXT_PUBLIC_URL}/dashboard`}
          className="text-[#6e6c6c] flex gap-2 items-center m-2 font-bold text-xs cursor-pointer  active:text-slate-700"
        >
          <ArrowLeft />
          <p>Back to dashboard</p>
        </a>
        <Billing currentPlan={currentPlan} userId={userId} />
      </div>
    </div>
  );
};

export default Page;
