from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "pilot.json"

BANKS = [
    {
        "bank": "informatica",
        "bankTitle": "Tecnico/a Superior Informatica",
        "questions": Path(r"C:\Codex\ope-Informatica\output\questions.json"),
        "manual": Path(r"C:\Codex\ope-Informatica\manual"),
        "numbers": [1, 2, 3, 4, 5, 53, 91, 93, 101, 102],
    },
    {
        "bank": "mantenimiento",
        "bankTitle": "Tecnico/a Superior de Mantenimiento e Instalaciones",
        "questions": Path(r"C:\Codex\ope-Mantenimiento\output\questions.json"),
        "manual": Path(r"C:\Codex\ope-Mantenimiento\manual"),
        "numbers": [1, 2, 3, 4, 5, 38, 411, 412, 421, 422],
    },
]

SECTION_NAMES = {
    "estado": "statusLabel",
    "respuesta": "answerLabel",
    "respuesta correcta": "answerLabel",
    "fundamento": "foundation",
    "normativa": "normative",
    "observaciones": "observations",
    "para memorizar": "memorize",
}


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def clean_text(value: str) -> str:
    value = re.sub(r"\s+", " ", value.replace("\ufeff", " ")).strip()
    return value


def normalize_status(label: str) -> str:
    lowered = label.lower()
    if "error" in lowered:
        return "test_error"
    if "dos" in lowered or "posibles" in lowered or "conflict" in lowered:
        return "multiple_possible"
    if "pendiente" in lowered or "alta probabilidad" in lowered:
        return "pending"
    if "verificada" in lowered or "verificado" in lowered:
        return "verified"
    return "pending"


def parse_correct(answer_label: str) -> list[str]:
    if not answer_label:
        return []
    found = re.findall(r"\b([a-d])\)", answer_label.lower())
    if found:
        return sorted(set(found))
    if "error del test" in answer_label.lower():
        return []
    return []


def split_question_blocks(text: str) -> dict[int, str]:
    matches = list(re.finditer(r"(?m)^# Pregunta\s+(\d+)\s*$", text))
    blocks: dict[int, str] = {}
    for index, match in enumerate(matches):
        start = match.start()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        blocks[int(match.group(1))] = text[start:end].strip()
    return blocks


def parse_manual_block(block: str) -> dict[str, str]:
    lines = block.splitlines()
    current: str | None = None
    fields: dict[str, list[str]] = {value: [] for value in SECTION_NAMES.values()}

    for raw in lines[1:]:
        stripped = raw.strip()
        if not stripped or stripped == "---":
            continue
        label = stripped.lstrip("#").strip().lower()
        if label in SECTION_NAMES:
            current = SECTION_NAMES[label]
            continue
        if current:
            fields[current].append(stripped)

    return {key: clean_text(" ".join(value)) for key, value in fields.items()}


def load_manual_index(manual_dir: Path) -> tuple[dict[int, dict[str, str]], dict[int, str]]:
    parsed: dict[int, dict[str, str]] = {}
    source_files: dict[int, str] = {}
    for path in sorted(manual_dir.glob("*.md")):
        blocks = split_question_blocks(read_text(path))
        for number, block in blocks.items():
            parsed[number] = parse_manual_block(block)
            source_files[number] = path.name
    return parsed, source_files


def build_bank(config: dict) -> list[dict]:
    questions = {
        int(item["number"]): item
        for item in json.loads(read_text(config["questions"]))
    }
    manual, source_files = load_manual_index(config["manual"])
    result = []

    for number in config["numbers"]:
        q = questions[number]
        m = manual[number]
        options = [
            {"key": key, "text": clean_text(value)}
            for key, value in sorted(q.get("options", {}).items())
        ]
        status_label = m.get("statusLabel", "")
        answer_label = m.get("answerLabel", "")
        result.append(
            {
                "id": f"{config['bank']}-{number:03d}",
                "bank": config["bank"],
                "bankTitle": config["bankTitle"],
                "block": source_files[number].split("_", 1)[0].replace(".md", ""),
                "number": number,
                "status": normalize_status(status_label),
                "statusLabel": status_label,
                "question": clean_text(q["question"]),
                "options": options,
                "correct": parse_correct(answer_label),
                "answerLabel": answer_label,
                "foundation": m.get("foundation", ""),
                "normative": m.get("normative", ""),
                "observations": m.get("observations", ""),
                "memorize": m.get("memorize", ""),
                "sourceFile": source_files[number],
            }
        )
    return result


def main() -> None:
    data = {
        "version": "pilot-001",
        "title": "OPE Trainer",
        "generatedFrom": "Markdown manuals and extracted question JSON",
        "questions": [item for bank in BANKS for item in build_bank(bank)],
    }
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT} ({len(data['questions'])} questions)")


if __name__ == "__main__":
    main()
