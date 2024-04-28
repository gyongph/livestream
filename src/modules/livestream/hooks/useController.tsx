import { useLiveStreamContext } from "../components/LiveStreamer";

export const useController = () => {
  const ctx = useLiveStreamContext();
  return {
    liveState: ctx.liveState,
    debugInfo: ctx.debugInfo,
    toggleMic() {
      if (ctx.liveState.status === "ended") return;
      if (!(ctx.stream instanceof MediaStream)) return;
      const audioTrack = ctx.stream.getAudioTracks().pop();
      if (!audioTrack) return;
      audioTrack.enabled = !ctx.liveState.audio;
      ctx.setLiveState({ ...ctx.liveState, audio: !ctx.liveState.audio });
    },
    toggleCam() {
      if (ctx.liveState.status === "ended") return;
      if (!(ctx.stream instanceof MediaStream)) return;
      const videoTrack = ctx.stream.getVideoTracks().pop();
      if (!videoTrack) return;
      videoTrack.enabled = !ctx.liveState.video;
      ctx.setLiveState({ ...ctx.liveState, video: !ctx.liveState.video });
    },
    async toggleCamFacingMode() {
      if (ctx.liveState.status === "ended") return;
      if (!(ctx.stream instanceof MediaStream)) return;
      const oldVideoTrack = ctx.stream.getVideoTracks().pop();
      if (!oldVideoTrack) return;
      const oldVideoDeviceId = oldVideoTrack.getSettings().deviceId;
      const newVideoDevice = (
        await navigator.mediaDevices.enumerateDevices()
      ).find(
        (device) =>
          device.deviceId !== oldVideoDeviceId && device.kind === "videoinput"
      );
      if (!newVideoDevice) return;
      oldVideoTrack.stop();
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: newVideoDevice.deviceId },
        audio: false,
      });
      const newVideoTrack = videoStream.getVideoTracks().pop();
      if (!newVideoTrack) return;
      ctx.stream.removeTrack(oldVideoTrack);
      ctx.stream.addTrack(newVideoTrack);
      ctx.setLiveState({ ...ctx.liveState, video: true });
    },
    endLiveStream() {
      if (ctx.liveState.status === "ended") return;
      if (!(ctx.stream instanceof MediaStream)) return;
      ctx.stream.getTracks().forEach((track) => track.stop());
      ctx.setLiveState({ status: "ended", video: false, audio: false });
    },
  };
};
