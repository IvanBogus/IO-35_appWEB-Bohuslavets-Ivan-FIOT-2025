(() => {
  const form = document.querySelector('.form');
  if (!form) return;

  const notifySuccess = (message) => {
    if (window.iziToast && typeof window.iziToast.success === 'function') {
      window.iziToast.success({ message, position: 'topRight' });
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

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const delayRaw = form.elements.delay?.value;
    const delay = Number(delayRaw);

    const state = form.querySelector('input[name="state"]:checked')?.value;

    if (!Number.isFinite(delay) || delay < 0 || (state !== 'fulfilled' && state !== 'rejected')) {
      notifyError('Please enter a valid delay and choose a state');
      return;
    }

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state === 'fulfilled') resolve(delay);
        else reject(delay);
      }, delay);
    });

    promise
      .then((ms) => {
        notifySuccess(`✅ Fulfilled promise in ${ms}ms`);
      })
      .catch((ms) => {
        notifyError(`❌ Rejected promise in ${ms}ms`);
      })
      .finally(() => {
        form.reset();
      });
  });
})();

