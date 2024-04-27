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
  const { playerRef } = useLiveStream();
  return (
    <div className="bg-black relative">
      <div className="w-dvw h-dvh mt-0 relative">
        {playerRef && (
          <video ref={playerRef} className="w-full h-full" controls></video>
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
    </div>
  );
}
