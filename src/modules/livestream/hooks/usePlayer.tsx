import Hls from "hls.js";
import { Ref, useEffect, useRef } from "react";
import { createContext } from "react";

export type usePlayerProps = {
  playerRef: Ref<HTMLVideoElement | null>;
};

export const playerContext = createContext<usePlayerProps | null>(null);

export const usePlayerContext = function () {
  if (!playerContext)
    throw new Error("This component must be placed inside Player component.");
  return playerContext;
};

export default function usePlayer({ src = "" }) {
  const playerRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (playerRef.current instanceof Element && src) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(playerRef.current);
      hls.on(Hls.Events.ERROR, (err, data) => {
        setTimeout(() => hls.recoverMediaError(), 5000);
      });
    }
  }, [playerRef]);
  return { playerRef };
}
