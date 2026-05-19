# YADRO — Платформа видео-стриминга

YADRO — это Full-stack веб-приложение для просмотра видеопотока в реальном времени и общения в общем чате. Проект реализован на стеке React (Frontend) и Flask (Backend).

## Ссылки на проект
* **Сайт (Frontend):** [https://frabjous-souffle-be3516.netlify.app/](https://clinquant-klepon-a44054.netlify.app/)
* **API (Backend):** [https://yadro-video-backend.onrender.com/](https://yadro-video-backend.onrender.com/)

---

##  Технологический стек
* **Frontend:** React, React Router, Vite.
* **Backend:** Flask (Python).
* **Database:** In-memory storage (симуляция).
* **Hosting:** Netlify (Frontend), Render (Backend).

---

##  Документация API

### 1. Авторизация
* **Регистрация:** `POST /api/register`
    * *Body:* `{"email": "...", "first_name": "...", "last_name": "..."}`
* **Вход:** `POST /api/login`
    * *Body:* `{"email": "..."}`

### 2. Видеопоток
* **Получить список видео:** `GET /api/videos`
* **Загрузить видео:** `POST /api/upload`
    * *Body:* `FormData` (поле `video` — файл)
* **Потоковое воспроизведение:** `GET /api/videos/<filename>`

### 3. Чат
* **Получить сообщения:** `GET /api/chat`
* **Отправить сообщение:** `POST /api/chat`
    * *Body:* `{"user": "Имя", "text": "Сообщение"}`

---

##  Локальный запуск

1. **Клонирование:**
   ```bash
   git clone [https://github.com/ваш_логин/yadro-project.git](https://github.com/ваш_логин/yadro-project.git)
   cd yadro-project