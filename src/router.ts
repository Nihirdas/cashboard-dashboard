import { useEffect, useState } from "react";

/** Minimal hash router: #/overview, #/tests, #/dashboard, #/live. */
export function useHashRoute(): string {
  const read = () => window.location.hash.replace(/^#\/?/, "") || "overview";
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}
