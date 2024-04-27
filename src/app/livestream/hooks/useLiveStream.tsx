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
};
type ReturnType = {
  liveState: LiveState;
  stream?: MediaStream;
  havePermission: boolean;
  playerRef: RefObject<HTMLVideoElement>;
  setLiveState: Dispatch<SetStateAction<LiveState>>;
  debugInfo?: any;
};

export let LiveStreamContext: Context<ReturnType>;

export default function useLiveStream() {
  const [stream, setStream] = useState<MediaStream>();
  const [havePermission, setHavePermission] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [liveState, setLiveState] = useState<LiveState>({
    isActive: false,
    audio: false,
    video: false,
  });
  const playerRef = useRef<ElementRef<"video">>(null);
  LiveStreamContext = createContext<ReturnType>({
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
    });
    const videoSettings = requestStream.getVideoTracks().pop()?.getSettings();
    const devices = await navigator.mediaDevices.enumerateDevices();
    const otherVideoInput = devices.find(
      (device) =>
        device.deviceId !== videoSettings?.deviceId &&
        device.kind === "videoinput"
    );
    setDebugInfo(
      JSON.stringify({ videoSettings, devices, otherVideoInput }, null, 2)
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
  return { playerRef, liveState, stream, debugInfo };
}
