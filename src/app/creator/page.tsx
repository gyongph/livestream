"use client";

import RootContainer from "@/components/RootContainer";
import { useLiveStream } from "@/modules/livestream/hooks";
import {
  LiveAudienceCountIndicator,
  LiveStatusIndicator,
  MicController,
  CamController,
  StopLiveStreamBtn,
  CamFacingModeController,
  DebugInfo,
  LiveStreamPreview,
} from "@/modules/livestream/ui-components";
import { v4 } from "uuid";
const guestID = v4();

export default function Page({ searchParams: { debugMode = false } }) {
  const { liveState } = useLiveStream({
    streamIngestURL: `https://livestream-service.gybeongotan.dev/live/${guestID}`,
  });
  return (
    <RootContainer>
      <div className="w-full h-full mt-0 relative border  rounded-md">
        <LiveStreamPreview />
        <LiveStatusIndicator />
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
    </RootContainer>
  );
}
