import {
  Dispatch,
  ElementRef,
  ReactNode,
  RefObject,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type LiveState = {
  status: "initializing" | "waiting" | "live" | "idle" | "ended" | "error";
  audio: boolean;
  video: boolean;
  error?: string;
};

export type UseLiveStreamProps = {
  streamIngestURL: string;
  onEnded?: Function;
  onError?: Function;
};

export const LiveStreamContext = createContext<{
  streamIngestURL: string;
  liveState: LiveState;
  stream: MediaStream | undefined;
  havePermission: boolean;
  playerRef: RefObject<HTMLVideoElement>;
  setLiveState: Dispatch<SetStateAction<LiveState>>;
  debugInfo?: any;
} | null>(null);

export const useLiveStreamContext = () => {
  const ctx = useContext(LiveStreamContext);
  if (!ctx) throw new Error("Component must be placed inside LiveStreamer");
  return ctx;
};

export const useLiveStreamer = ({
  streamIngestURL,
  onEnded,
  onError,
}: UseLiveStreamProps) => {
  const [stream, setStream] = useState<MediaStream>();
  const [havePermission, setHavePermission] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [liveState, setLiveState] = useState<LiveState>({
    status: "initializing",
    audio: false,
    video: false,
  });
  const playerRef = useRef<ElementRef<"video">>(null);

  const getMediaStream = async () => {
    const requestStream = await window.navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .catch((err: Error) => {
        onError && onError(err);
        setLiveState((curr) => ({
          ...curr,
          error: err.message,
          status: "error",
        }));
      });
    if (!requestStream) return setHavePermission(false);
    setHavePermission(true);
    setStream(requestStream);
    setLiveState({
      audio: true,
      video: true,
      status: "waiting",
    });
    const videoTrack = requestStream.getVideoTracks().pop();
    const videoSettings = videoTrack?.getSettings() || {};
    const videoCapabilities = videoTrack?.getCapabilities() || {};
    const devices = await navigator.mediaDevices.enumerateDevices();
    const otherVideoInput = devices.find(
      (device) =>
        device.deviceId !== videoSettings?.deviceId &&
        device.kind === "videoinput"
    );
    setDebugInfo(
      JSON.stringify(
        { videoSettings, videoCapabilities, devices, otherVideoInput },
        null,
        2
      )
    );
  };
  useEffect(() => {
    if (liveState.status === "ended") {
      onEnded && onEnded();
    }
  }, [liveState]);
  useEffect(() => {
    if (!stream || !playerRef.current) return;
    if (playerRef.current instanceof Element) {
      playerRef.current.srcObject = stream;
    }
  }, [stream, playerRef.current]);

  useEffect(() => {
    if (typeof window !== "undefined") getMediaStream();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  return {
    havePermission,
    liveState,
    playerRef,
    setLiveState,
    stream,
    streamIngestURL,
    debugInfo,
  };
};
