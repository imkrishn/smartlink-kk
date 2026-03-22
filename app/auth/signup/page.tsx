"use client";

import { OtpBtn, SubmitBtn } from "@/components/Buttons";
import Logo from "@/components/Logo";
import { BookLock, Check, Eye, EyeClosed, Lock, Mail, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import signupSchema from "@/schemas/signupSchema";
import { account, database, ID } from "@/app/appwrite";
import { Query } from "appwrite";
import { toast } from "sonner";
import bcrpytjs from "bcryptjs";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";

const validity = [
  "At least one lowercase",
  "At least one uppercase",
  "At least one number",
  "Minimum 8 characters",
];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

const Page = () => {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [intialFlag, setIntialFlag] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<"password" | "text">(
    "password"
  );
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<
    "password" | "text"
  >("password");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);
    setIntialFlag(true);
    const result = signupSchema.safeParse(updatedForm);

    if (!result.success) {
      const zodErrors: string[] = result.error.issues.map((err) => err.message);
      setErrors(zodErrors);
    } else {
      setErrors([]);
    }
  };

  {
    /*OTP SEND TO MAIL*/
  }

  async function handleOtp(): Promise<"success" | "failed"> {
    try {
      const email = form.email.trim();

      if (!email || !emailRegex.test(email)) {
        toast.error("Enter a valid email address.");
        return "failed";
      }

      const existingUser = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
        [Query.equal("email", email)]
      );

      const userDoc = existingUser.documents[0];

      if (existingUser.total > 0) {
        if (userDoc.verified) {
          toast.warning("User exists. Please proceed to login.");
          return "failed";
        }
      }
      const userId = userDoc ? userDoc.$id : ID.unique();

      if (!userDoc) {
        await database.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
          userId,
          { email }
        );
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const templateParams = { email, passcode: otpCode };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
        publicKey: PUBLIC_KEY,
      });

      // Set verification expiry time (+15 minutes)
      const verificationTime = new Date(Date.now() + 15 * 60 * 1000);

      await database.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
        userId,
        {
          verificationCode: otpCode,
          verificationTime,
        }
      );

      toast.success("OTP sent. Check your email.");
      return "success";
    } catch (error) {
      console.error("OTP Error:", error);
      toast.error("Failed to send OTP. Try again.");
      return "failed";
    }
  }

  {
    /*SIGNUP FORM*/
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!intialFlag || errors.length !== 0) {
      setError(errors[0]);
      return;
    }

    try {
      setLoading(true);

      const { email, password, otp } = form;

      if (otp.trim() === "") {
        toast.warning("Please enter the otp");
        return;
      }

      const user = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
        [Query.equal("email", email)]
      );

      if (user.total > 0 && user.documents[0].verified) {
        toast.warning("User exist with this mail.Proceed to login");
        return;
      }

      if (
        user.documents[0].verificationCode === otp &&
        Date.now() < new Date(user.documents[0].verificationTime).getTime()
      ) {
        const salt = await bcrpytjs.genSalt(10);
        const hashedPassword = await bcrpytjs.hash(password, salt);

        await database.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
          user.documents[0].$id,
          {
            password: hashedPassword,
            verificationCode: null,
            verificationTime: null,
            verified: true,
          }
        );

        await account.create(ID.unique(), email, password);

        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        toast.error("OTP is expire or wrong.");
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className=" text-[#6b6a6a] lg:py-2  overflow-clip">
      <Logo />
      <div className="flex lg:flex-row  flex-col-reverse lg:px-48 p-6 justify-between items-center">
        <span className="grid place-items-center">
          <Image
            src="/signup-bg.png"
            width={400}
            height={350}
            alt="#login_bg"
            className="bg-cover my-2 "
          />
          <h1 className="text-2xl font-semibold">
            Connect <p className="inline text-[#0ca10c]">smart</p> with One{" "}
            <p className="inline text-[#6398CA]">link</p> for
          </h1>
          <h1 className="text-3xl font-bold">Infinite reach</h1>
        </span>
        <div className="bg-white rounded-2xl text-center p-7 lg:mt-1 mt-6  shadow-lg flex flex-col justify-center items-center">
          <h1 className="text-3xl text-[#3F3B3B] font-black ">Join for Free</h1>
          <h3 className="text-xs font-extralight mb-4">
            Sign up to Smartlink 🔗
          </h3>
          {error && <p className="text-sm mt-2 text-[#F80F13]">{error}</p>}
          <form onSubmit={handleSubmit} className="text-sm">
            <div className="my-2 rounded-lg bg-[#F3F0F0] flex gap-2 items-center px-3 py-2">
              <Mail />
              <input
                disabled={loading}
                onChange={handleChange}
                name="email"
                type="email"
                placeholder="Email"
                className="px-4  w-full  outline-none bg-transparent"
              />
            </div>
            <div className="my-2 rounded-lg bg-[#F3F0F0] flex gap-2 items-center px-3 py-2">
              <BookLock width={30} />
              <input
                disabled={loading}
                onChange={handleChange}
                name="otp"
                type="text"
                placeholder="Otp"
                className="px-4  w-full  outline-none bg-transparent"
              />
              <OtpBtn onClick={handleOtp} />
            </div>
            <div className="my-2 rounded-lg bg-[#F3F0F0] flex gap-2 items-center px-3 py-2">
              <Lock />
              <input
                disabled={loading}
                onChange={handleChange}
                name="password"
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

            <div className="my-2 rounded-lg bg-[#F3F0F0] flex gap-2 items-center px-3 py-2">
              <Lock />
              <input
                disabled={loading}
                onChange={handleChange}
                name="confirmPassword"
                type={confirmPasswordVisible}
                placeholder="Confirm Password"
                className="px-4  w-full  outline-none bg-transparent"
              />
              {confirmPasswordVisible === "text" ? (
                <Eye onClick={() => setConfirmPasswordVisible("password")} />
              ) : (
                <EyeClosed onClick={() => setConfirmPasswordVisible("text")} />
              )}
            </div>
            <div className="text-[14px] p-2.5 ">
              {validity.map((validity, index) =>
                !intialFlag || errors.includes(validity) ? (
                  <p
                    key={index}
                    className="flex gap-2 items-center text-[#F80F13]"
                  >
                    <X />
                    {validity}
                  </p>
                ) : (
                  <p
                    key={index}
                    className="flex gap-2 items-center text-[#12AD34]"
                  >
                    <Check />
                    {validity}
                  </p>
                )
              )}
            </div>
            <SubmitBtn loading={loading} />
          </form>
        </div>
      </div>
    </main>
  );
};

export default Page;
