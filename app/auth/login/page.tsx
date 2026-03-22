"use client";

import { account, database } from "@/app/appwrite";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { Query } from "appwrite";
import bcrypt from "bcryptjs";
import { Eye, EyeClosed, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<"password" | "text">(
    "password"
  );
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();

      const { email, password } = form;

      if (email.trim() === "" || password.trim() === "") return;

      setLoading(true);

      const user = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
        [Query.equal("email", email), Query.equal("verified", true)]
      );

      if (user.total === 0) {
        toast.warning("Registered or verfiy the mail");
        return;
      }

      const isRightPassword = await bcrypt.compare(
        password,
        user.documents[0].password
      );

      if (!isRightPassword) {
        toast.error("Password is Wrong.");
        return;
      }

      const session = await account.createEmailPasswordSession(email, password);

      const res = await fetch("/api/auth/sessionGenerate", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.userId}`,
        },
      });

      if (res.ok)
        window.location.href = `${process.env.NEXT_PUBLC_URL}/dashboard`;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className=" text-[#6b6a6a]   overflow-clip">
      <Logo />
      <div className="p-9 lg:px-48 flex  lg:flex-row flex-col items-center justify-between">
        <div className="max-w-max">
          <h1 className="text-2xl text-[#413F3F] my-3 font-extralight">
            Simplify your presence across the Internet
          </h1>
          <h1 className="text-xl font-bold text-center text-[#827C7C]">
            <p className="inline text-[#6398CA]">Link</p> Smarter ,{" "}
            <p className="inline text-[#0ca10c]">Grow</p> Faster
          </h1>
          <Image
            src="/login-bg.png"
            width={450}
            height={400}
            alt="#login_bg"
            className="bg-cover my-7 lg:block hidden"
          />
        </div>
        <div className="bg-white rounded-2xl text-center p-9 my-7 shadow-lg flex flex-col justify-center items-center">
          <h1 className="text-3xl text-[#3F3B3B] font-black ">Welcome Back</h1>
          <h3 className="text-xs font-extralight mb-4">
            Sign in to Smartlink 🔗
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="my-2 rounded-lg bg-[#F3F0F0] flex gap-2 items-center px-3 py-2">
              <Mail />
              <input
                onChange={handleOnChange}
                name="email"
                disabled={loading}
                type="email"
                placeholder="Email"
                className="px-4  w-full  outline-none bg-transparent"
              />
            </div>
            <div className="my-2 rounded-lg bg-[#F3F0F0] flex gap-2 items-center px-3 py-2">
              <Lock />
              <input
                onChange={handleOnChange}
                name="password"
                disabled={loading}
                type={passwordVisible}
                placeholder="Password"
                className="px-4  w-full  outline-none bg-transparent"
              />
              {passwordVisible === "text" ? (
                <Eye onClick={() => setPasswordVisible("password")} />
              ) : (
                <EyeClosed onClick={() => setPasswordVisible("text")} />
              )}
            </div>
            <p className="my-2 text-[#3580BE] text-sm text-right cursor-pointer active:scale-[.98]">
              <a href={`${process.env.NEXT_PUBLIC_URL}/auth/forgotPassword`}>
                Forgot Password
              </a>
            </p>
            <button
              type="submit"
              className={cn(
                "text-white font-bold px-3 w-full py-2   rounded-md lg:text-sm text-xs shadow-lg ",
                loading
                  ? "bg-[#b3cfe9] cursor-default"
                  : "bg-[#6398ca] active:scale-[.96] cursor-pointer"
              )}
              disabled={loading}
            >
              {loading ? "Logging" : "Login"}
            </button>
          </form>
          <span className="text-[#807B7B] text-sm mt-7">
            Don&apos;t have Account ?{" "}
            <p
              className="text-[#3580BE] inline cursor-pointer active:scale-[.98]"
              onClick={() => router.push("/auth/signup")}
            >
              Sign Up
            </p>
          </span>
        </div>
      </div>
    </main>
  );
};

export default Page;
