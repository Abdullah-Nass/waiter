"use client";

import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";

export function TimeAgo({ createdAt }: { createdAt: Date }) {
  const format = useFormatter();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span suppressHydrationWarning>
      {format.relativeTime(new Date(createdAt), { now: new Date(now) })}
    </span>
  );
}
