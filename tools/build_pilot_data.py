from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "pilot.json"

BANKS = [
    {
        "bank": "informatica",
        "bankTitle": "Técnico/a Superior Informática",
        "questions": Path(r"C:\Codex\ope-Informatica\output\questions.json"),
        "rawText": Path(r"C:\Codex\ope-Informatica\output\extracted_text.txt"),
        "manual": Path(r"C:\Codex\ope-Informatica\manual"),
    },
    {
        "bank": "mantenimiento",
        "bankTitle": "Técnico/a Superior de Mantenimiento e Instalaciones",
        "questions": Path(r"C:\Codex\ope-Mantenimiento\output\questions.json"),
        "rawText": Path(r"C:\Codex\ope-Mantenimiento\output\extracted_text.txt"),
        "manual": Path(r"C:\Codex\ope-Mantenimiento\manual"),
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

QUESTION_RE = re.compile(
    r"(?ms)^\s*(\d{1,3})\.\s+(.*?)(?=^\s*\d{1,3}\.\s+|\Z)"
)
OPTION_RE = re.compile(r"(?ms)^\s*([abcd])\)\s*(.*?)(?=^\s*[abcd]\)\s*|\Z)")


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def clean_text(value: str) -> str:
    value = re.sub(r"\s+", " ", value.replace("\ufeff", " ")).strip()
    value = re.sub(r"\s*===== PAGE \d+ =====\s*\d*", " ", value).strip()
    return value


TEXT_FIXES = {
    "Qu ": "Qué ",
    " qu ": " qué ",
    "Cul": "Cuál",
    "Cules": "Cuáles",
    "cmo": "cómo",
    "Cmo": "Cómo",
    "dnde": "dónde",
    "Dnde": "Dónde",
    "quin": "quién",
    "Quin": "Quién",
    "máquiéna": "máquina",
    "Máquiéna": "Máquina",
    "transmisin": "transmisión",
    "travs": "través",
    "dilogo": "diálogo",
    "sincronizacin": "sincronización",
    "sesin": "sesión",
    "presentacin": "presentación",
    "aplicacin": "aplicación",
    "aplicaciones": "aplicaciones",
    "fsica": "física",
    "Fsica": "Física",
    "lgica": "lógica",
    "Lgica": "Lógica",
    "funcin": "función",
    "direccin": "dirección",
    "direcciones": "direcciones",
    "mltiples": "múltiples",
    "anomalas": "anomalías",
    "actualizacin": "actualización",
    "insercin": "inserción",
    "normalizacin": "normalización",
    "diseo": "diseño",
    "fornea": "foránea",
    "tecnologa": "tecnología",
    "mquina": "máquina",
    "nicamente": "únicamente",
    "librera": "librería",
    "est ": "está ",
    "estn": "están",
    "estandarizacin": "estandarización",
    "gestin": "gestión",
    "informacin": "información",
    "descripcin": "descripción",
    "solucin": "solución",
    "ejecucin": "ejecución",
    "validacin": "validación",
    "planificacin": "planificación",
    "construccin": "construcción",
    "transicin": "transición",
    "autenticacin": "autenticación",
    "autorizacin": "autorización",
    "integridad": "integridad",
    "criptografa": "criptografía",
    "simtrica": "simétrica",
    "asimtrica": "asimétrica",
    "sesin": "sesión",
    "cdigos": "códigos",
    "poltica": "política",
    "analtica": "analítica",
    "preparacin": "preparación",
    "histico": "histórico",
    "relacin": "relación",
    "jerrquico": "jerárquico",
    "rbol": "árbol",
    "minera": "minería",
    "estadstica": "estadística",
    "programacin": "programación",
    "extraccin": "extracción",
    "verificacin": "verificación",
    "Administracin": "Administración",
    "resolucin": "resolución",
    "disposicin": "disposición",
    "mximo": "máximo",
    "mxima": "máxima",
    "mnimo": "mínimo",
    "mnima": "mínima",
    "segn": "según",
    "Segn": "Según",
    "artculo": "artículo",
    "Artculo": "Artículo",
    "mbito": "Ámbito",
    "trmico": "térmico",
    "trmica": "térmica",
    "trmicas": "térmicas",
    "climatizacin": "climatización",
    "produccin": "producción",
    "calefaccin": "calefacción",
    "refrigeracin": "refrigeración",
    "automatizacin": "automatización",
    "construccin": "construcción",
    "aplicarn": "aplicarán",
    "aplicar": "aplicará",
    "instalacin": "instalación",
    "instalaciones": "instalaciones",
    "sustitucin": "sustitución",
    "reposicin": "reposición",
    "fro": "frío",
    "caractersticas": "características",
    "modificacin": "modificación",
    "tcnica": "técnica",
    "energa": "energía",
    "agrcolas": "agrícolas",
    "est ": "está ",
    "prevencin": "prevención",
    "legionelosis": "legionelosis",
    "revisin": "revisión",
    "desinfeccin": "desinfección",
    "depsitos": "depósitos",
    "frecuencia": "frecuencia",
    "grifos": "grifos",
    "gestin": "gestión",
    "pblica": "pública",
    "nicamente": "únicamente",
    "econmicos": "económicos",
    "pblicos": "públicos",
    "Autnoma": "Autónoma",
    "especfico": "específico",
    "nmero": "número",
    "nmeros": "números",
    "autnomo": "autónomo",
    "autnomos": "autónomos",
    "quirofano": "quirófano",
    "proteccion": "protección",
    "proteccin": "protección",
}


def restore_visible_text(value: str) -> str:
    text = clean_text(value)
    for bad, good in sorted(TEXT_FIXES.items(), key=lambda item: len(item[0]), reverse=True):
        text = text.replace(bad, good)
    text = text.replace("máquiéna", "máquina")
    text = text.replace("máquiénas", "máquinas")
    text = text.replace("Máquiéna", "Máquina")
    text = text.replace("cules", "cuáles")
    text = text.replace("Cules", "Cuáles")
    text = re.split(
        r"\s+CASO PR.?CTICO\s+\d+|\s+DESCRIPCI.?N DEL CASO|\s+PREGUNTAS:\s+\d+",
        text,
        maxsplit=1,
    )[0].strip()
    if text.startswith(("Qué ", "Cuál ", "Cuáles ", "Cómo ", "Dónde ", "Quién ", "En qué ", "A qué ")):
        text = "¿" + text
    if text.startswith("En qué ") or text.startswith("A qué "):
        text = "¿" + text
    return text


def parse_questions_from_text(path: Path) -> dict[int, dict[str, object]]:
    raw = read_text(path)
    parsed: dict[int, dict[str, object]] = {}
    for match in QUESTION_RE.finditer(raw):
        number = int(match.group(1))
        block = match.group(2).strip()
        options = {letter: restore_visible_text(body) for letter, body in OPTION_RE.findall(block)}
        question_text = OPTION_RE.split(block, maxsplit=1)[0]
        if number not in parsed:
            parsed[number] = {
                "number": number,
                "question": restore_visible_text(question_text),
                "options": options,
            }
    return parsed


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


def status_label(status: str) -> str:
    return {
        "verified": "Verificada",
        "pending": "Pendiente",
        "test_error": "Error del test",
        "multiple_possible": "Dos respuestas posibles",
    }.get(status, "Pendiente")


def parse_correct(answer_label: str) -> list[str]:
    if not answer_label:
        return []
    found = re.findall(r"\b([a-d])\)", answer_label.lower())
    if found:
        return sorted(set(found))
    if "error del test" in answer_label.lower():
        return []
    return []


def fix_known_extraction_errors(bank: str, number: int, options: list[dict[str, str]]) -> list[dict[str, str]]:
    if bank == "mantenimiento" and number == 30:
        return [
            {
                "key": "a",
                "text": (
                    "Los niveles de proceso serán verificados para constatar su adaptación a la aplicación, "
                    "de acuerdo con la base de datos especificados en el proyecto o memoria técnica. No se "
                    "consideran a estos efectos los protocolos establecidos en la norma UNE-EN-ISO 16484-3."
                ),
            },
            {
                "key": "b",
                "text": (
                    "Los niveles de proceso serán verificados para constatar su adaptación a la aplicación, "
                    "de acuerdo con la base de datos especificados en el proyecto o memoria técnica. Son "
                    "válidos a estos efectos los protocolos establecidos en la norma UNE-EN-ISO 16484-3."
                ),
            },
            {
                "key": "c",
                "text": "Los niveles de proceso no tendrán por qué ser verificados para constatar su adaptación a la aplicación.",
            },
            {
                "key": "d",
                "text": (
                    "Los niveles de proceso serán verificados para constatar su adaptación a la aplicación, "
                    "de acuerdo con la base de datos especificados en el proyecto o memoria técnica. Son "
                    "válidos a estos efectos los protocolos establecidos en la norma UNE-EN-ISO 14684-3."
                ),
            },
        ]
    return options


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
    questions_from_json = {
        int(item["number"]): item
        for item in json.loads(read_text(config["questions"]))
    }
    questions_from_raw = parse_questions_from_text(config["rawText"])
    questions = {}
    for number, item in questions_from_json.items():
        raw_item = questions_from_raw.get(number)
        if raw_item and len(raw_item.get("options", {})) >= len(item.get("options", {})):
            questions[number] = raw_item
        else:
            questions[number] = item
    manual, source_files = load_manual_index(config["manual"])
    result = []

    numbers = sorted(set(questions) & set(manual))
    for number in numbers:
        q = questions[number]
        m = manual[number]
        options = [
            {"key": key, "text": restore_visible_text(value)}
            for key, value in sorted(q.get("options", {}).items())
        ]
        options = fix_known_extraction_errors(config["bank"], number, options)
        raw_status_label = m.get("statusLabel", "")
        answer_label = m.get("answerLabel", "")
        status = normalize_status(raw_status_label)
        result.append(
            {
                "id": f"{config['bank']}-{number:03d}",
                "bank": config["bank"],
                "bankTitle": config["bankTitle"],
                "block": source_files[number].split("_", 1)[0].replace(".md", ""),
                "number": number,
                "status": status,
                "statusLabel": status_label(status),
                "question": restore_visible_text(q["question"]),
                "options": options,
                "correct": [] if status == "test_error" else parse_correct(answer_label),
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
        "version": "full-001",
        "title": "OPE Trainer",
        "generatedFrom": "Markdown manuals and extracted question JSON, full bank",
        "questions": [item for bank in BANKS for item in build_bank(bank)],
    }
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT} ({len(data['questions'])} questions)")


if __name__ == "__main__":
    main()
