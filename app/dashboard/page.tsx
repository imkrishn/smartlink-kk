export const dynamic = "force-dynamic";

import Analytics from "@/components/Analytics";
import Links from "@/components/Links";
import Personalize from "@/components/Personalize";
import Protect from "@/components/Protect";
import { getLoggedInUser } from "@/lib/getLoggedInUser";
import React from "react";

const Page = async () => {
  const user = await getLoggedInUser();

  if (!user) return;
  const userId = user.id;
  const currentPlan = user.currentPlan;
  return (
    <div className="w-full lg:px-48 p-4">
      <Protect currentPlan={currentPlan}>
        <Analytics currentPlan={currentPlan} userId={userId} />
      </Protect>
      <Personalize
        currentPlan={currentPlan}
        userId={userId}
        theUsername={user.username}
        theme={user.theme}
        description={user.description}
        profileUrl={user.profileUrl}
      />
      <Links currentPlan={currentPlan} userId={userId} />
    </div>
  );
};

export default Page;
