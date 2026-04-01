# 💰 DebtNet

Мобильное приложение для учёта долгов между друзьями и знакомыми.

## 📱 Экраны

| Экран | Файл | Описание |
|-------|------|----------|
| 🏠 Главная | `app/tabs/index.tsx` | Дашборд, последние операции, Дать/Взять |
| 📊 Баланс | `app/tabs/balance.tsx` | Долги, 5 табов: Баланс/Доходы/Расходы/Вещи/Ожидают |
| 👥 Группы | `app/tabs/groups.tsx` | Групповые долги, создание групп |
| 📇 Контакты | `app/tabs/contacts.tsx` | Контакты, синхронизация, добавление |
| 👤 Профиль | `app/tabs/profile.tsx` | Настройки, Premium, Валюта, Рефералы |
| ➕ Новая запись | `app/modals/entry.tsx` | Модал Дать/Взять с телефонной книгой |

## 🛠 Стек

- **React Native** + **Expo SDK 52**
- **Expo Router v4** — файловая маршрутизация
- **Zustand** — управление состоянием
- **NativeWind** — Tailwind CSS для RN
- **TypeScript**

## 🚀 Запуск

```bash
npm install
npx expo start
```

### Android
```bash
npx expo run:android
```

### iOS
```bash
npx expo run:ios
```

## 📦 Сборка APK (EAS)

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

## 📂 Структура проекта

```
debtnet/
├── app/
│   ├── _layout.tsx          # Root layout
│   ├── tabs/
│   │   ├── _layout.tsx      # Tab bar
│   │   ├── index.tsx        # Главная
│   │   ├── balance.tsx      # Баланс
│   │   ├── groups.tsx       # Группы
│   │   ├── contacts.tsx     # Контакты
│   │   └── profile.tsx      # Профиль
│   └── modals/
│       └── entry.tsx        # Дать/Взять
├── src/
│   ├── store/
│   │   └── useStore.ts      # Zustand store
│   ├── types/
│   │   └── index.ts         # TypeScript типы
│   ├── constants/
│   │   └── theme.ts         # Цвета, валюты
│   └── components/
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       └── Header.tsx
├── assets/images/
├── app.json
├── package.json
├── tailwind.config.js
├── babel.config.js
├── tsconfig.json
└── eas.json
```

## 🎨 Дизайн

- Тёмная тема `#0A0A0F`
- Акцент `#5B4FE8` (фиолетовый)
- Зелёный `#10B981`, Красный `#EF4444`, Янтарный `#FBB147`
- Мультивалютность: BYN · USD · EUR · USDT · BTC

## 📄 Лицензия

MIT © 2026 DebtNet
