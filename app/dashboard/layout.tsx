import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { getLoggedInUser } from "@/lib/getLoggedInUser";
import { ReactNode } from "react";
import SignOut from "@/components/SignOut";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getLoggedInUser();

  if (!user) {
    return (
      <html lang="en">
        <body>
          <div className="flex justify-center items-center h-screen text-xl text-gray-600">
            Server crash . Refresh the page .
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <div className="flex justify-between items-center gap-4 px-4">
          <Logo />
          <a
            href={`${process.env.NEXT_PUBLIC_URL}/upgrade`}
            className="font-extrabold hover:underline active:text-[#0e0d5f] text-[#1411bb] whitespace-nowrap text-sm"
          >
            Upgrade Plan
          </a>
          <SignOut />
        </div>

        {/* Optional: pass user to children via wrapper */}
        <div className="min-h-screen">{children}</div>

        <Footer />
      </body>
    </html>
  );
}
