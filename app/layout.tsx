import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Smartlink",
  description: "This is the smartest way to link",
  keywords: ["dashboard", "analytics", "nextjs", "smartlink"],
  openGraph: {
    title: "Smartlink",
    description: "smartlink landing page.",
    url: "https://smartlink.vercel.app",
    siteName: "Smartlink",
    /* images: [
      {
        url: "https://example.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ], */
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors position="top-center" />
        {children}
      </body>
    </html>
  );
}
