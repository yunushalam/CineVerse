import { useState, useRef } from 'react';
import { Play, Star, Heart, Share2, VolumeX, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MovieCard({ movie, onPlay }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  let hoverTimeout;
  const handleMouseEnter = () => {
    hoverTimeout = setTimeout(() => {
      setIsHovered(true);
      if (videoRef.current) {
        videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
      }
    }, 500); // 500ms delay before playing trailer like Netflix
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setIsHovered(false);
    setIsMuted(true);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      layout
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brand-500/20 transition-all duration-300 border border-surface-100 flex flex-col h-full"
    >
      <div className="aspect-[16/9] w-full overflow-hidden relative bg-surface-200">
        {/* Poster Image */}
        <img 
          src={movie.posterFilePath ? `http://localhost:8080${movie.posterFilePath}` : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400&auto=format&fit=crop'} 
          alt={movie.title} 
          className={`w-full h-full object-cover transition-opacity duration-500 ${isHovered && movie.trailerFilePath ? 'opacity-0' : 'opacity-100'}`}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400&auto=format&fit=crop'; }}
        />
        
        {/* Trailer Video (Autoplays on hover) */}
        {movie.trailerFilePath && (
          <video
            ref={videoRef}
            src={`http://localhost:8080${movie.trailerFilePath}`}
            muted={isMuted}
            loop
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        
        {/* Hover Controls Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-4"
            >
              <div className="flex justify-end">
                {movie.trailerFilePath && (
                  <button 
                    onClick={toggleMute}
                    className="p-2 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-center h-full">
                 <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onPlay(movie)}
                  className="w-14 h-14 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-500/50 hover:bg-brand-400 transition-colors"
                >
                  <Play className="w-6 h-6 ml-1 fill-white" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rating Badge */}
        {!isHovered && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-white text-xs font-bold shadow-md">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
          </div>
        )}
      </div>
      
      {/* Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white z-10 relative">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              {movie.genre || 'Movie'}
            </span>
            <span className="text-sm font-semibold text-text-secondary">{movie.releaseYear}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{movie.title}</h3>
          <p className="text-sm text-text-secondary line-clamp-2">
            {movie.description || 'No description available for this cinematic masterpiece.'}
          </p>
        </div>

        {/* Action Buttons (Like, Share, Rate) */}
        <div className="mt-4 pt-4 border-t border-surface-100 flex items-center justify-between">
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-1"
            >
              <Heart className="w-4 h-4" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-text-secondary hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors flex items-center gap-1"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-50 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold text-gray-900">{movie.rating ? movie.rating.toFixed(1) : '0.0'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
