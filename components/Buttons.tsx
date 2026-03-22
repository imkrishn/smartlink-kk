"use client";

import { useTimer } from "@/hooks/useTimer";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

type OtpBtnProps = {
  onClick: () => Promise<string | void>;
  initialTime?: number;
};

export function LoginBtn() {
  return (
    <button className="text-white font-bold lg:px-3 px-2 py-1 cursor-pointer active:scale-[.96] rounded-md lg:text-sm text-xs shadow-2xl drop-shadow-white bg-[#6398ca]">
      <a href={`${process.env.NEXT_PUBLIC_URL}/auth/login`}>Login</a>
    </button>
  );
}

export function SubmitBtn({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      className={cn(
        "text-white font-bold px-3 w-full py-2 cursor-pointer active:scale-[.96] rounded-md lg:text-sm text-xs shadow-lg ",
        loading ? "bg-[#7cacda] cursor-default" : "bg-[#6398ca]"
      )}
      disabled={loading}
    >
      {loading ? "Submitting" : "Submit"}
    </button>
  );
}

export function OtpBtn({ onClick, initialTime = 60 }: OtpBtnProps) {
  const [clicked, setClicked] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(0);
  const timeLeft = useTimer(clicked ? initialTime : 0, timerKey);

  useEffect(() => {
    if (timeLeft === 0) setClicked(false);
  }, [timeLeft]);

  async function onSubmit() {
    if (clicked) return;

    const result = await onClick();
    if (result !== "failed") {
      setClicked(true);
      setTimerKey((prev) => prev + 1);
    }
  }

  return (
    <div
      onClick={onSubmit}
      aria-disabled={clicked}
      className={cn(
        "px-2 py-1 text-sm whitespace-nowrap rounded-full cursor-pointer text-white select-none",
        clicked
          ? "bg-slate-600 cursor-not-allowed"
          : "bg-slate-950 hover:bg-slate-800 active:scale-95"
      )}
    >
      {clicked ? `${timeLeft}s` : "Send OTP"}
    </div>
  );
}

export const SignupBtn = ({ arrow }: { arrow?: boolean }) => {
  return (
    <button className="bg-white font-semibold lg:py-1.5 lg:px-3 p-2 min-w-max rounded-md my-4 cursor-pointer active:scale-[.98] lg:text-sm text-xs shadow-[0_4px_6px_rgba(0,0,0,0.6),_0_1px_3px_rgba(0,0,0,0.08)] border border-[#6398CA] text-[#6398CA]">
      <a href={`${process.env.NEXT_PUBLIC_URL}/auth/signup`}>
        Get Started For Free
      </a>
      {arrow && (
        <Image
          width={35}
          height={50}
          src="/arrow-right.png"
          alt="#arrowright_icon"
          className="h-7 m-2  inline"
        />
      )}
    </button>
  );
};
