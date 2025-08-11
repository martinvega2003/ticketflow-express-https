import subprocess
from datetime import datetime
from pathlib import Path

LOG_FILE = Path(__file__).parent.parent / "health.log" # Route to the health log file
URL = "https://localhost:3443/" # URL to check

def main():
    # 1) Launch curl with --insecure to ignore self-signed
    try:
        result = subprocess.run( # Execute curl command
            ["curl", "--insecure", "--silent", "--write-out", "\n%{http_code}", URL], # --silent to suppress progress meter
            capture_output=True, # Capture output
            text=True, # Return output as string
            timeout=5 # Timeout after 5 seconds
        )
        
        # Separa body y code by the last line break
        body, code = result.stdout.rsplit("\n", 1)
        status = code.strip()
    except Exception as e:
        status = f"ERROR: {e}"

    # 2) Register timestamp and code in health.log
    now = datetime.now().isoformat()
    entry = f"{now} — {URL} returned {status}\n" # \n for new line
    
    # Append to the log instead of overwriting
    with LOG_FILE.open('a', encoding="utf-8") as f:
        f.write(entry) # Write the entry to the log file
    
    print(f"✅ Health-check logged: {entry.strip()}")

if __name__ == "__main__":
    main()
