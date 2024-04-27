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
  status: "initializing" | "waiting" | "live" | "idle" | "ended" | "error";
  audio: boolean;
  video: boolean;
};

type LiveStreamInitOptions = {
  streamIngestURL: string;
  onEnded?: Function;
  onError?: Function;
};

type LiveStreamReturnType = {
  liveState: LiveState;
  stream?: MediaStream;
  havePermission: boolean;
  playerRef: RefObject<HTMLVideoElement>;
  setLiveState: Dispatch<SetStateAction<LiveState>>;
  debugInfo?: any;
  onEnded?: Function;
  onError?: Function;
};

export let LiveStreamContext: Context<LiveStreamReturnType>;

export function useLiveStream(options: LiveStreamInitOptions) {
  const [stream, setStream] = useState<MediaStream>();
  const [havePermission, setHavePermission] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [liveState, setLiveState] = useState<LiveState>({
    status: "initializing",
    audio: false,
    video: false,
  });
  const playerRef = useRef<ElementRef<"video">>(null);
  LiveStreamContext = createContext<LiveStreamReturnType>({
    liveState,
    stream,
    havePermission,
    playerRef,
    setLiveState,
    onEnded: options.onEnded,
    onError: options.onError,
  });

  const getMediaStream = async () => {
    const requestStream = await window.navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          aspectRatio: 9 / 16,
        },
      })
      .catch((err) => console.log({ err }));
    if (!requestStream) return setHavePermission(false);
    setHavePermission(true);
    setStream(requestStream);
    setLiveState({
      audio: true,
      video: true,
      status: "waiting",
    });
    const videoTrack = requestStream.getVideoTracks().pop()
    const videoSettings = videoTrack?.getSettings();
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
