import Mobiledemo from "@/components/Mobiledemo";
import Navbar from "@/components/Navbar";
import { SignupBtn } from "@/components/Buttons";
import { Link } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="lg:px-52 p-4 overflow-clip flex lg:flex-row flex-col justify-between items-center">
        <div>
          <h1 className="text-3xl leading-relaxed font-bold text-[#343536]">
            One <p className="text-[#6398CA] inline">link</p> to
          </h1>
          <h1 className="text-[#535151] text-5xl font-extrabold">
            Rule Them All
            <Image
              width={60}
              height={60}
              src="/chain.png"
              alt="#link_icon"
              className=" h-14 mx-4 mb-5 inline"
            />
          </h1>
          <div className="text-center max-w-max text-[#5D5B5B]">
            <h2>
              Create your personalized{" "}
              <p className="text-[#0ca10c] font-semibold inline">Smart</p>
              <p className="text-[#6398CA] font-bold inline">link</p> and
              connect your audience
            </h2>
            <h2 className="font-bold">
              to all of your content in just one link
            </h2>
          </div>
          <SignupBtn arrow={true} />

          <div className="text-[#333232] py-4 flex gap-3  flex-wrap">
            <span className="grid place-items-center bg-white rounded-2xl shadow-lg max-w-max lg:w-56 p-5">
              <h1 className="font-semibold text-center leading-tight">
                <Link stroke="#3a7dbb" className="inline m-1" />
                Customizable Links
              </h1>
              <p className="text-[#6D6969] text-sm pl-7 p-3">
                Personalize your links and branding with the themes , images and
                icons
              </p>
            </span>
            <span className=" py-5.5 bg-white rounded-2xl shadow-lg max-w-max lg:w-60 p-3">
              <div className="flex">
                <Image
                  src="/analytics.png"
                  alt="#analytics_icon"
                  width={40}
                  height={20}
                  className=" m-1"
                />
                <h1 className="font-semibold px-2  ">Analytics & Insights</h1>
              </div>
              <p className="text-[#6D6969] text-sm pl-7 p-3">
                Track clicks and user interaction with built-in and analytics
              </p>
            </span>
          </div>
        </div>
        <Mobiledemo social={true} />
      </main>
    </div>
  );
}
