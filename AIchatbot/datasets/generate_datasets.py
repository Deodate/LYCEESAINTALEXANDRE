#!/usr/bin/env python3
"""
Generate synthetic question datasets for the Lycee Saint Alexandre AI chatbot.

Outputs (by default into the current directory):
  - parents_questions.jsonl: 500 questions with fields {role, intent, text}
  - students_questions.jsonl: 500 questions with fields {role, intent, text}
  - parents_questions.txt: 500 quoted questions
  - students_questions.txt: 500 quoted questions

Usage:
  python generate_datasets.py --out ./ --num_per_role 500 --seed 42

Only standard library is used; no external dependencies required.
"""

from __future__ import annotations

import argparse
import itertools
import json
import os
import random
from typing import Dict, Iterable, List, Tuple


def flattened(iterables: Iterable[Iterable[str]]) -> List[str]:
    return [item for sub in iterables for item in sub]


def unique_preserve_order(items: Iterable[str]) -> List[str]:
    seen = set()
    result: List[str] = []
    for item in items:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result


def choice_or_empty(options: List[str]) -> str:
    # Return either an empty string or a random option (to add variety)
    if not options:
        return ""
    return random.choice([""] + options)


def normalize_whitespace(text: str) -> str:
    return " ".join(text.split()).strip()


def ensure_question_punctuation(text: str) -> str:
    text = text.rstrip()
    if not text.endswith("?"):
        text += "?"
    return text


def generate_parent_questions() -> List[Tuple[str, str]]:
    """Return a list of (intent, text) pairs for the Parents role."""

    # Shared vocab
    child_refs = ["child", "kid", "daughter", "son"]
    terms = [
        "this semester", "this term", "the current term", "this quarter",
        "the current semester", "this academic term"
    ]
    subjects = [
        "mathematics", "math", "science", "biology", "chemistry", "physics",
        "English", "French", "Kinyarwanda", "history", "geography", "computer science"
    ]
    months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    times = [
        "at 2:00 PM", "in the afternoon", "in the morning", "around midday"
    ]

    # Intent: parent-teacher meeting schedule
    meeting_leads = [
        "When is", "What is the date of", "When will", "Could you tell me when",
        "I would like to know when", "Do you know when"
    ]
    meeting_nouns = [
        "the next parent-teacher meeting", "the upcoming parent-teacher meeting",
        "our parent-teacher conference", "the next meeting with teachers"
    ]
    meeting_suffixes = [
        "for my {child}", "for {month}", "for grade 11", "for S3 class", ""
    ]

    meeting_templates: List[str] = []
    for lead, noun, suffix in itertools.product(meeting_leads, meeting_nouns, meeting_suffixes):
        suffix_filled = suffix.format(child=random.choice(child_refs), month=random.choice(months))
        question = normalize_whitespace(f"{lead} {noun} {suffix_filled}?")
        meeting_templates.append(question)

    # Intent: fee status
    fee_starts = [
        "Has", "Have", "Do"
    ]
    fee_bodies = [
        "my {child} paid all school fees {term}",
        "we paid all the required fees {term}",
        "there remain any outstanding fees {term}",
        "we cleared the balance {term}",
    ]
    fee_endings = ["yet", "already", "so far", "", "by now"]

    fee_templates: List[str] = []
    for start, body, ending in itertools.product(fee_starts, fee_bodies, fee_endings):
        text = f"{start} " + body.format(child=random.choice(child_refs), term=choice_or_empty(terms))
        if ending:
            text = f"{text} {ending}"
        fee_templates.append(ensure_question_punctuation(normalize_whitespace(text)))

    # Intent: academic performance
    perf_leads = [
        "How is", "How well is", "Can I get an update on", "What is",
        "Could you share", "Please share"
    ]
    perf_bodies = [
        "my {child}'s performance in {subject}",
        "how my {child} is doing in {subject}",
        "my {child}'s recent grades for {subject}",
    ]

    perf_templates: List[str] = []
    for lead, body in itertools.product(perf_leads, perf_bodies):
        text = f"{lead} {body.format(child=random.choice(child_refs), subject=random.choice(subjects))}?"
        perf_templates.append(normalize_whitespace(text))

    # Intent: upcoming events
    events_templates = [
        "Are there any upcoming school events?",
        "What events are happening soon?",
        "What are the upcoming school events?",
        "Could you list upcoming events this month?",
        "Is anything planned for {month}?",
        "What events are scheduled for parents?",
    ]
    events_templates = [
        ensure_question_punctuation(normalize_whitespace(t.format(month=random.choice(months))))
        for t in events_templates
    ]

    # Intent: school holidays
    holidays_templates = [
        "What are the school holidays for this year?",
        "When are the next school holidays?",
        "Could you share the holiday calendar?",
        "When does the holiday break start?",
        "How long is the next holiday?",
    ]

    # Collect with intent labels
    parent_examples: List[Tuple[str, str]] = []
    parent_examples += [("parent_meeting_schedule", q) for q in meeting_templates]
    parent_examples += [("parent_fee_status", q) for q in fee_templates]
    parent_examples += [("parent_academic_performance", q) for q in perf_templates]
    parent_examples += [("parent_upcoming_events", q) for q in events_templates]
    parent_examples += [("parent_holidays", q) for q in holidays_templates]

    # Deduplicate while preserving order, then shuffle for randomness
    parent_examples_unique = unique_preserve_order(parent_examples)
    random.shuffle(parent_examples_unique)
    return parent_examples_unique


def generate_student_questions() -> List[Tuple[str, str]]:
    """Return a list of (intent, text) pairs for the Students role."""

    terms = [
        "this semester", "next semester", "the coming term", "the next term", "the upcoming semester"
    ]
    months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    # Intent: next semester start
    start_leads = [
        "When does", "When will", "What date does", "Could you tell me when"
    ]
    start_bodies = [
        "the next semester start", "the upcoming term begin", "classes resume"
    ]
    start_suffixes = [
        "for {month}", "for day students", "for boarding students", ""
    ]

    start_templates: List[str] = []
    for lead, body, suffix in itertools.product(start_leads, start_bodies, start_suffixes):
        suffix_filled = suffix.format(month=random.choice(months))
        text = normalize_whitespace(f"{lead} {body} {suffix_filled}?")
        start_templates.append(text)

    # Intent: outstanding fees
    fees_templates_bases = [
        "Do I have any outstanding fees {term}",
        "What is my fee balance {term}",
        "Have I cleared my fees {term}",
        "How much do I owe {term}",
    ]
    fees_templates: List[str] = []
    for base in fees_templates_bases:
        text = base.format(term=random.choice(["", "for "+random.choice(terms)])).strip()
        fees_templates.append(ensure_question_punctuation(normalize_whitespace(text)))

    # Intent: upcoming events
    events_templates = [
        "What are the upcoming school events?",
        "Are there any events this month?",
        "What events are planned for students?",
        "Is there a sports day coming up?",
        "Any assemblies or clubs meeting soon?",
    ]

    student_examples: List[Tuple[str, str]] = []
    student_examples += [("student_semester_start", q) for q in start_templates]
    student_examples += [("student_outstanding_fees", q) for q in fees_templates]
    student_examples += [("student_upcoming_events", q) for q in events_templates]

    student_examples_unique = unique_preserve_order(student_examples)
    random.shuffle(student_examples_unique)
    return student_examples_unique


def sample_balanced(examples: List[Tuple[str, str]], desired_total: int) -> List[Tuple[str, str]]:
    """Sample examples to a desired total, balancing across intents as evenly as possible."""
    # Group by intent
    by_intent: Dict[str, List[str]] = {}
    for intent, text in examples:
        by_intent.setdefault(intent, []).append(text)

    intents = list(by_intent.keys())
    per_intent_base = desired_total // len(intents)
    remainder = desired_total % len(intents)

    sampled: List[Tuple[str, str]] = []
    for i, intent in enumerate(intents):
        pool = by_intent[intent]
        random.shuffle(pool)
        target = per_intent_base + (1 if i < remainder else 0)
        # If the pool is smaller than target, cycle the pool to reach the target
        repeated = list(itertools.islice(itertools.cycle(pool), target))
        sampled.extend((intent, text) for text in repeated)
    random.shuffle(sampled)
    return sampled


def write_jsonl(path: str, role: str, items: List[Tuple[str, str]]) -> None:
    with open(path, "w", encoding="utf-8") as f:
        for intent, text in items:
            record = {"role": role, "intent": intent, "text": text}
            f.write(json.dumps(record, ensure_ascii=False) + "\n")


def write_txt(path: str, items: List[Tuple[str, str]]) -> None:
    with open(path, "w", encoding="utf-8") as f:
        for _, text in items:
            f.write(f'"{text}"\n')


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Parents/Students question datasets.")
    parser.add_argument("--out", default=".", help="Output directory (will be created if missing)")
    parser.add_argument("--num_per_role", type=int, default=500, help="Number of questions per role")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")
    args = parser.parse_args()

    random.seed(args.seed)

    os.makedirs(args.out, exist_ok=True)

    parent_pool = generate_parent_questions()
    student_pool = generate_student_questions()

    parents_samples = sample_balanced(parent_pool, args.num_per_role)
    students_samples = sample_balanced(student_pool, args.num_per_role)

    write_jsonl(os.path.join(args.out, "parents_questions.jsonl"), "parent", parents_samples)
    write_jsonl(os.path.join(args.out, "students_questions.jsonl"), "student", students_samples)

    write_txt(os.path.join(args.out, "parents_questions.txt"), parents_samples)
    write_txt(os.path.join(args.out, "students_questions.txt"), students_samples)

    print(f"Wrote {len(parents_samples)} parent questions and {len(students_samples)} student questions to {args.out}")


if __name__ == "__main__":
    main()









