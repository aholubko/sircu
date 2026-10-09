# Настройка Backend для продакшена

## Проблема: 404 ошибка для `/api/contact`

Форма пытается отправить запрос на `https://sircubat.com/api/contact`, но получает 404. Это означает, что backend не настроен или не доступен.

## Решения

### Вариант 1: Backend на том же домене (рекомендуется)

Настройте Nginx/Apache для проксирования запросов `/api/*` на backend сервер.

#### Nginx конфигурация

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name sircubat.com www.sircubat.com;

    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name sircubat.com www.sircubat.com;

    # SSL сертификаты
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # Корневая папка для статики (React build)
    root /var/www/sircubat/build;
    index index.html;

    # Логирование
    access_log /var/log/nginx/sircubat_access.log;
    error_log /var/log/nginx/sircubat_error.log;

    # Проксирование API запросов на backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000;  # Backend на порту 8000
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Статические файлы (favicon, video, и т.д.)
    location /favicon/ {
        alias /var/www/sircubat/build/favicon/;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, immutable";
        
        # Разрешаем доступ к файлам
        location ~ \.(webmanifest|json)$ {
            add_header Content-Type application/manifest+json;
            add_header Access-Control-Allow-Origin *;
        }
    }

    location /video/ {
        alias /var/www/sircubat/build/video/;
        access_log off;
        expires 7d;
        add_header Cache-Control "public";
        add_header Access-Control-Allow-Origin *;
        
        # Для больших видео файлов
        client_max_body_size 100M;
    }

    # Статические файлы React (CSS, JS)
    location /static/ {
        alias /var/www/sircubat/build/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Все остальные запросы отправляем на index.html (для React Router)
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Запрещаем доступ к скрытым файлам
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

#### Apache конфигурация (.htaccess или VirtualHost)

```apache
<VirtualHost *:80>
    ServerName sircubat.com
    ServerAlias www.sircubat.com
    
    # Редирект на HTTPS
    Redirect permanent / https://sircubat.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName sircubat.com
    ServerAlias www.sircubat.com
    
    # SSL настройки
    SSLEngine on
    SSLCertificateFile /path/to/ssl/cert.pem
    SSLCertificateKeyFile /path/to/ssl/key.pem
    
    # Корневая папка
    DocumentRoot /var/www/sircubat/build
    
    # Проксирование API
    ProxyPreserveHost On
    ProxyPass /api/ http://127.0.0.1:8000/api/
    ProxyPassReverse /api/ http://127.0.0.1:8000/api/
    
    # Health check
    ProxyPass /health http://127.0.0.1:8000/health
    ProxyPassReverse /health http://127.0.0.1:8000/health
    
    # Разрешаем проксирование
    <Location /api/>
        ProxyPass http://127.0.0.1:8000/api/
        ProxyPassReverse http://127.0.0.1:8000/api/
    </Location>
    
    # Статические файлы
    <Directory /var/www/sircubat/build>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # React Router fallback
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # MIME типы
    AddType application/manifest+json .webmanifest
    AddType video/mp4 .mp4
    
    # CORS для статических файлов
    <FilesMatch "\.(webmanifest|mp4)$">
        Header set Access-Control-Allow-Origin "*"
    </FilesMatch>
    
    # Логирование
    ErrorLog ${APACHE_LOG_DIR}/sircubat_error.log
    CustomLog ${APACHE_LOG_DIR}/sircubat_access.log combined
</VirtualHost>
```

### Вариант 2: Backend на отдельном поддомене (api.sircubat.com)

#### Настройка Nginx для API поддомена

```nginx
server {
    listen 443 ssl http2;
    server_name api.sircubat.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Обновление frontend

Установите переменную окружения перед сборкой:

```bash
export REACT_APP_API_URL=https://api.sircubat.com
cd frontend
yarn build
```

### Вариант 3: Backend на отдельном домене/порту

Если backend на другом сервере, просто установите переменную окружения:

```bash
export REACT_APP_API_URL=https://backend.yourdomain.com:8000
cd frontend
yarn build
```

## Запуск Backend

### 1. Установите зависимости

```bash
cd backend
pip install -r requirements.txt
# или
python3 -m pip install -r requirements.txt
```

### 2. Создайте файл `.env`

```env
# MongoDB (опционально)
MONGO_URL=mongodb://your-mongo-url
DB_NAME=sircubat

# SMTP для email (опционально)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
RECIPIENT_EMAIL=info@sircubat.com

# CORS - добавьте ваш frontend домен
CORS_ORIGINS=https://sircubat.com,https://www.sircubat.com
```

### 3. Запустите backend

#### Для разработки:
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

#### Для продакшена (с systemd):

Создайте файл `/etc/systemd/system/sircubat-backend.service`:

```ini
[Unit]
Description=SIRCU BAT Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Затем:
```bash
sudo systemctl daemon-reload
sudo systemctl enable sircubat-backend
sudo systemctl start sircubat-backend
sudo systemctl status sircubat-backend
```

### 4. Проверка

```bash
# Health check
curl http://localhost:8000/health

# Или через домен
curl https://sircubat.com/api/health
```

## Решение проблемы 403 для файлов

### 1. Проверьте права доступа

```bash
# Установите правильные права на файлы
sudo chown -R www-data:www-data /var/www/sircubat/build
sudo chmod -R 755 /var/www/sircubat/build

# Особенно для файлов, которые вызывают 403
sudo chmod 644 /var/www/sircubat/build/favicon/site.webmanifest
sudo chmod 644 /var/www/sircubat/build/video/*.mp4
```

### 2. Проверьте настройки веб-сервера

Убедитесь, что в конфигурации Nginx/Apache:
- Правильные пути к файлам
- Правильные MIME типы
- Разрешен доступ к файлам

### 3. Проверьте SELinux (если используется)

```bash
# Разрешите доступ к файлам
sudo chcon -R -t httpd_sys_content_t /var/www/sircubat/build
```

## Проверка после настройки

1. **Проверьте health check:**
   ```bash
   curl https://sircubat.com/health
   ```

2. **Проверьте доступность файлов:**
   ```bash
   curl -I https://sircubat.com/favicon/site.webmanifest
   curl -I https://sircubat.com/video/Minimalist%20Architectural%20Abstractions_.mp4
   ```

3. **Проверьте форму:**
   - Откройте сайт
   - Откройте DevTools (F12)
   - Отправьте форму
   - Проверьте, что запрос идет на правильный URL
   - Проверьте ответ сервера

## Диагностика проблем

### Backend не отвечает (404)

1. Проверьте, запущен ли backend:
   ```bash
   sudo systemctl status sircubat-backend
   # или
   ps aux | grep uvicorn
   ```

2. Проверьте логи backend:
   ```bash
   sudo journalctl -u sircubat-backend -f
   ```

3. Проверьте, доступен ли порт:
   ```bash
   netstat -tulpn | grep 8000
   ```

4. Проверьте конфигурацию прокси в веб-сервере

### Файлы возвращают 403

1. Проверьте права доступа
2. Проверьте конфигурацию веб-сервера
3. Проверьте логи веб-сервера:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   # или
   sudo tail -f /var/log/apache2/error.log
   ```

## Дополнительные ресурсы

- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Nginx Reverse Proxy](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Apache Proxy Configuration](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html)

