# DebtNet — Миграция на React Native

## Что создано

Новые файлы для замены мок-данных на реальный API:

```
src/services/
  api.ts        — JWT клиент с auto-refresh при 401
  auth.ts       — register / login / logout
  loans.ts      — getSummary / getDebtors / createLoan
  contacts.ts   — getContacts / createInvite / acceptInvite / removeContact
  sse.ts        — SSE клиент (real-time события)

src/store/
  useStore.ts   — Zustand стор (заменяет мок-данные на API)

app/
  _layout.tsx         — root layout с auth flow (заменить существующий)
  (auth)/
    _layout.tsx       — layout для auth группы
    login.tsx         — экран входа
    register.tsx      — экран регистрации
```

## Как применить

1. Скопируй файлы из `src/services/` в репозиторий
2. Замени `src/store/useStore.ts`
3. Замени `app/_layout.tsx`
4. Добавь папку `app/(auth)/` с тремя файлами

## Что нужно установить

```bash
npm install @react-native-async-storage/async-storage
# (уже есть в package.json, просто убедись что установлен)
```

## Важно

⚠️ Сервер должен настроить CORS:
```typescript
// NestJS main.ts
app.enableCors();
```

Без этого мобильный клиент также получит ошибки на некоторых операциях.

## API

Base URL: https://trx-api-test.d4f.tech
