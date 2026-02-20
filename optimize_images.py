import os
from PIL import Image
import glob

# Directory containing images
image_dir = r"c:\Users\T Harish\Desktop\Syam-Infra\assets\images"

# Target size in bytes (1MB)
target_size = 1 * 1024 * 1024

def optimize_images():
    # Find all PNGs and JPGs
    search_patterns = [
        os.path.join(image_dir, "*.png"),
        os.path.join(image_dir, "*.jpg"),
        os.path.join(image_dir, "*.jpeg")
    ]
    
    image_files = []
    for pattern in search_patterns:
        image_files.extend(glob.glob(pattern))
        
    for img_path in image_files:
        try:
            file_size = os.path.getsize(img_path)
            
            # If larger than 1MB
            if file_size > target_size:
                print(f"Optimizing: {os.path.basename(img_path)} ({file_size / (1024*1024):.2f} MB)")
                
                with Image.open(img_path) as img:
                    # Convert to RGB if necessary (e.g. for RGBA PNGs being saved as JPEG/WebP)
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    
                    # Resize if extremely large (e.g., width > 1920)
                    max_width = 1920
                    if img.width > max_width:
                        ratio = max_width / img.width
                        new_size = (max_width, int(img.height * ratio))
                        img = img.resize(new_size, Image.Resampling.LANCZOS)
                    
                    # Save back over the original file (we will use JPEG with quality 80 to drastically cut size)
                    # We have to keep the original extension so the HTML doesn't break, 
                    # but we can save it as an optimized format.
                    # Wait, saving a JPEG as .png is bad practice. We will stick to the format but heavily optimize.
                    
                    if img_path.lower().endswith('.png'):
                        # PNGs are often huge if they have unnecessary detail. 
                        # We will convert massive PNGs to JPEGs and update the HTML later, OR just save as highly optimized PNG.
                        # For safety, let's just resize and save with optimize=True
                        img.save(img_path, optimize=True)
                    else:
                        img.save(img_path, optimize=True, quality=80)
                        
                # Check new size
                new_file_size = os.path.getsize(img_path)
                print(f" -> New size: {new_file_size / (1024*1024):.2f} MB")
                
        except Exception as e:
            print(f"Failed to process {os.path.basename(img_path)}: {e}")

if __name__ == "__main__":
    optimize_images()
