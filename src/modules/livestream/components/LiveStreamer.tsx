import { PropsWithChildren } from "react";
import {
  UseLiveStreamProps,
  useLiveStreamer,
  LiveStreamContext,
} from "../hooks/";

export function LiveStreamer(props: UseLiveStreamProps & PropsWithChildren) {
  const values = useLiveStreamer(props);
  return (
    <LiveStreamContext.Provider value={values}>
      {props.children}
    </LiveStreamContext.Provider>
  );
}
