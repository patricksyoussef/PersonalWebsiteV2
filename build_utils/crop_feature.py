"""
Entropy-based cropping and optimization for 'feature_' images in src/content.

- Recursively finds images prefixed with feature_*
- Crops to 3:1 aspect ratio using entropy-based crop (manual sliding window)
- Compresses and optimizes images for web
- Saves as [original_name]_crop.[ext] next to original
- Preserves original format but optimizes file size

Dependencies:
    pip install pillow numpy
"""

from pathlib import Path

import numpy as np
from PIL import Image

ASPECT_RATIO = 3  # width / height
SEARCH_ROOT = Path(__file__).parent.parent / "src" / "content"
SLIDE_STEP = 0.02  # Fraction of image size. Smaller is slower but more accurate.


def get_feature_images(root):
    for file_path in root.rglob('feature_*.*'):
        if "crop" in str(file_path):
            continue
        if file_path.is_file():
            yield file_path


def shannon_entropy(data):
    """Compute entropy of a 1D np array of pixel values."""
    if data.size == 0:
        return 0
    histogram, _ = np.histogram(data, bins=256, range=(0, 255), density=True)
    # Remove 0 values for log calculation
    histogram = histogram[histogram > 0]
    entropy = -np.sum(histogram * np.log2(histogram))
    return entropy


def image_entropy(im_crop):
    """
    Compute the mean entropy over all channels of an image crop (numpy array).

    Args:
        im_crop: np.ndarray of shape (h, w) for grayscale or (h, w, c) for color.
    Returns:
        float: entropy value
    """
    if im_crop.ndim == 2:
        # Grayscale
        return shannon_entropy(im_crop)
    elif im_crop.ndim == 3:
        # Color: mean entropy over channels
        return np.mean([shannon_entropy(im_crop[..., ch]) for ch in range(im_crop.shape[2])])
    else:
        return 0.


def entropy_crop_to_aspect(im, aspect_ratio, step=SLIDE_STEP, debug=False):
    """
    Crops the largest region at given aspect ratio and highest entropy using a sliding window.

    Args:
        im: PIL.Image
        aspect_ratio: float (width/height)
        step: slide step as fraction of image dims (0.05 = 5%)
    Returns:
        PIL.Image, crop tuple (left, top, right, bottom)
    """
    im_arr = np.array(im)
    h_img, w_img = im_arr.shape[0], im_arr.shape[1]

    # Decide which dimension is limiting
    crop_h1 = int(w_img / aspect_ratio)
    crop_w2 = int(h_img * aspect_ratio)
    regions = []

    # Horizontal crop: fix width, slide window vertically
    if crop_h1 <= h_img:
        win_w, win_h = w_img, crop_h1
        max_row = h_img - win_h
        for top in range(0, max_row + 1, max(1, int(step * h_img))):
            crop_box = (0, top, w_img, top + win_h)
            crop_arr = im_arr[top:top + win_h, :, ...]
            entropy = image_entropy(crop_arr)
            regions.append((entropy, crop_box))
            if debug:
                print(f"Horizontal window top={top}: entropy={entropy:.4f}")

    # Vertical crop: fix height, slide window horizontally
    if crop_w2 <= w_img:
        win_w, win_h = crop_w2, h_img
        max_col = w_img - win_w
        for left in range(0, max_col + 1, max(1, int(step * w_img))):
            crop_box = (left, 0, left + win_w, h_img)
            crop_arr = im_arr[:, left:left + win_w, ...]
            entropy = image_entropy(crop_arr)
            regions.append((entropy, crop_box))
            if debug:
                print(f"Vertical window left={left}: entropy={entropy:.4f}")

    if not regions:
        raise ValueError("Image is too small for desired aspect ratio crop.")

    # Select the window with the highest entropy
    best_entropy, best_crop = max(regions, key=lambda x: x[0])
    if debug:
        print(f"Best crop: {best_crop}, entropy={best_entropy:.4f}")
    return im.crop(best_crop)


def optimize_image(im, format_type):
    """Optimize image based on format type."""
    # Only resize if extremely large (max width 2000px for feature images)
    # This preserves quality for high-DPI displays while preventing massive files
    if im.width > 2000:
        ratio = 2000 / im.width
        new_height = int(im.height * ratio)
        im = im.resize((2000, new_height), Image.Resampling.LANCZOS)
    
    return im


def get_save_options(format_type, file_size_kb):
    """Get optimal save options based on format and current file size."""
    if format_type == 'JPEG':
        # Less aggressive quality settings for better visual quality
        if file_size_kb > 1000:
            quality = 85
        elif file_size_kb > 500:
            quality = 90
        else:
            quality = 95
            
        return {
            'format': 'JPEG',
            'quality': quality,
            'optimize': True,
            'progressive': True
        }
    elif format_type == 'PNG':
        return {
            'format': 'PNG',
            'optimize': True,
            'compress_level': 6
        }
    elif format_type == 'WEBP':
        return {
            'format': 'WEBP',
            'quality': 85,
            'optimize': True
        }
    else:
        return {'format': format_type, 'optimize': True}


def process_image(im_path):
    out_path = im_path.with_name(f"{im_path.stem}_crop{im_path.suffix}")
    
    # Get original file size for comparison
    original_size_kb = im_path.stat().st_size / 1024
    
    if out_path.exists():
        print(f"Overwriting {im_path.name}: cropped variant already exists.")
    
    try:
        with Image.open(im_path) as im:
            if im.mode not in ['RGB', 'L']:
                im = im.convert('RGB')
            
            # Crop using entropy-based method
            cropped = entropy_crop_to_aspect(im, ASPECT_RATIO)
            
            # Optimize the cropped image
            optimized = optimize_image(cropped, im.format)
            
            # Get save options based on format and size
            save_options = get_save_options(im.format, original_size_kb)
            
            # Save optimized image
            optimized.save(out_path, **save_options)
            
            # Calculate compression ratio
            new_size_kb = out_path.stat().st_size / 1024
            compression_ratio = (original_size_kb - new_size_kb) / original_size_kb * 100
            
            print(f"Processed: {im_path.name}")
            print(f"  Original: {original_size_kb:.1f}KB -> Optimized: {new_size_kb:.1f}KB")
            print(f"  Compression: {compression_ratio:.1f}%")
            
    except Exception as e:
        print(f"Error processing {im_path}: {e}")


def main():
    print(f"Scanning for feature_ images in {SEARCH_ROOT} ...")
    feature_images = list(get_feature_images(SEARCH_ROOT))
    if not feature_images:
        print("No feature_ images found.")
        return
    for img in feature_images:
        process_image(img)


if __name__ == "__main__":
    main()
