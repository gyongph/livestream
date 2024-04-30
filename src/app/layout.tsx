import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import RootContainer from "@/components/RootContainer";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Livestream",
  description:
    "A personal project created by Gybe Ongotan, a free-lance web-developer.",
};

export default function RootLayout({
  children,
  creatorModal,
}: Readonly<{
  children: React.ReactNode;
  creatorModal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-black"}>
        <RootContainer>
          <NextTopLoader />
          {children}
          {creatorModal}
        </RootContainer>
      </body>
    </html>
  );
}
