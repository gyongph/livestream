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
import ErrorBox from "../components/ErrorBox";
const guestID = v4();

export default function CreatorPage({
  searchParams = { debugMode: false },
  onEnded = () => {},
}) {
  return (
    <LiveStreamer streamIngestURL="" onEnded={onEnded}>
      <div
        style={{
          viewTransitionName: "player",
        }}
        className="w-full h-full mt-0 relative vt-name-[player]"
      >
        <LiveStreamPreview />
        <LiveStatusIndicator />
        <ControlPanel>
          <LiveAudienceCountIndicator />
          <EndLiveStreamBtn />
          <CamFacingModeController />
          <CamController />
          <MicController />
        </ControlPanel>
        <ErrorBox />
      </div>

      {searchParams.debugMode && <DebugInfoBox />}
    </LiveStreamer>
  );
}
