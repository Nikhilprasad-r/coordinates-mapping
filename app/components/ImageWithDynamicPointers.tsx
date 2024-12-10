"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Item {
  id: string;
  coords: [number, number];
}

const ImageWithCustomMarkers = () => {
  const [items, setItems] = useState<Item[]>([
    { id: "1", coords: [50, 50] },
    { id: "2", coords: [100, 150] },
    { id: "3", coords: [150, 75] },
  ]);
  const mapRef = useRef<L.Map | null>(null);
  const markerMap = useRef<Record<string, L.Marker>>({});
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; 

    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 2,
      center: [100, 100],
      zoom: 0,
    });

    const imageUrl = "/layout.jpg"; // Replace with your image path
    const imageBounds: L.LatLngBoundsExpression = [[0, 0], [200, 200]]; // 200x200 image grid
    L.imageOverlay(imageUrl, imageBounds).addTo(map);
    map.fitBounds(imageBounds);

    mapRef.current = map;

    // Add initial markers
    items.forEach((item) => {
      const marker = createMarker(item.coords, `ID: ${item.id}`);
      marker.addTo(map);
      markerMap.current[item.id] = marker;
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerMap.current = {};
    };
  }, [items]);

  useEffect(() => {
    const streamInterval = setInterval(() => {
      const updatedItems: Item[] = Array.from({ length: 10 }, (_, index) => ({
        id: (index + 1).toString(),
        coords: [
          Math.floor(Math.random() * 200), // Random x-coordinate within bounds
          Math.floor(Math.random() * 200), // Random y-coordinate within bounds
        ],
      }));
      setItems(updatedItems);
    }, 2000);

    return () => clearInterval(streamInterval);
  }, []);

  // Create a marker with a custom icon
  const createMarker = (coords: [number, number], label: string) => {
    const customIcon = L.icon({
      iconUrl: "/marker.svg", // Path to your custom marker image
      iconSize: [32, 32], // Size of the marker
      iconAnchor: [16, 32], // Anchor point (center-bottom)
      popupAnchor: [0, -32], // Popup anchor point
    });

    return L.marker(coords, { icon: customIcon }).bindPopup(label);
  };

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "500px", border: "1px solid black" }}
      ></div>
    </div>
  );
};

export default ImageWithCustomMarkers;
