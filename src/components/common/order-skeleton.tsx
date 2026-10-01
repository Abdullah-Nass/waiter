import LineSkeleton from "./line-skeleton";

export function OrderSkeleton() {
  return (
    <li className="animate-pulse rounded-xl border bg-background p-4 space-y-3 shadow-sm">
      {/* Order ID & Time */}
      <div className="flex items-center justify-between">
        <LineSkeleton className="h-5 w-16 rounded" />
        <LineSkeleton className="h-4 w-20 rounded" />
      </div>

      {/* Table Number */}
      <div className="flex items-center gap-2">
        <LineSkeleton className="h-4 w-12" />
        <LineSkeleton className="h-4 w-8" />
      </div>

      {/* Items List */}
      <ul className="space-y-2 divide-y divide-border/60">
        {[1, 2].map((i) => (
          <li key={i} className="px-2 pt-2 first:pt-0 space-y-1.5">
            <div className="flex items-center gap-2">
              <LineSkeleton className="h-7 w-7 rounded-full shrink-0" />
              <LineSkeleton className="h-4 w-3/4 rounded" />
            </div>
            {/* Note placeholder for the first item */}
            {i === 1 && <LineSkeleton className="h-3 w-1/2 rounded ml-9" />}
          </li>
        ))}
      </ul>

      {/* Button */}
      <LineSkeleton className="h-9 w-full rounded-md mt-2" />
    </li>
  );
}
