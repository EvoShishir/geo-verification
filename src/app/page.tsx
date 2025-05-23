"use client";

import dynamic from "next/dynamic";

const targetPosition = [23.838720437873, 90.37391729457478] as const;

// Dynamically import MapClient with no SSR
const MapClient = dynamic(() => import("../components/MapClient"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        🗺️ Map with Current and Target Locations
      </h1>

      <MapClient targetPosition={[...targetPosition]} />
    </div>
  );
}
