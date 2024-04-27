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
import { v4 } from "uuid";
const guestID = v4();

export default function Page({ searchParams: { debugMode = false } }) {
  const { playerRef, liveState } = useLiveStream({
    streamIngestURL: `https://livestream-service.gybeongotan.dev/live/${guestID}`,
  });
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
        <div
          data-ended={liveState.status === "ended"}
          className="absolute flex flex-col items-end gap-7 right-3 top-3 data-[ended=true]:opacity-55 data-[ended=true]:pointer-events-none"
        >
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
