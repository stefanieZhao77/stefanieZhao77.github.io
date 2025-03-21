#!/bin/bash

# Define output file
OUTPUT_FILE="../../../_pages/gallery.md"

# Write front matter
cat > "$OUTPUT_FILE" << EOL
---
layout: page
permalink: /gallery/
title: Gallery
description: Some of the photos I took during my travels.
images:
    spotlight: true
nav: true
nav_order: 4
---

<style>
.spotlight-group img {
    max-width: 300px;
    max-height: 300px;
    object-fit: cover;
    margin: 10px;
}
</style>


EOL

# Find all image files (jpg, jpeg, png) in the current directory
images=(*.jpg *.jpeg *.png)
count=0
group=0

# Generate HTML content and append to file
for img in "${images[@]}"; do
    # Skip if no images found
    [[ -e "$img" ]] || continue
    
    # Start a new group for every 3 images
    if (( count % 3 == 0 )); then
        ((group++))
        echo "<!-- Group $group -->" >> "$OUTPUT_FILE"
        echo "<div class=\"spotlight-group\" data-fit>" >> "$OUTPUT_FILE"
    fi
    
    # Generate image entry
    echo "    <a class=\"spotlight\" href=\"/assets/img/gallery/$img\">" >> "$OUTPUT_FILE"
    echo "        <img src=\"/assets/img/gallery/$img\" />" >> "$OUTPUT_FILE"
    echo "    </a>" >> "$OUTPUT_FILE"
    
    ((count++))
    
    # Close the group after 3 images
    if (( count % 3 == 0 )); then
        echo "</div>" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

# Close the last group if it's not complete
if (( count % 3 != 0 )); then
    echo "</div>" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
fi

