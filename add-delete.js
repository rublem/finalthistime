document.addEventListener('DOMContentLoaded', () => {
    const addMediaTypeForm = document.getElementById('add-media-type-form');
    const mediaTypeSelect = document.getElementById('mediaType');
    const addMediaForm = document.getElementById('add-media-form');
    const additionalFieldsContainer = document.getElementById('additional-fields');
    const typeInput = document.getElementById('type');
    const existingMediaList = document.getElementById('existing-media-list');
    const localStorageKey = 'myMediaCollectionData';

    const additionalFieldsMap = {
        album: [
            { label: 'Artist', id: 'artist', type: 'text' },
            { label: 'Genre', id: 'genre', type: 'text' },
             { label: 'Spotify Embed URL', id: 'spotifyEmbedUrl', type: 'url' }
        ],
        book: [
            { label: 'Author', id: 'author', type: 'text' },
            { label: 'Genre', id: 'genre', type: 'text' },
            { label: 'Read URL', id: 'readUrl', type: 'url' }
        ],
        game: [
            { label: 'Developer', id: 'developer', type: 'text' },
            { label: 'Platform', id: 'platform', type: 'text' },
            { label: 'Genre', id: 'genre', type: 'text' },
             { label: 'Download URL', id: 'downloadUrl', type: 'url' }
        ],
        movie: [
            { label: 'Director', id: 'director', type: 'text' },
            { label: 'Trailer URL', id: 'trailerUrl', type: 'url' },
            { label: 'Watch URL', id: 'watchUrl', type: 'url' },
            { label: 'Cast', id: 'cast', type: 'text' }
        ],
        tvshow: [
            { label: 'Director', id: 'director', type: 'text' },
            { label: 'Trailer URL', id: 'trailerUrl', type: 'url' },
            { label: 'Watch URL', id: 'watchUrl', type: 'url' },
            { label: 'Cast', id: 'cast', type: 'text' }
        ]
    };


    function loadMediaItems() {
        const storedData = localStorage.getItem(localStorageKey);
        return storedData ? JSON.parse(storedData) : [];
    }

    function saveMediaItems() {
        localStorage.setItem(localStorageKey, JSON.stringify(mediaItems));
    }

    let mediaItems = loadMediaItems();
    renderExistingMedia();

    function renderExistingMedia() {
    existingMediaList.innerHTML = '';
    mediaItems.forEach(media => {
        const mediaItem = document.createElement('div');
        mediaItem.classList.add('existing-media-item');
        mediaItem.innerHTML = `
            <img src="${media.posterUrl}" alt="${media.title}" width="100">
            <h4>${media.title}</h4>
            <p>Type: ${media.type}</p>
            <div class="actions">
                <button class="delete-button" data-id="${media.id}">Delete</button>
                <button class="fav-top ${media.isFavorite ? 'favorite' : ''}" data-id="${media.id}" data-action="favorite">${media.isFavorite ? 'Unfavorite' : 'Favorite'}</button>
            </div>
        `;
        existingMediaList.appendChild(mediaItem);
    });

    addEventListenersToButtons();
}


    function addEventListenersToButtons() {
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function () {
                const idToDelete = parseInt(this.dataset.id);
                mediaItems = mediaItems.filter(item => item.id !== idToDelete);
                saveMediaItems();
                renderExistingMedia();
            });
        });

        document.querySelectorAll('.fav-top').forEach(button => {
            button.addEventListener('click', function () {
                const idToUpdate = parseInt(this.dataset.id);
                const action = this.dataset.action;
                const mediaIndex = mediaItems.findIndex(item => item.id === idToUpdate);
                if (mediaIndex !== -1) {
                    if (action === 'favorite') {
                        mediaItems[mediaIndex].isFavorite = !mediaItems[mediaIndex].isFavorite;
                        this.textContent = mediaItems[mediaIndex].isFavorite ? 'Unfavorite' : 'Favorite';
                        this.classList.toggle('favorite', mediaItems[mediaIndex].isFavorite);
                    } else if (action === 'top-picked') {
                        mediaItems[mediaIndex].isTopPicked = !mediaItems[mediaIndex].isTopPicked;
                        this.textContent = mediaItems[mediaIndex].isTopPicked ? 'Untop' : 'Top';
                        this.classList.toggle('top-picked', mediaItems[mediaIndex].isTopPicked);
                    }
                    saveMediaItems();
                }
                renderExistingMedia();
            });
        });
    }

    mediaTypeSelect.addEventListener('change', function () {
        const selectedType = this.value;
        addMediaForm.style.display = selectedType ? 'block' : 'none';
        typeInput.value = selectedType;
        additionalFieldsContainer.innerHTML = '';
        const bannerField = document.getElementById('bannerUrl').parentElement;
        bannerField.style.display = 'block';

        if (additionalFieldsMap[selectedType]) {
            additionalFieldsMap[selectedType].forEach(field => {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = `
                    <label for="${field.id}">${field.label}:</label>
                    <input type="${field.type}" id="${field.id}">
                `;
                additionalFieldsContainer.appendChild(wrapper);
            });
        }
    });


    addMediaForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const posterUrl = document.getElementById('posterUrl').value;
    const bannerUrl = document.getElementById('bannerUrl').value;
    const releaseYear = document.getElementById('releaseYear').value;
    const type = typeInput.value;
    const newId = mediaItems.length > 0 ? Math.max(...mediaItems.map(item => item.id)) + 1 : 1;

    const newMedia = {
        id: newId,
        type,
        title,
        description,
        posterUrl,
        releaseYear,
        bannerUrl,
        isTopPicked: false,
        isFavorite: false
    };

    const extraFields = additionalFieldsMap[type];
    if (extraFields) {
        extraFields.forEach(field => {
            newMedia[field.id] = document.getElementById(field.id).value;
        });
    }

    mediaItems.push(newMedia);
    saveMediaItems();
    this.reset();
    addMediaForm.style.display = 'none';
    mediaTypeSelect.value = '';
    additionalFieldsContainer.innerHTML = '';
    document.getElementById('bannerUrl').parentElement.style.display = 'block';
    renderExistingMedia();
});

});
