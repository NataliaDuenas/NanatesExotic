import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix del icono por defecto de Leaflet en Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type MapPickerProps = {
  latitude: number;
  longitude: number;
  onChange: (coords: { latitude: number; longitude: number }) => void;
};

function ClickHandler({
  onChange,
}: {
  onChange: (coords: { latitude: number; longitude: number }) => void;
}) {
  useMapEvents({
    click(e) {
      onChange({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });

  return null;
}

export function MapPicker({
  latitude,
  longitude,
  onChange,
}: MapPickerProps) {
  const position: LatLngExpression = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: "360px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onChange={onChange} />
      <Marker position={position}>
        <Popup>
          Exploitation sélectionnée
          <br />
          Lat: {latitude.toFixed(5)}, Lon: {longitude.toFixed(5)}
        </Popup>
      </Marker>
    </MapContainer>
  );
}