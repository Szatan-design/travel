import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Post } from '../types';
import { format } from 'date-fns';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  posts: Post[];
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
}

function MapEvents({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    if (!onMapClick) return;
    map.on('click', (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });
    return () => {
      map.off('click');
    };
  }, [map, onMapClick]);
  return null;
}

const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function Map({ posts, center = [20, 0], zoom = 2, onMapClick }: MapProps) {
  const [devicePaths, setDevicePaths] = useState<Record<string, [number, number][]>>({});

  useEffect(() => {
    const fetchTrackingPoints = async () => {
      try {
        const response = await fetch('/api/track');
        if (response.ok) {
          const data = await response.json();
          
          // Group points by device_id
          const grouped: Record<string, [number, number][]> = {};
          data.forEach((p: any) => {
            const deviceId = p.device_id || 'unknown';
            if (!grouped[deviceId]) {
              grouped[deviceId] = [];
            }
            grouped[deviceId].push([p.latitude, p.longitude]);
          });
          
          setDevicePaths(grouped);
        }
      } catch (error) {
        console.error('Error fetching tracking points:', error);
      }
    };

    fetchTrackingPoints();
    // Refresh tracking points every minute
    const interval = setInterval(fetchTrackingPoints, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fallback to posts path if no tracking points
  const postsPath = useMemo(() => {
    const sorted = [...posts].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return sorted.map(post => [post.latitude, post.longitude] as [number, number]);
  }, [posts]);

  const hasTrackingData = Object.keys(devicePaths).length > 0;

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} minZoom={2}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Draw a Polyline for each device */}
      {Object.entries(devicePaths).map(([deviceId, points], index) => (
        <Polyline 
          key={deviceId}
          positions={points}
          pathOptions={{ 
            color: colors[index % colors.length], 
            weight: 4, 
            opacity: 0.7
          }} 
        >
          <Popup>Device: {deviceId}</Popup>
        </Polyline>
      ))}

      {/* Fallback: Draw dashed lines between posts if no tracking data, or as a guide */}
      {!hasTrackingData && postsPath.length > 1 && (
         <Polyline 
          positions={postsPath} 
          pathOptions={{ color: '#3b82f6', weight: 3, opacity: 0.5, dashArray: '10, 10' }} 
        />
      )}

      {posts.map((post) => (
        <Marker key={post.id} position={[post.latitude, post.longitude]}>
          <Popup>
            <div className="max-w-xs">
              <p className="font-bold text-sm mb-1">{format(new Date(post.timestamp), 'PPpp')}</p>
              {post.caption && <p className="text-sm mb-2">{post.caption}</p>}
              <div className="grid grid-cols-2 gap-1">
                {post.image_paths.map((path, index) => (
                  <img 
                    key={index} 
                    src={path} 
                    alt={`Photo ${index + 1}`} 
                    className="w-full h-24 object-cover rounded"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      <MapEvents onMapClick={onMapClick} />
    </MapContainer>
  );
}
