import re

file_path = r"c:\Users\mthom\OneDrive\Documents\Second Brain\Autobiography\The_Improbability_of_Me_Master_Draft.md"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

chap_idx = 1
for i, line in enumerate(lines):
    if line.startswith("# Chapter "):
        colon_idx = line.find(":")
        if colon_idx != -1:
            title = line[colon_idx:]
            lines[i] = f"# Chapter {chap_idx}{title}"
            chap_idx += 1

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(lines)
