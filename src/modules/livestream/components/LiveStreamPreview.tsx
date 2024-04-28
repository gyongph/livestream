import { useLiveStreamContext } from "../hooks/useLiveStreamer";


export function LiveStreamPreview() {
  const ctx = useLiveStreamContext();
  return (
    <video muted ref={ctx.playerRef} className="w-full h-full" autoPlay></video>
  );
}
