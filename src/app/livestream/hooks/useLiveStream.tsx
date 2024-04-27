import {
  Context,
  Dispatch,
  ElementRef,
  RefObject,
  SetStateAction,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";

type LiveState = {
  isActive: boolean;
  audio: boolean;
  video: boolean;
  facingMode?: "user" | "environment";
};

export let context: Context<{
  liveState: LiveState;
  stream: MediaStream | undefined;
  havePermission: boolean;
  playerRef: RefObject<HTMLVideoElement>;
  setLiveState: Dispatch<SetStateAction<LiveState>>;
  deviceCapabilities?: any;
}>;

export default function useLiveStream() {
  const [stream, setStream] = useState<MediaStream>();
  const [havePermission, setHavePermission] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState("");
  const [liveState, setLiveState] = useState<LiveState>({
    isActive: false,
    audio: false,
    video: false,
    facingMode: "user",
  });
  const playerRef = useRef<ElementRef<"video">>(null);
  context = createContext({
    liveState,
    stream,
    havePermission,
    playerRef,
    setLiveState,
  });

  const getMediaStream = async () => {
    const requestStream = await window.navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .catch((err) => console.log({ err }));
    if (!requestStream) return setHavePermission(false);
    setHavePermission(true);
    setStream(requestStream);
    setLiveState({
      audio: true,
      video: true,
      isActive: true,
      facingMode: "environment",
    });
    const videoTracks = requestStream.getVideoTracks().pop();
    if (!videoTracks) return;
    const settings = videoTracks.getCapabilities() || {};
    const mediaCapabilities = navigator.mediaCapabilities;
    const supportedConstraints =
      navigator.mediaDevices.getSupportedConstraints();
    const devices = await navigator.mediaDevices.enumerateDevices();
    setDeviceCapabilities(
      JSON.stringify(
        { settings, mediaCapabilities, supportedConstraints, devices },
        undefined,
        2
      )
    );
  };

  useEffect(() => {
    if (!stream || !playerRef.current) return;
    if (playerRef.current instanceof Element) {
      playerRef.current.srcObject = stream;
    }
  }, [stream, playerRef.current]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    getMediaStream();
  }, []);
  return { playerRef, liveState, stream, deviceCapabilities };
}
