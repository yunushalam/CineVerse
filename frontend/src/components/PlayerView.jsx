import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Bookmark } from 'lucide-react';

export default function PlayerView({ movie, onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-40 bg-surface-50 pt-20 overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Player */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
              <video 
                src={`http://localhost:8080${movie.movieFilePath || movie.trailerFilePath}`} 
                controls 
                autoPlay 
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{movie.title}</h1>
              
              <div className="flex items-center gap-4 border-b border-surface-200 pb-6 mb-6">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-200 hover:bg-surface-200/80 rounded-full font-medium transition-colors">
                  <Heart className="w-5 h-5" /> Like
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-200 hover:bg-surface-200/80 rounded-full font-medium transition-colors">
                  <Share2 className="w-5 h-5" /> Share
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-200 hover:bg-surface-200/80 rounded-full font-medium transition-colors">
                  <Bookmark className="w-5 h-5" /> Save
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-surface-100">
                <div className="flex gap-4 mb-4 text-sm font-bold text-gray-900">
                  <span>{movie.releaseYear}</span>
                  <span>•</span>
                  <span>{movie.genre}</span>
                  <span>•</span>
                  <span>Rating: {movie.rating}</span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {movie.description || 'No description available.'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Up Next</h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-surface-100">
                <div className="w-32 aspect-video bg-surface-200 rounded-xl overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400" alt="up next" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 line-clamp-2">Another Great Movie Title</h4>
                  <p className="text-xs text-text-secondary mt-1">Sci-Fi • 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
