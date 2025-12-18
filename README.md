# IO-35_appWEB-Bohuslavets-Ivan-FIOT-2025
WEB-застосунок (Hotel Comfort)

## Як запустити локально

Важливо: відкривати сторінки краще через локальний сервер (а не `file://`), щоб коректно працювали HTTP-запити (Pixabay).

### Варіант 1 — Python (найпростіше)

У корені проєкту виконай:

```bash
py -m http.server 5173
```

Потім відкрий у браузері:
- `http://localhost:5173/` — головна сторінка
- `http://localhost:5173/pages/lab7.html` — сторінки ЛР7

## ЛР7 (сторінки для перевірки)

- `pages/lab7.html` — меню завдань
- `pages/1-gallery.html` — Галерея + basicLightbox
- `pages/2-form.html` — Форма + localStorage
- `pages/1-timer.html` — Таймер + flatpickr + iziToast
- `pages/2-snackbar.html` — Проміси + iziToast
- `pages/5-pixabay.html` — Pixabay + SimpleLightbox

## Ключ Pixabay

Скрипт шукає ключ у `localStorage` за ключем `pixabay-api-key`.
Найшвидший спосіб:

1) відкрий `pages/5-pixabay.html`
2) DevTools → Console і виконай:

```js
localStorage.setItem('pixabay-api-key', 'YOUR_API_KEY')
```
