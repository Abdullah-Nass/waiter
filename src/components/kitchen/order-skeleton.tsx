export function OrderSkeleton() {
  return (
    <li className="animate-pulse rounded-xl border bg-background p-4 space-y-3 shadow-sm">
      {/* Order ID & Time */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-16 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
      </div>

      {/* Table Number */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-12 rounded bg-muted" />
        <div className="h-4 w-8 rounded bg-muted" />
      </div>

      {/* Items List */}
      <ul className="space-y-2 divide-y divide-border/60">
        {[1, 2].map((i) => (
          <li key={i} className="px-2 pt-2 first:pt-0 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-muted shrink-0" />
              <div className="h-4 w-3/4 rounded bg-muted" />
            </div>
            {/* Note placeholder for the first item */}
            {i === 1 && <div className="h-3 w-1/2 rounded bg-muted ml-9" />}
          </li>
        ))}
      </ul>

      {/* Button */}
      <div className="h-9 w-full rounded-md bg-muted mt-2" />
    </li>
  );
}
