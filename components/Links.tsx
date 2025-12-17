import LinkBoard from "./LinkBoard";

const Links = ({
  userId,
  currentPlan,
}: {
  userId?: string;
  currentPlan: string;
}) => {
  return (
    <div className="bg-white  shadow-lg p-9 my-3 rounded-lg">
      {/*HEADING*/}

      <div className="flex items-center">
        <span className="text-2xl font-extralight w-full text-[#575555]">
          Manage Your Links
          <h1 className="text-[#B3ACAC]  font-semibold text-xs">
            Easily design and manage your custom bio page.
          </h1>
        </span>
      </div>

      {/*MANAGE LINKS*/}

      <LinkBoard userId={userId} currentPlan={currentPlan} />
    </div>
  );
};

export default Links;
