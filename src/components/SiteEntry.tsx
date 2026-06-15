"use client";

import { useEffect, useState } from "react";
import { BootSplash } from "@/components/BootSplash";
import { Hub } from "@/components/Hub";
import { preloadHubAssets } from "@/lib/preloadHub";

export function SiteEntry() {
  const [ready, setReady] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    preloadHubAssets().finally(() => setAssetsReady(true));
  }, []);

  if (!ready) {
    return (
      <BootSplash assetsReady={assetsReady} onComplete={() => setReady(true)} />
    );
  }

  return <Hub />;
}
