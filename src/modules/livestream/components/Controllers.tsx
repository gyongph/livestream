import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import { useController } from "../hooks";
import {
  MdCameraswitch,
  MdVideocam,
  MdVideocamOff,
  MdExitToApp,
} from "react-icons/md";
import { useState } from "react";

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

export function EndLiveStreamBtn() {
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
