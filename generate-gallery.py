import os
import json

gallery_folder = os.path.join('assets', 'img', 'gallery')
output_file = os.path.join('assets', 'data', 'images.json')

# Read the gallery folder
try:
    files = os.listdir(gallery_folder)
except FileNotFoundError:
    print(f"Error: Folder '{gallery_folder}' not found.")
    exit(1)

# Filter image files
image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
images = [
    file for file in files
    if any(file.lower().endswith(ext) for ext in image_extensions)
]

# Generate JSON content
json_content = {"images": images}

# Write to images.json
with open(output_file, 'w') as f:
    json.dump(json_content, f, indent=2)  # Use json.dump for valid JSON

print(f"{output_file} generated successfully!")