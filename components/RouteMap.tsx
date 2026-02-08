"use client";

import { MapContainer, TileLayer, Marker, Polyline, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const route: [number, number][] = [
  [31.2304, 121.4737],
  [20.0, 100.0],
  [15.0, 80.0],
  [18.0, 60.0],
  [31.8, 34.7]
];

export function RouteMap() {
  return (
    <MapContainer center={[23, 80]} zoom={3} scrollWheelZoom={false} className="shadow-sm">
      <TileLayer
        attribution='נתוני מפה © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[31.2304, 121.4737]}>
        <Popup>נמל יציאה: שנגחאי</Popup>
      </Marker>
      <Marker position={[31.8, 34.7]}>
        <Popup>נמל יעד: אשדוד</Popup>
      </Marker>
      <CircleMarker center={[20, 85]} pathOptions={{ color: "#2563eb" }} radius={8}>
        <Popup>מיקום אוניה משוער</Popup>
      </CircleMarker>
      <Polyline positions={route} pathOptions={{ color: "#2563eb" }} />
    </MapContainer>
  );
}
