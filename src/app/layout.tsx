"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootContainer from "@/components/RootContainer";
const inter = Inter({ subsets: ["latin"] });

import {
  EnableNextAppRouterViewTransitions,
  useViewTransition,
} from "use-view-transitions/next";
// import ProgressBar from "@/components/ProgressBar";
import { AppProgressBar, useRouter } from "next-nprogress-bar";
import { startTransition, useCallback, useEffect } from "react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { startViewTransition } = useViewTransition();
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener(
      "popstate",
      useCallback(() => {
        startViewTransition();
      },[])
    );
  }, []);
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
