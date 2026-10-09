# Исправление ошибки формы после деплоя

## Проблема

После деплоя форма показывает ошибку:
```
TypeError: undefined is not an object (evaluating 'k.env.REACT_APP_API_URL')
```

А также ошибки 403 для файлов:
- `site.webmanifest`
- `Minimalist Architectural Abstractions_.mp4`

## Решение

### 1. Исправление ошибки с process.env

Код формы был обновлен для безопасной работы с переменными окружения в продакшене. Теперь форма автоматически определяет URL backend:

- **Локальная разработка**: использует `http://localhost:8000`
- **Продакшен**: использует текущий домен (`window.location.origin`)

### 2. Настройка переменных окружения для сборки

Если ваш backend находится на другом домене, установите переменную окружения перед сборкой:

```bash
export REACT_APP_API_URL=https://api.yourdomain.com
yarn build
```

Или создайте файл `.env` в папке `frontend/`:

```env
REACT_APP_API_URL=https://api.yourdomain.com
```

Затем выполните сборку:
```bash
cd frontend
yarn build
```

### 3. Если backend на том же домене

Если backend находится на том же домене (например, на поддомене `api.yourdomain.com`), форма автоматически будет использовать текущий домен. Убедитесь, что:

1. Backend доступен по пути `/api/contact`
2. CORS настроен правильно в backend

### 4. Исправление ошибок 403 для файлов

Ошибки 403 для файлов обычно связаны с настройками веб-сервера. Убедитесь, что:

#### Для site.webmanifest:
- Файл находится в `public/favicon/site.webmanifest`
- Веб-сервер настроен для обслуживания файлов из папки `public/`
- MIME type для `.webmanifest` установлен как `application/manifest+json`

#### Для видео файла:
- Файл находится в `public/video/Minimalist Architectural Abstractions_.mp4`
- Веб-сервер настроен для обслуживания больших файлов
- MIME type для `.mp4` установлен как `video/mp4`

### 5. Проверка после исправления

1. **Пересоберите frontend:**
   ```bash
   cd frontend
   yarn build
   ```

2. **Загрузите обновленную сборку на сервер**

3. **Проверьте в браузере:**
   - Откройте DevTools (F12)
   - Перейдите на вкладку Network
   - Отправьте форму
   - Проверьте, что запрос идет на правильный URL
   - Проверьте, что нет ошибок 403 для файлов

4. **Проверьте консоль:**
   - Должно появиться: `Sending form data to: https://your-domain.com/api/contact`
   - Не должно быть ошибок о `process.env`

### 6. Настройка веб-сервера (примеры)

#### Nginx:
```nginx
location / {
    try_files $uri /index.html;
}

location /favicon/ {
    alias /path/to/build/favicon/;
    add_header Content-Type application/manifest+json;
}

location /video/ {
    alias /path/to/build/video/;
    add_header Content-Type video/mp4;
    client_max_body_size 100M;
}
```

#### Apache (.htaccess):
```apache
<IfModule mod_mime.c>
    AddType application/manifest+json .webmanifest
    AddType video/mp4 .mp4
</IfModule>

<FilesMatch "\.(webmanifest|mp4)$">
    Header set Access-Control-Allow-Origin "*"
</FilesMatch>
```

### 7. Если проблема сохраняется

1. **Проверьте логи сервера** на наличие ошибок доступа
2. **Проверьте права доступа** к файлам на сервере
3. **Проверьте CORS настройки** в backend
4. **Проверьте**, что все файлы загружены в правильные папки

## Дополнительная информация

- Все заявки сохраняются в MongoDB (если настроен) или логируются
- Health check endpoint доступен по `/health`
- Подробная диагностика доступна в `TROUBLESHOOTING.md`

