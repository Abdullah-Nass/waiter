import { DialogTrigger } from "../ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export default function AddCategoryTrigger() {
  const t = useTranslations();
  return (
    <DialogTrigger asChild>
      <Button
        variant="outline"
        className="group justify-between gap-2 rounded-xl border-dashed border-border/80 px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 active:scale-95"
      >
        <span className="truncate">{t("navigation.newCategory")}</span>
        <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110" />
      </Button>
    </DialogTrigger>
  );
}
