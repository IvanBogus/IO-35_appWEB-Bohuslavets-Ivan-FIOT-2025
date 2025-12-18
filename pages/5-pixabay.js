(() => {
  const form =
    document.querySelector('.search-form') ||
    document.querySelector('#search-form') ||
    document.querySelector('[data-search-form]');
  const gallery = document.querySelector('.gallery');

  if (!form || !gallery) return;

  const input =
    form.querySelector('input[name="searchQuery"]') ||
    form.querySelector('input[name="query"]') ||
    form.querySelector('input[type="text"]') ||
    form.querySelector('input');

  if (!input) return;

  const notifyInfo = (message) => {
    if (window.iziToast && typeof window.iziToast.info === 'function') {
      window.iziToast.info({ message, position: 'topRight' });
      return;
    }
    alert(message);
  };

  const notifyError = (message) => {
    if (window.iziToast && typeof window.iziToast.error === 'function') {
      window.iziToast.error({ message, position: 'topRight' });
      return;
    }
    alert(message);
  };

  const getApiKey = () => {
    const metaKey = document.querySelector('meta[name="pixabay-key"]')?.content;
    if (metaKey) return metaKey.trim();

    const dataKey = document.body?.dataset?.pixabayKey;
    if (dataKey) return String(dataKey).trim();

    const lsKey = localStorage.getItem('pixabay-api-key');
    if (lsKey) return lsKey.trim();

    const winKey = window.PIXABAY_API_KEY || window.PIXABAY_KEY;
    if (winKey) return String(winKey).trim();

    return '';
  };

  const ensureLoader = () => {
    let loader = document.querySelector('.loader');
    if (loader) return loader;

    loader = document.createElement('div');
    loader.className = 'loader';
    loader.hidden = true;
    loader.setAttribute('aria-label', 'Loading');

    gallery.insertAdjacentElement('afterend', loader);
    return loader;
  };

  const loader = ensureLoader();

  const setLoading = (isLoading) => {
    loader.hidden = !isLoading;
  };

  const clearGallery = () => {
    gallery.innerHTML = '';
  };

  const renderHits = (hits) => {
    const items = hits
      .map(
        (hit) =>
          `<li class="gallery__item">
            <a class="gallery__link" href="${hit.largeImageURL}">
              <img class="gallery__image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
            </a>
            <div class="info">
              <p class="info__item"><b>Likes</b> ${hit.likes}</p>
              <p class="info__item"><b>Views</b> ${hit.views}</p>
              <p class="info__item"><b>Comments</b> ${hit.comments}</p>
              <p class="info__item"><b>Downloads</b> ${hit.downloads}</p>
            </div>
          </li>`
      )
      .join('');
    gallery.insertAdjacentHTML('beforeend', items);
  };

  if (!window.SimpleLightbox) {
    notifyError('SimpleLightbox is not loaded');
    return;
  }

  const lightbox = new window.SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const query = input.value.trim();
    if (!query) {
      notifyInfo('Please enter a search query');
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      notifyError('Pixabay API key is missing');
      return;
    }

    clearGallery();
    setLoading(true);

    const params = new URLSearchParams({
      key: apiKey,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    });

    fetch(`https://pixabay.com/api/?${params.toString()}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const hits = Array.isArray(data?.hits) ? data.hits : [];

        if (hits.length === 0) {
          notifyInfo(
            'Sorry, there are no images matching your search query. Please try again!'
          );
          return;
        }

        renderHits(hits);
        lightbox.refresh();
      })
      .catch(() => {
        notifyError('Search failed. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  });
})();

