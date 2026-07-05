# Modelo de datos

## Pregunta

```json
{
  "id": "informatica-001",
  "bank": "informatica",
  "bankTitle": "Tecnico/a Superior Informatica",
  "block": "001",
  "number": 1,
  "status": "verified",
  "statusLabel": "🟢 VERIFICADA",
  "question": "Texto del enunciado",
  "options": [
    {
      "key": "a",
      "text": "Opcion a"
    },
    {
      "key": "b",
      "text": "Opcion b"
    }
  ],
  "correct": ["b"],
  "answerLabel": "b)",
  "foundation": "Explicacion breve.",
  "normative": "Fuente oficial o pendiente.",
  "observations": "Observaciones o incidencias.",
  "memorize": "Resumen de una linea.",
  "sourceFile": "001.md"
}
```

## Estados normalizados

| Estado app | Significado |
|---|---|
| `verified` | Respuesta documentada con fuente suficiente |
| `pending` | Alta probabilidad o pendiente de verificacion |
| `test_error` | Error del test |
| `multiple_possible` | Dos o mas respuestas posibles |

## Resultado de usuario

```json
{
  "questionId": "informatica-001",
  "selected": "b",
  "isCorrect": true,
  "answeredAt": "2026-07-05T20:30:00.000Z",
  "mode": "test"
}
```

## Estadisticas agregadas

```json
{
  "bank": "informatica",
  "seen": 20,
  "answered": 15,
  "correct": 13,
  "wrong": 2,
  "favorites": 3
}
```

