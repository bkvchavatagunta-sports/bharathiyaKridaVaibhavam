"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid redundant calls on rapid component re-renders
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    // Fail-safe execution
    try {
      // Don't track admin pages or login
      if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
        return;
      }

      let visitorId = "";
      if (typeof window !== "undefined") {
        visitorId = localStorage.getItem("bkv_vid") || "";
        if (!visitorId) {
          visitorId = "vid_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
          localStorage.setItem("bkv_vid", visitorId);
        }
      }

      const savedUserName = typeof window !== "undefined" ? localStorage.getItem("bkv_user_name") || undefined : undefined;
      const savedUserLocation = typeof window !== "undefined" ? localStorage.getItem("bkv_user_location") || undefined : undefined;

      fetch("/api/track-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          pathname,
          userName: savedUserName,
          address: savedUserLocation,
        }),
        keepalive: true,
      }).catch(() => {
        // Silently ignore network failures
      });
    } catch (e) {
      // Ensure zero impact on public site
    }
  }, [pathname]);

  return null;
}
