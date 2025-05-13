document.addEventListener('DOMContentLoaded', () => {
    const moviesContainer = document.querySelector('#movies .media-scroll-container');
    const tvShowsContainer = document.querySelector('#tv-shows .media-scroll-container');
    const booksContainer = document.querySelector('#books .media-scroll-container');
    const gamesContainer = document.querySelector('#games .media-scroll-container');
    const albumsContainer = document.querySelector('#albums .media-scroll-container');

    // Get modal elements
    const modal = document.getElementById('mediaModal');
    const modalTitle = document.getElementById('modal-title');
    const modalPoster = document.getElementById('modal-poster');
    const modalBanner = document.getElementById('modal-banner');
    const modalInfoSection = document.querySelector('.modal-info-section');
    const closeButton = document.querySelector('.close-x-btn');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const backgroundSlideshow = document.querySelector('.background-slideshow');
    const heroContentContainer = document.querySelector('.hero-content');
    const localStorageKey = 'myMediaCollectionData';

    // Initially hide the modal
    modal.style.display = 'none';

    // Function to load media items from localStorage
    function loadMediaItems() {
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
            return JSON.parse(storedData);
        } else {
            return [];
        }
    }

    // Load media items on page load
    const mediaItems = loadMediaItems();

    // Display media in the specified container
    function displayMedia(mediaList, container) {
        container.innerHTML = '';
        mediaList.forEach(media => {
            const card = document.createElement('div');
            card.classList.add('media-card');
            card.innerHTML = `
                <img src="${media.posterUrl}" alt="${media.title}">
                <div class="media-card-info">
                    <h3>${media.title}</h3>
                    <p>${media.releaseYear}</p>
                </div>
            `;
            card.addEventListener('click', () => openModal(media));
            container.appendChild(card);
        });
    }

    function filterMediaByType(type) {
        return mediaItems.filter(item => item.type === type);
    }

    function getTopOrFavoriteMedia() {
        return mediaItems.filter(item => item.isTopPicked || item.isFavorite);
    }

    function displayHeroMedia(media) {
    if (media) {
        let actionButton = '';
        let actionText = '';
        let actionUrl = '';

        if (media.type === 'movie' || media.type === 'tvshow') {
            actionText = media.watchUrl ? 'Watch Now' : null;
            actionUrl = media.watchUrl;
        } else if (media.type === 'book') {
            actionText = media.readUrl ? 'Read Now' : null;
            actionUrl = media.readUrl;
        } else if (media.type === 'game') {
            actionText = media.downloadUrl ? 'Play Now' : null;
            actionUrl = media.downloadUrl;
        } else if (media.type === 'album') {
            actionText = media.watchUrl ? 'Listen Now' : null;
            actionUrl = media.watchUrl;
        }

        if (actionText) {
            actionButton = `<a href="${actionUrl}" target="_blank" class="hero-button action">${actionText}</a>`;
        } else {
            actionButton = `<button class="hero-button action disabled">No Link</button>`;
        }

        let trailerButton = '';
        if ((media.type === 'movie' || media.type === 'tvshow') && media.trailerUrl) {
            trailerButton = `<a href="${media.trailerUrl}" target="_blank" class="hero-button trailer">Trailer</a>`;
        } else if (media.type === 'game' && media.trailerUrl) {
            trailerButton = `<a href="${media.trailerUrl}" target="_blank" class="hero-button trailer">Trailer</a>`;
        } else {
            trailerButton = `<button class="hero-button trailer disabled">Trailer</button>`;
        }

        let additionalInfo = '';
        if (media.type === 'game' && media.platform) {
            additionalInfo += `<p class="hero-meta"><span class="meta-label">Platform:</span> ${media.platform}</p>`;
        }
        if ((media.type === 'movie' || media.type === 'tvshow') && media.cast) {
            additionalInfo += `<p class="hero-cast"><span class="cast-label">Cast:</span> ${media.cast}</p>`;
        } else if (media.type === 'book' && media.author) {
            additionalInfo += `<p class="hero-author"><span class="author-label">Author:</span> ${media.author}</p>`;
        } else if (media.type === 'album' && media.artist) {
            additionalInfo += `<p class="hero-artist"><span class="artist-label">Artist:</span> ${media.artist}</p>`;
        } else if (media.type === 'game' && media.developer) {
            additionalInfo += `<p class="hero-developer"><span class="developer-label">Developer:</span> ${media.developer}</p>`;
        }


        heroContentContainer.innerHTML = `
            <h1>${media.title}</h1>
            <p>${media.description || ''}</p>
            <p class="hero-meta">
                <span class="media-type">${media.type.toUpperCase()}</span>
                <span class="release-year">${media.releaseYear || ''}</span>
            </p>
            ${additionalInfo}
            <div class="hero-buttons">
                ${actionButton}
                ${trailerButton}
            </div>
        `;
        backgroundSlideshow.style.backgroundImage = `url('${media.bannerUrl}')`;
    }
}
    function startBackgroundSlideshow(mediaList) {
        backgroundSlideshow.innerHTML = ''; // Clear existing slides
        const validMedia = mediaList.filter(media => media.bannerUrl); // Filter out media without bannerUrls

        if (validMedia.length === 0) {
            return; // Don't start if there are no valid slides.
        }

        validMedia.forEach(media => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            slide.style.backgroundImage = `url('${media.bannerUrl}')`;
            backgroundSlideshow.appendChild(slide);
        });

        const slides = document.querySelectorAll('.slide');
        let currentIndex = 0;

        // Ensure slides are found
        if (slides.length > 0) {
            slides[currentIndex].classList.add('active'); // Show first slide
            displayHeroMedia(validMedia[currentIndex]); // Display hero content for the first slide

            function showSlide() {
                slides.forEach(slide => slide.classList.remove('active'));
                slides[currentIndex].classList.add('active');

                // Update hero content based on the current slide
                const currentMedia = validMedia[currentIndex];
                displayHeroMedia(currentMedia);

                currentIndex = (currentIndex + 1) % slides.length;
            }
            setInterval(showSlide, 5000);
        }
    }

    // Top or favorite media
    const topOrFavoriteMedia = getTopOrFavoriteMedia();
    if (topOrFavoriteMedia.length > 0) {
        displayHeroMedia(topOrFavoriteMedia[0]);
        startBackgroundSlideshow(topOrFavoriteMedia);
    }

    // Display media by category
    const movies = filterMediaByType('movie').slice(0, 5);
    const tvShows = filterMediaByType('tvshow').slice(0, 5);
    const books = filterMediaByType('book').slice(0, 5);
    const games = filterMediaByType('game').slice(0, 5);
    const albums = filterMediaByType('album').slice(0, 5);


    displayMedia(movies, moviesContainer);
    displayMedia(tvShows, tvShowsContainer);
    displayMedia(books, booksContainer);
    displayMedia(games, gamesContainer);
    displayMedia(albums, albumsContainer);



    function openModal(media) {
        const spotifyContainer = document.getElementById('spotify-container');
        const watchNowBtn = document.querySelector('.watch-now-btn');
        const modalActions = document.querySelector('.modal-actions');

        // Clear any existing content
        spotifyContainer.innerHTML = '';
        modalActions.innerHTML = ''; // Clear existing buttons to avoid duplicates
        modalInfoSection.innerHTML = ''; // Clear existing info content

        // Set the modal content
        modalTitle.textContent = media.title || 'Untitled';
        modalPoster.src = media.posterUrl || '';
        modalPoster.alt = `${media.title || 'Media'} Poster`;

        // Set the banner image - use bannerUrl if available, otherwise use posterUrl
        modalBanner.src = media.bannerUrl || media.posterUrl || '';
        modalBanner.alt = `${media.title || 'Media'} Banner`;

        // Dynamically build modal-info-section
        const fields = [];

        // Release date
        const releaseDate = media.releaseDate || (media.releaseYear ? `${media.releaseYear}` : '');
        if (releaseDate) {
            fields.push({ label: 'Release Date', value: releaseDate });
        }

        // Genre
        if (media.genre) {
            fields.push({ label: 'Genre', value: media.genre });
        }

        // Director/Author/Developer/Artist
        if (media.type === 'movie' || media.type === 'tvshow') {
            if (media.director) {
                fields.push({ label: 'Director', value: media.director });
            }
            if (media.cast) {
                fields.push({ label: 'Cast', value: media.cast });
            }
        } else if (media.type === 'book') {
            if (media.author) {
                fields.push({ label: 'Author', value: media.author });
            }
            if (media.publisher) {
                fields.push({ label: 'Publisher', value: media.publisher });
            }
        } else if (media.type === 'game') {
            if (media.developer) {
                fields.push({ label: 'Developer', value: media.developer });
            }
            if (media.platform) {
                fields.push({ label: 'Platform', value: media.platform });
            }
            if (media.genre) {
                fields.push({ label: 'Genre', value: media.genre });
            }
        } else if (media.type === 'album') {
            if (media.artist) {
                fields.push({ label: 'Artist', value: media.artist });
            }
            if (media.genre) {
                fields.push({ label: 'Genre', value: media.genre });
            }
            if (media.label) {
                fields.push({ label: 'Label', value: media.label });
            }
            if (media.spotifyEmbedUrl) {
                // Spotify Embed URL will be handled by the Spotify link below
            }
        }

        // Description
        if (media.description) {
            fields.push({ label: 'Synopsis', value: media.description, className: 'modal-synopsis' });
        }

        // Render fields
        fields.forEach(field => {
            const p = document.createElement('p');
            p.classList.add('modal-text');
            if (field.className) {
                p.classList.add(field.className);
            }
            p.innerHTML = `<span class="modal-label">${field.label}:</span> <span>${field.value}</span>`;
            modalInfoSection.appendChild(p);
        });

        // Handle "Watch Now/Read Now/Play Now/Listen Now" button
        modalActions.appendChild(watchNowBtn);
        let watchNowText = '';
        let watchNowUrl = '';
        if (media.type === 'movie' || media.type === 'tvshow') {
            watchNowText = 'Watch Now';
            watchNowUrl = media.watchUrl;
        } else if (media.type === 'book') {
            watchNowText = 'Read Now';
            watchNowUrl = media.readUrl;
        } else if (media.type === 'game') {
            watchNowText = 'Play Now';
            watchNowUrl = media.downloadUrl;
        } else if (media.type === 'album') {
            watchNowText = 'Listen Now';
            watchNowUrl = media.spotifyEmbedUrl; // Use spotifyEmbedUrl for albums
        }
        watchNowBtn.textContent = watchNowText;
        watchNowBtn.onclick = watchNowUrl ? () => window.open(watchNowUrl, '_blank') : null;
        watchNowBtn.disabled = !watchNowUrl;
        watchNowBtn.style.opacity = watchNowUrl ? '1' : '0.5';

        // Add Spotify link if available (redundant now, but kept for potential other uses)
        if (media.type === 'album' && media.spotifyEmbedUrl) {
            const spotifyLink = document.createElement('a');
            spotifyLink.href = media.spotifyEmbedUrl;
            spotifyLink.id = 'modal-spotify-url';
            spotifyLink.target = '_blank';
            spotifyLink.rel = 'noopener noreferrer';
            spotifyLink.textContent = 'Open in Spotify';
            spotifyLink.classList.add('spotify-btn');
            Object.assign(spotifyLink.style, { display: 'inline-block', backgroundColor: '#1DB954', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', marginLeft: '0.75rem', textDecoration: 'none' });
            spotifyContainer.appendChild(spotifyLink);
        }

        // Add Watch Trailer button if trailerUrl exists (only for movies and TV shows for now)
        if (media.trailerUrl && (media.type === 'movie' || media.type === 'tvshow')) {
            const trailerBtn = document.createElement('button');
            trailerBtn.classList.add('trailer-btn');
            trailerBtn.textContent = 'Watch Trailer';
            Object.assign(trailerBtn.style, { backgroundColor: '#6b7280', color: 'white', fontWeight: '600', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', cursor: 'pointer', transition: 'background-color 0.3s', border: 'none', marginLeft: '0.5rem' });
            trailerBtn.onclick = () => window.open(media.trailerUrl, '_blank');
            trailerBtn.addEventListener('mouseover', () => trailerBtn.style.backgroundColor = '#4b5563');
            trailerBtn.addEventListener('mouseout', () => trailerBtn.style.backgroundColor = '#6b7280');
            modalActions.appendChild(trailerBtn);
        }

        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    // Function to close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        location.reload(); // Refresh the page (optional, can remove if fixed)
    }

    // Modal event listeners
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    // Add event listeners to media cards
    function addCardListeners() {
        const mediaCards = document.querySelectorAll('.media-card');
        mediaCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                const mediaItem = mediaItems.find(item => item.title === title);
                if (mediaItem) {
                    openModal(mediaItem);
                }
            });
        });
    }

    // Initialize card listeners if media items exist
    if (mediaItems.length > 0) {
        addCardListeners();
    }

    // Initial display of media categories
    displayMedia(movies, moviesContainer);
    displayMedia(tvShows, tvShowsContainer);
    displayMedia(books, booksContainer);
    displayMedia(games, gamesContainer);
    displayMedia(albums, albumsContainer);
});