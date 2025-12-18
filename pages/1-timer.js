(() => {
  const input = document.querySelector('#datetime-picker');
  const startBtn = document.querySelector('[data-start]');

  if (!input || !startBtn) return;

  const daysEl = document.querySelector('[data-days]');
  const hoursEl = document.querySelector('[data-hours]');
  const minutesEl = document.querySelector('[data-minutes]');
  const secondsEl = document.querySelector('[data-seconds]');

  const notifyError = (message) => {
    if (window.iziToast && typeof window.iziToast.error === 'function') {
      window.iziToast.error({ message, position: 'topRight' });
      return;
    }
    alert(message);
  };

  const pad2 = (value) => String(value).padStart(2, '0');

  const convertMs = (ms) => {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor((ms % hour) / minute);
    const seconds = Math.floor((ms % minute) / second);

    return { days, hours, minutes, seconds };
  };

  const render = ({ days, hours, minutes, seconds }) => {
    if (daysEl) daysEl.textContent = pad2(days);
    if (hoursEl) hoursEl.textContent = pad2(hours);
    if (minutesEl) minutesEl.textContent = pad2(minutes);
    if (secondsEl) secondsEl.textContent = pad2(seconds);
  };

  let targetDate = null;
  let timerId = null;

  startBtn.disabled = true;
  render({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  if (typeof window.flatpickr !== 'function') {
    notifyError('flatpickr is not loaded');
    return;
  }

  window.flatpickr(input, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const picked = selectedDates[0];
      if (!(picked instanceof Date)) return;

      if (picked.getTime() <= Date.now()) {
        targetDate = null;
        startBtn.disabled = true;
        notifyError('Please choose a date in the future');
        return;
      }

      targetDate = picked;
      startBtn.disabled = false;
    },
  });

  startBtn.addEventListener('click', () => {
    if (!targetDate) return;

    startBtn.disabled = true;
    input.disabled = true;

    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(timerId);
        timerId = null;
        targetDate = null;
        render({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        input.disabled = false;
        startBtn.disabled = true;
        return;
      }
      render(convertMs(diff));
    };

    tick();
    timerId = setInterval(tick, 1000);
  });
})();

