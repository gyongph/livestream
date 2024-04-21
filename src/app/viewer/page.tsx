"use client";
import Hls from "hls.js";
import hls from "hls.js";
import React, { ElementRef, useEffect } from "react";
import ReactHlsPlayer from "react-hls-player";
const page: React.FC = () => {
  const playerRef = React.useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (playerRef.current) {
      const hls = new Hls();
      hls.loadSource("https://192.168.100.7:4343/master.m3u8");
      hls.attachMedia(playerRef.current);
      hls.on(Hls.Events.ERROR, (err, data) => {
        console.log(err, data);
        hls.recoverMediaError();
        hls.loadSource("https://192.168.100.7:4343/master.m3u8");
      });
      hls.on(Hls.Events.FRAG_PARSING_INIT_SEGMENT, function (event, data) {
        console.log(data);
      });
    }
  }, [playerRef]);
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

export default page;
