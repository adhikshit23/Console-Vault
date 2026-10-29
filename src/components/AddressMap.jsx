import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ position, onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng);
    },
  });

  return (
    <Marker
      position={position}
      icon={markerIcon}
      draggable
      eventHandlers={{
        dragend(event) {
          onSelect(event.target.getLatLng());
        },
      }}
    />
  );
}

export default function AddressMap({ onAddressSelect }) {
  const [position, setPosition] = useState({
    lat: 30.3752,
    lng: 76.7821,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    "Click on the map or drag the marker to select your location."
  );

  useEffect(() => {
    let cancelled = false;

    async function getAddress() {
      setLoading(true);
      setMessage("Finding address...");

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.lat}&lon=${position.lng}`
        );

        if (!response.ok) {
          throw new Error("Address lookup failed");
        }

        const data = await response.json();

        if (cancelled) return;

        if (data.display_name) {
          onAddressSelect(data.display_name);
          setMessage("Address found. Please verify it before ordering.");
        } else {
          setMessage("No address found for this location.");
        }
      } catch {
        if (!cancelled) {
          setMessage(
            "Could not find the address. Please try another map location."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timer = setTimeout(getAddress, 800);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [position, onAddressSelect]);

  function selectLocation(latlng) {
    setPosition({
      lat: latlng.lat,
      lng: latlng.lng,
    });
  }

  return (
    <div style={{ margin: "16px 0 24px" }}>
      <h4>Select Delivery Location</h4>

      <p style={{ fontSize: 13, opacity: 0.8 }}>
        Click on the map or move the pin to your delivery location.
      </p>

      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        style={{
          height: 320,
          width: "100%",
          borderRadius: 12,
          zIndex: 1,
        }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          position={position}
          onSelect={selectLocation}
        />
      </MapContainer>

      <p role="status" style={{ fontSize: 13, marginTop: 10 }}>
        {loading ? "Looking up address..." : message}
      </p>

      <small style={{ opacity: 0.7 }}>
        Coordinates: {position.lat.toFixed(5)},{" "}
        {position.lng.toFixed(5)}
      </small>
    </div>
  );
}
