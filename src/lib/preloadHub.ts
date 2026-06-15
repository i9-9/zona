import { hubImages } from "@/data/site";

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

/** Preload landing images while the boot splash runs. */
export function preloadHubAssets(timeoutMs = 15000): Promise<void> {
  const loads = Promise.all(hubImages.map((img) => preloadImage(img.src)));
  const timeout = new Promise<void>((resolve) => {
    window.setTimeout(resolve, timeoutMs);
  });

  return Promise.race([loads.then(() => undefined), timeout]);
}
