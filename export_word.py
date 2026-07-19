# export_word.py
import subprocess
import os

md_path = r"c:\Users\mthom\OneDrive\Documents\Second Brain\Autobiography\Am_I_The_Bad_Guy_Master_Draft.md"
docx_path = r"c:\Users\mthom\OneDrive\Documents\Second Brain\Autobiography\Am_I_The_Bad_Guy_Master_Draft.docx"
pandoc_path = r"C:\Users\mthom\AppData\Local\Pandoc\pandoc.exe"

print("Compiling manuscript via Pandoc...")
if not os.path.exists(pandoc_path):
    print(f"Error: Pandoc not found at expected path: {pandoc_path}")
    print("Please verify the Pandoc installation.")
    exit(1)

# Execute the compilation command with dynamic table of contents (--toc)
cmd = f'"{pandoc_path}" "{md_path}" -o "{docx_path}" --toc'
print(f"Running command: {cmd}")
result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

if result.returncode == 0:
    print(f"Success! Compiled Word document at: {docx_path}")
    print(f"Size of compiled document: {os.path.getsize(docx_path)} bytes")
else:
    print("Error during Pandoc compilation:")
    print(result.stderr)
