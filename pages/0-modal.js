(() => {
  const root = document.querySelector('#app-modal');
  if (!root) return;

  const content = root.querySelector('[data-modal-content]');
  if (!content) return;

  let lastFocused = null;

  const close = () => {
    root.hidden = true;
    content.innerHTML = '';
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    lastFocused = null;
  };

  const open = (html) => {
    lastFocused = document.activeElement;
    content.innerHTML = html;
    root.hidden = false;
    document.body.style.overflow = 'hidden';

    const autofocus = root.querySelector('[autofocus]');
    if (autofocus && typeof autofocus.focus === 'function') autofocus.focus();
  };

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.hasAttribute('data-modal-close') || target.closest('[data-modal-close]')) {
      event.preventDefault();
      close();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !root.hidden) close();
  });

  window.AppModal = { open, close };
})();





