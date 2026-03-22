export const dynamic = "force-dynamic";

import { getLoggedInUser } from "@/lib/getLoggedInUser";
import React from "react";

const Page = async () => {
  const user = await getLoggedInUser();

  if (!user) return;
  const userId = user.id;
  const currentPlan = user.currentPlan;
  return <div className="w-full lg:px-48 p-4"></div>;
};

export default Page;
