# Исправление проблемы с отображением видео и логотипов после деплоя

## Проблема
После деплоя не отображаются видео и логотипы.

## Решение

### 1. Обновлены пути к файлам
Все пути к статическим файлам теперь используют `process.env.PUBLIC_URL` для правильной работы после билда:

**Логотипы:**
- `src="/logo_cec_1.png"` → `src={`${process.env.PUBLIC_URL || ''}/logo_cec_1.png`}`
- `src="/logo_cec_2.png"` → `src={`${process.env.PUBLIC_URL || ''}/logo_cec_2.png`}`

**Видео:**
- `src="/video/video-background.mp4"` → `src={`${process.env.PUBLIC_URL || ''}/video/video-background.mp4`}`

### 2. Обновлен .htaccess
Добавлена явная поддержка MIME типов для видео файлов:
```apache
<IfModule mod_mime.c>
  AddType video/mp4 .mp4
  AddType video/webm .webm
  AddType video/ogg .ogv
</IfModule>
```

### 3. Важно после деплоя

1. **Убедитесь, что файлы находятся в правильных местах:**
   ```
   build/
     ├── logo_cec_1.png
     ├── logo_cec_2.png
     ├── video/
     │   └── video-background.mp4
     └── index.html
   ```

2. **Проверьте права доступа к файлам:**
   - Папка `video/`: права **755**
   - Файлы `.png`: права **644**
   - Файл `video-background.mp4`: права **644**

3. **Проверьте .htaccess на сервере:**
   - Файл должен быть в корне сайта (там же, где `index.html`)
   - Убедитесь, что модуль `mod_rewrite` включен на сервере

4. **Пересоберите проект:**
   ```bash
   cd frontend
   yarn build
   ```
   
   После этого загрузите содержимое папки `build/` на сервер.

### 4. Проверка после деплоя

Откройте в браузере напрямую:
- `https://ваш-домен.com/logo_cec_1.png` - должен отображаться логотип
- `https://ваш-домен.com/logo_cec_2.png` - должен отображаться логотип
- `https://ваш-домен.com/video/video-background.mp4` - должно загрузиться видео

Если файлы не открываются напрямую, проверьте:
1. Правильность путей на сервере
2. Права доступа к файлам
3. Настройки .htaccess

