"use client";
import { v4 } from "uuid";
import { useRef, useState } from "react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getDevices = async () => {
  const list = await navigator.mediaDevices.enumerateDevices();
  console.log(list);
};

const uploadBuffer = (guestID: string, data: Blob) => {
  const formData = new FormData();
  formData.append("chunk", data);
  fetch(`${API_URL}/live?guestID=${guestID}`, {
    method: "post",
    body: formData,
  });
};
const guestID = v4();

export default function HomeV2() {
  const [viewPreviewLink, setViewPreviewLink] = useState(false);
  const [live, setLive] = useState(false);
  const [logs, setLogs] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const startLive = () => {
    setLive(true);
    setTimeout(() => setViewPreviewLink(true), 5000);
    const constraints: MediaStreamConstraints = {
      audio: { autoGainControl: false, noiseSuppression: false },
      video: true,
      // audio: {
      //   noiseSuppression: false,
      //   echoCancellation: false,
      //   autoGainControl: false,
      // },
      // video: {
      //   width: 1920,
      //   height: 1080,
      //   frameRate: 30,
      //   noiseSuppression: false,
      // },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(async (mediaStream) => {
        console.log("got streawm");
        mediaStream.getVideoTracks()[0].applyConstraints({ frameRate: 30 });
        let chunks: Blob[] = [];
        recorderRef.current = new MediaRecorder(mediaStream.clone(), {
          videoBitsPerSecond: 12000 * 1000,
          mimeType: "video/webm; codecs=h264",
        });
        const recorder = recorderRef.current;
        recorder.onstop = async () => {
          // try {
          const blob = new Blob(chunks, { type: recorder.mimeType });
          //   chunks = [];
          //   recorder.start(1000);
          //   uploadBuffer(guestID, blob);
          // } catch (e) {
          //   console.log("ffmpeg erros");
          // }
        };
        recorder.ondataavailable = (event) => {
          // console.log("add chunk");
          // chunks.push(event.data);
          // console.log(event.timeStamp);
          // if (chunks.length == 5) {
          //   uploadBuffer(guestID, chunks);
          //   chunks = [];
          // }
          uploadBuffer(guestID, event.data);
        };

        recorder.start(1000);
        const video = document.querySelector("video");
        if (!video) return;
        video.srcObject = mediaStream;
        video.onloadedmetadata = () => {
          video.play();
        };
      })
      .catch((err) => {
        console.log(err);
        // socket.on("message", (data) => console.log(data));
        // console.error(`${err.name}: ${err.message}`);
      });
  };
  return (
    <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      {guestID}
      {viewPreviewLink && (
        <div className="my-10 text-blue-500">
          <a href={`/viewer/?guestID=${guestID}`} target="_blank">
            LIVE STREAM LINK
          </a>
        </div>
      )}
      <video ref={videoRef} controls></video>
      <br />
      {!live && (
        <button
          onClick={() => startLive()}
          className="bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded"
        >
          START
        </button>
      )}
    </div>
  );
}
