import { MdPerson2 } from "react-icons/md";
export function LiveAudienceCountIndicator() {
  return (
    <div className="flex items-center gap-1">
      <MdPerson2 className="fill-white  w-8 h-8 scale-75" />
      <div className="text-white font-medium">200</div>
    </div>
  );
}
