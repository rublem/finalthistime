document.addEventListener('DOMContentLoaded', () => {
    const moviesContainer = document.querySelector('#movies .media-scroll-container');
    const tvShowsContainer = document.querySelector('#tv-shows .media-scroll-container');
    const booksContainer = document.querySelector('#books .media-scroll-container');
    const gamesContainer = document.querySelector('#games .media-scroll-container');
    const albumsContainer = document.querySelector('#albums .media-scroll-container');
    

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

    modal.style.display = 'none';

    function loadMediaItems() {
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
            return JSON.parse(storedData);
        } else {
            return [];
        }
    }


    const mediaItems = loadMediaItems();


    function displayMedia(mediaList, container, limit = Infinity) {
        container.innerHTML = '';
        mediaList.slice(0, limit).forEach(media => {
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

    // Add arrow buttons to a media category
    function addScrollArrows(category, container) {
        const leftArrow = document.createElement('button');
        leftArrow.classList.add('scroll-arrow', 'left');
        leftArrow.innerHTML = '←';
        leftArrow.disabled = true; // Initially disabled (at start)
        category.appendChild(leftArrow);

        const rightArrow = document.createElement('button');
        rightArrow.classList.add('scroll-arrow', 'right');
        rightArrow.innerHTML = '→';
        rightArrow.disabled = container.scrollWidth <= container.clientWidth; // Disable if no overflow
        category.appendChild(rightArrow);

        // Update arrow states based on scroll position
        function updateArrows() {
            leftArrow.disabled = container.scrollLeft <= 0;
            rightArrow.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
        }

        // Scroll left/right by container width
        leftArrow.addEventListener('click', () => {
            container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
            setTimeout(updateArrows, 300); // Update after scroll animation
        });

        rightArrow.addEventListener('click', () => {
            container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
            setTimeout(updateArrows, 300);
        });

        // Update arrows on scroll
        container.addEventListener('scroll', updateArrows);
        updateArrows(); // Initial check
    }

    // Filter media by type
       function filterMediaByType(type) {
        if (Array.isArray(mediaItems)) {
            return mediaItems.filter(item => item.type === type);
        }
        return mediaItems && mediaItems.type === type ? [mediaItems] : [];
    }
    

    // Get top or favorite media
    function getTopOrFavoriteMedia() {
        if (Array.isArray(mediaItems)) {
            return mediaItems.filter(item => item.isTopPicked || item.isFavorite);
        }
        return mediaItems && (mediaItems.isTopPicked || mediaItems.isFavorite) ? [mediaItems] : [];
    }

    // Display hero media
    function displayHeroMedia(media) {
        if (media) {
            let actionButton = '';
            let actionText = '';
            let actionUrl = '';

            if (media.type === 'movie' || media.type === 'tvshow') {
                actionText = 'Watch Now';
                actionUrl = media.watchUrl;
            } else if (media.type === 'book') {
                actionText = 'Read Now';
                actionUrl = media.readUrl;
            } else if (media.type === 'game') {
                actionText = 'Play Now';
                actionUrl = media.downloadUrl;
            } else if (media.type === 'album') {
                actionText = 'Listen Now';
                actionUrl = media.spotifyEmbedUrl;
                console.log('Hero Spotify URL:', media.spotifyEmbedUrl);
            }

            if (actionUrl) {
                actionButton = `<a href="${actionUrl}" target="_blank" class="hero-button action">${actionText}</a>`;
            } else {
                actionButton = `<button class="hero-button action disabled" disabled>${actionText || 'No Action'}</button>`;
            }

            let trailerButton = '';
            if (media.trailerUrl) {
                trailerButton = `<a href="${media.trailerUrl}" target="_blank" class="hero-button trailer">Trailer</a>`;
            } else {
                trailerButton = `<button class="hero-button trailer disabled" disabled>Trailer</button>`;
            }

            let castInfo = '';
            if ((media.type === 'movie' || media.type === 'tvshow') && media.cast) {
                castInfo = `<p class="hero-cast"><span class="cast-label">Cast:</span> ${media.cast}</p>`;
            } else if (media.type === 'album' && media.artist) {
                castInfo = `<p class="hero-artist"><span class="artist-label">Artist:</span> ${media.artist}</p>`;
            }

            heroContentContainer.innerHTML = `
                <h1>${media.title}</h1>
                <p>${media.description || ''}</p>
                <p class="hero-meta">
                    <span class="media-type">${media.type.toUpperCase()}</span>
                    <span class="release-year">${media.releaseYear || ''}</span>
                </p>
                ${castInfo}
                <div class="hero-buttons">
                    ${actionButton}
                    ${trailerButton}
                </div>
            `;
            backgroundSlideshow.style.backgroundImage = `url('${media.bannerUrl}')`;
        }
    }
        function getLogo() {
            return "logo.png";
        }

function startBackgroundSlideshow(mediaList) {
    backgroundSlideshow.innerHTML = '';

    const validMedia = Array.isArray(mediaList)
        ? mediaList.filter(media => media.bannerUrl)
        : (mediaList && mediaList.bannerUrl ? [mediaList] : []);


    if (validMedia.length === 0) {
        const logoSlide = document.createElement('div');
        logoSlide.classList.add('slide', 'logo-slide', 'active'); 
        const logoUrl = getLogo();
        logoSlide.style.backgroundImage = `url('${logoUrl}')`;
        logoSlide.style.backgroundSize = 'contain';
        logoSlide.style.backgroundRepeat = 'no-repeat';
        logoSlide.style.backgroundPosition = 'center';
        logoSlide.style.backgroundPosition = 'center calc(50% - 70px)';
        logoSlide.style.width = '100%'; 
        logoSlide.style.height = '100%'; 
        backgroundSlideshow.appendChild(logoSlide);

        const img = new Image();
        img.src = logoUrl;
        img.onload = () => console.log('Logo image loaded successfully:', logoUrl);
        img.onerror = () => {
            console.error('Failed to load logo image:', logoUrl);
            logoSlide.style.backgroundImage = `url('https://via.placeholder.com/1920x1080')`; // Fallback
        };

        displayHeroMedia(null);
        return;
    }


    validMedia.forEach(media => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.style.backgroundImage = `url('${media.bannerUrl}')`;
        backgroundSlideshow.appendChild(slide);
    });

    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;

    if (slides.length > 0) {
        slides[currentIndex].classList.add('active');
        displayHeroMedia(validMedia[currentIndex]);

        if (slides.length > 1) {
            function showSlide() {
                slides.forEach(slide => slide.classList.remove('active'));
                slides[currentIndex].classList.add('active');
                displayHeroMedia(validMedia[currentIndex]);
                currentIndex = (currentIndex + 1) % slides.length;
            }
            setInterval(showSlide, 5000);
        }
    }
}
const topOrFavoriteMedia = getTopOrFavoriteMedia();
startBackgroundSlideshow(topOrFavoriteMedia);

    const itemsPerCategory = 10;
    const movies = filterMediaByType('movie');
    const tvShows = filterMediaByType('tvshow');
    const books = filterMediaByType('book');
    const games = filterMediaByType('game');
    const albums = filterMediaByType('album');

    displayMedia(movies, moviesContainer, itemsPerCategory);
    displayMedia(tvShows, tvShowsContainer, itemsPerCategory);
    displayMedia(books, booksContainer, itemsPerCategory);
    displayMedia(games, gamesContainer, itemsPerCategory);
    displayMedia(albums, albumsContainer, itemsPerCategory);

    // Add scroll arrows to each category
    const categories = [
        { element: document.querySelector('#movies'), container: moviesContainer },
        { element: document.querySelector('#tv-shows'), container: tvShowsContainer },
        { element: document.querySelector('#books'), container: booksContainer },
        { element: document.querySelector('#games'), container: gamesContainer },
        { element: document.querySelector('#albums'), container: albumsContainer }
    ];

    categories.forEach(({ element, container }) => {
        if (element && container) {
            addScrollArrows(element, container);
        }
    });

    function openModal(media) {
        const spotifyContainer = document.getElementById('spotify-container');
        const watchNowBtn = document.querySelector('.watch-now-btn');
        const modalActions = document.querySelector('.modal-actions');

        spotifyContainer.innerHTML = '';
        modalActions.innerHTML = '';
        modalInfoSection.innerHTML = '';

        const releaseDate = media.releaseDate || (media.releaseYear ? `${media.releaseYear}` : '');
        modalTitle.innerHTML = releaseDate
            ? `${media.title || 'Untitled'} <span class="release-date">(${releaseDate})</span>`
            : media.title || 'Untitled';

        modalPoster.src = media.posterUrl || '';
        modalPoster.alt = `${media.title || 'Media'} Poster`;
        modalBanner.src = media.bannerUrl || media.posterUrl || '';
        modalBanner.alt = `${media.title || 'Media'} Banner`;

        const fields = [];

        if (media.genre) {
            fields.push({ label: 'Genre', value: media.genre });
        }

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
        }

        if (media.description) {
            fields.push({ label: 'Description', value: media.description, className: 'modal-synopsis' });
        }

        fields.forEach(field => {
            const p = document.createElement('p');
            p.classList.add('modal-text');
            if (field.className) {
                p.classList.add(field.className);
            }
            p.innerHTML = `<span class="modal-label">${field.label}:</span> <span>${field.value}</span>`;
            modalInfoSection.appendChild(p);
        });

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
            watchNowUrl = media.spotifyEmbedUrl;
        }
        watchNowBtn.textContent = watchNowText;
        watchNowBtn.onclick = watchNowUrl ? () => window.open(watchNowUrl, '_blank') : null;
        watchNowBtn.disabled = !watchNowUrl;
        watchNowBtn.style.opacity = watchNowUrl ? '1' : '0.5';

        if (media.type === 'album' && media.spotifyEmbedUrl) {
            const spotifyLink = document.createElement('a');
            spotifyLink.href = media.spotifyEmbedUrl;
            spotifyLink.id = 'modal-spotify-url';
            spotifyLink.target = '_blank';
            spotifyLink.rel = 'noopener noreferrer';
            spotifyLink.textContent = 'Open in Spotify';
            spotifyLink.classList.add('spotify-btn');
            Object.assign(spotifyLink.style, {
                display: 'inline-block',
                backgroundColor: '#1DB954',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                fontWeight: '600',
                marginLeft: '0.75rem',
                textDecoration: 'none'
            });
            spotifyContainer.appendChild(spotifyLink);
        }

        if (media.trailerUrl && (media.type === 'movie' || media.type === 'tvshow')) {
            const trailerBtn = document.createElement('button');
            trailerBtn.classList.add('trailer-btn');
            trailerBtn.textContent = 'Watch Trailer';
            Object.assign(trailerBtn.style, {
                backgroundColor: '#6b7280',
                color: 'white',
                fontWeight: '600',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                border: 'none',
                marginLeft: '0.5rem'
            });
            trailerBtn.onclick = () => window.open(media.trailerUrl, '_blank');
            trailerBtn.addEventListener('mouseover', () => trailerBtn.style.backgroundColor = '#4b5563');
            trailerBtn.addEventListener('mouseout', () => trailerBtn.style.backgroundColor = '#6b7280');
            modalActions.appendChild(trailerBtn);
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        window.location.reload(false);
    }

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

    function addCardListeners() {
        const mediaCards = document.querySelectorAll('.media-card');
        mediaCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                const mediaItem = Array.isArray(mediaItems) ? mediaItems.find(item => item.title === title) : mediaItems;
                if (mediaItem) {
                    openModal(mediaItem);
                }
            });
        });
    }

    if (mediaItems && (Array.isArray(mediaItems) ? mediaItems.length > 0 : true)) {
        addCardListeners();
    }
});