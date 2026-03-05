import { useState, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Map from './components/Map';
import PostForm from './components/PostForm';
import Feed from './components/Feed';
import { Post } from './types';
import { Plus, Users } from 'lucide-react';

function Content() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Show add button only on specific path
  const showAddButton = location.pathname === '/secret-upload';

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="h-full w-full relative flex flex-col overflow-hidden bg-white sm:rounded-xl sm:shadow-2xl sm:overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-md shadow-sm px-4 py-3 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-md flex items-center justify-center">
            <Users className="text-white" size={24} />
          </div>
          <div className="bg-white/50 px-3 py-1 rounded-xl backdrop-blur-md border border-white/20">
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">Team</span> Tracker
            </h1>
            <p className="text-xs text-gray-500 font-medium">Vietnam Trip 2026</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden pt-16">
        {/* Map Section */}
        <div className="h-[50vh] md:h-full md:w-1/2 lg:w-3/5 relative z-0">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Map posts={posts} />
          )}
        </div>

        {/* Feed Section */}
        <div className="h-[50vh] md:h-full md:w-1/2 lg:w-2/5 overflow-y-auto bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
          <Feed posts={posts} />
        </div>
      </div>

      {showAddButton && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="absolute bottom-6 right-6 z-[1000] bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          aria-label="Add Update"
        >
          <Plus size={28} />
        </button>
      )}

      {isFormOpen && (
        <PostForm 
          onClose={() => setIsFormOpen(false)} 
          onPostCreated={() => {
            fetchPosts();
            setIsFormOpen(false);
          }} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen w-screen bg-slate-100 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="w-full h-full max-w-7xl mx-auto relative">
          <Content />
        </div>
      </div>
    </BrowserRouter>
  );
}
