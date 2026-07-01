json_loader

Приложение на `Vite + React + TypeScript` для загрузки JSON-данных с отображением прогресса, отменой запроса и выводом данных в виртуализированной таблице.

При проверке работоспособности в Network  нужно поставить скорость 4G slow, для более корректной демонстрации прогресса загрузки!

Запуск локально

1. Установить зависимости:
npm install

Для Windows PowerShell при необходимости:

npm.cmd install

2. Запустить frontend и backend одной командой:

npm run dev


Для Windows PowerShell:

npm.cmd run dev


3. Открыть приложение:

http://localhost:5173


## Отдельный запуск

Backend:
npm run dev:server


Frontend:
npm run dev:client


Для Windows PowerShell:
npm.cmd run dev:server
npm.cmd run dev:client


Docker

Сборка и запуск:

docker compose up --build

После запуска приложение доступно по адресу:

http://localhost:5173


Остановка:

docker compose down

Сборка:

npm run build

Структура проекта

- `src/components` - UI-компоненты и компоненты приложения
- `src/hooks` - пользовательские хуки
- `src/services` - загрузка и обработка данных
- `src/types` - типы данных
- `src/constants` - константы приложения
- `server` - Node.js backend для отдачи JSON-файла
- `public/data` - исходный JSON-файл
