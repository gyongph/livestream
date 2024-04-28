import { FaEye } from "react-icons/fa";

export function LiveAudienceCountIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="text-white font-medium">200</div>
      <FaEye className="fill-white  w-8 h-8 scale-75" />
    </div>
  );
}
