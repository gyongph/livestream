"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootContainer from "@/components/RootContainer";
const inter = Inter({ subsets: ["latin"] });

import { EnableNextAppRouterViewTransitions } from "use-view-transitions/next";
// import ProgressBar from "@/components/ProgressBar";
import { AppProgressBar } from "next-nprogress-bar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <EnableNextAppRouterViewTransitions />
      <body className={inter.className + " bg-black"}>
        <RootContainer>
          <AppProgressBar />
          {children}
        </RootContainer>
      </body>
    </html>
  );
}
