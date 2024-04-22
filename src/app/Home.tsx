"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useId, useRef, useState } from "react";
import { Observable } from "rxjs";
import { from } from "rxjs";
import delay from "../../utils/delay";

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

export default function Home() {
  const guestID = useId()
  const [logs, setLogs] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const load = async () => {
    setIsLoading(true);
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    // ffmpeg.on("log", ({ message }) => {
    //   if (messageRef.current) messageRef.current.innerHTML = message;
    // });
    // ffmpeg.on("progress", (r) => console.log(r));
    ffmpeg.on("log", (r) => console.log(r.message));
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
    setLoaded(true);
    setIsLoading(false);
  };

  const transcode = async () => {
    return new Observable((subscriber) => {
      const ffmpeg = ffmpegRef.current;
      (async () => {
        await ffmpeg.createDir("/test");
        // u can use 'https://ffmpegwasm.netlify.app/video/video-15s.avi' to download the video to public folder for testing
        await ffmpeg.writeFile("input.mp4", await fetchFile("/Finale.mp4"));

        ffmpeg
          .exec([
            "-i",
            "input.mp4",
            "-f",
            "log",
            "quiet",
            "segment",
            "-segment_time",
            "3",
            "-g",
            "10",
            "-sc_threshold",
            "0",
            "-reset_timestamps",
            "1",
            "-map",
            "0",
            "output_%d.mp4",
          ])
          .then((v) => subscriber.complete());
      })();
      setInterval(() => {
        subscriber.next(ffmpeg.readFile("master.m3u8"));
      }, 1000);
    });
  };
  async function blobToUint(blob: Blob): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          const uintArray = new Uint8Array(reader.result);
          resolve(uintArray);
        } else {
          reject(new Error("Failed to convert Blob to Uint8Array"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read Blob as ArrayBuffer"));
      };

      reader.readAsArrayBuffer(blob);
    });
  }

  const record = () => {
    const constraints: MediaStreamConstraints = {
      audio: { autoGainControl: false, noiseSuppression: false,},
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

    let fileCount = 0;
    let uloadedInitMp4 = false;
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(async (mediaStream) => {
        mediaStream.getVideoTracks()[0].applyConstraints({ frameRate: 30 });
        const ffmpeg = ffmpegRef.current;
        let chunks: Blob[] = [];
        const recorder = new MediaRecorder(mediaStream.clone(), {
          videoBitsPerSecond: 12000 * 1000,
          mimeType: "video/webm; codecs=h264",
        });
        recorder.onstop = async () => {
          try {
            // console.log("on pause and uploading");
            const blob = new Blob(chunks, { type: recorder.mimeType });
            chunks = [];
            recorder.start(1000);
            // console.log(`Done recording part ${fileCount}`);
            const oldCount = 0 + fileCount;
            fileCount++;
            await ffmpeg
              .writeFile(`input${oldCount}.webm`, await blobToUint(blob))
              .catch((e) => {
                // console.error(e, "writing");
                return e;
              });
            // console.log(`done writing to ffmpeg - part ${oldCount}`);
            const res = await ffmpeg.exec(
              [
                "-i",
                `input${oldCount}.webm`,
                "-g",
                "10",
                "-sc_threshold",
                "0",
                "-reset_timestamps",
                "1",
                "-c:v",
                "copy",
                "-c:a",
                "mp3",
                "-loglevel",
                "quiet",
                "-f",
                "hls",
                "-hls_time",
                "16",
                "-hls_playlist_type",
                "event",
                "-hls_flags",
                "independent_segments",
                "-hls_segment_type",
                "mpegts",
                // "-tune",
                // "zerolatency",
                `master${oldCount}.m3u8`,
              ],
              10000
            );
            if (res != 0) return;
            // console.log(await ffmpeg.listDir("/"));
            ffmpeg.deleteFile(`input${oldCount}.webm`);
            // console.log(`done encoding ${oldCount}`);
            const file = await ffmpeg
              .readFile(`master${oldCount}0.ts`)
              .catch((e) => {
                // console.error(e, "reading", oldCount);
                return e;
              });

            // console.log(`done reading - ${oldCount}`);
            ffmpeg.deleteFile(`master${oldCount}0.ts`);
            const formData = new FormData();

            if (!(file instanceof Uint8Array)) return;
            // console.log(`done converting file for uploading part ${oldCount}`);
            formData.append("chunk", new Blob([file]), `part-${oldCount}.ts`);
            await fetch(
              `https://192.168.100.7:4343/live?part=${oldCount}&duration=${(
                await ffmpeg.readFile(`master${oldCount}.m3u8`, "utf8")
              )
                .toString()
                .split("\n")
                .find((line) => line.startsWith("#EXTINF"))
                ?.replace("#EXTINF:", "")
                .replace(",", "")}`,
              {
                method: "POST",
                body: formData,
              }
            ).catch((e) => alert(e.message));
            ffmpeg.deleteFile(`master${oldCount}.m3u8`);
            // ffmpeg.listDir("/").then(console.log);
          } catch (e) {
            ffmpeg.terminate()
            load()
            console.log('ffmpeg erros')
          }
        };
        recorder.ondataavailable = (event) => {
          // console.log("add chunk");
          chunks.push(event.data);
          // console.log(event.timeStamp);
          if (chunks.length == 14) recorder.stop();
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
        console.error(`${err.name}: ${err.message}`);
      });
  };
  return loaded ? (
    <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div>{guestID}</div>
      <video ref={videoRef} controls></video>
      <br />
      <button
        onClick={async () => {
          const a = await transcode();
          a.subscribe({
            next: (x) => console.log(x),
            error: (err) => console.error("Observer got an error: " + err),
            complete: () => console.log("Observer got a complete notification"),
          });
        }}
        className="bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded"
      >
        Transcode avi to mp4
      </button>
      <p ref={messageRef}></p>
      <div onClick={record}>Record Camera</div>
      <div>{logs}</div>
    </div>
  ) : (
    <button
      className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
      onClick={load}
    >
      Load ffmpeg-core
      {isLoading && (
        <span className="animate-spin ml-3">
          <svg
            viewBox="0 0 1024 1024"
            focusable="false"
            data-icon="loading"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
          </svg>
        </span>
      )}
    </button>
  );
}
