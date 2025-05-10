import { useLayoutEffect, useState } from "react";

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(true);

  useLayoutEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return { isMobile };
};
