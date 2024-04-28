import { ReactNode } from "react";
import { useController } from "../hooks";

export const ControlPanel = ({ children }: { children: ReactNode }) => {
    const { liveState } = useController();
    return (
      <div
        data-ended={liveState.status === "ended"}
        className="absolute flex flex-col items-end gap-7 right-3 top-3 data-[ended=true]:opacity-55 data-[ended=true]:pointer-events-none"
      >
        {children}
      </div>
    );
  };
  