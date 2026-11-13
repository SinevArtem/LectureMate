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

Для запуска реального анализа локально нужны два процесса:

```bash
# терминал 1
cd backend
AI_PROVIDER=ollama AI_MODEL=qwen2.5vl:7b npm start

# терминал 2
cd frontend
npm install
npm run dev
```

Перед этим установи Ollama и модель:

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen2.5vl:7b
```

Backend отправляет снимок доски в локальную Ollama vision-модель, проверяет простые арифметические равенства и не принимает одну и ту же ревизию задачи повторно. OpenAI-ключ для этого режима не нужен.
