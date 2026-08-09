
        const API_BASE = '/movies';
        const AUTH_BASE = '/api/auth';
        let allMovies = [];
        let currentContentType = 'MOVIE';

        function switchContentType(type) {
            currentContentType = type;
            document.querySelectorAll('.type-icon-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('nav' + type).classList.add('active');
            
            const searchInput = document.getElementById('searchInput');
            if (searchInput && searchInput.value.trim().length > 0) {
                searchMovies(searchInput.value.trim());
            } else {
                fetchMovies(); 
            }
        }

        const defaultPosters = {
            'Inception': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
            'The Dark Knight': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
            'Interstellar': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
            'Parasite': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
            'Avengers: Endgame': 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
            'Spirited Away': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
        };

        document.addEventListener('DOMContentLoaded', () => {
            checkAuthStatus();
            fetchMovies();

            const searchInput = document.getElementById('searchInput');
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    const query = e.target.value.trim();
                    if (query.length > 0) {
                        searchMovies(query);
                    } else {
                        fetchMovies();
                    }
                }, 300);
            });
        });

        // Toggle Like Button
        function toggleLike(btn, movieId) {
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                btn.style.color = 'var(--text-muted)';
                showToast('Removed from liked movies', 'info');
            } else {
                btn.classList.add('active');
                btn.style.color = 'var(--accent-primary)';
                showToast('Added to liked movies! ❤️', 'success');
            }
        }

        // Authentication State Check
        function checkAuthStatus() {
            const token = localStorage.getItem('jwt_token');
            const username = localStorage.getItem('jwt_username');
            const role = localStorage.getItem('jwt_role');
            const authNav = document.getElementById('authNavSection');
            const addMovieBtn = document.getElementById('addMovieBtn');
            const tmdbImportBtn = document.getElementById('tmdbImportBtn');

            if (token && username) {
                authNav.innerHTML = `
                    <div class="user-badge">
                        <i class="fa-solid fa-user-check"></i> ${escapeHtml(username)}
                        <button onclick="logoutUser()" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:700; margin-left:4px;" title="Logout">
                            <i class="fa-solid fa-right-from-bracket"></i>
                        </button>
                    </div>
                `;
                if (addMovieBtn) addMovieBtn.style.display = (role === 'ROLE_ADMIN') ? 'inline-flex' : 'none';
                if (tmdbImportBtn) tmdbImportBtn.style.display = (role === 'ROLE_ADMIN') ? 'inline-flex' : 'none';
            } else {
                authNav.innerHTML = `
                    <button class="btn btn-secondary" onclick="openAuthModal()">
                        <i class="fa-solid fa-user-lock"></i> Login / Register
                    </button>
                `;
                if (addMovieBtn) addMovieBtn.style.display = 'none';
                if (tmdbImportBtn) tmdbImportBtn.style.display = 'none';
            }
        }

        function openAuthModal() {
            document.getElementById('authModal').classList.add('active');
        }

        function closeAuthModal() {
            document.getElementById('authModal').classList.remove('active');
        }

        function fillQuickAuth(user, pass) {
            document.getElementById('authUsernameInput').value = user;
            document.getElementById('authPasswordInput').value = pass;
        }

        let isLoginMode = true;

        function toggleAuthMode(e) {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            const title = document.getElementById('authModalTitle');
            const submitBtn = document.getElementById('authSubmitBtn');
            const toggleLink = document.getElementById('authToggleLink');
            const emailGroup = document.getElementById('authEmailGroup');
            const emailInput = document.getElementById('authEmailInput');
            const usernameLabel = document.getElementById('authUsernameLabel');
            
            if (isLoginMode) {
                title.textContent = 'Admin & User Login';
                submitBtn.textContent = 'Login';
                toggleLink.textContent = "Don't have an account? Sign Up";
                emailGroup.style.display = 'none';
                emailInput.removeAttribute('required');
                usernameLabel.textContent = 'Username or Email *';
            } else {
                title.textContent = 'Create an Account';
                submitBtn.textContent = 'Sign Up';
                toggleLink.textContent = "Already have an account? Login";
                emailGroup.style.display = 'flex';
                emailInput.setAttribute('required', 'true');
                usernameLabel.textContent = 'Username *';
            }
        }

        function openResetPasswordModal(e) {
            if (e) e.preventDefault();
            closeAuthModal();
            document.getElementById('resetPasswordModal').classList.add('active');
        }

        function closeResetPasswordModal() {
            document.getElementById('resetPasswordModal').classList.remove('active');
        }

        async function handleResetPasswordSubmit(e) {
            e.preventDefault();
            const username = document.getElementById('resetUsernameInput').value.trim();
            const newPassword = document.getElementById('resetNewPasswordInput').value;

            try {
                const response = await fetch(`${AUTH_BASE}/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, newPassword })
                });

                const data = await response.json();
                if (response.ok) {
                    showToast('Password reset successfully! Please login with your new password.');
                    closeResetPasswordModal();
                    openAuthModal();
                } else {
                    showToast(data.message || 'Failed to reset password', true);
                }
            } catch (error) {
                console.error('Reset Password Error:', error);
                showToast('Network error while resetting password', true);
            }
        }

        async function handleAuthSubmit(e) {
            e.preventDefault();
            const usernameInput = document.getElementById('authUsernameInput').value.trim();
            const password = document.getElementById('authPasswordInput').value;

            try {
                if (isLoginMode) {
                    const response = await fetch(`${AUTH_BASE}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ usernameOrEmail: usernameInput, password })
                    });
                    const result = await response.json();
                    if (response.ok && result.success) {
                        localStorage.setItem('jwt_token', result.data.accessToken);
                        localStorage.setItem('jwt_username', result.data.username);
                        localStorage.setItem('jwt_role', result.data.role);
                        showToast(`Welcome back, ${result.data.username}!`, 'success');
                        closeAuthModal();
                        checkAuthStatus();
                        fetchMovies();
                    } else {
                        showToast(result.message || 'Invalid login credentials', 'error');
                    }
                } else {
                    const email = document.getElementById('authEmailInput').value.trim();
                    const response = await fetch(`${AUTH_BASE}/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: usernameInput, email, password, role: 'ROLE_USER' })
                    });
                    const result = await response.json();
                    if (response.ok || response.status === 201) {
                        showToast('Account created successfully! Please login.', 'success');
                        toggleAuthMode({ preventDefault: () => {} }); // switch back to login mode
                        document.getElementById('authUsernameInput').value = usernameInput;
                        document.getElementById('authPasswordInput').value = '';
                    } else {
                        showToast(result.message || 'Registration failed', 'error');
                    }
                }
            } catch (err) {
                showToast('Authentication server error', 'error');
            }
        }

        function logoutUser() {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('jwt_username');
            localStorage.removeItem('jwt_role');
            showToast('Logged out successfully', 'success');
            checkAuthStatus();
            fetchMovies();
        }

        // Helper: Get Auth Header for Modification Requests
        function getAuthHeaders() {
            const token = localStorage.getItem('jwt_token');
            return token ? { 'Authorization': `Bearer ${token}` } : {};
        }

        // Handle Local File Upload
        async function handleFileUpload(fileInput, targetInputId, statusSpanId) {
            const file = fileInput.files[0];
            if (!file) return;

            const statusSpan = document.getElementById(statusSpanId);
            statusSpan.textContent = `Uploading ${file.name}...`;

            const formData = new FormData();
            formData.append('file', file);

            try {
                const headers = getAuthHeaders();
                const response = await fetch(`${API_BASE}/upload`, {
                    method: 'POST',
                    headers: headers,
                    body: formData
                });

                const result = await response.json();
                if (response.ok && result.success) {
                    document.getElementById(targetInputId).value = result.data;
                    statusSpan.textContent = `Uploaded: ${file.name}`;
                    showToast(`File uploaded successfully! Saved as ${result.data}`, 'success');
                } else {
                    statusSpan.textContent = `Upload failed`;
                    showToast(result.message || 'File upload failed (Please login first)', 'error');
                }
            } catch (err) {
                console.error(err);
                statusSpan.textContent = `Upload failed`;
                showToast('Error uploading file to server', 'error');
            }
        }

        // Fetch All Movies
        async function fetchMovies(endpoint = '') {
            try {
                const url = endpoint ? `${API_BASE}/${endpoint}` : API_BASE;
                const response = await fetch(url);
                const result = await response.json();
                if (result.success) {
                    allMovies = result.data;
                    renderMovies(allMovies);
                    updateStats(allMovies);
                } else {
                    showToast(result.message || 'Failed to fetch movies', 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('Error connecting to yunushVerse server', 'error');
            }
        }

        // Search Movies by Title
        async function searchMovies(query) {
            try {
                const response = await fetch(`${API_BASE}/search?title=${encodeURIComponent(query)}`);
                const result = await response.json();
                if (result.success) {
                    renderMovies(result.data);
                }
            } catch (err) {
                console.error(err);
            }
        }

        // Filter Category Pill Handler
        function filterCategory(category, element) {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            element.classList.add('active');

            if (category === 'all') {
                fetchMovies();
            } else {
                fetchMovies(category);
            }
        }

        // Sort Handler
        function handleSortChange(sortVal) {
            const [sortBy, sortDir] = sortVal.split('-');
            if (sortBy === 'id') {
                fetchMovies();
            } else {
                fetchMovies(`?sortBy=${sortBy}&sortDir=${sortDir}`);
            }
        }

        // Play Movie / YouTube Style View
        function playMovieTrailer(id) {
            const movie = allMovies.find(m => m.id === id);
            if (!movie) return;
            
            const title = movie.title;
            let targetUrl = movie.videoUrl || defaultTrailers[title] || 'https://www.youtube.com/embed/YoHD9XEInc0';
            
            // Convert standard YouTube watch URLs to embed
            if (targetUrl.includes('youtube.com/watch?v=')) {
                targetUrl = targetUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/');
                const ampersandIdx = targetUrl.indexOf('&');
                if (ampersandIdx !== -1) targetUrl = targetUrl.substring(0, ampersandIdx);
            } else if (targetUrl.includes('youtu.be/')) {
                targetUrl = targetUrl.replace('youtu.be/', 'youtube.com/embed/');
                const questionIdx = targetUrl.indexOf('?');
                if (questionIdx !== -1) targetUrl = targetUrl.substring(0, questionIdx);
            }
            
            document.querySelector('header').style.display = 'none';
            document.querySelector('main').style.display = 'none';
            
            document.getElementById('playerMovieTitle').textContent = title;
            document.getElementById('playerDesc').innerHTML = `
                <p><strong>Release Year:</strong> ${movie.releaseYear} &nbsp;|&nbsp; <strong>Duration:</strong> ${movie.duration} min &nbsp;|&nbsp; <strong>Rating:</strong> ⭐ ${movie.rating}</p>
                <p style="margin-top:0.5rem"><strong>Director:</strong> ${escapeHtml(movie.director)} &nbsp;|&nbsp; <strong>Genre:</strong> ${escapeHtml(movie.genre)} &nbsp;|&nbsp; <strong>Language:</strong> ${escapeHtml(movie.language)}</p>
            `;
            
            const container = document.getElementById('playerVideoContainer');
            const isLocalVideo = targetUrl.startsWith('/uploads/') || targetUrl.match(/\.(mp4|mkv|webm|avi|mov)$/i);

            if (isLocalVideo) {
                container.innerHTML = `
                    <video controls autoplay class="html5-player" style="width:100%; height:100%; object-fit:contain;">
                        <source src="${targetUrl}" type="video/mp4">
                        Your browser does not support HTML5 video tag.
                    </video>
                `;
            } else {
                const autoPlayUrl = targetUrl + (targetUrl.includes('?') ? '&autoplay=1' : '?autoplay=1');
                container.innerHTML = `
                    <iframe id="videoIframe" src="${autoPlayUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                `;
            }

            renderUpNext(movie.id, movie.contentType || 'MOVIE');
            
            document.getElementById('youtubePlayerView').classList.add('active');
            window.scrollTo(0, 0);
        }

        function closePlayerView() {
            document.getElementById('youtubePlayerView').classList.remove('active');
            document.getElementById('playerVideoContainer').innerHTML = '';
            document.querySelector('header').style.display = 'flex';
            document.querySelector('main').style.display = 'block';
        }

        function renderUpNext(currentId, contentType) {
            const suggestions = allMovies.filter(m => (m.contentType || 'MOVIE') === contentType && m.id !== currentId);
            const container = document.getElementById('upNextContainer');
            
            if (suggestions.length === 0) {
                container.innerHTML = '<p class="text-muted">No suggested content found.</p>';
                return;
            }

            container.innerHTML = suggestions.map(m => {
                const posterSrc = m.posterUrl || defaultPosters[m.title] || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                return `
                <div class="suggested-card" onclick="playMovieTrailer(${m.id})">
                    <img src="${posterSrc}" class="suggested-thumb" alt="${escapeHtml(m.title)}">
                    <div class="suggested-info">
                        <div class="suggested-title">${escapeHtml(m.title)}</div>
                        <div class="suggested-meta">${escapeHtml(m.director)} • ${m.releaseYear}</div>
                        <div class="suggested-meta" style="margin-top:2px;">⭐ ${m.rating.toFixed(1)}</div>
                    </div>
                </div>
                `;
            }).join('');
        }

        function togglePlayerLike(btn) {
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                btn.style.color = '';
                showToast('Removed from liked videos', 'info');
            } else {
                btn.classList.add('active');
                btn.style.color = 'var(--accent-primary)';
                showToast('Added to liked videos! ❤️', 'success');
            }
        }

        function shareMovie() {
            if (navigator.share) {
                navigator.share({
                    title: 'yunushVerse',
                    text: 'Check out this awesome video on yunushVerse!',
                    url: window.location.href
                }).catch(err => console.log('Share failed:', err));
            } else {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showToast('Link copied to clipboard!', 'success');
                });
            }
        }

        function togglePlayerSave(btn) {
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                btn.style.color = '';
                showToast('Removed from saved videos', 'info');
            } else {
                btn.classList.add('active');
                btn.style.color = 'var(--accent-purple)';
                showToast('Added to saved videos! 🔖', 'success');
            }
        }

        // Render Movie Cards to Grid
        function renderMovies(movies) {
            movies = movies.filter(m => (m.contentType || 'MOVIE') === currentContentType);
            const grid = document.getElementById('moviesGrid');
            if (!movies || movies.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-film"></i>
                        <h3>No Movies Found</h3>
                        <p class="text-muted">Try adjusting your search criteria or upload a new downloaded movie to the collection.</p>
                    </div>
                `;
                return;
            }

            grid.innerHTML = movies.map(movie => {
                const posterSrc = movie.posterUrl || defaultPosters[movie.title] || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                return `
                <div class="movie-card" data-aos="fade-up">
                    <div class="card-poster-wrapper">
                        <img src="${posterSrc}" alt="${escapeHtml(movie.title)} Poster" class="card-poster-img" onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'">
                        <div class="poster-overlay-gradient"></div>
                        <button class="play-btn-overlay" title="Play Movie" onclick="playMovieTrailer(${movie.id})">
                            <i class="fa-solid fa-play"></i>
                        </button>
                        <div class="rating-badge"><i class="fa-solid fa-star"></i> ${movie.rating.toFixed(1)}</div>
                        <span class="genre-badge">${escapeHtml(movie.genre)}</span>
                    </div>
                    <div class="card-body">
                        <h3 class="movie-title">${escapeHtml(movie.title)}</h3>
                        <div class="movie-meta">
                            <span><i class="fa-regular fa-calendar"></i> ${movie.releaseYear}</span>
                            <span><i class="fa-regular fa-clock"></i> ${movie.duration} min</span>
                            <span><i class="fa-solid fa-language"></i> ${escapeHtml(movie.language)}</span>
                        </div>
                        <div class="movie-director">
                            <i class="fa-solid fa-clapperboard"></i> Dir. ${escapeHtml(movie.director)}
                        </div>
                        <button class="play-trailer-btn" onclick="playMovieTrailer('${escapeHtml(movie.title)}', '${movie.videoUrl || ''}')">
                            <i class="fa-solid fa-circle-play"></i> Watch Movie / Video
                        </button>
                        ${localStorage.getItem('jwt_role') === 'ROLE_ADMIN' ? `
                        <div class="card-footer">
                            <button class="icon-btn edit" title="Edit Movie" onclick="openEditMovieModal(${movie.id})">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="icon-btn delete" title="Delete Movie" onclick="deleteMovie(${movie.id})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                        ` : (localStorage.getItem('jwt_role') === 'ROLE_USER' ? `
                        <div class="card-footer">
                            <button class="icon-btn like" title="Like Movie" onclick="toggleLike(this, ${movie.id})" style="color: var(--text-muted);">
                                <i class="fa-solid fa-heart"></i>
                            </button>
                        </div>
                        ` : '')}
                    </div>
                </div>
            `;
            }).join('');
        }

        // Update Header Stats
        function updateStats(movies) {
            document.getElementById('statTotalMovies').textContent = movies.length;
            const topRating = movies.length > 0 ? Math.max(...movies.map(m => m.rating)) : 0;
            document.getElementById('statTopRating').textContent = topRating.toFixed(1);
        }

        // Open Add Modal
        function openAddMovieModal() {
            document.getElementById('modalTitle').textContent = 'Add New Content';
            document.getElementById('movieForm').reset();
            document.getElementById('contentTypeInput').value = currentContentType;
            document.getElementById('movieId').value = '';
            document.getElementById('videoUploadStatus').textContent = 'No local file selected';
            document.getElementById('posterUploadStatus').textContent = 'No local image selected';
            document.getElementById('movieModal').classList.add('active');
        }

        // Open Edit Modal
        async function openEditMovieModal(id) {
            try {
                const response = await fetch(`${API_BASE}/${id}`);
                const result = await response.json();
                if (result.success) {
                    const m = result.data;
                    document.getElementById('modalTitle').textContent = 'Edit Content';
                    document.getElementById('movieId').value = m.id;
                    document.getElementById('contentTypeInput').value = m.contentType || 'MOVIE';
                    document.getElementById('titleInput').value = m.title;
                    document.getElementById('genreInput').value = m.genre;
                    document.getElementById('languageInput').value = m.language;
                    document.getElementById('yearInput').value = m.releaseYear;
                    document.getElementById('ratingInput').value = m.rating;
                    document.getElementById('durationInput').value = m.duration;
                    document.getElementById('directorInput').value = m.director;
                    document.getElementById('posterUrlInput').value = m.posterUrl || '';
                    document.getElementById('videoUrlInput').value = m.videoUrl || '';
                    document.getElementById('videoUploadStatus').textContent = m.videoUrl ? 'File set: ' + m.videoUrl : 'No local file selected';
                    document.getElementById('posterUploadStatus').textContent = m.posterUrl ? 'Image set: ' + m.posterUrl : 'No local image selected';
                    document.getElementById('movieModal').classList.add('active');
                }
            } catch (err) {
                showToast('Failed to load movie details', 'error');
            }
        }

        // Close Modal
        function closeMovieModal() {
            document.getElementById('movieModal').classList.remove('active');
        }

        // Save (Add / Update) Movie Handler
        async function handleFormSubmit(e) {
            e.preventDefault();
            const id = document.getElementById('movieId').value;
            const payload = {
                contentType: document.getElementById('contentTypeInput').value,
                title: document.getElementById('titleInput').value.trim(),
                genre: document.getElementById('genreInput').value.trim(),
                language: document.getElementById('languageInput').value.trim(),
                releaseYear: parseInt(document.getElementById('yearInput').value),
                rating: parseFloat(document.getElementById('ratingInput').value),
                duration: parseInt(document.getElementById('durationInput').value),
                director: document.getElementById('directorInput').value.trim(),
                posterUrl: document.getElementById('posterUrlInput').value.trim(),
                videoUrl: document.getElementById('videoUrlInput').value.trim()
            };

            const method = id ? 'PUT' : 'POST';
            const url = id ? `${API_BASE}/${id}` : API_BASE;

            try {
                const headers = {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                };

                const response = await fetch(url, {
                    method: method,
                    headers: headers,
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                if (response.ok && result.success) {
                    showToast(id ? 'Movie updated successfully!' : 'Movie created successfully!', 'success');
                    closeMovieModal();
                    fetchMovies();
                } else {
                    const errMsg = result.fieldErrors 
                        ? Object.values(result.fieldErrors).join(', ') 
                        : (result.message || 'Error saving movie. Please login first.');
                    showToast(errMsg, 'error');
                }
            } catch (err) {
                showToast('Server error while saving movie', 'error');
            }
        }

        // Delete Movie
        async function deleteMovie(id) {
            if (!confirm('Are you sure you want to delete this movie?')) return;
            try {
                const headers = getAuthHeaders();
                const response = await fetch(`${API_BASE}/${id}`, {
                    method: 'DELETE',
                    headers: headers
                });
                const result = await response.json();
                if (result.success) {
                    showToast('Movie deleted successfully', 'success');
                    fetchMovies();
                } else {
                    showToast(result.message || 'Failed to delete movie. Please login first.', 'error');
                }
            } catch (err) {
                showToast('Error connecting to server', 'error');
            }
        }

        // Toast Notification System
        function showToast(message, type = 'info') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${message}`;
            container.appendChild(toast);
            setTimeout(() => {
                toast.remove();
            }, 4000);
        }

        function escapeHtml(text) {
            if (!text) return '';
            return text.replace(/[&<>"']/g, function(m) {
                return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
            });
        }
    

        // TMDB Logic
        function openTmdbModal() {
            document.getElementById('tmdbModal').classList.add('active');
            document.getElementById('tmdbSearchInput').value = '';
            document.getElementById('tmdbResults').innerHTML = '';
        }

        function closeTmdbModal() {
            document.getElementById('tmdbModal').classList.remove('active');
        }

        async function searchTmdb() {
            const query = document.getElementById('tmdbSearchInput').value.trim();
            if (!query) return showToast('Please enter a movie title', 'error');

            const resultsContainer = document.getElementById('tmdbResults');
            resultsContainer.innerHTML = '<div style="color:var(--text-muted); text-align:center;">Searching...</div>';
            
            try {
                const response = await fetch(`${API_BASE}/tmdb/search?query=${encodeURIComponent(query)}`);
                const result = await response.json();
                
                if (result.success && result.data && result.data.results && result.data.results.length > 0) {
                    resultsContainer.innerHTML = result.data.results.map(movie => `
                        <div class="tmdb-result-card">
                            <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w200' + movie.poster_path : defaultPosters['Inception']}" alt="Poster" class="tmdb-result-poster">
                            <div class="tmdb-result-info">
                                <div class="tmdb-result-title">${escapeHtml(movie.title || movie.original_title)}</div>
                                <div class="tmdb-result-meta">${movie.release_date ? movie.release_date.substring(0,4) : 'N/A'} • ★ ${movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}</div>
                            </div>
                            <button class="btn btn-primary" onclick="importTmdbMovie(${movie.id})" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Import</button>
                        </div>
                    `).join('');
                } else {
                    resultsContainer.innerHTML = '<div style="color:var(--text-muted); text-align:center;">No movies found.</div>';
                }
            } catch (err) {
                console.error(err);
                resultsContainer.innerHTML = '<div style="color:var(--accent-primary); text-align:center;">Error searching TMDB. Check API Key.</div>';
            }
        }

        async function importTmdbMovie(tmdbId) {
            try {
                showToast('Importing movie...', 'info');
                const headers = getAuthHeaders();
                const response = await fetch(`${API_BASE}/tmdb/import?tmdbId=${tmdbId}`, {
                    method: 'POST',
                    headers: headers
                });
                const result = await response.json();
                
                if (result.success || response.ok) {
                    showToast('Movie imported successfully! 🎉', 'success');
                    closeTmdbModal();
                    fetchMovies();
                } else {
                    showToast(result.message || 'Failed to import movie.', 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('Network error during import.', 'error');
            }
        }

// AOS Initialization
const script = document.createElement('script');
script.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
script.onload = () => { AOS.init({ duration: 800, once: true }); };
document.head.appendChild(script);
