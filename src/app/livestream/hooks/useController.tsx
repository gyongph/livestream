import { useContext } from "react";
import { context } from "./useLiveStream";
import delay from "../../../../utils/delay";

export const useController = () => {
  const ctx = useContext(context);
  return {
    liveState: ctx.liveState,
    debugInfo: ctx.debugInfo,
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
      oldVideoTrack.stop();
      const oldVideoDeviceId = oldVideoTrack.getSettings().deviceId;
      const newVideoDevice = (
        await navigator.mediaDevices.enumerateDevices()
      ).find(
        (device) =>
          device.deviceId !== oldVideoDeviceId && device.kind === "videoinput"
      );
      if (!newVideoDevice) return;
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: newVideoDevice.deviceId },
        audio: false,
      });
      const newVideoTrack = videoStream.getVideoTracks().pop();
      if (!newVideoTrack) return;
      ctx.stream.removeTrack(oldVideoTrack);
      ctx.stream.addTrack(newVideoTrack);
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
