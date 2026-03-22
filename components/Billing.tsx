"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { database } from "@/app/appwrite";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISABLE_KEY!
);

const CheckoutForm = ({ userId }: { userId: string }) => {
  const stripe = useStripe();
  const router = useRouter();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
    });
    const { clientSecret } = await res.json();

    const cardElement = elements?.getElement(CardElement);

    if (!cardElement) {
      console.error("CardElement not found");
      return;
    }

    const result = await stripe?.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result?.error) {
      setMessage(result.error.message || "Payment failed");
    } else if (result?.paymentIntent?.status === "succeeded") {
      await database.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
        userId,
        { currentPlan: "pro" }
      );

      setMessage("✅ Payment successful!");
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="border p-3 rounded bg-white shadow-inner">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 px-4 rounded-lg transition"
      >
        {loading ? "Processing..." : "Pay $21"}
      </button>
      {message && <p className="text-red-500 text-sm text-center">{message}</p>}
    </form>
  );
};

const Billing = ({
  currentPlan,
  userId,
}: {
  currentPlan: string;
  userId: string;
}) => {
  return (
    <div className="m-7 flex lg:flex-row flex-col justify-evenly gap-6">
      <div className="shadow-md rounded-lg border border-blue-200 p-8 w-full">
        <h1 className="text-3xl font-bold text-gray-800">
          $0/<span className="text-xl">month</span>
        </h1>
        <ul className="text-sm text-gray-600 mt-4 list-disc ml-4 space-y-1">
          <li>Limited Analytics use</li>
          <li>Limited default theme</li>
          <li>Max 4 links</li>
          <li>No countries data access</li>
        </ul>
        {currentPlan === "free" && (
          <button className="mt-6 px-4 py-2 bg-blue-300 font-bold text-white rounded-lg">
            Current Plan
          </button>
        )}
      </div>

      <div className="shadow-md rounded-lg border border-blue-200 p-8 w-full">
        <h1 className="text-3xl font-bold text-gray-800">
          $21/<span className="text-xl">month</span>{" "}
          <span className="text-sm font-medium">(Pro)</span>
        </h1>
        <ul className="text-sm text-gray-600 mt-4 list-disc ml-4 space-y-1">
          <li>Full Analytics access</li>
          <li>All theme access</li>
          <li>Unlimited links</li>
          <li>Countries based analytics</li>
        </ul>

        <Sheet>
          <SheetTrigger>
            <button
              disabled={currentPlan === "pro"}
              className={cn(
                "mt-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 transition",
                currentPlan === "pro" && "bg-blue-400"
              )}
            >
              {currentPlan === "pro" ? "Current Plan" : "Upgrade"}
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[420px]">
            <div className="p-4">
              <h1 className="text-gray-700 font-bold text-2xl mb-2">
                Checkout
              </h1>
              <hr className="mb-4" />

              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>
                  <strong>Plan:</strong> Pro
                </p>
                <p>
                  <strong>Price:</strong> $21 (one-time)
                </p>
              </div>

              <Elements stripe={stripePromise}>
                <CheckoutForm userId={userId} />
              </Elements>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Billing;
