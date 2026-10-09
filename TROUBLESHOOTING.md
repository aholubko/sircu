# Руководство по диагностике проблем с формой контакта

## Проблема: Ошибка отправки формы после деплоя

Если после деплоя форма показывает ошибку "Une erreur est survenue. Veuillez réessayer ou nous contacter directement à info@sircubat.com", выполните следующие шаги диагностики:

## Шаг 1: Проверка конфигурации API URL

### Frontend
Убедитесь, что переменная окружения `REACT_APP_API_URL` установлена правильно:

1. **Для локальной разработки:**
   ```bash
   REACT_APP_API_URL=http://localhost:8000
   ```

2. **Для продакшена:**
   ```bash
   REACT_APP_API_URL=https://your-backend-domain.com
   ```
   
   Или оставьте пустой - форма будет использовать текущий домен (`window.location.origin`).

### Проверка в браузере
1. Откройте DevTools (F12)
2. Перейдите на вкладку Network
3. Отправьте форму
4. Проверьте, на какой URL отправляется запрос
5. Проверьте код ответа (200, 404, 500, etc.)

## Шаг 2: Проверка Backend

### Health Check
Проверьте доступность backend:
```bash
curl https://your-backend-domain.com/health
```

Ожидаемый ответ:
```json
{
  "status": "ok",
  "mongodb": "connected" or "not_configured",
  "smtp": "configured" or "not_configured"
}
```

### Проверка логов Backend
Проверьте логи backend сервера на наличие ошибок:
- Ошибки подключения к MongoDB
- Ошибки SMTP
- Ошибки CORS

## Шаг 3: Проверка CORS

Убедитесь, что в backend файле `.env` настроены правильные CORS origins:

```env
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

Или используйте `*` для разработки (не рекомендуется для продакшена).

## Шаг 4: Проверка переменных окружения Backend

### Минимальная конфигурация (без SMTP и MongoDB)

Backend будет работать даже без этих настроек, но заявки не будут отправляться по email:

```env
# Минимальная конфигурация - backend будет работать
# CORS_ORIGINS=*
```

### Рекомендуемая конфигурация

```env
# MongoDB (опционально)
MONGO_URL=mongodb://your-mongo-url
DB_NAME=sircubat

# SMTP для отправки email (опционально)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
RECIPIENT_EMAIL=info@sircubat.com

# CORS
CORS_ORIGINS=https://your-frontend-domain.com
```

## Шаг 5: Диагностика через консоль браузера

1. Откройте консоль браузера (F12 → Console)
2. Отправьте форму
3. Проверьте сообщения в консоли:
   - `Sending form data to: ...` - показывает URL, на который отправляется запрос
   - `Form data: ...` - показывает данные формы
   - `Response received: ...` - показывает ответ сервера (если успешно)
   - `Error details: ...` - показывает детали ошибки (если есть)

## Шаг 6: Типичные ошибки и решения

### Ошибка: Network Error / ERR_NETWORK
**Причина:** Backend недоступен или неправильный URL
**Решение:**
- Проверьте, запущен ли backend
- Проверьте правильность `REACT_APP_API_URL`
- Проверьте файрвол и сетевые настройки

### Ошибка: 404 Not Found
**Причина:** Неправильный путь к endpoint
**Решение:**
- Убедитесь, что backend endpoint доступен по `/api/contact`
- Проверьте конфигурацию роутинга в backend

### Ошибка: 500 Internal Server Error
**Причина:** Ошибка на стороне backend
**Решение:**
- Проверьте логи backend
- Проверьте переменные окружения
- Убедитесь, что MongoDB доступен (если используется)

### Ошибка: CORS error
**Причина:** Backend не разрешает запросы с вашего домена
**Решение:**
- Добавьте ваш frontend домен в `CORS_ORIGINS` в `.env` файле backend
- Перезапустите backend после изменения

### Ошибка: Timeout
**Причина:** Backend слишком долго обрабатывает запрос
**Решение:**
- Проверьте логи backend на медленные операции
- Увеличьте timeout в коде (сейчас 10 секунд)
- Проверьте производительность SMTP сервера

## Шаг 7: Временное решение (Fallback)

Если backend полностью недоступен, форма все равно показывает сообщение об ошибке пользователю, предлагая связаться напрямую по email `info@sircubat.com`.

Для экстренного случая можно временно изменить форму, чтобы она отправляла данные через `mailto:` ссылку, но это менее удобно для пользователей.

## Шаг 8: Проверка после исправления

После применения исправлений:

1. **Пересоберите frontend:**
   ```bash
   cd frontend
   yarn build
   ```

2. **Перезапустите backend:**
   ```bash
   cd backend
   uvicorn server:app --reload
   ```

3. **Протестируйте форму:**
   - Откройте сайт
   - Заполните и отправьте форму
   - Проверьте консоль браузера на наличие ошибок
   - Проверьте логи backend

## Дополнительная информация

- Все заявки сохраняются в MongoDB (если настроен) в коллекции `contact_submissions`
- Если SMTP не настроен, заявки логируются в консоль backend
- Health check endpoint доступен по `/health` для диагностики

