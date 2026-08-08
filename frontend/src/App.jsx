import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieGrid from './components/MovieGrid';
import AuthModal from './components/AuthModal';
import UploadModal from './components/UploadModal';
import PlayerView from './components/PlayerView';
import { getMovies } from './api';

function App() {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [playingMovie, setPlayingMovie] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('username');
    if (token && storedUser) {
      setUser({ username: storedUser });
    }

    // Fetch movies
    const fetchMovies = async () => {
      try {
        const response = await getMovies();
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  const handleMovieAdded = (newMovie) => {
    setMovies((prev) => [...prev, newMovie]);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface-50 text-text-primary overflow-x-hidden selection:bg-brand-500 selection:text-white">
      <Navbar 
        user={user} 
        onLoginClick={() => setIsAuthModalOpen(true)} 
        onLogoutClick={handleLogout}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />
      
      <AnimatePresence mode="wait">
        {playingMovie ? (
          <PlayerView key="player" movie={playingMovie} onClose={() => setPlayingMovie(null)} />
        ) : (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-20"
          >
            <Hero moviesCount={movies.length} />
            <MovieGrid movies={movies} onPlay={(movie) => setPlayingMovie(movie)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal 
            onClose={() => setIsAuthModalOpen(false)} 
            onSuccess={(userData) => {
              setUser(userData);
              setIsAuthModalOpen(false);
            }} 
          />
        )}
        {isUploadModalOpen && (
          <UploadModal 
            onClose={() => setIsUploadModalOpen(false)} 
            onSuccess={handleMovieAdded} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
