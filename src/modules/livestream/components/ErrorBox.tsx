import { MdNearbyError } from "react-icons/md";
import { useLiveStreamContext } from "../hooks";
export default function ErrorBox() {
  const formContext = useLiveStreamContext();
  const error = formContext?.liveState?.error;
  if (!error) return null;
  return (
    <div className="aspect-video p-5 rounded-md w-fit flex gap-3 items-center justify-center  absolute top-36  left-1/2 -translate-x-1/2 flex-col border-2 border-red-500 text-white ">
      <MdNearbyError className="text-red-500 w-20 h-20 max-w-[100%-2rem]" />
      <div className="font-medium text-white text-center">{error}</div>
    </div>
  );
}
