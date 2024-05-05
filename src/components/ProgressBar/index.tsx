import dynamic from "next/dynamic";
import { AppProgressBar } from "next-nprogress-bar";

export default dynamic(() => Promise.resolve(AppProgressBar), {
    ssr: false
  })