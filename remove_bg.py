from PIL import Image
import os

# Open the image
img_path = 'frontend/public/image.png'
img = Image.open(img_path)

# Convert to RGBA if not already
img = img.convert('RGBA')

# Get image data
data = img.getdata()

# Create new image data with transparent background
new_data = []
for item in data:
    # If pixel is white or very light (background), make it transparent
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        new_data.append((255, 255, 255, 0))  # Transparent
    else:
        new_data.append(item)

# Update image
img.putdata(new_data)

# Save the image
img.save(img_path)
print(f"Background removed and saved to {img_path}")
