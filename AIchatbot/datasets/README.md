Dataset generation for Parents and Students questions

How to use

1) From the `AIchatbot/datasets` directory (or any directory), run:

```
python generate_datasets.py --out . --num_per_role 500 --seed 42
```

2) Outputs:
- `parents_questions.jsonl` and `students_questions.jsonl` with fields: `role`, `intent`, `text`
- `parents_questions.txt` and `students_questions.txt` with each question on a new line in quotes

Notes

- The generator uses combinatorial templates and sampling to produce variety.
- You can change `--num_per_role` to produce more or fewer examples.
- Only Python standard library is used; no extra dependencies required.
- Intents covered for Parents: meeting schedule, fee status, academic performance, upcoming events, holidays.
- Intents covered for Students: semester start, outstanding fees, upcoming events.








