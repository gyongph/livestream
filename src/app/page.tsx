"use client";

import useLiveStream from "./livestream/hooks/useLiveStream";
import {
  LiveAudienceCountIndicator,
  LiveStateIndicator,
  MicController,
  CamController,
  StopLiveStreamBtn,
  CamFacingModeController,
  DebugInfo,
} from "./livestream/components";

export default function Page({ searchParams: { debugMode = false } }) {
  const { playerRef } = useLiveStream();
  return (
    <div className="bg-black relative">
      <div className="w-dvw h-dvh mt-0 relative">
        {playerRef && (
          <video
            muted
            ref={playerRef}
            className="w-full h-full"
            autoPlay
          ></video>
        )}
        <LiveStateIndicator />
        <div className="absolute flex flex-col items-end gap-7 right-3 top-3">
          <LiveAudienceCountIndicator />
          <StopLiveStreamBtn />
          <CamFacingModeController />
          <CamController />
          <MicController />
        </div>
      </div>

      {debugMode && <DebugInfo />}
    </div>
  );
}
