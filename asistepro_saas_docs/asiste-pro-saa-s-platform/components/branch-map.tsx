'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Branch } from '@/lib/data'

function markerIcon(active: boolean) {
  const color = active ? '#10b981' : '#f59e0b'
  return L.divIcon({
    className: '',
    html: `<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:${color};box-shadow:0 0 0 4px ${color}33;border:2px solid white;"><span style="width:8px;height:8px;border-radius:50%;background:white"></span></span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

function FitBounds({ branches }: { branches: Branch[] }) {
  const map = useMap()
  useEffect(() => {
    if (!branches.length) return
    const bounds = L.latLngBounds(branches.map((b) => [b.lat, b.lng] as [number, number]))
    map.fitBounds(bounds, { padding: [48, 48] })
  }, [branches, map])
  return null
}

export function BranchMap({
  branches,
  height = 360,
}: {
  branches: Branch[]
  height?: number
}) {
  return (
    <MapContainer
      center={[37.8, -122.35]}
      zoom={11}
      scrollWheelZoom={false}
      style={{ height, width: '100%', borderRadius: 12, zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds branches={branches} />
      {branches.map((b) => {
        const active = b.status === 'active'
        return (
          <div key={b.id}>
            <Circle
              center={[b.lat, b.lng]}
              radius={b.radius}
              pathOptions={{
                color: active ? '#10b981' : '#f59e0b',
                fillColor: active ? '#10b981' : '#f59e0b',
                fillOpacity: 0.12,
                weight: 1.5,
              }}
            />
            <Marker position={[b.lat, b.lng]} icon={markerIcon(active)}>
              <Popup>
                <strong>{b.name}</strong>
                <br />
                {b.address}
                <br />
                {b.present}/{b.employees} present · {b.radius}m geofence
              </Popup>
            </Marker>
          </div>
        )
      })}
    </MapContainer>
  )
}
