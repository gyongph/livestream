import { useLiveStreamContext } from "../hooks/useLiveStreamer";

export function LiveStatusIndicator() {
  let ctx = useLiveStreamContext();
  return (
    <div
      style={{ viewTransitionName: "live-status" }}
      data-active={ctx.liveState.status === "live"}
      className="data-[active=true]:bg-red-500 bg-slate-600 text-white px-5 rounded-full w-fit absolute top-3 left-3 uppercase"
    >
      {ctx.liveState.status}
    </div>
  );
}
