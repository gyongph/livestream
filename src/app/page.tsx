"use client";

import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { MdCameraswitch, MdExitToApp } from "react-icons/md";
import useLiveStream from "./livestream/hooks/useLiveStream";
import {
  LiveAudienceCountIndicator,
  LiveStateIndicator,
  MicController,
  CamController,
  StopLiveStreamBtn,
  CamFacingModeController,
} from "./livestream/components";

export default function Page() {
  const { playerRef, deviceCapabilities } = useLiveStream();
  return (
    <div className="bg-black relative">
      <div className="w-dvw h-dvh mt-0 relative">
        {playerRef && (
          <video
            onClick={(e) => {
              if (e.target instanceof HTMLVideoElement) { 
                if (e.target.paused) e.target.play();
                else e.target.pause();
              }
            }}
            muted
            ref={playerRef}
            className="w-full h-full"
            autoPlay
          ></video>
        )}
        <LiveStateIndicator />
        <div className="absolute flex flex-col items-end gap-7 right-3 top-3">
          <LiveAudienceCountIndicator />
          <CamFacingModeController />
          <StopLiveStreamBtn />
          <CamController />
          <MicController />
        </div>
      </div>

      <div className="whitespace-pre-line text-white break-all">
        {deviceCapabilities}
      </div>
    </div>
  );
}
