"use client";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const operations = [
  {
    id: "HOS-OP-001",
    name: "Caribbean Region",
    country: "Dominican Republic",
    position: [18.4, -72.3] as [number, number],
    priority: "Critical",
    status: "Active",
    color: "#ef4444",
    emergency: "Hurricane response",
    affectedPeople: "428,000",
    organizations: 12,
    resourcesMoving: 31,
    recommendation: "Deploy additional medical support within 12 hours.",
  },
  {
    id: "HOS-OP-002",
    name: "Central America",
    country: "Guatemala",
    position: [15.7, -90.2] as [number, number],
    priority: "High",
    status: "Assessment",
    color: "#f59e0b",
    emergency: "Temporary shelter shortage",
    affectedPeople: "84,500",
    organizations: 7,
    resourcesMoving: 14,
    recommendation: "Confirm shelter capacity and transportation routes.",
  },
  {
    id: "HOS-OP-003",
    name: "Northern South America",
    country: "Venezuela",
    position: [7.1, -66.1] as [number, number],
    priority: "Monitor",
    status: "Monitoring",
    color: "#38bdf8",
    emergency: "Severe weather monitoring",
    affectedPeople: "26,300",
    organizations: 4,
    resourcesMoving: 6,
    recommendation: "Continue monitoring weather and access conditions.",
  },
];

export default function HumanitarianMap() {
  return (
    <div
      style={{
        height: "430px",
        width: "100%",
        overflow: "hidden",
        borderRadius: "14px",
        border: "1px solid #23445a",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 1000,
          top: "18px",
          left: "20px",
          padding: "12px 16px",
          borderRadius: "10px",
          background: "rgba(7, 24, 39, 0.88)",
          border: "1px solid #28465b",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            color: "#8fb6d1",
            fontSize: "11px",
            letterSpacing: "1.5px",
          }}
        >
          GLOBAL OPERATING PICTURE
        </div>

        <div
          style={{
            color: "#ffffff",
            fontSize: "17px",
            marginTop: "5px",
          }}
        >
          Live Humanitarian Operations
        </div>
      </div>

      <MapContainer
        center={[17, -70]}
        zoom={3}
        minZoom={2}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          className="humanos-map-labels"
        />

        {operations.map((operation) => (
          <CircleMarker
            key={operation.id}
            center={operation.position}
            radius={10}
            pathOptions={{
              color: operation.color,
              fillColor: operation.color,
              fillOpacity: 0.85,
              weight: 3,
            }}
          >
            <Popup>
              <div style={{ minWidth: "240px", lineHeight: 1.45 }}>
                <div
                  style={{
                    color: operation.color,
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {operation.priority} · {operation.status}
                </div>

                <h3 style={{ margin: "7px 0 2px", fontSize: "17px" }}>
                  {operation.name}
                </h3>

                <div style={{ color: "#64748b", fontSize: "12px" }}>
                  {operation.id} · {operation.country}
                </div>

                <hr
                  style={{
                    border: 0,
                    borderTop: "1px solid #dbe3e8",
                    margin: "12px 0",
                  }}
                />

                <div>
                  <strong>Emergency:</strong> {operation.emergency}
                </div>

                <div>
                  <strong>People affected:</strong>{" "}
                  {operation.affectedPeople}
                </div>

                <div>
                  <strong>Organizations:</strong>{" "}
                  {operation.organizations}
                </div>

                <div>
                  <strong>Resources moving:</strong>{" "}
                  {operation.resourcesMoving}
                </div>

                <div
                  style={{
                    marginTop: "12px",
                    padding: "9px",
                    borderRadius: "6px",
                    background: "#eef7f6",
                  }}
                >
                  <strong>AI recommendation</strong>

                  <div style={{ marginTop: "4px" }}>
                    {operation.recommendation}
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}