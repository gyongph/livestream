"use client";
import Hls from "hls.js";
import { NextPage } from "next";
import React, { ElementRef, useEffect } from "react";
const Page: React.FC<{ searchParams: { guestID: string } }> = ({
  searchParams: { guestID },
}) => {
  const playerRef = React.useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (playerRef.current) {
      const hls = new Hls();
      hls.loadSource(
        `https://livestream.gybeongotan.dev:4343/${guestID}/master.m3u8`
      );
      hls.attachMedia(playerRef.current);
      hls.on(Hls.Events.ERROR, (err, data) => {
        console.log(err, data);
        hls.recoverMediaError();
        hls.loadSource(
          `https://livestream.gybeongotan.dev:4343/${guestID}/master.m3u8`
        );
        // hls.loadSource(`https://192.168.100.7:4343/${guestID}/master.m3u8`);
      });
      hls.on(Hls.Events.FRAG_PARSING_INIT_SEGMENT, function (event, data) {
        console.log(data);
      });
    }
  }, [playerRef.current]);
  return (
    <div className="w-full h-full">
      <video
        ref={playerRef}
        className="mx-auto border-rounded border-white border w-[500px] aspect-video"
        autoPlay
        controls
      />
    </div>
  );
};

export default Page;
