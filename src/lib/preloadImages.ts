const warmedImageSet = new Set<string>();

export function warmImageCache(sources: string[]) {
  sources.forEach((src) => {
    if (!src || warmedImageSet.has(src)) {
      return;
    }

    warmedImageSet.add(src);

    const image = new Image();
    image.decoding = "async";
    image.src = src;

    if (typeof image.decode === "function") {
      void image.decode().catch(() => {
        // Ignore decode failures and let browser fallback to normal rendering.
      });
    }
  });
}
