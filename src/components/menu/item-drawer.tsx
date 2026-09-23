import { Drawer, DrawerContent } from "@/components/ui/drawer";

type itemDrawer = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function ItemDrawer({ open, onOpenChange, children }: itemDrawer) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
