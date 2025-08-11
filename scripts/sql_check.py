import sqlite3
from pathlib import Path
import sys

DB_PATH = Path(__file__).resolve().parent.parent / "database" / "db.sqlite"

def main():
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM tickets")
        (count,) = cur.fetchone()
        print(f"OK: tickets count = {count}")

        try:
            cur.execute("SELECT NON_EXISTENT_COLUMN FROM tickets LIMIT 1")
            cur.fetchone()
        except sqlite3.OperationalError as e:
            print(f"ERROR (OperationalError): {e}")
            sys.exit(2)

    except sqlite3.Error as e:
        print(f"DB ERROR: {e}")
        sys.exit(1)
    finally:
        try: conn.close()
        except: pass

if __name__ == "__main__":
    main()
