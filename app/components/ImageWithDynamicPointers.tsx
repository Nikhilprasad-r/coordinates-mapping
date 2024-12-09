"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Item {
  id: string;
  coords: [number, number]; // Coordinates on the 200x200 grid
}

const ImageWithDynamicPointers = () => {
  const [items, setItems] = useState<Item[]>([
    { id: "1", coords: [50, 50] },
    { id: "2", coords: [100, 150] },
    { id: "3", coords: [150, 75] },
  ]);
  const mapRef = useRef<L.Map | null>(null);
  const markerMap = useRef<Record<string, L.Marker>>({}); // To store markers by ID
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // To reference the map container

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize the Leaflet map
    const map = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -1,
      maxZoom: 1,
      center: [100, 100],
      zoom: 0,
    });

    const imageUrl = "/layout.png "; // Replace with your image path
    const imageBounds = [[0, 0], [200, 200]]; // 200x200 image grid
    L.imageOverlay(imageUrl, imageBounds).addTo(map);
    map.fitBounds(imageBounds);

    mapRef.current = map; // Store the map instance

    // Add initial markers
    items.forEach((item) => {
      const marker = L.marker(item.coords).addTo(map).bindPopup(`ID: ${item.id}`);
      markerMap.current[item.id] = marker;
    });

    return () => {
      map.remove(); // Cleanup the map on component unmount
      mapRef.current = null;
      markerMap.current = {};
    };
  }, []); // Only run on mount

  useEffect(() => {
    if (!mapRef.current) return;

    // Update or create markers dynamically
    items.forEach((item) => {
      if (markerMap.current[item.id]) {
        markerMap.current[item.id].setLatLng(item.coords); // Update marker position
      } else {
        // Create a new marker if it doesn't exist
        const marker = L.marker(item.coords).addTo(mapRef.current).bindPopup(`ID: ${item.id}`);
        markerMap.current[item.id] = marker;
      }
    });
  }, [items]);

  // Simulate receiving a stream of data
  useEffect(() => {
    const streamInterval = setInterval(() => {
      const updatedItems: Item[] = [
        { id: "1", coords: [60, 60] }, // Updated path for ID 1
        { id: "2", coords: [120, 160] }, // Updated path for ID 2
        { id: "3", coords: [170, 80] }, // Updated path for ID 3
      ];
      setItems(updatedItems); // Update state
    }, 2000); // Simulate new data every 2 seconds

    return () => clearInterval(streamInterval); // Cleanup interval on unmount
  }, []);

  return (
    <div>
      <div
        ref={mapContainerRef}
        className="size-96 border-1 border-black"
      ></div>
    </div>
  );
};

export default ImageWithDynamicPointers;
