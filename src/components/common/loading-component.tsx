import { Loader2 } from "lucide-react";

export default function LoadingComponent() {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="size-10 animate-spin" />
    </div>
  );
}
