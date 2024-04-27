"use client";

import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import {
  MdCameraswitch,
  MdExitToApp,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";

import { useController } from "./hooks/useController";
import { useLiveStreamContext } from "./hooks/useLiveStreamContext";

export function LiveStateIndicator() {
  const ctx = useLiveStreamContext();
  return (
    <div
      data-active={ctx.liveState.isActive}
      className="data-[active=true]:bg-red-500 bg-slate-600 text-white px-5 rounded-full w-fit absolute top-3 left-3"
    >
      {ctx.liveState.isActive ? "LIVE" : "OFFLINE"}
    </div>
  );
}

export function MicController() {
  const { liveState, toggleMic } = useController();
  return (
    <>
      {liveState.audio ? (
        <BsMicFill
          onClick={toggleMic}
          className="fill-white w-8 h-8 aspect-square drop-shadow-md"
        />
      ) : (
        <BsMicMuteFill
          onClick={toggleMic}
          className="fill-white w-8 h-8 aspect-square drop-shadow-md"
        />
      )}
    </>
  );
}

export function CamController() {
  const { liveState, toggleCam } = useController();
  return (
    <>
      {liveState.video ? (
        <MdVideocam
          onClick={toggleCam}
          className="fill-white w-8 h-8 aspect-square drop-shadow-md"
        />
      ) : (
        <MdVideocamOff
          onClick={toggleCam}
          className="fill-white w-8 h-8 aspect-square drop-shadow-md"
        />
      )}
    </>
  );
}
export function CamFacingModeController() {
  const { toggleCamFacingMode } = useController();
  return (
    <MdCameraswitch
      onClick={toggleCamFacingMode}
      className="fill-white w-8 h-8 aspect-square"
    />
  );
}

export function LiveAudienceCountIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="text-white">200</div>
      <FaEye className="fill-white" />
    </div>
  );
}

export function StopLiveStreamBtn() {
  const { endLiveStream } = useController();
  return (
    <MdExitToApp
      onClick={endLiveStream}
      className="fill-white w-8 h-8 aspect-square"
    />
  );
}

export function DebugInfo() {
  const { debugInfo } = useController();
  return (
    <div className="whitespace-pre-line bg-black text-white break-all">
      {debugInfo}
    </div>
  );
}
