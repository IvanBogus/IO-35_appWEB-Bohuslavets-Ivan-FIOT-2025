(() => {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  const images = [
    {
      preview: '../public/rectangle32620-ecs5-200h.png',
      original: '../public/Aurora.png',
      description: 'Номер Аврора',
    },
    {
      preview: '../public/rectangle32629-4k3i-200h.png',
      original: '../public/Luna.png',
      description: 'Номер Луна',
    },
    {
      preview: '../public/rectangle3850-fil5-200h.png',
      original: '../public/Oriya.png',
      description: 'Номер Орія',
    },
    {
      preview: '../public/rectangle83410-urk-200h.png',
      original: '../public/Verona.png',
      description: 'Номер Верона',
    },
  ];

  const markup = images
    .map(
      ({ preview, original, description }) =>
        `<li class="gallery__item">
          <a class="gallery__link" href="${original}">
            <img class="gallery__image" src="${preview}" alt="${description}" data-source="${original}" />
          </a>
        </li>`
    )
    .join('');

  gallery.innerHTML = markup;

  gallery.addEventListener('click', (event) => {
    const img = event.target?.closest?.('img');
    if (!img) return;

    event.preventDefault();

    const src = img.dataset.source;
    if (!src) return;

    if (!window.basicLightbox || typeof window.basicLightbox.create !== 'function') {
      if (window.iziToast && typeof window.iziToast.error === 'function') {
        window.iziToast.error({ message: 'basicLightbox is not loaded', position: 'topRight' });
      } else {
        alert('basicLightbox is not loaded');
      }
      return;
    }

    const instance = window.basicLightbox.create(`<img src="${src}" alt="${img.alt || ''}" />`);
    instance.show();
  });
})();

