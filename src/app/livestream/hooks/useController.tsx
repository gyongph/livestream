import { useContext } from "react";
import { context } from "./useLiveStream";

export const useController = () => {
  const ctx = useContext(context);
  return {
    liveState: ctx.liveState,
    toggleMic() {
      if (!(ctx.stream instanceof MediaStream)) return;
      const audioTrack = ctx.stream.getAudioTracks().pop();
      if (!audioTrack) return;
      audioTrack.enabled = !ctx.liveState.audio;
      ctx.setLiveState({ ...ctx.liveState, audio: !ctx.liveState.audio });
    },
    toggleCam() {
      if (!(ctx.stream instanceof MediaStream)) return;
      const videoTrack = ctx.stream.getVideoTracks().pop();
      if (!videoTrack) return;
      videoTrack.enabled = !ctx.liveState.video;
      ctx.setLiveState({ ...ctx.liveState, video: !ctx.liveState.video });
    },
    toggleCamFacingMode() {
      if (!(ctx.stream instanceof MediaStream)) return;
      const videoTrack = ctx.stream.getVideoTracks().pop();
      if (!videoTrack) return;
      const newMode =
        ctx.liveState.facingMode === "user" ? "environment" : "user";
      videoTrack.applyConstraints({
        facingMode: newMode,
      });
      ctx.setLiveState({
        ...ctx.liveState,
        facingMode: newMode,
      });
    },
    endLiveStream() {
      if (!(ctx.stream instanceof MediaStream)) return;
      const audioTrack = ctx.stream.getAudioTracks().pop();
      const videoTrack = ctx.stream.getVideoTracks().pop();
      audioTrack?.stop();
      videoTrack?.stop();
      ctx.setLiveState({ isActive: false, video: false, audio: false });
    },
  };
};
