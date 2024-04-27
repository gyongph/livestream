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
    async toggleCamFacingMode() {
      if (!(ctx.stream instanceof MediaStream)) return;
      const oldVideoTrack = ctx.stream.getVideoTracks().pop();
      if (!oldVideoTrack) return;
      const oldMode = ctx.liveState.facingMode;
      const newMode = oldMode === "user" ? "environment" : "user";
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode },
      });
      const newVideoTrack = videoStream.getVideoTracks().pop();
      if (!newVideoTrack) return;
      oldVideoTrack.stop();
      ctx.stream.removeTrack(oldVideoTrack);
      ctx.stream.addTrack(newVideoTrack);
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
