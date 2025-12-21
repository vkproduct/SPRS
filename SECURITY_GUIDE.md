# Руководство po безопасности API ключей

## 1. Локальная разработка (env файл)
1. Создайте файл с именем `.env` u корнe проектa.
2. Скопируйте содержимое из `.env.example`.
3. Вставьте ваш реальный API ключ:
   ```
   API_KEY=AIzaSyDxxxxxxxxx...
   ```
4. **Важно:** Файл `.gitignore` уже настроен так, чтобы игнорировать `.env`. Это предотвратит случайную отправку ваших ключей на GitHub.

## 2. Защита ключа в Google Cloud (Критично для фронтенда)
Так как это React-приложение, код исполняется в браузере пользователя. Злоумышленник может найти ваш ключ через "Inspect Element". 

**Чтобы защитить деньги и лимиты:**

1. Перейдите в [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials).
2. Найдите ваш API Key.
3. В разделе **"Application restrictions"** выберите **"HTTP referrers (web sites)"**.
4. Добавьте домены вашего сайта:
   - `https://svadbeniportal.rs/*`
   - `http://localhost:3000/*` (dlya testov)
5. В разделе **"API restrictions"** выберите **"Restrict key"** и выберите только **"Generative Language API"**.

Теперь, даже если кто-то украдет ключ, он не сможет использовать его со своих сайтов.