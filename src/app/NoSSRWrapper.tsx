import dynamic from "next/dynamic";
import React from "react";
import HomeV2 from "./homev2";
const NoSSRWrapper = (props: any) => (
  <React.Fragment><HomeV2 /></React.Fragment>
);
export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
