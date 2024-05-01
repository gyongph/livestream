import { ReactNode } from "react";

type PropTypes = {
  children?: ReactNode;
};

export default function RootContainer({ children }: PropTypes) {
  return (
    <div className="bg-black relative w-dvw h-dvh max-w-[430px] mx-auto max-h-[934px] md:mt-10 overflow-clip">
      {children}
    </div>
  );
}
