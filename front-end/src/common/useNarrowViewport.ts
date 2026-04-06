import { useEffect, useState } from "react";

/** craco less @max-width と揃える（SP レイアウト） */
const MOBILE_MEDIA = "(max-width: 820px)";

export function useNarrowViewport(): boolean {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(MOBILE_MEDIA).matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA);
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return narrow;
}

export default useNarrowViewport;
