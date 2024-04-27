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
import { useState } from "react";

export function LiveStateIndicator() {
  const ctx = useLiveStreamContext();
  return (
    <div
      data-active={ctx.liveState.status === "live"}
      className="data-[active=true]:bg-red-500 bg-slate-600 text-white px-5 rounded-full w-fit absolute top-3 left-3 uppercase"
    >
      {ctx.liveState.status}
    </div>
  );
}

export function MicController() {
  const { liveState, toggleMic } = useController();
  return (
    <button className="active:scale-90 duration-100 ease-in-out">
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
    </button>
  );
}

export function CamController() {
  const { liveState, toggleCam } = useController();
  return (
    <button className="active:scale-90 duration-100 ease-in-out">
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
    </button>
  );
}
export function CamFacingModeController() {
  const { toggleCamFacingMode } = useController();
  const [isLoading, setIsLoading] = useState(false);
  const clickHandler = async () => {
    setIsLoading(true);
    await toggleCamFacingMode();
    setIsLoading(false);
  };
  return (
    <button className="active:-rotate-12 duration-100 ease-in-out active:scale-95">
      <MdCameraswitch
        aria-disabled={isLoading}
        onClick={clickHandler}
        className="fill-white rotate-0 w-8 h-8 aspect-square aria-disabled:pointer-events-none drop-shadow-md"
      />
    </button>
  );
}

export function LiveAudienceCountIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="text-white font-medium">200</div>
      <FaEye className="fill-white  w-8 h-8 scale-75" />
    </div>
  );
}

export function StopLiveStreamBtn() {
  const { endLiveStream } = useController();
  return (
    <button className="active:translate-x-1 duration-100 ease-in-out">
      <MdExitToApp
        onClick={endLiveStream}
        className="fill-white w-8 h-8 aspect-square drop-shadow-md"
      />
    </button>
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
