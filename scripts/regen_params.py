import json
from pathlib import Path

# Routes
ROOT = Path(__file__).parent.parent # Route to the root of the project

# Files
CONFIG_IN = ROOT / "config.json" # Input configuration file
PARAM_OUT = ROOT / "generated_params.json" # Output parameters file

def main():
    # 1) Read config.json
    config = json.loads(CONFIG_IN.read_text(encoding="utf-8"))

    # 2) Transform it into “parameters”
    params = {
        "serverPort": config["port"],
        "tlsKey": str(ROOT / config["tls"]["keyPath"]),
        "tlsCert": str(ROOT / config["tls"]["certPath"]),
        "oauthRedirect": config["oauth"]["callbackURL"]
    }

    # 3) Write generated_params.json
    PARAM_OUT.write_text(json.dumps(params, indent=2), encoding="utf-8")
    print(f"✅ Parameters regenerated in {PARAM_OUT}")

if __name__ == "__main__":
    main()
