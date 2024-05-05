"use client"

import dynamic from "next/dynamic";
import { AutoViewTransitionsOnClick } from "use-view-transitions/react";

export  function Wrapper() {
  return ( 
      <AutoViewTransitionsOnClick match="a[href]" /> 
  );
}


export default dynamic(() => Promise.resolve(Wrapper), {
  ssr: false
})