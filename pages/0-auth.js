(() => {
  const STORAGE_KEY = 'app-auth-state';

  const authBtn = document.querySelector('[data-auth-btn]');
  const userEl = document.querySelector('[data-auth-user]');
  if (!authBtn) return;

  const safeParseJson = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const readState = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isLoggedIn: false, email: '' };

    const data = safeParseJson(raw);
    if (!data || typeof data !== 'object') return { isLoggedIn: false, email: '' };

    const isLoggedIn = Boolean(data.isLoggedIn);
    const email = typeof data.email === 'string' ? data.email : '';
    return { isLoggedIn, email };
  };

  let state = readState();

  const saveState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    document.dispatchEvent(new CustomEvent('auth:change', { detail: state }));
  };

  const render = () => {
    if (state.isLoggedIn) {
      authBtn.textContent = 'Вийти';
      if (userEl) {
        userEl.hidden = false;
        userEl.textContent = state.email ? `(${state.email})` : '(user)';
      }
      return;
    }

    authBtn.textContent = 'Увійти';
    if (userEl) {
      userEl.hidden = true;
      userEl.textContent = '';
    }
  };

  const logout = () => {
    state = { isLoggedIn: false, email: '' };
    saveState();
    render();
  };

  const login = ({ email }) => {
    state = { isLoggedIn: true, email };
    saveState();
    render();
  };

  const openLoginModal = () => {
    if (!window.AppModal || typeof window.AppModal.open !== 'function') {
      alert('Modal is not ready');
      return;
    }

    window.AppModal.open(`
      <form class="auth-form" data-auth-form>
        <h2 class="auth-form__title">Авторизація</h2>
        <p class="auth-form__hint">Це демонстраційний вхід (без бекенда). Дані зберігаються у localStorage.</p>

        <label class="field">
          <span class="field__label">Email</span>
          <input type="email" name="email" required autofocus />
        </label>

        <label class="field">
          <span class="field__label">Password</span>
          <input type="password" name="password" required minlength="4" />
        </label>

        <div class="auth-form__actions">
          <button class="btn btn--primary" type="submit">Увійти</button>
          <button class="btn btn--ghost" type="button" data-modal-close>Скасувати</button>
        </div>
      </form>
    `);

    const form = document.querySelector('#app-modal [data-auth-form]');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = form.elements.email?.value?.trim() || '';
      const password = form.elements.password?.value?.trim() || '';
      if (!email || !password) return;

      login({ email });
      window.AppModal.close();
    });
  };

  const requireAuth = () => {
    if (state.isLoggedIn) return true;
    openLoginModal();
    return false;
  };

  authBtn.addEventListener('click', () => {
    if (state.isLoggedIn) logout();
    else openLoginModal();
  });

  render();

  window.AppAuth = {
    isLoggedIn: () => state.isLoggedIn,
    getEmail: () => state.email,
    requireAuth,
    openLoginModal,
    logout,
  };
})();








