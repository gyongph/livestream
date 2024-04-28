import {
  Dispatch,
  ElementRef,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
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

type ConstructorOptions = {
  streamIngestURL: string;
  liveState: LiveState;
  stream: MediaStream | undefined;
  havePermission: boolean;
  playerRef: RefObject<HTMLVideoElement>;
  setLiveState: Dispatch<SetStateAction<LiveState>>;
  debugInfo?: any;
  onEnded?: Function;
  onError?: Function;
};

class LiveStream {
  readonly liveState: LiveState;
  readonly setLiveState: Dispatch<SetStateAction<LiveState>>;
  readonly stream: MediaStream | undefined;
  readonly havePermission: boolean;
  readonly playerRef: RefObject<HTMLVideoElement>;
  readonly debugInfo?: any;
  private onEnded?: Function;
  private onError?: Function;
  private streamIngestURL: string;
  constructor(opts: ConstructorOptions) {
    this.stream = opts.stream;
    this.liveState = opts.liveState;
    this.setLiveState = opts.setLiveState;
    this.onEnded = opts.onEnded;
    this.onError = opts.onError;
    this.playerRef = opts.playerRef;
    this.havePermission = opts.havePermission;
    this.streamIngestURL = opts.streamIngestURL;
  }
}

export let LiveStreamContext: InstanceType<typeof LiveStream>;

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
  LiveStreamContext = useMemo(
    () =>
      new LiveStream({
        stream,
        havePermission: false,
        liveState,
        playerRef,
        setLiveState,
        ...options,
      }),
    [stream, debugInfo, liveState, havePermission]
  );
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
