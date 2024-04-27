import { useContext } from "react";
import { LiveStreamContext } from "./useLiveStream";

export const useLiveStreamContext = () => {
  const ctx = useContext(LiveStreamContext);
  return ctx;
};
