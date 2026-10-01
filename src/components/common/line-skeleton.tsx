import { cn } from "cn";

export default function LineSkeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("rounded bg-muted", className)} {...props} />;
}
