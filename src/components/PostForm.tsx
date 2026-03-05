import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Loader2, MapPin, Upload, X, Plane, Car, Bus, Bike, Ship, Footprints, Train, HelpCircle } from 'lucide-react';

interface PostFormProps {
  onClose: () => void;
  onPostCreated: () => void;
}

const transportModes = [
  { id: 'plane', label: 'Plane', icon: Plane },
  { id: 'car', label: 'Car', icon: Car },
  { id: 'bus', label: 'Bus', icon: Bus },
  { id: 'motorbike', label: 'Motorbike', icon: Bike },
  { id: 'boat', label: 'Boat', icon: Ship },
  { id: 'train', label: 'Train', icon: Train },
  { id: 'walk', label: 'Walk', icon: Footprints },
  { id: 'other', label: 'Other', icon: HelpCircle },
];

function LocationMarker({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function PostForm({ onClose, onPostCreated }: PostFormProps) {
  const [caption, setCaption] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [transportMode, setTransportMode] = useState('other');
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    handleLocate();
  }, []);

  const handleLocate = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Could not get your location. Please select it on the map.');
        setIsLocating(false);
      }
    );
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert('Please select a location.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('latitude', location[0].toString());
    formData.append('longitude', location[1].toString());
    formData.append('caption', caption);
    formData.append('timestamp', new Date().toISOString());
    formData.append('transportMode', transportMode);
    photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        onPostCreated();
        onClose();
      } else {
        alert('Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold">New Update</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transport Mode</label>
            <div className="grid grid-cols-4 gap-2">
              {transportModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTransportMode(mode.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                      transportMode === mode.id
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} className="mb-1" />
                    <span className="text-[10px] font-medium">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div className="h-48 bg-gray-100 rounded-lg overflow-hidden relative mb-2 border border-gray-300">
              <MapContainer 
                center={[14.0583, 108.2772]} 
                zoom={5} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={location} setPosition={setLocation} />
              </MapContainer>
              
              <button
                type="button"
                onClick={handleLocate}
                disabled={isLocating}
                className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 disabled:opacity-50 z-[400]"
                title="Use current location"
              >
                {isLocating ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
              </button>
            </div>
            {location ? (
              <p className="text-xs text-green-600">Location selected: {location[0].toFixed(4)}, {location[1].toFixed(4)}</p>
            ) : (
              <p className="text-xs text-red-500">Tap map or use button to set location</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                {photos.length > 0 ? `${photos.length} photos selected` : 'Click to upload photos'}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>
            {photos.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                {photos.map((photo, i) => (
                  <div key={i} className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden border">
                    <img 
                      src={URL.createObjectURL(photo)} 
                      alt="preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="What's happening?"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !location}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={18} />}
              Post Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
