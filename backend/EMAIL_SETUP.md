# Настройка отправки email для формы контакта

## Обзор

Форма контакта отправляет данные на email **info@sircubat.com** через backend endpoint `/api/contact`.

## Варианты настройки

### Вариант 1: С настройками SMTP (рекомендуется)

Для отправки email через SMTP добавьте следующие переменные в файл `.env` в папке `backend/`:

```env
# SMTP настройки
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
RECIPIENT_EMAIL=info@sircubat.com
```

**Примеры SMTP провайдеров:**

1. **Gmail:**
   - SMTP_HOST: `smtp.gmail.com`
   - SMTP_PORT: `587`
   - Требуется App Password (не обычный пароль)

2. **Outlook/Office365:**
   - SMTP_HOST: `smtp.office365.com`
   - SMTP_PORT: `587`

3. **Другие провайдеры:**
   - Проверьте документацию вашего почтового провайдера

### Вариант 2: Без SMTP настроек (fallback)

Если SMTP настройки не указаны, форма будет:
- Сохранять данные в MongoDB
- Логировать данные в консоль
- Возвращать успешный ответ пользователю

Все заявки можно будет просматривать в MongoDB коллекции `contact_submissions`.

## Настройка Gmail App Password

1. Включите двухфакторную аутентификацию в Google Account
2. Перейдите в [App Passwords](https://myaccount.google.com/apppasswords)
3. Создайте новый App Password для "Mail"
4. Используйте этот пароль в `SMTP_PASSWORD`

## Проверка работы

После настройки:
1. Запустите backend: `python server.py` или `uvicorn server:app --reload`
2. Отправьте тестовую форму с сайта
3. Проверьте логи backend на наличие ошибок
4. Проверьте почту info@sircubat.com

## Troubleshooting

**Ошибка "Authentication failed":**
- Проверьте правильность SMTP_USER и SMTP_PASSWORD
- Для Gmail используйте App Password, а не обычный пароль

**Ошибка "Connection timeout":**
- Проверьте SMTP_HOST и SMTP_PORT
- Убедитесь, что firewall не блокирует соединение

**Email не приходит:**
- Проверьте папку "Спам"
- Проверьте логи backend на наличие ошибок
- Проверьте, что RECIPIENT_EMAIL правильный
