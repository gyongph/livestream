import { useContext } from "react";
import { context } from "./useLiveStream";

export const useLiveStreamContext = () => {
  const ctx = useContext(context);
  return ctx;
};
