(() => {
  const bookingForm = document.querySelector('#booking-form');
  const roomsGrid = document.querySelector('.rooms__grid');

  const openModal = (html) => {
    if (!window.AppModal || typeof window.AppModal.open !== 'function') return;
    window.AppModal.open(html);
  };

  const requireAuth = () => {
    if (window.AppAuth && typeof window.AppAuth.requireAuth === 'function') {
      return window.AppAuth.requireAuth();
    }
    return true;
  };

  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!requireAuth()) return;

      openModal(`
        <div>
          <h2 class="auth-form__title">Бронювання прийнято</h2>
          <p class="auth-form__hint">Дякуємо! Ми зв’яжемося з вами найближчим часом для підтвердження.</p>
          <div class="auth-form__actions">
            <button class="btn btn--primary" type="button" data-modal-close>Гаразд</button>
          </div>
        </div>
      `);

      bookingForm.reset();
    });
  }

  if (roomsGrid) {
    roomsGrid.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const trigger = target.closest('[data-room-open], .room-card__image, .room-card__title');
      if (!trigger) return;

      const card = target.closest('.room-card');
      if (!card) return;

      event.preventDefault();

      const title = card.querySelector('.room-card__title')?.textContent?.trim() || 'Номер';
      const text = card.querySelector('.room-card__text')?.textContent?.trim() || '';
      const img = card.querySelector('img')?.getAttribute('src') || '';
      const alt = card.querySelector('img')?.getAttribute('alt') || title;

      openModal(`
        <div class="room-modal">
          <div>
            <img src="${img}" alt="${alt}" />
          </div>
          <div>
            <h2 class="room-modal__title">${title}</h2>
            <p class="room-modal__text">${text}</p>
            <div class="auth-form__actions">
              <a class="btn btn--primary" href="#booking" data-modal-close>Перейти до бронювання</a>
              <button class="btn btn--ghost" type="button" data-modal-close>Закрити</button>
            </div>
          </div>
        </div>
      `);
    });
  }
})();








