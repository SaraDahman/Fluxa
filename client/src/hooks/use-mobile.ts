import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Read the window size immediately on the very first render pass
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mql.addEventListener("change", onChange);

    // Safe cleanup if the component unmounts
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
