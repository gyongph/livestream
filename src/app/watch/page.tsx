"use client";

import usePlayer from "@/modules/livestream/hooks/usePlayer";

export default function WatchPage() {
  const { playerRef } = usePlayer({ src: "" });
  return (
    <div className="text-white w-full h-full relative">
      <video ref={playerRef} controls autoPlay className="w-full h-full" />
    </div>
  );
}
