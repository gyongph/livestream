"use client"
import CreatorPage from "@/modules/livestream/pages/creator.page";
import { useRouter } from "next/navigation";

export default function Page({ searchParams: { debugMode = false } }) {
  const router = useRouter();
  router.prefetch("/");
  return (
    <CreatorPage
      searchParams={{ debugMode: debugMode }}
      onEnded={() => {
        router.push("/");
      }}
    />
  );
}
