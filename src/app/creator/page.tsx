import CreatorPage from "@/modules/livestream/pages/creator.page";

export default function Page({ searchParams: { debugMode = false } }) {
  return <CreatorPage searchParams={{ debugMode: debugMode }} />;
}
