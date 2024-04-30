"use client";

import RootContainer from "@/components/RootContainer";
import { LiveStreamPreview } from "@/modules/livestream/components";
import { LiveStreamer } from "@/modules/livestream/components/LiveStreamer";
import {
  LiveAudienceCountIndicator,
  LiveStatusIndicator,
  MicController,
  CamController,
  EndLiveStreamBtn,
  CamFacingModeController,
  DebugInfoBox,
  ControlPanel,
} from "@/modules/livestream/components";
import { v4 } from "uuid";
const guestID = v4();

export default function CreatorPage({
  searchParams = { debugMode: false },
  onEnded = () => {},
}) {
  return (
    <LiveStreamer streamIngestURL="" onEnded={onEnded}>
      <div className="w-full h-full mt-0 relative drop-shadow-2xl shadow-sm shadow-white overflow-hidden">
        <LiveStreamPreview />
        <LiveStatusIndicator />
        <ControlPanel>
          <LiveAudienceCountIndicator />
          <EndLiveStreamBtn />
          <CamFacingModeController />
          <CamController />
          <MicController />
        </ControlPanel>
      </div>

      {searchParams.debugMode && <DebugInfoBox />}
    </LiveStreamer>
  );
}
