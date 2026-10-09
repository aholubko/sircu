# Быстрое исправление проблем

## Проблема 1: 404 ошибка для `/api/contact`

**Причина:** Backend не запущен или не настроен прокси.

### Быстрое решение:

1. **Проверьте, запущен ли backend:**
   ```bash
   # Если используется systemd
   sudo systemctl status sircubat-backend
   
   # Или проверьте процессы
   ps aux | grep uvicorn
   ```

2. **Если backend не запущен, запустите его:**
   ```bash
   cd /path/to/backend
   source venv/bin/activate  # если используете виртуальное окружение
   uvicorn server:app --host 0.0.0.0 --port 8000
   ```

3. **Настройте Nginx для проксирования:**

   Добавьте в конфигурацию Nginx (`/etc/nginx/sites-available/sircubat` или ваш файл):

   ```nginx
   location /api/ {
       proxy_pass http://127.0.0.1:8000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

   Затем перезагрузите Nginx:
   ```bash
   sudo nginx -t  # проверка конфигурации
   sudo systemctl reload nginx
   ```

## Проблема 2: 403 ошибки для файлов

**Причина:** Неправильные права доступа или настройки веб-сервера.

### Быстрое решение:

1. **Исправьте права доступа:**
   ```bash
   # Замените /var/www/sircubat/build на ваш путь
   sudo chown -R www-data:www-data /var/www/sircubat/build
   sudo chmod -R 755 /var/www/sircubat/build
   sudo chmod 644 /var/www/sircubat/build/favicon/site.webmanifest
   sudo chmod 644 /var/www/sircubat/build/video/*.mp4
   ```

2. **Проверьте, что файлы существуют:**
   ```bash
   ls -la /var/www/sircubat/build/favicon/site.webmanifest
   ls -la /var/www/sircubat/build/video/*.mp4
   ```

3. **Добавьте в Nginx конфигурацию (если еще не добавлено):**

   ```nginx
   # Для webmanifest файлов
   location ~ \.webmanifest$ {
       add_header Content-Type application/manifest+json;
       add_header Access-Control-Allow-Origin *;
   }
   
   # Для видео файлов
   location /video/ {
       add_header Access-Control-Allow-Origin *;
       client_max_body_size 100M;
   }
   ```

   Перезагрузите Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## Минимальная конфигурация Nginx

Полный минимальный файл конфигурации для быстрого запуска:

```nginx
server {
    listen 80;
    server_name sircubat.com www.sircubat.com;

    root /var/www/sircubat/build;
    index index.html;

    # API проксирование
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        proxy_set_header Host $host;
    }

    # Статические файлы
    location /favicon/ {
        alias /var/www/sircubat/build/favicon/;
        access_log off;
        expires 30d;
    }

    location /video/ {
        alias /var/www/sircubat/build/video/;
        access_log off;
        expires 7d;
        client_max_body_size 100M;
    }

    location /static/ {
        alias /var/www/sircubat/build/static/;
        expires 1y;
    }

    # React Router fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Проверка после исправления

1. **Проверьте backend:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Проверьте через Nginx:**
   ```bash
   curl http://sircubat.com/api/health
   ```

3. **Проверьте файлы:**
   ```bash
   curl -I http://sircubat.com/favicon/site.webmanifest
   curl -I http://sircubat.com/video/Minimalist%20Architectural%20Abstractions_.mp4
   ```

4. **Откройте сайт в браузере и проверьте консоль (F12)**

## Если ничего не помогает

1. Проверьте логи Nginx:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

2. Проверьте логи backend:
   ```bash
   # Если через systemd
   sudo journalctl -u sircubat-backend -f
   
   # Или если запущен вручную, смотрите вывод в терминале
   ```

3. Проверьте, что порт 8000 не занят другим процессом:
   ```bash
   sudo netstat -tulpn | grep 8000
   sudo lsof -i :8000
   ```

