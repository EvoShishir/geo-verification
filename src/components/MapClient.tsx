"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { getDistance } from "geolib";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
  targetPosition: [number, number];
}

export default function MapClient({ targetPosition }: Props) {
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression>();
  const [distance, setDistance] = useState<number | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords: LatLngExpression = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setCurrentPosition(coords);

        const calculatedDistance = getDistance(
          { latitude: coords[0], longitude: coords[1] },
          { latitude: targetPosition[0], longitude: targetPosition[1] }
        );
        setDistance(calculatedDistance);
      });
    }
  }, [targetPosition]);

  const handleCheckIn = () => {
    if (distance !== null && distance <= 50) {
      setCheckedIn(true);
      setError(null);
      alert("✅ Check-in successful!");
    } else {
      setError("❌ You are too far from the target location to check in.");
    }
  };

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-center">
        {distance !== null && (
          <p className="mb-2 text-gray-700">
            📍 <strong>Distance to target:</strong>{" "}
            <span className="text-blue-600 font-semibold">
              {distance} meters
            </span>
          </p>
        )}

        <button
          onClick={handleCheckIn}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          Check In
        </button>

        {checkedIn && (
          <p className="mt-2 text-green-600 font-semibold">
            ✅ You have checked in successfully!
          </p>
        )}

        {error && <p className="mt-2 text-red-600 font-semibold">{error}</p>}
      </div>

      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={targetPosition}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <Marker position={targetPosition}>
            <Popup>🎯 Target Location</Popup>
          </Marker>

          <Circle
            center={targetPosition}
            radius={50}
            pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.3 }}
          />

          {currentPosition && (
            <Marker position={currentPosition}>
              <Popup>📍 Your Current Location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
