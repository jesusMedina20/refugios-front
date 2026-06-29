'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { IRefugio } from '@/lib/types';
import { MAP_CENTER, MAP_ZOOM } from '@/lib/constants';

// Fix leaflet default icon path issue
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const tipoColors: Record<string, string> = {
  refugio: '#2563eb',
  punto_resguardo: '#d97706',
  centro_acopio: '#16a34a',
};

function createIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 24 36"><path fill="${color}" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"/><circle cx="12" cy="12" r="5" fill="#fff"/></svg>`,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
  });
}

type Props = {
  refugios: IRefugio[];
  selectedId?: string;
};

export function MapView({ refugios, selectedId }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    instanceRef.current = map;

    return () => {
      map.remove();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = instanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const markers: L.Marker[] = [];
    const bounds = L.latLngBounds([]);

    refugios.forEach((r) => {
      if (r.latitud == null || r.longitud == null) return;

      const latlng: L.LatLngExpression = [r.latitud, r.longitud];
      const color = r.tipo ? tipoColors[r.tipo] ?? '#6b7280' : '#6b7280';
      const isSelected = r.id === selectedId;

      const marker = L.marker(latlng, {
        icon: isSelected
          ? createIcon('#dc2626')
          : createIcon(color),
      });

      marker.bindPopup(
        `<strong>${r.nombre}</strong><br/>${r.ubicacion.direccion}, ${r.ubicacion.estado}`,
      );

      marker.addTo(map);
      markers.push(marker);
      bounds.extend(latlng);
    });

    markersRef.current = markers;

    if (selectedId) {
      // Zoom to selected
      const sel = refugios.find((r) => r.id === selectedId);
      if (sel?.latitud != null && sel.longitud != null) {
        map.setView([sel.latitud, sel.longitud], 14, { animate: true });
      }
    } else if (refugios.some((r) => r.latitud != null)) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
    }
  }, [refugios, selectedId]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <div ref={mapRef} className="h-[400px] w-full sm:h-[500px]" />
    </div>
  );
}
