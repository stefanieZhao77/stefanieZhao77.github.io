import os
import yaml

gallery_folder = os.path.join('assets', 'img', 'gallery')
output_file = os.path.join('_data', 'gallery.yml')

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

# Generate YAML content
yaml_content = {'images': images}

# Write to gallery.yml
with open(output_file, 'w') as f:
    yaml.dump(yaml_content, f, default_flow_style=False)

print(f"{output_file} generated successfully!")