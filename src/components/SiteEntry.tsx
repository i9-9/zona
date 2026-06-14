"use client";

import { useState } from "react";
import { BootSplash } from "@/components/BootSplash";
import { Hub } from "@/components/Hub";

export function SiteEntry() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return <BootSplash onComplete={() => setReady(true)} />;
  }

  return <Hub />;
}
