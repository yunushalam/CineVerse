import { motion } from 'framer-motion';
import { Film, LogOut, Plus, LogIn } from 'lucide-react';

export default function Navbar({ user, onLoginClick, onLogoutClick, onUploadClick }) {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-surface-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <Film className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-500">
            YunushVerse
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onUploadClick}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white font-medium rounded-full shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Movie
              </motion.button>
              
              <div className="w-px h-8 bg-surface-200 mx-2" />
              
              <div className="flex items-center gap-3">
                <span className="font-medium text-text-secondary">Hello, {user.username}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogoutClick}
                  className="p-2.5 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLoginClick}
              className="flex items-center gap-2 px-6 py-2.5 bg-text-primary text-white font-medium rounded-full shadow-lg hover:bg-gray-800 transition-colors"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
