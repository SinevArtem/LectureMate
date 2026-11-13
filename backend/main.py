from __future__ import annotations

import json
import os
import re
import time
import uuid
from collections import OrderedDict
from typing import Any, AsyncIterator

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from analyzer import check_arithmetic, decode_image, ocr_text, prepare_image

app = FastAPI(title='LectureMate AI backend')
OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://127.0.0.1:11434').rstrip('/')
AI_MODEL = os.getenv('AI_MODEL', 'qwen2.5vl:7b')
SEEN: OrderedDict[str, float] = OrderedDict()


class Board(BaseModel):
    revision: int
    document: Any = None
    shapeCount: int = 0
    textContent: list[str] = Field(default_factory=list)
    imageDataUrl: str | None = None
    capturedAt: int | None = None


class Task(BaseModel):
    id: str
    code: str
    title: str
    statement: str


class Request(BaseModel):
    task: Task
    board: Board
    mode: str = 'hint'


def event(payload: dict[str, Any]) -> str:
    return f'data: {json.dumps(payload, ensure_ascii=False)}\n\n'


def parse_model_json(content: str) -> dict[str, Any]:
    content = re.sub(r'^```(?:json)?\s*|\s*```$', '', content.strip(), flags=re.I)
    return json.loads(content)


async def ask_ollama(request: Request, image_b64: str) -> dict[str, Any]:
    prompt = '''Ты проверяешь решение школьника по математике. Распознай рукописные записи на изображении. Верни только JSON без markdown: {"taskType":{"code":"string","title":"string","confidence":0},"recognizedText":["string"],"hints":[{"lineIndex":0,"severity":"info|warning|error","text":"string"}]}. Не выдумывай записи. Если равенство неверно, укажи фактический результат.'''
    body = {'model': AI_MODEL, 'stream': False, 'format': 'json', 'options': {'temperature': 0}, 'messages': [{'role': 'user', 'content': f'{prompt}\nУсловие: {request.task.statement}', 'images': [image_b64]}]}
    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(f'{OLLAMA_URL}/api/chat', json=body)
    if response.status_code != 200:
        raise HTTPException(502, f'Ollama returned {response.status_code}: {response.text[:300]}')
    content = response.json().get('message', {}).get('content', '{}')
    return parse_model_json(content)


async def analyze(request: Request) -> dict[str, Any]:
    if not request.board.imageDataUrl:
        raise HTTPException(400, 'Board image is missing')
    image = decode_image(request.board.imageDataUrl)
    _, prepared_b64 = prepare_image(image)
    result = await ask_ollama(request, prepared_b64)
    # OCR output supplements vision output; SymPy remains the source of truth for arithmetic.
    recognized = list(dict.fromkeys((result.get('recognizedText') or []) + ocr_text(image) + request.board.textContent))
    result['recognizedText'] = recognized
    return result


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'provider': 'ollama', 'model': AI_MODEL}


@app.post('/api/ai/analyze')
async def analyze_endpoint(request: Request) -> StreamingResponse:
    key = f'{request.task.id}:{request.board.revision}:{request.mode}'
    if key in SEEN:
        async def duplicate() -> AsyncIterator[str]:
            yield event({'type': 'status', 'message': 'Эта ревизия уже была проверена'})
            yield event({'type': 'done'})
        return StreamingResponse(duplicate(), media_type='text/event-stream')
    result = await analyze(request)
    SEEN[key] = time.time()
    while len(SEEN) > 1000:
        SEEN.popitem(last=False)

    async def stream() -> AsyncIterator[str]:
        if result.get('taskType'):
            yield event({'type': 'task_type', 'taskType': result['taskType']})
        if request.mode == 'hint':
            for index, hint in enumerate(result.get('hints', [])):
                yield event({'type': 'hint', 'hint': {'id': str(uuid.uuid4()), 'lineIndex': hint.get('lineIndex', index), 'severity': hint.get('severity', 'info'), 'text': hint.get('text', ''), 'createdAt': int(time.time() * 1000)}})
            for text in result.get('recognizedText', []):
                checked = check_arithmetic(text)
                if checked and not checked.correct:
                    yield event({'type': 'hint', 'hint': {'id': str(uuid.uuid4()), 'lineIndex': 0, 'severity': 'error', 'text': f'Проверьте вычисление: правильный результат {checked.actual}, а записано {checked.written}.', 'createdAt': int(time.time() * 1000)}})
        yield event({'type': 'done'})
    return StreamingResponse(stream(), media_type='text/event-stream')
