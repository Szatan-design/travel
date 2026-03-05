import { Post } from '../types';
import { format } from 'date-fns';
import { MapPin, Calendar, Image as ImageIcon, Plane, Car, Bus, Bike, Ship, Footprints, Train, HelpCircle } from 'lucide-react';

interface FeedProps {
  posts: Post[];
}

const getTransportIcon = (mode?: string) => {
  switch (mode) {
    case 'plane': return <Plane size={16} className="text-blue-500" />;
    case 'car': return <Car size={16} className="text-green-500" />;
    case 'bus': return <Bus size={16} className="text-yellow-500" />;
    case 'motorbike': return <Bike size={16} className="text-orange-500" />;
    case 'boat': return <Ship size={16} className="text-cyan-500" />;
    case 'train': return <Train size={16} className="text-purple-500" />;
    case 'walk': return <Footprints size={16} className="text-emerald-500" />;
    default: return <HelpCircle size={16} className="text-gray-400" />;
  }
};

export default function Feed({ posts }: FeedProps) {
  if (posts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p>No updates yet. Start your journey!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 px-2">Journey Log</h2>
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-50 flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} className="text-blue-500" />
                  <span className="text-sm font-medium">
                    {post.latitude.toFixed(4)}, {post.longitude.toFixed(4)}
                  </span>
                </div>
                {post.transportMode && (
                  <div className="flex items-center gap-2 text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full w-fit">
                    {getTransportIcon(post.transportMode)}
                    <span className="capitalize">{post.transportMode}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Calendar size={14} />
                <span>{format(new Date(post.timestamp), 'MMM d, HH:mm')}</span>
              </div>
            </div>

            {/* Photos */}
            {post.image_paths.length > 0 && (
              <div className={`grid gap-1 ${
                post.image_paths.length === 1 ? 'grid-cols-1' : 
                post.image_paths.length === 2 ? 'grid-cols-2' : 
                'grid-cols-2'
              }`}>
                {post.image_paths.map((path, index) => (
                  <div key={index} className={`relative ${
                    post.image_paths.length === 3 && index === 0 ? 'col-span-2' : ''
                  }`}>
                    <img 
                      src={path} 
                      alt={`Update photo ${index + 1}`}
                      className="w-full h-64 object-cover hover:opacity-95 transition-opacity"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Caption */}
            {post.caption && (
              <div className="p-4">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{post.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
