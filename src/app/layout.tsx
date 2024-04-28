import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Livestream",
  description:
    "A personal project created by Gybe Ongotan, a free-lance web-developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className+" bg-black"}>
        <NextTopLoader />
        {children}
      </body>
    </html>
  );
}
