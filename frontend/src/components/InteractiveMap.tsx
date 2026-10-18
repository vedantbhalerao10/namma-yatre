"use client";

import { useEffect, useRef, useState } from "react";
import { ItineraryActivity } from "@/lib/types";
import { MapPin, ExternalLink, Navigation } from "lucide-react";

interface Props {
  activities: ItineraryActivity[];
  selectedDay?: number;
}

export default function InteractiveMap({ activities, selectedDay = 1 }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Filter activities with valid coordinates
  const validSpots = activities.filter(
    (a) => typeof a.latitude === "number" && typeof a.longitude === "number"
  );

  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      // Ensure leaflet styles are present
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Fix default marker icon assets
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!isMounted) return;

      // Clean up previous map instance if it exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Center around Karnataka or first stop
      const defaultCenter: [number, number] = validSpots.length > 0
        ? [validSpots[0].latitude!, validSpots[0].longitude!]
        : [14.5204, 75.7224]; // Central Karnataka

      const map = L.map(mapContainerRef.current).setView(defaultCenter, validSpots.length > 0 ? 8 : 7);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Colors for markers
      const customColors = ["#0F382A", "#D62828", "#F9B208", "#2563EB", "#7C3AED"];
      const points: [number, number][] = [];

      validSpots.forEach((spot, idx) => {
        const lat = spot.latitude!;
        const lon = spot.longitude!;
        points.push([lat, lon]);

        const markerHtml = `
          <div style="background-color: ${customColors[idx % customColors.length]}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); color: white; font-weight: bold; font-size: 13px;">
            ${idx + 1}
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: "custom-marker-pin",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px; min-width: 180px;">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #D62828; margin-bottom: 2px;">
              Stop #${idx + 1} • ${spot.time_of_day}
            </div>
            <div style="font-size: 14px; font-weight: bold; color: #0F382A; line-height: 1.2;">
              ${spot.place_name}
            </div>
            ${spot.kannada_name ? `<div style="font-size: 13px; color: #555; margin-top: 2px;">${spot.kannada_name}</div>` : ""}
            <div style="margin-top: 8px;">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #0F382A; color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; text-decoration: none; font-weight: 600;">
                Get Directions ↗
              </a>
            </div>
          </div>
        `;

        L.marker([lat, lon], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent);
      });

      // Draw route connecting lines if more than 1 spot
      if (points.length > 1) {
        L.polyline(points, {
          color: "#D62828",
          weight: 3.5,
          opacity: 0.8,
          dashArray: "6, 8",
        }).addTo(map);

        // Fit map bounds to encompass all points
        map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
      }

      setMapLoaded(true);
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activities, selectedDay]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-neutral-200 bg-neutral-100">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F382A] text-white">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#F9B208]" />
          <span className="text-xs font-semibold tracking-wide uppercase">
            Day {selectedDay} Interactive Route Map ({validSpots.length} stops)
          </span>
        </div>
        {validSpots.length > 0 && (
          <a
            href={`https://www.google.com/maps/dir/${validSpots
              .map((s) => `${s.latitude},${s.longitude}`)
              .join("/")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-semibold text-[#F9B208] hover:underline"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open Day Route in Google Maps</span>
          </a>
        )}
      </div>

      <div ref={mapContainerRef} className="w-full h-80 sm:h-96 z-0" />

      {validSpots.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10 text-neutral-600 text-sm">
          No map coordinates available for these activities.
        </div>
      )}
    </div>
  );
}
