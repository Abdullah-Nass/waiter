import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { DialogTrigger } from "../ui/dialog";

export default function AddItemTrigger() {
  const t = useTranslations();
  return (
    <DialogTrigger asChild>
      <button
        type="button"
        className="group relative flex min-w-[260px] flex-1 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-6 text-center transition-all duration-200 cursor-pointer hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground shadow-xs transition-transform duration-200 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
          <Plus className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            {t("admin.addItem.buttonLabel")}
          </span>
          <span className="text-xs text-muted-foreground">
            {t("admin.addItem.buttonSubtext")}
          </span>
        </div>
      </button>
    </DialogTrigger>
  );
}
