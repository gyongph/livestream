import dynamic from "next/dynamic";
import React from "react";
import Home from "./Home";
const NoSSRWrapper = (props: any) => (
  <React.Fragment><Home /></React.Fragment>
);
export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
