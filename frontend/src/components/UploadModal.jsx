import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, UploadCloud } from 'lucide-react';
import { uploadMovie } from '../api';

export default function UploadModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '', description: '', genre: 'Action', releaseYear: '', rating: ''
  });
  const [files, setFiles] = useState({
    movieFile: null, trailerFile: null, posterFile: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const data = new FormData();
    data.append('movie', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
    if (files.movieFile) data.append('movieFile', files.movieFile);
    if (files.trailerFile) data.append('trailerFile', files.trailerFile);
    if (files.posterFile) data.append('posterFile', files.posterFile);

    try {
      const response = await uploadMovie(data);
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading movie');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 py-5 border-b border-surface-100 flex items-center justify-between bg-surface-50">
          <h2 className="text-xl font-bold flex items-center gap-2"><UploadCloud className="w-6 h-6 text-brand-500" /> Upload Movie</h2>
          <button onClick={onClose} className="p-2 text-text-secondary hover:bg-surface-200 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="overflow-y-auto p-8">
          <form id="uploadForm" onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input required type="text" name="title" onChange={handleInputChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Genre</label>
                <select name="genre" onChange={handleInputChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl">
                  <option value="Action">Action</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Drama">Drama</option>
                  <option value="Comedy">Comedy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" onChange={handleInputChange} rows="3" className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Release Year</label>
                <input type="number" name="releaseYear" onChange={handleInputChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <input type="number" step="0.1" name="rating" onChange={handleInputChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl" />
              </div>
            </div>

            <div className="p-6 bg-surface-50 rounded-2xl border border-dashed border-surface-200 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Movie File (MP4) *</label>
                <input required type="file" name="movieFile" accept="video/mp4" onChange={handleFileChange} className="w-full text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Trailer File (MP4)</label>
                <input type="file" name="trailerFile" accept="video/mp4" onChange={handleFileChange} className="w-full text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Poster Image (JPG/PNG)</label>
                <input type="file" name="posterFile" accept="image/*" onChange={handleFileChange} className="w-full text-sm" />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-surface-100 bg-surface-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-3 font-medium text-text-secondary hover:bg-surface-200 rounded-xl">Cancel</button>
          <button form="uploadForm" type="submit" disabled={isLoading} className="px-8 py-3 bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-600 disabled:opacity-70">
            {isLoading ? 'Uploading...' : 'Upload Movie'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
