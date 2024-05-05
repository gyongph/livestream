"use client";

import { useAutoViewTransitions } from "use-view-transitions/react";

export default function Link(props: {
  href: string;
  children?: React.ReactNode;
}) {

  return <div>{props.children}</div>;
}
