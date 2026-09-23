import { DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { SquarePen } from "lucide-react";

export default function EditTrigger() {
  return (
    <DialogTrigger asChild>
      <Button variant="ghost" size="icon">
        <SquarePen size={17} />
      </Button>
    </DialogTrigger>
  );
}
