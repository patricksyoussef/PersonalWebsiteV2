"""
Entropy-based cropping and optimization for 'feature_' images in src/content.

- Recursively finds images prefixed with feature_*
- Crops to 3:1 aspect ratio using entropy-based crop (manual sliding window)
- Compresses and optimizes images for web
- Saves as [original_name]_crop.[ext] next to original
- Preserves original format but optimizes file size

Dependencies:
    pip install pillow numpy scipy
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ASPECT_RATIO = 3.5  # width / height
SEARCH_ROOT = Path(__file__).parent.parent / "src" / "content"
SLIDE_STEP = 0.02  # Fraction of image size. Smaller is slower but more accurate.

# Scoring weights for composite region evaluation
ENTROPY_WEIGHT = 0.2      # Information content
EDGE_WEIGHT = 0.4         # Structure/object boundaries
CENTER_BIAS_WEIGHT = 0.4  # Preference for center regions


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


def edge_strength(im_crop):
    """
    Compute edge strength using Sobel operator.

    Args:
        im_crop: np.ndarray of shape (h, w) for grayscale or (h, w, c) for color.
    Returns:
        float: normalized edge strength
    """
    if im_crop.ndim == 3:
        # Convert to grayscale for edge detection
        gray = np.dot(im_crop[...,:3], [0.2989, 0.5870, 0.1140])
    else:
        gray = im_crop

    # Sobel edge detection
    sobel_x = ndimage.sobel(gray, axis=1)
    sobel_y = ndimage.sobel(gray, axis=0)
    edge_magnitude = np.sqrt(sobel_x**2 + sobel_y**2)

    return np.mean(edge_magnitude)


def center_bias_weight(crop_box, img_width, img_height):
    """
    Calculate center bias weight - regions closer to center get higher scores.

    Args:
        crop_box: (left, top, right, bottom)
        img_width, img_height: original image dimensions
    Returns:
        float: center bias weight (0-1, where 1 is center)
    """
    left, top, right, bottom = crop_box
    crop_center_x = (left + right) / 2
    crop_center_y = (top + bottom) / 2

    img_center_x = img_width / 2
    img_center_y = img_height / 2

    # Calculate distance from center as fraction of image size
    max_distance = np.sqrt((img_width/2)**2 + (img_height/2)**2)
    distance = np.sqrt((crop_center_x - img_center_x)**2 + (crop_center_y - img_center_y)**2)

    # Convert to weight (closer to center = higher weight)
    return 1 - (distance / max_distance)


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


def composite_score(im_crop, crop_box, img_width, img_height):
    """
    Calculate composite score combining entropy, edge strength, and center bias.

    Args:
        im_crop: numpy array of cropped region
        crop_box: (left, top, right, bottom)
        img_width, img_height: original image dimensions
    Returns:
        float: composite score
    """
    entropy = image_entropy(im_crop)
    edges = edge_strength(im_crop)
    center_bias = center_bias_weight(crop_box, img_width, img_height)

    # Normalize entropy (typical range 0-8)
    entropy_norm = min(entropy / 8.0, 1.0)

    # Normalize edge strength (empirically determined range)
    edge_norm = min(edges / 50.0, 1.0)

    score = (ENTROPY_WEIGHT * entropy_norm +
             EDGE_WEIGHT * edge_norm +
             CENTER_BIAS_WEIGHT * center_bias)

    return score


def entropy_crop_to_aspect(im, aspect_ratio, step=SLIDE_STEP, debug=False):
    """
    Crops the largest region at given aspect ratio using composite scoring.
    Combines entropy, edge detection, and center bias for better region selection.

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
            score = composite_score(crop_arr, crop_box, w_img, h_img)
            regions.append((score, crop_box))
            if debug:
                print(f"Horizontal window top={top}: score={score:.4f}")

    # Vertical crop: fix height, slide window horizontally
    if crop_w2 <= w_img:
        win_w, win_h = crop_w2, h_img
        max_col = w_img - win_w
        for left in range(0, max_col + 1, max(1, int(step * w_img))):
            crop_box = (left, 0, left + win_w, h_img)
            crop_arr = im_arr[:, left:left + win_w, ...]
            score = composite_score(crop_arr, crop_box, w_img, h_img)
            regions.append((score, crop_box))
            if debug:
                print(f"Vertical window left={left}: score={score:.4f}")

    if not regions:
        raise ValueError("Image is too small for desired aspect ratio crop.")

    # Select the window with the highest composite score
    best_score, best_crop = max(regions, key=lambda x: x[0])
    if debug:
        print(f"Best crop: {best_crop}, score={best_score:.4f}")
    return im.crop(best_crop)


def optimize_image(im, format_type):
    """Optimize image based on format type."""
    # Only resize if extremely large (max width 3500px for feature images)
    # This preserves quality for high-DPI displays and detailed images
    if im.width > 3500:
        ratio = 3500 / im.width
        new_height = int(im.height * ratio)
        im = im.resize((3500, new_height), Image.Resampling.LANCZOS)

    return im


def get_save_options(format_type, file_size_kb):
    """Get optimal save options based on format and current file size."""
    if format_type == 'JPEG':
        # Much more conservative quality settings to preserve image quality
        # Only compress heavily if file is extremely large
        if file_size_kb > 2000:  # 2MB+
            quality = 90
        elif file_size_kb > 1000:  # 1-2MB
            quality = 95
        else:
            # For files under 1MB, use maximum quality
            quality = 98

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
