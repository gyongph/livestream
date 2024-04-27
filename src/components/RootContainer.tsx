import { ReactNode } from "react";

type PropTypes = {
  children?: ReactNode;
};

export default function RootContainer({ children }: PropTypes) {
  return <div className="bg-black relative w-dvw h-dvh">{children}</div>;
}
