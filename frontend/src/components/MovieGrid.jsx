import { motion } from 'framer-motion';
import MovieCard from './MovieCard';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function MovieGrid({ movies, onPlay }) {
  return (
    <section id="movies" className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Trending Now</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-text-primary text-white rounded-full text-sm font-medium">All</button>
          <button className="px-4 py-2 bg-white text-text-secondary border border-surface-200 rounded-full text-sm font-medium hover:bg-surface-50 transition-colors">Action</button>
          <button className="px-4 py-2 bg-white text-text-secondary border border-surface-200 rounded-full text-sm font-medium hover:bg-surface-50 transition-colors">Sci-Fi</button>
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-text-secondary">No movies found. Add one!</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"
        >
          {movies.map((movie) => (
            <motion.div key={movie.id} variants={item}>
              <MovieCard movie={movie} onPlay={onPlay} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
