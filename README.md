Чтобы запустить фронтенд:

```
cd frontend/

nvm install 22

npm install

npm run dev
```

## Подключение AI-помощника

Фронтенд уже разделён на UI, хук состояния и провайдер AI:

- `src/services/ai.ts` содержит `AIProvider`, локальный `MockAIProvider` и SSE-адаптер `HttpAIProvider`.
- `src/hooks/useAIAnalysis.ts` запускает потоковый анализ, отменяет устаревшие запросы и хранит подсказки и шаги полного решения.
- Доска передаёт в запрос сериализованное состояние документа tldraw, номер ревизии и число объектов.

Чтобы подключить backend, задайте `VITE_AI_API_URL` (пример — в `frontend/.env.example`). Endpoint принимает `POST` с телом `{ task, board, mode }`, где `mode` равен `hint` или `solution`, и возвращает Server-Sent Events. Каждое событие должно быть JSON в строке `data:` с одним из типов `task_type`, `hint`, `solution_step`, `status`, `done` или `error`; завершение также можно обозначить `data: [DONE]`.

Пока переменная не задана, используется mock-провайдер, поэтому UI можно разрабатывать и тестировать без ключей и AI-сервера.
