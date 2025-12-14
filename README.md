# Load Funnel Test

Нагрузочное тестирование воронок продаж с Playwright и кастомным дашбордом.

## Быстрый старт

```bash
npm install
npx playwright install chromium

# Запуск теста (50 прогонов)
npm run test:load

# Открыть дашборд
npm run dashboard
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm test` | Обычный запуск (5 воркеров) |
| `npm run test:load` | 10 воркеров × 5 повторов = 50 прогонов |
| `npm run test:heavy` | 20 воркеров × 10 повторов = 200 прогонов |
| `npm run dashboard` | Открыть HTML дашборд |
| `npm run clean` | Очистить порт и удалить репорты |

## Кастомная нагрузка

```bash
WORKERS=30 npx playwright test --repeat-each=20
```

## Дашборд

После запуска тестов `npm run dashboard` открывает дашборд с:

- **Статистика**: total / passed / failed / success rate
- **Группировка по степам**: какой шаг воронки падает чаще
- **Группировка по ошибкам**: внутри каждого степа ошибки сгруппированы
- **Трейсы**: для каждой ошибки доступны trace файлы

## Структура

```
├── tests/
│   └── checkout-funnel.spec.js  # Тест сценарий (атомарные степы)
├── reporters/
│   └── funnel-reporter.js       # Кастомный репортер
├── scripts/
│   ├── clean.js                 # Очистка портов и репортов
│   └── serve-dashboard.js       # HTTP сервер для дашборда
├── report/                      # Генерируемые репорты
├── test-results/                # Трейсы и артефакты
└── playwright.config.js
```

## Воронка теста (22 атомарных степа)

1. Navigate to homepage
2. Wait for products to load
3. Click on random product
4. Wait for product page to load
5. Setup dialog handler
6. Click Add to cart
7. Wait for cart confirmation
8. Click on Cart link
9. Wait for cart to load
10. Click Place Order
11. Wait for checkout modal
12. Fill name/country/city/card/month/year
13. Click Purchase
14. Wait for success modal
15. Verify success message
16. Close confirmation
