import { PropsWithChildren } from "react";
import usePlayer, { playerContext, usePlayerProps } from "../hooks/usePlayer";

export function Player(props: usePlayerProps & PropsWithChildren) {
  const values = usePlayer({ src: "" });
  return (
    <playerContext.Provider value={values}>
      {props.children}
    </playerContext.Provider>
  );
}
