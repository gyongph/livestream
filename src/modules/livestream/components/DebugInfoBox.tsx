import { useController } from "../hooks";

export function DebugInfoBox() {
  const { debugInfo } = useController();
  return (
    <div className="whitespace-pre-line bg-black text-white break-all">
      {debugInfo}
    </div>
  );
}
