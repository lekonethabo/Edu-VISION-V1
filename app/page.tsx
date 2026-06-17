"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import EduVisionPortal with SSR disabled to prevent hydration mismatches
// from client-only/localStorage/time-sensitive components.
const EduVisionPortal = dynamic(() => import("./edu-vision"), {
  ssr: false,
});

export default function Page() {
  return (
    <div id="edu-vision-root-container">
      <EduVisionPortal />
    </div>
  );
}
