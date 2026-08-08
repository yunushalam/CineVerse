import { Play, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MovieCard({ movie, onPlay }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-surface-100"
    >
      <div className="aspect-[2/3] w-full overflow-hidden relative bg-surface-200">
        {movie.posterFilePath ? (
          <img 
            src={`http://localhost:8080${movie.posterFilePath}`} 
            alt={movie.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400&auto=format&fit=crop'; }}
          />
        ) : (
          <img src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400&auto=format&fit=crop" alt="placeholder" className="w-full h-full object-cover" />
        )}
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onPlay(movie)}
            className="w-14 h-14 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-500/50"
          >
            <Play className="w-6 h-6 ml-1" />
          </motion.button>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-white text-xs font-bold">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-1 rounded-md">
            {movie.genre || 'Movie'}
          </span>
          <span className="text-sm font-medium text-text-secondary">{movie.releaseYear}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 truncate">{movie.title}</h3>
        <p className="mt-2 text-sm text-text-secondary line-clamp-2">
          {movie.description || 'No description available for this movie.'}
        </p>
      </div>
    </motion.div>
  );
}
