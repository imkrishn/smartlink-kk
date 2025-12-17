import React from "react";

const Protect = ({
  children,
  currentPlan,
}: {
  children: React.ReactNode;
  currentPlan: string;
}) => {
  const isPro = currentPlan === "pro";

  return (
    <div className="relative w-full">
      {/* Always render children */}
      <div className={isPro ? "" : "pointer-events-none  select-none"}>
        {children}
      </div>

      {/* Show fallback only if NOT pro */}
      {!isPro && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-50 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700">
            🔒 This feature is for Pro users only
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Upgrade your plan to unlock full functionalities.
          </p>
        </div>
      )}
    </div>
  );
};

export default Protect;
