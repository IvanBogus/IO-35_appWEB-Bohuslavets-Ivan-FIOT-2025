const formData = { email: '', message: '' };

(() => {
  const STORAGE_KEY = 'feedback-form-state';

  const form = document.querySelector('.feedback-form');
  if (!form) return;

  const safeParseJson = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const saveState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  };

  const restoreState = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const data = safeParseJson(raw);
    if (!data || typeof data !== 'object') return;

    if (typeof data.email === 'string') formData.email = data.email.trim();
    if (typeof data.message === 'string') formData.message = data.message.trim();

    if (form.elements.email) form.elements.email.value = formData.email;
    if (form.elements.message) form.elements.message.value = formData.message;
  };

  restoreState();

  form.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const { name } = target;
    if (name !== 'email' && name !== 'message') return;

    const value = typeof target.value === 'string' ? target.value.trim() : '';
    formData[name] = value;
    saveState();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = (formData.email || '').trim();
    const message = (formData.message || '').trim();

    if (!email || !message) {
      alert('Fill please all fields');
      return;
    }

    formData.email = email;
    formData.message = message;
    console.log(formData);

    localStorage.removeItem(STORAGE_KEY);
    formData.email = '';
    formData.message = '';
    form.reset();
  });
})();

