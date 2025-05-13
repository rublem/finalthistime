document.addEventListener('DOMContentLoaded', () => {
    const allMediaList = document.getElementById('all-media-list');
    const pageTitle = document.getElementById('page-title');
    const localStorageKey = 'myMediaCollectionData';

    // Function to load media items from localStorage
    function loadMediaItems() {
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
            return JSON.parse(storedData);
        } else {
            return [];
        }
    }

    // Get the media type from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const mediaType = urlParams.get('type');

    const mediaItems = loadMediaItems();

    if (!mediaType) {
        pageTitle.textContent = "All Media";
    }

    // Filter media items by type
    const filteredMedia = mediaItems.filter(item => item.type === mediaType);

    if (filteredMedia.length === 0) {
        allMediaList.innerHTML = `<p>No ${mediaType} available.</p>`;
        return;
    }

    // Set the page title
    pageTitle.textContent = `All ${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}s`;

    // Display the filtered media
    filteredMedia.forEach(media => {
        const card = document.createElement('div');
        card.classList.add('media-card');
        card.innerHTML = `
            <img src="${media.posterUrl}" alt="${media.title}">
            <div class="media-card-info">
                <h3>${media.title}</h3>
                <p>Release Date: ${media.releaseDate}</p>
            </div>
        `;
        allMediaList.appendChild(card);
    });
});
