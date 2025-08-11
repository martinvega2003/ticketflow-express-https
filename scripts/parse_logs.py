"""
Simple summary:
- Counts occurrences by returned code (200, 000, 500, etc.)
- Prints totals, success percentage (200) and top codes
- Writes a readable summary to logs/health_summary.txt
"""

from pathlib import Path
import re
from collections import Counter
from datetime import datetime

# Path to the input log file (assumes health.log lives in the project root)
LOG_FILE = Path.cwd() / "health.log"
# Directory where we will write the human-readable summary
OUT_DIR = Path.cwd() / "logs"
# Full path to the summary file we will generate
OUT_FILE = OUT_DIR / "health_summary.txt"

# Regular expression to capture the token after the word "returned"
# NOTE: this currently captures the first non-whitespace token after "returned".
# Example match: "returned 200" -> "200"; but if the line is "returned body200"
# it'll capture "body200" (so the log format matters).
CODE_RE = re.compile(r"returned\s+(\S+)", re.IGNORECASE)


def parse_log(path: Path):
    """
    Read the log file line-by-line and build a summary dict:
    - total: total number of parsed entries
    - counts: Counter mapping 'code' -> occurrences
    - first_ts / last_ts: earliest and latest ISO timestamps parsed from lines
    """
    counts = Counter()     # counter for codes
    total = 0              # total lines processed
    first_ts = None        # earliest timestamp found
    last_ts = None         # latest timestamp found

    # If the log doesn't exist, print a helpful message and return None
    if not path.exists():
        print(f"{path} not found. Make sure to first run health_check.py.")
        return None

    # Open the log and iterate lines
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()   # remove leading/trailing whitespace/newlines
            if not line:
                continue         # skip empty lines
            total += 1

            # Try to extract a "code" using the regex (first token after "returned")
            m = CODE_RE.search(line)
            if m:
                code = m.group(1)
            else:
                code = "UNKNOWN"
            counts[code] += 1

            # Try to parse an ISO timestamp at the start of the line.
            # Expected format (example): "2025-08-06T12:53:07.831359 — https://..."
            # Split on the em-dash "—" and try to parse the left part as ISO datetime.
            try:
                ts_part = line.split("—", 1)[0].strip()
                ts = datetime.fromisoformat(ts_part)
                # maintain first and last timestamps seen
                if first_ts is None or ts < first_ts:
                    first_ts = ts
                if last_ts is None or ts > last_ts:
                    last_ts = ts
            except Exception:
                # If parsing fails (line doesn't start with ISO ts), ignore and continue
                pass

    # Return a summary dictionary for further processing
    return {"total": total, "counts": counts, "first_ts": first_ts, "last_ts": last_ts}


def pretty_print(summary):
    """
    Nicely print the summary to stdout:
    - total entries, time range
    - each code with count and percentage
    - a simple 'Success (200)' metric
    """
    total = summary["total"]
    counts = summary["counts"]
    first = summary["first_ts"]
    last = summary["last_ts"]

    print("=== Health log summary ===")
    print(f"File: {LOG_FILE}")
    print(f"Entries: {total}")
    if first:
        # If we found timestamps, print the range
        print(f"From: {first.isoformat()}  To: {last.isoformat()}")
    print()

    # Print codes in descending frequency order
    for code, c in counts.most_common():
        # percent of total for this code; guard divide-by-zero
        pct = (c / total * 100) if total > 0 else 0
        # right-align the code, show count and percent with one decimal
        print(f"{code:>7} : {c:5d}  ({pct:5.1f}%)")

    # Compute a simple "success" metric using code "200"
    ok = counts.get("200", 0)
    ok_pct = (ok / total * 100) if total > 0 else 0
    print()
    print(f"Success (200): {ok} / {total} ({ok_pct:.1f}%)")
    print("==========================")


def write_summary(summary):
    """
    Write a human-readable summary file under logs/health_summary.txt.
    - Creates the logs directory if necessary
    - Writes the same data shown on stdout to a file
    """
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with OUT_FILE.open("w", encoding="utf-8") as f:
        f.write(f"Health summary generated: {datetime.now().isoformat()}\n")
        f.write(f"Source: {LOG_FILE}\n")
        f.write(f"Entries: {summary['total']}\n")
        if summary['first_ts']:
            f.write(f"From: {summary['first_ts'].isoformat()}  To: {summary['last_ts'].isoformat()}\n")
        f.write("\nCounts:\n")
        for code, c in summary['counts'].most_common():
            pct = (c / summary['total'] * 100) if summary['total'] > 0 else 0
            f.write(f"{code:>7} : {c:5d}  ({pct:5.1f}%)\n")
        f.write("\n")

    # Inform the user where the file was written
    print(f"Summary written in: {OUT_FILE}")


def main(write_out=True):
    """
    Main entry: parse the log, print to console and optionally write the summary file.
    """
    summary = parse_log(LOG_FILE)
    if summary is None:
        return
    pretty_print(summary)
    if write_out:
        write_summary(summary)


if __name__ == "__main__":
    # If executed as a script, run main and write the summary by default
    main(write_out=True)
