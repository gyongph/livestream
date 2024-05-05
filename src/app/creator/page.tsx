"use client";
import CreatorPage from "@/modules/livestream/pages/creator.page";
import { useRouter } from "next-nprogress-bar";
import { useViewTransition } from "use-view-transitions/react";

export default function Page({ searchParams: { debugMode = false } }) {
  const router = useRouter();
  const { startViewTransition } = useViewTransition();
  router.prefetch("/");
  return (
    <CreatorPage
      searchParams={{ debugMode: debugMode }}
      onEnded={() => {
        startViewTransition(() => router.push("/"));
      }}
    />
  );
}
