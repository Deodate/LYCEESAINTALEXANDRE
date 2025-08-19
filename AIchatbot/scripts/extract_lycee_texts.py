#!/usr/bin/env python3
"""
Extract human-readable content strings from the lycee React app and build a dataset.

Heuristics (safe and simple):
- Scans .jsx/.js/.tsx/.ts under lycee/src
- Extracts:
  - String literals '...' or "..." that look like human text (letters/spaces, min length)
  - JSX text between tags: > some text </ (no braces inside, not another tag)
- Skips obvious codey strings (class names, URLs, import paths, extensions, inline styles)

Output: JSONL with fields {source_file, text, kind} at AIchatbot/datasets/site_content.jsonl

Usage:
  python scripts/extract_lycee_texts.py \
    --src /Users/apple/LYCEESAINTALEXANDRE/lycee/src \
    --out /Users/apple/LYCEESAINTALEXANDRE/AIchatbot/datasets/site_content.jsonl
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
from typing import Iterable, List, Dict


STRING_RE = re.compile(r"(['\"])((?:\\.|(?!\1).)*?)\1")
JSX_TEXT_RE = re.compile(r">\s*([^<>{}][^<>{}]*)\s*</")


def looks_like_text(s: str) -> bool:
    s = s.strip()
    if len(s) < 3:
        return False
    # Skip placeholders
    lowers = s.lower()
    skip_subs = [
        "http://", "https://", "data:",
        "className", "btn-", "col-", "row", "px-", "py-", "mt-", "mb-",
        ".png", ".jpg", ".jpeg", ".svg", ".pdf", ".css", ".js", ".jsx", ".ts", ".tsx",
        "import ", "export ", "require(", "module.", "{", "}", "=", ":", ";",
    ]
    if any(x in s for x in skip_subs):
        return False
    # At least one letter, mostly letters/spaces/punct
    if not re.search(r"[A-Za-z]", s):
        return False
    # Avoid long camelCase or snake_case-like tokens
    if re.fullmatch(r"[A-Za-z0-9_\-]{3,}", s):
        return False
    # Avoid React props-like 'true', 'false'
    if lowers in {"true", "false", "null", "undefined"}:
        return False
    # Not only punctuation
    if re.fullmatch(r"[\-–—•.,:;!?'+=()\[\]{}\s]+", s):
        return False
    return True


def dedupe_preserve_order(items: Iterable[str]) -> List[str]:
    seen = set()
    out: List[str] = []
    for x in items:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out


def extract_from_file(path: str) -> List[dict]:
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    except Exception:
        return []

    texts: List[str] = []

    # 1) String literals
    for m in STRING_RE.finditer(content):
        candidate = m.group(2)
        if looks_like_text(candidate):
            line_start = content.count("\n", 0, m.start()) + 1
            line_end = content.count("\n", 0, m.end()) + 1
            texts.append((candidate.strip(), line_start, line_end))

    # 2) JSX text between tags
    for m in JSX_TEXT_RE.finditer(content):
        candidate = m.group(1)
        candidate = re.sub(r"\s+", " ", candidate).strip()
        if looks_like_text(candidate):
            line_start = content.count("\n", 0, m.start(1)) + 1
            line_end = content.count("\n", 0, m.end(1)) + 1
            texts.append((candidate, line_start, line_end))

    # Deduplicate by text only but keep first line numbers
    seen: Dict[str, Dict] = {}
    for t, ls, le in texts:
        if t not in seen:
            seen[t] = {"source_file": path, "text": t, "kind": "string_or_jsx", "line_start": ls, "line_end": le}
    return list(seen.values())


def iter_source_files(root: str) -> Iterable[str]:
    exts = {".js", ".jsx", ".ts", ".tsx"}
    for dirpath, _, filenames in os.walk(root):
        for fn in filenames:
            if os.path.splitext(fn)[1] in exts:
                yield os.path.join(dirpath, fn)


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract text content from lycee React app")
    parser.add_argument("--src", required=True, help="Path to lycee/src")
    parser.add_argument("--out", required=True, help="Output JSONL path")
    parser.add_argument("--format", choices=["jsonl", "csv"], default="jsonl", help="Output format (default: jsonl)")
    parser.add_argument("--include-lines", action="store_true", help="Include line_start/line_end metadata")
    args = parser.parse_args()

    all_rows: List[dict] = []
    for fp in iter_source_files(args.src):
        all_rows.extend(extract_from_file(fp))

    os.makedirs(os.path.dirname(args.out), exist_ok=True)

    if args.format == "jsonl":
        with open(args.out, "w", encoding="utf-8") as f:
            for row in all_rows:
                out_row = dict(row)
                if not args.include_lines:
                    out_row.pop("line_start", None)
                    out_row.pop("line_end", None)
                f.write(json.dumps(out_row, ensure_ascii=False) + "\n")
    else:  # csv
        fieldnames = ["source_file", "text", "kind"]
        if args.include_lines:
            fieldnames += ["line_start", "line_end"]
        with open(args.out, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for row in all_rows:
                out_row = {k: row.get(k, "") for k in fieldnames}
                writer.writerow(out_row)

    print(f"Wrote {len(all_rows)} records to {args.out}")


if __name__ == "__main__":
    main()


