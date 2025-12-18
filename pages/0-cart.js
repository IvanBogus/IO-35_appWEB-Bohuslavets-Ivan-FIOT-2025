(() => {
  const STORAGE_KEY = 'hotel-cart-state';
  const PER_PAGE = 2;

  const rootHeader = document.querySelector('.header .header__inner');
  if (!rootHeader) return;

  const safeParseJson = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const services = [
    {
      id: 'restaurant:breakfast',
      category: 'restaurant',
      name: 'Сніданок у номер',
      description: 'Доставка сніданку в обраний час (07:30–11:00).',
      price: 250,
    },
    {
      id: 'restaurant:lunch',
      category: 'restaurant',
      name: 'Обід у номер',
      description: 'Суп + основна страва + напій (щоденне меню).',
      price: 390,
    },
    {
      id: 'restaurant:dinner',
      category: 'restaurant',
      name: 'Вечеря à la carte',
      description: 'Персональна подача з ресторану у номер.',
      price: 520,
    },
    {
      id: 'spa:towels',
      category: 'spa',
      name: 'Додаткові рушники',
      description: 'Набір рушників (2 шт.) у номер.',
      price: 120,
    },
    {
      id: 'spa:robes',
      category: 'spa',
      name: 'Оренда халатів',
      description: '2 халати на 24 години.',
      price: 180,
    },
    {
      id: 'spa:massage',
      category: 'spa',
      name: 'Масаж 30 хв',
      description: 'Класичний релакс-масаж (попередній запис).',
      price: 650,
    },
  ];

  const state = {
    items: [],
    isOpen: false,
    page: 1,
  };

  const load = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = safeParseJson(raw);
    if (!data || !Array.isArray(data.items)) return;

    state.items = data.items
      .filter((i) => i && typeof i.id === 'string')
      .map((i) => ({
        id: i.id,
        name: String(i.name || ''),
        price: Number(i.price) || 0,
        qty: Number(i.qty) || 1,
      }))
      .filter((i) => i.name && i.price > 0 && i.qty > 0);
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
  };

  const totalCount = () => state.items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = () => state.items.reduce((sum, i) => sum + i.qty * i.price, 0);

  const formatUAH = (value) =>
    new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(value);

  const cartBtn = document.createElement('button');
  cartBtn.type = 'button';
  cartBtn.className = 'cart-button';
  cartBtn.setAttribute('aria-label', 'Відкрити кошик');
  cartBtn.innerHTML = `<span class="cart-button__label">Кошик</span><span class="cart-badge" data-cart-count>0</span>`;

  const phone = rootHeader.querySelector('.header__phone');
  if (phone) phone.insertAdjacentElement('afterend', cartBtn);
  else rootHeader.appendChild(cartBtn);

  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="cart-panel" role="dialog" aria-modal="true" aria-label="Кошик">
      <div class="cart-panel__header">
        <div class="cart-panel__title">Кошик</div>
        <button type="button" class="cart-panel__close" data-cart-close aria-label="Закрити">✕</button>
      </div>
      <div class="cart-panel__body">
        <ul class="cart-list" data-cart-list></ul>
        <div class="cart-empty" data-cart-empty>Кошик порожній.</div>
      </div>
      <div class="cart-panel__footer">
        <div class="cart-total">
          <span>Разом:</span>
          <b data-cart-total>0</b>
        </div>
        <div class="cart-pagination">
          <button type="button" class="btn btn--ghost cart-page-btn" data-cart-prev>Prev</button>
          <span class="cart-page" data-cart-page>1/1</span>
          <button type="button" class="btn btn--ghost cart-page-btn" data-cart-next>Next</button>
        </div>
        <button type="button" class="btn btn--secondary cart-clear" data-cart-clear>Очистити</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const listEl = overlay.querySelector('[data-cart-list]');
  const emptyEl = overlay.querySelector('[data-cart-empty]');
  const countEl = cartBtn.querySelector('[data-cart-count]');
  const totalEl = overlay.querySelector('[data-cart-total]');
  const pageEl = overlay.querySelector('[data-cart-page]');
  const prevBtn = overlay.querySelector('[data-cart-prev]');
  const nextBtn = overlay.querySelector('[data-cart-next]');

  const pagesCount = () => Math.max(1, Math.ceil(state.items.length / PER_PAGE));

  const clampPage = () => {
    const pc = pagesCount();
    state.page = Math.min(Math.max(1, state.page), pc);
  };

  const render = () => {
    clampPage();
    countEl.textContent = String(totalCount());
    totalEl.textContent = formatUAH(totalPrice());

    const pc = pagesCount();
    pageEl.textContent = `${state.page}/${pc}`;
    prevBtn.disabled = state.page <= 1;
    nextBtn.disabled = state.page >= pc;

    if (state.items.length === 0) {
      listEl.innerHTML = '';
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    const start = (state.page - 1) * PER_PAGE;
    const slice = state.items.slice(start, start + PER_PAGE);

    listEl.innerHTML = slice
      .map(
        (i) => `
          <li class="cart-item">
            <div class="cart-item__main">
              <div class="cart-item__name">${i.name}</div>
              <div class="cart-item__price">${formatUAH(i.price)}</div>
            </div>
            <div class="cart-item__controls">
              <button type="button" class="cart-qty-btn" data-cart-dec="${i.id}" aria-label="Зменшити">−</button>
              <span class="cart-qty">${i.qty}</span>
              <button type="button" class="cart-qty-btn" data-cart-inc="${i.id}" aria-label="Збільшити">+</button>
              <button type="button" class="cart-remove" data-cart-remove="${i.id}">Remove</button>
            </div>
          </li>
        `
      )
      .join('');
  };

  const open = () => {
    state.isOpen = true;
    overlay.hidden = false;
    document.body.classList.add('cart-open');
    render();
  };

  const close = () => {
    state.isOpen = false;
    overlay.hidden = true;
    document.body.classList.remove('cart-open');
  };

  const addItem = (product) => {
    const found = state.items.find((i) => i.id === product.id);
    if (found) found.qty += 1;
    else state.items.push({ ...product, qty: 1 });
    save();
    render();
  };

  const removeItem = (id) => {
    state.items = state.items.filter((i) => i.id !== id);
    save();
    render();
  };

  const changeQty = (id, delta) => {
    const found = state.items.find((i) => i.id === id);
    if (!found) return;
    found.qty += delta;
    if (found.qty <= 0) removeItem(id);
    else {
      save();
      render();
    }
  };

  const clear = () => {
    state.items = [];
    state.page = 1;
    save();
    render();
  };

  const renderServices = () => {
    const groups = new Map([
      ['restaurant', document.querySelector('[data-services="restaurant"]')],
      ['spa', document.querySelector('[data-services="spa"]')],
    ]);

    services.forEach((s) => {
      const host = groups.get(s.category);
      if (!host) return;

      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `
        <p class="service-card__title">${s.name}</p>
        <p class="service-card__text">${s.description}</p>
        <div class="service-card__footer">
          <span class="service-card__price">${s.price}₴</span>
          <button
            type="button"
            class="btn btn--secondary"
            data-add-to-cart="${s.id}"
            data-name="${s.name}"
            data-price="${s.price}"
          >Додати в кошик</button>
        </div>
      `;
      host.appendChild(card);
    });
  };

  renderServices();

  load();
  render();

  cartBtn.addEventListener('click', () => {
    if (state.isOpen) close();
    else open();
  });

  overlay.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target === overlay) close();
    if (target.closest('[data-cart-close]')) close();

    const removeId = target.getAttribute('data-cart-remove');
    if (removeId) removeItem(removeId);

    const incId = target.getAttribute('data-cart-inc');
    if (incId) changeQty(incId, +1);

    const decId = target.getAttribute('data-cart-dec');
    if (decId) changeQty(decId, -1);

    if (target.closest('[data-cart-clear]')) clear();

    if (target.closest('[data-cart-prev]')) {
      state.page -= 1;
      render();
    }
    if (target.closest('[data-cart-next]')) {
      state.page += 1;
      render();
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const btn = target.closest('[data-add-to-cart]');
    if (!btn) return;

    const id = btn.getAttribute('data-add-to-cart');
    const name = btn.getAttribute('data-name');
    const price = Number(btn.getAttribute('data-price'));

    if (!id || !name || !Number.isFinite(price) || price <= 0) return;
    addItem({ id, name, price });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.isOpen) close();
  });
})();

