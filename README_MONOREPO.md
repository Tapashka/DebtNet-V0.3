# DebtNet

Monorepo: мобильное приложение (React Native + Expo) + REST API (NestJS + PostgreSQL).

## Структура

```
DebtNet/
├── frontend/   — React Native + Expo SDK 52
├── backend/    — NestJS + TypeScript + PostgreSQL
└── docker-compose.yml
```

## Быстрый старт (бэкенд)

```bash
cd backend
cp .env.example .env
# Заполни .env своими значениями
npm install
npm run start:dev
```

Или через Docker:
```bash
docker-compose up
```

API доступен на `http://localhost:3000`

## Быстрый старт (фронтенд)

```bash
cd frontend
npm install
npx expo start
```

## API эндпоинты

### Auth
- `POST /auth/register` — регистрация
- `POST /auth/login` — вход
- `POST /auth/refresh` — обновление токена

### Loans
- `POST /loans` — создать транзакцию
- `GET /loans` — список транзакций
- `GET /loans/summary` — баланс
- `GET /loans/debtors` — должники
- `PATCH /loans/settle/:counterpartyId` — погасить долг

### Contacts
- `GET /contacts` — список контактов
- `POST /contacts/invites` — создать инвайт
- `POST /contacts/invites/:token/accept` — принять инвайт
- `DELETE /contacts/:contactUserId` — удалить контакт

### SSE (real-time)
- `GET /events?token=ACCESS_TOKEN` — поток событий

## Деплой бэкенда на Railway

1. Зайди на [railway.app](https://railway.app) через GitHub
2. New Project → Deploy from GitHub → выбери `DebtNet-Back`
3. Добавь PostgreSQL: + New → Database → PostgreSQL
4. В Variables добавь: `JWT_SECRET`, `JWT_REFRESH_SECRET`
5. Railway даст публичный URL — пропиши его в `frontend/src/config.ts`
