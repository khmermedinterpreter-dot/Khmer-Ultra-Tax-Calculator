# scripts/update_borey.py
"""Utility script to add, update, or delete Borey entries in a province TypeScript file.

Usage examples:
  python scripts/update_borey.py add data/provinces/phnom-penh.ts '{"developer":"Borey X","project":"Proj X","province":"រាជធានីភ្នំពេញ","district":"ខណ្ឌសែនសុខ","locationNote":"Note","marketValue":500,"baseValue":150}'
  python scripts/update_borey.py update data/provinces/phnom-penh.ts '{"project":"Proj X","district":"ខណ្ឌសែនសុខ","marketValue":600}'
  python scripts/update_borey.py delete data/provinces/phmon-penh.ts '{"project":"Proj X","district":"ខណ្ឌសែនសុខ"}'

The script parses the existing `boreys: [ ... ]` array, manipulates it according to the
command, and writes the file back preserving the original formatting as much as possible.
"""

import sys
import json
import re
from pathlib import Path

def load_ts_file(ts_path: Path) -> str:
    return ts_path.read_text(encoding="utf-8")

def save_ts_file(ts_path: Path, content: str) -> None:
    ts_path.write_text(content, encoding="utf-8")

def extract_borey_array(ts_content: str) -> tuple[str, int, int]:
    """Return the raw array string and its start/end indices within the file.
    The returned array string is the text between the opening '[' and the matching ']'.
    """
    # Find the start of "boreys:" followed by optional whitespace and '['
    match = re.search(r"boreys\s*:\s*\[", ts_content)
    if not match:
        raise ValueError("Could not locate 'boreys:[' in the provided file.")
    start_idx = match.end()  # position after the '['
    # Now find the matching closing ']' that terminates the array. We'll count brackets.
    bracket_count = 1
    i = start_idx
    while i < len(ts_content) and bracket_count > 0:
        if ts_content[i] == "[":
            bracket_count += 1
        elif ts_content[i] == "]":
            bracket_count -= 1
        i += 1
    end_idx = i - 1  # index of the closing ']'
    array_str = ts_content[start_idx:end_idx]
    return array_str, start_idx, end_idx

def parse_borey_array(array_str: str) -> list[dict]:
    # The TypeScript objects use double quotes for keys and string values, which is valid JSON.
    # However, trailing commas are allowed in TS. Remove them before JSON parsing.
    cleaned = re.sub(r",\s*}\s*,?", "},", array_str)  # ensure commas between objects
    # Wrap the whole thing with brackets to make it a valid JSON array.
    json_str = f"[{cleaned}]"
    # Remove any trailing commas before the closing bracket.
    json_str = re.sub(r",\s*]", "]", json_str)
    return json.loads(json_str)

def serialize_borey_array(boreys: list[dict]) -> str:
    # Produce a nicely indented TS representation (2 spaces) and keep a trailing comma after each object.
    lines = []
    for b in boreys:
        obj = json.dumps(b, ensure_ascii=False, indent=2)
        # json.dumps gives an object with braces on separate lines; we need to adjust indentation.
        # We'll indent each line by 4 spaces (matching the surrounding file style).
        indented = "    " + obj.replace("\n", "\n    ")
        # Ensure a trailing comma after each object (except maybe the last – TS allows it).
        indented = indented.rstrip()
        if not indented.endswith(","):
            indented += ","
        lines.append(indented)
    return "\n".join(lines)

def add_or_update(boreys: list[dict], new_entry: dict) -> list[dict]:
    # Identify by unique combination of project, province, and district.
    key = (new_entry.get("project"), new_entry.get("province"), new_entry.get("district"))
    for i, b in enumerate(boreys):
        if (b.get("project"), b.get("province"), b.get("district")) == key:
            boreys[i] = new_entry
            break
    else:
        boreys.append(new_entry)
    return boreys

def delete(boreys: list[dict], criteria: dict) -> list[dict]:
    project = criteria.get("project")
    district = criteria.get("district")
    province = criteria.get("province")
    boreys = [b for b in boreys if not (
        b.get("project") == project and
        b.get("district") == district and
        (province is None or b.get("province") == province)
    )]
    return boreys

def main():
    if len(sys.argv) < 4:
        print("Usage: python scripts/update_borey.py <add|update|delete> <ts_file> <json_payload>")
        sys.exit(1)
    action = sys.argv[1]
    ts_path = Path(sys.argv[2])
    payload = json.loads(sys.argv[3])

    content = load_ts_file(ts_path)
    array_str, start, end = extract_borey_array(content)
    boreys = parse_borey_array(array_str)

    if action == "add" or action == "update":
        boreys = add_or_update(boreys, payload)
    elif action == "delete":
        boreys = delete(boreys, payload)
    else:
        print(f"Unsupported action: {action}")
        sys.exit(1)

    new_array_text = serialize_borey_array(boreys)
    # Reconstruct the file content with the new array.
    new_content = content[:start] + "\n" + new_array_text + "\n" + content[end:]
    save_ts_file(ts_path, new_content)
    print(f"Successfully performed {action} on {ts_path.name}")

if __name__ == "__main__":
    main()
