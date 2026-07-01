import os
from pathlib import Path


def load_env_file() -> None:
     env_path = Path(__file__).with_name(".env")
     if not env_path.exists():
          return

     for line in env_path.read_text().splitlines():
          line = line.strip()
          if not line or line.startswith("#") or "=" not in line:
               continue

          key, value = line.split("=", 1)
          os.environ.setdefault(key.strip(), value.strip())


load_env_file()

DB_CONNECTION_STRING = os.getenv("DB_CONNECTION_STRING")

if not DB_CONNECTION_STRING:
     raise RuntimeError("DB_CONNECTION_STRING is missing. Add it to your .env file.")
